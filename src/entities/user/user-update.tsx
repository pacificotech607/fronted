import { IUser } from '../../model/user.model';
import GenericModal from '../../utils/Modal';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createEntity, updateEntity } from './user.reducer';

type UserUpdateProps = {
  user: IUser | null;
  refresh: () => void;
};

const UserUpdate: React.FC<UserUpdateProps> = ({ user, refresh }) => {
  const dispatch = useDispatch();
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    clearErrors,
  } = useForm<IUser>({
    mode: 'onSubmit',
  });

  const onSubmit = (data: IUser) => {
    if (user) {
      dispatch(updateEntity(data));
    } else {
      dispatch(createEntity(data));
    }
    refresh();
  };

  useEffect(() => {
    if (user) {
      reset(user);
    } else {
      reset({});
    }
    clearErrors();
  }, [user, reset, clearErrors]);

  return (
    <GenericModal
      id="userUpdateModal"
      title="Crear nuevo usuario"
    >
      <div className="form-container">
        <form className="needs-validation" onSubmit={handleSubmit(onSubmit)}>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-6">
                <label htmlFor="userInput" className="form-label">Usuario</label>
                <input
                  type="text"
                  className={`form-control ${errors.user ? 'is-invalid' : ''}`}
                  id="userInput"
                  placeholder="Usuario"
                  {...register('user', {
                    required: 'El nombre de usuario es obligatorio.',
                    minLength: {
                      value: 3,
                      message: 'El nombre debe tener al menos 3 caracteres.',
                    },
                    maxLength: {
                      value: 20,
                      message: 'El nombre no puede exceder los 20 caracteres.',
                    },
                  })}
                />
                {errors.user && <div className="invalid-feedback">{errors.user.message}</div>}
              </div>
              <div className="col-md-6">
                <label htmlFor="emailInput" className="form-label">Correo</label>
                <input
                  type="email"
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  id="emailInput"
                  placeholder="Correo"
                  {...register('email', {
                    required: 'El correo electrónico es obligatorio.',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'El formato del correo no es válido.',
                    },
                  })}
                />
                {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
              </div>
            </div>
            <div className="row g-3">
              <div className="col-md-12">
                <label htmlFor="selectInput" className="form-label">Puesto</label>
                <select
                  className={`form-select ${errors.workstation ? 'is-invalid' : ''}`}
                  id="selectInput"
                  {...register('workstation', {
                    required: 'Por favor, selecciona un puesto.',
                  })}
                >
                  <option value="">Elige...</option>
                  <option value="desarrollador">Desarrollador</option>
                  <option value="disenador">Diseñador</option>
                  <option value="gestor">Gestor de proyectos</option>
                </select>
                {errors.workstation && <div className="invalid-feedback">{errors.workstation.message}</div>}
              </div>
            </div>
            <br />
            <div className="row g-3">
              <div className="col-md-12 text-end">
                <button
                  style={{ marginRight: '10px' }}
                  onClick={() => {
                    reset();
                    clearErrors();
                  }}
                  data-bs-dismiss="modal"
                  className="btn btn-danger"
                  type="button"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">Submit</button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </GenericModal>
  );
};

export default UserUpdate;
