declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SESSION_SECRET: string;
      DB_URL: string;
      REDIS_URL: string;
      PORT: string;
      CORS_ORIGIN: string;
    }
  }
}

export {}
