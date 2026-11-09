import { beforeEach, describe, it, expect, vi } from "vitest";
import { POST } from "../app/api/appointment/route";
import { schema } from "../lib/validation";
const send = vi.hoisted(() => vi.fn());
vi.mock("resend", () => ({
  Resend: class {
    emails = { send };
  },
}));
const sample = {
  name: "পরীক্ষা",
  phone: "০১৭১২৩৪৫৬৭৮",
  age: "৩২",
  gender: "private",
  doctor: "any",
  concern: "Synthetic <test>",
  website: "",
  submittedAt: "2026-11-06T06:15:00.000Z",
  requestId: "b1d862c9-2fbe-4caf-972b-7cd4eb44b030",
};
function request(body: unknown) {
  return POST(
    new Request("http://localhost/api/appointment", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: typeof body === "string" ? body : JSON.stringify(body),
    }),
  );
}
function forwardedRequest(origin: string) {
  return POST(
    new Request("http://internal/api/appointment", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        origin,
        "x-forwarded-host": "clinic.example.test",
        "x-forwarded-proto": "https",
      },
      body: JSON.stringify(sample),
    }),
  );
}
describe("appointment endpoint", () => {
  beforeEach(() => {
    vi.stubEnv("RESEND_API_KEY", "synthetic");
    vi.stubEnv("EMAIL_FROM", "sender@example.test");
    vi.stubEnv("CLINIC_NOTIFICATION_EMAIL", "clinic@example.test");
    send.mockReset().mockResolvedValue({ data: { id: "test" }, error: null });
  });
  it("normalizes Bengali digits and the international format", () => {
    expect(schema.parse(sample).phone).toBe("+8801712345678");
    expect(schema.parse({ ...sample, phone: "+8801712345678" }).age).toBe(32);
  });
  it.each([
    ["name", ""],
    ["phone", ""],
    ["phone", "0190"],
    ["age", "-1"],
    ["age", "121"],
    ["gender", ""],
    ["doctor", "unknown"],
    ["concern", ""],
    ["website", "spam"],
  ])("rejects invalid %s (%s)", async (k, v) => {
    expect((await request({ ...sample, [k]: v })).status).toBe(422);
    expect(send).not.toHaveBeenCalled();
  });
  it("escapes HTML and sends only to the configured clinic", async () => {
    expect(await (await request(sample)).json()).toEqual({ accepted: true });
    const [mail, options] = send.mock.calls[0];
    expect(mail.to).toBe("clinic@example.test");
    expect(mail.html).toContain("&lt;test&gt;");
    expect(mail.text).toContain(sample.name);
    expect(options.idempotencyKey).toContain(sample.requestId);
  });
  it("accepts the same origin forwarded by the hosting proxy", async () => {
    expect((await forwardedRequest("https://clinic.example.test")).status).toBe(200);
    expect(send).toHaveBeenCalledOnce();
  });
  it("accepts localhost origins in development behind an HTTPS proxy", async () => {
    const response = await POST(
      new Request("https://0.0.0.0:3000/api/appointment", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          origin: "http://localhost:3000",
          host: "localhost:3000",
          "x-forwarded-host": "clinic.example.test",
          "x-forwarded-proto": "https",
        },
        body: JSON.stringify(sample),
      }),
    );
    expect(response.status).toBe(200);
    expect(send).toHaveBeenCalledOnce();
  });
  it("rejects a different origin forwarded through the hosting proxy", async () => {
    expect((await forwardedRequest("https://attacker.example.test")).status).toBe(403);
    expect(send).not.toHaveBeenCalled();
  });
  it.each([
    ["{", 400],
    ["x".repeat(9000), 413],
  ])("rejects invalid body", async (body, status) => {
    expect((await request(body)).status).toBe(status);
  });
  it("fails closed without credentials", async () => {
    vi.stubEnv("RESEND_API_KEY", "");
    expect((await request(sample)).status).toBe(503);
    expect(send).not.toHaveBeenCalled();
  });
  it("reports provider rejection", async () => {
    send.mockResolvedValue({ error: { message: "private detail" } });
    expect((await request(sample)).status).toBe(502);
  });
  it("reports transport failure", async () => {
    send.mockRejectedValue(Error("network"));
    expect((await request(sample)).status).toBe(502);
  });
});
