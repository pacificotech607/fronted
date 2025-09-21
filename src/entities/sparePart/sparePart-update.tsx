import { ISparePart } from '../../model/sparePart.model';
import GenericModal from '../../utils/Modal';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createEntity, updateEntity } from './sparePart.reducer';
import { toast } from 'react-toastify';

type SparePartUpdateProps = {
  sparePart: ISparePart | null;
  refresh: () => void;
};

const SparePartUpdate: React.FC<SparePartUpdateProps> = ({ sparePart, refresh }) => {
  const dispatch = useDispatch();
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    clearErrors,
  } = useForm<ISparePart>({
    mode: 'onSubmit',
  });

  const onSubmit = (data: ISparePart) => {
    if (sparePart) {
      dispatch(updateEntity(data));
      toast.success(`Refaccion ${data.description} editado`, {
        position: "top-right",
      });
    } else {
      dispatch(createEntity(data));
      toast.success(`Refaccion ${data.description} Creado`, {
        position: "top-right",
      });
    }
    refresh();
  };

  useEffect(() => {
    if (sparePart) {
      reset(sparePart);
    } else {
      reset({});
    }
    clearErrors();
  }, [sparePart, reset, clearErrors]);

  return (
    <GenericModal
      id="sparePartUpdateModal"
      title="Crear nueva refacción"
    >
      <div className="form-container">
        <form className="needs-validation" onSubmit={handleSubmit(onSubmit)}>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-12">
                <label htmlFor="descriptionInput" className="form-label">Descripción</label>
                <input
                  type="text"
                  className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                  id="descriptionInput"
                  placeholder="Descripción"
                  {...register('description', {
                    required: 'La descripción es obligatoria.',
                  })}
                />
                {errors.description && <div className="invalid-feedback">{errors.description.message}</div>}
              </div>
            </div>
            <div className="row g-3 mt-1">
              <div className="col-md-6">
                <label htmlFor="codeInput" className="form-label">Código</label>
                <input
                  type="text"
                  className={`form-control ${errors.code ? 'is-invalid' : ''}`}
                  id="codeInput"
                  placeholder="Código"
                  {...register('code', {
                    required: 'El código es obligatorio.',
                  })}
                />
                {errors.code && <div className="invalid-feedback">{errors.code.message}</div>}
              </div>
              <div className="col-md-6">
                <label htmlFor="priceInput" className="form-label">Precio</label>
                <input
                  type="text"
                  className={`form-control ${errors.price ? 'is-invalid' : ''}`}
                  id="priceInput"
                  placeholder="Precio"
                  {...register('price', {
                    required: 'El precio es obligatorio.',
                  })}
                />
                {errors.price && <div className="invalid-feedback">{errors.price.message}</div>}
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

export default SparePartUpdate;
