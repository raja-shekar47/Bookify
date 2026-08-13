import { Link } from "react-router-dom";
import {
  Clock,
  Copy,
  Check,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Search,
} from "lucide-react";
import { useState } from "react";
import PageHeader from "../components/PageHeader";
import { SITE, mailHref, telHref, whatsappHref } from "../config/site";

const CopyButton = ({ value, label }) => {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard is blocked in some browsers — the text is still selectable.
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
      aria-label={`Copy ${label}`}
    >
      {copied ? (
        <Check className="h-4 w-4 text-brand-600" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
    </button>
  );
};

const Contact = () => (
  <div className="mx-auto max-w-4xl space-y-8 px-6 py-10">
    <PageHeader
      eyebrow="Get in touch"
      title="Contact us"
      description={`Call, WhatsApp or email — we usually reply within an hour. ${SITE.name} is owner-managed, so you'll always speak to someone who knows the property.`}
    />

    {/* ---------------- Primary contact cards ---------------- */}
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {/* Phone */}
      <div className="card-surface flex items-start gap-4 p-6">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600">
          <Phone className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Phone
          </p>
          <a
            href={telHref}
            className="mt-1 block font-display text-xl font-semibold text-slate-900 hover:text-brand-700"
          >
            {SITE.phoneDisplay}
          </a>
          <p className="mt-1 text-xs text-slate-500">Available 7 AM – 10 PM</p>
        </div>
        <CopyButton value={SITE.phone} label="phone number" />
      </div>

      {/* Email */}
      <div className="card-surface flex items-start gap-4 p-6">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600">
          <Mail className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Email
          </p>
          <a
            href={mailHref}
            className="mt-1 block break-all text-sm font-semibold text-slate-900 hover:text-brand-700"
          >
            {SITE.email}
          </a>
          <p className="mt-1 text-xs text-slate-500">
            Best for booking confirmations and invoices
          </p>
        </div>
        <CopyButton value={SITE.email} label="email address" />
      </div>

      {/* WhatsApp */}
      <a
        href={whatsappHref}
        target="_blank"
        rel="noreferrer"
        className="card-surface flex items-start gap-4 p-6 transition hover:-translate-y-0.5 hover:shadow-lg"
      >
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
          <MessageCircle className="h-5 w-5" />
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            WhatsApp
          </p>
          <p className="mt-1 text-sm font-semibold text-slate-900">
            Chat with us
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Send photos, ask for directions, share your ETA
          </p>
        </div>
      </a>

      {/* Address */}
      <a
        href={SITE.mapsUrl}
        target="_blank"
        rel="noreferrer"
        className="card-surface flex items-start gap-4 p-6 transition hover:-translate-y-0.5 hover:shadow-lg"
      >
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600">
          <MapPin className="h-5 w-5" />
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Address
          </p>
          <p className="mt-1 text-sm font-semibold text-slate-900">
            {SITE.address}
          </p>
          <p className="mt-1 text-xs text-slate-500">Open in Google Maps →</p>
        </div>
      </a>
    </div>

    {/* ---------------- Check-in times ---------------- */}
    <div className="card-surface flex flex-wrap items-center gap-x-10 gap-y-4 p-6">
      <span className="grid h-11 w-11 place-items-center rounded-xl bg-sand-100 text-slate-600">
        <Clock className="h-5 w-5" />
      </span>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Check-in
        </p>
        <p className="mt-0.5 font-semibold text-slate-900">
          {SITE.checkInTime}
        </p>
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Check-out
        </p>
        <p className="mt-0.5 font-semibold text-slate-900">
          {SITE.checkOutTime}
        </p>
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Reception
        </p>
        <p className="mt-0.5 font-semibold text-slate-900">On-site, 24/7</p>
      </div>
    </div>

    {/* ---------------- Booking lookup CTA ---------------- */}
    <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-brand-900 p-8 text-center">
      <span className="mx-auto grid h-11 w-11 place-items-center rounded-xl bg-white/10 text-brand-200">
        <Search className="h-5 w-5" />
      </span>
      <h2 className="mt-4 font-display text-xl font-semibold text-white">
        Already booked with us?
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-slate-300">
        Look up your reservation with the booking reference we sent you (it
        looks like AS-7K2M9Q).
      </p>
      <Link to="/booking-status" className="btn-primary mt-6">
        Check booking status
      </Link>
    </div>
  </div>
);

export default Contact;
