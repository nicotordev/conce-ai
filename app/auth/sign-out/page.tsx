import { signOut } from "@/auth";
import { redirect } from "next/navigation";

export default async function SignOut() {
  let response = "";
  try {
    response = (await signOut({
      redirect: false,
      redirectTo: "/auth/sign-in",
    })) as string;
  } catch (err) {
    console.error(err);
    response = "/auth/sign-in";
  } finally {
    redirect(response);
  }

  return null;
}
