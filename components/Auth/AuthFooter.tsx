import Link from "next/link";

export default function AuthFooter() {
  return (
    <div className="mt-12 flex items-center justify-center gap-2 text-xs">
      <Link href="/terms-and-conditions" className="text-primary-600">
        Términos & Condiciones
      </Link>
      |
      <Link href="/policy-and-privacy" className="text-primary-600">
        Política y Privacidad
      </Link>
    </div>
  );
}
