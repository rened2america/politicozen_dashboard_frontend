"use client";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useUserLogin } from "./useUserLogin";
import { useEffect, useState } from "react";
import Link from "next/link";
import { UserAuthForm } from "../components/auth/components/user-auth-form";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { useGetUserIsLogin } from "@/hooks/useUserLogin";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { data, isLoading, mutate: login, isSuccess, isError } = useUserLogin();

  useEffect(() => {
    if (isSuccess) {
      router.push("/dashboard");
    }
  }, [isSuccess]);

  const handleSubmit = () => {
    login({ email, password }); // Login api call
  };

  return (
    <>
      <div className="container lg:grid flex md:flex sm:flex relative h-screen	flex-col items-center justify-center  lg:max-w-none lg:grid-cols-2 lg:px-0">
        <Link
          href="/register"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "absolute right-4 top-4 md:right-8 md:top-8"
          )}
        >
          Create an account
        </Link>
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
          <div className="absolute inset-0 bg-zinc-900" />
          <Link
            href={process.env.NEXT_PUBLIC_BASE_URL_ECOMMERCE!}
            className="relative z-20 flex items-center text-lg font-medium"
          >
            PoliticoZen
          </Link>
        </div>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center ">
              <h1 className="text-2xl font-semibold tracking-tight">Log In</h1>
              <p className="text-sm text-muted-foreground">
                Please enter your email to log in
              </p>
            </div>
            <UserAuthForm />
            <p className="px-8 text-center text-sm text-muted-foreground">
              By clicking continue, you agree to our{" "}
              <Link
                href="/terms"
                className="underline underline-offset-4 hover:text-primary"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="underline underline-offset-4 hover:text-primary"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
