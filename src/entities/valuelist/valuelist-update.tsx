import { IValuelist } from '../../model/valuelist.model';
import { toast } from 'react-toastify';
import GenericModal from '../../utils/Modal';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { createEntity, updateEntity } from './valuelist.reducer';
import AsyncSelectInput from  '../../utils/asynSelect';
type ValuelistUpdateProps = {
  valuelist: IValuelist | null;
  refresh: () => void;
};

const ValuelistUpdate: React.FC<ValuelistUpdateProps> = ({ valuelist, refresh }) => {
  const dispatch = useDispatch();
  const [parent, setParent] = useState<IValuelist | null>(null);
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    clearErrors,
  } = useForm<IValuelist>({
    mode: 'onSubmit'
  });

  const onSubmit = (data: IValuelist) => {
    const entity = {
      ...data,
      parent: parent ? parent._id : undefined,
    };
    if (valuelist && valuelist._id) {
      dispatch(updateEntity(entity));
      toast.success(`Valuelist ${data.name} editado`, {
        position: "top-right",
      });
      refresh();
    } else {
      dispatch(createEntity(entity));
      toast.success(`Valuelist ${data.name} Creado`, {
        position: "top-right",
      });
      refresh();
    }
  };

  useEffect(() => {
    if (valuelist) {
      reset(valuelist);
      if (valuelist.parent && valuelist.parent) {
        setParent(valuelist.parent as IValuelist);
      } else {
        setParent(null);
      }
    } else {
      reset({
        _id: '',
        name: '',
        type: '',
        enLabel: '',
        esLabel: '',
      });
      setParent(null);
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
                  {...register("type", {
                    required: "El type es obligatorio."
                  })}
                />
                {errors.type && <div className="invalid-feedback">{errors.type.message}</div>}
              </div>
              <div className="col-md-6">
                <label htmlFor="nameInput" className="form-label">Name</label>
                <input
                  type="text"
                  className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                  id="nameInput"
                  {...register("name", {
                    required: "El nombre es obligatorio."
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
                  {...register("esLabel", {
                    required: "El Spanish Label es obligatorio."
                  })}
                />
                {errors.esLabel && <div className="invalid-feedback">{errors.esLabel.message}</div>}
              </div>
              <div className="col-md-12">
                <label htmlFor="parentInput" className="form-label">Lista padre</label>
                <AsyncSelectInput
                  key={valuelist?._id}
                  entityName='valuelists'
                  labelField="esLabel"
                  defaultValue={valuelist?.parent ? valuelist.parent : null}
                  onChange={(selected) => {
                    setParent(selected);
                  }}
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
