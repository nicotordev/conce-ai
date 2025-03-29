"use client";
import { SignOutAction } from "@/app/actions/auth.actions";
import { useEffect } from "react";

export default function SignOut() {
  useEffect(() => {
    async function signOutUser() {
      await SignOutAction();
      window.location.href = "/";
    }
    signOutUser();
  }, []);

  return null;
}
