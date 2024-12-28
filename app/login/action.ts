"use server";

import { z } from "zod";

import { createClient } from "@/utils/supabase/server";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(5), // Adjust the minimum length as needed
});

export async function loginUser(data: { email: string; password: string }) {
  const validatedFields = loginSchema.safeParse(data);
  
  if (!validatedFields.success) {
    return {
      error: true,
      message: validatedFields.error.issues[0]?.message ?? "Invalid input"
    };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });

  if (error) {
    return {
      error: true,
      message: error.message
    };
  }

  return {
    error: false,
    message: "Login successful"
  };
}
