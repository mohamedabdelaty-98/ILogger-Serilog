---
title: Serilog frequently asked questions
description: Short answers to common Serilog configuration, structured logging, and operations questions.
---

# Frequently asked questions

## Why do I see no logs?

A logger needs a sink and must be connected to the host. Check package installation, `UseSerilog()`/provider registration, `WriteTo`, configuration section names, and effective minimum levels. For sink-internal errors, enable `Serilog.Debugging.SelfLog` separately.

## Why does a Debug sink not receive Debug events?

A sink threshold only filters events that reach it. If global or category logger minimum rejects Debug, no event is created. See [logger vs sink filtering](/guide/configuration#logger-minimum-versus-sink-minimum).

## Why use message templates instead of interpolation?

Templates retain named, typed event properties for search and aggregation. Interpolation embeds values into a string. See [message templates](/guide/events#templates-and-named-values).

## Is a Thread ID a correlation ID?

No. Async continuations can switch threads and threads serve many requests. Use a request, correlation, or distributed Trace ID for logical operations.

## Should every exception be logged where it is caught?

Only log where code takes meaningful recovery action or owns the failure boundary. Log-and-rethrow at every layer creates duplicate records.

## Should I store logs in SQL Server?

It can fit structured reporting and query needs, but logging competes with database capacity and requires retention, access, indexing, and outage planning. Choose based on operational requirements and see [the SQL Server chapter](/guide/sql-server).

## Does this site prove an API is compatible with every package version?

No. Serilog core, integrations, sinks, and enrichers release independently. Verify the selected versions and target framework. See [official sources](/sources).
