#!/usr/bin/env bash
# Build and install the additive GCHMIS customization module into the local
# OpenMRS frontend container without replacing stock OpenMRS ESMs.
#
# Environment overrides:
#   FRONTEND_CONTAINER=gch-openmrs-refapp-frontend-1
#   HTML_ROOT=/usr/share/nginx/html
#   PACKAGE_DIR=gchmis-esm-ui-customizations-app-local-<timestamp>
#   SKIP_BUILD=true

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
FRONTEND_CONTAINER="${FRONTEND_CONTAINER:-gch-openmrs-refapp-frontend-1}"
HTML_ROOT="${HTML_ROOT:-/usr/share/nginx/html}"
PACKAGE_DIR="${PACKAGE_DIR:-gchmis-esm-ui-customizations-app-local-$(date +%Y%m%d%H%M%S)}"
DIST_DIR="$ROOT_DIR/dist"
TMP_DIR="$(mktemp -d)"

cleanup() {
  rm -rf "$TMP_DIR"
}
trap cleanup EXIT

cd "$ROOT_DIR"

if [[ "${SKIP_BUILD:-false}" != "true" ]]; then
  npm run build
fi

if [[ ! -f "$DIST_DIR/gchmis-esm-ui-customizations-app.js" ]]; then
  echo "Missing $DIST_DIR/gchmis-esm-ui-customizations-app.js. Run npm run build first, or unset SKIP_BUILD."
  exit 1
fi

docker exec "$FRONTEND_CONTAINER" sh -lc "mkdir -p '$HTML_ROOT/$PACKAGE_DIR'"
docker cp "$DIST_DIR/." "$FRONTEND_CONTAINER:$HTML_ROOT/$PACKAGE_DIR/"
docker cp "$FRONTEND_CONTAINER:$HTML_ROOT/importmap.json" "$TMP_DIR/importmap.json"
docker cp "$FRONTEND_CONTAINER:$HTML_ROOT/routes.registry.json" "$TMP_DIR/routes.registry.json"

node - "$TMP_DIR/importmap.json" "$TMP_DIR/routes.registry.json" "$ROOT_DIR/src/routes.json" "$ROOT_DIR/package.json" "$PACKAGE_DIR" <<'NODE'
const fs = require('node:fs');

const [, , importmapPath, routesRegistryPath, localRoutesPath, packagePath, packageDir] = process.argv;
const importmap = JSON.parse(fs.readFileSync(importmapPath, 'utf8'));
const routesRegistry = JSON.parse(fs.readFileSync(routesRegistryPath, 'utf8'));
const localRoutes = JSON.parse(fs.readFileSync(localRoutesPath, 'utf8'));
const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

importmap.imports = importmap.imports || {};
importmap.imports[pkg.name] = `./${packageDir}/gchmis-esm-ui-customizations-app.js`;

routesRegistry[pkg.name] = {
  ...localRoutes,
  version: `${pkg.version}-gchmis`,
};

fs.writeFileSync(importmapPath, `${JSON.stringify(importmap)}\n`);
fs.writeFileSync(routesRegistryPath, `${JSON.stringify(routesRegistry)}\n`);
NODE

docker cp "$TMP_DIR/importmap.json" "$FRONTEND_CONTAINER:$HTML_ROOT/importmap.json"
docker cp "$TMP_DIR/routes.registry.json" "$FRONTEND_CONTAINER:$HTML_ROOT/routes.registry.json"

echo "Installed additive GCHMIS customizations as @gchmis/esm-ui-customizations-app in $FRONTEND_CONTAINER."
echo "Stock @openmrs/esm-login-app remains owned by the OpenMRS distribution."
