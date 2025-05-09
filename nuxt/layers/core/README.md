[![License](https://img.shields.io/badge/License-BSD%203%20Clause-blue.svg)](LICENSE)

# Nuxt 3 Core Layer - SBC Connect Common

> [!IMPORTANT]
> All new projects should use the layer at the [nuxt-v2 branch](https://github.com/bcgov/sbc-connect-common/tree/nuxt-v2).

> This branch only supports: 
   - Nuxt v3.15.4, Nuxt/i18n v8.5.6, due to breaking changes in Nuxt v3.16+
   - Nuxt UI v2.22.0. For Nuxt UI v3+, please use the [nuxt-v2 branch](https://github.com/bcgov/sbc-connect-common/tree/nuxt-v2)

This layer was created to enhance developer experience when creating BCROS/SBC applications.

Included are items such as:

- The BC Gov colour theme
- BCSans fonts
- BC favicon
- BC Gov logos 
- Header and Footer components with relevant child components
- Keycloak integration
- Account Store with Pinia
- Internationalization

Also included are several common npm packages and nuxt modules.

- [Nuxt UI](https://ui.nuxt.com/)
- [Nuxt I18n](https://i18n.nuxtjs.org/?utm_source=nuxt.com&utm_medium=aside-module&utm_campaign=nuxt.com)
- [Pinia](https://pinia.vuejs.org/introduction.html)
- [Pinia Persisted State](https://prazdevs.github.io/pinia-plugin-persistedstate/?utm_source=nuxt.com&utm_medium=aside-module&utm_campaign=nuxt.com)
- [VueUse](https://vueuse.org/)
- [Keycloak](https://www.keycloak.org/docs/latest/securing_apps/index.html#_javascript_adapter)
- [Zod](https://zod.dev/)

## Development

Create a fork and local copy of this repo. Answer _Y_ to create a local clone.
```bash
gh repo fork bcgov/sbc-connect-common
```

Change into the directory and install the packages.
```bash
pnpm install
```

Start the development environment.
```bash
pnpm run dev
```

## Testing

Run Vitest in watch mode for unit tests
```bash
pnpm test
or
pnpm test:unit
```

## How to Contribute

If you would like to contribute, please see our [CONTRIBUTING](./CONTRIBUTING.md) guidelines.

Please note that this project is released with a [Contributor Code of Conduct](./CODE_OF_CONDUCT.md).
By participating in this project you agree to abide by its terms.

## Working on the layer

Your layer is at the root of this repository, it is exactly like a regular Nuxt project, except you can publish it on NPM.

The `.playground` directory should help you on trying your layer during development.

Running `pnpm dev` will prepare and boot `.playground` directory, which imports your layer itself.

## Distributing the layer

Your Nuxt layer is shaped exactly the same as any other Nuxt project, except you can publish it on NPM.

To do so, you only have to check if `files` in `package.json` are [valid](https://nuxt.com/docs/guide/going-further/layers#npm-package), then run:

```bash
npm publish --access public
```

Alternatively, you can run:

```bash
pnpm run publish <version>
```

Where `<version>` is either `patch`, `minor` or `major`. This will take care of `package.json` and update the version number for you, as well as publish to npm.

Once published, users can install the layer with:

```bash
npm install --save @sbc-connect/nuxt-core-layer
```

Then add the dependency to their `extends` in `nuxt.config`:

```ts
defineNuxtConfig({
  extends: '@sbc-connect/nuxt-core-layer'
})
```

## License
Copyright © 2024 Province of British Columbia

Licensed under the BSD 3 Clause License, (the "License");
you may not use this file except in compliance with the License.
The template for the license can be found here
   https://opensource.org/license/bsd-3-clause/

Redistribution and use in source and binary forms,
with or without modification, are permitted provided that the
following conditions are met:

1. Redistributions of source code must retain the above copyright notice,
   this list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice,
   this list of conditions and the following disclaimer in the documentation
   and/or other materials provided with the distribution.

3. Neither the name of the copyright holder nor the names of its contributors
   may be used to endorse or promote products derived from this software
   without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS “AS IS”
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO,
THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
POSSIBILITY OF SUCH DAMAGE.
