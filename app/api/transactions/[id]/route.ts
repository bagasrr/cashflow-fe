import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function PUT(request: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const baseUrl = process.env.GOLANG_API_URL || "http://localhost:8080";

    // 1. Parse dari Frontend
    const body = await request.json();
    console.log("body : ", body);
    // return;

    const params = await props.params;
    const id = params.id;
    console.log("params ID: ", id);

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    const res = await fetch(`${baseUrl}/api/transactions/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    console.info("res nih kontol : ", res);

    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json({ error: error || "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const baseUrl = process.env.GOLANG_API_URL || "http://localhost:8080";

    const params = await props.params;
    const id = params.id;
    console.log("params ID: ", id);

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    const res = await fetch(`${baseUrl}/api/transactions/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    console.info("res nih kontol : ", res);

    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json({ error: error || "Internal Server Error" }, { status: 500 });
  }
}
