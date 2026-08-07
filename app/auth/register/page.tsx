"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Wallet, Eye, EyeOff, ArrowRight, Loader2, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner"; // Tambahan opsional kalau mau pakai toast

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);

  // State untuk form
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // Ekstra keamanan UI

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    // Validasi Client-Side
    if (password !== confirmPassword) {
      setError("Password dan Konfirmasi Password tidak cocok!");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Pastikan payload ini sesuai dengan struct Golang lu!
        body: JSON.stringify({ username, email, password }),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || data.error || "Registrasi gagal");
      }

      toast.success("Akun berhasil dibuat! Silakan login.");
      router.push("/login"); // Setelah sukses daftar, lempar ke halaman login
    } catch (err: string | any) {
      console.error("Register error:", err);
      setError(err.message);
      toast.error("Registrasi gagal. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12 text-foreground">
      <Card className="w-full max-w-2xl bg-card text-card-foreground border-border shadow-lg px-5">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center">
            <div className="rounded-full bg-primary/10 p-3 text-primary">
              <Wallet className="h-6 w-6" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Buat Akun Baru</CardTitle>
          <CardDescription className="text-muted-foreground">Daftar sekarang untuk mulai memantau arus kas keuanganmu</CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && <div className="text-sm font-medium text-destructive bg-destructive/10 p-3 rounded-md border border-destructive/20 animate-in fade-in-50 duration-200">{error}</div>}

            {/* INPUT USERNAME */}
            <div className="space-y-2">
              <Label htmlFor="username" className="text-base">
                Username / Nama
              </Label>
              <div className="relative">
                <Input
                  id="username"
                  type="text"
                  placeholder="johndoe"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  disabled={isLoading}
                  className="bg-background border-input text-foreground h-12 text-base pr-10"
                />
                <User className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              </div>
            </div>

            {/* INPUT EMAIL */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-base">
                Email
              </Label>
              <Input id="email" type="email" placeholder="nama@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isLoading} className="bg-background border-input text-foreground h-12 text-base" />
            </div>

            {/* INPUT PASSWORD */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-base">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Minimal 8 karakter"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  minLength={8}
                  className="bg-background border-input text-foreground h-12 text-base pr-10"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} disabled={isLoading} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* INPUT KONFIRMASI PASSWORD */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-base">
                Konfirmasi Password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Ulangi password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  minLength={8}
                  className="bg-background border-input text-foreground h-12 text-base pr-10"
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 pt-4">
            <Button type="submit" disabled={isLoading} className="w-full py-6 text-lg bg-primary text-primary-foreground hover:bg-primary/90">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Sedang Mendaftarkan...
                </>
              ) : (
                <>
                  Daftar Akun <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>

            <div className="text-center text-base text-muted-foreground">
              Sudah punya akun?{" "}
              <Link href="/auth/login" className="text-primary hover:underline font-semibold">
                Masuk sekarang
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
