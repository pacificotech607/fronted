import { IOperator } from '../../model/operator.model';
import GenericModal from '../../utils/Modal';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createEntity, updateEntity } from './operator.reducer';
import { toast } from 'react-toastify';

type OperatorUpdateProps = {
  operator: IOperator | null;
  refresh: () => void;
};

const OperatorUpdate: React.FC<OperatorUpdateProps> = ({ operator, refresh }) => {
  const dispatch = useDispatch();
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    clearErrors,
  } = useForm<IOperator>({
    mode: 'onSubmit',
  });

  const onSubmit = (data: IOperator) => {
    if (operator) {
      dispatch(updateEntity(data));
      toast.success(`Operador ${data.name} editado`, {
        position: "top-right",
      });
    } else {
      dispatch(createEntity(data));
      toast.success(`Pestaña ${data.name} Creado`, {
        position: "top-right",
      });
    }
    refresh();
  };

  useEffect(() => {
    if (operator) {
      reset(operator);
    } else {
      reset({});
    }
    clearErrors();
  }, [operator, reset, clearErrors]);

  return (
    <GenericModal
      id="operatorUpdateModal"
      title="Crear nuevo operador"
    >
      <div className="form-container">
        <form className="needs-validation" onSubmit={handleSubmit(onSubmit)}>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-6">
                <label htmlFor="nameInput" className="form-label">Nombre</label>
                <input
                  type="text"
                  className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                  id="nameInput"
                  {...register('name', {
                    required: 'El nombre es obligatorio.',
                    minLength: {
                      value: 3,
                      message: 'El nombre debe tener al menos 3 caracteres.',
                    },
                  })}
                />
                {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
              </div>
              <div className="col-md-6">
                <label htmlFor="licenseInput" className="form-label">Licencia</label>
                <input
                  type="text"
                  className={`form-control ${errors.license ? 'is-invalid' : ''}`}
                  id="licenseInput"
                  {...register('license', {
                    required: 'La licencia es obligatoria.',
                  })}
                />
                {errors.license && <div className="invalid-feedback">{errors.license.message}</div>}
              </div>
            </div>
            <div className="row g-3 mt-1">
              <div className="col-md-6">
                <label htmlFor="vigenciaInput" className="form-label">Vigencia</label>
                <input
                  type="date"
                  className={`form-control ${errors.vigencia ? 'is-invalid' : ''}`}
                  id="vigenciaInput"
                  {...register('vigencia', {
                    required: 'La vigencia es obligatoria.',
                  })}
                />
                {errors.vigencia && <div className="invalid-feedback">{errors.vigencia.message}</div>}
              </div>
              <div className="col-md-6">
                <label htmlFor="rfcInput" className="form-label">RFC</label>
                <input
                  type="text"
                  className={`form-control ${errors.rfc ? 'is-invalid' : ''}`}
                  id="rfcInput"
                  {...register('rfc', {
                    required: 'El RFC es obligatorio.',
                    pattern: {
                      value: /^[A-Z&Ñ]{3,4}[0-9]{2}(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01])[A-Z0-9]{2}[0-9A]$/,
                      message: 'El formato del RFC no es válido.',
                    },
                  })}
                />
                {errors.rfc && <div className="invalid-feedback">{errors.rfc.message}</div>}
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
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">Guardar</button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </GenericModal>
  );
};

export default OperatorUpdate;
