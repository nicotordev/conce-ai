import { CredentialsSignin } from "next-auth";
class AuthCredentialsError extends CredentialsSignin {
  code: string;
  constructor(code: string) {
    super();
    this.code = code;
  }
}

export { AuthCredentialsError };
