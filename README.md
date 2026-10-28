# GCHMIS OpenMRS UI Customizations

Additive OpenMRS 3 frontend module for GCHMIS-wide UI customizations.

This package is intentionally named `@gchmis/esm-ui-customizations-app`. It must not be published or installed as `@openmrs/esm-login-app`, because stock OpenMRS modules should remain owned by OpenMRS.

## What This Owns

- A global no-UI theme loader that imports GCHMIS CSS variables and Carbon button overrides.
- An authentication guard that redirects unauthenticated `/login/location` visits to `/login`.
- Future login slot extensions for GCHMIS brand panel, form header, and footer content.
- GCHMIS-specific frontend configuration examples in the config repository.

It does not replace authentication, session handling, location selection, OpenMRS backend APIs, or any stock OpenMRS module route.

## Local Development

Install dependencies:

```sh
npm install
```

Run against an OpenMRS backend:

```sh
npm run start:local
```

Build and check:

```sh
npm run lint
npm run typescript
npm test
npm run build
```

## OpenMRS Integration

Build the module and publish or host the generated bundle:

```sh
npm run build
```

For the local Docker frontend container, build and install the additive customization module with:

```sh
npm run install:docker-customizations
```

This copies the built bundle into the frontend container and updates the container's `importmap.json` and `routes.registry.json` so `@gchmis/esm-ui-customizations-app` is loaded. It does not change the import map entry for `@openmrs/esm-login-app`.

## Branding Config

The version-controlled O3 config layer lives in:

```sh
../gchmis-openmrs-config/frontend/config-core-gchmis.json
```

Use that file for official O3 branding keys such as:

- `@openmrs/esm-styleguide` brand colors
- `@openmrs/esm-primary-navigation-app` navbar logo
- `@openmrs/esm-login-app` stock login logo and supported config
