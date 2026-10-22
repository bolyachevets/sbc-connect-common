# GCP Tracing

A Flask extension for OpenTelemetry distributed tracing with export to Google Cloud Trace.

## Features

- Automatic Flask request instrumentation (reads incoming `traceparent` headers)
- Automatic SQLAlchemy query instrumentation
- Automatic outbound HTTP request instrumentation (injects `traceparent` headers)
- `registries-trace-id` frontend header forwarded as a span attribute
- Controlled via `OTEL_SDK_DISABLED` config — safe to deploy disabled and enable per environment

## Installation

### From git (sbc-connect-common)

```toml
gcp-tracing = { git = "https://github.com/bcgov/sbc-connect-common.git", subdirectory = "python/gcp-tracing", branch = "main" }
```

## Usage

### Basic setup

```python
from gcp_tracing import tracing

def create_app():
    app = Flask(__name__)
    db.init_app(app)
    # ...
    tracing.init_app(app, db=db)
    return app
```

### Without SQLAlchemy

```python
tracing.init_app(app)
```

### Configuration

| Config key | Type | Default | Description |
|---|---|---|---|
| `OTEL_SDK_DISABLED` | `bool` | `True` | Set to `False` to enable tracing |

Set `OTEL_SDK_DISABLED = False` in Flask config (or via `OTEL_SDK_DISABLED=false` environment variable) to activate tracing.

The `OTEL_SERVICE_NAME` environment variable controls the service name shown in Cloud Trace (standard OpenTelemetry env var).

### Environment variables (vaults.gcp.env)

```bash
OTEL_SERVICE_NAME="service-name"
OTEL_SDK_DISABLED="op://$SERVICE-BUCKET/$APP_ENV/service-name/OTEL_SDK_DISABLED"
```

### Dockerfile

```dockerfile
ENV OTEL_SDK_DISABLED=true \
    OTEL_SERVICE_NAME=service-name

CMD exec gunicorn --bind 0.0.0.0:${PORT} --config /code/gunicorn_config.py wsgi:app
```

## How it works

When `OTEL_SDK_DISABLED=false`:

1. `CloudTraceSpanExporter` is configured to send spans to Google Cloud Trace using workload identity credentials
2. `FlaskInstrumentor` creates a span for every incoming HTTP request and reads W3C `traceparent` headers to join existing traces from upstream callers
3. `SQLAlchemyInstrumentor` creates child spans for every database query
4. `RequestsInstrumentor` injects `traceparent` headers into outgoing `requests` calls, linking downstream APIs into the same trace
5. The `registries-trace-id` header (set by frontend applications) is attached as `app.registries_trace_id` on the root span

## IAM

The Cloud Run service account requires the `roles/cloudtrace.agent` role to export spans:

```bash
gcloud projects add-iam-policy-binding PROJECT_ID \
  --member="serviceAccount:SA_NAME@PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/cloudtrace.agent"
```

## Development

### Setup

```bash
uv sync
```

### Running tests

```bash
uv run pytest tests/unit/ -v
```

### With coverage

```bash
uv run pytest tests/unit/ --cov=src --cov-report=term-missing
```
