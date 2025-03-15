"use server";

import { signIn } from "@/auth";
import { encryptData, generateHumanReadableToken } from "@/lib/crypto";
import logger from "@/lib/logger";
import authAdapterPrisma from "@/lib/prisma/authAdapter.prisma";
import prisma from "@/lib/prisma/index.prisma";
import {
  CredentialsSchema,
  EmailSchema,
  EmailVerificationSchema,
  PasswordResetSchema,
} from "@/validation/auth.validation";
import bcrypt from "bcryptjs";
import authConstants from "@/constants/auth.constants";
import mailer from "@/mail/mail";
import { AuthError, CredentialsSignin } from "next-auth";
import { redirect } from "next/navigation";
import { ResetPasswordStep } from "@/types/auth.enum";

async function doSteppedRedirection<T extends object>(
  data: T
): Promise<ActionResponse<string>> {
  try {
    const encryptedData = encryptData(data);
    return {
      success: true,
      message: authConstants.SUCCESS_MESSAGES_CODES.SIGN_UP_REDIRECT,
      data: encryptedData,
    };
  } catch (err) {
    logger.error("[ACTIONS:DO_SIGN_UP_STEPPED_REDIRECTION]:", err);
    return {
      success: false,
      message: authConstants.ERROR_MESSAGES_CODES.INTERNAL_SERVER_ERROR,
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
      message: authConstants.ERROR_MESSAGES_CODES.INVALID_CREDENTIALS,
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
        throw new Error(authConstants.ERROR_MESSAGES_CODES.USER_ALREADY_EXISTS);
      }
      const hashedPassword = await bcrypt.hash(credentials.password, 10);

      if (!authAdapterPrisma.createUser) {
        throw new Error(
          authConstants.ERROR_MESSAGES_CODES.INTERNAL_SERVER_ERROR
        );
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
          type: "credentials",
          provider: "credentials",
          providerAccountId: createdUser.id,
        },
      });

      if (!authAdapterPrisma.createVerificationToken) {
        throw new Error(
          authConstants.ERROR_MESSAGES_CODES.INTERNAL_SERVER_ERROR
        );
      }

      /**
       * expires in 1 hour
       */
      const createdToken = await authAdapterPrisma.createVerificationToken(
        {
          identifier: createdUser.id,
          token: generateHumanReadableToken(6),
          expires: new Date(Date.now() + 3600000),
        },
        prismaTx
      );
      if (!createdToken) {
        throw new Error(authConstants.ERROR_MESSAGES_CODES.ERROR_SIGN_UP_TOKEN);
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
      message: authConstants.SUCCESS_MESSAGES_CODES.SIGN_UP,
      data: null,
    };
  } catch (err) {
    logger.error("[ACTIONS:DO_SIGN_UP]:", err);
    return {
      success: false,
      message: authConstants.ERROR_MESSAGES_CODES.INTERNAL_SERVER_ERROR,
      data: null,
    };
  }
}

async function doSignIn(
  credentials: {
    email: string;
    password: string;
  },
  step: string
): Promise<void> {
  let error: AuthError | null = null;
  try {
    const formData = new FormData();
    formData.append("email", credentials.email);
    formData.append("password", credentials.password);
    await signIn("credentials", formData);
  } catch (err) {
    error = err as CredentialsSignin;
  } finally {
    if (error) {
      return redirect(
        `/auth/sign-in?state=${encryptData({
          email: credentials.email,
          password: credentials.password,
          step: step,
          error:
            "code" in error
              ? error.code
              : authConstants.ERROR_MESSAGES_CODES.INTERNAL_SERVER_ERROR,
        })}`
      );
    }
  }
}

