"use client";

import { useEffect, useRef } from "react";
import ModalHeadlessUi from "../modal/headless-ui-modal";

function decodeJwt(token) {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
      .join(""),
  );
  return JSON.parse(jsonPayload);
}

export default function GoogleLoginModal({ open, onClose, onSuccess }) {
  const googleBtnRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    if (!window.google) return;

    const timer = setTimeout(() => {
      if (!googleBtnRef.current) return;

      googleBtnRef.current.innerHTML = "";
      window.google.accounts.id.cancel();

      window.google.accounts.id.initialize({
        client_id:
          "349571402392-eduuaq2lpsbol3hqvdo1rounlbkbjg6o.apps.googleusercontent.com",
        callback: (response) => {
          console.log("Google raw response:", response);

          if (!response.credential) {
            console.error("No credential received from Google");
            return;
          }

          try {
            const payload = decodeJwt(response.credential);

            console.log("Decoded Google payload:", payload.email, payload.name);

            onSuccess({
              email: payload.email,
              name: payload.name,
            });
          } catch (err) {
            console.error("Failed to decode Google token", err);
          }
        },
      });

      window.google.accounts.id.renderButton(googleBtnRef.current, {
        theme: "outline",
        size: "large",
        width: 280,
      });
    }, 150);

    return () => clearTimeout(timer);
  }, [open, onSuccess]);

  return (
    <ModalHeadlessUi
      isOpen={open}
      onClose={onClose ?? (() => {})}
      title="Login to continue"
    >
      <div className="flex flex-col items-center gap-4 py-6">
        <div ref={googleBtnRef} style={{ minHeight: 44 }} />
        <p className="text-xs text-gray-500">Secure login with Google</p>
      </div>
    </ModalHeadlessUi>
  );
}
