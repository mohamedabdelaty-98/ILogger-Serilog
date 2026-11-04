---
title: Getting Started with Serilog
description: Install Serilog packages and connect the logger to an ASP.NET Core host.
---

# Getting started with Serilog

This section shows a minimal modern ASP.NET Core setup. Pin package versions compatible with your .NET/ASP.NET Core target. `Serilog.AspNetCore` major versions track ASP.NET Core majors; confirm the package matrix before installation.

## Install packages

```powershell
dotnet add package Serilog.AspNetCore
dotnet add package Serilog.Settings.Configuration
dotnet add package Serilog.Sinks.Console
dotnet add package Serilog.Sinks.File
```

Add destination-specific packages separately, such as `Serilog.Sinks.MSSqlServer` only when required. See the [SQL Server chapter](/guide/sql-server).

## Bootstrap the host

```csharp
using Serilog;

var builder = WebApplication.CreateBuilder(args);
builder.Host.UseSerilog((context, services, logger) => logger
    .ReadFrom.Configuration(context.Configuration)
    .ReadFrom.Services(services)
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .WriteTo.File("logs/app-.log", rollingInterval: RollingInterval.Day));

builder.Services.AddControllers();
var app = builder.Build();
app.UseSerilogRequestLogging();
app.MapControllers();
await app.RunAsync();
```

`UseSerilog()` connects the host and dependency injection. `ReadFrom.Configuration()` reads the Serilog section. Request logging middleware emits one completion event with method, path, status, and elapsed duration. Place it after middleware whose activity should be included and before endpoint execution.

## Minimal appsettings

```json
{
  "Serilog": {
    "MinimumLevel": {
      "Default": "Information",
      "Override": { "Microsoft": "Warning" }
    },
    "Enrich": [ "FromLogContext" ],
    "Properties": { "Application": "Orders.Api" }
  }
}
```

The example adds console and file sinks in code; sink configuration can instead live in JSON if the sink assembly is installed and discovered. See [configuration](/guide/configuration).

## First structured event

```csharp
logger.LogInformation("Order {OrderId} accepted", order.Id);
```

`OrderId` is captured as a property. See [message templates](/guide/events) and [structured data](/guide/structured-logging).

## References

- [Configuration Basics](https://github.com/serilog/serilog/wiki/Configuration-Basics)
- [Serilog.AspNetCore](https://github.com/serilog/serilog-aspnetcore)


