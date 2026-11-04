---
title: Introduction to logging
description: Understand why production software needs useful, searchable operational events.
---

# Introduction to logging

## What it is and why it matters

Logging records selected facts about a running program as timestamped events. A useful event says what happened, its severity, and includes properties that help an operator locate related work. In an order API, examples include `OrderId`, `TraceId`, outcome, and elapsed time.

Logs support production diagnosis, service health monitoring, capacity planning, and incident response. They become more useful when collected centrally so an operator can search across service instances. A log is not automatically an audit record: significant audit records need explicit integrity, access, retention, and completeness controls.

## Logging, debugging, and exception handling

| Practice | Purpose | Runtime use |
|---|---|---|
| Logging | Preserve selected operational facts for later search and aggregation | Available when configured; should be intentional |
| Debugging | Inspect execution interactively or with a debugger | Usually during development or targeted diagnosis |
| Exception handling | Decide how control flow responds to failure | Catch where code can recover, add context, translate, or clean up |

Logging does not handle an exception. Catching an exception does not automatically make it observable. At a boundary that owns the failure response, log the exception once with useful context. At lower layers, propagate unless there is a meaningful recovery action; repeated logging creates duplicates.

## Serilog and Microsoft.Extensions.Logging

Serilog is a .NET logging library built around structured log events. It provides a fluent configuration API, message templates with named properties, enrichment, filtering, and sinks. A sink adapts an event to a destination such as a console, file, database, or telemetry service. Sinks and enrichers are separate NuGet packages, often maintained by the community.

Microsoft.Extensions.Logging (MEL) is the logging abstraction used by ASP.NET Core and many libraries. `Serilog.Extensions.Logging` provides an MEL provider; `Serilog.AspNetCore` provides host integration and request logging. With host integration, application code can use `ILogger<T>` and framework logs can flow through Serilog, allowing structured sinks and enrichment without requiring every library to depend on Serilog.

Common enterprise uses include request completion and latency, business operation outcomes, dependency failures, background job lifecycle, external service calls, and startup/shutdown diagnostics. Avoid logging every method entry: high-volume noise costs storage and can bury useful events.

**References:** [Configuration Basics](https://github.com/serilog/serilog/wiki/Configuration-Basics), [Writing Log Events](https://github.com/serilog/serilog/wiki/Writing-Log-Events).


## How to use this guide

Start with the architecture and configuration chapters, then continue through structured data and context before selecting destinations. The SQL Server and implementation chapters show how the concepts fit together. The sidebar and built-in search link related topics directly.

This site is a general learning resource. It is not tied to a specific application repository. Check package versions and security requirements for your service before adopting examples.

