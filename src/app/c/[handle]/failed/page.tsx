import { SiteHeader } from "@/components/layout/SiteHeader";
import { PaymentStateView } from "@/components/tip/PaymentState";
export default async function FailedPage({ params, searchParams }: { params: Promise<{ handle: string }>; searchParams: Promise<{ payment?: string }> }) {
  const { handle } = await params; const { payment } = await searchParams;
  return <div><SiteHeader /><PaymentStateView status="failed" handle={handle} paymentId={payment} /></div>;
}
