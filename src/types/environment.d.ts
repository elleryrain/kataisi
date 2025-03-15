declare global {
  namespace NodeJS {
    export interface ProcessEnv {
      PORT: string;
      BOT_TOKEN: string;
    }
  }
}
