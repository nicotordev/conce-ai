const allRoutes = {
  home: "/",
  authSignIn: "/auth/sign-in",
  authSignUp: "/auth/sign-up",
  authSignOut: "/api/auth/sign-out",
  authResetPassword: "/auth/reset-password",
  authVerifyEmail: "/auth/email-verification",
  app: "/app",
};

const routesConstants = {
  allRoutes: allRoutes,
  protectedPaths: {
    app: allRoutes.app,
  },
  noAuth: {
    authSignIn: allRoutes.authSignIn,
    authSignUp: allRoutes.authSignUp,
  },
  adminPaths: {},
};

export default routesConstants;
