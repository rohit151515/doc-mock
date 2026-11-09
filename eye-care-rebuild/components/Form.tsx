"use client";
import { useRef, useState } from "react";
import { schema } from "../lib/validation";
import { clinic, doctors, type Lang } from "../lib/clinic";
export default function Form({
  lang,
  enabled,
}: {
  lang: Lang;
  enabled: boolean;
}) {
  const i = lang === "bn" ? 0 : 1,
    t = (b: string, e: string) => [b, e][i];
  const [busy, setBusy] = useState(false),
    [msg, setMsg] = useState(""),
    lock = useRef(false),
    key = useRef(""),
    submittedAt = useRef("");
  return (
    <form method="post" data-draft-email={enabled ? undefined : clinic.email}
      onChange={() => {
        key.current = "";
        setMsg("");
      }}
      onSubmit={async (e) => {
        e.preventDefault();
        if (lock.current || !enabled) return;
        const form = e.currentTarget;
        if (!key.current) {
          key.current = crypto.randomUUID();
          submittedAt.current = new Date().toISOString();
        }
        const payload = {
          ...Object.fromEntries(new FormData(form)),
          requestId: key.current,
          submittedAt: submittedAt.current,
        };
        const valid = schema.safeParse(payload);
        if (!valid.success) {
          const field = String(valid.error.issues[0].path[0]);
          (form.elements.namedItem(field) as HTMLElement)?.focus();
          setMsg(
            field === "phone"
              ? t(
                  "সঠিক বাংলাদেশি মোবাইল নম্বর দিন।",
                  "Enter a valid Bangladesh mobile number.",
                )
              : t(
                  "চিহ্নিত ঘরটি যাচাই করুন।",
                  "Please check the selected field.",
                ),
          );
          return;
        }
        lock.current = true;
        setBusy(true);
        setMsg("");
        try {
          const r = await fetch("/api/appointment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          if (!r.ok || !(await r.json()).accepted) throw Error();
          setMsg(
            t(
              "অনুরোধ পাঠানো হয়েছে। সময় নিশ্চিত করতে চেম্বার থেকে ফোন করা হবে।",
              "Request submitted. The chamber will call to confirm a time.",
            ),
          );
          form.reset();
          key.current = "";
        } catch {
          setMsg(
            t(
              "অনুরোধ পাঠানো যায়নি। আবার চেষ্টা করুন বা চেম্বারে ফোন করুন।",
              "Could not submit. Please retry or call the chamber.",
            ),
          );
        } finally {
          lock.current = false;
          setBusy(false);
        }
      }}
    >
      <fieldset disabled={busy}>
        <label>
          {t("রোগীর নাম", "Patient name")}
          <input name="name" required maxLength={100} autoComplete="name" />
        </label>
        <label>
          {t("মোবাইল নম্বর", "Mobile number")}
          <input
            name="phone"
            type="tel"
            required
            maxLength={32}
            autoComplete="tel"
            placeholder="01XXXXXXXXX"
          />
        </label>
        <label>
          {t("বয়স (বছর)", "Age in years")}
          <input name="age" required inputMode="numeric" maxLength={3} />
        </label>
        <label>
          {t("লিঙ্গ", "Gender")}
          <select name="gender" required defaultValue="">
            <option value="" disabled>
              {t("বেছে নিন", "Select")}
            </option>
            {[
              ["male", "পুরুষ", "Male"],
              ["female", "নারী", "Female"],
              ["other", "অন্যান্য", "Other"],
              ["private", "বলতে চাই না", "Prefer not to say"],
            ].map(([v, b, e]) => (
              <option key={v} value={v}>
                {t(b, e)}
              </option>
            ))}
          </select>
        </label>
        <label className="full">
          {t("চিকিৎসক", "Doctor")}
          <select name="doctor" defaultValue="any">
            <option value="any">
              {t("যেকোনো চিকিৎসক", "Any available doctor")}
            </option>
            {doctors.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name[i]}
              </option>
            ))}
          </select>
        </label>
        <label className="full">
          {t("চোখের সমস্যার সংক্ষিপ্ত বিবরণ", "Brief eye concern")}
          <textarea name="concern" required maxLength={500} rows={3} />
          <small>
            {t(
              "বিস্তারিত রোগের ইতিহাস বা সংবেদনশীল তথ্য লিখবেন না।",
              "Please leave out detailed medical histories or sensitive information.",
            )}
          </small>
        </label>
        <input name="website" type="hidden" defaultValue="" />
      </fieldset>
      {!enabled && (
        <p>
          {t(
            "লাইভ সাইটে তথ্য পূরণ করে অনুরোধ পাঠান। চেম্বার থেকে ফোন করে সময় নিশ্চিত করা হবে।",
            "Use the live site to send an appointment request. The chamber will call to confirm a time.",
          )}
        </p>
      )}
      <button className="btn" disabled={busy}>
        {busy
          ? t("পাঠানো হচ্ছে…", "Sending…")
          : t("অনুরোধ পাঠান", "Send request")}
      </button>
      <p role="status">{msg}</p>
    </form>
  );
}
