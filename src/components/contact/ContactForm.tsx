import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Phone, MessageCircle, Send, User, CheckCircle2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";

type ContactMethod = "phone" | "telegram";

export function ContactForm() {
  const [name, setName] = useState("");
  const [contactMethod, setContactMethod] = useState<ContactMethod>("phone");
  const [phone, setPhone] = useState("");
  const [telegram, setTelegram] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const { t } = useLanguage();

  const formatPhone = (v: string) => setPhone(v.replace(/\D/g, "").substring(0, 9));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const contactValue = contactMethod === "phone" ? `+998${phone}` : `@${telegram.replace(/^@/, "")}`;
      const { error } = await supabase.from("contact_messages").insert({
        name: name.trim(),
        phone: contactValue,
        subject: `Aloqa: ${contactMethod.toUpperCase()}`,
        message: message.trim(),
        user_id: user?.id || null,
      });
      if (error) throw error;
      toast({ title: t("contact.toastSuccess"), description: t("contact.toastSuccessDesc") });
      setName(""); setPhone(""); setTelegram(""); setMessage("");
    } catch {
      toast({ title: t("contact.toastError"), description: t("contact.toastErrorDesc"), variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2 text-foreground">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #1d4ed8, #1e3a8a)" }}
          >
            <MessageCircle className="w-4 h-4 text-white" />
          </div>
          {t("contact.formTitle")}
        </h2>
        <p className="text-muted-foreground text-sm mt-1.5">
          {t("contact.formSubtitle")}
        </p>
      </div>

      <div className="space-y-5 flex-1">

        {/* Name + Contact method row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {t("contact.labelName")}
            </Label>
            <div className="relative group">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("contact.placeholderName")}
                className="pl-10 h-11 rounded-xl bg-muted/30 border-muted focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-all"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {t("contact.labelContactMethod")}
            </Label>
            <div className="flex p-1 bg-muted/50 rounded-xl h-11 gap-1">
              {(["phone", "telegram"] as ContactMethod[]).map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setContactMethod(method)}
                  className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg text-sm font-semibold transition-all ${
                    contactMethod === method
                      ? "bg-background shadow-sm text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {method === "phone" ? (
                    <><Phone className="w-3.5 h-3.5" /> {t("contact.contactPhone")}</>
                  ) : (
                    <><MessageCircle className="w-3.5 h-3.5" /> {t("contact.contactTelegram")}</>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Phone / Telegram input */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {contactMethod === "phone" ? t("contact.labelPhone") : t("contact.labelTelegramUser")}
          </Label>
          <div className="flex rounded-xl overflow-hidden border border-muted focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/10 transition-all">
            <div className="flex items-center justify-center px-4 bg-muted/50 border-r border-muted text-sm font-bold text-muted-foreground select-none">
              {contactMethod === "phone" ? "+998" : "@"}
            </div>
            <Input
              type={contactMethod === "phone" ? "tel" : "text"}
              value={contactMethod === "phone" ? phone : telegram}
              onChange={(e) =>
                contactMethod === "phone" ? formatPhone(e.target.value) : setTelegram(e.target.value)
              }
              placeholder={
                contactMethod === "phone" ? t("contact.placeholderPhone") : t("contact.placeholderTelegram")
              }
              className="rounded-none border-0 h-11 bg-muted/30 focus-visible:ring-0 focus-visible:ring-offset-0"
              required
            />
          </div>
        </div>

        {/* Message */}
        <div className="space-y-1.5">
          <Label htmlFor="message" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {t("contact.labelMessage")}
          </Label>
          <Textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t("contact.placeholderMessage")}
            className="min-h-[130px] rounded-xl bg-muted/30 border-muted focus:border-primary/40 focus:ring-2 focus:ring-primary/10 resize-none transition-all p-3.5"
            required
          />
        </div>
      </div>

      {/* Submit */}
      <div className="mt-6 pt-5 border-t border-muted/60">
        <button
          type="submit"
          disabled={loading}
          className="w-full h-12 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-[0.99] disabled:opacity-60 shadow-lg"
          style={{ background: "linear-gradient(135deg, #1d4ed8 0%, #d97706 100%)" }}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {t("contact.btnSending")}
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              {t("contact.btnSubmit")}
            </>
          )}
        </button>
        <p className="text-center text-xs text-muted-foreground mt-3 flex items-center justify-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
          {t("contact.privacyNote")}
        </p>
      </div>

    </form>
  );
}
