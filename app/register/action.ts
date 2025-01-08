"use server";

import { passwordMatchSchema } from "@/validation/passwordMatchSchema";
import { z } from "zod";
import { createClient } from "@/utils/supabase/server";
import { notifyAllAdmins } from '@/utils/emails/helpers';

// Define the role schema
const roleSchema = z.enum(["mentor", "mentee"]);

// Update the registration schema to include role
const newUserSchema = z
  .object({
    email: z.string().email(),
    role: roleSchema,
  })
  .and(passwordMatchSchema);

export const registerUser = async ({
  email,
  password,
  passwordConfirm,
  role,
}: {
  email: string;
  password: string;
  passwordConfirm: string;
  role: "mentor" | "mentee";
}) => {
  // Validate the input
  const newUserValidation = newUserSchema.safeParse({
    email,
    password,
    passwordConfirm,
    role,
  });

  if (!newUserValidation.success) {
    return {
      error: true,
      message: newUserValidation.error.issues[0]?.message ?? "An error occurred",
    };
  }

  const supabase = await createClient();

  // First, sign up the user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    // Include role in the user metadata
    options: {
      data: {
        role: role,
      },
    },
  });

  if (authError) {
    return {
      error: true,
      message: authError.message,
    };
  }

  if (authData.user && authData.user.identities && authData.user.identities.length === 0) {
    return {
      error: true,
      message: "Email already in use",
    };
  }

  // If you have a separate profiles table, you can insert the role there as well
  if (authData.user) {
    const { error: profileError } = await supabase
      .from('profiles') // Make sure you have this table in your Supabase database
      .insert([
        {
          id: authData.user.id,
          role: role,
          email: email,
          // Add any other profile fields you want to store
        },
      ]);

    if (profileError) {
      // If profile creation fails, we should log this but still return success
      // since the auth account was created
      console.error('Error creating profile:', profileError);
    } 
    console.log('Profile created successfully, sending admin notifications');
    try {
        await notifyAllAdmins('new_user', email);
        console.log('Admin notifications sent successfully');
      } catch (error) {
        console.error('Error sending admin notifications:', error);
    }
  }

  return {
    success: true,
    message: "Check your email for the confirmation link",
  };
};