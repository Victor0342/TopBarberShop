import { Suspense } from "react";
import LoginForm from "./login-form";

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center px-6">
          <div className="w-full max-w-md space-y-4 rounded-3xl border border-border/60 bg-card p-8 text-sm text-muted-foreground">
            Se incarca formularul de autentificare...
          </div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
