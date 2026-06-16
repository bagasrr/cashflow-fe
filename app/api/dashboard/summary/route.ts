import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. Ambil parameter start_date dan end_date dari URL Frontend
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("start_date");
    const endDate = searchParams.get("end_date");
    const walletId = searchParams.get("wallet_id");

    const targetUrl = new URL("http://localhost:8080/api/dashboard/summary");
    if (startDate) targetUrl.searchParams.append("start_date", startDate);
    if (endDate) targetUrl.searchParams.append("end_date", endDate);

    // Kalau ada walletId dan bukan "all", kirim ke Golang
    if (walletId && walletId !== "all") {
      targetUrl.searchParams.append("wallet_id", walletId);
    }

    // 3. Tembak backend Golang dengan bawa token
    const res = await fetch(targetUrl.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const golangResponse = await res.json();

    if (!res.ok) {
      return NextResponse.json({ error: golangResponse.message || "Gagal mengambil summary" }, { status: res.status });
    }

    // 4. Lempar data matang ke Frontend
    return NextResponse.json(golangResponse, { status: 200 });
  } catch (error) {
    console.error("Error Dashboard Summary Proxy:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
