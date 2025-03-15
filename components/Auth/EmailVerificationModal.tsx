import { doEmailResend } from "@/app/actions/auth.actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EmailVerificationModalProps } from "@/types/auth";
import { EmailVerificationStep } from "@/types/auth.enum";
import toast from "react-hot-toast";
import CondorInput from "../Common/Forms/CondorInput";
import { useState } from "react";
import { Transition } from "@headlessui/react";

export function EmailVerificationModal({
  loading,
  email: emailProp,
  setLoading,
  handleStep,
}: EmailVerificationModalProps) {
  const [email, setEmail] = useState<string>(emailProp);
  async function handleEmailResend(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const actionResponse = await doEmailResend({ email });

    if (actionResponse.success) {
      const toastId = toast.success("Exito 🚀");
      let count = 5;
      setInterval(async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        count--;
        toast.success(
          `Código de verificación reenviado, Redirigiendo en ${count} segundos`,
          { id: toastId }
        );
      }, 1000);
      return await handleStep(EmailVerificationStep.start);
    }

    return await handleStep(
      EmailVerificationStep.error,
      actionResponse.message
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex items-center justify-center">
          <button
            disabled={loading}
            type="submit"
            className="mx-auto w-fit text-xs text-primary-500 cursor-pointer justify-center text-center mt-4 py-3 px-4 inline-flex items-center gap-x-2 font-medium rounded-lg border border-transparent bg-transparent focus:outline-hidden disabled:opacity-50 disabled:pointer-events-none transition-all duration-150"
          >
            Solicitar nuevo código
          </button>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] relative">
        <Transition
          show={loading}
          enter="transition-opacity duration-150"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 top-1/2 z-50">
            <div className="min-h-60 flex flex-col bg-white border border-gray-200 shadow-2xs rounded-xl">
              <div className="flex flex-auto flex-col justify-center items-center p-4 md:p-5">
                <div className="flex justify-center">
                  <div
                    className="animate-spin inline-block size-6 border-3 border-current border-t-transparent text-primary-600 rounded-full dark:text-primary-500"
                    role="status"
                    aria-label="loading"
                  >
                    <span className="sr-only">Cargando...</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Transition>
        <form onSubmit={handleEmailResend}>
          <DialogHeader>
            <DialogTitle>Solicitar nuevo codigo de verificación</DialogTitle>
            <DialogDescription>
              Ingrese su dirección de correo electronico para recibir un nuevo
              código de verificación
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col">
              <CondorInput
                id="email"
                placeholder="Dirección de Correo Electronico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Enviar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
