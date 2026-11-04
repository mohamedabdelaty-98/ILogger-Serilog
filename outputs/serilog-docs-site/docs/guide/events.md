---
title: Writing log events
description: Write message templates, structured properties, and useful exception events.
---

# Writing log events

## Templates and named values

Serilog's `Log` methods and `ILogger` methods write events. In application services, use injected `ILogger<T>`; with Serilog host integration, events flow through Serilog. Named placeholders become properties.

```csharp
_logger.LogInformation("Order {OrderId} created for {UserId}", order.Id, userId);
```

The event retains the template and values independently of its rendered text, so a log store can query `OrderId` without parsing prose. Keep placeholder names stable and meaningful. Serilog message templates extend familiar .NET formatting; format specifiers affect rendering (`"Balance {Balance:C}"`) while retaining the captured value.

```csharp
// Structured: OrderId is a property.
logger.Information("Order {OrderId} created", orderId);

// One eagerly created string; no named OrderId property.
logger.Information($"Order {orderId} created");
```

The same principle applies to MEL. Prefer named properties to positional-only placeholders.

## Exceptions and avoiding duplicates

Pass an exception as the exception argument so the sink retains exception type, stack, and inner exception details:

```csharp
try
{
    await repository.SaveAsync(order, cancellationToken);
}
catch (SqlException ex)
{
    logger.LogError(ex, "Could not save order {OrderId}", order.Id);
    throw;
}
```

Log at the layer that owns the response or recovery. If this layer logs and rethrows and an API boundary logs again, the same failure appears twice. Lower layers should propagate unless adding distinct actionable context. Do not replace exception logging with only `{ExceptionMessage}`.

```csharp
// Good: stable template and queryable values.
logger.LogWarning("Payment retry {Attempt} failed for {OrderId}", attempt, orderId);

// Poor: embedded values cannot be reliably queried as named fields.
logger.LogWarning($"Payment retry {attempt} failed for {orderId}");
```

Log meaningful transitions and outcomes, not every method call. Include identifiers needed for diagnosis while excluding secrets and unnecessary personal information.

**Reference:** [Writing Log Events](https://github.com/serilog/serilog/wiki/Writing-Log-Events).


