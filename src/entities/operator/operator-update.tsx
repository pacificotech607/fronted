import { IOperator } from '../../model/operator.model';
import GenericModal from '../../utils/Modal';
import axios from 'axios';
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
    mode: 'onChange',
  });

  const onSubmit = (data: IOperator) => {
    if (operator && operator._id) {
      // This is an update
      dispatch(updateEntity(data));
      toast.success(`Operador ${data.name} editado`, {
        position: 'top-right',
      });
      refresh();
      reset();
    } else {
      // This is a creation
      dispatch(createEntity(data));
      toast.success(`Operador ${data.name} Creado`, {
        position: 'top-right',
      });
      refresh();
      reset();
    }
  };

  useEffect(() => {
    if (operator) {
      reset(operator);
    } else {
      reset({
        _id: '',
        name: '',
        license: '',
        vigencia: '',
        rfc: '',
      });
    }
    clearErrors();
  }, [operator, reset, clearErrors]);

  return (
    <GenericModal
      id="operatorUpdateModal"
      title={operator && operator._id ? 'Editar Operador' : 'Crear nuevo Operador'}
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
                  placeholder="Nombre"
                  {...register("name", {
                    required: "El nombre es obligatorio.",
                    validate: async name => {
                      try {
                        const query = encodeURIComponent(JSON.stringify({ name: name }));
                        const response = await axios.get<{ data: { docs: IOperator[] } }>(`/api/operators?query=${query}`);
                        const existingOperators = response.data.data.docs;

                        if (operator && operator._id) {
                          // This is an update
                          const isDuplicate = existingOperators.some(p => p._id !== operator._id);
                          if (isDuplicate) {
                            return "El nombre del operador ya existe.";
                          }
                        } else {
                          // This is a creation
                          if (existingOperators.length > 0) {
                            return "El nombre del operador ya existe.";
                          }
                        }
                        return true;
                      } catch (error) {
                        toast.error("Error al validar el nombre del operador.");
                        return "Error al validar el nombre del operador.";
                      }
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
                  placeholder="Licencia"
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
                  placeholder="Vigencia"
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
                  placeholder="RFC"
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
