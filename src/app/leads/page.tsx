"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CLIENT } from "@/lib/config";
import { getBrowserLeads } from "@/lib/lead-storage";
import type { StoredLead } from "@/lib/types";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<StoredLead[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setLeads(getBrowserLeads());
    setReady(true);
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-indigo-600">
              {CLIENT.name}&apos;s demo
            </p>
            <h1 className="text-3xl font-bold text-slate-900">Saved leads</h1>
            <p className="mt-2 text-sm text-slate-600">
              Submissions from this browser appear here for demo review.
            </p>
          </div>

          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            Back to form
          </Link>
        </div>

        {!ready ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center text-slate-500">
            Loading leads...
          </div>
        ) : leads.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center text-slate-500">
            No leads yet. Submit the form to see entries here.
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Inquiry</th>
                    <th className="px-4 py-3">AI response</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {leads.map((lead) => (
                    <tr key={lead.id} className="align-top">
                      <td className="px-4 py-4 whitespace-nowrap text-slate-500">
                        {formatDate(lead.createdAt)}
                      </td>
                      <td className="px-4 py-4 font-medium text-slate-900">{lead.name}</td>
                      <td className="px-4 py-4 text-slate-700">{lead.email}</td>
                      <td className="px-4 py-4 max-w-xs text-slate-700">{lead.inquiry}</td>
                      <td className="px-4 py-4 max-w-md text-slate-700">{lead.aiResponse}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