async function doEmailVerification(data: {
  code: string;
  userId: string;
}): Promise<ActionResponse<null>> {
  const emailVerificationValidation = EmailVerificationSchema.safeParse(data);

  if (!emailVerificationValidation.success) {
    return {
      success: false,
      data: null,
      message: emailVerificationValidation.error.errors[0].message,
    };
  }

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
        message: authConstants.ERROR_MESSAGES_CODES.INVALID_VERIFICATION_TOKEN,
        data: null,
      };
    }

    const expiresAt = new Date(token.expires).getTime();

    if (expiresAt < Date.now()) {
      if (!authAdapterPrisma.createVerificationToken) {
        throw new Error(
          authConstants.ERROR_MESSAGES_CODES.INTERNAL_SERVER_ERROR
        );
      }

      const user = await prisma.user.findUnique({
        where: {
          id: data.userId,
        },
      });

      if (!user || !user.email) {
        return {
          success: false,
          message:
            authConstants.ERROR_MESSAGES_CODES.INVALID_VERIFICATION_TOKEN,
          data: null,
        };
      }

      const createdToken = await authAdapterPrisma.createVerificationToken({
        identifier: data.userId,
        token: generateHumanReadableToken(6),
        expires: new Date(Date.now() + 3600000),
      });

      if (!createdToken) {
        throw new Error(
          authConstants.ERROR_MESSAGES_CODES.INTERNAL_SERVER_ERROR
        );
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
        message: authConstants.ERROR_MESSAGES_CODES.EXPIRED_VERIFICATION_TOKEN,
        data: null,
      };
    }
  } catch (err) {
    logger.error("[ACTIONS:DO_EMAIL_VERIFICATION]:", err);
    return {
      success: false,
      message: authConstants.ERROR_MESSAGES_CODES.INTERNAL_SERVER_ERROR,
      data: null,
    };
  }
  return {
    success: false,
    message: authConstants.ERROR_MESSAGES_CODES.INTERNAL_SERVER_ERROR,
    data: null,
  };
}

async function doEmailResend(data: {
  email: string;
}): Promise<ActionResponse<null>> {
  const emailVerificationValidation = EmailSchema.safeParse(data.email);

  if (!emailVerificationValidation.success) {
    return {
      success: false,
      data: null,
      message: emailVerificationValidation.error.errors[0].message,
    };
  }

  try {
    if (!authAdapterPrisma.createVerificationToken) {
      throw new Error(authConstants.ERROR_MESSAGES_CODES.INTERNAL_SERVER_ERROR);
    }

    const user = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (!user || !user.email) {
      return {
        success: false,
        message: authConstants.ERROR_MESSAGES_CODES.INVALID_USER,
        data: null,
      };
    }

    const createdToken = await authAdapterPrisma.createVerificationToken({
      identifier: user.id,
      token: generateHumanReadableToken(6),
      expires: new Date(Date.now() + 3600000),
    });

    if (!createdToken) {
      throw new Error(authConstants.ERROR_MESSAGES_CODES.INTERNAL_SERVER_ERROR);
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
      success: true,
      message: authConstants.SUCCESS_MESSAGES_CODES.EMAIL_RESEND,
      data: null,
    };
  } catch (err) {
    logger.error("[ACTIONS:DO_EMAIL_RESEND]:", err);
    return {
      success: false,
      message: authConstants.ERROR_MESSAGES_CODES.INTERNAL_SERVER_ERROR,
      data: null,
    };
  }
}

