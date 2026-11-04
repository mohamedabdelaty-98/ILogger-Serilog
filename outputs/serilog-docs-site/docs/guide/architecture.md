---
title: Serilog architecture
description: Follow a logging call through levels, enrichment, filters, and multiple sinks.
---

# Serilog architecture

A logging call supplies a level, message template, values, and optionally an exception. If enabled, Serilog creates a `LogEvent` with timestamp, level, template, rendered message, exception, and properties. Enrichers add context; filters exclude events; sinks encode accepted events for destinations.

```mermaid
flowchart LR
  A[Application / ILogger] --> B[Logger]
  B --> C{Minimum level and overrides}
  C -->|enabled| D[Create LogEvent]
  D --> E[Enrichers and contextual properties]
  E --> F{Logger filters}
  F -->|accepted| G[Console sink]
  F -->|accepted| H[File sink]
  F -->|accepted| I[SQL Server sink]
  G --> J[Destination]
  H --> K[Destination]
  I --> L[Destination]
  C -->|rejected| X[Discarded]
```

This is a conceptual view. Logger-level minimum checks can avoid creating disabled events. Per-sink minimum restrictions and filters determine which already-enabled events a sink writes. A global filter can reject an event for all sinks; sink-local filtering rejects it only for that destination. Multiple sinks can independently receive the same event.

| Component | Responsibility | Example |
|---|---|---|
| Logger | Accepts calls and applies configuration | `ILogger<OrderService>` |
| Log event | Structured record of one occurrence | Warning with `OrderId=42` |
| Message template | Stable event shape and property names | `Order {OrderId} accepted` |
| Properties | Typed values attached to event | `OrderId`, `TraceId` |
| Minimum level | Rejects events below a severity threshold | Global `Information` |
| Enricher | Adds properties | Machine name, request ID |
| Filter | Excludes matching events | Ignore health checks |
| Sink | Writes an event to destination | Console, MSSQL |
| Destructuring | Converts object to structured property data | `{@OrderSummary}` |

**References:** [Configuration Basics](https://github.com/serilog/serilog/wiki/Configuration-Basics), [Structured Data](https://github.com/serilog/serilog/wiki/Structured-Data).


## Log event lifecycle

The following sequence shows the stages an enabled call passes through. Exact internal evaluation order can vary with pipeline construction and sink wrappers; the key operational point is that an event rejected by the logger is unavailable to downstream sinks.

```mermaid
sequenceDiagram
  participant App as Application
  participant Logger
  participant Level as Minimum level
  participant Enrich as Enrichers
  participant Filter
  participant Sink as Sink(s)
  App->>Logger: Log template + values + level
  Logger->>Level: Check source threshold
  alt rejected
    Level-->>App: No event emitted
  else enabled
    Level->>Logger: Create LogEvent
    Logger->>Enrich: Add ambient properties
    Enrich->>Filter: Evaluate event
    alt accepted
      Filter->>Sink: Route event
      Sink-->>Sink: Format, batch, and write
    else excluded
      Filter-->>App: Discard for configured pipeline
    end
  end
```

