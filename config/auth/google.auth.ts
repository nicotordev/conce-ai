import GoogleProvider from "next-auth/providers/google";

const googleAuthConfig = GoogleProvider({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  allowDangerousEmailAccountLinking: true,
});


export default googleAuthConfig;