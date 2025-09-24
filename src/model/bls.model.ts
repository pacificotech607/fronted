import { IMotorTransport } from "./motorTransport.model";
import { IOperator } from "./operator.model";
import { IValuelist } from "./valuelist.model";

export interface ICommodity {
  Container?: string;
  quantity?: number;
  unitKey?: string;
  commodity?: string;
  description?: string;
  weightKg?: string;
}

export interface IBLS {
  _id?: string;
  customer?: string;
  bl?: string;
  vessel?: string;
  origin?: IValuelist;
  destination?: IValuelist;
  petition?: string;
  eta?: string;
  invoice?: string;
  materialOz?: string;
  emptyDelivery?: string;
  status?: string;
  typeLoad?: IValuelist;
  containers?: string[];
  commodity?: ICommodity[];
  motorTransport?: IMotorTransport;
  operator?: IOperator;
  dateTimeArrivalPort?: string;
  departureDate?: string;
  distanceTraveled?: string;
}
