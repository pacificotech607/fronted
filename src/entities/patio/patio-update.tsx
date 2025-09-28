import { IPatio } from '../../model/patio.model';
import { toast } from 'react-toastify';
import GenericModal from '../../utils/Modal';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createEntity, updateEntity } from './patio.reducer';
import axios from 'axios';

type PatioUpdateProps = {
  patio: IPatio | null;
  refresh: () => void;
};

const PatioUpdate: React.FC<PatioUpdateProps> = ({ patio, refresh }) => {
  const dispatch = useDispatch();
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    clearErrors,
  } = useForm<IPatio>({
    mode: 'onSubmit',
  });

  const onSubmit = (data: IPatio) => {
    if (patio) {
      // This is an update
      dispatch(updateEntity(data));
      toast.success(`Patio ${data.name} editado`, {
        position: 'top-right',
      });
      refresh();
      reset();
    } else {
      // This is a creation
      dispatch(createEntity(data));
      toast.success(`Patio ${data.name} Creado`, {
        position: 'top-right',
      });
      refresh();
      reset();
    }
  };

  useEffect(() => {
    if (patio) {
      reset(patio);
    } else {
      reset({
        _id: '',
        name: '',
      });
    }
    clearErrors();
  }, [patio, reset, clearErrors]);

  return (
    <GenericModal
      id="patioUpdateModal"
      title={patio && patio._id ? 'Editar Patio' : 'Crear nuevo Patio'}
    >
      <div className="form-container">
        <form className="needs-validation" onSubmit={handleSubmit(onSubmit)}>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-12">
                <label htmlFor="nameInput" className="form-label fw-semibold">
                  Nombre <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                  id="nameInput"
                  placeholder="Ingrese el nombre del patio"
                  autoFocus
                  {...register('name', {
                    required: 'El nombre es obligatorio.',
                    validate: async (value) => {
                      try {
                        const existingPatiosResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/patio?name=${value}`);
                        const existingPatios = existingPatiosResponse.data.data;
                        
                        if (patio && patio._id) {
                          // This is an update
                          const otherPatios = existingPatios.filter((p: IPatio) => p._id !== patio._id);
                          if (otherPatios.length > 0) {
                            return "El nombre del patio ya existe.";
                          }
                        } else {
                          // This is a creation
                          if (existingPatios.length > 0) {
                            return "El nombre del patio ya existe.";
                          }
                        }
                        return true;
                      } catch (error) {
                        toast.error("Error al validar el nombre del patio.");
                        return "Error al validar el nombre del patio.";
                      }
                    },
                  })}
                />
                {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
              </div>
            </div>
            <br />
            <div className="row g-3">
              <div className="col-12">
                <div className="d-flex flex-column flex-sm-row justify-content-end gap-2">
                  <button
                    onClick={() => {
                      reset();
                      clearErrors();
                    }}
                    data-bs-dismiss="modal"
                    className="btn btn-danger order-sm-1"
                    type="button"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary order-sm-2" 
                    data-bs-dismiss="modal"
                  >
                    Guardar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </GenericModal>
  );
};

export default PatioUpdate;