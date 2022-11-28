import 'express-session';

declare module 'express-session' {
  interface Session {
    user?: {
      isLogged: boolean;
      isAdmin?: boolean;

      // Declare here your session data
    };
  }
}
