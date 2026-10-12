import Link from "next/link";
import { CheckCircle2, XCircle } from "lucide-react";

const PLAY_URL = "https://play.google.com/apps/testing/app.nuktah";

export function PaymentResult({ kind }: { kind: "success" | "failure" }) {
  const success = kind === "success";

  const titleAr = success ? "تم استلام الدفع" : "لم يكتمل الدفع";
  const titleEn = success ? "Payment received" : "Payment not completed";
  const descAr = success
    ? "تم استلام الدفع ورصيدك في الطريق إليك. يظهر تلقائيًا في التطبيق خلال دقائق."
    : "لم يكتمل الدفع ولم يُخصم منك أي مبلغ — يمكنك المحاولة من التطبيق.";
  const descEn = success
    ? "Your Nuktah payment was received and your credits are on the way. They appear in the app automatically within a few minutes."
    : "The payment was not completed. You have not been charged — you can try again from the app.";

  return (
    <section className="min-h-screen flex items-center justify-center px-8 py-16 bg-primary-bg">
      <div className="max-w-md w-full text-center">
        <div
          className={`w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center ${
            success ? "bg-accent-subtle text-accent" : "bg-red-50 text-red-500"
          }`}
        >
          {success ? <CheckCircle2 size={32} /> : <XCircle size={32} />}
        </div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-text-primary mb-2 text-balance" dir="rtl">
          {titleAr}
        </h1>
        <p className="text-lg font-semibold text-text-secondary mb-4" dir="ltr">
          {titleEn}
        </p>
        <p className="text-sm text-text-secondary leading-relaxed mb-3" dir="rtl">
          {descAr}
        </p>
        <p className="text-sm text-text-secondary leading-relaxed mb-8" dir="ltr">
          {descEn}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href={PLAY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center h-12 px-6 rounded-xl bg-accent text-white text-sm font-medium shadow-md hover:bg-accent-hover hover:shadow-glow transition-all duration-200"
          >
            افتح التطبيق · Open the app
          </a>
          <Link
            href="/"
            className="inline-flex items-center justify-center h-12 px-6 rounded-xl border border-border/60 text-text-primary text-sm font-medium hover:bg-card-bg hover:border-accent/50 transition-all duration-200"
          >
            الرئيسية · Home
          </Link>
          <Link
            href="/en/"
            lang="en"
            className="inline-flex items-center justify-center h-12 px-6 rounded-xl border border-border/60 text-text-secondary text-sm font-medium hover:bg-card-bg hover:border-accent/50 transition-all duration-200"
          >
            English
          </Link>
        </div>
      </div>
    </section>
  );
}
