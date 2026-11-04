---
title: SQL Server sink
description: Configure MSSQL columns, JSON properties, batching, performance, and retention.
---

# SQL Server sink

## Package, platforms, and options

The NuGet package is `Serilog.Sinks.MSSqlServer`; it writes to SQL Server and Azure SQL. The repository page reviewed lists minimum platforms including .NET Framework 4.6.2, .NET 8.0, and .NET Standard 2.0. Check the exact release's target frameworks and dependencies before adopting. It can write standard event fields, properties as XML `Properties` or JSON `LogEvent`, and selected properties as separate columns.

```powershell
dotnet add package Serilog.Sinks.MSSqlServer
```

For JSON configuration, add `Serilog.Settings.Configuration`. Pin compatible versions rather than using floating dependencies in production.

`MSSqlServerSinkOptions` configures table and batching. Common options include `TableName`, `SchemaName` (defaults to `dbo`), `AutoCreateSqlDatabase`, `AutoCreateSqlTable` (documented defaults are false), `BatchPostingLimit`, and `BatchPeriod`. If auto-creating a database, the documentation says table auto-creation should also be true. Production schema is often provisioned with reviewed migrations so types, permissions, and indexes are explicit.

`ColumnOptions.Store` lists standard columns present in the table. Typical standard fields include `Id`, `Message`, `MessageTemplate`, `Level`, `TimeStamp`, `Exception`, and `Properties`; the selected set and defaults depend on options/version. The table schema must agree with the configured columns.

## C# configuration and custom columns

```csharp
using System.Collections.ObjectModel;
using System.Data;
using Serilog;
using Serilog.Sinks.MSSqlServer;

var columnOptions = new ColumnOptions();
columnOptions.Store.Remove(StandardColumn.Properties);
columnOptions.Store.Add(StandardColumn.LogEvent);
columnOptions.Store.Add(StandardColumn.TraceId);
columnOptions.Store.Add(StandardColumn.SpanId);
columnOptions.AdditionalColumns = new Collection<SqlColumn>
{
    new() { ColumnName = "OrderId", PropertyName = "OrderId", DataType = SqlDbType.BigInt,
        AllowNull = true, NonClusteredIndex = true },
    new() { ColumnName = "OperationName", DataType = SqlDbType.NVarChar,
        DataLength = 64, AllowNull = true }
};

var sinkOptions = new MSSqlServerSinkOptions
{
    TableName = "Logs", SchemaName = "dbo", AutoCreateSqlTable = false,
    BatchPostingLimit = 100, BatchPeriod = TimeSpan.FromSeconds(5)
};

var logger = new LoggerConfiguration()
    .MinimumLevel.Information()
    .WriteTo.MSSqlServer(
        connectionString: connectionString,
        sinkOptions: sinkOptions,
        columnOptions: columnOptions,
        restrictedToMinimumLevel: Serilog.Events.LogEventLevel.Warning)
    .CreateLogger();
```

`OrderId` maps the structured property named `OrderId`; `OperationName` also maps by matching its column name. Choose SQL types, nullability, lengths, and indexes for actual event shapes and queries. Fixed character lengths can truncate values. Hierarchical property mapping is supported, but collection indexing is not supported by documented property-name resolution.

## JSON/XML properties versus dedicated columns {#json-versus-columns}

`Properties` stores structured properties as XML; `LogEvent` stores a JSON event representation. The sink documentation recommends typically choosing one catch-all representation rather than both. JSON querying with `JSON_VALUE` requires SQL Server 2016 or newer per its documentation. Dedicated columns provide direct typed predicates and indexing for frequently queried properties but require schema maintenance. Redundant data can be excluded with `Properties.ExcludeAdditionalProperties` or `LogEvent.ExcludeAdditionalProperties`; JSON can also exclude standard columns.

## Illustrative SQL schema and query {#sql-schema}

Provision a schema that exactly matches `ColumnOptions`. A simplified example for the settings above is:

