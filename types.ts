
export interface Order {
  id: string;
  date: string;
  status: 'Delivered' | 'Pending' | 'Cancelled';
  vendor: string;
}

export interface UsageData {
  day: string;
  usage: number;
}

export interface VendorSettings {
  preferredVendor: string;
  refillThreshold: number;
  autoPay: boolean;
  payOnDelivery: boolean;
}
