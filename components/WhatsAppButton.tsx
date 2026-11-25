import { MessageCircle } from "lucide-react";
import { SITE } from "@/constants/site";

export default function WhatsAppButton() {
  return (
    <a
      href={`https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent("Hi The Backpackers! I'd like to know more about your trips.")}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Enquire on WhatsApp"
      className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:brightness-95"
    >
      <MessageCircle className="h-5 w-5" aria-hidden />
      <span className="hidden sm:inline">Enquire on WhatsApp</span>
    </a>
  );
}
