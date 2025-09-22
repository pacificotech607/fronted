import { IMotorTransport } from '../../model/motorTransport.model';
import GenericModal from '../../utils/Modal';
import { useForm, Controller } from 'react-hook-form';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import AsyncSelectInput from '../../utils/asynSelect';
import { createEntity, updateEntity } from './motorTransport.reducer';

type MotorTransportUpdateProps = {
  motorTransport: IMotorTransport | null;
  refresh: () => void;
};

const MotorTransportUpdate: React.FC<MotorTransportUpdateProps> = ({ motorTransport, refresh }) => {
  const dispatch = useDispatch();
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    clearErrors,
    control
  } = useForm<IMotorTransport>({
    mode: 'onSubmit',
  });

  const onSubmit = (data: IMotorTransport) => {
    if (motorTransport) {
      dispatch(updateEntity(data));
    } else {
      dispatch(createEntity(data));
    }
    refresh();
  };

  useEffect(() => {
    if (motorTransport) {
      reset(motorTransport);
    } else {
      reset({});
    }
    clearErrors();
  }, [motorTransport, reset, clearErrors]);

  return (
    <GenericModal
      id="motorTransportUpdateModal"
      title="Crear nuevo autotransporte"
    >
      <div className="form-container">
        <form className="needs-validation" onSubmit={handleSubmit(onSubmit)}>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-6">
                <label htmlFor="numberInput" className="form-label">Número</label>
                <input
                  type="text"
                  className={`form-control ${errors.number ? 'is-invalid' : ''}`}
                  id="numberInput"
                  placeholder="Número"
                  {...register('number', {
                    required: 'El número es obligatorio.',
                  })}
                />
                {errors.number && <div className="invalid-feedback">{errors.number.message}</div>}
              </div>
              <div className="col-md-6">
                <label htmlFor="configurationInput" className="form-label">Configuración</label>
                <Controller
                  name="configuration"
                  control={control}
                  rules={{ required: 'La configuración es obligatoria.' }}
                  render={({ field }) => (
                    <AsyncSelectInput
                      entityName="valuelists"
                      labelField="esLabel"
                      onChange={(value) => field.onChange(value._id)}
                      defaultValue={motorTransport?.configuration}
                      initialConditions={encodeURIComponent(JSON.stringify({ type: 'vehicle_configuration', alive: true }))}
                      searchField='esLabel'
                      isRequired
                    />
                  )}
                />
                {errors.configuration && <div className="invalid-feedback">{errors.configuration.message}</div>}
              </div>
            </div>
            <div className="row g-3 mt-1">
              <div className="col-md-6">
                <label htmlFor="plateInput" className="form-label">Placa</label>
                <input
                  type="text"
                  className={`form-control ${errors.plate ? 'is-invalid' : ''}`}
                  id="plateInput"
                  placeholder="Placa"
                  {...register('plate', {
                    required: 'La placa es obligatoria.',
                  })}
                />
                {errors.plate && <div className="invalid-feedback">{errors.plate.message}</div>}
              </div>
              <div className="col-md-6">
                <label htmlFor="yearInput" className="form-label">Año</label>
                <input
                  type="text"
                  className={`form-control ${errors.year ? 'is-invalid' : ''}`}
                  id="yearInput"
                  placeholder="Año"
                  {...register('year', {
                    required: 'El año es obligatorio.',
                  })}
                />
                {errors.year && <div className="invalid-feedback">{errors.year.message}</div>}
              </div>
            </div>
            <div className="row g-3 mt-1">
              <div className="col-md-6">
                <label htmlFor="weightInput" className="form-label">Peso</label>
                <input
                  type="text"
                  className={`form-control ${errors.weight ? 'is-invalid' : ''}`}
                  id="weightInput"
                  placeholder="Peso"
                  {...register('weight', {
                    required: 'El peso es obligatorio.',
                  })}
                />
                {errors.weight && <div className="invalid-feedback">{errors.weight.message}</div>}
              </div>
              <div className="col-md-6">
                <label htmlFor="sctPermitInput" className="form-label">Permiso SCT</label>
                <Controller
                  name="sctPermit"
                  control={control}
                  rules={{ required: 'El permiso SCT es obligatorio.' }}
                  render={({ field }) => (
                    <AsyncSelectInput
                      entityName="valuelists"
                      labelField="esLabel"
                      onChange={(value) => field.onChange(value._id)}
                      defaultValue={motorTransport?.sctPermit}
                      initialConditions={encodeURIComponent(JSON.stringify({ type: 'sct-permit', alive: true }))}
                      searchField='esLabel'
                      isRequired
                    />
                  )}
                />
                {errors.sctPermit && <div className="invalid-feedback">{errors.sctPermit.message}</div>}
              </div>
            </div>
            <div className="row g-3 mt-1">
              <div className="col-md-6">
                <label htmlFor="sctPermitNumberInput" className="form-label">Número de permiso SCT</label>
                <input
                  type="text"
                  className={`form-control ${errors.sctPermitNumber ? 'is-invalid' : ''}`}
                  id="sctPermitNumberInput"
                  placeholder="Número de permiso SCT"
                  {...register('sctPermitNumber', {
                    required: 'El número de permiso SCT es obligatorio.',
                  })}
                />
                {errors.sctPermitNumber && <div className="invalid-feedback">{errors.sctPermitNumber.message}</div>}
              </div>
              <div className="col-md-6">
                <label htmlFor="insuranceInput" className="form-label">Aseguradora</label>
                <input
                  type="text"
                  className={`form-control ${errors.insurance ? 'is-invalid' : ''}`}
                  id="insuranceInput"
                  placeholder="Aseguradora"
                  {...register('insurance', {
                    required: 'La aseguradora es obligatoria.',
                  })}
                />
                {errors.insurance && <div className="invalid-feedback">{errors.insurance.message}</div>}
              </div>
            </div>
            <div className="row g-3 mt-1">
              <div className="col-md-6">
                <label htmlFor="insurancePolicyInput" className="form-label">Póliza de seguro</label>
                <input
                  type="text"
                  className={`form-control ${errors.insurancePolicy ? 'is-invalid' : ''}`}
                  id="insurancePolicyInput"
                  placeholder="Póliza de seguro"
                  {...register('insurancePolicy', {
                    required: 'La póliza de seguro es obligatoria.',
                  })}
                />
                {errors.insurancePolicy && <div className="invalid-feedback">{errors.insurancePolicy.message}</div>}
              </div>
              <div className="col-md-6">
                <label htmlFor="trailerTypeInput" className="form-label">Tipo de remolque</label>
                <Controller
                  name="trailerType"
                  control={control}
                  rules={{ required: 'El tipo de remolque es obligatorio.' }}
                  render={({ field }) => (
                    <AsyncSelectInput
                      entityName="valuelists"
                      labelField="esLabel"
                      onChange={(value) => field.onChange(value._id)}
                      defaultValue={motorTransport?.trailerType}
                      initialConditions={encodeURIComponent(JSON.stringify({ type: 'trailer-type', alive: true }))}
                      searchField='esLabel'
                      isRequired
                    />
                  )}
                />
                {errors.trailerType && <div className="invalid-feedback">{errors.trailerType.message}</div>}
              </div>
            </div>
            <div className="row g-3 mt-1">
              <div className="col-md-6">
                <label htmlFor="trailerPlateInput" className="form-label">Placa del remolque</label>
                <input
                  type="text"
                  className={`form-control ${errors.trailerPlate ? 'is-invalid' : ''}`}
                  id="trailerPlateInput"
                  placeholder="Placa del remolque"
                  {...register('trailerPlate', {
                    required: 'La placa del remolque es obligatoria.',
                  })}
                />
                {errors.trailerPlate && <div className="invalid-feedback">{errors.trailerPlate.message}</div>}
              </div>
              <div className="col-md-6">
                <label htmlFor="operatorInput" className="form-label">Operador</label>
                <Controller
                  name="operator"
                  control={control}
                  rules={{ required: 'El operador es obligatorio.' }}
                  render={({ field }) => (
                    <AsyncSelectInput
                      entityName="operators"
                      labelField="name"
                      onChange={(value) => field.onChange(value._id)}
                      defaultValue={motorTransport?.operator}
                      initialConditions={encodeURIComponent(JSON.stringify({ alive: true }))}
                      searchField='name'
                      isRequired
                    />
                  )}
                />
                {errors.operator && <div className="invalid-feedback">{errors.operator.message}</div>}
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

export default MotorTransportUpdate;
