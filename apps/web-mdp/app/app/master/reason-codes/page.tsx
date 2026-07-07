import type { Metadata } from "next";
import { ReasonCodesPage } from "@/components/pages/reason-codes-page";

export const metadata: Metadata = { title: "Master · Reason Code" };

export default function Page() {
  return <ReasonCodesPage />;
}
