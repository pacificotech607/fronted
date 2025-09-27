import { IValuelist } from "./valuelist.model";

export interface IInvoice {
  _id?: string;
  alive?: boolean;
  issuing?: IValuelist;
  customer?: string;
  typeReceipt?: IValuelist;
  useVoucher?: IValuelist;
  methodOfPayment?: IValuelist;
  paymentMethod?: IValuelist;
  currency?: IValuelist;
  exchangeRate: string;
  relatedInvoices: Array<{
    relationshipType?: IValuelist;
    invoiceFolio?: string;
  }>;
  concepts: Array<{
    serviceKey?: string;
    Unit: string;
    description: string;
    cant: string;
    p_unit: string;
    amount: string;
    iva: boolean;
    retention: boolean;
  }>;
}
