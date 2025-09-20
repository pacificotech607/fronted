import axios from 'axios';
import { IValuelist } from '../../model/valuelist.model';

export const ACTION_TYPES = {
  FETCH_VALUELISTS: 'valuelist/FETCH_VALUELISTS',
  FETCH_VALUELIST: 'valuelist/FETCH_VALUELIST',
  CREATE_VALUELIST: 'valuelist/CREATE_VALUELIST',
  UPDATE_VALUELIST: 'valuelist/UPDATE_VALUELIST',
  DELETE_VALUELIST: 'valuelist/DELETE_VALUELIST',
  RESET: 'valuelist/RESET',
};

const initialState = {
  valuelists: [] as ReadonlyArray<IValuelist>,
  valuelist: {} as IValuelist,
  loading: false,
  errorMessage: null as string | null,
  updating: false,
  updateSuccess: false,
  totalPages: 0,
  page: 0,
};

export type ValuelistState = Readonly<typeof initialState>;

// Reducer

const valuelistReducer = (state: ValuelistState = initialState, action: any): ValuelistState => {
  switch (action.type) {
    case `${ACTION_TYPES.FETCH_VALUELISTS}_PENDING`:
    case `${ACTION_TYPES.FETCH_VALUELIST}_PENDING`:
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case `${ACTION_TYPES.CREATE_VALUELIST}_PENDING`:
    case `${ACTION_TYPES.UPDATE_VALUELIST}_PENDING`:
    case `${ACTION_TYPES.DELETE_VALUELIST}_PENDING`:
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case `${ACTION_TYPES.FETCH_VALUELISTS}_FULFILLED`:
      return {
        ...state,
        loading: false,
        valuelists: action.payload.data.data.docs,
        totalPages: action.payload.data.totalPages,
        page: action.payload.data.page,
      };
    case `${ACTION_TYPES.FETCH_VALUELIST}_FULFILLED`:
      return {
        ...state,
        loading: false,
        valuelist: action.payload.data,
      };
    case `${ACTION_TYPES.CREATE_VALUELIST}_FULFILLED`:
    case `${ACTION_TYPES.UPDATE_VALUELIST}_FULFILLED`:
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        valuelist: action.payload.data,
      };
    case `${ACTION_TYPES.DELETE_VALUELIST}_FULFILLED`:
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        valuelist: {},
      };
    case `${ACTION_TYPES.FETCH_VALUELISTS}_REJECTED`:
    case `${ACTION_TYPES.FETCH_VALUELIST}_REJECTED`:
    case `${ACTION_TYPES.CREATE_VALUELIST}_REJECTED`:
    case `${ACTION_TYPES.UPDATE_VALUELIST}_REJECTED`:
    case `${ACTION_TYPES.DELETE_VALUELIST}_REJECTED`:
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

export default valuelistReducer;

const apiUrl = 'api/valuelists';

// Actions

export const getEntities = (page?: number, size?: number, query?: string) => {
  const requestUrl = `${apiUrl}?page=${page || 0}&size=${size || 20}${query ? `&query=${query}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_VALUELISTS,
    payload: axios.get<IValuelist>(requestUrl),
  };
};

export const getEntity = (id: string) => ({
  type: ACTION_TYPES.FETCH_VALUELIST,
  payload: axios.get<IValuelist>(`${apiUrl}/${id}`),
});

export const createEntity = (entity: IValuelist) => ({
  type: ACTION_TYPES.CREATE_VALUELIST,
  payload: axios.post<IValuelist>(apiUrl, {...entity, updatedBy: 'admin', createdBy: 'admin'}),
});

export const updateEntity = (entity: IValuelist) => ({
  type: ACTION_TYPES.UPDATE_VALUELIST,
  payload: axios.put<IValuelist>(`${apiUrl}/${entity._id}`, entity),
});

export const deleteEntity = (id: string) => ({
  type: ACTION_TYPES.DELETE_VALUELIST,
  payload: axios.delete<IValuelist>(`${apiUrl}/${id}`),
});

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
