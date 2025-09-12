import axios from 'axios';
import { IMotorTransport } from '../../model/motorTransport.model';

export const ACTION_TYPES = {
  FETCH_MOTORTRANSPORTS: 'motorTransport/FETCH_MOTORTRANSPORTS',
  FETCH_MOTORTRANSPORT: 'motorTransport/FETCH_MOTORTRANSPORT',
  CREATE_MOTORTRANSPORT: 'motorTransport/CREATE_MOTORTRANSPORT',
  UPDATE_MOTORTRANSPORT: 'motorTransport/UPDATE_MOTORTRANSPORT',
  DELETE_MOTORTRANSPORT: 'motorTransport/DELETE_MOTORTRANSPORT',
  RESET: 'motorTransport/RESET',
};

const initialState = {
  motorTransports: [] as ReadonlyArray<IMotorTransport>,
  motorTransport: {} as IMotorTransport,
  loading: false,
  errorMessage: null as string | null,
  updating: false,
  updateSuccess: false,
  totalPages: 0,
  page: 0,
};

export type MotorTransportState = Readonly<typeof initialState>;

// Reducer

const motorTransportReducer = (state: MotorTransportState = initialState, action: any): MotorTransportState => {
  switch (action.type) {
    case `${ACTION_TYPES.FETCH_MOTORTRANSPORTS}_PENDING`:
    case `${ACTION_TYPES.FETCH_MOTORTRANSPORT}_PENDING`:
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case `${ACTION_TYPES.CREATE_MOTORTRANSPORT}_PENDING`:
    case `${ACTION_TYPES.UPDATE_MOTORTRANSPORT}_PENDING`:
    case `${ACTION_TYPES.DELETE_MOTORTRANSPORT}_PENDING`:
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case `${ACTION_TYPES.FETCH_MOTORTRANSPORTS}_FULFILLED`:
      return {
        ...state,
        loading: false,
        motorTransports: action.payload.data.docs,
        totalPages: action.payload.data.totalPages,
        page: action.payload.data.page,
      };
    case `${ACTION_TYPES.FETCH_MOTORTRANSPORT}_FULFILLED`:
      return {
        ...state,
        loading: false,
        motorTransport: action.payload.data,
      };
    case `${ACTION_TYPES.CREATE_MOTORTRANSPORT}_FULFILLED`:
    case `${ACTION_TYPES.UPDATE_MOTORTRANSPORT}_FULFILLED`:
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        motorTransport: action.payload.data,
      };
    case `${ACTION_TYPES.DELETE_MOTORTRANSPORT}_FULFILLED`:
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        motorTransport: {},
      };
    case `${ACTION_TYPES.FETCH_MOTORTRANSPORTS}_REJECTED`:
    case `${ACTION_TYPES.FETCH_MOTORTRANSPORT}_REJECTED`:
    case `${ACTION_TYPES.CREATE_MOTORTRANSPORT}_REJECTED`:
    case `${ACTION_TYPES.UPDATE_MOTORTRANSPORT}_REJECTED`:
    case `${ACTION_TYPES.DELETE_MOTORTRANSPORT}_REJECTED`:
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

export default motorTransportReducer;

const apiUrl = 'api/motor-transports';

// Actions

export const getEntities = (page?: number, size?: number) => ({
  type: ACTION_TYPES.FETCH_MOTORTRANSPORTS,
  payload: axios.get<IMotorTransport>(`${apiUrl}?page=${page || 0}&size=${size || 20}`),
});

export const getEntity = (id: string) => ({
  type: ACTION_TYPES.FETCH_MOTORTRANSPORT,
  payload: axios.get<IMotorTransport>(`${apiUrl}/${id}`),
});

export const createEntity = (entity: IMotorTransport) => ({
  type: ACTION_TYPES.CREATE_MOTORTRANSPORT,
  payload: axios.post<IMotorTransport>(apiUrl, {...entity, updatedBy: 'admin', createdBy: 'admin'}),
});

export const updateEntity = (entity: IMotorTransport) => ({
  type: ACTION_TYPES.UPDATE_MOTORTRANSPORT,
  payload: axios.put<IMotorTransport>(`${apiUrl}/${entity._id}`, entity),
});

export const deleteEntity = (id: string) => ({
  type: ACTION_TYPES.DELETE_MOTORTRANSPORT,
  payload: axios.delete<IMotorTransport>(`${apiUrl}/${id}`),
});

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
