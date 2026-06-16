import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Tembak Golang (Server to Server, bebas CORS!)
    const res = await fetch("http://localhost:8080/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    // Buat response untuk dikembalikan ke frontend
    const response = NextResponse.json(data, { status: res.status });

    // 🔥 KUNCI RAHASIA: Teruskan Cookie dari Golang ke Browser
    const setCookieHeader = res.headers.get("Set-Cookie");
    if (setCookieHeader) {
      response.headers.set("Set-Cookie", setCookieHeader);
    }

    return response;
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
