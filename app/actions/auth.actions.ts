"use server";

import { signIn } from "@/auth";
import {  encryptData } from "@/lib/crypto";
import logger from "@/lib/logger";
import authAdapterPrisma from "@/lib/prisma/authAdapter.prisma";
import prisma from "@/lib/prisma/index.prisma";
import { SignUpPageStep } from "@/types/auth.enum";
import { CredentialsSchema } from "@/validation/auth.validation";
import bcrypt from "bcryptjs";

async function doSignUpSteppedRedirection(data: {
  email?: string;
  password?: string;
  step: SignUpPageStep;
}): Promise<ActionResponse<string>> {
  try {
    const encryptedData = encryptData(data);
    return {
      success: true,
      message: "success",
      data: encryptedData,
    };
  } catch (err) {
    logger.error("[ACTIONS:DO_SIGN_UP_STEPPED_REDIRECTION]:", err);
    return {
      success: false,
      message: "internal-server-error",
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
      message: "invalid-credentials",
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
        message: "user-exists",
        data: null,
      };
    }

    const hashedPassword = await bcrypt.hash(credentials.password, 10);

    await authAdapterPrisma.createUser({
      email: credentials.email,
      password: hashedPassword,
    });

    return {
      success: true,
      message: "success",
      data: null,
    };
  } catch (err) {
    logger.error("[ACTIONS:DO_SIGN_UP]:", err);
    return {
      success: false,
      message: "internal-server-error",
      data: null,
    };
  }
}

async function doSignIn(credentials: {
  email: string;
  password: string;
}): Promise<ActionResponse<string>> {
  try {
    const signInResponse = await signIn("credentials", credentials);
    return signInResponse;
  } catch (err) {
    logger.error("[ACTIONS:DO_SIGN_IN]:", err);
    return {
      success: false,
      message: "internal-server-error",
      data: null,
    };
  }
}

export { doSignUpSteppedRedirection, doSignIn, doSignUp };
