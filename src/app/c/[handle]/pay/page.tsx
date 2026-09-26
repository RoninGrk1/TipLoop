import { redirect } from "next/navigation";
export default async function PayAlias({ params }: { params: Promise<{ handle: string }> }) {
  redirect(`/c/${(await params).handle}`);
}
