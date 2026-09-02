import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function PUT(request: Request, context: any) {
  try {
    const { params } = context;
    const { id } = await params;
    const body = await request.json();
    const baseUrl = process.env.GOLANG_API_URL || "http://localhost:8080/api";
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const res = await fetch(`${baseUrl}/wallets/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Error updating wallet:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: any) {
  try {
    const { params } = context;
    const { id } = await params;
    const baseUrl = process.env.GOLANG_API_URL || "http://localhost:8080/api";
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const res = await fetch(`${baseUrl}/wallets/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Error deleting wallet:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
