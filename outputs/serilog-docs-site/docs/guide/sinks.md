---
title: Sinks and destinations
description: Select and configure console, file, SQL, Seq, and search destinations.
---

# Sinks and destinations

A sink receives accepted events and converts them to a destination-specific representation. Install its NuGet package, then configure `WriteTo` or configuration binding. The official catalog includes community packages; inclusion does not guarantee identical support or maintenance. Check each repository and NuGet compatibility.

| Sink | Typical package | Purpose and usage |
|---|---|---|
| Console | `Serilog.Sinks.Console` | Local development and container stdout collection |
| File | `Serilog.Sinks.File` | Rolling persistent diagnostic files |
| SQL Server | `Serilog.Sinks.MSSqlServer` | Relational storage and targeted reporting |
| Seq | `Serilog.Sinks.Seq` | Structured event search and monitoring |
| Elasticsearch | `Serilog.Sinks.Elasticsearch` | Search/analytics integration; verify current package status |

These are separate projects, not destinations guaranteed by Serilog core. Multiple sinks serve distinct needs; understand each sink's buffering and failure behavior. Container systems commonly collect stdout. File and database storage need explicit retention policies. Use per-sink restrictions where supported, remembering upstream filtering applies first.

**Reference:** [Provided Sinks](https://github.com/serilog/serilog/wiki/Provided-Sinks).


