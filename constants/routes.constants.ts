const allRoutes = {
  home: "/",
  authSignIn: "/auth/sign-in",
  authSignUp: "/auth/sign-up",
  authSignOut: "/auth/sign-out",
  authForgotPassword: "/auth/forgot-password",
  authResetPassword: "/auth/reset-password",
  authVerifyEmail: "/auth/email-verification",
};

const routesConstants = {
  allRoutes: allRoutes,
  protectedPaths: {
    authVerifyEmail: allRoutes.authVerifyEmail,
  },
  noAuth: {
    authSignIn: allRoutes.authSignIn,
    authSignUp: allRoutes.authSignUp,
    authForgotPassword: allRoutes.authForgotPassword,
  },
  adminPaths: {},
};

export default routesConstants;
