import Link from "next/link";

export default function HomePage() {
  return (
    <main className="bg-white">
      {/* Hero */}
      <section className="border-b border-gray-100 bg-gray-50/50 px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-12 lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-primary-600">Enterprise Employee Performance Platform</p>
              <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Improve Employee Performance, Resilience, and Wellbeing.
              </h1>
              <p className="mt-4 text-lg text-gray-600">
                Science-based, structured 12-week programme delivered as an employee benefit, with an integrated AI tool
                to help answer fitness questions on demand. Built for HR and People leaders in modern organisations.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/#contact"
                  className="inline-flex items-center justify-center rounded-lg bg-primary-600 px-6 py-3 text-base font-medium text-white shadow-soft hover:bg-primary-700"
                >
                  Book a demo
                </Link>
                <Link
                  href="/#contact"
                  className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-700 hover:bg-gray-50"
                >
                  Contact us
                </Link>
                <Link
                  href="/platform"
                  className="inline-flex items-center justify-center rounded-lg border border-primary-200 bg-white px-6 py-3 text-base font-medium text-primary-600 hover:bg-primary-50"
                >
                  Login
                </Link>
              </div>
              <div className="mt-10 flex flex-wrap gap-8 text-sm">
                <div>
                  <p className="font-semibold text-gray-900">12-week</p>
                  <p className="text-gray-500">Structured programme</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Global</p>
                  <p className="text-gray-500">Remote-ready delivery</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Science-based</p>
                  <p className="text-gray-500">Performance & resilience</p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-card">
              <p className="text-sm font-medium text-gray-500">Team Resilience Snapshot</p>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-xl bg-gray-50 p-3">
                  <p className="text-xs text-gray-500">Programme engagement</p>
                  <p className="text-xl font-semibold text-gray-900">82%</p>
                  <p className="text-xs text-green-600">+14% vs last month</p>
                </div>
                <div className="rounded-xl bg-gray-50 p-3">
                  <p className="text-xs text-gray-500">Burnout risk</p>
                  <p className="text-xl font-semibold text-gray-900">-23%</p>
                  <p className="text-xs text-green-600">Improving</p>
                </div>
                <div className="rounded-xl bg-gray-50 p-3">
                  <p className="text-xs text-gray-500">Productivity index</p>
                  <p className="text-xl font-semibold text-gray-900">+18%</p>
                  <p className="text-xs text-green-600">After 12 weeks</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="scroll-mt-20 border-b border-gray-100 px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary-600">How it works</p>
          <h2 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">Low-friction rollout. Measurable outcomes.</h2>
          <p className="mt-2 max-w-2xl text-gray-600">
            A simple deployment model designed for HR, Talent, and People teams to implement within weeks, not months.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { step: 1, title: "Company signs up", text: "Select your tier, confirm employee numbers, and choose your launch date." },
              { step: 2, title: "Employees get access", text: "Employees receive secure login details and a clear, structured weekly path." },
              { step: 3, title: "Employees follow the programme", text: "A 12-week performance and resilience journey combining training, habits, and nutrition." },
              { step: 4, title: "Leadership receives reports", text: "Engagement and completion data, plus performance and resilience insights by team." },
            ].map((item) => (
              <div key={item.step} className="rounded-xl border border-gray-200 bg-white p-5 shadow-card">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-700">{item.step}</span>
                <h3 className="mt-3 font-semibold text-gray-900">{item.title}</h3>
                <p className="mt-1 text-sm text-gray-600">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Programme */}
      <section id="programme" className="scroll-mt-20 border-b border-gray-100 bg-gray-50/50 px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary-600">Programme & features</p>
          <h2 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">A complete performance and resilience system in one platform.</h2>
          <p className="mt-2 max-w-2xl text-gray-600">
            Built from proven training, behavioural science, and performance frameworks. Beyond the 12-week journey, employees access on-demand training, nutrition guides, and mental resilience tools.
          </p>
          <div className="mt-8">
            <Link href="/platform" className="inline-flex items-center rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-700">
              Login to access the platform
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section id="benefits" className="scroll-mt-20 border-b border-gray-100 px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary-600">Corporate benefits</p>
          <h2 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">From burnout risk to sustainable high performance.</h2>
          <p className="mt-2 max-w-2xl text-gray-600">
            Position performance, wellbeing, and resilience as a strategic advantage—not just a wellness initiative.
          </p>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="scroll-mt-20 border-b border-gray-100 bg-gray-50/50 px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary-600">Pricing</p>
          <h2 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">Simple, transparent per-employee pricing.</h2>
          <p className="mt-2 max-w-2xl text-gray-600">Scale from small teams to global organisations.</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-card">
              <h3 className="font-semibold text-gray-900">Small</h3>
              <p className="text-sm text-gray-500">Up to 25 employees</p>
              <p className="mt-2 text-xl font-bold text-gray-900">£10.99 <span className="text-sm font-normal text-gray-500">/ employee / month</span></p>
            </div>
            <div className="rounded-xl border-2 border-primary-200 bg-white p-5 shadow-card">
              <span className="text-xs font-semibold text-primary-600">Most popular</span>
              <h3 className="mt-1 font-semibold text-gray-900">Medium</h3>
              <p className="text-sm text-gray-500">Up to 100 employees</p>
              <p className="mt-2 text-xl font-bold text-gray-900">£6.99 <span className="text-sm font-normal text-gray-500">/ employee / month</span></p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-card">
              <h3 className="font-semibold text-gray-900">Enterprise</h3>
              <p className="text-sm text-gray-500">100+ employees</p>
              <p className="mt-2 text-xl font-bold text-gray-900">Custom pricing</p>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="scroll-mt-20 border-b border-gray-100 px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary-600">About the programme</p>
          <h2 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">Built at the intersection of sales, performance, and human resilience.</h2>
          <p className="mt-2 max-w-2xl text-gray-600">
            Protocol84 brings experience across high-performing environments, performance coaching, and evidence-based training design.
          </p>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="scroll-mt-20 px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary-600">Contact & demo</p>
          <h2 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">Book a tailored walk-through for your organisation.</h2>
          <p className="mt-2 text-gray-600">
            Share a few details and we&apos;ll schedule a session focused on your context, teams, and goals.
          </p>
          <div className="mt-8">
            <Link href="/platform" className="inline-flex items-center rounded-lg bg-primary-600 px-6 py-3 text-base font-medium text-white hover:bg-primary-700">
              Login to platform
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-50 px-4 py-8 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-gray-500">Employee performance & resilience platform for modern organisations.</p>
          <div className="flex gap-6 text-sm">
            <Link href="/#programme" className="text-gray-600 hover:text-gray-900">Programme</Link>
            <Link href="/#pricing" className="text-gray-600 hover:text-gray-900">Pricing</Link>
            <Link href="/#contact" className="text-gray-600 hover:text-gray-900">Contact</Link>
            <Link href="/platform" className="font-medium text-primary-600 hover:text-primary-700">Login</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
