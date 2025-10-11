import axios from "axios";
import { IFuel } from "../../model/fuel.model";

export const ACTION_TYPES = {
  FETCH_FUELS: "fuel/FETCH_FUELS",
  FETCH_FUEL: "fuel/FETCH_FUEL",
  CREATE_FUEL: "fuel/CREATE_FUEL",
  UPDATE_FUEL: "fuel/UPDATE_FUEL",
  DELETE_FUEL: "fuel/DELETE_FUEL",
  RESET: "fuel/RESET",
};

const initialState = {
  fuels: [] as ReadonlyArray<IFuel>,
  fuel: {} as IFuel,
  loading: false,
  errorMessage: null as string | null,
  updating: false,
  updateSuccess: false,
  totalPages: 0,
  page: 0,
};

export type FuelState = Readonly<typeof initialState>;

// Reducer

const fuelReducer = (
  state: FuelState = initialState,
  action: any
): FuelState => {
  switch (action.type) {
    case `${ACTION_TYPES.FETCH_FUELS}_PENDING`:
    case `${ACTION_TYPES.FETCH_FUEL}_PENDING`:
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case `${ACTION_TYPES.CREATE_FUEL}_PENDING`:
    case `${ACTION_TYPES.UPDATE_FUEL}_PENDING`:
    case `${ACTION_TYPES.DELETE_FUEL}_PENDING`:
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case `${ACTION_TYPES.FETCH_FUELS}_FULFILLED`:
      return {
        ...state,
        loading: false,
        fuels: action.payload.data.data.docs,
        totalPages: action.payload.data.data.totalPages,
        page: action.payload.data.data.page,
      };
    case `${ACTION_TYPES.FETCH_FUEL}_FULFILLED`:
      return {
        ...state,
        loading: false,
        fuel: action.payload.data,
      };
    case `${ACTION_TYPES.CREATE_FUEL}_FULFILLED`:
    case `${ACTION_TYPES.UPDATE_FUEL}_FULFILLED`:
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        fuel: action.payload.data,
      };
    case `${ACTION_TYPES.DELETE_FUEL}_FULFILLED`:
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        fuel: {},
      };
    case `${ACTION_TYPES.FETCH_FUELS}_REJECTED`:
    case `${ACTION_TYPES.FETCH_FUEL}_REJECTED`:
    case `${ACTION_TYPES.CREATE_FUEL}_REJECTED`:
    case `${ACTION_TYPES.UPDATE_FUEL}_REJECTED`:
    case `${ACTION_TYPES.DELETE_FUEL}_REJECTED`:
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

export default fuelReducer;

const apiUrl = "api/fuels";

// Actions

export const getEntities = (page?: number, size?: number, query?: string) => {
  const requestUrl = `${apiUrl}?page=${page || 0}&size=${size || 20}${
    query ? `&query=${query}` : ""
  }`;
  return {
    type: ACTION_TYPES.FETCH_FUELS,
    payload: axios.get<IFuel>(requestUrl),
  };
};

export const getEntity = (id: string) => ({
  type: ACTION_TYPES.FETCH_FUEL,
  payload: axios.get<IFuel>(`${apiUrl}/${id}`),
});

export const createEntity = (entity: IFuel) => ({
  type: ACTION_TYPES.CREATE_FUEL,
  payload: axios.post<IFuel>(apiUrl, {
    ...entity,
    updatedBy: "admin",
    createdBy: "admin",
  }),
});

export const updateEntity = (entity: IFuel) => ({
  type: ACTION_TYPES.UPDATE_FUEL,
  payload: axios.put<IFuel>(`${apiUrl}/${entity._id}`, entity),
});

export const deleteEntity = (id: string) => ({
  type: ACTION_TYPES.DELETE_FUEL,
  payload: axios.delete<IFuel>(`${apiUrl}/${id}`),
});

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
