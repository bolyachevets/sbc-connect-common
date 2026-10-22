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
"""Unit tests for the gcp_tracing module."""

from unittest.mock import MagicMock, patch

import pytest
from flask import Flask

from gcp_tracing import GcpTracing, tracing


@pytest.fixture()
def patched_otel():
    """Patch all OTEL SDK components and yield a dict of the mocks."""
    with patch("gcp_tracing.tracing.CloudTraceSpanExporter") as mock_exporter, \
         patch("gcp_tracing.tracing.TracerProvider") as mock_provider_cls, \
         patch("gcp_tracing.tracing.BatchSpanProcessor") as mock_processor, \
         patch("gcp_tracing.tracing.Resource") as mock_resource, \
         patch("gcp_tracing.tracing.trace") as mock_trace, \
         patch("gcp_tracing.tracing.FlaskInstrumentor") as mock_flask_inst, \
         patch("gcp_tracing.tracing.RequestsInstrumentor") as mock_req_inst, \
         patch("opentelemetry.instrumentation.sqlalchemy.SQLAlchemyInstrumentor") as mock_sqla_inst:
        yield {
            "exporter": mock_exporter,
            "provider_cls": mock_provider_cls,
            "processor": mock_processor,
            "resource": mock_resource,
            "trace": mock_trace,
            "flask_inst": mock_flask_inst,
            "req_inst": mock_req_inst,
            "sqla_inst": mock_sqla_inst,
        }


def make_app(disabled=True):
    """Create a minimal Flask app with OTEL_SDK_DISABLED set."""
    app = Flask(__name__)
    app.config["OTEL_SDK_DISABLED"] = disabled
    return app


class TestInitApp:
    """Tests for GcpTracing.init_app."""

    def test_noop_when_disabled(self, patched_otel):
        """No SDK setup when OTEL_SDK_DISABLED=True."""
        GcpTracing().init_app(make_app(disabled=True))
        patched_otel["exporter"].assert_not_called()
        patched_otel["flask_inst"].assert_not_called()

    def test_noop_by_default(self, patched_otel):
        """OTEL_SDK_DISABLED defaults to True when not set in config."""
        GcpTracing().init_app(Flask(__name__))
        patched_otel["exporter"].assert_not_called()

    def test_sets_up_provider_when_enabled(self, patched_otel):
        """TracerProvider is wired with CloudTraceSpanExporter when enabled."""
        mock_provider = MagicMock()
        patched_otel["provider_cls"].return_value = mock_provider

        GcpTracing().init_app(make_app(disabled=False))

        patched_otel["exporter"].assert_called_once()
        patched_otel["provider_cls"].assert_called_once()
        mock_provider.add_span_processor.assert_called_once()
        patched_otel["trace"].set_tracer_provider.assert_called_once_with(mock_provider)

    def test_flask_and_requests_instrumented(self, patched_otel):
        """FlaskInstrumentor and RequestsInstrumentor are applied."""
        app = make_app(disabled=False)
        GcpTracing().init_app(app)
        patched_otel["flask_inst"].return_value.instrument_app.assert_called_once_with(app)
        patched_otel["req_inst"].return_value.instrument.assert_called_once()

    def test_sqlalchemy_instrumented_when_db_provided(self, patched_otel):
        """SQLAlchemyInstrumentor is called with db.engine when db is passed."""
        mock_db = MagicMock()
        GcpTracing().init_app(make_app(disabled=False), db=mock_db)
        patched_otel["sqla_inst"].return_value.instrument.assert_called_once_with(engine=mock_db.engine)

    def test_sqlalchemy_skipped_without_db(self, patched_otel):
        """SQLAlchemyInstrumentor is not called when db is omitted."""
        GcpTracing().init_app(make_app(disabled=False))
        patched_otel["sqla_inst"].return_value.instrument.assert_not_called()


class TestFrontendTraceHeader:
    """Tests for the registries-trace-id before_request hook."""

    def _init_app(self, patched_otel):
        app = make_app(disabled=False)

        @app.route("/test")
        def view():
            return "ok"

        GcpTracing().init_app(app)
        return app

    def test_sets_span_attribute_when_header_present(self, patched_otel):
        """registries-trace-id is attached as app.registries_trace_id on the span."""
        mock_span = MagicMock()
        mock_span.is_recording.return_value = True
        patched_otel["trace"].get_current_span.return_value = mock_span

        with self._init_app(patched_otel).test_client() as client:
            client.get("/test", headers={"registries-trace-id": "trace-abc"})

        mock_span.set_attribute.assert_called_once_with("app.registries_trace_id", "trace-abc")

    def test_noop_when_header_absent(self, patched_otel):
        """No span attribute set when the header is missing."""
        mock_span = MagicMock()
        mock_span.is_recording.return_value = True
        patched_otel["trace"].get_current_span.return_value = mock_span

        with self._init_app(patched_otel).test_client() as client:
            client.get("/test")

        mock_span.set_attribute.assert_not_called()
