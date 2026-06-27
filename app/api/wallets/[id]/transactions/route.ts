import { error } from "console";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { start } from "repl";

export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorize" }, { status: 401 });
    }

    const params = await props.params;
    const walletId = params.id;
    if (!walletId || walletId === "undefined") {
      return NextResponse.json({ error: "Wallet ID Tidak Valid" }, { status: 400 });
    }

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("start_date");
    const endDate = searchParams.get("end_date");

    let page = searchParams.get("page");
    if (!page || page === "0") {
      return (page = "1");
    }
    let limit = searchParams.get("limit");
    if (!limit || limit === "0") {
      return (limit = "10");
    } else if (limit >= "100") {
      return (limit = "20");
    }

    const fullUrl = `http://localhost:8080/api/wallets/${walletId}/transactions?start_date=${startDate}&end_date=${endDate}&page=${page}&limit=${limit}`;

    console.info("API TRANSACTION HIT");
    console.info("FULL URL : ", fullUrl);

    const res = await fetch(fullUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });
    const apiRes = await res.json();
    console.log("TRX RES", apiRes);

    if (!res.ok) {
      return NextResponse.json({ error: apiRes.message || "Failed to Get Transactions" }, { status: res.status });
    }

    return NextResponse.json(apiRes, { status: 200 });
  } catch (error) {
    console.error("Error Get Transactions : ", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
