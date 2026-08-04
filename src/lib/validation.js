import { INDIAN_STATES } from "@/src/lib/utils/constants";
export const clean = v => String(v ?? "").trim();
export const isIndianMobile = v => /^[6-9]\d{9}$/.test(clean(v).replace(/\D/g, ""));
export const isPincode = v => /^\d{6}$/.test(clean(v));
export const isState = v => INDIAN_STATES.includes(clean(v));
export function validateAddress(a={}) {
  const errors={};
  if(clean(a.name).length<2) errors.name="Enter customer name.";
  if(!isIndianMobile(a.phone)) errors.phone="Enter a valid 10-digit mobile number.";
  if(clean(a.street_address||a.address).length<5) errors.street_address="Enter house, street and locality.";
  if(clean(a.city).length<2) errors.city="Enter city.";
  if(!isState(a.state)) errors.state="Select a valid state.";
  if(!isPincode(a.pincode)) errors.pincode="Enter a valid 6-digit pincode.";
  return errors;
}
export function validateOrderInput(b={}) {
  const errors=validateAddress({...b.address,...b,name:b.customer_name||b.address?.name,phone:b.mobile_number||b.phone||b.address?.phone,street_address:b.address?.street_address||b.street_address,city:b.address?.city||b.city,state:b.address?.state||b.state,pincode:b.address?.pincode||b.pincode});
  const q=Number(b.quantity||1), p=Number(b.price||0);
  if(!Number.isInteger(q)||q<1||q>20) errors.quantity="Quantity must be between 1 and 20.";
  if(!Number.isFinite(p)||p<=0) errors.price="Enter a valid price.";
  const plan=clean(b.payment_plan||b.paymentPlan||"cod").toLowerCase();
  if(!["cod","prepaid_500","prepaid_full"].includes(plan)) errors.payment_plan="Select a valid payment option.";
  return errors;
}
export const firstError = errors => Object.values(errors)[0] || "Invalid form data.";
