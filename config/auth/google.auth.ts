import GoogleProvider, { GoogleProfile } from "next-auth/providers/google";

const googleAuthConfig = GoogleProvider({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  allowDangerousEmailAccountLinking: true, // Permitir vincular cuentas con el mismo email
  profile(profile: GoogleProfile) {
    // Verificar si el email está verificado antes de crear el usuario
    if (!profile.email_verified) {
      throw new Error("El email no está verificado por Google");
    }

    const googleProfile = {
      id: profile.sub,
      name: profile.name,
      email: profile.email,
      image: profile.picture,
      emailVerified: profile.email_verified ? new Date() : null,
      password: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      roleId: null,
      Role: null,
    }

    console.log(googleProfile, "Google profile");


    return googleProfile;
  },
});

export default googleAuthConfig;
