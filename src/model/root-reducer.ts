import { combineReducers } from 'redux';

import company from '../entities/company/company.reducer';
import motorTransport from '../entities/motorTransport/motorTransport.reducer';
import operator from '../entities/operator/operator.reducer';
import patio from '../entities/patio/patio.reducer';
import sparePart from '../entities/sparePart/sparePart.reducer';
import tab from '../entities/tab/tab.reducer';
import user from '../entities/user/user.reducer';

const rootReducer = combineReducers({
  company,
  motorTransport,
  operator,
  patio,
  sparePart,
  tab,
  user,
});

export default rootReducer;
