/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly GITHUB_SHA: string;
  readonly GITHUB_REF_NAME: string;
  readonly COMMIT_REF: string;
  readonly PUBLIC_API_HOST: string;
  readonly PUBLIC_OIDC_URL: string;
  readonly PUBLIC_OIDC_CLIENT_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
