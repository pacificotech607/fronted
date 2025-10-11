import { IFuel } from '../../model/fuel.model';
import GenericModal from '../../utils/Modal';
import { useForm, Controller } from 'react-hook-form';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import AsyncSelectInput from '../../utils/asynSelect';
import { createEntity, updateEntity } from './fuel.reducer';

type FuelUpdateProps = {
    fuel: IFuel | null;
    refresh: () => void;
};

const FuelUpdate: React.FC<FuelUpdateProps> = ({ fuel, refresh }) => {
    const dispatch = useDispatch();
    const {
        register,
        formState: { errors },
        handleSubmit,
        reset,
        clearErrors,
        control,
        watch,
        setValue,
    } = useForm<IFuel>({
        mode: 'onSubmit',
    });

    // Watch the values for automatic calculation
    const dieselInitial = watch('dieselInitial');
    const dieselLoaded = watch('dieselLoaded');

    const onSubmit = (data: IFuel) => {
        const processedData = { ...data };

        // List of fields that could be objects and need to be replaced by their _id
        const fieldsToProcess: (keyof IFuel)[] = ['transport', 'operator', 'tabulator'];

        fieldsToProcess.forEach(field => {
            const value = processedData[field];
            if (typeof value === 'object' && value !== null && '_id' in value) {
                processedData[field] = (value as any)._id;
            }
        });

        if (fuel) {
            dispatch(updateEntity(processedData));
            reset();
        } else {
            dispatch(createEntity(processedData));
                      reset();
        }
        refresh();
    };

    useEffect(() => {
        if (fuel) {
            reset(fuel);
        } else {
            // Set current date as default for new fuel records
            const currentDate = new Date().toISOString().split('T')[0];
            reset({
                fuelDate: currentDate
            });
        }
        clearErrors();
    }, [fuel, reset, clearErrors]);

    // Calculate Diesel Retorno automatically
    useEffect(() => {
        const initialValue = parseFloat(dieselInitial?.toString() || '0');
        const loadedValue = parseFloat(dieselLoaded?.toString() || '0');
        const calculatedReturn = initialValue + loadedValue;
        
        setValue('dieselReturn', calculatedReturn);
    }, [dieselInitial, dieselLoaded, setValue]);

    return (
        <GenericModal
            id="fuelUpdateModal"
            title="Crear nuevo registro de combustible"
        >
            <div className="form-container">
                <form className="needs-validation" onSubmit={handleSubmit(onSubmit)}>
                    <div className="card-body">
                        <div className="row g-3">
                            <div className="col-md-6">
                                <label htmlFor="transportInput" className="form-label">Transporte</label>
                                <Controller
                                    name="transport"
                                    control={control}
                                    rules={{ required: 'Por favor, selecciona un transporte.' }}
                                    render={({ field }) => (
                                        <AsyncSelectInput
                                            entityName="motor-transports"
                                            labelField="number"
                                            searchField="number"
                                            onChange={value => field.onChange(value._id)}
                                            defaultValue={fuel?.transport}
                                            initialConditions={encodeURIComponent(JSON.stringify({ alive: true }))}
                                            isRequired
                                        />
                                    )}
                                />
                                {errors.transport && <div className="invalid-feedback">{errors.transport.message}</div>}
                            </div>
                            <div className="col-md-6">
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
                                            onChange={value => field.onChange(value._id)}
                                            defaultValue={fuel?.operator}
                                            initialConditions={encodeURIComponent(JSON.stringify({ alive: true }))}
                                            isRequired
                                        />
                                    )}
                                />
                                {errors.operator && <div className="invalid-feedback">{errors.operator.message}</div>}
                            </div>
                        </div>
                        <div className="row g-3 mt-1">
                            <div className="col-md-6">
                                <label htmlFor="dieselInitialInput" className="form-label">Diesel Inicial</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    className={`form-control ${errors.dieselInitial ? 'is-invalid' : ''}`}
                                    id="dieselInitialInput"
                                    placeholder="Diesel Inicial"
                                    {...register("dieselInitial", {
                                        required: "El diesel inicial es obligatorio.",
                                        min: {
                                            value: 0,
                                            message: "El diesel inicial debe ser mayor o igual a 0."
                                        }
                                    })}
                                />
                                {errors.dieselInitial && <div className="invalid-feedback">{errors.dieselInitial.message}</div>}
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="dieselLoadedInput" className="form-label">Diesel Cargado</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    className={`form-control ${errors.dieselLoaded ? 'is-invalid' : ''}`}
                                    id="dieselLoadedInput"
                                    placeholder="Diesel Cargado"
                                    {...register("dieselLoaded", {
                                        required: "El diesel cargado es obligatorio.",
                                        min: {
                                            value: 0,
                                            message: "El diesel cargado debe ser mayor o igual a 0."
                                        }
                                    })}
                                />
                                {errors.dieselLoaded && <div className="invalid-feedback">{errors.dieselLoaded.message}</div>}
                            </div>
                        </div>
                        <div className="row g-3 mt-1">
                            <div className="col-md-6">
                                <label htmlFor="dieselReturnInput" className="form-label">Diesel Retorno</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    className="form-control"
                                    id="dieselReturnInput"
                                    placeholder="Diesel Retorno (Calculado automáticamente)"
                                    disabled
                                    {...register("dieselReturn")}
                                />
                                <div className="form-text text-muted">
                                    <small>Se calcula automáticamente sumando Diesel Inicial + Diesel Cargado</small>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="tabulatorInput" className="form-label">Tabulador</label>
                                <Controller
                                    name="tabulator"
                                    control={control}
                                    rules={{ required: 'Por favor, selecciona un tabulador.' }}
                                    render={({ field }) => (
                                        <AsyncSelectInput
                                            entityName="tabs"
                                            labelField="description"
                                            searchField="description"
                                            onChange={value => field.onChange(value._id)}
                                            defaultValue={fuel?.tabulator}
                                            initialConditions={encodeURIComponent(JSON.stringify({ alive: true }))}
                                            isRequired
                                        />
                                    )}
                                />
                                {errors.tabulator && <div className="invalid-feedback">{errors.tabulator.message}</div>}
                            </div>
                        </div>
                        <div className="row g-3 mt-1">
                            <div className="col-md-6">
                                <label htmlFor="pricePerLiterInput" className="form-label">Precio por Litro</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    className={`form-control ${errors.pricePerLiter ? 'is-invalid' : ''}`}
                                    id="pricePerLiterInput"
                                    placeholder="Precio por Litro"
                                    {...register("pricePerLiter", {
                                        required: "El precio por litro es obligatorio.",
                                        min: {
                                            value: 0,
                                            message: "El precio por litro debe ser mayor a 0."
                                        }
                                    })}
                                />
                                {errors.pricePerLiter && <div className="invalid-feedback">{errors.pricePerLiter.message}</div>}
                            </div>
                                                        <div className="col-md-6">
                                <label htmlFor="fuelDateInput" className="form-label">Fecha de Combustible</label>
                                <input
                                    type="date"
                                    className={`form-control ${errors.fuelDate ? 'is-invalid' : ''}`}
                                    id="fuelDateInput"
                                    defaultValue={!fuel ? new Date().toISOString().split('T')[0] : undefined}
                                    {...register("fuelDate", {
                                        required: "La fecha de combustible es obligatoria."
                                    })}
                                />
                                {errors.fuelDate && <div className="invalid-feedback">{errors.fuelDate.message}</div>}
                            </div>
                        </div>
                        <div className="row g-3 mt-1">
                            <div className="col-md-12">
                                <label htmlFor="typeFuelInput" className="form-label">Tipo de Combustible</label>
                                <select
                                    className={`form-control ${errors.typeFuel ? 'is-invalid' : ''}`}
                                    id="typeFuelInput"
                                    {...register("typeFuel", {
                                        required: "El tipo de combustible es obligatorio."
                                    })}
                                >
                                    <option value="">Selecciona un tipo</option>
                                    <option value="Diesel">Diesel</option>
                                    <option value="Gasolina">Gasolina</option>
                                    <option value="Gas Natural">Gas Natural</option>
                                </select>
                                {errors.typeFuel && <div className="invalid-feedback">{errors.typeFuel.message}</div>}
                            </div>
                            </div>
                             <div className="row g-3 mt-1">
                            <div className="col-md-12">
                                <label htmlFor="observationsInput" className="form-label">Observaciones</label>
                                <textarea
                                    className={`form-control ${errors.observations ? 'is-invalid' : ''}`}
                                    id="observationsInput"
                                    rows={3}
                                    placeholder="Observaciones"
                                    {...register("observations", {
                                        maxLength: {
                                            value: 500,
                                            message: "Las observaciones no pueden exceder los 500 caracteres."
                                        }
                                    })}
                                />
                                {errors.observations && <div className="invalid-feedback">{errors.observations.message}</div>}
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

export default FuelUpdate;