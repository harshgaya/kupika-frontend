import { useEffect, useRef, useState } from "react";
import ModalHeadlessUi from "../modal/headless-ui-modal";

function guest() {
  if (typeof window === "undefined") return null;

  let id = localStorage.getItem("guest_id");

  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("guest_id", id);
  }

  return id;
}

export default function OtpLoginModal({ open, onClose, onSuccess }) {
  const [phone, setPhone] = useState("");
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [sentOtp, setSentOtp] = useState("");
  const [step, setStep] = useState("phone");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [seconds, setSeconds] = useState(0);
  const refs = useRef([]);

  useEffect(() => {
    if (!seconds) return;

    const timer = setInterval(() => {
      setSeconds((s) => Math.max(0, s - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds]);

  async function send() {
    setError("");

    if (!/^[6-9]\d{9}$/.test(phone)) {
      setError("Enter a valid 10-digit Indian mobile number.");
      return;
    }

    setBusy(true);

    try {
      const r = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone }),
      });

      const j = await r.json();

      if (!r.ok) {
        setError(j.error || "Could not send OTP.");
        return;
      }

      const otp = j.data?.otp || j.otp;

      if (!otp) {
        setError("OTP was not generated.");
        return;
      }

      setSentOtp(String(otp));
      setDigits(["", "", "", "", "", ""]);
      setStep("otp");
      setSeconds(30);

      setTimeout(() => {
        refs.current[0]?.focus();
      }, 100);
    } catch {
      setError("Could not send OTP. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function verify() {
    const code = digits.join("");

    setError("");

    if (code.length !== 6) {
      setError("Enter the 6-digit OTP.");
      return;
    }

    if (!sentOtp) {
      setError("Please request a new OTP.");
      return;
    }

    if (code !== sentOtp) {
      setError("Incorrect OTP.");
      return;
    }

    setBusy(true);

    try {
      const r = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone,
          guest_id: guest(),
        }),
      });

      const j = await r.json();

      if (!r.ok) {
        setError(j.error || "Login failed. Please try again.");
        return;
      }

      localStorage.removeItem("guest_id");

      setStep("phone");
      setDigits(["", "", "", "", "", ""]);
      setSentOtp("");
      setError("");

      onSuccess?.(j.data || j);
    } catch {
      setError("Login failed. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  function digit(i, value) {
    value = value.replace(/\D/g, "").slice(-1);

    const next = [...digits];
    next[i] = value;

    setDigits(next);

    if (value && i < 5) {
      refs.current[i + 1]?.focus();
    }
  }

  function key(i, e) {
    if (e.key === "Backspace" && !digits[i] && i > 0) {
      refs.current[i - 1]?.focus();
    }

    if (e.key === "Enter" && digits.join("").length === 6) {
      verify();
    }
  }

  function paste(e) {
    const value = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (value.length !== 6) return;

    e.preventDefault();

    const next = ["", "", "", "", "", ""];

    value.split("").forEach((v, i) => {
      next[i] = v;
    });

    setDigits(next);

    setTimeout(() => {
      refs.current[5]?.focus();
    }, 50);
  }

  function changePhone() {
    setStep("phone");
    setDigits(["", "", "", "", "", ""]);
    setSentOtp("");
    setError("");
  }

  return (
    <ModalHeadlessUi
      isOpen={open}
      onClose={onClose || (() => {})}
      title={
        step === "phone" ? "Verify mobile number" : "Enter verification code"
      }
    >
      <div className="px-5 pb-6 pt-4">
        <div className="mb-5 rounded-2xl bg-emerald-50 p-4">
          <p className="font-semibold text-gray-900">Secure checkout</p>

          <p className="mt-1 text-sm leading-5 text-gray-600">
            We use your mobile number to save this order to your account and
            show tracking later.
          </p>
        </div>

        {step === "phone" ? (
          <>
            <label className="mb-2 block text-sm font-medium text-gray-800">
              Mobile number
            </label>

            <div className="flex h-14 overflow-hidden rounded-xl border-2 border-gray-200 bg-white focus-within:border-emerald-700">
              <span className="grid place-items-center border-r bg-gray-50 px-4 font-medium text-gray-700">
                +91
              </span>

              <input
                autoFocus
                className="min-w-0 flex-1 px-4 text-lg outline-none"
                inputMode="numeric"
                maxLength={10}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                placeholder="98765 43210"
              />
            </div>

            <button
              className="mt-4 w-full rounded-xl bg-primary py-3.5 font-semibold text-white disabled:opacity-50"
              disabled={busy}
              onClick={send}
            >
              {busy ? "Sending OTP…" : "Send OTP"}
            </button>

            <p className="mt-3 text-center text-xs text-gray-500">
              By continuing, you agree to receive a one-time verification SMS.
            </p>
          </>
        ) : (
          <>
            <p className="text-sm text-gray-600">
              We sent a code to <b>+91 {phone}</b>.{" "}
              <button
                className="font-medium text-emerald-800"
                onClick={changePhone}
              >
                Change
              </button>
            </p>

            <div className="mt-5 flex justify-between gap-2" onPaste={paste}>
              {digits.map((value, i) => (
                <input
                  key={i}
                  ref={(el) => (refs.current[i] = el)}
                  className="h-12 min-w-0 w-full rounded-xl border-2 border-gray-200 text-center text-xl font-bold outline-none focus:border-emerald-700"
                  inputMode="numeric"
                  maxLength={1}
                  value={value}
                  onChange={(e) => digit(i, e.target.value)}
                  onKeyDown={(e) => key(i, e)}
                />
              ))}
            </div>

            <button
              className="mt-5 w-full rounded-xl bg-primary py-3.5 font-semibold text-white disabled:opacity-50"
              disabled={busy}
              onClick={verify}
            >
              {busy ? "Verifying…" : "Verify & continue"}
            </button>

            <button
              disabled={seconds > 0 || busy}
              className="mt-3 w-full text-sm font-medium text-emerald-800 disabled:text-gray-400"
              onClick={send}
            >
              {seconds > 0 ? `Resend OTP in ${seconds}s` : "Resend OTP"}
            </button>
          </>
        )}

        {error && (
          <p className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </p>
        )}
      </div>
    </ModalHeadlessUi>
  );
}
