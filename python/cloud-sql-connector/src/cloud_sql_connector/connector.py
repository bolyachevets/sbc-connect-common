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
            driver="pg8000",
            enable_iam_auth=True,
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
