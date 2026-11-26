import { MessageCircle } from "lucide-react";
import { SITE } from "@/constants/site";

export default function WhatsAppButton() {
  return (
    <a
      href={`https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent("Hi The Backpackers! I'd like to know more about your trips.")}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Enquire on WhatsApp"
      className="wa-in fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm font-semibold text-white shadow-lg transition duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:brightness-95 active:scale-95 motion-reduce:hover:translate-y-0"
    >
      <MessageCircle className="h-5 w-5" aria-hidden />
      <span className="hidden sm:inline">Enquire on WhatsApp</span>
    </a>
  );
}
