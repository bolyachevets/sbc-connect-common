# Copyright © 2019 Province of British Columbia
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
"""Cloud SQL connection utilities for the Notify API service."""

from dataclasses import dataclass

from google.cloud.sql.connector import Connector
from sqlalchemy import event


@dataclass
class DBConfig:
    """Database configuration settings."""

    instance_name: str
    database: str
    user: str
    ip_type: str
    schema: str
    enable_iam_auth: bool = True
    driver: str = "pg8000"

    # Connection pool parameters
    pool_size: int = 5
    max_overflow: int = 2
    pool_timeout: int = 10
    pool_recycle: int = 300
    pool_use_lifo: bool = True
    pool_pre_ping: bool = True
    connect_args: dict = None

    def __post_init__(self):
        """Initialize default connect_args if not provided."""
        if self.connect_args is None:
            self.connect_args = {}

    def get_engine_options(self) -> dict:
        """Get SQLAlchemy engine options for this configuration.

        Returns:
            dict: Dictionary of engine options suitable for SQLAlchemy create_engine()
        """
        return {
            "creator": lambda: getconn(self),
            "pool_size": self.pool_size,
            "max_overflow": self.max_overflow,
            "pool_timeout": self.pool_timeout,
            "pool_recycle": self.pool_recycle,
            "pool_pre_ping": self.pool_pre_ping,
            "pool_use_lifo": self.pool_use_lifo,
            "connect_args": self.connect_args,
        }


def getconn(db_config: DBConfig) -> object:
    """Create a database connection.

    Args:
        db_config (DBConfig): The database configuration.

    Returns:
        object: A connection object to the database.
    """
    with Connector(refresh_strategy="lazy") as connector:
        conn = connector.connect(
            instance_connection_string=db_config.instance_name,
            db=db_config.database,
            user=db_config.user,
            ip_type=db_config.ip_type,
            driver=db_config.driver,
            enable_iam_auth=db_config.enable_iam_auth,
        )

        if db_config.schema:
            cursor = conn.cursor()
            cursor.execute(f"SET search_path TO {db_config.schema},public")
            cursor.execute(f"SET LOCAL search_path TO {db_config.schema}, public;")
            cursor.close()

        return conn


def setup_search_path_event_listener(engine, schema):
    """Set up an event listener to set the search path for a database connection.

    Args:
        engine: The SQLAlchemy engine object
        schema: The database schema name to use
    """

    @event.listens_for(engine, "checkout")
    def set_search_path_on_checkout(
        dbapi_connection, connection_record, connection_proxy
    ):
        cursor = dbapi_connection.cursor()
        cursor.execute(f"SET search_path TO {schema},public")
        cursor.close()
