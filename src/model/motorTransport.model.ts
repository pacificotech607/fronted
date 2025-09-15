import { IOperator } from "./operator.model";
import { IValuelist } from "./valuelist.model";

export  interface IMotorTransport {
  _id?: string;
  number?: string;
  configuration?: IValuelist | string;
  plate?: string;
  year?: string;
  weight?: string;
  sctPermit?: IValuelist | string;
  sctPermitNumber?: string;
  insurance?: string;
  insurancePolicy?: string;
  trailerType?: IValuelist | string;
  trailerPlate?: string;
  operator?: IOperator | string;
}