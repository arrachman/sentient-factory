{
  "name": "myerpplus-mysql-cdc",
  "config": {
    "connector.class": "io.debezium.connector.mysql.MySqlConnector",
    "tasks.max": "1",
    "topic.prefix": "myerpplus",
    "database.hostname": "${CDC_MYSQL_HOST}",
    "database.port": "${CDC_MYSQL_PORT}",
    "database.user": "${CDC_MYSQL_USER}",
    "database.password": "${CDC_MYSQL_PASSWORD}",
    "database.server.id": "${CDC_MYSQL_SERVER_ID}",
    "database.include.list": "${CDC_MYSQL_DATABASE}",
    "table.include.list": "${CDC_MYSQL_TABLE_INCLUDE_LIST}",
    "schema.history.internal.kafka.bootstrap.servers": "${KAFKA_BOOTSTRAP_SERVERS}",
    "schema.history.internal.kafka.topic": "schemahistory.myerpplus",
    "include.schema.changes": "false",
    "snapshot.mode": "initial",
    "decimal.handling.mode": "string",
    "time.precision.mode": "connect",
    "binary.handling.mode": "base64",
    "tombstones.on.delete": "false",
    "transforms": "unwrap",
    "transforms.unwrap.type": "io.debezium.transforms.ExtractNewRecordState",
    "transforms.unwrap.drop.tombstones": "true",
    "transforms.unwrap.delete.handling.mode": "rewrite"
  }
}
