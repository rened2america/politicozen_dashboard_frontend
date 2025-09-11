"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { buttonVariants, Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SyncLoader from "react-spinners/SyncLoader";
import { useResetPassword, useResetPasswordWhileLoggedIn } from "../login/useUserLogin";

// Import Zod
import { z } from "zod";
import { useGetProfile } from "../dashboard/settings/profile/useProfile";

export default function ResetPasswordPage() {
  const router = useRouter();

  const searchParams = useSearchParams();
  const hasResetLink = Boolean(searchParams.get("email") && searchParams.get("token"));

  // Only call useGetProfile when we DON'T have a reset link
  const { refetch, data: user, isLoading: isProfileLoading } = useGetProfile({ 
    enabled: !hasResetLink,
    // Add these options to prevent unwanted refetches
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  // Initialize email and token from URL params
  const urlEmail = searchParams.get("email") || "";
  const urlToken = searchParams.get("token") || "";

  // Determine email based on whether user is logged in or using reset link
  const email = hasResetLink ? urlEmail : user?.data?.getArtist?.email;
  const token = hasResetLink ? urlToken : null;

  const resetWhileLoggedIn = useResetPasswordWhileLoggedIn();
  const resetWithToken = useResetPassword();

  const isLoggedIn = Boolean(user) && !hasResetLink;

  const resetPassword = isLoggedIn ? resetWhileLoggedIn.mutate : resetWithToken.mutate;
  const isLoading = (isLoggedIn ? resetWhileLoggedIn.isLoading : resetWithToken.isLoading) || 
                    (!hasResetLink && isProfileLoading);
  const isSuccess = isLoggedIn ? resetWhileLoggedIn.isSuccess : resetWithToken.isSuccess;

  // Local state for passwords
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  // Local state for errors
  const [zodError, setZodError] = React.useState<string | null>(null);

  // On success, alert + redirect
  React.useEffect(() => {
    if (isSuccess) {
      if (isLoggedIn) {
        alert("Password reset successful! Click ok to redirect to your profile...");
        router.push("/dashboard/settings/profile");
      } else {
        alert("Password reset successful! Click ok to redirect to Login page...");
        router.push("/login");
      }
    }
  }, [isSuccess, isLoggedIn, router]);

  // Handle form submission
  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setZodError(null);

    // 1) Create a Zod schema for new password fields
    const passwordSchema = z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .max(32, "Password cannot exceed 32 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character");

    // 2) Combine into an object schema that ensures passwords match
    const resetSchema = z
      .object({
        password: passwordSchema,
        confirmPassword: passwordSchema,
      })
      .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });

    // 3) Safe-parse user input
    const result = resetSchema.safeParse({ password, confirmPassword });
    if (!result.success) {
      // Show the first error
      setZodError(result.error.issues[0].message);
      return;
    }

    // 4) Validate email and token requirements
    if (hasResetLink) {
      // Using reset link - need email and token from URL
      if (!urlEmail || !urlToken) {
        setZodError("Invalid reset link or missing parameters.");
        return;
      }
    } else {
      // Logged in user - need email from profile
      if (!email) {
        setZodError("Email not set on your account. Contact Support!");
        return;
      }
    }

    // 5) Call our mutation
    resetPassword({
      email: email,
      token: token,
      password: result.data.password,
    });
  }

  // Show loading state while fetching profile (only when not using reset link)
  if (!hasResetLink && isProfileLoading) {
    return (
      <div className="container flex h-screen items-center justify-center">
        <SyncLoader loading={true} color="gray" size={12} />
      </div>
    );
  }

  return (
    <div className="container lg:grid flex md:flex sm:flex relative h-screen flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
      {/* Top-right: Create account link */}
      <Link
        href="/register"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute right-4 top-4 md:right-8 md:top-8"
        )}
      >
        Create an account
      </Link>

      {/* Left side banner */}
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
        <div className="absolute inset-0 bg-zinc-900" />
        <Link
          href={process.env.NEXT_PUBLIC_BASE_URL_ECOMMERCE!}
          className="relative z-20 flex items-center text-lg font-medium"
        >
          PoliticoZen
        </Link>
      </div>

      {/* Right side form */}
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Reset Password
            </h1>
            <p className="text-sm text-muted-foreground">
              {hasResetLink 
                ? `Enter your new password for ${urlEmail}` 
                : "Enter your new password below."
              }
            </p>
          </div>

          <div className="grid gap-6">
            <form onSubmit={onSubmit}>
              <div className="grid gap-2">
                {/* Show email for reset link users */}
                {hasResetLink && (
                  <div className="grid gap-1">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={urlEmail}
                      disabled={true}
                      className="bg-muted"
                    />
                  </div>
                )}

                {/* New password */}
                <div className="grid gap-1">
                  <Label className="sr-only" htmlFor="password">
                    New Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="New Password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                {/* Confirm password */}
                <div className="grid gap-1">
                  <Label className="sr-only" htmlFor="confirmPassword">
                    Confirm Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm Password"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                {/* Display Zod error (e.g., mismatch, complexity) */}
                {zodError && (
                  <span className="text-red-400">{zodError}</span>
                )}

                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <SyncLoader loading={isLoading} color="white" size={8} />
                  ) : (
                    "Reset Password"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
