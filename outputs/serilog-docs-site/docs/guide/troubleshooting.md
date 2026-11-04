---
title: Troubleshooting
description: Diagnose missing events, SQL errors, duplicate logs, and shutdown issues.
---

# Troubleshooting

| Symptom | Cause | Diagnose | Fix |
|---|---|---|---|
| No logs appear | No sink, host not wired, wrong config section | Emit startup event; inspect provider and configuration | Add sink and call `UseSerilog()` or register provider |
| Debug missing | Global/category threshold rejects it | Inspect effective minimum and namespace | Lower logger threshold; sink minimum alone cannot help |
| Sink level seems ignored | Upstream logger discarded event | Compare global and sink thresholds | Allow event upstream, then restrict per sink |
| SQL connection failure | Secret, network/TLS, permissions, or server issue | Enable SelfLog; test connectivity and identity | Fix secret/network/grant; avoid broad permissions |
| Table schema mismatch | Options differ from actual table | Compare `ColumnOptions` and schema | Align migration and options; test exact package |
| Custom column is null | Property name or type mismatch | Inspect event properties and mapping | Match `PropertyName`, SQL type, and nullability |
| Custom fields missing | Interpolation or context enricher absent | Inspect template/properties and column set | Use named templates; enable `FromLogContext`; select XML/JSON property storage |
| Object appears as type string | Default capture did not destructure | Inspect template operator | Use `{@Object}` for safe DTO or custom policy |
| Thread ID absent | Package/configuration missing | Check package and enricher setup | Add compatible package; use TraceId for async flow |
| Duplicate exception events | Multiple layers log and rethrow | Search same trace/exception | Choose one owning boundary |
| Slow app or storage growth | Excess volume, large objects, slow destination | Measure rate, payload, sink errors | Reduce volume, bound fields, tune capacity/batching |
| Tail events lost | Termination before buffered flush | Review shutdown and process termination | Allow graceful shutdown; forced kills can still lose buffered events |

`Serilog.Debugging.SelfLog.Enable(TextWriter)` can expose internal sink/configuration failures. Send it to a separate stream; feeding it into the same malfunctioning destination can conceal the issue.


