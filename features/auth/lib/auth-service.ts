import { prisma } from "@/lib/prisma";
import { hash, compare } from "bcryptjs";
import { createSession } from "@/lib/session";
import { Prisma } from "@prisma/client";

export class AuthService {
  /**
   * Authenticates a user by email or username and password.
   * If successful, creates a session and returns the user object.
   * Throws an error if authentication fails.
   */
  static async login(identifier: string, password: string) {
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: identifier }, { username: identifier }],
      },
    });

    if (!user) {
      throw new Error("Akun tidak ditemukan atau password salah.");
    }

    const isPasswordValid = await compare(password, user.password_hash);

    if (!isPasswordValid) {
      throw new Error("Akun tidak ditemukan atau password salah.");
    }

    await createSession(user.id, user.role);

    return user;
  }

  /**
   * Registers a new user.
   * Checks for existing email/username, hashes password, saves to DB,
   * and creates a session.
   * Throws an error if registration fails (e.g., duplicate user).
   */
  static async register(data: {
    name: string;
    username: string;
    email: string;
    phone: string | null;
    passwordRaw: string;
  }) {
    const { name, username, email, phone, passwordRaw } = data;

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      if (existingUser.email === email) {
        throw new Error("Email sudah terdaftar.");
      }
      if (existingUser.username === username) {
        throw new Error("Username sudah terdaftar. Silakan pilih username lain.");
      }
    }

    const password_hash = await hash(passwordRaw, 10);

    const user = await prisma.user.create({
      data: {
        name,
        username,
        email,
        phone,
        password_hash,
      },
    });

    await createSession(user.id, user.role);

    return user;
  }
}
