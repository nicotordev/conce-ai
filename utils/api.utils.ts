import { auth } from "@/auth";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import apiConstants from "@/constants/api.constants";
import logger from "@/lib/consola/logger";
import { AxiosError } from "axios";
import { NextURL } from "next/dist/server/web/next-url";
import { NextResponse } from "next/server";
import { CustomApiHandler } from "@/types/api";

class ApiResponse {
  constructor() {}

  static ok<T = null>(data?: T, message = "OK") {
    return NextResponse.json(
      {
        data: data || null,
        meta: {
          message,
          status: apiConstants.RESPONSES.OK.CODE,
          ok: true,
        },
      },
      {
        status: apiConstants.RESPONSES.OK.CODE,
      }
    );
  }

  static success<T = null>(data?: T, message = "Exito") {
    return NextResponse.json(
      {
        data: data || null,
        meta: {
          message,
          status: apiConstants.RESPONSES.SUCCESS.CODE,
          ok: true,
        },
      },
      { status: apiConstants.RESPONSES.SUCCESS.CODE }
    );
  }

  static created<T = null>(data: T, message = "Recurso Creado") {
    return NextResponse.json(
      {
        data: data || null,
        meta: {
          message,
          status: apiConstants.RESPONSES.CREATED.CODE,
          ok: true,
        },
      },
      { status: apiConstants.RESPONSES.CREATED.CODE }
    );
  }

  static accepted<T = null>(data: T, message = "Aceptado") {
    return NextResponse.json(
      {
        data: data || null,
        meta: {
          message,
          status: apiConstants.RESPONSES.ACCEPTED.CODE,
          ok: true,
        },
      },
      { status: apiConstants.RESPONSES.ACCEPTED.CODE }
    );
  }

  static noContent(message = "Sin contenido") {
    return NextResponse.json(
      {
        data: null,
        meta: {
          message,
          status: apiConstants.RESPONSES.NO_CONTENT.CODE,
          ok: true,
        },
      },
      { status: apiConstants.RESPONSES.NO_CONTENT.CODE }
    );
  }

  static badRequest(message = "Solicitud incorrecta", errors: string[] = []) {
    return NextResponse.json(
      {
        data: errors,
        meta: {
          message,
          status: apiConstants.RESPONSES.BAD_REQUEST.CODE,
          ok: false,
        },
      },
      { status: apiConstants.RESPONSES.BAD_REQUEST.CODE }
    );
  }

  static unauthorized(message = "No autorizado") {
    return NextResponse.json(
      {
        data: null,
        meta: {
          message,
          status: apiConstants.RESPONSES.UNAUTHORIZED.CODE,
          ok: false,
        },
      },
      { status: apiConstants.RESPONSES.UNAUTHORIZED.CODE }
    );
  }

  static forbidden(message = "Prohibido") {
    return NextResponse.json(
      {
        data: null,
        meta: {
          message,
          status: apiConstants.RESPONSES.FORBIDDEN.CODE,
          ok: false,
        },
      },
      { status: apiConstants.RESPONSES.FORBIDDEN.CODE }
    );
  }

  static notFound(message = "No encontrado") {
    return NextResponse.json(
      {
        data: null,
        meta: {
          message,
          status: apiConstants.RESPONSES.NOT_FOUND.CODE,
          ok: false,
        },
      },
      { status: apiConstants.RESPONSES.NOT_FOUND.CODE }
    );
  }

  static redirect(url: NextURL) {
    return NextResponse.redirect(url);
  }

  static internalServerError(
    message = "Error interno del servidor",
    error?: unknown,
    errorPrefix?: string,
    errors?: string[]
  ) {
    if (errorPrefix) {
      logger.error(`${errorPrefix}`, error);
    }
    if (error instanceof AxiosError) {
      logger.error(`AxiosError`, error.response?.data);
    }
    return NextResponse.json(
      {
        data: errors ? errors : null,
        meta: {
          message,
          status: apiConstants.RESPONSES.INTERNAL_SERVER_ERROR.CODE,
          ok: false,
        },
      },
      { status: apiConstants.RESPONSES.INTERNAL_SERVER_ERROR.CODE }
    );
  }
}

const withApiAuthRequired = (handler: CustomApiHandler): NextApiHandler => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const isAuth = await auth();

    if (!isAuth) {
      ApiResponse.unauthorized();
      return;
    }

    return handler(req, res);
  };
};

const withApikeyAuthRequired = (handler: CustomApiHandler): NextApiHandler => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const apiKey = req.headers["x-condor-ai-key"];

    if (
      !apiKey ||
      apiKey !== process.env.CONDOR_AI_API_KEY ||
      !process.env.CONDOR_AI_API_KEY
    ) {
      ApiResponse.unauthorized();
      return;
    }

    return handler(req, res);
  };
};

export { withApiAuthRequired, withApikeyAuthRequired, ApiResponse };
