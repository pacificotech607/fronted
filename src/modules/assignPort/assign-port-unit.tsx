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
import { statusBls } from '../../constants/bls.constans';

type AssignPortUnitProps = {
  bls: IBLS | null;
  refresh: () => void;
};

interface IAssignPortUnitForm {
    motorTransport?: IMotorTransport;
    operator?: IOperator;
    dateTimeArrivalPort?: string;
}

const AssignPortUnit: React.FC<AssignPortUnitProps> = ({ bls, refresh }) => {
  const dispatch = useDispatch();
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    clearErrors,
    control,
  } = useForm<IAssignPortUnitForm>({
    mode: 'onChange',
  });

  const onSubmit = (data: IAssignPortUnitForm) => {
    if (bls) {
        const processedData = { 
            ...bls,
            ...data,
            status: statusBls.assignedPort.value
        };

        const fieldsToProcess: (keyof IBLS)[] = ['motorTransport', 'operator', 'destination', 'typeLoad'];

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
        dateTimeArrivalPort: bls.dateTimeArrivalPort
      });
    } else {
      reset({});
    }
    clearErrors();
  }, [bls, reset, clearErrors]);

  return (
    <GenericModal id="blsAssignPortModal" title="Asignar unidad a puerto">
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
                        isRequired
                      />
                    )}
                  />
                  {errors.operator && <div className="invalid-feedback">{errors.operator.message}</div>}
                </div>
                <div className="col-md-12">
                  <label htmlFor="dateTimeArrivalPortInput" className="form-label">Fecha y hora de llegada a puerto</label>
                  <input
                    type="datetime-local"
                    className={`form-control ${errors.dateTimeArrivalPort ? 'is-invalid' : ''}`}
                    id="dateTimeArrivalPortInput"
                    {...register("dateTimeArrivalPort", {
                      required: "La fecha y hora de llegada es obligatoria.",
                    })}
                  />
                  {errors.dateTimeArrivalPort && <div className="invalid-feedback">{errors.dateTimeArrivalPort.message}</div>}
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

export default AssignPortUnit;
