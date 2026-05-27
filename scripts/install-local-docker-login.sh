#!/usr/bin/env bash
# Deprecated: this script used to replace the stock OpenMRS login module.
# Use install-local-docker-customizations.sh for forkless GCHMIS UI customizations.

set -euo pipefail

echo "ERROR: install-local-docker-login.sh is deprecated because it replaces @openmrs/esm-login-app." >&2
echo "Use ./scripts/install-local-docker-customizations.sh instead." >&2
exit 1
