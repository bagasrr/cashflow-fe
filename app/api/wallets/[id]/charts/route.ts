import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  // Pastikan tipe data params menerima Promise (aman untuk Next.js 15)
  props: { params: Promise<{ id: string }> },
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 🔥 PERBAIKAN 1: Ekstrak params dengan `await`
    const params = await props.params;
    const walletId = params.id; // Sesuaikan ".id" ini dengan nama folder [id] kamu

    // 🔥 PERBAIKAN 2: Jaring pengaman cegah "undefined" bocor ke Golang
    if (!walletId || walletId === "undefined") {
      return NextResponse.json({ error: "Wallet ID tidak valid" }, { status: 400 });
    }

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("start_date");
    const endDate = searchParams.get("end_date");

    const golangUrl = `http://localhost:8080/api/wallets/${walletId}/charts?start_date=${startDate}&end_date=${endDate}`;

    // Cek log di terminal VSCode kamu!
    // console.log("=> PROXY NEMBAK GOLANG KE:", golangUrl);

    const res = await fetch(golangUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const golangResponse = await res.json();
    // console.log("data chart wallet : ", golangResponse);

    if (!res.ok) {
      return NextResponse.json({ error: golangResponse.message || "Gagal mengambil data chart dompet" }, { status: res.status });
    }

    return NextResponse.json(golangResponse, { status: 200 });
  } catch (error) {
    console.error("Error Proxy Wallet Chart:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
