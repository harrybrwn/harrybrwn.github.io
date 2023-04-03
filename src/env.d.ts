/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly GITHUB_SHA: string;
  readonly GITHUB_REF_NAME: string;
  readonly PUBLIC_API_HOST: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
