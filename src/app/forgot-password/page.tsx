"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants, Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SyncLoader from "react-spinners/SyncLoader";
import { useForgotPassword } from "../login/useUserLogin";

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [email, setEmail] = React.useState("");
    // We removed the password state since it isn't used on this page

    // Destructure from your custom hook
    const {
        data,
        isLoading,
        mutate: forgotPassword,
        isSuccess,
        isError,
    } = useForgotPassword();

    // Decide what to do on success
    React.useEffect(() => {
        if (isSuccess) {                    
            alert("Reset link has been sent! Check your email.");
            router.push("/login")
        }
    }, [isSuccess]);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault(); // Prevent page reload
        console.log(`Email entered: ${email}`);
        forgotPassword({ email });
    };

    return (
        <div className="container lg:grid flex md:flex sm:flex relative h-screen flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
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
                    <div className="flex flex-col space-y-2 text-center">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Reset password
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Please enter your email to get the link to reset password
                        </p>
                    </div>

                    {/* Use correct tailwind class `gap-6` instead of `grid-gap-6` */}
                    <div className="grid gap-6">
                        <form onSubmit={handleSubmit}>
                            <div className="grid gap-2">
                                <div className="grid gap-1">
                                    <Label className="sr-only" htmlFor="email">
                                        Email
                                    </Label>
                                    <Input
                                        id="email"
                                        placeholder="name@example.com"
                                        type="email"
                                        autoCapitalize="none"
                                        autoComplete="email"
                                        autoCorrect="off"
                                        disabled={isLoading}
                                        onChange={(event) => setEmail(event.target.value)}
                                    />
                                </div>
                                <Button type="submit" disabled={isLoading}>
                                    {isLoading ? (
                                        <SyncLoader loading={isLoading} color="white" size={8} />
                                    ) : (
                                        "Send email for verification"
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
