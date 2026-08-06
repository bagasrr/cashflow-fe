import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    console.log("GET /api/wallets/me called");
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const baseUrl = process.env.GOLANG_API_URL || "http://localhost:8080";
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const res = await fetch(`${baseUrl}/api/wallets/me?page=${page}&limit=${limit}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const data = await res.json();
    console.log("Server walltes/me : ", data);
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error fetching wallets:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
