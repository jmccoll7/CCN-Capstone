declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SESSION_SECRET: string;
      DATABASE_URL: string;
      REDIS_URL: string;
      API_PORT: string;
      CORS_ORIGIN: string;
    }
  }
}

export {}
