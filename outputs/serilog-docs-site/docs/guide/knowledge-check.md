---
title: Knowledge check
description: Review key Serilog concepts with explanations and practical questions.
---

# Knowledge check

1. **What does a sink do?** Writes an accepted event to a destination in that destination's format.
2. **What does the global minimum do?** Decides whether a call becomes a log event.
3. **Can a Debug-only sink receive Debug when global minimum is Information?** No; the logger rejects the call before routing.
4. **Why use `{OrderId}` instead of interpolation?** It captures a named structured property separate from rendered text.
5. **What does `{@Order}` request?** Destructuring into structured members, subject to policies/limits.
6. **What does `{$Response}` request?** Stringification through the object's string representation.
7. **What does `Enrich.FromLogContext()` enable?** Properties pushed into Serilog's ambient scoped context.
8. **Why is Thread ID insufficient for request tracing?** Async work can switch threads and threads are reused; use trace/request context.
9. **What is a Trace ID for?** Connecting spans/events across a distributed operation.
10. **Should every layer log and rethrow the same exception?** No; choose one actionable owner.
11. **What does MSSQL `Properties` store?** Structured properties serialized as XML when enabled.
12. **What is MSSQL `LogEvent`?** JSON event representation when selected.
13. **Why map a property to a SQL column?** Typed querying and indexing, in exchange for schema management.
14. **What must match for custom-column mapping?** Event property name/value type and configured SQL column definition.
15. **What does `AutoCreateSqlTable` do?** Creates a missing table when enabled; documented default is false.
16. **Why batch database writes?** Better throughput, with added latency and buffered shutdown behavior.
17. **Should an Error event include a password?** No; severity does not make sensitive data safe.
18. **What does `Log.CloseAndFlush()` do?** Closes the global logger and flushes sinks that support orderly flush.
19. **Why override Microsoft namespaces?** Framework diagnostics can be noisy; retain useful warnings/errors with less volume.
20. **Are all listed sinks maintained by Serilog core?** No; the catalog includes community packages with separate support status.


