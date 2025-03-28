const allRoutes = {
  home: "/",
  auth: {
    index: "/auth",
    authSignIn: "/auth/sign-in",
    authSignUp: "/auth/sign-up",
    authSignOut: "/api/auth/sign-out",
    authResetPassword: "/auth/reset-password",
    authVerifyEmail: "/auth/email-verification",
  },
  app: "/app",
  admin: {
    index: "/admin",
  },
  api: {
    conceAI: {
      userModels: "/api/conce-ai/models",
    },
    crypto: {
      decrypt: "/api/crypto/decrypt",
      encrypt: "/api/crypto/encrypt",
    },
  },
};

const routesConstants = {
  allRoutes: allRoutes,
  protectedPaths: {
    app: allRoutes.app,
  },
  noAuth: {
    authIndex: allRoutes.auth.index,
    authSignIn: allRoutes.auth.authSignIn,
    authSignUp: allRoutes.auth.authSignUp,
  },
  adminPaths: {
    admin: allRoutes.admin,
  },
};

export default routesConstants;
