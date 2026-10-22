# Copyright © 2026 Province of British Columbia
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
"""Flask extension for OpenTelemetry tracing with Google Cloud Trace export."""

from flask import Flask, request
from opentelemetry import trace
from opentelemetry.exporter.cloud_trace import CloudTraceSpanExporter
from opentelemetry.instrumentation.flask import FlaskInstrumentor
from opentelemetry.instrumentation.requests import RequestsInstrumentor
from opentelemetry.sdk.resources import Resource
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor


class GcpTracing:
    """Flask extension that sets up OpenTelemetry tracing with Google Cloud Trace export.

    Controlled via OTEL_SDK_DISABLED in Flask config (default: True).
    No-op when disabled, so it is safe to include in all environments.

    Usage::

        from gcp_tracing import tracing

        def create_app():
            app = Flask(__name__)
            db.init_app(app)
            tracing.init_app(app, db=db)
            return app
    """

    def init_app(self, app: Flask, db=None) -> None:
        """Initialize tracing for the given Flask app.

        Args:
            app: The Flask application instance.
            db: Optional Flask-SQLAlchemy db object. When provided, database
                queries are instrumented as child spans.
        """
        if app.config.get("OTEL_SDK_DISABLED", True):
            return

        exporter = CloudTraceSpanExporter()
        provider = TracerProvider(resource=Resource.create())
        provider.add_span_processor(BatchSpanProcessor(exporter))
        trace.set_tracer_provider(provider)

        FlaskInstrumentor().instrument_app(app)

        if db is not None:
            # Importing here to make sure sqlalchemy is not forced for services not using database.
            from opentelemetry.instrumentation.sqlalchemy import SQLAlchemyInstrumentor  # noqa: PLC0415
            with app.app_context():
                SQLAlchemyInstrumentor().instrument(engine=db.engine)

        RequestsInstrumentor().instrument()

        @app.before_request
        def attach_request_trace_attributes():
            span = trace.get_current_span()
            if not span.is_recording():
                return
            if registries_trace_id := request.headers.get("registries-trace-id"):
                span.set_attribute("app.registries_trace_id", registries_trace_id)
            if account_id := request.headers.get("Account-Id"):
                span.set_attribute("app.account_id", account_id)
