import axios from 'axios';
import { IPatio } from '../../model/patio.model';

export const ACTION_TYPES = {
  FETCH_PATIOS: 'patio/FETCH_PATIOS',
  FETCH_PATIO: 'patio/FETCH_PATIO',
  CREATE_PATIO: 'patio/CREATE_PATIO',
  UPDATE_PATIO: 'patio/UPDATE_PATIO',
  DELETE_PATIO: 'patio/DELETE_PATIO',
  RESET: 'patio/RESET',
};

const initialState = {
  patios: [] as ReadonlyArray<IPatio>,
  patio: {} as IPatio,
  loading: false,
  errorMessage: null as string | null,
  updating: false,
  updateSuccess: false,
  totalPages: 0,
  page: 0,
};

export type PatioState = Readonly<typeof initialState>;

// Reducer

const patioReducer = (state: PatioState = initialState, action: any): PatioState => {
  switch (action.type) {
    case `${ACTION_TYPES.FETCH_PATIOS}_PENDING`:
    case `${ACTION_TYPES.FETCH_PATIO}_PENDING`:
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case `${ACTION_TYPES.CREATE_PATIO}_PENDING`:
    case `${ACTION_TYPES.UPDATE_PATIO}_PENDING`:
    case `${ACTION_TYPES.DELETE_PATIO}_PENDING`:
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case `${ACTION_TYPES.FETCH_PATIOS}_FULFILLED`:
      return {
        ...state,
        loading: false,
        patios: action.payload.data.data.docs,
        totalPages: action.payload.data.data.totalPages,
        page: action.payload.data.data.page,
      };
    case `${ACTION_TYPES.FETCH_PATIO}_FULFILLED`:
      return {
        ...state,
        loading: false,
        patio: action.payload.data,
      };
    case `${ACTION_TYPES.CREATE_PATIO}_FULFILLED`:
    case `${ACTION_TYPES.UPDATE_PATIO}_FULFILLED`:
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        patio: action.payload.data,
      };
    case `${ACTION_TYPES.DELETE_PATIO}_FULFILLED`:
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        patio: {},
      };
    case `${ACTION_TYPES.FETCH_PATIOS}_REJECTED`:
    case `${ACTION_TYPES.FETCH_PATIO}_REJECTED`:
    case `${ACTION_TYPES.CREATE_PATIO}_REJECTED`:
    case `${ACTION_TYPES.UPDATE_PATIO}_REJECTED`:
    case `${ACTION_TYPES.DELETE_PATIO}_REJECTED`:
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

export default patioReducer;

const apiUrl = 'api/patios';

// Actions

export const getEntities = (page?: number, size?: number) => ({
  type: ACTION_TYPES.FETCH_PATIOS,
  payload: axios.get<IPatio>(`${apiUrl}?page=${page || 0}&size=${size || 20}`),
});

export const getEntity = (id: string) => ({
  type: ACTION_TYPES.FETCH_PATIO,
  payload: axios.get<IPatio>(`${apiUrl}/${id}`),
});

export const createEntity = (entity: IPatio) => ({
  type: ACTION_TYPES.CREATE_PATIO,
  payload: axios.post<IPatio>(apiUrl, {...entity, updatedBy: 'admin', createdBy: 'admin'}),
});

export const updateEntity = (entity: IPatio) => ({
  type: ACTION_TYPES.UPDATE_PATIO,
  payload: axios.put<IPatio>(`${apiUrl}/${entity._id}`, entity),
});

export const deleteEntity = (id: string) => ({
  type: ACTION_TYPES.DELETE_PATIO,
  payload: axios.delete<IPatio>(`${apiUrl}/${id}`),
});

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
