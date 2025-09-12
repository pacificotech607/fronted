import axios from 'axios';
import { ITab } from '../../model/tab.model';

export const ACTION_TYPES = {
  FETCH_TABS: 'tab/FETCH_TABS',
  FETCH_TAB: 'tab/FETCH_TAB',
  CREATE_TAB: 'tab/CREATE_TAB',
  UPDATE_TAB: 'tab/UPDATE_TAB',
  DELETE_TAB: 'tab/DELETE_TAB',
  RESET: 'tab/RESET',
};

const initialState = {
  tabs: [] as ReadonlyArray<ITab>,
  tab: {} as ITab,
  loading: false,
  errorMessage: null as string | null,
  updating: false,
  updateSuccess: false,
  totalPages: 0,
  page: 0,
};

export type TabState = Readonly<typeof initialState>;

// Reducer

const tabReducer = (state: TabState = initialState, action: any): TabState => {
  switch (action.type) {
    case `${ACTION_TYPES.FETCH_TABS}_PENDING`:
    case `${ACTION_TYPES.FETCH_TAB}_PENDING`:
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case `${ACTION_TYPES.CREATE_TAB}_PENDING`:
    case `${ACTION_TYPES.UPDATE_TAB}_PENDING`:
    case `${ACTION_TYPES.DELETE_TAB}_PENDING`:
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case `${ACTION_TYPES.FETCH_TABS}_FULFILLED`:
      return {
        ...state,
        loading: false,
        tabs: action.payload.data.data.docs,
        totalPages: action.payload.data.totalPages,
        page: action.payload.data.page,
      };
    case `${ACTION_TYPES.FETCH_TAB}_FULFILLED`:
      return {
        ...state,
        loading: false,
        tab: action.payload.data,
      };
    case `${ACTION_TYPES.CREATE_TAB}_FULFILLED`:
    case `${ACTION_TYPES.UPDATE_TAB}_FULFILLED`:
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        tab: action.payload.data,
      };
    case `${ACTION_TYPES.DELETE_TAB}_FULFILLED`:
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        tab: {},
      };
    case `${ACTION_TYPES.FETCH_TABS}_REJECTED`:
    case `${ACTION_TYPES.FETCH_TAB}_REJECTED`:
    case `${ACTION_TYPES.CREATE_TAB}_REJECTED`:
    case `${ACTION_TYPES.UPDATE_TAB}_REJECTED`:
    case `${ACTION_TYPES.DELETE_TAB}_REJECTED`:
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

export default tabReducer;

const apiUrl = 'api/tabs';

// Actions

export const getEntities = (page?: number, size?: number) => ({
  type: ACTION_TYPES.FETCH_TABS,
  payload: axios.get<ITab>(`${apiUrl}?page=${page || 0}&size=${size || 20}`),
});

export const getEntity = (id: string) => ({
  type: ACTION_TYPES.FETCH_TAB,
  payload: axios.get<ITab>(`${apiUrl}/${id}`),
});

export const createEntity = (entity: ITab) => ({
  type: ACTION_TYPES.CREATE_TAB,
  payload: axios.post<ITab>(apiUrl, {...entity, updatedBy: 'admin', createdBy: 'admin'}),
});

export const updateEntity = (entity: ITab) => ({
  type: ACTION_TYPES.UPDATE_TAB,
  payload: axios.put<ITab>(`${apiUrl}/${entity._id}`, entity),
});

export const deleteEntity = (id: string) => ({
  type: ACTION_TYPES.DELETE_TAB,
  payload: axios.delete<ITab>(`${apiUrl}/${id}`),
});

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
