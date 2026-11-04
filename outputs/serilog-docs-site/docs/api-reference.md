---
title: Serilog API quick reference
description: Frequently used Serilog methods and interfaces with package and lifecycle notes.
---

# Serilog API quick reference

## Logger creation and lifecycle

| API | Role |
|---|---|
| `new LoggerConfiguration()` | Starts fluent logger setup |
| `.MinimumLevel.Information()` | Sets the default logger event threshold |
| `.MinimumLevel.Override(source, level)` | Changes threshold for a source/category prefix |
| `.WriteTo.Console()` | Adds the console sink extension |
| `.Enrich.FromLogContext()` | Includes properties pushed to `LogContext` |
| `.CreateLogger()` | Builds the configured logger |
| `Log.Logger` | Assigns the process-wide bootstrap/global logger |
| `Log.CloseAndFlush()` | Closes global logger and flushes supported sinks |

For hosted services, prefer `Serilog.AspNetCore` `UseSerilog()` integration and the installed version's host shutdown lifecycle.

## Event methods

Serilog's `ILogger` exposes `Verbose`, `Debug`, `Information`, `Warning`, `Error`, `Fatal`, and `Write`. `Log` offers static equivalents. MEL's `ILogger<T>` uses Trace/Debug/Information/Warning/Error/Critical and is normally used in ASP.NET Core application code.

```csharp
logger.Information("Order {OrderId} accepted", orderId);
logger.Warning("Retry {Attempt} failed for {OperationName}", attempt, operation);
logger.Error(exception, "Payment for {OrderId} failed", orderId);
```

## Package boundaries

Serilog core supplies event types, logger configuration, message templates, and enrichment/filtering interfaces. Hosting integration, sinks, and enrichers are separately packaged. Examples: `Serilog.AspNetCore`, `Serilog.Sinks.Console`, `Serilog.Sinks.MSSqlServer`, `Serilog.Enrichers.Thread`.

Names here summarize common APIs, not a substitute for versioned XML docs. Confirm overloads and signatures for your exact package release.
