import axios from 'axios';
import { ICompany } from '../../model/company.model';

export const ACTION_TYPES = {
  FETCH_COMPANIES: 'company/FETCH_COMPANIES',
  FETCH_COMPANY: 'company/FETCH_COMPANY',
  CREATE_COMPANY: 'company/CREATE_COMPANY',
  UPDATE_COMPANY: 'company/UPDATE_COMPANY',
  DELETE_COMPANY: 'company/DELETE_COMPANY',
  RESET: 'company/RESET',
};

const initialState = {
  companies: [] as ReadonlyArray<ICompany>,
  company: {} as ICompany,
  loading: false,
  errorMessage: null as string | null,
  updating: false,
  updateSuccess: false,
  totalPages: 0,
  page: 0,
};

export type CompanyState = Readonly<typeof initialState>;

// Reducer

const companyReducer = (state: CompanyState = initialState, action: any): CompanyState => {
  switch (action.type) {
    case `${ACTION_TYPES.FETCH_COMPANIES}_PENDING`:
    case `${ACTION_TYPES.FETCH_COMPANY}_PENDING`:
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case `${ACTION_TYPES.CREATE_COMPANY}_PENDING`:
    case `${ACTION_TYPES.UPDATE_COMPANY}_PENDING`:
    case `${ACTION_TYPES.DELETE_COMPANY}_PENDING`:
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case `${ACTION_TYPES.FETCH_COMPANIES}_FULFILLED`:
      return {
        ...state,
        loading: false,
        companies: action.payload.data.docs,
        totalPages: action.payload.data.totalPages,
        page: action.payload.data.page,
      };
    case `${ACTION_TYPES.FETCH_COMPANY}_FULFILLED`:
      return {
        ...state,
        loading: false,
        company: action.payload.data,
      };
    case `${ACTION_TYPES.CREATE_COMPANY}_FULFILLED`:
    case `${ACTION_TYPES.UPDATE_COMPANY}_FULFILLED`:
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        company: action.payload.data,
      };
    case `${ACTION_TYPES.DELETE_COMPANY}_FULFILLED`:
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        company: {},
      };
    case `${ACTION_TYPES.FETCH_COMPANIES}_REJECTED`:
    case `${ACTION_TYPES.FETCH_COMPANY}_REJECTED`:
    case `${ACTION_TYPES.CREATE_COMPANY}_REJECTED`:
    case `${ACTION_TYPES.UPDATE_COMPANY}_REJECTED`:
    case `${ACTION_TYPES.DELETE_COMPANY}_REJECTED`:
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

export default companyReducer;

const apiUrl = 'api/companies';

// Actions

export const getEntities = (page?: number, size?: number) => ({
  type: ACTION_TYPES.FETCH_COMPANIES,
  payload: axios.get<ICompany>(`${apiUrl}?page=${page || 0}&size=${size || 20}`),
});

export const getEntity = (id: string) => ({
  type: ACTION_TYPES.FETCH_COMPANY,
  payload: axios.get<ICompany>(`${apiUrl}/${id}`),
});

export const createEntity = (entity: ICompany) => ({
  type: ACTION_TYPES.CREATE_COMPANY,
  payload: axios.post<ICompany>(apiUrl, {...entity, updatedBy: 'admin', createdBy: 'admin'}),
});

export const updateEntity = (entity: ICompany) => ({
  type: ACTION_TYPES.UPDATE_COMPANY,
  payload: axios.put<ICompany>(`${apiUrl}/${entity._id}`, entity),
});

export const deleteEntity = (id: string) => ({
  type: ACTION_TYPES.DELETE_COMPANY,
  payload: axios.delete<ICompany>(`${apiUrl}/${id}`),
});

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
