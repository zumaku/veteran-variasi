import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus } from "lucide-react";
import Link from "next/link";

/**
 * Renders the registration/signup page.
 * Designed to mirror the login page for consistency while also collecting
 * all fields required to create a User record.
 *
 * Includes: name, email, phone (optional in schema), and passwords.
 *
 * @returns The signup page JSX
 */
export default function RegisterPage() {
  return (
    <section className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-16 md:py-32 dark:bg-zinc-950">
      {/* Background decoration to add depth */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-zinc-950 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:16px_16px]"></div>

      <form
        action=""
        className="relative m-auto h-fit w-full max-w-sm overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-2xl shadow-zinc-900/10 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-zinc-950/50"
      >
        <div className="p-8 pb-6">
          <div className="text-center">
            <Link href="/" aria-label="go home" className="mx-auto block w-fit">
              <Logo />
            </Link>
            <h1 className="mb-1 mt-6 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Buat Akun Baru
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Daftar untuk mulai menikmati layanan kami
            </p>
          </div>

          <div className="mt-8 space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Nama Lengkap
              </Label>
              <Input
                type="text"
                required
                name="name"
                id="name"
                className="w-full transition-colors focus-visible:ring-primary"
                placeholder="Masukkan nama lengkap Anda"
              />
            </div>

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
                className="w-full transition-colors focus-visible:ring-primary"
                placeholder="Masukkan email Anda"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="phone"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Nomor Telepon
              </Label>
              <Input
                type="tel"
                name="phone"
                id="phone"
                className="w-full transition-colors focus-visible:ring-primary"
                placeholder="Masukkan nomor telepon"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Password
              </Label>
              <Input
                type="password"
                required
                name="password"
                id="password"
                className="w-full transition-colors focus-visible:ring-primary"
                placeholder="••••••••"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="confirm_password"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Konfirmasi Password
              </Label>
              <Input
                type="password"
                required
                name="confirm_password"
                id="confirm_password"
                className="w-full transition-colors focus-visible:ring-primary"
                placeholder="••••••••"
              />
            </div>

            <div className="pt-2">
              <Button
                variant="dark"
                className="w-full font-semibold shadow-sm transition-all hover:scale-[1.02]"
              >
                <UserPlus className="w-4 h-4" />
                Daftar
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-zinc-50 px-8 py-4 border-t border-zinc-100 dark:bg-zinc-900/50 dark:border-zinc-800">
          <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
            Sudah punya akun?{" "}
            <Link
              href="/auth/login"
              className="font-semibold text-foreground hover:text-foreground/80 transition-colors hover:underline underline-offset-4"
            >
              Masuk di sini
            </Link>
          </p>
        </div>
      </form>
    </section>
  );
}
