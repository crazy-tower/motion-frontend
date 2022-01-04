namespace NodeJS {
  interface ProcessEnv extends NodeJS.ProcessEnv {
    NEXT_PUBLIC_FRONTEND_SERVER: string;
    NEXT_PUBLIC_SIGNALING_SERVER: string;
  }
}
