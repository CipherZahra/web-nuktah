"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { LogOut, UserRound } from "lucide-react";

import { getUserProfile, signOut, type UserProfile } from "@/lib/checkout";
import { Link, useRouter, usePathname } from "@/i18n";
import { cn } from "@/lib/utils";

function initialsOf(email: string): string {
  const name = email.split("@")[0] ?? "?";
  const parts = name.split(/[\s._-]+/).filter(Boolean);
  const a = parts[0]?.[0] ?? "?";
  const b = parts.length > 1 ? (parts[parts.length - 1][0] ?? "") : "";
  return (a + b).toUpperCase() || "?";
}

interface AccountMenuProps {
  /** Rendered in place of the chip when signed out (e.g. the Download button). */
  fallback: React.ReactNode;
}

export function AccountMenu({ fallback }: AccountMenuProps) {
  const t = useTranslations("account");
  const router = useRouter();
  const pathname = usePathname();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [checked, setChecked] = useState(false);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  // Re-check on every navigation so a sign-out performed elsewhere (e.g. the
  // account page) resets the chip without a full reload.
  useEffect(() => {
    let cancelled = false;
    void getUserProfile().then((p) => {
      if (cancelled) return;
      setProfile(p);
      setChecked(true);
    });
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Avoid flashing the Download button before the session check resolves.
  if (!checked) return <div className="h-10 w-24" aria-hidden="true" />;
  if (!profile) return <>{fallback}</>;

  const handleSignOut = () => {
    signOut();
    setProfile(null);
    setOpen(false);
    router.push("/");
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={t("menuLabel")}
        className={cn(
          "grid h-10 w-10 place-items-center rounded-full bg-accent text-white text-sm font-bold",
          "ring-offset-primary-bg transition-all duration-200 hover:bg-accent-hover hover:shadow-glow",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
          open && "ring-2 ring-accent",
        )}
      >
        {initialsOf(profile.email)}
      </button>

      {open && (
        <div
          role="menu"
          aria-label={t("menuLabel")}
          className="absolute end-0 top-[calc(100%+0.5rem)] z-[60] w-64 rounded-2xl border border-border bg-white p-2 shadow-lg"
        >
          <div className="px-3 py-3 border-b border-border-subtle mb-1">
            <p className="text-sm font-semibold text-text-primary truncate" dir="ltr">
              {profile.email}
            </p>
          </div>
          <Link
            href="/account"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:bg-accent-subtle hover:text-text-primary"
          >
            <UserRound size={16} />
            {t("navItem")}
          </Link>
          <button
            type="button"
            role="menuitem"
            onClick={handleSignOut}
            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:bg-red-50 hover:text-red-600 cursor-pointer"
          >
            <LogOut size={16} />
            {t("signOut")}
          </button>
        </div>
      )}
    </div>
  );
}
