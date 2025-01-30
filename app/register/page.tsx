"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Users, UserCog } from "lucide-react";
import Link from "next/link";
import AuthLayout from "@/components/layout/AuthLayout";
import Button from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card-default";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { passwordMatchSchema } from "@/validation/passwordMatchSchema";
import { registerUser } from "./action";

type UserRole = "mentee" | "mentor";

// Role Selection Component
const RoleSelection = ({ onRoleSelect }: { onRoleSelect: (role: UserRole) => void }) => {
  return (
    <Card className="border-0 shadow-none">
      <CardContent className="px-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => onRoleSelect("mentee")}
            className="p-6 border-2 border-primary/20 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors group"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-lg mb-2">Join as Mentee</h3>
                <p className="text-sm text-muted-foreground">
                  Get guidance and support from experienced mentors
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={() => onRoleSelect("mentor")}
            className="p-6 border-2 border-primary/20 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors group"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <UserCog className="w-8 h-8 text-primary" />
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-lg mb-2">Join as Mentor</h3>
                <p className="text-sm text-muted-foreground">
                  Share your expertise and guide others in their journey
                </p>
              </div>
            </div>
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

// Registration Form Schema
const formSchema = z
  .object({
    email: z.string().email(),
  })
  .and(passwordMatchSchema);

// Registration Form Component
const RegistrationForm = ({
  selectedRole,
  onBack,
}: {
  selectedRole: UserRole;
  onBack: () => void;
}) => {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      passwordConfirm: "",
    },
  });

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    setServerError(null);
    setIsLoading(true);

    try {
      const response = await registerUser({
        email: data.email,
        password: data.password,
        passwordConfirm: data.passwordConfirm,
        role: selectedRole,
      });

      if (response.error) {
        setServerError(response.message);
        // Stay on the current page with the form when there's an error
        return;
      } else {
        router.push("/register/confirmation");
      }
    } catch (error) {
      setServerError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-0 shadow-none">
      <CardContent className="px-0">
        <div className="mb-4">
          <Button
            variant="ghost"
            className="p-0 h-auto text-muted-foreground hover:text-foreground"
            onClick={onBack}
          >
            ← Back to role selection
          </Button>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="passwordConfirm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password confirm</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {serverError && (
              <p className="text-red-500 text-sm">{serverError}</p>
            )}
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                `Create ${selectedRole === 'mentor' ? 'Mentor' : 'Mentee'} Account`
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center px-0 pb-0">
        <div className="text-muted-foreground text-sm">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Login
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};

// Main Register Component
export default function Register() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = searchParams.get('role') as UserRole;
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(initialRole || null);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    router.replace(`/register?role=${role}`);  // Use replace instead of push
  };

  const onBack = () => {
    setSelectedRole(null);
    router.replace('/register');  // Use replace instead of push
  };

  return (
    <AuthLayout 
      title={selectedRole ? `Create ${selectedRole === 'mentor' ? 'Mentor' : 'Mentee'} Account` : "Choose Your Role"}
      subtitle={selectedRole 
        ? `Sign up as a ${selectedRole} to get started with Okwega`
        : "Select how you want to join our community"
      }
    >
      {selectedRole ? (
        <RegistrationForm 
          selectedRole={selectedRole} 
          onBack={onBack}
        />
      ) : (
        <RoleSelection onRoleSelect={setSelectedRole} />
      )}
    </AuthLayout>
  );
}