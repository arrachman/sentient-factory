"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Mock authentication - replace with real logic later
  // Accept any email and password 'password' for demo
  if (password === "password") {
    // Set cookie
    (await cookies()).set("session", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });

    redirect("/");
  } else {
    return { error: 'Invalid credentials. Try password: "password"' };
  }
}

export async function logout() {
  (await cookies()).delete("session");
  redirect("/auth/login");
}
