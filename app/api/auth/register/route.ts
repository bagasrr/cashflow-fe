import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const golangApiUrl = process.env.GOLANG_API_URL || "http://localhost:8080/api";
    const body = await request.json();

    // Tembak Golang (Server to Server, bebas CORS!)
    const res = await fetch(`${golangApiUrl}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    const response = NextResponse.json(data, { status: res.status });

    // Jika berhasil, set cookie
    if (res.ok) {
      const token = data.token; // Pastikan Golang mengembalikan token di response
      response.cookies.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });
    }

    return response;
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" + error }, { status: 500 });
  }
}
