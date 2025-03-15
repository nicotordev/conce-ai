const apiConstants = {
  RESPONSES: {
    OK: {
      CODE: 200,
      MESSAGE: "OK",
    },
    SUCCESS: {
      CODE: 200,
      MESSAGE: "OK",
    },
    CREATED: {
      CODE: 201,
      MESSAGE: "Creado",
    },
    ACCEPTED: {
      CODE: 202,
      MESSAGE: "Aceptado",
    },
    NO_CONTENT: {
      CODE: 204,
      MESSAGE: "Sin contenido",
    },
    BAD_REQUEST: {
      CODE: 400,
      MESSAGE: "Solicitud incorrecta",
    },
    UNAUTHORIZED: {
      CODE: 401,
      MESSAGE: "No autorizado",
    },
    FORBIDDEN: {
      CODE: 403,
      MESSAGE: "Prohibido",
    },
    NOT_FOUND: {
      CODE: 404,
      MESSAGE: "No encontrado",
    },
    METHOD_NOT_ALLOWED: {
      CODE: 405,
      MESSAGE: "Método no permitido",
    },
    CONFLICT: {
      CODE: 409,
      MESSAGE: "Conflicto",
    },
    UNPROCESSABLE_ENTITY: {
      CODE: 422,
      MESSAGE: "Entidad no procesable",
    },
    INTERNAL_SERVER_ERROR: {
      CODE: 500,
      MESSAGE: "Error interno del servidor",
    },
    NOT_IMPLEMENTED: {
      CODE: 501,
      MESSAGE: "No implementado",
    },
    BAD_GATEWAY: {
      CODE: 502,
      MESSAGE: "Puerta de enlace incorrecta",
    },
    SERVICE_UNAVAILABLE: {
      CODE: 503,
      MESSAGE: "Servicio no disponible",
    },
    GATEWAY_TIMEOUT: {
      CODE: 504,
      MESSAGE: "Tiempo de espera de la puerta de enlace agotado",
    },
  },
  MESSAGES: {
    EMAIL: {
      AN_UNEXPECTED_ERROR_OCCURRED: {
        CODE: 1000,
        MESSAGE: "Ocurrió un error inesperado al verificar tu email",
      },
      USER_NOT_FOUND: {
        CODE: 1001,
        MESSAGE: "Usuario no encontrado",
      },
      THE_VERIFICATION_CODE_IS_INVALID: {
        CODE: 1002,
        MESSAGE: "El codigo de verificación es inválido",
      },
      THE_VERIFICATION_CODE_HAS_EXPIRED: {
        CODE: 1003,
        MESSAGE:
          "El codigo de verificación ha expirado. Se ha enviado un nuevo codigo a tu email",
      },
      EMAIL_VERIFIED: {
        CODE: 1004,
        MESSAGE: "Tu email ha sido verificado",
      },
    },
  },
};

export default apiConstants;
