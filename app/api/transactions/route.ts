import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const baseUrl = process.env.GOLANG_API_URL || "http://localhost:8080/api";

    // 1. Parse dari Frontend
    const body = await request.json();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    const res = await fetch(`${baseUrl}/transactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      // 🔥 2. BUNGKUS LAGI JADI STRING SEBELUM DIKIRIM KE GOLANG!
      body: JSON.stringify(body),
    });

    const data = await res.json();
    console.info("res : ", res);

    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json({ error: error || "Internal Server Error" }, { status: 500 });
  }
}
