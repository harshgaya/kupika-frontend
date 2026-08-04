import CheckoutPage from "@/src/components/checkout/checkout";
import { Suspense } from "react";

export default async function Chechkout() {
  return (
    <Suspense fallback={<div>Loading checkout...</div>}>
      <CheckoutPage />
    </Suspense>
  );
}
