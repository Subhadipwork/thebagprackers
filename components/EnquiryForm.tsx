"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useAnimate } from "motion/react";
import { Check, Send } from "lucide-react";
import { DESTINATIONS, SITE } from "@/constants/site";
import { emitTrip } from "@/lib/trip-events";

type Status = "idle" | "error" | "sent";

/** Fields that make up the trip (trip type always has a choice, so it isn't counted). */
const TRIP_FIELDS = ["name", "phone", "destination", "dates", "travellers"] as const;

export default function EnquiryForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [filled, setFilled] = useState(0);
  const filledRef = useRef(0);
  const [scope, animate] = useAnimate<HTMLFormElement>();

  function track(form: HTMLFormElement) {
    let n = 0;
    for (const name of TRIP_FIELDS) {
      const el = form.elements.namedItem(name) as HTMLInputElement | HTMLSelectElement | null;
      if (el && el.value.trim() && el.validity.valid) n++;
    }
    if (n === filledRef.current) return;
    const grew = n > filledRef.current;
    filledRef.current = n;
    setFilled(n);
    if (status === "error" && n === TRIP_FIELDS.length) setStatus("idle");
    emitTrip({ progress: n / TRIP_FIELDS.length, cheer: grew ? "one" : undefined });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      setStatus("error");
      animate(scope.current, { x: [0, -10, 9, -6, 4, 0] }, { duration: 0.45, ease: "easeOut" });
      form.reportValidity();
      return;
    }
    setStatus("sent");
    emitTrip({ progress: 1, cheer: "all" });
    window.setTimeout(() => setStatus((s) => (s === "sent" ? "idle" : s)), 4000);
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
      ref={scope}
      noValidate
      onSubmit={handleSubmit}
      onInput={(e) => track(e.currentTarget)}
      onChange={(e) => track(e.currentTarget)}
      className="rounded-[28px] bg-white p-5 shadow-xl ring-1 ring-forest/5 sm:p-7"
    >
      <div className="flex items-end justify-between gap-4">
        <div>
          <h3 className="font-display text-xl font-bold text-forest">Send us an enquiry</h3>
          <p className="mt-0.5 text-[13px] text-muted">We&apos;ll continue the conversation on WhatsApp.</p>
        </div>
        <span className="shrink-0 rounded-full bg-cream-dark px-2.5 py-1 text-xs font-semibold tabular-nums text-forest">
          {filled}/{TRIP_FIELDS.length}
        </span>
      </div>

      <div
        className="mt-3 h-1.5 overflow-hidden rounded-full bg-forest/10"
        role="progressbar"
        aria-label="Trip details filled in"
        aria-valuemin={0}
        aria-valuemax={TRIP_FIELDS.length}
        aria-valuenow={filled}
      >
        <motion.div
          className="h-full origin-left rounded-full bg-gradient-to-r from-sunset to-gold"
          initial={false}
          animate={{ scaleX: filled / TRIP_FIELDS.length }}
          transition={{ type: "spring", bounce: 0.25, visualDuration: 0.5 }}
        />
      </div>

      <div className="mt-5 grid gap-x-3 gap-y-3.5 sm:grid-cols-2 xl:grid-cols-3">
        <Field label="Name" htmlFor="name">
          <input id="name" name="name" required autoComplete="name" className="field py-2.5" placeholder="Your name" />
        </Field>
        <Field label="Phone" htmlFor="phone">
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            inputMode="tel"
            className="field py-2.5"
            placeholder="+91"
          />
        </Field>
        <Field label="Destination" htmlFor="destination">
          <select id="destination" name="destination" required defaultValue="" className="field py-2.5">
            <option value="" disabled>
              Choose one
            </option>
            {DESTINATIONS.map((d) => (
              <option key={d.slug}>{d.name}</option>
            ))}
            <option>Not sure yet</option>
            <option>Somewhere else</option>
          </select>
        </Field>
        <Field label="Travel dates" htmlFor="dates">
          <input id="dates" name="dates" required className="field py-2.5" placeholder="e.g. mid-March, 5 days" />
        </Field>
        <Field label="Travellers" htmlFor="travellers">
          <input
            id="travellers"
            name="travellers"
            type="number"
            min={1}
            required
            inputMode="numeric"
            className="field py-2.5"
            placeholder="2"
          />
        </Field>
        <Field label="Email" htmlFor="email" optional>
          <input id="email" name="email" type="email" autoComplete="email" className="field py-2.5" placeholder="you@example.com" />
        </Field>
      </div>

      <fieldset className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
        <legend className="float-left w-full text-[13px] font-medium text-forest sm:w-auto">Trip type</legend>
        <div className="relative grid flex-1 grid-cols-2 gap-1 rounded-xl bg-cream-dark p-1">
          {["Group tour", "Customized tour"].map((t, i) => (
            <label
              key={t}
              className="relative flex cursor-pointer items-center justify-center rounded-lg px-3 py-2 text-sm font-medium text-forest/70 transition-all duration-200 hover:text-forest active:scale-[0.98] has-[:checked]:bg-white has-[:checked]:text-forest has-[:checked]:shadow-[0_6px_16px_-10px_rgba(224,122,11,0.7)] has-[:checked]:ring-1 has-[:checked]:ring-sunset has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-sunset"
            >
              <input type="radio" name="tripType" value={t} defaultChecked={i === 0} className="sr-only" />
              {t}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-4">
        <Field label="Message" htmlFor="message" optional>
          <textarea
            id="message"
            name="message"
            rows={2}
            className="field resize-none py-2.5"
            placeholder="Anything we should know? Pace, budget, special occasions…"
          />
        </Field>
      </div>

      <AnimatePresence initial={false}>
        {status === "error" && (
          <motion.p
            key="error"
            role="alert"
            className="overflow-hidden text-sm text-red-700"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1, marginTop: 12 }}
            exit={{ height: 0, opacity: 0, marginTop: 0 }}
            transition={{ duration: 0.2 }}
          >
            Please fill in the required fields.
          </motion.p>
        )}
      </AnimatePresence>

      <motion.button
        type="submit"
        className="btn-primary group mt-4 w-full overflow-hidden py-3"
        whileTap={{ scale: 0.97 }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {status === "sent" ? (
            <motion.span
              key="sent"
              className="inline-flex items-center gap-2"
              initial={{ y: 18, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -18, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Check className="h-4 w-4" aria-hidden />
              Opening WhatsApp…
            </motion.span>
          ) : (
            <motion.span
              key="send"
              className="inline-flex items-center gap-2"
              initial={{ y: 18, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -18, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Send className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-1" aria-hidden />
              Send enquiry on WhatsApp
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
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
    <div className="group">
      <label
        htmlFor={htmlFor}
        className="mb-1 block text-[13px] font-medium text-forest transition-colors duration-200 group-focus-within:text-sunset-deep"
      >
        {label}
        {optional && <span className="ml-1 font-normal text-muted">(optional)</span>}
      </label>
      {children}
    </div>
  );
}
