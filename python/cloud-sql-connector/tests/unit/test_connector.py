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
"""Unit tests for the cloud SQL connector module."""

import sys
from unittest.mock import MagicMock, Mock, patch

import pytest
from cloud_sql_connector.connector import (DBConfig, getconn,
                                           setup_search_path_event_listener)


class TestDBConfig:
    """Test the DBConfig dataclass."""

    def test_db_config_creation(self):
        """Test creating a DBConfig instance."""
        config = DBConfig(
            instance_name="project:region:instance",
            database="test_db",
            user="test_user",
            ip_type="public",
            schema="test_schema"
        )
        
        assert config.instance_name == "project:region:instance"
        assert config.database == "test_db"
        assert config.user == "test_user"
        assert config.ip_type == "public"
        assert config.schema == "test_schema"

    def test_db_config_empty_schema(self):
        """Test creating a DBConfig instance with empty schema."""
        config = DBConfig(
            instance_name="project:region:instance",
            database="test_db",
            user="test_user",
            ip_type="public",
            schema=""
        )
        
        assert config.schema == ""


class TestGetconn:
    """Test the getconn function."""

    @patch('cloud_sql_connector.connector.Connector')
    def test_getconn_without_schema(self, mock_connector_class):
        """Test getconn function without schema."""
        # Setup mocks
        mock_connector = MagicMock()
        mock_connector_class.return_value.__enter__ = Mock(return_value=mock_connector)
        mock_connector_class.return_value.__exit__ = Mock(return_value=None)
        
        mock_connection = Mock()
        mock_connector.connect.return_value = mock_connection
        
        # Create config without schema
        config = DBConfig(
            instance_name="project:region:instance",
            database="test_db",
            user="test_user",
            ip_type="public",
            schema=""
        )
        
        # Call function
        result = getconn(config)
        
        # Assertions
        mock_connector_class.assert_called_once_with(refresh_strategy="lazy")
        mock_connector.connect.assert_called_once_with(
            instance_connection_string="project:region:instance",
            db="test_db",
            user="test_user",
            ip_type="public",
            driver="pg8000",
            enable_iam_auth=True
        )
        assert result == mock_connection

    @patch('cloud_sql_connector.connector.Connector')
    def test_getconn_with_schema(self, mock_connector_class):
        """Test getconn function with schema."""
        # Setup mocks
        mock_connector = MagicMock()
        mock_connector_class.return_value.__enter__ = Mock(return_value=mock_connector)
        mock_connector_class.return_value.__exit__ = Mock(return_value=None)
        
        mock_connection = Mock()
        mock_cursor = Mock()
        mock_connection.cursor.return_value = mock_cursor
        mock_connector.connect.return_value = mock_connection
        
        # Create config with schema
        config = DBConfig(
            instance_name="project:region:instance",
            database="test_db",
            user="test_user",
            ip_type="public",
            schema="test_schema"
        )
        
        # Call function
        result = getconn(config)
        
        # Assertions
        mock_connector_class.assert_called_once_with(refresh_strategy="lazy")
        mock_connector.connect.assert_called_once_with(
            instance_connection_string="project:region:instance",
            db="test_db",
            user="test_user",
            ip_type="public",
            driver="pg8000",
            enable_iam_auth=True
        )
        
        # Check cursor calls for schema setup
        mock_connection.cursor.assert_called()
        expected_calls = [
            (("SET search_path TO test_schema,public",), {}),
            (("SET LOCAL search_path TO test_schema, public;",), {})
        ]
        mock_cursor.execute.assert_has_calls([
            pytest.MockCall(*call[0], **call[1]) for call in expected_calls
        ])
        mock_cursor.close.assert_called_once()
        
        assert result == mock_connection


class TestSetupSearchPathEventListener:
    """Test the setup_search_path_event_listener function."""

    @patch('cloud_sql_connector.connector.event')
    def test_setup_search_path_event_listener(self, mock_event):
        """Test setting up the search path event listener."""
        mock_engine = Mock()
        schema = "test_schema"
        
        # Call function
        setup_search_path_event_listener(mock_engine, schema)
        
        # Verify event listener is set up
        mock_event.listens_for.assert_called_once_with(mock_engine, "checkout")

    @patch('cloud_sql_connector.connector.event')
    def test_event_listener_callback(self, mock_event):
        """Test the event listener callback function."""
        mock_engine = Mock()
        schema = "test_schema"
        
        # Capture the callback function
        callback_function = None
        def capture_callback(engine, event_name):
            def decorator(func):
                nonlocal callback_function
                callback_function = func
                return func
            return decorator
        
        mock_event.listens_for.side_effect = capture_callback
        
        # Setup the event listener
        setup_search_path_event_listener(mock_engine, schema)
        
        # Test the callback
        mock_dbapi_connection = Mock()
        mock_cursor = Mock()
        mock_dbapi_connection.cursor.return_value = mock_cursor
        
        mock_connection_record = Mock()
        mock_connection_proxy = Mock()
        
        # Call the callback
        callback_function(mock_dbapi_connection, mock_connection_record, mock_connection_proxy)
        
        # Verify cursor operations
        mock_dbapi_connection.cursor.assert_called_once()
        mock_cursor.execute.assert_called_once_with("SET search_path TO test_schema,public")
        mock_cursor.close.assert_called_once()
