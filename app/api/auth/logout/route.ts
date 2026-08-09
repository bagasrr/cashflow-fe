import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  //   cookieStore.delete("token");
  //   return NextResponse.json({ message: "Logout successful" }, { status: 200 });
  try {
    const golangApiUrl = process.env.GOLANG_API_URL || "http://localhost:8080/api";

    // Tembak Golang untuk logout
    const res = await fetch(`${golangApiUrl}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || "Logout failed");
    }

    // Hapus cookie token
    const response = NextResponse.json({ message: "Logout successful" }, { status: 200 });
    response.cookies.delete("token");

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
