import { SiteHeader } from "@/components/layout/SiteHeader";
import { PaymentStateView } from "@/components/tip/PaymentState";
export default async function PendingPage({ params, searchParams }: { params: Promise<{ handle: string }>; searchParams: Promise<{ payment?: string; reason?: string }> }) {
  const { handle } = await params; const { payment, reason } = await searchParams;
  const extra = reason === "disabled" ? "Live checkout is disabled until NOWPayments credentials and PAYMENTS_ENABLED=true are set. A pending ledger row was not treated as paid." : undefined;
  return <div><SiteHeader /><PaymentStateView status="pending" handle={handle} paymentId={payment} extra={extra} /></div>;
}
