"use client";

import { useCallback, useState, useEffect } from "react";
import Image from "next/image";
import styles from "./SaveTheDate.module.css";

type Toast = {
  id: number;
  title: string;
  sub: string;
  kind?: "decline";
  out: boolean;
};

export default function SaveTheDateClient({
  guestName,
  fontClassName,
}: {
  guestName: string;
  fontClassName: string;
}) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback(
    (title: string, sub: string, kind?: "decline") => {
      const id = Date.now();
      setToasts((prev) => [...prev, { id, title, sub, kind, out: false }]);
      setTimeout(() => {
        setToasts((prev) =>
          prev.map((t) => (t.id === id ? { ...t, out: true } : t))
        );
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 400);
      }, 2800);
    },
    []
  );

  const onConfirm = useCallback(
    () => addToast("Thank you", "Your attendance has been confirmed"),
    [addToast]
  );
  const onDecline = useCallback(
    () => addToast("Thank you", "We’ll miss you on the day", "decline"),
    [addToast]
  );

  return (
    <div className={fontClassName}>
      <div className={styles.stage}>
        {/* Ambient blurred background derived from the photo */}
        <div className={styles.stageBg}>
          <Image
            src="/couple.avif"
            alt=""
            fill
            aria-hidden
            className={styles.stageBgImg}
          />
        </div>

        <div className={styles.card}>
          {/* Photo */}
          <Image
            src="/couple.avif"
            alt="Diego & Andrea"
            fill
            priority
            style={{
              objectFit: "cover",
              objectPosition: "50% 30%",
              filter: "saturate(0.85) brightness(0.72) contrast(1.02)",
            }}
          />

          {/* Tint */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(180deg, rgba(12,8,4,0.60) 0%, rgba(12,8,4,0.22) 28%, rgba(12,8,4,0.22) 62%, rgba(8,5,2,0.88) 100%)",
            }}
          />

          {/* Vignette */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(120% 70% at 50% 45%, transparent 55%, rgba(0,0,0,0.45) 100%)",
              pointerEvents: "none",
            }}
          />

          {/* Guest names */}
          <div
            style={{
              position: "absolute",
              top: 28,
              left: 0,
              right: 0,
              textAlign: "center",
              color: "rgba(247,241,232,0.92)",
              textShadow: "0 1px 6px rgba(0,0,0,0.65)",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-cormorant), serif",
                fontStyle: "italic",
                fontSize: 12,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                opacity: 0.72,
              }}
            >
              specially for
            </div>
            <div
              style={{
                fontFamily: "var(--font-cormorant), serif",
                fontSize: 15,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                marginTop: 8,
                fontWeight: 400,
              }}
            >
              {guestName}
            </div>
          </div>

          {/* Script headline */}
          <h1
            style={{
              position: "absolute",
              top: 92,
              left: 0,
              right: 0,
              textAlign: "center",
              fontFamily: "var(--font-pinyon), cursive",
              fontSize: 78,
              lineHeight: 1,
              fontWeight: 400,
              margin: 0,
              color: "#fbf6ef",
              textShadow: "0 1px 4px rgba(0,0,0,0.75), 0 4px 32px rgba(0,0,0,0.55)",
            }}
          >
            Save the date
          </h1>

          {/* Bottom block */}
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 32,
              textAlign: "center",
              padding: "0 28px",
            }}
          >
            {/* Date */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "var(--font-cormorant), serif",
                fontSize: 72,
                fontWeight: 300,
                letterSpacing: "0.04em",
                color: "#fbf6ef",
                gap: 18,
                lineHeight: 1,
              }}
            >
              <span>01</span>
              <span
                style={{
                  display: "inline-block",
                  width: 1,
                  height: 56,
                  background: "rgba(251,246,239,0.7)",
                }}
              />
              <span>08</span>
              <span
                style={{
                  display: "inline-block",
                  width: 1,
                  height: 56,
                  background: "rgba(251,246,239,0.7)",
                }}
              />
              <span>27</span>
            </div>

            {/* Couple names — stacked */}
            <div
              style={{
                marginTop: 14,
                fontFamily: "var(--font-cormorant), serif",
                fontSize: 17,
                letterSpacing: "0.32em",
                textTransform: "uppercase",
                color: "rgba(251,246,239,0.92)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 3,
              }}
            >
              <span>Diego Contreras</span>
              <span
                style={{
                  fontFamily: "var(--font-pinyon), cursive",
                  fontSize: 22,
                  letterSpacing: "0.05em",
                  textTransform: "none",
                  color: "rgba(251,246,239,0.6)",
                  lineHeight: 1,
                }}
              >
                &amp;
              </span>
              <span>Andrea Cardona</span>
            </div>

            {/* Location */}
            <div
              style={{
                marginTop: 6,
                fontFamily: "var(--font-cormorant), serif",
                fontStyle: "italic",
                fontSize: 14,
                letterSpacing: "0.18em",
                color: "rgba(251,246,239,0.7)",
              }}
            >
              Medellín · Colombia
            </div>

            {/* Confirm button */}
            <button
              onClick={onConfirm}
              style={{
                marginTop: 22,
                background: "transparent",
                color: "#fbf6ef",
                border: "1px solid rgba(251,246,239,0.85)",
                padding: "12px 28px",
                fontFamily: "var(--font-cormorant), serif",
                fontSize: 13,
                letterSpacing: "0.32em",
                textTransform: "uppercase",
                cursor: "pointer",
                transition: "all 0.25s ease",
              }}
            >
              Confirm attendance
            </button>

            {/* Decline link */}
            <button
              onClick={onDecline}
              style={{
                display: "block",
                margin: "14px auto 0",
                background: "transparent",
                border: "none",
                padding: 0,
                color: "rgba(251,246,239,0.78)",
                fontFamily: "var(--font-cormorant), serif",
                fontStyle: "italic",
                fontSize: 14,
                letterSpacing: "0.06em",
                textDecoration: "underline",
                textUnderlineOffset: "4px",
                textDecorationColor: "rgba(251,246,239,0.45)",
                textDecorationThickness: "1px",
                cursor: "pointer",
              }}
            >
              I won&apos;t be able to attend
            </button>

            {/* Footnote */}
            <div
              style={{
                marginTop: 16,
                fontFamily: "var(--font-cormorant), serif",
                fontStyle: "italic",
                fontSize: 13,
                color: "rgba(251,246,239,0.65)",
                letterSpacing: "0.04em",
              }}
            >
              Formal invitation to follow
            </div>
          </div>
        </div>
      </div>

      {/* Toast stack */}
      <div className={styles.toastStack}>
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`${styles.toast} ${t.out ? styles.toastOut : ""}`}
          >
            <div
              className={`${styles.toastMark} ${t.kind === "decline" ? styles.toastMarkDecline : ""}`}
            >
              {t.kind === "decline" ? "·" : "✓"}
            </div>
            <div>
              <div className={styles.toastTitle}>{t.title}</div>
              <div className={styles.toastSub}>{t.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
