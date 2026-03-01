"use client";

import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus, Loader2 } from "lucide-react";
import Link from "next/link";
import { useActionState, useState, useEffect } from "react";
import { register, AuthState } from "@/app/auth/actions";
import { CheckCircle2, XCircle, Eye, EyeOff } from "lucide-react";

/**
 * Renders the registration/signup page.
 * Validates inputs and creates the user via Server Action.
 *
 * @returns The signup page JSX
 */
export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(register, null);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [suffix] = useState(() =>
    Math.floor(100 + Math.random() * 900).toString(),
  );

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    if (val.trim()) {
      setUsername(val.toLowerCase().replace(/[^a-z0-9]/g, "") + suffix);
    } else {
      setUsername("");
    }
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ""));
  };

  // Password strength calculation
  const [strengthLevel, setStrengthLevel] = useState(0);
  const [strengthLabel, setStrengthLabel] = useState("");
  const [strengthColor, setStrengthColor] = useState("bg-zinc-200");

  useEffect(() => {
    if (!password) {
      setStrengthLevel(0);
      setStrengthLabel("");
      setStrengthColor("bg-zinc-200");
      return;
    }

    let level = 0;
    if (password.length >= 8) level++;
    if (/[A-Z]/.test(password)) level++;
    if (/[0-9]/.test(password)) level++;
    if (/[^A-Za-z0-9]/.test(password)) level++;

    setStrengthLevel(level);

    if (level === 1) {
      setStrengthLabel("Lemah");
      setStrengthColor("bg-red-500");
    } else if (level === 2) {
      setStrengthLabel("Cukup");
      setStrengthColor("bg-yellow-500");
    } else if (level >= 3) {
      setStrengthLabel("Kuat");
      setStrengthColor("bg-emerald-500");
    }
  }, [password]);

  // Password match check
  const isMatch = password === confirmPassword;
  const showMatchIndicator = confirmPassword.length > 0;

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <section className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-16 md:py-32 dark:bg-zinc-950">
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
              Buat Akun Baru
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Daftar untuk mulai menikmati layanan kami
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
                value={name}
                onChange={handleNameChange}
                className="w-full transition-colors focus-visible:ring-primary"
                placeholder="Masukkan nama lengkap Anda"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="username"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Username
              </Label>
              <Input
                type="text"
                required
                name="username"
                id="username"
                value={username}
                onChange={handleUsernameChange}
                pattern="[a-z0-9]+"
                title="Username hanya boleh berisi huruf kecil dan angka"
                className="w-full transition-colors focus-visible:ring-primary"
                placeholder="Masukkan username Anda"
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                pattern="[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$"
                title="Masukkan alamat email yang valid (contoh: nama@email.com)"
                className="w-full transition-colors focus-visible:ring-primary"
                placeholder="emailku@gmail.com"
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
                value={phone}
                inputMode="numeric"
                pattern="[0-9]*"
                title="Hanya masukkan angka (0-9)"
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9]/g, "");
                  setPhone(val);
                }}
                className="w-full transition-colors focus-visible:ring-primary"
                placeholder="08123..."
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Password
              </Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  required
                  name="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pr-10 transition-colors focus-visible:ring-primary"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {password.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                    <div
                      className={`h-full transition-all duration-300 ${strengthColor}`}
                      style={{ width: `${(strengthLevel / 4) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-500 dark:text-zinc-400">
                      Minimal 8 karakter
                    </span>
                    <span
                      className={`font-medium ${
                        strengthLevel === 1
                          ? "text-red-500"
                          : strengthLevel === 2
                            ? "text-yellow-500"
                            : strengthLevel >= 3
                              ? "text-emerald-500"
                              : ""
                      }`}
                    >
                      {strengthLabel}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="confirm_password"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Konfirmasi Password
              </Label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  name="confirm_password"
                  id="confirm_password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full pr-10 transition-colors focus-visible:ring-primary ${
                    showMatchIndicator && !isMatch
                      ? "border-red-500 focus-visible:ring-red-500"
                      : ""
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              {/* Password Match Indicator */}
              {showMatchIndicator && (
                <div
                  className={`flex items-center gap-1.5 text-xs font-medium ${isMatch ? "text-emerald-500" : "text-red-500"}`}
                >
                  {isMatch ? (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Password cocok</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-3.5 w-3.5" />
                      <span>Password tidak cocok</span>
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="pt-2">
              <Button
                variant="dark"
                disabled={isPending}
                className="w-full font-semibold shadow-sm transition-all hover:scale-[1.02]"
              >
                {isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <UserPlus className="w-4 h-4" />
                )}
                {isPending ? "Mendaftar..." : "Daftar"}
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
