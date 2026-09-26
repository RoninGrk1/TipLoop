import { SiteHeader } from "@/components/layout/SiteHeader";
import { PaymentStateView } from "@/components/tip/PaymentState";
import { getPaymentById } from "@/lib/payments/service";
import { isSupabaseConfigured } from "@/lib/db/supabase";
export const dynamic = "force-dynamic";
export default async function SuccessPage({ params, searchParams }: { params: Promise<{ handle: string }>; searchParams: Promise<{ payment?: string }> }) {
  const { handle } = await params; const { payment } = await searchParams;
  let status: "success" | "pending" | "processing" | "failed" | "expired" | "refunded" = "pending";
  let extra = "Waiting for a verified provider webhook. TipLoop never marks a tip successful from this page alone.";
  if (payment && isSupabaseConfigured()) {
    const row = await getPaymentById(payment);
    if (row && row.handle === handle) { status = row.status; if (row.status === "success") extra = ""; }
  }
  return <div><SiteHeader /><PaymentStateView status={status} handle={handle} paymentId={payment} extra={status === "success" ? undefined : extra} /></div>;
}
