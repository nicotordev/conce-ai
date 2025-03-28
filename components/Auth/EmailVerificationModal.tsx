import { doEmailResend } from "@/app/actions/auth.actions";
import { EmailVerificationModalProps } from "@/types/auth";
import { EmailVerificationStep } from "@/types/auth.enum";
import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "../ui/button";
import { BsMailbox } from "react-icons/bs";
import ConceAIInput from "../Common/Forms/ConceAIInput";
import AuthLoading from "./AuthLoading";

export function EmailVerificationModal({
  loading,
  email: emailProp,
  setLoading,
  handleStep,
}: EmailVerificationModalProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [email, setEmail] = useState<string>(emailProp);
  async function handleEmailResend(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const actionResponse = await doEmailResend({ email });

    if (actionResponse.success) {
      const toastId = toast.success("Éxito 🚀");
      setIsOpen(false);
      toast.dismiss(toastId);
      return await handleStep(EmailVerificationStep.start);
    }

    return await handleStep(
      EmailVerificationStep.start,
      actionResponse.message
    );
  }

  return (
    <>
      <div className="flex items-center justify-center">
        <Button
          disabled={loading}
          type="submit"
          variant={"link"}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          Solicitar nuevo código
        </Button>
      </div>

      {/* Modal */}
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        {/* Overlay con efecto de desenfoque */}
        <div
          className="fixed inset-0 bg-[--color-silver-950] bg-opacity-50 backdrop-blur-sm"
          aria-hidden="true"
        />

        {/* Contenedor centrado */}
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <DialogPanel
            as="form"
            onSubmit={handleEmailResend}
            className="relative w-full max-w-md transform overflow-hidden rounded-xl bg-white shadow-2xl transition-all"
          >
            <AuthLoading loading={loading} />
            {/* Cabecera con gradiente */}
            <div className="bg-gradient-to-r from-[--color-primary-700] to-[--color-primary-900] p-1" />

            {/* Contenido */}
            <div className="p-6 sm:p-8">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[--color-primary-50]">
                <BsMailbox className="h-6 w-6 text-[--color-primary-700]" />
              </div>

              <DialogTitle className="mt-4 text-center text-xl font-semibold text-[--color-dark-text-primary] font-[--font-title]">
                Solicitar un Nuevo Código
              </DialogTitle>

              <Description className="text-center text-sm mt-1 mb-2">
                Ingresa tu correo electrónico para que te enviemos un nuevo
                código de verificación.
              </Description>

              <div className="mt-6">
                <div className="rounded-md border border-[--color-silver-200] focus-within:ring-2 focus-within:ring-[--color-primary-500] focus-within:border-transparent">
                  <ConceAIInput
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Ingresa tu correo electrónico"
                  />
                </div>

                <div className="mt-6 flex gap-3">
                  <Button type="button" variant={"outline"}>
                    Cancelar
                  </Button>
                  <Button disabled={loading} type="submit">
                    Solicitar nuevo código
                  </Button>
                </div>
              </div>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}
