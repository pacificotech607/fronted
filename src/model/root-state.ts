import { CompanyState } from '../entities/company/company.reducer';
import { MotorTransportState } from '../entities/motorTransport/motorTransport.reducer';
import { OperatorState } from '../entities/operator/operator.reducer';
import { PatioState } from '../entities/patio/patio.reducer';
import { SparePartState } from '../entities/sparePart/sparePart.reducer';
import { TabState } from '../entities/tab/tab.reducer';
import { UserState } from '../entities/user/user.reducer';
import { ValuelistState } from '../entities/valuelist/valuelist.reducer';

export interface IRootState {
  readonly company: CompanyState;
  readonly motorTransport: MotorTransportState;
  readonly operator: OperatorState;
  readonly patio: PatioState;
  readonly sparePart: SparePartState;
  readonly tab: TabState;
  readonly user: UserState;
  readonly valuelist: ValuelistState;
}
