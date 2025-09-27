import { combineReducers } from 'redux';

import bls from '../entities/bls/bls.reducer';
import company from '../entities/company/company.reducer';
import motorTransport from '../entities/motorTransport/motorTransport.reducer';
import operator from '../entities/operator/operator.reducer';
import patio from '../entities/patio/patio.reducer';
import sparePart from '../entities/sparePart/sparePart.reducer';
import tab from '../entities/tab/tab.reducer';
import user from '../entities/user/user.reducer';
import valuelist from '../entities/valuelist/valuelist.reducer';
import invoice from '../entities/invoice/invoice.reducer';

const rootReducer = combineReducers({
  bls,
  company,
  motorTransport,
  operator,
  patio,
  sparePart,
  tab,
  user,
  valuelist,
  invoice,
});

export default rootReducer;