async function doSendResetPasswordRedirection<T extends object>(
  data: T
): Promise<void> {
  redirect(`/auth/reset-password?state=${encryptData(data)}`);
}
async function doSendResetPasswordEmail(data: { email: string }) {
  try {
    const emailVerificationValidation = EmailSchema.safeParse(data.email);

    if (!emailVerificationValidation.success) {
      logger.info(
        "[ACTIONS:DO_SEND_RESET_PASSWORD_EMAIL]:",
        emailVerificationValidation.error.errors[0].message
      );
      return await doSendResetPasswordRedirection({
        step: ResetPasswordStep.email,
        email: data.email,
        error: emailVerificationValidation.error.errors[0].message,
      });
    }

    if (!authAdapterPrisma.createVerificationToken) {
      logger.info(
        "[ACTIONS:DO_SEND_RESET_PASSWORD_EMAIL]:",
        "La función createVerificationToken no está disponible"
      );
      return await doSendResetPasswordRedirection({
        step: ResetPasswordStep.email,
        email: data.email,
        error: authConstants.ERROR_MESSAGES_CODES.INTERNAL_SERVER_ERROR,
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (!user || !user.email) {
      logger.info(
        "[ACTIONS:DO_SEND_RESET_PASSWORD_EMAIL]:",
        "No se encontró el usuario"
      );
      return await doSendResetPasswordRedirection({
        step: ResetPasswordStep.email,
        email: data.email,
        error: authConstants.ERROR_MESSAGES_CODES.INVALID_USER,
      });
    }

    const createdToken = await authAdapterPrisma.createVerificationToken({
      identifier: user.id,
      token: generateHumanReadableToken(6),
      expires: new Date(Date.now() + 3600000),
    });

    if (!createdToken) {
      logger.error(
        "[ACTIONS:DO_SEND_RESET_PASSWORD_EMAIL]:",
        "No se pudo crear el token, error interno"
      );
      return await doSendResetPasswordRedirection({
        step: ResetPasswordStep.email,
        email: data.email,
        error: authConstants.ERROR_MESSAGES_CODES.INTERNAL_SERVER_ERROR,
      });
    }

    await mailer.sendResetPasswordEmail(
      {
        name: `${user.email.split("@")[0]}`,
        address: user.email,
      },
      createdToken.token,
      user.id
    );

    return await doSendResetPasswordRedirection({
      step: ResetPasswordStep.resend,
      email: data.email,
    });
  } catch (err) {
    logger.error("[ACTIONS:DO_SEND_RESET_PASSWORD_EMAIL]:", err);
    return await doSendResetPasswordRedirection({
      step: ResetPasswordStep.email,
      email: data.email,
      error: authConstants.ERROR_MESSAGES_CODES.INTERNAL_SERVER_ERROR,
    });
  }
}

async function doResetPasswordEmail(data: {
  email: string;
  token: string;
  password: string;
}): Promise<ActionResponse<null>> {
  const passwordResetValidation = PasswordResetSchema.safeParse(data.email);

  if (passwordResetValidation.success === false) {
    return {
      success: false,
      data: null,
      message: passwordResetValidation.error.errors[0].message,
    };
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (!user || !user.email) {
      return redirect(
        `/auth/reset-password?state=${encryptData({
          step: ResetPasswordStep.email,
          email: data.email,
          error: authConstants.ERROR_MESSAGES_CODES.INVALID_USER,
        })}`
      );
    }

    if (!authAdapterPrisma.useVerificationToken) {
      throw new Error(authConstants.ERROR_MESSAGES_CODES.INTERNAL_SERVER_ERROR);
    }

    const token = await authAdapterPrisma.useVerificationToken({
      identifier: user.id,
      token: data.token,
    });

    if (!token) {
      return redirect(
        `/auth/reset-password?state=${encryptData({
          step: ResetPasswordStep.email,
          email: data.email,
          error:
            authConstants.ERROR_MESSAGES_CODES.INVALID_RESET_PASSWORD_TOKEN,
        })}`
      );
    }

    const expiresAt = new Date(token.expires).getTime();

    if (expiresAt < Date.now()) {
      const newToken = await authAdapterPrisma.createVerificationToken({
        identifier: user.id,
        token: generateHumanReadableToken(6),
        expires: new Date(Date.now() + 3600000),
      });

      if (!newToken) {
        throw new Error(
          authConstants.ERROR_MESSAGES_CODES.INTERNAL_SERVER_ERROR
        );
      }

      await mailer.sendResetPasswordEmail(
        {
          name: `${user.email.split("@")[0]}`,
          address: user.email,
        },
        newToken.token,
        user.id
      );

      return redirect(
        `/auth/reset-password?state=${encryptData({
          step: ResetPasswordStep.expired,
          email: data.email,
          error:
            authConstants.ERROR_MESSAGES_CODES.EXPIRED_RESET_PASSWORD_TOKEN,
        })}`
      );
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: hashedPassword,
      },
    });

    return {
      success: true,
      message: authConstants.SUCCESS_MESSAGES_CODES.SIGN_UP,
      data: null,
    };
  } catch (err) {
    logger.error("[ACTIONS:DO_RESET_PASSWORD_EMAIL]:", err);
    return redirect(
      `/auth/reset-password?state=${encryptData({
        step: ResetPasswordStep.email,
        email: data.email,
        error: authConstants.ERROR_MESSAGES_CODES.INTERNAL_SERVER_ERROR,
      })}`
    );
  }
}

export {
  doSteppedRedirection,
  doSignIn,
  doSignUp,
  doEmailVerification,
  doEmailResend,
  doSendResetPasswordEmail,
  doResetPasswordEmail,
};
