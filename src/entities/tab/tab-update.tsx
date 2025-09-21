import { ITab } from '../../model/tab.model';
import GenericModal from '../../utils/Modal';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createEntity, updateEntity } from './tab.reducer';
import { toast } from 'react-toastify';

type TabUpdateProps = {
  tab: ITab | null;
  refresh: () => void;
};

const TabUpdate: React.FC<TabUpdateProps> = ({ tab, refresh }) => {
  const dispatch = useDispatch();
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    clearErrors,
  } = useForm<ITab>({
    mode: 'onSubmit',
  });

  const onSubmit = (data: ITab) => {
    if (tab) {
      dispatch(updateEntity(data));
      toast.success(`Pestaña ${data.description} editado`, {
        position: "top-right",
      });
    } else {
      dispatch(createEntity(data));
      toast.success(`Pestaña ${data.description} Creado`, {
        position: "top-right",
      });
    }
    refresh();
  };

  useEffect(() => {
    if (tab) {
      reset(tab);
    } else {
      reset({});
    }
    clearErrors();
  }, [tab, reset, clearErrors]);

  return (
    <GenericModal
      id="tabUpdateModal"
      title="Crear nueva pestaña"
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
                <label htmlFor="distanceKmInput" className="form-label">Distancia (Km)</label>
                <input
                  type="text"
                  className={`form-control ${errors.distanceKm ? 'is-invalid' : ''}`}
                  id="distanceKmInput"
                  placeholder="Distancia (Km)"
                  {...register('distanceKm', {
                    required: 'La distancia es obligatoria.',
                  })}
                />
                {errors.distanceKm && <div className="invalid-feedback">{errors.distanceKm.message}</div>}
              </div>
              <div className="col-md-6">
                <label htmlFor="dieselConsumedInput" className="form-label">Diesel consumido</label>
                <input
                  type="text"
                  className={`form-control ${errors.dieselConsumed ? 'is-invalid' : ''}`}
                  id="dieselConsumedInput"
                  placeholder="Diesel consumido"
                  {...register('dieselConsumed', {
                    required: 'El diesel consumido es obligatorio.',
                  })}
                />
                {errors.dieselConsumed && <div className="invalid-feedback">{errors.dieselConsumed.message}</div>}
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

export default TabUpdate;
