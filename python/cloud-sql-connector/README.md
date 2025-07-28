# Cloud SQL Connector

A Python library for connecting to Google Cloud SQL instances with authentication and schema management.

## Features

- Simplified Cloud SQL connection management
- IAM authentication support
- Automatic schema path configuration

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
from sqlalchemy import create_engine

engine = create_engine("postgresql+pg8000://", creator=lambda: getconn(config))
```

## Configuration

The `DBConfig` dataclass accepts the following parameters:

- `instance_name`: Cloud SQL instance connection string (format: `project:region:instance`)
- `database`: Database name
- `user`: Database user
- `ip_type`: IP type for connection (`public` or `private`)
- `schema`: Database schema (optional)
- `driver`: Database driver (optional - defaults to pg8000)

### Connection Pool Parameters
- `pool_size`: Maximum number of connections to keep in the pool (default: 5).
- `max_overflow`: Number of extra connections allowed above `pool_size` (default: 2).
- `pool_timeout`: Seconds to wait before giving up on getting a connection from the pool (default: 10).
- `pool_recycle`: Seconds after which a connection is recycled (closed and reopened) to prevent stale connections (default: 1800).
- `pool_pre_ping`: If `True`, test connections for liveness before using (default: True).
- `connect_args`: Dictionary of driver-specific connection arguments (default: None).

## Development

### Running Tests

#### Unit Tests

Run only unit tests:
```bash
poetry run pytest tests/unit/ -v
```

#### Integration Tests

**Prerequisites for Integration Tests:**

1. **Google Cloud Credentials**: Set up authentication using one of these methods:
   ```bash
   # Option 1: Service Account Key (for CI/CD)
   export GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account-key.json
   
   # Option 2: Application Default Credentials (for local development)
   gcloud auth application-default login
   ```

2. **Cloud SQL Instance**: Ensure you have a running Cloud SQL PostgreSQL instance with:
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

Copyright © 2025 Province of British Columbia

Licensed under the BSD 3 Clause License, (the "License"); you may not use this file except in compliance with the License. The template for the license can be found here https://opensource.org/license/bsd-3-clause/

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.

Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

Neither the name of the copyright holder nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS “AS IS” AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