```sql
CREATE TABLE dbo.Logs
(
    Id bigint IDENTITY(1,1) NOT NULL CONSTRAINT PK_Logs PRIMARY KEY NONCLUSTERED,
    Message nvarchar(max) NULL,
    MessageTemplate nvarchar(max) NULL,
    Level nvarchar(128) NULL,
    TimeStamp datetimeoffset NULL,
    Exception nvarchar(max) NULL,
    LogEvent nvarchar(max) NULL,
    TraceId varchar(32) NULL,
    SpanId varchar(16) NULL,
    OrderId bigint NULL,
    OperationName nvarchar(64) NULL
);
CREATE INDEX IX_Logs_OrderId_TimeStamp ON dbo.Logs(OrderId, TimeStamp);
```

This is illustrative. Match actual names, types, nullability, identity/index choices, serialized type, and package version. Test a migration against SQL Server before deployment.

```csharp
logger.Information("{OperationName} accepted order {OrderId}", "CreateOrder", orderId);
```

```sql
SELECT TOP (100) TimeStamp, Level, Message, OrderId, TraceId
FROM dbo.Logs
WHERE OrderId = @OrderId
ORDER BY TimeStamp DESC;
```

To query a property stored in JSON instead of a dedicated column, the sink docs show this pattern:

```sql
SELECT TimeStamp, Message,
       JSON_VALUE(LogEvent, '$.Properties.OrderId') AS OrderId
FROM dbo.Logs
WHERE JSON_VALUE(LogEvent, '$.Properties.OrderId') = '42';
```

## Batching, failures, and operations {#batching}

Batching groups writes to improve throughput. `BatchPostingLimit` bounds rows and `BatchPeriod` controls the interval. This adds write latency and means recent events may remain buffered. Flush on orderly shutdown; do not assume buffering guarantees delivery during forced termination or database outages. Validate exact failure behavior for the deployed package version.

Index according to real queries, often timestamp, level, trace/order identifiers; indexes increase write cost. Define retention through scheduled deletion, archive, or partitioning. Bound payload sizes and event volume. Use a dedicated least-privilege database principal and provision the table separately in secured production deployments; the sink docs note that table-specific grants require a pre-existing table. Protect connection strings as secrets, encrypt connections as policy requires, and never log credentials.

Sink-internal diagnostics can be directed through Serilog `SelfLog` during investigation. Send it to a separate stream rather than the malfunctioning destination. Monitor database availability, write failures, and storage growth. Ensure a slow or unavailable log store cannot unexpectedly block business operations.

## Configuration-driven setup

The sink repository documents `Serilog.Settings.Configuration` support. A representative section shape is:

```json
{
  "Serilog": {
    "Using": [ "Serilog.Sinks.MSSqlServer" ],
    "WriteTo": [{
      "Name": "MSSqlServer",
      "Args": {
        "connectionString": "provided-by-secret-configuration",
        "sinkOptionsSection": {
          "tableName": "Logs", "schemaName": "dbo",
          "autoCreateSqlTable": false,
          "batchPostingLimit": 100, "batchPeriod": "00:00:05"
        },
        "restrictedToMinimumLevel": "Warning",
        "columnOptionsSection": {
          "addStandardColumns": [ "LogEvent", "TraceId", "SpanId" ],
          "removeStandardColumns": [ "Properties" ],
          "additionalColumns": [
            { "ColumnName": "OrderId", "DataType": "bigint", "AllowNull": true,
              "NonClusteredIndex": true }
          ]
        }
      }
    }]
  }
}
```

Names and enum/type binding are version-sensitive. Environment variable expansion is configuration-provider dependent; do not assume `${...}` is automatically expanded. Validate this shape against the installed package README. Some `ColumnOptions` predicates cannot be expressed in configuration.

**Primary reference:** [Serilog.Sinks.MSSqlServer repository](https://github.com/serilog-mssql/serilog-sinks-mssqlserver).



