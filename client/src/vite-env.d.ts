/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BASE_ENDPOINT: string
  readonly VITE_STRIPE_PUBLISHABLE_KEY: string
  readonly VITE_ELASTIC_APM_SERVER: string
  // add more VITE_ variables here if you use them
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
