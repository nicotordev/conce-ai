import { AuthCredentialsError } from "@/errors/auth.errors";
import authAdapterPrisma from "@/lib/prisma/authAdapter.prisma";
import {
  PasswordSchema,
  CredentialsSchema,
} from "@/validation/auth.validation";
import CredentialsProvider from "next-auth/providers/credentials";
import slugify from "slugify";
import bcrypt from "bcryptjs";
import { User } from "next-auth";

const credentialsAuthConfig = CredentialsProvider({
  id: "credentials",
  name: "Credentials",
  type: "credentials",
  credentials: {
    email: { label: "Email" },
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
      email: string;
      password: string;
    };

    if (!authAdapterPrisma.getUserByEmail) {
      throw new AuthCredentialsError("internal-server-error");
    }

    const user = await authAdapterPrisma.getUserByEmail(
      credentialsWithType.email
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

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = user;

    return {
      ...rest,
    } as User;
  },
});

export default credentialsAuthConfig;
