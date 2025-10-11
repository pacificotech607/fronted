import { IMotorTransport } from "./motorTransport.model";
import { IOperator } from "./operator.model";
import { ITab } from "./tab.model";

export interface IFuel {
  _id?: string;
  transport?: IMotorTransport | string;
  operator?: IOperator | string;
  dieselInitial?: number;
  dieselReturn?: number;
  tabulator?: ITab | string;
  dieselLoaded?: number;
  pricePerLiter?: number;
  fuelDate?: string;
  observations?: string;
  litersLoaded?: number;
  fuelConsumption?: number;
  efficiency?: number;
  typeFuel?: string;
  alive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
