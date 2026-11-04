---
title: ASP.NET Core implementation
description: Apply Serilog to an Order Management API with request and business events.
---

# ASP.NET Core implementation

This example uses standard hosting integration. Install compatible versions of `Serilog.AspNetCore`, `Serilog.Settings.Configuration`, `Serilog.Sinks.Console`, `Serilog.Sinks.File`, `Serilog.Sinks.MSSqlServer`, `Serilog.Enrichers.Environment`, and optionally `Serilog.Enrichers.Thread`. Match `Serilog.AspNetCore` to the ASP.NET Core major version. SQL configuration is in code to make SQL options visible.

```csharp
using System.Collections.ObjectModel;
using System.Data;
using System.Diagnostics;
using Serilog;
using Serilog.Context;
using Serilog.Events;
using Serilog.Sinks.MSSqlServer;

var builder = WebApplication.CreateBuilder(args);
var sqlConnection = builder.Configuration.GetConnectionString("LogDatabase");

var columns = new ColumnOptions();
columns.Store.Remove(StandardColumn.Properties);
columns.Store.Add(StandardColumn.LogEvent);
columns.Store.Add(StandardColumn.TraceId);
columns.Store.Add(StandardColumn.SpanId);
columns.AdditionalColumns = new Collection<SqlColumn>
{
    new() { ColumnName = "OrderId", DataType = SqlDbType.BigInt, AllowNull = true,
        NonClusteredIndex = true },
    new() { ColumnName = "OperationName", DataType = SqlDbType.NVarChar,
        DataLength = 64, AllowNull = true }
};
var sqlOptions = new MSSqlServerSinkOptions
{
    TableName = "Logs", SchemaName = "dbo", AutoCreateSqlTable = false,
    BatchPostingLimit = 100, BatchPeriod = TimeSpan.FromSeconds(5)
};

builder.Host.UseSerilog((context, services, config) => config
    .ReadFrom.Configuration(context.Configuration)
    .ReadFrom.Services(services)
    .Enrich.FromLogContext()
    .Enrich.WithProperty("Application", "Orders.Api")
    .Enrich.WithEnvironmentName()
    .Enrich.WithMachineName()
    .MinimumLevel.Override("Microsoft", LogEventLevel.Warning)
    .MinimumLevel.Override("Microsoft.AspNetCore", LogEventLevel.Warning)
    .MinimumLevel.Override("Microsoft.EntityFrameworkCore.Database.Command", LogEventLevel.Warning)
    .WriteTo.Console(restrictedToMinimumLevel: LogEventLevel.Debug)
    .WriteTo.File("logs/orders-.log", rollingInterval: RollingInterval.Day,
        retainedFileCountLimit: 14,
        restrictedToMinimumLevel: LogEventLevel.Information)
    .WriteTo.MSSqlServer(
        connectionString: sqlConnection!, sinkOptions: sqlOptions,
        columnOptions: columns,
        restrictedToMinimumLevel: LogEventLevel.Warning));

builder.Services.AddControllers();
builder.Services.AddScoped<IOrderService, OrderService>();
var app = builder.Build();

app.Use(async (context, next) =>
{
    using (LogContext.PushProperty("RequestId", context.TraceIdentifier))
    using (LogContext.PushProperty("TraceId", Activity.Current?.TraceId.ToString()))
        await next();
});

app.UseSerilogRequestLogging(options =>
{
    options.MessageTemplate = "HTTP {RequestMethod} {RequestPath} responded {StatusCode} in {Elapsed:0.0000} ms";
    options.GetLevel = (http, elapsed, exception) => exception is not null || http.Response.StatusCode >= 500
        ? LogEventLevel.Error
        : http.Response.StatusCode >= 400 ? LogEventLevel.Warning : LogEventLevel.Information;
});

app.MapControllers();
try
{
    Log.Information("Starting Orders API");
    await app.RunAsync();
}
catch (Exception ex)
{
    Log.Fatal(ex, "Orders API terminated unexpectedly");
    throw;
}
finally
{
    await Log.CloseAndFlushAsync();
}

public sealed class OrderService : IOrderService
{
    private readonly ILogger<OrderService> _logger;
    private readonly IOrderRepository _repository;
    public OrderService(ILogger<OrderService> logger, IOrderRepository repository)
        => (_logger, _repository) = (logger, repository);

    public async Task<Order> CreateAsync(CreateOrder request, string userId, CancellationToken ct)
    {
        if (request.Items.Count == 0)
        {
            _logger.LogWarning("Order validation failed: no items for user {UserId}", userId);
            throw new OrderValidationException("At least one item is required.");
        }
        var order = Order.From(request, userId);
        _logger.LogInformation("Creating order {OrderId} for user {UserId} during {OperationName}", order.Id, userId, "CreateOrder");
        try
        {
            await _repository.InsertAsync(order, ct);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Database operation failed for order {OrderId}", order.Id);
            throw;
        }
        _logger.LogInformation("Order {OrderId} created successfully during {OperationName}", order.Id, "CreateOrder");
        return order;
    }
}
```

