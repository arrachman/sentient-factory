"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadVaultSecrets = loadVaultSecrets;
function parseBoolean(value, defaultValue = false) {
    if (value === undefined) {
        return defaultValue;
    }
    return ['1', 'true', 'yes', 'on'].includes(value.toLowerCase());
}
function trimSlashes(value) {
    return value.replace(/^\/+|\/+$/g, '');
}
async function fetchVaultJson(url, init) {
    const response = await fetch(url, init);
    if (!response.ok) {
        const body = await response.text();
        throw new Error(`Vault request failed (${response.status}): ${body}`);
    }
    return response.json();
}
async function loadVaultSecrets() {
    const enabled = parseBoolean(process.env.VAULT_ENABLED, false);
    if (!enabled) {
        return;
    }
    const vaultAddr = process.env.VAULT_ADDR;
    const vaultToken = process.env.VAULT_TOKEN;
    const secretsPath = process.env.VAULT_SECRETS_PATH;
    const kvMount = trimSlashes(process.env.VAULT_KV_MOUNT || 'secret');
    if (!vaultAddr || !vaultToken || !secretsPath) {
        throw new Error('Vault is enabled but VAULT_ADDR, VAULT_TOKEN, or VAULT_SECRETS_PATH is missing');
    }
    const normalizedPath = trimSlashes(secretsPath);
    const namespace = process.env.VAULT_NAMESPACE;
    const overwrite = parseBoolean(process.env.VAULT_OVERWRITE_ENV, false);
    const headers = {
        'X-Vault-Token': vaultToken,
    };
    if (namespace) {
        headers['X-Vault-Namespace'] = namespace;
    }
    const metadataUrl = `${vaultAddr.replace(/\/$/, '')}/v1/sys/mounts/${kvMount}`;
    const metadata = await fetchVaultJson(metadataUrl, { headers });
    const options = metadata?.data?.options || {};
    const isV2 = options.version === '2';
    const secretUrl = isV2
        ? `${vaultAddr.replace(/\/$/, '')}/v1/${kvMount}/data/${normalizedPath}`
        : `${vaultAddr.replace(/\/$/, '')}/v1/${kvMount}/${normalizedPath}`;
    const secretPayload = await fetchVaultJson(secretUrl, { headers });
    const secrets = isV2
        ? (secretPayload?.data?.data ?? {})
        : (secretPayload?.data ?? {});
    for (const [key, value] of Object.entries(secrets)) {
        if (value === undefined || value === null) {
            continue;
        }
        if (overwrite || process.env[key] === undefined) {
            process.env[key] = String(value);
        }
    }
    process.env.VAULT_SECRETS_LOADED = 'true';
}
//# sourceMappingURL=vault.js.map