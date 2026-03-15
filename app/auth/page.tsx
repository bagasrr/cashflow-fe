"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Divide, Eye, EyeClosed, LineChart } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { IconBrandGoogle } from "@tabler/icons-react";

const PageAuth = () => {
  const [isVisiblePassword, setIsVisiblePassword] = useState(false);
  console.log(isVisiblePassword);
  return (
    <div className="flex min-h-screen w-full bg-slate-50">
      {/* Bagian Kiri: Area Form */}
      <div className="flex flex-col gap-5 w-full lg:w-1/2 items-center justify-center p-8">
        <Card className="w-full max-w-md shadow-lg border-0">
          <CardHeader className="space-y-1 text-center mb-4">
            <CardTitle className="text-3xl font-bold tracking-tight">Sign In</CardTitle>
            <CardDescription className="text-gray-500">Masukkan username dan password Anda</CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Input type="text" placeholder="Username" className="h-12" />
            </div>

            {/* Wrapper Relative untuk menempatkan icon Mata */}
            <div className="relative space-y-2">
              <Input
                type={isVisiblePassword ? "text" : "password"}
                placeholder="Password"
                className="h-12 pr-12" // Padding kanan ekstra agar teks tidak tertutup icon
              />
              {!isVisiblePassword ? (
                <Button variant="ghost" size="icon" className="absolute right-1 top-0 h-12 w-12 text-gray-400 hover:text-gray-600 hover:bg-transparent cursor-pointer" onClick={() => setIsVisiblePassword(true)}>
                  <EyeClosed className="h-5 w-5" />
                </Button>
              ) : (
                <Button variant="ghost" size="icon" className="absolute right-1 top-0 h-12 w-12 text-gray-400 hover:text-gray-600 hover:bg-transparent cursor-pointer" onClick={() => setIsVisiblePassword(false)}>
                  <Eye className="h-5 w-5" />
                </Button>
              )}
            </div>
          </CardContent>
          <CardFooter className="grid grid-cols-1">
            <Button className="w-full h-12 text-md font-semibold">Sign In</Button>
            <div className="mt-5 text-center">
              <div>
                Can&apos;t Sign In ? maybe you should{" "}
                <Link href="/auth/register" className="text-blue-600 hover:underline">
                  register
                </Link>{" "}
                first
              </div>
              <div className="text-var(color-foreground)">
                or
                <br /> You just{" "}
                <Link href="/auth/forgot-password" className="text-blue-600 hover:underline">
                  forgot your password
                </Link>
              </div>
            </div>
          </CardFooter>
        </Card>
        <div className="w-full max-w-md border-t-2" />
        <Card className="w-full max-w-md shadow-lg border-0">
          <CardContent className="flex items-center gap-5 text-center justify-center">
            <IconBrandGoogle className="h-5 w-5" /> <span className="text-xl">Sign in with Google</span>
          </CardContent>
        </Card>
      </div>

      {/* Bagian Kanan: Area Gambar (Disembunyikan di layar HP) */}
      <div className="hidden lg:block relative w-1/2 h-screen">
        <Image src="https://picsum.photos/800/1000" alt="Authentication background" fill className="object-cover" priority />
      </div>
    </div>
  );
};

export default PageAuth;
