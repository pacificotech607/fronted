import axios from 'axios';
import { IBLS } from '../../model/bls.model';

export const ACTION_TYPES = {
  FETCH_BLSS: 'bls/FETCH_BLSS',
  FETCH_BLS: 'bls/FETCH_BLS',
  CREATE_BLS: 'bls/CREATE_BLS',
  UPDATE_BLS: 'bls/UPDATE_BLS',
  DELETE_BLS: 'bls/DELETE_BLS',
  RESET: 'bls/RESET',
};

const initialState = {
  bls: [] as ReadonlyArray<IBLS>,
  bl: {} as IBLS,
  loading: false,
  errorMessage: null as string | null,
  updating: false,
  updateSuccess: false,
  totalPages: 0,
  page: 0,
};

export type BlsState = Readonly<typeof initialState>;

// Reducer

const blsReducer = (state: BlsState = initialState, action: any): BlsState => {
  switch (action.type) {
    case `${ACTION_TYPES.FETCH_BLSS}_PENDING`:
    case `${ACTION_TYPES.FETCH_BLS}_PENDING`:
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case `${ACTION_TYPES.CREATE_BLS}_PENDING`:
    case `${ACTION_TYPES.UPDATE_BLS}_PENDING`:
    case `${ACTION_TYPES.DELETE_BLS}_PENDING`:
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case `${ACTION_TYPES.FETCH_BLSS}_FULFILLED`:
      return {
        ...state,
        loading: false,
        bls: action.payload.data.data.docs,
        totalPages: action.payload.data.data.totalPages,
        page: action.payload.data.data.page,
      };
    case `${ACTION_TYPES.FETCH_BLS}_FULFILLED`:
      return {
        ...state,
        loading: false,
        bl: action.payload.data,
      };
    case `${ACTION_TYPES.CREATE_BLS}_FULFILLED`:
    case `${ACTION_TYPES.UPDATE_BLS}_FULFILLED`:
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        bl: action.payload.data,
      };
    case `${ACTION_TYPES.DELETE_BLS}_FULFILLED`:
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        bl: {},
      };
    case `${ACTION_TYPES.FETCH_BLSS}_REJECTED`:
    case `${ACTION_TYPES.FETCH_BLS}_REJECTED`:
    case `${ACTION_TYPES.CREATE_BLS}_REJECTED`:
    case `${ACTION_TYPES.UPDATE_BLS}_REJECTED`:
    case `${ACTION_TYPES.DELETE_BLS}_REJECTED`:
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

export default blsReducer;

const apiUrl = 'api/bls';

// Actions

export const getEntities = (page?: number, size?: number, query?: string) => {
  const requestUrl = `${apiUrl}?page=${page || 0}&size=${size || 20}${query ? `&query=${query}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_BLSS,
    payload: axios.get<IBLS>(requestUrl),
  };
};

export const getEntity = (id: string) => ({
  type: ACTION_TYPES.FETCH_BLS,
  payload: axios.get<IBLS>(`${apiUrl}/${id}`),
});

export const createEntity = (entity: IBLS) => ({
  type: ACTION_TYPES.CREATE_BLS,
  payload: axios.post<IBLS>(apiUrl, {...entity, updatedBy: 'admin', createdBy: 'admin'}),
});

export const updateEntity = (entity: IBLS) => ({
  type: ACTION_TYPES.UPDATE_BLS,
  payload: axios.put<IBLS>(`${apiUrl}/${entity.bl}`, entity),
});

export const deleteEntity = (id: string) => ({
  type: ACTION_TYPES.DELETE_BLS,
  payload: axios.delete<IBLS>(`${apiUrl}/${id}`),
});

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
