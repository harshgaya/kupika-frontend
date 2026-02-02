import OrderSuccess from "@/src/components/order/order-success";
import { Suspense } from "react";
export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div>Loading checkout...</div>}>
      <OrderSuccess />
    </Suspense>
  );
}
