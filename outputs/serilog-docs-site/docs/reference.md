---
title: Serilog quick reference
description: Common Serilog levels, APIs, template syntax, enrichers, and sink configuration.
---

# Serilog quick reference

## Level mapping

| Serilog | Microsoft.Extensions.Logging | Typical use |
|---|---|---|
| Verbose | Trace | Fine-grained temporary diagnostics |
| Debug | Debug | Developer diagnostics |
| Information | Information | Normal milestones |
| Warning | Warning | Degraded or unexpected but handled condition |
| Error | Error | Operation failed |
| Fatal | Critical | Host cannot continue |

## Common event calls

```csharp
logger.LogDebug("Cache miss for {CacheKey}", key);
logger.LogInformation("Order {OrderId} created", orderId);
logger.LogWarning("Retry {Attempt} for {OperationName}", attempt, operation);
logger.LogError(exception, "Could not save order {OrderId}", orderId);
```

## Template operators

```csharp
"Value {Name}"     // Capture a property using its default representation.
"Object {@Order}"  // Destructure a bounded object into structured members.
"Text {$Payload}"  // Capture the object's string representation.
"Elapsed {Ms:0.0}" // Format rendered output; property value remains structured.
```

## Configuration fragments

```csharp
.MinimumLevel.Information()
.MinimumLevel.Override("Microsoft", LogEventLevel.Warning)
.Enrich.FromLogContext()
.Enrich.WithProperty("Application", "Orders.Api")
.WriteTo.Console(restrictedToMinimumLevel: LogEventLevel.Debug)
.WriteTo.File("logs/app-.log", rollingInterval: RollingInterval.Day)
```

A sink threshold cannot receive events discarded by the logger-level threshold.

## Useful packages

| Capability | NuGet package |
|---|---|
| ASP.NET Core integration | `Serilog.AspNetCore` |
| Configuration binding | `Serilog.Settings.Configuration` |
| Console | `Serilog.Sinks.Console` |
| Rolling file | `Serilog.Sinks.File` |
| SQL Server | `Serilog.Sinks.MSSqlServer` |
| Machine/environment enrichers | `Serilog.Enrichers.Environment` |
| Thread ID | `Serilog.Enrichers.Thread` |

Check version compatibility and sink-specific docs. Package names are not a promise that every feature ships in Serilog core.

## SQL Server starter

```csharp
.WriteTo.MSSqlServer(
    connectionString: connectionString,
    sinkOptions: new MSSqlServerSinkOptions { TableName = "Logs", AutoCreateSqlTable = false },
    columnOptions: columnOptions,
    restrictedToMinimumLevel: LogEventLevel.Warning)
```

See [SQL Server details](/guide/sql-server) for standard columns, custom mappings, JSON, schema, and operations.
