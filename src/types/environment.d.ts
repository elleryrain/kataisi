declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      BOT_TOKEN: string;
    }
  }
}

export {};
