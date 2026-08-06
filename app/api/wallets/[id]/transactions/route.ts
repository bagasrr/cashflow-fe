import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const baseUrl = process.env.GOLANG_API_URL || "http://localhost:8080";
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
      page = "1";
    }

    let limit = searchParams.get("limit");
    if (!limit || limit === "0") {
      limit = "10";
    } else if (Number(limit) >= 50) {
      limit = "50";
    }
    let search = searchParams.get("search") || "";
    let sortBy = searchParams.get("sort_by") || "date";
    let sortOrder = searchParams.get("sort_order") || "desc";

    if (!search) {
      search = "";
    }

    if (!sortBy) {
      sortBy = "created_at";
    }
    if (!sortOrder) {
      sortOrder = "desc";
    }

    const fullUrl = `${baseUrl}/api/wallets/${walletId}/transactions?start_date=${startDate}&end_date=${endDate}&page=${page}&limit=${limit}&search=${search}&sort_by=${sortBy}&sort_order=${sortOrder}`;

    const res = await fetch(fullUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });
    const apiRes = await res.json();
    // console.log("TRX RES", apiRes);

    if (!res.ok) {
      return NextResponse.json({ error: apiRes.message || "Failed to Get Transactions" }, { status: res.status });
    }

    return NextResponse.json(apiRes, { status: 200 });
  } catch (error) {
    console.error("Error Get Transactions : ", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
