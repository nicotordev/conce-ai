"use server";

import { signIn } from "@/auth";
import { encryptData, generateHumanReadableToken } from "@/lib/crypto";
import logger from "@/lib/logger";
import authAdapterPrisma from "@/lib/prisma/authAdapter.prisma";
import prisma from "@/lib/prisma/index.prisma";
import { CredentialsSchema } from "@/validation/auth.validation";
import bcrypt from "bcryptjs";
import authConstants from "@/constants/auth.constants";
import { redirect } from "next/navigation";
import mailer from "@/mail/mail";

async function doSteppedRedirection<T extends object>(
  data: T
): Promise<ActionResponse<string>> {
  try {
    const encryptedData = encryptData(data);
    return {
      success: true,
      message: authConstants.SUCCESS_MESSAGES.SIGN_UP_REDIRECT,
      data: encryptedData,
    };
  } catch (err) {
    logger.error("[ACTIONS:DO_SIGN_UP_STEPPED_REDIRECTION]:", err);
    return {
      success: false,
      message: authConstants.ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      data: null,
    };
  }
}

async function doSignUp(credentials: {
  email: string;
  password: string;
}): Promise<ActionResponse<null>> {
  const credentialsValidation = CredentialsSchema.safeParse(credentials);

  if (!credentialsValidation.success) {
    return {
      success: false,
      message: authConstants.ERROR_MESSAGES.INVALID_CREDENTIALS,
      data: null,
    };
  }

  try {
    await prisma.$transaction(async (prismaTx) => {
      const existingUser = await prismaTx.user.findUnique({
        where: {
          email: credentials.email,
        },
      });
      if (existingUser) {
        throw new Error(authConstants.ERROR_MESSAGES.USER_ALREADY_EXISTS);
      }
      const hashedPassword = await bcrypt.hash(credentials.password, 10);

      if (!authAdapterPrisma.createUser) {
        throw new Error(authConstants.ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
      }

      const createdUser = await prismaTx.user.create({
        data: {
          email: credentials.email,
          password: hashedPassword,
          Role: {
            connectOrCreate: {
              where: {
                name: "USER",
              },
              create: {
                name: "USER",
              },
            },
          },
        },
      });

      await prismaTx.account.create({
        data: {
          userId: createdUser.id,
          providerType: "credentials",
          providerId: "credentials",
          providerAccountId: credentials.email,
        },
      });

      if (!authAdapterPrisma.createVerificationToken) {
        throw new Error(authConstants.ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
      }

      /**
       * expires in 1 hour
       */
      const createdToken = await authAdapterPrisma.createVerificationToken({
        identifier: createdUser.id,
        token: generateHumanReadableToken(6),
        expires: new Date(Date.now() + 3600000),
      });
      if (!createdToken) {
        throw new Error(authConstants.ERROR_MESSAGES.ERROR_SIGN_UP_TOKEN);
      }
      await mailer.sendWelcomeEmail({
        name: `${credentials.email.split("@")[0]}`,
        address: credentials.email,
      });

      await mailer.sendEmailVerificationEmail(
        {
          name: `${credentials.email.split("@")[0]}`,
          address: credentials.email,
        },
        createdToken.token,
        createdUser.id
      );
    });

    return {
      success: true,
      message: authConstants.SUCCESS_MESSAGES.SIGN_UP,
      data: null,
    };
  } catch (err) {
    logger.error("[ACTIONS:DO_SIGN_UP]:", err);
    return {
      success: false,
      message: authConstants.ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      data: null,
    };
  }
}

async function doSignIn(credentials: {
  email: string;
  password: string;
}): Promise<void> {
  let result: string = "";
  try {
    result = await signIn("credentials", {
      ...credentials,
      redirect: false,
      redirectTo: "/",
    });

    logger.info("[ACTIONS:DO_SIGN_IN]:", result);
  } catch (err) {
    logger.error("[ACTIONS:DO_SIGN_IN]:", err);
  } finally {
    return redirect(result);
  }
}

async function doEmailVerification(data: {
  code: string;
  userId: string;
}): Promise<ActionResponse<string>> {
  try {
    if (!authAdapterPrisma.useVerificationToken) {
      throw new Error("Internal server error");
    }

    const token = await authAdapterPrisma.useVerificationToken({
      identifier: data.userId,
      token: data.code,
    });

    if (!token) {
      return {
        success: false,
        message: authConstants.ERROR_MESSAGES.INVALID_VERIFICATION_TOKEN,
        data: null,
      };
    }

    const expiresAt = new Date(token.expires).getTime();

    if (expiresAt < Date.now()) {
      if (!authAdapterPrisma.createVerificationToken) {
        throw new Error(authConstants.ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
      }

      const user = await prisma.user.findUnique({
        where: {
          id: data.userId,
        },
      });

      if (!user || !user.email) {
        return {
          success: false,
          message: authConstants.ERROR_MESSAGES.INVALID_VERIFICATION_TOKEN,
          data: null,
        };
      }

      const createdToken = await authAdapterPrisma.createVerificationToken({
        identifier: data.userId,
        token: generateHumanReadableToken(6),
        expires: new Date(Date.now() + 3600000),
      });

      if (!createdToken) {
        throw new Error(authConstants.ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
      }

      await mailer.sendEmailVerificationEmail(
        {
          name: `${user.email.split("@")[0]}`,
          address: user.email,
        },
        createdToken.token,
        user.id
      );

      return {
        success: false,
        message: authConstants.ERROR_MESSAGES.EXPIRED_VERIFICATION_TOKEN,
        data: null,
      };
    }
  } catch (err) {
    logger.error("[ACTIONS:DO_EMAIL_VERIFICATION]:", err);
    return {
      success: false,
      message: authConstants.ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      data: null,
    };
  }
  return {
    success: false,
    message: authConstants.ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    data: null,
  };
}

export { doSteppedRedirection, doSignIn, doSignUp, doEmailVerification };
