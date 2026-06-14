"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderTemplate = renderTemplate;
exports.extractVariables = extractVariables;
function renderTemplate(body, variables = {}) {
    return body.replace(/\{\{(\w+)\}\}/g, (match, key) => {
        const value = variables[key];
        if (value === undefined || value === null)
            return match;
        return String(value);
    });
}
function extractVariables(body) {
    const matches = body.matchAll(/\{\{(\w+)\}\}/g);
    return Array.from(new Set([...matches].map((m) => m[1])));
}
//# sourceMappingURL=template-renderer.js.map