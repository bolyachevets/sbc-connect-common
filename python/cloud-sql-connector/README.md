# Cloud SQL Connector

A Python library for connecting to Google Cloud SQL instances with authentication and schema management.

## Features

- Simplified Cloud SQL connection management
- IAM authentication support
- Automatic schema path configuration
- SQLAlchemy integration with event listeners
- PostgreSQL support via pg8000 driver

## Installation

```bash
poetry install
```

## Usage

### Basic Connection

```python
from cloud_sql_connector import DBConfig, getconn

config = DBConfig(
    instance_name="project:region:instance",
    database="my_database",
    user="my_user",
    ip_type="public",
    schema="my_schema"
)

connection = getconn(config)
```

### SQLAlchemy Integration

```python
from cloud_sql_connector import setup_search_path_event_listener
from sqlalchemy import create_engine

engine = create_engine("postgresql+pg8000://", creator=lambda: getconn(config))
setup_search_path_event_listener(engine, "my_schema")
```

## Configuration

The `DBConfig` dataclass accepts the following parameters:

- `instance_name`: Cloud SQL instance connection string (format: `project:region:instance`)
- `database`: Database name
- `user`: Database user
- `ip_type`: IP type for connection (`public` or `private`)
- `schema`: Database schema (optional)

## Development

### Running Tests

```bash
poetry run pytest
```

### Code Formatting

```bash
poetry run black .
poetry run zimports .
```

## License

Licensed under the Apache License, Version 2.0.
