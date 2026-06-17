import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized, token tidak ditemukan" }, { status: 401 });
    }

    // Pastikan URL Golang ini benar (apakah pakai /v1/ atau tidak?)
    const res = await fetch("http://localhost:8080/api/users/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    // Kita ubah nama variabelnya jadi golangResponse biar gak bingung
    const golangResponse = await res.json();

    // ==========================================
    // CARA DEBUGGING: CEK TERMINAL VSCODE KAMU!
    // ==========================================
    console.log("data users : ", golangResponse);

    if (!res.ok) {
      return NextResponse.json({ error: golangResponse.message || "Gagal mengambil data dari backend" }, { status: res.status });
    }

    // 🔥 PERBAIKAN FATAL:
    // Mengambil profil dari golangResponse.data (karena Golang ngirimnya di key "data")
    return NextResponse.json({ success: true, user: golangResponse.data }, { status: 200 });
  } catch (error) {
    console.error("Error di Proxy Next.js:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
