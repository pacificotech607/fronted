export interface IBLS {
  customer?: string;
  bl?: string;
  vessel?: string;
  destination?: string;
  petition?: string;
  eta?: string;
  invoice?: string;
  materialOz?: string;
  emptyDelivery?: string;
  status?: string;
  typeLoad?: string;
  containers?: string[];
  commodity?: [{
    Container?: string;
    quantity?: number;
    unitKey?: string;
    commodity?: string;
    description?: string;
    weightKg?: string;
  }];
}