`IOrderService`, `IOrderRepository`, `Order`, `CreateOrder`, and `OrderValidationException` are application contracts omitted for brevity, so this is a focused integration sample rather than a standalone compiling project. Avoid logging the same failure both in the service and exception boundary; choose one owner or ensure lower-level context is distinct. Apply the data classification policy to `UserId`. Authentication events must not include credentials or tokens. The SQL connection should come from a secret provider.

`ReadFrom.Configuration()` can load common levels and sink settings from appsettings; the code configures SQL and enrichers. `CloseAndFlushAsync()` exists in modern Serilog versions; use the shutdown API provided by the chosen version. Validate host lifecycle for the installed `Serilog.AspNetCore` and sink versions.

| Scenario | Useful event data | Likely destinations |
|---|---|---|
| Incoming HTTP request | Method, path, status, elapsed, TraceId | Console/file; SQL per volume and policy |
| Authentication | Outcome, safe subject ID, reason category | Security event store; no token/password |
| Create order | OrderId, operation, outcome | Sinks above their thresholds |
| Database operation | Exception and order/dependency context | Warning/Error destinations |
| Validation failure | Stable reason and request context | Console/file; level reflects business meaning |
| Unhandled exception | Exception at owning boundary | Error and higher destinations |
| Successful request | Completion status and latency | Request sink; consider health-check noise |

In this configuration console can accept Debug only when upstream thresholds allow it; file accepts Information and above; SQL accepts Warning and above. Sink minima never bypass the logger minimum.



## Authentication, validation, and persistence boundary

Configure the application's normal authentication scheme and authorization policy before mapping protected controllers. The Serilog integration does not validate tokens. The controller can log a safe subject identifier from the authenticated principal and let middleware handle invalid credentials without ever recording the credential itself.

```csharp
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/orders")]
[Authorize]
public sealed class OrdersController : ControllerBase
{
    private readonly IOrderService _orders;
    public OrdersController(IOrderService orders) => _orders = orders;

    [HttpPost]
    public async Task<ActionResult<OrderResponse>> Create(CreateOrder request, CancellationToken ct)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "unknown";
        var order = await _orders.CreateAsync(request, userId, ct);
        return Created($"/api/orders/{order.Id}", new OrderResponse(order.Id));
    }
}

public sealed record CreateOrder(IReadOnlyList<OrderLine> Items);
public sealed record OrderLine(string Sku, int Quantity);
public sealed record OrderResponse(Guid Id);
public sealed record Order(Guid Id, string UserId, IReadOnlyList<OrderLine> Items, DateTime CreatedUtc)
{
    public static Order From(CreateOrder request, string userId) =>
        new(Guid.NewGuid(), userId, request.Items, DateTime.UtcNow);
}
public sealed class OrderValidationException(string message) : Exception(message) { }

public interface IOrderService
{
    Task<Order> CreateAsync(CreateOrder request, string userId, CancellationToken ct);
}
public interface IOrderRepository
{
    Task InsertAsync(Order order, CancellationToken ct);
}
```

The sample's identity provider and authorization handler are application-specific. In `Program.cs`, call `AddAuthentication(...)` and `AddAuthorization()`, then `UseAuthentication()` and `UseAuthorization()` in the middleware pipeline using the provider already selected by the service. Do not write raw headers, cookies, tokens, or password values to logs.

A minimal SQL repository can perform a parameterized insert (install `Microsoft.Data.SqlClient` and provision the `dbo.Orders` table through a migration):

```csharp
using Microsoft.Data.SqlClient;
using System.Data;

public sealed class SqlOrderRepository(string connectionString) : IOrderRepository
{
    public async Task InsertAsync(Order order, CancellationToken ct)
    {
        await using var connection = new SqlConnection(connectionString);
        await connection.OpenAsync(ct);
        await using var command = connection.CreateCommand();
        command.CommandText = """
            INSERT dbo.Orders (Id, UserId, CreatedUtc)
            VALUES (@Id, @UserId, @CreatedUtc);
            """;
        command.Parameters.Add("@Id", SqlDbType.UniqueIdentifier).Value = order.Id;
        command.Parameters.Add("@UserId", SqlDbType.NVarChar, 128).Value = order.UserId;
        command.Parameters.Add("@CreatedUtc", SqlDbType.DateTime2).Value = order.CreatedUtc;
        await command.ExecuteNonQueryAsync(ct);
    }
}
```

The repository propagates database errors; the service or HTTP exception boundary owns the actionable error event. Configure `IOrderRepository` with `builder.Services.AddScoped<IOrderRepository>(_ => new SqlOrderRepository(orderConnectionString));` using a secret-backed connection string. This application database connection is separate from the Serilog log database.


