import { getServerBackendBaseUrl } from "@/lib/serverBackendUrl";

export async function GET() {
  try {
    const base = getServerBackendBaseUrl();
    const res = await fetch(`${base}/invoices`);

    const text = await res.text();
    const data = text ? JSON.parse(text) : [];

    return Response.json(data);
  } catch (err) {
    console.error("GET ERROR:", err);
    return Response.json({ error: "GET failed" }, { status: 500 });
  }
}
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const res = await fetch(`${getServerBackendBaseUrl()}/invoices`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const text = await res.text();

    return new Response(text, {
      status: res.status,
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error("POST ERROR:", err);
    return Response.json({ error: "POST failed" }, { status: 500 });
  }
}