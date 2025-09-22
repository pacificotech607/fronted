import { IValuelist } from '../../model/valuelist.model';
import { toast } from 'react-toastify';
import GenericModal from '../../utils/Modal';
import { useForm, Controller } from 'react-hook-form';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createEntity, updateEntity } from './valuelist.reducer';
import AsyncSelectInput from '../../utils/asynSelect';
import axios from 'axios';

type ValuelistUpdateProps = {
  valuelist: IValuelist | null;
  refresh: () => void;
};

const ValuelistUpdate: React.FC<ValuelistUpdateProps> = ({ valuelist, refresh }) => {
  const dispatch = useDispatch();
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    clearErrors,
    getValues,
    trigger,
    control,
  } = useForm<IValuelist>({
    mode: 'onSubmit',
  });

  const onSubmit = (data: IValuelist) => {
    if (valuelist && valuelist._id) {
      dispatch(updateEntity(data));
      toast.success(`Valuelist ${data.name} editado`, {
        position: 'top-right',
      });
      refresh();
    } else {
      dispatch(createEntity(data));
      toast.success(`Valuelist ${data.name} Creado`, {
        position: 'top-right',
      });
      refresh();
    }
    reset({
      _id: '',
      name: '',
      type: '',
      enLabel: '',
      esLabel: '',
    });
  };

  useEffect(() => {
    if (valuelist) {
      reset(valuelist);
    } else {
      reset({
        _id: '',
        name: '',
        type: '',
        enLabel: '',
        esLabel: '',
      });
    }
    clearErrors();
  }, [valuelist, reset, clearErrors]);

  return (
    <GenericModal
      id="valuelistUpdateModal"
      title={valuelist && valuelist._id ? 'Editar Valuelist' : 'Crear nuevo Valuelist'}
    >
      <div className="form-container">
        <form className="needs-validation" onSubmit={handleSubmit(onSubmit)}>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-6">
                <label htmlFor="typeInput" className="form-label">Type</label>
                <input
                  type="text"
                  className={`form-control ${errors.type ? 'is-invalid' : ''}`}
                  id="typeInput"
                  placeholder="Type"
                  {...register("type", {
                    required: "El type es obligatorio."
                  })}
                  onChange={() => trigger("name")}
                />
                {errors.type && <div className="invalid-feedback">{errors.type.message}</div>}
              </div>
              <div className="col-md-6">
                <label htmlFor="nameInput" className="form-label">Name</label>
                <input
                  type="text"
                  className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                  id="nameInput"
                  placeholder="Name"
                  {...register("name", {
                    required: "El nombre es obligatorio.",
                    validate: async name => {
                      try {
                        const type = getValues("type");
                        if (!type) return true;
                        const query = encodeURIComponent(JSON.stringify({ name, type }));
                        const response = await axios.get<{ data: { docs: IValuelist[] } }>(`/api/valuelists?query=${query}`);
                        const existingValuelists = response.data.data.docs;

                        if (valuelist && valuelist._id) {
                          const isDuplicate = existingValuelists.some(v => v._id !== valuelist._id);
                          if (isDuplicate) {
                            return "La combinación de type y name ya existe.";
                          }
                        } else {
                          if (existingValuelists.length > 0) {
                            return "La combinación de type y name ya existe.";
                          }
                        }
                        return true;
                      } catch (error) {
                        toast.error("Error al validar.");
                        return "Error al validar.";
                      }
                    },
                  })}
                />
                {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
              </div>
              <div className="col-md-6">
                <label htmlFor="enLabelInput" className="form-label">English Label</label>
                <input
                  type="text"
                  className={`form-control ${errors.enLabel ? 'is-invalid' : ''}`}
                  id="enLabelInput"
                  placeholder="English Label"
                  {...register("enLabel", {
                    required: "El English Label es obligatorio."
                  })}
                />
                {errors.enLabel && <div className="invalid-feedback">{errors.enLabel.message}</div>}
              </div>
              <div className="col-md-6">
                <label htmlFor="esLabelInput" className="form-label">Spanish Label</label>
                <input
                  type="text"
                  className={`form-control ${errors.esLabel ? 'is-invalid' : ''}`}
                  id="esLabelInput"
                  placeholder="Spanish Label"
                  {...register("esLabel", {
                    required: "El Spanish Label es obligatorio."
                  })}
                />
                {errors.esLabel && <div className="invalid-feedback">{errors.esLabel.message}</div>}
              </div>
              <div className="col-md-12">
                <label htmlFor="parentInput" className="form-label">
                  Lista padre
                </label>
                <Controller
                  name="parent"
                  control={control}
                  render={({ field }) => (
                    <AsyncSelectInput
                      entityName="valuelists"
                      labelField="esLabel"
                      searchField="esLabel"
                      onChange={value => field.onChange(value._id)}
                      defaultValue={valuelist?.parent}
                    />
                  )}
                />
                {errors.parent && <div className="invalid-feedback">{errors.parent.message}</div>}
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

export default ValuelistUpdate;
