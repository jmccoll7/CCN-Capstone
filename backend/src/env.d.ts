declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SESSION_SECRET: string;
      DB_URL: string;
      REDIS_URL: string;
      API_PORT: string;
      CORS_ORIGIN: string;
      DB_NAME: string;
      DB_HOST: string;
      DB_USER: string;
      DB_PASSWORD: string;
    }
  }
}

export {}
