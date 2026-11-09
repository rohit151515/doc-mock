import { Resend } from "resend";
import { schema } from "../../../lib/validation";
import { doctors } from "../../../lib/clinic";
const fail = (status: number) => Response.json({ accepted: false }, { status });
const limit = 8192;
function allowedOrigins(req: Request) {
  const requestUrl = new URL(req.url);
  const hosts = new Set(
    [
      requestUrl.host,
      req.headers.get("host"),
      ...(req.headers.get("x-forwarded-host")?.split(",") ?? []),
    ]
      .filter(Boolean)
      .map((host) => host!.trim()),
  );
  const protocols = new Set([
    requestUrl.protocol.slice(0, -1),
    ...(req.headers.get("x-forwarded-proto")?.split(",") ?? []),
  ].map((protocol) => protocol.trim().replace(/:$/, "")));
  const origins = new Set([requestUrl.origin]);
  for (const host of hosts) {
    for (const protocol of protocols) {
      try {
        origins.add(new URL(`${protocol}://${host}`).origin);
      } catch {
        // Ignore malformed proxy headers and retain valid origins.
      }
    }
    if (process.env.NODE_ENV !== "production") {
      try {
        const hostname = new URL(`http://${host}`).hostname;
        if (["localhost", "127.0.0.1", "[::1]"].includes(hostname)) {
          origins.add(new URL(`http://${host}`).origin);
          origins.add(new URL(`https://${host}`).origin);
        }
      } catch {
        // Ignore malformed host headers.
      }
    }
  }
  return origins;
}
export async function POST(req: Request) {
  if (!req.headers.get("content-type")?.startsWith("application/json"))
    return fail(415);
  const origin = req.headers.get("origin");
  if (origin) {
    try {
      if (!allowedOrigins(req).has(new URL(origin).origin)) return fail(403);
    } catch {
      return fail(403);
    }
  }
  if (Number(req.headers.get("content-length")) > limit) return fail(413);
  let value: unknown;
  try {
    const reader = req.body?.getReader();
    if (!reader) return fail(400);
    const chunks: Uint8Array[] = [];
    let bytes = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.length;
      if (bytes > limit) {
        await reader.cancel();
        return fail(413);
      }
      chunks.push(value);
    }
    value = JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    return fail(400);
  }
  const parsed = schema.safeParse(value);
  if (!parsed.success) return fail(422);
  const { RESEND_API_KEY, EMAIL_FROM, CLINIC_NOTIFICATION_EMAIL } = process.env;
  if (!RESEND_API_KEY || !EMAIL_FROM || !CLINIC_NOTIFICATION_EMAIL)
    return fail(503);
  const p = parsed.data;
  const fields = [
    ["Patient", p.name],
    ["Mobile", p.phone],
    ["Age", String(p.age)],
    ["Gender", p.gender],
    [
      "Doctor",
      doctors.find((d) => d.id === p.doctor)?.name[1] ?? "Any available doctor",
    ],
    ["Eye concern", p.concern],
    [
      "Submitted",
      new Date(p.submittedAt).toLocaleString("en-GB", {
        timeZone: "Asia/Dhaka",
      }) + " (Dhaka)",
    ],
  ];
  const escape = (s: string) =>
    s.replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c]!,
    );
  try {
    const result = await new Resend(RESEND_API_KEY).emails.send(
      {
        from: EMAIL_FROM,
        to: CLINIC_NOTIFICATION_EMAIL,
        subject: "New Appointment Request — Jahangir Eye Care",
        text: fields.map(([k, v]) => k + ": " + v).join("\n"),
        html:
          '<main style="max-width:600px;font:16px/1.6 Arial"><h1>Appointment inquiry</h1>' +
          fields
            .map(([k, v]) => "<p><b>" + k + "</b><br>" + escape(v) + "</p>")
            .join("") +
          "</main>",
      },
      { idempotencyKey: "appointment/" + p.requestId },
    );
    if (result.error || !result.data?.id) return fail(502);
    return Response.json({ accepted: true });
  } catch {
    return fail(502);
  }
}
