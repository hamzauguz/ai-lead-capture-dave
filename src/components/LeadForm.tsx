"use client";

import { FormEvent, useState } from "react";
import type { LeadResponse } from "@/lib/types";

type FormState = "idle" | "loading" | "success" | "error";

export default function LeadForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [inquiry, setInquiry] = useState("");
  const [state, setState] = useState<FormState>("idle");
  const [aiResponse, setAiResponse] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("loading");
    setError("");
    setAiResponse("");

    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, inquiry }),
      });

      const data = (await response.json()) as LeadResponse;

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Submission failed.");
      }

      setAiResponse(data.aiResponse || "");
      setState("success");
      setName("");
      setEmail("");
      setInquiry("");
    } catch (submitError) {
      setState("error");
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Something went wrong. Please try again."
      );
    }
  }

  return (
    <div className="w-full max-w-xl">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="name" className="mb-2 block text-sm font-medium text-slate-700">
            Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Jane Doe"
            required
            disabled={state === "loading"}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:opacity-60"
          />
        </div>

        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="jane@company.com"
            required
            disabled={state === "loading"}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:opacity-60"
          />
        </div>

        <div>
          <label htmlFor="inquiry" className="mb-2 block text-sm font-medium text-slate-700">
            Inquiry
          </label>
          <textarea
            id="inquiry"
            value={inquiry}
            onChange={(event) => setInquiry(event.target.value)}
            placeholder="Tell us what you need help with..."
            rows={5}
            required
            disabled={state === "loading"}
            className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:opacity-60"
          />
        </div>

        <button
          type="submit"
          disabled={state === "loading"}
          className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {state === "loading" ? "Generating response..." : "Submit inquiry"}
        </button>
      </form>

      {state === "error" && error && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {state === "success" && aiResponse && (
        <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
          <p className="mb-2 text-sm font-semibold text-emerald-800">
            Thank you! Here is your personalized response:
          </p>
          <p className="text-sm leading-6 text-emerald-900">{aiResponse}</p>
        </div>
      )}
    </div>
  );
}
