# Copyright © 2025 Province of British Columbia
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
"""Integration tests for cloud SQL connector.

These tests require actual Cloud SQL credentials and instances for testing.
"""

import os

import pytest

from cloud_sql_connector import DBConfig, getconn


@pytest.mark.integration
class TestCloudSQLIntegration:
    """Integration tests for Cloud SQL connector."""

    @pytest.fixture
    def db_config(self):
        """Create a test database configuration from environment variables."""
        return DBConfig(
            instance_name=os.getenv(
                "CLOUD_SQL_INSTANCE", "test:us-central1:test-instance"
            ),
            database=os.getenv("CLOUD_SQL_DATABASE", "test_db"),
            user=os.getenv("CLOUD_SQL_USER", "test_user"),
            ip_type=os.getenv("CLOUD_SQL_IP_TYPE", "public"),
            schema=os.getenv("CLOUD_SQL_SCHEMA", ""),
        )

    @pytest.mark.skipif(
        not os.getenv("CLOUD_SQL_INSTANCE"),
        reason="Cloud SQL instance not configured for integration tests",
    )
    def test_real_connection(self, db_config):
        """Test actual connection to Cloud SQL instance.

        This test requires proper Google Cloud credentials and a real Cloud SQL instance.
        """
        try:
            connection = getconn(db_config)
            assert connection is not None

            # Test basic query
            cursor = connection.cursor()
            cursor.execute("SELECT 1 as test_column")
            result = cursor.fetchone()
            assert result[0] == 1

            cursor.close()
            connection.close()

        except Exception as e:
            pytest.fail(f"Failed to establish Cloud SQL connection: {str(e)}")

    @pytest.mark.skipif(
        not os.getenv("CLOUD_SQL_INSTANCE"),
        reason="Cloud SQL instance not configured for integration tests",
    )
    def test_schema_configuration(self, db_config):
        """Test schema configuration with actual connection."""
        if not db_config.schema:
            pytest.skip("Schema not configured for integration test")

        try:
            connection = getconn(db_config)

            # Verify schema is set correctly
            cursor = connection.cursor()
            cursor.execute("SHOW search_path")
            search_path = cursor.fetchone()[0]
            assert db_config.schema in search_path

            cursor.close()
            connection.close()

        except Exception as e:
            pytest.fail(f"Failed schema configuration test: {str(e)}")


    @pytest.mark.skipif(
        not os.getenv("CLOUD_SQL_INSTANCE"),
        reason="Cloud SQL instance not configured for integration tests",
    )
    def test_connection_pooling(self, db_config):
        """Test that connection pooling works correctly with the upgraded dependencies."""
        from sqlalchemy import create_engine, text

        engine = create_engine("postgresql+pg8000://", **db_config.get_engine_options())

        # Test multiple simultaneous connections
        with engine.connect() as conn1, engine.connect() as conn2:
            result1 = conn1.execute(text("SELECT 1"))
            result2 = conn2.execute(text("SELECT 2"))
            assert result1.scalar() == 1
            assert result2.scalar() == 2
