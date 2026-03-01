"use server";

import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { createSession } from "@/lib/session";
import { redirect } from "next/navigation";

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
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier },
          { username: identifier }
        ]
      },
    });

    if (!user) {
      return { error: "Akun tidak ditemukan atau password salah." };
    }

    const { compare } = await import("bcryptjs");
    const isPasswordValid = await compare(password, user.password_hash);

    if (!isPasswordValid) {
      return { error: "Akun tidak ditemukan atau password salah." };
    }

    await createSession(user.id, user.role);

  } catch (error) {
    console.error("Login error:", error);
    return { error: "Terjadi kesalahan saat masuk. Silakan coba lagi." };
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
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username }
        ]
      },
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return { error: "Email sudah terdaftar." };
      }
      if (existingUser.username === username) {
        return { error: "Username sudah terdaftar. Silakan pilih username lain." };
      }
    }

    const password_hash = await hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        username,
        email,
        phone: phone || null,
        password_hash,
      },
    });

    await createSession(user.id, user.role);
    
  } catch (error) {
    console.error("Registration error:", error);
    return { error: "Terjadi kesalahan saat mendaftar. Silakan coba lagi." };
  }

  redirect("/dashboard");
}
