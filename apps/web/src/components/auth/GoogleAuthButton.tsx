import { Button } from "@/components/ui/button";

type Props = {
  children?: React.ReactNode;
  onClick: () => void;
};

function GoogleIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      viewBox="0 0 18 18"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.56 2.68-3.86 2.68-6.62Z"
        fill="#4285F4"
      />
      <path
        d="M9 18c2.43 0 4.46-.8 5.95-2.18l-2.92-2.26c-.8.54-1.84.86-3.03.86-2.33 0-4.3-1.57-5-3.68H1.02V13c1.48 2.94 4.53 5 7.98 5Z"
        fill="#34A853"
      />
      <path
        d="M4 10.74A5.41 5.41 0 0 1 3.72 9c0-.6.1-1.18.28-1.74V5H1.02A8.98 8.98 0 0 0 0 9c0 1.45.35 2.82 1.02 4l2.98-2.26Z"
        fill="#FBBC05"
      />
      <path
        d="M9 3.58c1.32 0 2.5.45 3.44 1.33l2.58-2.58C13.46.88 11.43 0 9 0 5.55 0 2.5 2.06 1.02 5L4 7.26c.7-2.11 2.67-3.68 5-3.68Z"
        fill="#EA4335"
      />
    </svg>
  );
}

export function GoogleAuthButton({ children = "Continue with Google", onClick }: Props) {
  return (
    <Button
      type="button"
      variant="white"
      size="lg"
      onClick={onClick}
      className="h-11 w-full justify-center gap-3 rounded-xl border border-zinc-200 bg-white text-sm font-medium text-zinc-800 shadow-sm ring-zinc-200 transition hover:-translate-y-0.5 hover:border-zinc-300 hover:bg-white hover:text-zinc-950 hover:shadow-md"
    >
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white">
        <GoogleIcon />
      </span>
      <span>{children}</span>
    </Button>
  );
}
