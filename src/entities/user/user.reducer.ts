import axios from 'axios';
import { IUser } from '../../model/user.model';

export const ACTION_TYPES = {
  FETCH_USERS: 'user/FETCH_USERS',
  FETCH_USER: 'user/FETCH_USER',
  CREATE_USER: 'user/CREATE_USER',
  UPDATE_USER: 'user/UPDATE_USER',
  DELETE_USER: 'user/DELETE_USER',
  RESET: 'user/RESET',
};

const initialState = {
  users: [] as ReadonlyArray<IUser>,
  user: {} as IUser,
  loading: false,
  errorMessage: null as string | null,
  updating: false,
  updateSuccess: false,
  totalPages: 0,
  page: 0,
};

export type UserState = Readonly<typeof initialState>;

// Reducer

const userReducer = (state: UserState = initialState, action: any): UserState => {
  switch (action.type) {
    case `${ACTION_TYPES.FETCH_USERS}_PENDING`:
    case `${ACTION_TYPES.FETCH_USER}_PENDING`:
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case `${ACTION_TYPES.CREATE_USER}_PENDING`:
    case `${ACTION_TYPES.UPDATE_USER}_PENDING`:
    case `${ACTION_TYPES.DELETE_USER}_PENDING`:
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case `${ACTION_TYPES.FETCH_USERS}_FULFILLED`:
      return {
        ...state,
        loading: false,
        users: action.payload.data.docs,
        totalPages: action.payload.data.totalPages,
        page: action.payload.data.page,
      };
    case `${ACTION_TYPES.FETCH_USER}_FULFILLED`:
      return {
        ...state,
        loading: false,
        user: action.payload.data,
      };
    case `${ACTION_TYPES.CREATE_USER}_FULFILLED`:
    case `${ACTION_TYPES.UPDATE_USER}_FULFILLED`:
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        user: action.payload.data,
      };
    case `${ACTION_TYPES.DELETE_USER}_FULFILLED`:
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        user: {},
      };
    case `${ACTION_TYPES.FETCH_USERS}_REJECTED`:
    case `${ACTION_TYPES.FETCH_USER}_REJECTED`:
    case `${ACTION_TYPES.CREATE_USER}_REJECTED`:
    case `${ACTION_TYPES.UPDATE_USER}_REJECTED`:
    case `${ACTION_TYPES.DELETE_USER}_REJECTED`:
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

export default userReducer;

const apiUrl = 'api/users';

// Actions

export const getEntities = (page?: number, size?: number, query?: string) => {
  const requestUrl = `${apiUrl}?page=${page || 0}&size=${size || 20}${query ? `&query=${query}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_USERS,
    payload: axios.get<IUser>(requestUrl),
  };
};

export const getEntity = (id: string) => ({
  type: ACTION_TYPES.FETCH_USER,
  payload: axios.get<IUser>(`${apiUrl}/${id}`),
});

export const createEntity = (entity: IUser) => ({
  type: ACTION_TYPES.CREATE_USER,
  payload: axios.post<IUser>(apiUrl, {...entity, updatedBy: 'admin', createdBy: 'admin'}),
});

export const updateEntity = (entity: IUser) => ({
  type: ACTION_TYPES.UPDATE_USER,
  payload: axios.put<IUser>(`${apiUrl}/${entity._id}`, entity),
});

export const deleteEntity = (id: string) => ({
  type: ACTION_TYPES.DELETE_USER,
  payload: axios.delete<IUser>(`${apiUrl}/${id}`),
});

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
