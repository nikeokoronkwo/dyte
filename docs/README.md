# Spurte Documentation
Included here is the documentation on the `spurte` tool.

## How does it work?
As of the current version, Spurte makes use of the Deno Bundler and Transpiler ([deno_emit](https://github.com/denoland/deno_emit)) for dev builds, and ESBuild for production builds. As of now, ESBuild is the recommended bundler to use for Deno Projects (https://github.com/denoland/std/issues/4586), alongside the [esbuild-deno-loader](https://jsr.io/@luca/esbuild-deno-loader) to resolve imports. 