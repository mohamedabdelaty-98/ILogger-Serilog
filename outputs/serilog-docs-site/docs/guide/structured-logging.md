---
title: Structured logging
description: Understand Serilog properties, value types, destructuring, and structured queries.
---

# Structured logging

Traditional text logs render a sentence such as `Order 54 created in 120 ms`. Structured logging preserves a stable template plus typed properties. A platform can query `OrderId = 54`, aggregate duration, or group by operation without parsing the sentence.

Serilog represents values as scalars, sequences, structures, and dictionaries. Numbers, strings, booleans, dates, and selected reference types can be scalar. Collections become sequences; dictionaries retain key/value relationships; complex objects become structures when destructured. Sinks choose how to encode these sink-agnostic values, such as JSON or XML.

| Syntax | Meaning | Example |
|---|---|---|
| `{Property}` | Default capture behavior, often scalar/stringification | `"Customer {Customer}"` |
| `{@Property}` | Destructure object into structured members | `"Order {@OrderSummary}"` |
| `{$Property}` | Stringify via string representation | `"Response {$Response}"` |

```csharp
var summary = new { Id = order.Id, ItemCount = order.Items.Count };
logger.Information("Order {@OrderSummary} accepted", summary);
logger.Information("External response {$Response}", response);
```

Destructuring can expose large graphs, perform expensive property access, create high-volume events, or leak sensitive fields. Prefer small, safe DTOs. A custom `IDestructuringPolicy` can shape repeated type handling; keep the policy bounded and test against the installed Serilog version.

```csharp
logger.Information(
    "{OperationName} completed for order {OrderId} in {ExecutionDurationMs} ms",
    "CreateOrder", orderId, elapsed.TotalMilliseconds);
```

Add `UserId`, `RequestId`, or `TraceId` through scopes when policy permits. Each property can be queried independently. Use units in names (`ExecutionDurationMs`) and consistent casing. Avoid entire HTTP requests or arbitrary object graphs in every event.

**Reference:** [Structured Data](https://github.com/serilog/serilog/wiki/Structured-Data).


