import Link from "next/link";
import Image from "next/image";
import { FaInstagram, FaFacebookF, FaYoutube } from "react-icons/fa";
import {
  email,
  facebook,
  insta,
  logo,
  support_mobile,
  youtube,
} from "@/src/lib/constants";

export default function Footer() {
  return (
    <footer className="bg-[#123F32] text-white">
      <div className="mx-auto max-w-6xl px-6 py-16">
        {/* TOP GRID */}
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* BRAND */}
          <div>
            <div className="flex items-center gap-2">
              <Image
                src={logo} // place logo in /public
                alt="Kupika Ayurveda"
                width={150}
                height={28}
                className="brightness-0 invert"
              />
              {/* <span className="text-lg font-semibold">Kupika Ayurveda</span> */}
            </div>

            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/70">
              Kupika Ayurveda delivers authentic Ayurvedic products crafted with
              natural ingredients to support holistic health and wellness.
            </p>
          </div>

          {/* SUPPORT */}
          <div>
            <h4 className="text-sm font-semibold">Support</h4>
            <ul className="mt-4 space-y-2 text-sm text-white/70">
              <li>
                <Link href="/privacy-policy" className="hover:text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-white">
                  Returns & Refunds
                </Link>
              </li>
            </ul>
          </div>

          {/* CONTACT */}
          <div>
            <h4 className="text-sm font-semibold">Contact</h4>
            <ul className="mt-4 space-y-2 text-sm text-white/70">
              <li>Email: {email}</li>
              <li>Phone: {support_mobile}</li>
            </ul>
          </div>

          {/* SOCIAL */}
          <div>
            <h4 className="text-sm font-semibold">Follow Us</h4>
            <div className="mt-4 flex items-center gap-4 text-xl text-white/80">
              <Link
                href={insta}
                target="_blank"
                aria-label="Instagram"
                className="hover:text-white"
              >
                <FaInstagram />
              </Link>

              <Link
                href={facebook}
                target="_blank"
                aria-label="Facebook"
                className="hover:text-white"
              >
                <FaFacebookF />
              </Link>

              <Link
                href={youtube}
                target="_blank"
                aria-label="YouTube"
                className="hover:text-white"
              >
                <FaYoutube />
              </Link>
            </div>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="mt-16 border-t border-white/10 pt-6">
          <div className="flex flex-col items-center justify-center gap-4 text-sm text-white/60 sm:flex-row">
            <span>
              © {new Date().getFullYear()} Kupika Ayurveda. All rights reserved.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
