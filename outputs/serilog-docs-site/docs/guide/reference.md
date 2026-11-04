---
title: Quick reference
description: Keep common Serilog levels, templates, enrichment, and sink setup close at hand.
---

# Quick reference

## Levels and calls

```csharp
logger.LogTrace("Detailed trace {ItemId}", itemId);          // MEL Trace / Serilog Verbose
logger.LogDebug("Cache miss for {Key}", key);
logger.LogInformation("Order {OrderId} accepted", id);
logger.LogWarning("Retry {Attempt} for {OrderId}", attempt, id);
logger.LogError(exception, "Order {OrderId} failed", id);
logger.LogCritical(exception, "Host cannot continue");       // Serilog Fatal
```

MEL uses Trace, Debug, Information, Warning, Error, Critical; Serilog uses Verbose, Debug, Information, Warning, Error, Fatal.

## Templates, objects, context, and SQL

```csharp
logger.LogInformation("Order {OrderId} total {Total:C}", orderId, total);
logger.LogInformation("Summary {@Summary}", safeSummary);
logger.LogInformation("Payload {$Payload}", payload);

new LoggerConfiguration()
    .MinimumLevel.Information()
    .MinimumLevel.Override("Microsoft", LogEventLevel.Warning)
    .Enrich.FromLogContext()
    .Enrich.WithProperty("Application", "Orders.Api");

.WriteTo.MSSqlServer(
    connectionString: connectionString,
    sinkOptions: new MSSqlServerSinkOptions
        { TableName = "Logs", AutoCreateSqlTable = false },
    columnOptions: columnOptions,
    restrictedToMinimumLevel: LogEventLevel.Warning)
```

Use package `Serilog.Sinks.MSSqlServer`; select intended standard columns in `ColumnOptions.Store` and define typed fields in `AdditionalColumns`. Database schema and options must agree.


