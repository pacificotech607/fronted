import axios from 'axios';
import { ISparePart } from '../../model/sparePart.model';

export const ACTION_TYPES = {
  FETCH_SPAREPARTS: 'sparePart/FETCH_SPAREPARTS',
  FETCH_SPAREPART: 'sparePart/FETCH_SPAREPART',
  CREATE_SPAREPART: 'sparePart/CREATE_SPAREPART',
  UPDATE_SPAREPART: 'sparePart/UPDATE_SPAREPART',
  DELETE_SPAREPART: 'sparePart/DELETE_SPAREPART',
  RESET: 'sparePart/RESET',
};

const initialState = {
  spareParts: [] as ReadonlyArray<ISparePart>,
  sparePart: {} as ISparePart,
  loading: false,
  errorMessage: null as string | null,
  updating: false,
  updateSuccess: false,
  totalPages: 0,
  page: 0,
};

export type SparePartState = Readonly<typeof initialState>;

// Reducer

const sparePartReducer = (state: SparePartState = initialState, action: any): SparePartState => {
  switch (action.type) {
    case `${ACTION_TYPES.FETCH_SPAREPARTS}_PENDING`:
    case `${ACTION_TYPES.FETCH_SPAREPART}_PENDING`:
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case `${ACTION_TYPES.CREATE_SPAREPART}_PENDING`:
    case `${ACTION_TYPES.UPDATE_SPAREPART}_PENDING`:
    case `${ACTION_TYPES.DELETE_SPAREPART}_PENDING`:
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case `${ACTION_TYPES.FETCH_SPAREPARTS}_FULFILLED`:
      return {
        ...state,
        loading: false,
        spareParts: action.payload.data.data.docs,
        totalPages: action.payload.data.data.totalPages,
        page: action.payload.data.data.page,
      };
    case `${ACTION_TYPES.FETCH_SPAREPART}_FULFILLED`:
      return {
        ...state,
        loading: false,
        sparePart: action.payload.data,
      };
    case `${ACTION_TYPES.CREATE_SPAREPART}_FULFILLED`:
    case `${ACTION_TYPES.UPDATE_SPAREPART}_FULFILLED`:
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        sparePart: action.payload.data,
      };
    case `${ACTION_TYPES.DELETE_SPAREPART}_FULFILLED`:
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        sparePart: {},
      };
    case `${ACTION_TYPES.FETCH_SPAREPARTS}_REJECTED`:
    case `${ACTION_TYPES.FETCH_SPAREPART}_REJECTED`:
    case `${ACTION_TYPES.CREATE_SPAREPART}_REJECTED`:
    case `${ACTION_TYPES.UPDATE_SPAREPART}_REJECTED`:
    case `${ACTION_TYPES.DELETE_SPAREPART}_REJECTED`:
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

export default sparePartReducer;

const apiUrl = 'api/spare-parts';

// Actions

export const getEntities = (page?: number, size?: number, query?: string) => {
  const requestUrl = `${apiUrl}?page=${page || 0}&size=${size || 20}${query ? `&query=${query}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_SPAREPARTS,
    payload: axios.get<ISparePart>(requestUrl),
  };
};

export const getEntity = (id: string) => ({
  type: ACTION_TYPES.FETCH_SPAREPART,
  payload: axios.get<ISparePart>(`${apiUrl}/${id}`),
});

export const createEntity = (entity: ISparePart) => ({
  type: ACTION_TYPES.CREATE_SPAREPART,
  payload: axios.post<ISparePart>(apiUrl, {...entity, updatedBy: 'admin', createdBy: 'admin'}),
});

export const updateEntity = (entity: ISparePart) => ({
  type: ACTION_TYPES.UPDATE_SPAREPART,
  payload: axios.put<ISparePart>(`${apiUrl}/${entity._id}`, entity),
});

export const deleteEntity = (id: string) => ({
  type: ACTION_TYPES.DELETE_SPAREPART,
  payload: axios.delete<ISparePart>(`${apiUrl}/${id}`),
});

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
