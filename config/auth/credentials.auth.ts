import { AuthCredentialsError } from "@/errors/auth.errors";
import authAdapterPrisma from "@/lib/prisma/authAdapter.prisma";
import {
  PasswordSchema,
  CredentialsSchema,
} from "@/validation/auth.validation";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { User } from "next-auth";
import authConstants from "@/constants/auth.constants";

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
        authConstants.ERROR_MESSAGES_CODES.INVALID_CREDENTIALS
      );
    }

    const passwordValidation = PasswordSchema.safeParse(credentials.password);

    if (!passwordValidation.success) {
      throw new AuthCredentialsError(
        authConstants.ERROR_MESSAGES_CODES.INTERNAL_SERVER_ERROR
      );
    }

    const credentialsWithType = credentials as {
      email: string;
      password: string;
    };

    if (!authAdapterPrisma.getUserByEmail) {
      throw new AuthCredentialsError(
        authConstants.ERROR_MESSAGES_CODES.INTERNAL_SERVER_ERROR
      );
    }

    const user = await authAdapterPrisma.getUserByEmail(
      credentialsWithType.email
    );

    if (!user || !user.password) {
      throw new AuthCredentialsError(
        authConstants.ERROR_MESSAGES_CODES.INVALID_CREDENTIALS
      );
    }

    const isValid = bcrypt.compareSync(
      credentials.password as string,
      user.password
    );

    if (!isValid) {
      throw new AuthCredentialsError(
        authConstants.ERROR_MESSAGES_CODES.INVALID_CREDENTIALS
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
