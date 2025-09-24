import { IBLS } from '../../model/bls.model';
import GenericModal from '../../utils/Modal';
import { useForm, Controller } from 'react-hook-form';
import AsyncSelectInput from '../../utils/asynSelect';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateEntity } from '../../entities/bls/bls.reducer';
import { toast } from 'react-toastify';
import { IMotorTransport } from '../../model/motorTransport.model';
import { IOperator } from '../../model/operator.model';
import { IValuelist } from '../../model/valuelist.model';
import { statusBls } from '../../constants/bls.constans';

type AssignTripsUnitProps = {
  bls: IBLS | null;
  refresh: () => void;
};

interface IAssignTripsUnitForm {
    motorTransport?: IMotorTransport;
    operator?: IOperator;
    origin?: IValuelist;
    destination?: IValuelist;
    departureDate?: string;
    distanceTraveled?: string;
}

const AssignTripsUnit: React.FC<AssignTripsUnitProps> = ({ bls, refresh }) => {
  const dispatch = useDispatch();
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    clearErrors,
    control,
  } = useForm<IAssignTripsUnitForm>({
    mode: 'onChange',
  });

  const onSubmit = (data: IAssignTripsUnitForm) => {
    if (bls) {
        const processedData = { 
            ...bls,
            ...data,
            status: statusBls.assignedTrip.value
        };

        const fieldsToProcess: (keyof IBLS)[] = ['motorTransport', 'operator', 'origin', 'destination', 'typeLoad', 'origin'];

        fieldsToProcess.forEach(field => {
            const value = processedData[field];
            if (typeof value === 'object' && value !== null && '_id' in value) {
                (processedData as any)[field] = (value as any)._id;
            }
        });
        
      dispatch(updateEntity(processedData));
      toast.success(`BL ${bls.bl} actualizado con exito`);
      reset();
    } 
    refresh();
  };

  useEffect(() => {
    if (bls) {
      reset({
        motorTransport: bls.motorTransport,
        operator: bls.operator,
        departureDate: bls.departureDate,
        origin: bls.origin,
        destination: bls.destination,
        distanceTraveled: bls.distanceTraveled
      });
    } else {
      reset({});
    }
    clearErrors();
  }, [bls, reset, clearErrors]);

  return (
    <GenericModal id="blsAssignTripsModal" title="Asignar unidad a viaje">
      <div className="form-container">
        <div className="form-container">
          <form className="needs-validation" onSubmit={handleSubmit(onSubmit)}>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-12">
                  <label htmlFor="motorTransportInput" className="form-label">Transporte</label>
                  <Controller
                    name="motorTransport"
                    control={control}
                    rules={{ required: 'Por favor, selecciona un transporte.' }}
                    render={({ field }) => (
                      <AsyncSelectInput
                        entityName="motor-transports"
                        labelField="number"
                        searchField="number"
                        onChange={field.onChange}
                        defaultValue={bls?.motorTransport}
                        initialConditions={encodeURIComponent(JSON.stringify({ alive: true }))}
                        isRequired
                      />
                    )}
                  />
                  {errors.motorTransport && <div className="invalid-feedback">{errors.motorTransport.message}</div>}
                </div>
                <div className="col-md-12">
                  <label htmlFor="operatorInput" className="form-label">Operador</label>
                  <Controller
                    name="operator"
                    control={control}
                    rules={{ required: 'Por favor, selecciona un operador.' }}
                    render={({ field }) => (
                      <AsyncSelectInput
                        entityName="operators"
                        labelField="name"
                        searchField="name"
                        onChange={field.onChange}
                        defaultValue={bls?.operator}
                        initialConditions={encodeURIComponent(JSON.stringify({ alive: true }))}
                        isRequired
                      />
                    )}
                  />
                  {errors.operator && <div className="invalid-feedback">{errors.operator.message}</div>}
                </div>
                <div className="col-md-12">
                  <label htmlFor="originInput" className="form-label">Origen</label>
                  <Controller
                    name="origin"
                    control={control}
                    rules={{ required: 'Por favor, selecciona un origen.' }}
                    render={({ field }) => (
                      <AsyncSelectInput
                        entityName="valuelists"
                        labelField="esLabel"
                        searchField="esLabel"
                        onChange={field.onChange}
                        defaultValue={bls?.origin}
                        isRequired
                        initialConditions={encodeURIComponent(JSON.stringify({ type: 'bls-origin', alive: true }))}
                      />
                    )}
                  />
                  {errors.origin && <div className="invalid-feedback">{errors.origin.message}</div>}
                </div>
                <div className="col-md-12">
                  <label htmlFor="destinationInput" className="form-label">Destino</label>
                  <Controller
                    name="destination"
                    control={control}
                    rules={{ required: 'Por favor, selecciona un destino.' }}
                    render={({ field }) => (
                      <AsyncSelectInput
                        entityName="valuelists"
                        labelField="esLabel"
                        searchField="esLabel"
                        onChange={field.onChange}
                        defaultValue={bls?.destination}
                        isRequired
                        initialConditions={encodeURIComponent(JSON.stringify({ type: 'bls-destination', alive: true }))}
                      />
                    )}
                  />
                  {errors.destination && <div className="invalid-feedback">{errors.destination.message}</div>}
                </div>
                <div className="col-md-12">
                  <label htmlFor="departureDateInput" className="form-label">Fecha</label>
                  <input
                    type="date"
                    className={`form-control ${errors.departureDate ? 'is-invalid' : ''}`}
                    id="departureDateInput"
                    {...register("departureDate", {
                      required: "La fecha y hora de llegada es obligatoria.",
                    })}
                  />
                  {errors.departureDate && <div className="invalid-feedback">{errors.departureDate.message}</div>}
                </div>
                <div className="col-md-12">
                  <label htmlFor="distanceTraveledInput" className="form-label">Distancia Recorrida</label>
                  <input
                    type="text"
                    className={`form-control ${errors.distanceTraveled ? 'is-invalid' : ''}`}
                    id="distanceTraveledInput"
                    {...register("distanceTraveled", {
                      required: "La distancia recorrida es obligatoria.",
                    })}
                  />
                  {errors.distanceTraveled && <div className="invalid-feedback">{errors.distanceTraveled.message}</div>}
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
                  <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">
                    Guardar
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </GenericModal>
  );
};

export default AssignTripsUnit;
