---
title: Production logging standard
description: Set team conventions for severity, security, performance, and retention.
---

# Production logging standard

Every important event should use a stable message template and include the operation, outcome, and safe identifiers needed for diagnosis. Use consistent names and units. Attach trace/request context once through middleware or scopes. Log exception objects at the layer that owns failure handling.

| Recommended | Discouraged |
|---|---|
| `logger.LogInformation("Order {OrderId} accepted", id)` | Interpolated or concatenated log text |
| Warning for recoverable degradation; Error for failed operation | Treat every client validation error as Error |
| Log an exception once at an actionable boundary | Catch, log, and rethrow at every layer |
| Add TraceId/RequestId through request context | Use ThreadId to trace an async request |
| Log allowlisted identifiers and outcomes | Passwords, tokens, cookies, secrets, full connection strings |
| Use small DTOs for destructuring | Destructure entities or request bodies by default |
| Tune framework overrides and production levels | Leave verbose EF/HTTP diagnostics on without controls |
| Understand buffering and delivery limits | Assume sink outage cannot cause delay or event loss |
| Apply retention, access, and size limits | Retain unbounded files/tables |
| Sample or filter repetitive health-check success events | Emit high-volume success events without a use case |

## Layer and environment guidance

- **Middleware/controllers:** record request outcome once and translate exceptions to responses. Avoid duplicating service logs.
- **Services:** log business milestones and decisions with domain identifiers, not every method call.
- **Repositories:** add useful dependency context when needed; propagate failures. Avoid duplicating SQL text or parameter values.
- **Background workers:** include job name, run ID, attempt, and outcome; make terminal failure clear.
- **Production:** Information is a common baseline. Tune by cost, sensitivity, and operational need. Keep Debug/Verbose off unless enabled through controlled diagnostics.

Protect logs as sensitive operational data. Minimize personal data, omit secrets, restrict access, encrypt where policy requires, and define retention/deletion. Logging consumes CPU, allocations, I/O, and ingestion capacity. Avoid expensive object construction for disabled levels; keep events bounded. Logs should not be the only source of business truth.


