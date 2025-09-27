import axios from 'axios';
import { IInvoice } from '../../model/invoice.model';

export const ACTION_TYPES = {
  FETCH_INVOICES: 'invoice/FETCH_INVOICES',
  FETCH_INVOICE: 'invoice/FETCH_INVOICE',
  CREATE_INVOICE: 'invoice/CREATE_INVOICE',
  UPDATE_INVOICE: 'invoice/UPDATE_INVOICE',
  DELETE_INVOICE: 'invoice/DELETE_INVOICE',
  RESET: 'invoice/RESET',
};

const initialState = {
  invoices: [] as ReadonlyArray<IInvoice>,
  invoice: {
    exchangeRate: '',
    relatedInvoices: [],
    concepts: [],
  } as IInvoice,
  loading: false,
  errorMessage: null as string | null,
  updating: false,
  updateSuccess: false,
  totalPages: 0,
  page: 0,
};

export type InvoiceState = Readonly<typeof initialState>;

// Reducer

const invoiceReducer = (state: InvoiceState = initialState, action: any): InvoiceState => {
  switch (action.type) {
    case `${ACTION_TYPES.FETCH_INVOICES}_PENDING`:
    case `${ACTION_TYPES.FETCH_INVOICE}_PENDING`:
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case `${ACTION_TYPES.CREATE_INVOICE}_PENDING`:
    case `${ACTION_TYPES.UPDATE_INVOICE}_PENDING`:
    case `${ACTION_TYPES.DELETE_INVOICE}_PENDING`:
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case `${ACTION_TYPES.FETCH_INVOICES}_FULFILLED`:
      return {
        ...state,
        loading: false,
        invoices: action.payload.data.data.docs,
        totalPages: action.payload.data.data.totalPages,
        page: action.payload.data.data.page,
      };
    case `${ACTION_TYPES.FETCH_INVOICE}_FULFILLED`:
      return {
        ...state,
        loading: false,
        invoice: action.payload.data,
      };
    case `${ACTION_TYPES.CREATE_INVOICE}_FULFILLED`:
    case `${ACTION_TYPES.UPDATE_INVOICE}_FULFILLED`:
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        invoice: action.payload.data,
      };
    case `${ACTION_TYPES.DELETE_INVOICE}_FULFILLED`:
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        invoice: {
          exchangeRate: '',
          relatedInvoices: [],
          concepts: [],
        },
      };
    case `${ACTION_TYPES.FETCH_INVOICES}_REJECTED`:
    case `${ACTION_TYPES.FETCH_INVOICE}_REJECTED`:
    case `${ACTION_TYPES.CREATE_INVOICE}_REJECTED`:
    case `${ACTION_TYPES.UPDATE_INVOICE}_REJECTED`:
    case `${ACTION_TYPES.DELETE_INVOICE}_REJECTED`:
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

export default invoiceReducer;

const apiUrl = 'api/invoices';

// Actions

export const getEntities = (page?: number, size?: number, query?: string) => {
  const requestUrl = `${apiUrl}?page=${page || 0}&size=${size || 20}${query ? `&query=${query}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_INVOICES,
    payload: axios.get<IInvoice>(requestUrl),
  };
};

export const getEntity = (id: string) => ({
  type: ACTION_TYPES.FETCH_INVOICE,
  payload: axios.get<IInvoice>(`${apiUrl}/${id}`),
});

export const createEntity = (entity: IInvoice) => ({
  type: ACTION_TYPES.CREATE_INVOICE,
  payload: axios.post<IInvoice>(apiUrl, {...entity, updatedBy: 'admin', createdBy: 'admin'}),
});

export const updateEntity = (entity: IInvoice) => ({
  type: ACTION_TYPES.UPDATE_INVOICE,
  payload: axios.put<IInvoice>(`${apiUrl}/${entity._id}`, entity),
});

export const deleteEntity = (id: string) => ({
  type: ACTION_TYPES.DELETE_INVOICE,
  payload: axios.delete<IInvoice>(`${apiUrl}/${id}`),
});

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
