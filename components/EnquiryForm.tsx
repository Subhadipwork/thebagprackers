"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { DESTINATIONS, SITE } from "@/constants/site";

type Status = "idle" | "error";

export default function EnquiryForm() {
  const [status, setStatus] = useState<Status>("idle");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      setStatus("error");
      form.reportValidity();
      return;
    }
    setStatus("idle");
    const data = new FormData(form);
    const get = (k: string) => String(data.get(k) ?? "").trim();

    const lines = [
      "Hi The Backpackers! I'd like to enquire about a trip.",
      "",
      `Name: ${get("name")}`,
      `Phone: ${get("phone")}`,
      get("email") && `Email: ${get("email")}`,
      `Destination: ${get("destination")}`,
      `Preferred dates: ${get("dates")}`,
      `Travellers: ${get("travellers")}`,
      `Trip type: ${get("tripType")}`,
      get("message") && `Message: ${get("message")}`,
    ].filter(Boolean);

    const url = `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(lines.join("\n"))}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      className="rounded-[28px] bg-white p-6 shadow-xl ring-1 ring-forest/5 sm:p-8"
    >
      <h3 className="font-display text-xl font-bold text-forest">Send us an enquiry</h3>
      <p className="mt-1 text-sm text-muted">
        Fill this in and we&apos;ll continue the conversation on WhatsApp.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Field label="Name" htmlFor="name">
          <input id="name" name="name" required autoComplete="name" className="field" placeholder="Your name" />
        </Field>
        <Field label="Phone number" htmlFor="phone">
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            inputMode="tel"
            className="field"
            placeholder="+91"
          />
        </Field>
        <Field label="Email" htmlFor="email" optional>
          <input id="email" name="email" type="email" autoComplete="email" className="field" placeholder="you@example.com" />
        </Field>
        <Field label="Destination of interest" htmlFor="destination">
          <select id="destination" name="destination" required defaultValue="" className="field">
            <option value="" disabled>
              Choose a destination
            </option>
            {DESTINATIONS.map((d) => (
              <option key={d.slug}>{d.name}</option>
            ))}
            <option>Not sure yet</option>
            <option>Somewhere else</option>
          </select>
        </Field>
        <Field label="Preferred travel dates" htmlFor="dates">
          <input id="dates" name="dates" required className="field" placeholder="e.g. mid-March, 5 days" />
        </Field>
        <Field label="Number of travellers" htmlFor="travellers">
          <input
            id="travellers"
            name="travellers"
            type="number"
            min={1}
            required
            inputMode="numeric"
            className="field"
            placeholder="2"
          />
        </Field>
      </div>

      <fieldset className="mt-5">
        <legend className="text-sm font-medium text-forest">Trip type</legend>
        <div className="mt-2 grid gap-3 sm:grid-cols-2">
          {["Group tour", "Customized tour"].map((t, i) => (
            <label
              key={t}
              className="flex cursor-pointer items-center gap-3 rounded-xl border border-forest/15 bg-white px-4 py-3 text-sm has-[:checked]:border-sunset has-[:checked]:bg-sunset/5"
            >
              <input
                type="radio"
                name="tripType"
                value={t}
                defaultChecked={i === 0}
                className="h-4 w-4 accent-sunset"
              />
              {t}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-5">
        <Field label="Message" htmlFor="message" optional>
          <textarea
            id="message"
            name="message"
            rows={4}
            className="field resize-y"
            placeholder="Anything we should know? Pace, budget, special occasions…"
          />
        </Field>
      </div>

      {status === "error" && (
        <p role="alert" className="mt-4 text-sm text-red-700">
          Please fill in the required fields.
        </p>
      )}

      <button type="submit" className="btn-primary mt-6 w-full py-3.5">
        <Send className="h-4 w-4" aria-hidden />
        Send enquiry on WhatsApp
      </button>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  optional,
  children,
}: {
  label: string;
  htmlFor: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-forest">
        {label}
        {optional && <span className="ml-1 font-normal text-muted">(optional)</span>}
      </label>
      {children}
    </div>
  );
}
