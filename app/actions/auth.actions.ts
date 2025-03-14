"use server";

import { signIn } from "@/auth";
import { encryptData } from "@/lib/crypto";
import logger from "@/lib/logger";
import authAdapterPrisma from "@/lib/prisma/authAdapter.prisma";
import prisma from "@/lib/prisma/index.prisma";
import { SignUpPageStep } from "@/types/auth.enum";
import { CredentialsSchema } from "@/validation/auth.validation";
import bcrypt from "bcryptjs";
import authConstants from "@/constants/auth.constants";

async function doSignUpSteppedRedirection(data: {
  email?: string;
  password?: string;
  step: SignUpPageStep;
}): Promise<ActionResponse<string>> {
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

    await authAdapterPrisma.createUser({
      email: credentials.email,
      password: hashedPassword,
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
}): Promise<ActionResponse<string>> {
  try {
    const result = await signIn("credentials", {
      ...credentials,
      redirect: false,
    });

    return {
      success: true,
      message: authConstants.SUCCESS_MESSAGES.SIGN_IN,
      data: result,
    };
  } catch (err) {
    logger.error("[ACTIONS:DO_SIGN_IN]:", err);
    return {
      success: false,
      message: authConstants.ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      data: null,
    };
  }
}

export { doSignUpSteppedRedirection, doSignIn, doSignUp };
