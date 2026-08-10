import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Loader2, X } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { submitLead } from "@/lib/store.functions";
import { useGlow } from "@/lib/glow";
import { EGYPT_COUPON_CODE } from "@/lib/store/pricing";

export type CheckoutItem = {
  id: string | null;
  name: string;
  price: string;
};

export function CheckoutDialog({
  item,
  country,
  egypt,
  onClose,
}: {
  item: CheckoutItem;
  country: string | null;
  egypt: boolean;
  onClose: () => void;
}) {
  const { t } = useI18n();
  const { award } = useGlow();
  const [sending, setSending] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const payload = {
      full_name: String(form.get("full_name") ?? "").trim(),
      phone: String(form.get("phone") ?? "").trim(),
      city: String(form.get("city") ?? "").trim(),
      address: String(form.get("address") ?? "").trim(),
      notes: (String(form.get("notes") ?? "").trim() || null) as string | null,
      quantity: Number(form.get("quantity") ?? 1) || 1,
      country,
      product_id: item.id,
      product_name: item.name,
      product_price: item.price,
      coupon_code: egypt ? EGYPT_COUPON_CODE : null,
    };

    if (!payload.full_name || !payload.phone || !payload.city || !payload.address) {
      toast(t("requiredFields"));
      return;
    }

    setSending(true);
    try {
      await submitLead({ data: payload });
      toast.success(t("orderSuccess"));
      award(10, t("orderSuccess"));
      onClose();
    } catch (error) {
      console.error(error);
      toast.error(t("orderError"));
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 backdrop-blur-sm sm:items-center">
      <div className="glass-card animate-rise max-h-[92vh] w-full max-w-md overflow-y-auto rounded-t-3xl p-5 sm:rounded-3xl">
        <div className="mb-3 grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
          <div className="min-w-0">
            <h2 className="text-lg font-bold">{t("checkoutTitle")}</h2>
            <p className="text-xs text-muted-foreground">{t("checkoutSub")}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="close"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-secondary text-secondary-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mb-4 rounded-2xl bg-secondary/60 p-3">
          <p className="truncate text-sm font-semibold">{item.name}</p>
          <p className="text-sm font-bold text-primary">{item.price}</p>
          {egypt && (
            <p className="mt-1 text-[11px] font-semibold text-gold">
              {t("egyptCoupon")} — {EGYPT_COUPON_CODE}
            </p>
          )}
        </div>

        <form onSubmit={onSubmit} className="space-y-3">
          <Field name="full_name" label={t("fullName")} required maxLength={100} />
          <Field name="phone" label={t("phone")} type="tel" required maxLength={30} />
          <Field name="city" label={t("city")} required maxLength={80} />
          <Field name="address" label={t("address")} required maxLength={300} />
          <div className="grid grid-cols-2 gap-3">
            <Field name="quantity" label={t("quantity")} type="number" defaultValue="1" />
            <Field name="notes" label={t("notesField")} maxLength={500} />
          </div>
          <button
            type="submit"
            disabled={sending}
            className="gradient-forest flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-sm font-bold text-primary-foreground transition-transform active:scale-[0.98] disabled:opacity-60"
          >
            {sending && <Loader2 className="h-4 w-4 animate-spin" />}
            {sending ? t("submitting") : t("submitOrder")}
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({
  name,
  label,
  type = "text",
  required,
  maxLength,
  defaultValue,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  maxLength?: number;
  defaultValue?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-semibold text-muted-foreground">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        maxLength={maxLength}
        defaultValue={defaultValue}
        min={type === "number" ? 1 : undefined}
        max={type === "number" ? 20 : undefined}
        className="w-full rounded-2xl border border-border bg-card/70 px-3 py-2.5 text-sm outline-none focus:border-primary"
      />
    </label>
  );
}
