"use client";
import { getCheckout } from "@/src/lib/api";
import { useEffect,useState } from "react";
export default function OrderSummary({checkoutId,onPlaceOrder,placing,showButton=true}){
 const [checkout,setCheckout]=useState(null),[loading,setLoading]=useState(true),[error,setError]=useState("");
 useEffect(()=>{if(!checkoutId){setError("Checkout session is missing.");setLoading(false);return;} getCheckout(checkoutId).then(setCheckout).catch(e=>setError(e.message)).finally(()=>setLoading(false));},[checkoutId]);
 if(loading)return <aside className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"><p className="text-sm text-gray-500">Loading your order…</p></aside>;
 if(error||!checkout?.items?.length)return <aside className="rounded-2xl border border-red-100 bg-white p-5 shadow-sm"><p className="font-medium text-gray-900">We couldn't load your order.</p><p className="mt-1 text-sm text-gray-500">{error||"Please return to the product and tap Buy Now again."}</p></aside>;
 const total=checkout.items.reduce((s,i)=>s+i.price*i.quantity,0);
 return <aside className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm md:sticky md:top-6">
  <h2 className="mb-4 text-lg font-semibold text-gray-900">Your order</h2>
  <div className="space-y-4">{checkout.items.map(i=><div key={i.productId} className="flex items-center gap-3"><img src={i.image} alt={i.name} className="h-16 w-16 rounded-xl border object-cover"/><div className="min-w-0 flex-1"><p className="font-medium text-gray-900">{i.name}</p><p className="text-sm text-gray-500">Qty: {i.quantity}</p></div><b>₹{i.price*i.quantity}</b></div>)}</div>
  <div className="mt-5 space-y-2 border-t pt-4 text-sm"><div className="flex justify-between"><span>Items total</span><span>₹{total}</span></div><div className="flex justify-between"><span>Delivery</span><span className="font-medium text-green-700">FREE</span></div><div className="flex justify-between border-t pt-3 text-base font-bold"><span>Total</span><span>₹{total}</span></div></div>
  {showButton&&<button onClick={onPlaceOrder} disabled={placing} className="mt-5 w-full rounded-xl bg-primary py-3.5 font-semibold text-white disabled:opacity-50">{placing?"Placing order…":"Place order"}</button>}
 </aside>
}
