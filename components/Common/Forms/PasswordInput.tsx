"use client";

import { useEffect, useState } from "react";
import Input from "./Input";
import { BsEye, BsEyeSlash, BsLock } from "react-icons/bs";
import clsx from "clsx";
import { PasswordInputProps } from "@/types/common";

export default function PasswordInput({
  setPassword: setPasswordExternal,
  ...rest
}: PasswordInputProps) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordRequeriments, setPasswordRequeriments] = useState({
    atLeast8Characters: false,
    atLeastOneLowercaseLetter: false,
    atLeastOneUppercaseLetter: false,
    atLeastOneNumber: false,
    atLeastOneSpecialCharacter: false,
  });
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  useEffect(() => {
    const requirements = {
      atLeast8Characters: password.length >= 8,
      atLeastOneLowercaseLetter: /[a-z]/.test(password),
      atLeastOneUppercaseLetter: /[A-Z]/.test(password),
      atLeastOneNumber: /\d/.test(password),
      atLeastOneSpecialCharacter:
        /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(password),
    };

    setPasswordRequeriments((prev) =>
      JSON.stringify(prev) === JSON.stringify(requirements)
        ? prev
        : requirements
    );
  }, [password]);

  useEffect(() => {
    if (setPasswordExternal) {
      setPasswordExternal(password);
    }
  }, [password, setPasswordExternal]);

  return (
    <Input
      {...rest}
      type={showPassword ? "text" : "password"}
      leftIcon={<BsLock />}
      rightIcon={
        <button
          type="button"
          className={clsx(
            "focus:border-gray-300 focus:border-solid focus:border rounded-lg focus:ring focus:ring-primary-500 focus:ring-opacity-50 cursor-pointer"
          )}
          onClick={() => setShowPassword((prev) => !prev)}
        >
          <div className={clsx("shrink-0 size-4 text-base")}>
            {showPassword ? <BsEyeSlash /> : <BsEye />}
          </div>
        </button>
      }
      value={password}
      onChange={handlePasswordChange}
      validations={{
        title: "Su contraseña debe cumplir con los siguientes requerimientos:",
        show: true,
        items: [
          {
            message: "Al menos 8 caracteres",
            isValid: passwordRequeriments.atLeast8Characters,
          },
          {
            message: "Al menos una letra minúscula",
            isValid: passwordRequeriments.atLeastOneLowercaseLetter,
          },
          {
            message: "Al menos una letra mayúscula",
            isValid: passwordRequeriments.atLeastOneUppercaseLetter,
          },
          {
            message: "Al menos un número",
            isValid: passwordRequeriments.atLeastOneNumber,
          },
          {
            message: "Al menos un caracter especial",
            isValid: passwordRequeriments.atLeastOneSpecialCharacter,
          },
        ],
      }}
    />
  );
}
