import Link from "next/link";

export default function AuthFooter() {
  return (
    <footer className="absolute bottom-5 left-0 right-0 flex flex-col items-center justify-center gap-2 text-xs text-gray-600 dark:text-gray-400">
      <div className="flex items-center justify-center gap-2">
        <Link
          href="/terms-and-conditions"
          className="text-primary-600 dark:text-primary-400 hover:underline transition-colors"
        >
          Términos & Condiciones
        </Link>
        <span>|</span>
        <Link
          href="/policy-and-privacy"
          className="text-primary-600 dark:text-primary-400 hover:underline transition-colors"
        >
          Política y Privacidad
        </Link>
      </div>
    </footer>
  );
}
