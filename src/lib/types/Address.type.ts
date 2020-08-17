/**
 * Base Address type
 */
export type Address = {
  facility_name: string;
  city: string;
  delivery_address: string;
  postal: string;
  country: string;
  province: string;
  contact_name: string;
  contact_phone: string;
  contact_email: string;
}

/**
 * Shipping Address type
 */
export type ShippingAddress = Address & {
  cost_center: string;
};

/**
 * Billing Address type
 */
export type BillingAddress = Address
