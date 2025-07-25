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

#### Unit Tests

Run only unit tests:
```bash
poetry run pytest tests/unit/ -v
```

#### Integration Tests

Integration tests require actual Cloud SQL credentials and a running Cloud SQL instance. They are typically run in CI/CD environments with proper authentication.

**Prerequisites for Integration Tests:**

1. **Google Cloud Credentials**: Set up authentication using one of these methods:
   ```bash
   # Option 1: Service Account Key (for CI/CD)
   export GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account-key.json
   
   # Option 2: Application Default Credentials (for local development)
   gcloud auth application-default login
   ```

2. **Environment Variables**: Configure the following environment variables:
   ```bash
   export CLOUD_SQL_INSTANCE="your-project:region:instance-name"
   export CLOUD_SQL_DATABASE="your_database_name"
   export CLOUD_SQL_USER="your_database_user"
   export CLOUD_SQL_IP_TYPE="public"  # or "private"
   export CLOUD_SQL_SCHEMA="your_schema"  # optional
   ```

3. **Cloud SQL Instance**: Ensure you have a running Cloud SQL PostgreSQL instance with:
   - IAM authentication enabled
   - The service account has Cloud SQL Client role
   - Database and user configured

**Running Integration Tests:**

Create .env file using .env.sample template.

```bash
source .env && poetry run pytest tests/integration/ -v
```

**Troubleshooting:**
- If tests are skipped, ensure `CLOUD_SQL_INSTANCE` is set in your `.env` file
- If tests fail with authentication errors, verify your Google Cloud credentials
- If tests fail with connection errors, check your Cloud SQL instance is running and accessible


### Code Formatting

```bash
poetry run black .
```

## License

Licensed under the Apache License, Version 2.0.
