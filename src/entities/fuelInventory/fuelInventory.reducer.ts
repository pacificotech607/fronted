import axios from 'axios';
import { IFuelInventory } from '../../model/fuelInventory.model';

export const ACTION_TYPES = {
  FETCH_FUEL_INVENTORIES: 'fuelInventory/FETCH_FUEL_INVENTORIES',
  FETCH_FUEL_INVENTORY: 'fuelInventory/FETCH_FUEL_INVENTORY',
  CREATE_FUEL_INVENTORY: 'fuelInventory/CREATE_FUEL_INVENTORY',
  UPDATE_FUEL_INVENTORY: 'fuelInventory/UPDATE_FUEL_INVENTORY',
  DELETE_FUEL_INVENTORY: 'fuelInventory/DELETE_FUEL_INVENTORY',
  RESET: 'fuelInventory/RESET',
};

const initialState = {
  fuelInventories: [] as ReadonlyArray<IFuelInventory>,
  fuelInventory: {} as IFuelInventory,
  loading: false,
  errorMessage: null as string | null,
  updating: false,
  updateSuccess: false,
  totalPages: 0,
  page: 0,
};

export type FuelInventoryState = Readonly<typeof initialState>;

// Reducer
const fuelInventoryReducer = (state: FuelInventoryState = initialState, action: any): FuelInventoryState => {
  switch (action.type) {
    case `${ACTION_TYPES.FETCH_FUEL_INVENTORIES}_PENDING`:
    case `${ACTION_TYPES.FETCH_FUEL_INVENTORY}_PENDING`:
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case `${ACTION_TYPES.CREATE_FUEL_INVENTORY}_PENDING`:
    case `${ACTION_TYPES.UPDATE_FUEL_INVENTORY}_PENDING`:
    case `${ACTION_TYPES.DELETE_FUEL_INVENTORY}_PENDING`:
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case `${ACTION_TYPES.FETCH_FUEL_INVENTORIES}_FULFILLED`:
      return {
        ...state,
        loading: false,
        fuelInventories: action.payload.data.data.docs,
        totalPages: action.payload.data.data.totalPages,
        page: action.payload.data.data.page - 1,
      };
    case `${ACTION_TYPES.FETCH_FUEL_INVENTORY}_FULFILLED`:
      return {
        ...state,
        loading: false,
        fuelInventory: action.payload.data.data,
      };
    case `${ACTION_TYPES.CREATE_FUEL_INVENTORY}_FULFILLED`:
    case `${ACTION_TYPES.UPDATE_FUEL_INVENTORY}_FULFILLED`:
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        fuelInventory: action.payload.data.data,
      };
    case `${ACTION_TYPES.DELETE_FUEL_INVENTORY}_FULFILLED`:
      return {
        ...state,
        updating: false,
        updateSuccess: true,
      };
    case `${ACTION_TYPES.FETCH_FUEL_INVENTORIES}_REJECTED`:
    case `${ACTION_TYPES.FETCH_FUEL_INVENTORY}_REJECTED`:
    case `${ACTION_TYPES.CREATE_FUEL_INVENTORY}_REJECTED`:
    case `${ACTION_TYPES.UPDATE_FUEL_INVENTORY}_REJECTED`:
    case `${ACTION_TYPES.DELETE_FUEL_INVENTORY}_REJECTED`:
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload?.response?.data?.message || action.payload?.message || 'Error desconocido',
      };
    case ACTION_TYPES.RESET:
      return {
        ...initialState,
      };
    default:
      return state;
  }
};

export default fuelInventoryReducer;

const apiUrl = 'api/fuel-inventories';

// Actions

export const getEntities = (page?: number, size?: number, query?: string) => {
  const requestUrl = `${apiUrl}?page=${page || 0}&size=${size || 20}${query ? `&query=${query}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_FUEL_INVENTORIES,
    payload: axios.get<IFuelInventory>(requestUrl),
  };
};

export const getEntity = (id: string) => ({
  type: ACTION_TYPES.FETCH_FUEL_INVENTORY,
  payload: axios.get<IFuelInventory>(`${apiUrl}/${id}`),
});

export const createEntity = (entity: IFuelInventory) => ({
  type: ACTION_TYPES.CREATE_FUEL_INVENTORY,
  payload: axios.post<IFuelInventory>(apiUrl, entity),
});

export const updateEntity = (entity: IFuelInventory) => ({
  type: ACTION_TYPES.UPDATE_FUEL_INVENTORY,
  payload: axios.put<IFuelInventory>(`${apiUrl}/${entity._id}`, entity),
});

export const deleteEntity = (id: string) => ({
  type: ACTION_TYPES.DELETE_FUEL_INVENTORY,
  payload: axios.delete<IFuelInventory>(`${apiUrl}/${id}`),
});

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
