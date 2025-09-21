import axios from 'axios';
import { IOperator } from '../../model/operator.model';

export const ACTION_TYPES = {
  FETCH_OPERATORS: 'operator/FETCH_OPERATORS',
  FETCH_OPERATOR: 'operator/FETCH_OPERATOR',
  CREATE_OPERATOR: 'operator/CREATE_OPERATOR',
  UPDATE_OPERATOR: 'operator/UPDATE_OPERATOR',
  DELETE_OPERATOR: 'operator/DELETE_OPERATOR',
  RESET: 'operator/RESET',
};

const initialState = {
  operators: [] as ReadonlyArray<IOperator>,
  operator: {} as IOperator,
  loading: false,
  errorMessage: null as string | null,
  updating: false,
  updateSuccess: false,
  totalPages: 0,
  page: 0,
};

export type OperatorState = Readonly<typeof initialState>;

// Reducer

const operatorReducer = (state: OperatorState = initialState, action: any): OperatorState => {
  switch (action.type) {
    case `${ACTION_TYPES.FETCH_OPERATORS}_PENDING`:
    case `${ACTION_TYPES.FETCH_OPERATOR}_PENDING`:
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case `${ACTION_TYPES.CREATE_OPERATOR}_PENDING`:
    case `${ACTION_TYPES.UPDATE_OPERATOR}_PENDING`:
    case `${ACTION_TYPES.DELETE_OPERATOR}_PENDING`:
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case `${ACTION_TYPES.FETCH_OPERATORS}_FULFILLED`:
      return {
        ...state,
        loading: false,
        operators: action.payload.data.data.docs,
        totalPages: action.payload.data.data.totalPages,
        page: action.payload.data.page,
      };
    case `${ACTION_TYPES.FETCH_OPERATOR}_FULFILLED`:
      return {
        ...state,
        loading: false,
        operator: action.payload.data,
      };
    case `${ACTION_TYPES.CREATE_OPERATOR}_FULFILLED`:
    case `${ACTION_TYPES.UPDATE_OPERATOR}_FULFILLED`:
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        operator: action.payload.data,
      };
    case `${ACTION_TYPES.DELETE_OPERATOR}_FULFILLED`:
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        operator: {},
      };
    case `${ACTION_TYPES.FETCH_OPERATORS}_REJECTED`:
    case `${ACTION_TYPES.FETCH_OPERATOR}_REJECTED`:
    case `${ACTION_TYPES.CREATE_OPERATOR}_REJECTED`:
    case `${ACTION_TYPES.UPDATE_OPERATOR}_REJECTED`:
    case `${ACTION_TYPES.DELETE_OPERATOR}_REJECTED`:
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.error.message,
      };
    case ACTION_TYPES.RESET:
      return {
        ...initialState,
      };
    default:
      return state;
  }
};

export default operatorReducer;

const apiUrl = '/api/operators';

// Actions

export const getEntities = (page?: number, size?: number, query?: string) => {
  const requestUrl = `${apiUrl}?page=${page || 0}&size=${size || 20}${query ? `&query=${query}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_OPERATORS,
    payload: axios.get<IOperator>(requestUrl),
  };
};

export const getEntity = (id: string) => ({
  type: ACTION_TYPES.FETCH_OPERATOR,
  payload: axios.get<IOperator>(`${apiUrl}/${id}`),
});

export const createEntity = (entity: IOperator) => ({
  type: ACTION_TYPES.CREATE_OPERATOR,
  payload: axios.post<IOperator>(apiUrl, {...entity, updatedBy: 'admin', createdBy: 'admin'}),
});

export const updateEntity = (entity: IOperator) => ({
  type: ACTION_TYPES.UPDATE_OPERATOR,
  payload: axios.put<IOperator>(`${apiUrl}/${entity._id}`, entity),
});

export const deleteEntity = (id: string) => ({
  type: ACTION_TYPES.DELETE_OPERATOR,
  payload: axios.delete<IOperator>(`${apiUrl}/${id}`),
});

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
