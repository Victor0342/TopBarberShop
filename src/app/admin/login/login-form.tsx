"use client";

import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type LoginValues = {
  email: string;
  password: string;
};

export default function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/admin";
  const { register, handleSubmit, formState } = useForm<LoginValues>();

  const onSubmit = async (values: LoginValues) => {
    await signIn("credentials", {
      email: values.email,
      password: values.password,
      callbackUrl,
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-md space-y-6 rounded-3xl border border-border/60 bg-card p-8">
        <h1 className="text-2xl font-semibold">Admin Login</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Email</label>
            <Input type="email" {...register("email", { required: true })} />
          </div>
          <div>
            <label className="text-sm font-medium">Parola</label>
            <Input type="password" {...register("password", { required: true })} />
          </div>
          {formState.errors.email || formState.errors.password ? (
            <p className="text-sm text-destructive">Completeaza email si parola.</p>
          ) : null}
          <Button type="submit" className="w-full">
            Autentifica-te
          </Button>
        </form>
      </div>
    </div>
  );
}
