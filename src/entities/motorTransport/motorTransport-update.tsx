import { IMotorTransport } from '../../model/motorTransport.model';
import GenericModal from '../../utils/Modal';
import { useForm, Controller } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import AsyncSelectInput from '../../utils/asynSelect';
import { createEntity, updateEntity } from './motorTransport.reducer';
import axios from 'axios';
import { toast } from 'react-toastify';

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
    const processedData = { ...data };

    // List of fields that could be objects and need to be replaced by their _id
    const fieldsToProcess: (keyof IMotorTransport)[] = ['configuration', 'sctPermit', 'trailerType', 'operator'];

    fieldsToProcess.forEach(field => {
      const value = processedData[field];
      if (typeof value === 'object' && value !== null && '_id' in value) {
        processedData[field] = (value as any)._id;
      }
    });

    if (motorTransport) {
      dispatch(updateEntity(processedData));
      reset();
    } else {
      dispatch(createEntity(processedData));
            reset();
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
                    validate: async number => {
                      try {
                        const query = encodeURIComponent(JSON.stringify({ number: number }));
                        const response = await axios.get<{ data: { docs: IMotorTransport[] } }>(`/api/motor-transports?query=${query}`);
                        const existing = response.data.data.docs;

                        if (motorTransport && motorTransport._id) {
                          const isDuplicate = existing.some(p => p._id !== motorTransport._id);
                          if (isDuplicate) {
                            return "El número ya existe.";
                          }
                        } else {
                          if (existing.length > 0) {
                            return "El número ya existe.";
                          }
                        }
                        return true;
                      } catch (error) {
                        toast.error("Error al validar el número.");
                        return "Error al validar el número.";
                      }
                    },
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
                    validate: async plate => {
                      try {
                        const query = encodeURIComponent(JSON.stringify({ plate: plate }));
                        const response = await axios.get<{ data: { docs: IMotorTransport[] } }>(`/api/motor-transports?query=${query}`);
                        const existing = response.data.data.docs;

                        if (motorTransport && motorTransport._id) {
                          const isDuplicate = existing.some(p => p._id !== motorTransport._id);
                          if (isDuplicate) {
                            return "La placa ya existe.";
                          }
                        } else {
                          if (existing.length > 0) {
                            return "La placa ya existe.";
                          }
                        }
                        return true;
                      } catch (error) {
                        toast.error("Error al validar la placa.");
                        return "Error al validar la placa.";
                      }
                    },
                  })}
                />
                {errors.plate && <div className="invalid-feedback">{errors.plate.message}</div>}
              </div>
              <div className="col-md-6">
                <label htmlFor="yearInput" className="form-label">Año</label>
                <select
                  className={`form-control ${errors.year ? 'is-invalid' : ''}`}
                  id="yearInput"
                  {...register('year', {
                    required: 'El año es obligatorio.',
                  })}
                >
                  <option value="">Seleccione un año</option>
                  {Array.from(new Array(50), (val, index) => new Date().getFullYear() - index).map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
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
