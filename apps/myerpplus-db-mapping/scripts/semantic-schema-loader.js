const path = require('path');
const {
  loadManifest,
  loadSchemaByKey,
  loadSchemaForQuery,
  inferSchemaKeyFromQuery,
} = require('./load-semantic-schema');

function getAvailableSchemas() {
  return loadManifest().schemas.map((schema) => ({
    key: schema.key,
    domain: schema.domain,
    file: schema.file,
    table_prefixes: schema.table_prefixes,
    description: schema.description,
  }));
}

function selectSchema(input = {}) {
  if (input.key) {
    return loadSchemaByKey(input.key);
  }

  if (input.query) {
    return loadSchemaForQuery(input.query);
  }

  return loadSchemaByKey('all');
}

function buildAgentContext(input = {}) {
  const selected = selectSchema(input);

  return {
    selected_key: selected.manifest.key,
    selected_domain: selected.manifest.domain,
    schema_file: selected.manifest.file,
    schema_path: path.resolve(selected.file_path),
    table_count: selected.schema.tables.length,
    available_schemas: getAvailableSchemas(),
    tables: selected.schema.tables,
  };
}

if (require.main === module) {
  const query = process.argv.slice(2).join(' ').trim();
  const context = buildAgentContext(query ? { query } : {});
  process.stdout.write(
    JSON.stringify(
      {
        selected_key: context.selected_key,
        selected_domain: context.selected_domain,
        schema_file: context.schema_file,
        schema_path: context.schema_path,
        table_count: context.table_count,
      },
      null,
      2,
    ) + '\n',
  );
}

module.exports = {
  buildAgentContext,
  getAvailableSchemas,
  inferSchemaKeyFromQuery,
  selectSchema,
};
