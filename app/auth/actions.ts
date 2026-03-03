"use server";

import { redirect } from "next/navigation";
import { AuthService } from "@/features/auth/lib/auth-service";

export type AuthState = {
  error?: string;
  success?: boolean;
};

export async function login(prevState: AuthState | null, formData: FormData): Promise<AuthState> {
  const identifier = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!identifier || !password) {
    return { error: "Username/Email dan password harus diisi." };
  }

  try {
    await AuthService.login(identifier, password);
  } catch (error: any) {
    console.error("Login error:", error);
    return { error: error.message || "Terjadi kesalahan saat masuk. Silakan coba lagi." };
  }

  redirect("/dashboard");
}

export async function register(prevState: AuthState | null, formData: FormData): Promise<AuthState> {
  const name = formData.get("name") as string;
  const username = formData.get("username") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const password = formData.get("password") as string;
  const confirm_password = formData.get("confirm_password") as string;

  if (!name || !username || !email || !password || !confirm_password) {
    return { error: "Semua field yang wajib harus diisi." };
  }

  if (password !== confirm_password) {
    return { error: "Password tidak cocok." };
  }

  if (password.length < 8) {
    return { error: "Password minimal 8 karakter." };
  }

  try {
    await AuthService.register({
      name,
      username,
      email,
      phone: phone || null,
      passwordRaw: password,
    });
  } catch (error: any) {
    console.error("Registration error:", error);
    return { error: error.message || "Terjadi kesalahan saat mendaftar. Silakan coba lagi." };
  }

  redirect("/dashboard");
}

export async function logout() {
  const { deleteSession } = await import("@/lib/session");
  await deleteSession();
  redirect("/");
}
