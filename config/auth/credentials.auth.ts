import { AuthCredentialsError } from "@/errors/auth.errors";
import authAdapterPrisma from "@/lib/prisma/authAdapter.prisma";
import {
  PasswordSchema,
  CredentialsSchema,
} from "@/validation/auth.validation";
import CredentialsProvider from "next-auth/providers/credentials";
import slugify from "slugify";
import bcrypt from "bcryptjs";

const credentialsAuthConfig = CredentialsProvider({
  id: "credentials",
  name: "Credentials",
  type: "credentials",
  credentials: {
    username: { label: "Username" },
    password: { label: "Password", type: "password" },
  },
  authorize: async (credentials) => {
    const credentialsValidation = CredentialsSchema.safeParse(credentials);

    if (!credentialsValidation.success) {
      throw new AuthCredentialsError(
        slugify(credentialsValidation.error.errors.join(", "), {
          lower: true,
          replacement: "-",
          strict: true,
          trim: true,
          remove: /[*+~.()'"!:@]/g,
        })
      );
    }

    const passwordValidation = PasswordSchema.safeParse(credentials.password);

    if (!passwordValidation.success) {
      throw new AuthCredentialsError(
        slugify(passwordValidation.error.errors.join(", "), {
          lower: true,
          replacement: "-",
          strict: true,
          trim: true,
          remove: /[*+~.()'"!:@]/g,
        })
      );
    }

    const credentialsWithType = credentials as {
      username: string;
      password: string;
    };

    const user = await authAdapterPrisma.getUserByUsername(
      credentialsWithType.username
    );

    if (!user || !user.password) {
      throw new AuthCredentialsError("password-or-username-incorrect");
    }

    const isValid = bcrypt.compareSync(
      credentials.password as string,
      user.password
    );

    if (!isValid) {
      throw new AuthCredentialsError(
        "El correo electrónico o la contraseña son incorrectos"
      );
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  },
});



export default credentialsAuthConfig;