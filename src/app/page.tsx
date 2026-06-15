import LeadForm from "@/components/LeadForm";
import { CLIENT } from "@/lib/config";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-indigo-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-5xl flex-col items-center">
        <div className="mb-10 text-center">
          <span className="mb-4 inline-flex rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-700">
            Built for {CLIENT.name}
          </span>
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Hi {CLIENT.name}, welcome to your lead capture demo
          </h1>
          <p className="mx-auto max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            This starter MVP was built around your brief: collect inquiries, generate
            instant AI replies, and keep every submission in one place. Try submitting a
            test lead below.
          </p>
        </div>

        <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-8">
          <p className="mb-6 text-center text-sm font-medium text-slate-500">
            {CLIENT.name}&apos;s lead capture form
          </p>
          <LeadForm />
        </div>

        <p className="mt-8 text-center text-sm text-slate-500">
          Demo built for {CLIENT.name} · Next.js + Groq AI ·{" "}
          <a href="/leads" className="font-medium text-indigo-600 hover:text-indigo-700">
            View saved leads
          </a>
        </p>
      </div>
    </main>
  );
}
