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
    const existingUser = await prisma.user.findUnique({
      where: {
        email: credentials.email,
      },
    });

    if (existingUser) {
      return {
        success: false,
        message: authConstants.ERROR_MESSAGES.USER_ALREADY_EXISTS,
        data: null,
      };
    }

    const hashedPassword = await bcrypt.hash(credentials.password, 10);

    if (!authAdapterPrisma.createUser) {
      throw new Error("Internal server error");
    }

    const createdUser = await authAdapterPrisma.createUser({
      email: credentials.email,
      password: hashedPassword,
    });

    if (!authAdapterPrisma.createVerificationToken) {
      throw new Error("Internal server error");
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
      await prisma.user.delete({
        where: {
          id: createdUser.id,
        },
      });
      return {
        success: false,
        message: authConstants.ERROR_MESSAGES.ERROR_SIGN_UP_TOKEN,
        data: null,
      };
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

export { doSteppedRedirection, doSignIn, doSignUp };
