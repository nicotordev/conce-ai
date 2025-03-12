/* eslint-disable @typescript-eslint/no-explicit-any */
import consola from "consola";
import clc from "cli-color";
import { AxiosError } from "axios";

function warn<T = any>(message: string, ...args: T[]) {
  consola.warn(clc.yellow.bold(message), args);
}
function error<T = Error>(errorKey: string, error?: T) {
  if (error instanceof AxiosError) {
    consola.error(
      clc.red.bold(errorKey),
      clc.red.bold(
        JSON.stringify({
          name: "AxiosError",
          message: error.message,
          response: error.response?.data,
        })
      )
    );
  } else {
    consola.error(clc.red.bold(errorKey), error);
  }
}
function info<T = any>(message: string, ...args: T[]) {
  consola.info(clc.blue(message), args);
}
function success<T = any>(message: string, ...args: T[]) {
  consola.success(clc.green(message), args);
}

const logger = {
  warn,
  error,
  info,
  success,
};

export default logger;
