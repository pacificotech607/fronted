import { IPatio } from '../../model/patio.model';
import { toast } from 'react-toastify';
import GenericModal from '../../utils/Modal';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createEntity, updateEntity } from './patio.reducer';

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
    mode: 'onSubmit'
  });

  const onSubmit = (data: IPatio) => {
    if (patio && patio._id) {
      dispatch(updateEntity(data));
      toast.success(`Patio ${data.name} editado`, {
        position: "top-right",
      });
      refresh();
    } else {
      dispatch(createEntity(data));
      toast.success(`Patio ${data.name} Creado`, {
        position: "top-right",
      });
      refresh();
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
              <div className="col-md-12">
                <label htmlFor="nameInput" className="form-label">Nombre</label>
                <input
                  type="text"
                  className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                  id="nameInput"
                  placeholder="Nombre"
                  {...register("name", {
                    required: "El nombre es obligatorio."
                  })}
                />
                {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
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

export default PatioUpdate;
