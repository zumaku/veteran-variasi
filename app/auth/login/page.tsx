"use client";

import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useActionState } from "react";
import { login } from "@/app/auth/actions";
import { Loader2, LogIn } from "lucide-react";
/**
 * Renders the main login page for the authentication flow.
 * We use a distinctive gradient background and elevated card layout
 * to ensure high contrast and brand alignment, as requested to avoid a "flat" look.
 * @returns The login page JSX
 */
export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(login, null);

  return (
    <section className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-16 md:py-32 dark:bg-zinc-950">
      {/* Background decoration to add depth */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-zinc-950 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:16px_16px]"></div>

      <form
        action={formAction}
        className="relative m-auto h-fit w-full max-w-sm overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-2xl shadow-zinc-900/10 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-zinc-950/50"
      >
        <div className="p-8 pb-6">
          <div className="text-center">
            <Link href="/" aria-label="go home" className="mx-auto block w-fit">
              <Logo />
            </Link>
            <h1 className="mb-1 mt-6 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Selamat Datang Kembali
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Masuk ke akun Anda untuk melanjutkan
            </p>
          </div>

          <div className="mt-8 space-y-4">
            {state?.error && (
              <div className="p-3 bg-red-50 text-red-600 border border-red-200 rounded-md text-sm dark:bg-red-950/50 dark:border-red-900 dark:text-red-400">
                {state.error}
              </div>
            )}

            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Email
              </Label>
              <Input
                type="email"
                required
                name="email"
                id="email"
                pattern="[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$"
                title="Masukkan alamat email yang valid (contoh: nama@email.com)"
                className="w-full transition-colors focus-visible:ring-primary"
                placeholder="Masukkan email Anda"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="pwd"
                  className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Password
                </Label>
                <Link
                  href="#"
                  className="text-xs font-medium text-foreground hover:text-foreground/80 transition-colors hover:underline underline-offset-4"
                >
                  Lupa Password?
                </Link>
              </div>
              <Input
                type="password"
                required
                name="password"
                id="password"
                defaultValue={""}
                className="w-full transition-colors focus-visible:ring-primary"
                placeholder="••••••••"
              />
            </div>

            <Button
              variant="dark"
              disabled={isPending}
              className="w-full font-semibold shadow-sm transition-all hover:scale-[1.02]"
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <LogIn className="w-4 h-4 mr-2" />
              )}
              {isPending ? "Masuk..." : "Masuk"}
            </Button>
          </div>
        </div>

        <div className="bg-zinc-50 px-8 py-4 border-t border-zinc-100 dark:bg-zinc-900/50 dark:border-zinc-800">
          <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
            Belum punya akum?{" "}
            <Link
              href="/auth/register"
              className="font-semibold text-foreground hover:text-foreground/80 transition-colors hover:underline underline-offset-4"
            >
              Daftar di sini
            </Link>
          </p>
        </div>
      </form>
    </section>
  );
}
