import { IFuelInventory, FUEL_TYPES } from '../../model/fuelInventory.model';
import GenericModal from '../../utils/Modal';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createEntity, updateEntity, getEntities } from './fuelInventory.reducer';

type FuelInventoryUpdateProps = {
    fuelInventory: IFuelInventory | null;
    refresh: () => void;
};

const FuelInventoryUpdate: React.FC<FuelInventoryUpdateProps> = ({ fuelInventory, refresh }) => {
    const dispatch = useDispatch();
    const {
        register,
        formState: { errors },
        handleSubmit,
        reset,
        clearErrors,
    } = useForm<IFuelInventory>({
        mode: 'onChange',
    });

    const onSubmit = (data: IFuelInventory) => {
        const processedData = { ...data };

        // Ensure numeric fields are properly formatted
        processedData.currentStock = Number(processedData.currentStock) || 0;
        processedData.minimumLevel = Number(processedData.minimumLevel) || 0;
        processedData.maximumCapacity = Number(processedData.maximumCapacity) || 0;
        
        // Always set isActive to true by default
        processedData.isActive = true;

        if (fuelInventory) {
            dispatch(updateEntity({ ...processedData, _id: fuelInventory._id }));
            reset();
        } else {
            dispatch(createEntity(processedData));
            reset();
        }
        refresh();
    };

    useEffect(() => {
        if (fuelInventory) {
            reset(fuelInventory);
        } else {
            reset({
                fuelType: '',
                currentStock: 0,
                minimumLevel: 100,
                maximumCapacity: 10000,
                tanque: '',
            });
        }
        clearErrors();
    }, [fuelInventory, reset, clearErrors]);

    return (
        <GenericModal
            id="fuelInventoryUpdateModal"
            title={fuelInventory ? "Editar Inventario de Combustible" : "Crear Inventario de Combustible"}
        >
            <div className="form-container">
                <div className="form-container">
                    <form className="needs-validation" onSubmit={handleSubmit(onSubmit)}>
                        <div className="card-body">
                            <div className="row g-3">
                                <div className="col-12">
                                    <label htmlFor="fuelTypeInput" className="form-label">Tipo de Combustible</label>
                                    <select
                                        className={`form-control ${errors.fuelType ? 'is-invalid' : ''}`}
                                        id="fuelTypeInput"
                                        {...register("fuelType", {
                                            required: "El tipo de combustible es obligatorio.",
                                            validate: async (fuelType, formValues) => {
                                                try {
                                                    const tanque = formValues.tanque;
                                                    if (!fuelType || !tanque || tanque.length < 3) return true;

                                                    const query = encodeURIComponent(JSON.stringify({
                                                        fuelType: fuelType,
                                                        tanque: tanque,
                                                        alive: true
                                                    }));
                                                    
                                                    const response: any = await dispatch(getEntities(0, 1, query));
                                                    const existing = response.payload.data.data.docs;

                                                    if (fuelInventory && fuelInventory._id) {
                                                        const isDuplicate = existing.some((p: IFuelInventory) => p._id !== fuelInventory._id);
                                                        if (isDuplicate) {
                                                            return `Ya existe un inventario de ${fuelType} en el tanque ${tanque}.`;
                                                        }
                                                    } else {
                                                        if (existing.length > 0) {
                                                            return `Ya existe un inventario de ${fuelType} en el tanque ${tanque}.`;
                                                        }
                                                    }
                                                    return true;
                                                } catch (error) {
                                                    console.error("Error validating fuelType/tanque combination:", error);
                                                    return true;
                                                }
                                            }
                                        })}
                                    >
                                        <option value="">Selecciona un tipo</option>
                                        {FUEL_TYPES.map(type => (
                                            <option key={type.value} value={type.value}>
                                                {type.label}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.fuelType && <div className="invalid-feedback">{errors.fuelType.message}</div>}
                                </div>
                            </div>
                            <div className="row g-3 mt-1">
                                <div className="col-12">
                                    <label htmlFor="tanqueInput" className="form-label">Tanque</label>
                                    <input
                                        type="text"
                                        className={`form-control ${errors.tanque ? 'is-invalid' : ''}`}
                                        id="tanqueInput"
                                        placeholder="Nombre del tanque"
                                        {...register("tanque", {
                                            required: "El tanque es obligatorio.",
                                            minLength: {
                                                value: 3,
                                                message: "El tanque debe tener al menos 3 caracteres."
                                            },
                                            maxLength: {
                                                value: 200,
                                                message: "El tanque no puede exceder 200 caracteres."
                                            },
                                            validate: async tanque => {
                                                if (!tanque || tanque.length < 3) {
                                                    return true;
                                                }

                                                try {
                                                    const query = encodeURIComponent(JSON.stringify({ tanque: tanque, alive: true }));
                                                    const response: any = await dispatch(getEntities(0, 1, query));
                                                    const existing = response.payload.data.data.docs;

                                                    if (fuelInventory && fuelInventory._id) {
                                                        const isDuplicate = existing.some((p: IFuelInventory) => p._id !== fuelInventory._id);
                                                        if (isDuplicate) {
                                                            return "Ya existe un inventario en este tanque.";
                                                        }
                                                    } else {
                                                        if (existing.length > 0) {
                                                            return "Ya existe un inventario en este tanque.";
                                                        }
                                                    }
                                                    return true;
                                                } catch (error) {
                                                    console.error("Error validating tanque:", error);
                                                    return true;
                                                }
                                            }
                                        })}
                                    />
                                    {errors.tanque && <div className="invalid-feedback">{errors.tanque.message}</div>}
                                </div>
                            </div>
                            <div className="row g-3 mt-1">
                                <div className="col-12">
                                    <label htmlFor="currentStockInput" className="form-label">Stock Actual (Litros)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        className={`form-control ${errors.currentStock ? 'is-invalid' : ''}`}
                                        id="currentStockInput"
                                        placeholder="Stock actual en litros"
                                        {...register("currentStock", {
                                            required: "El stock actual es obligatorio.",
                                            min: {
                                                value: 0,
                                                message: "El stock actual no puede ser negativo."
                                            },
                                            max: {
                                                value: 999999,
                                                message: "El stock actual no puede exceder 999,999 litros."
                                            },
                                            valueAsNumber: true,
                                            validate: (value, formValues) => {
                                                const maxCapacity = Number(formValues.maximumCapacity) || 0;
                                                if (maxCapacity > 0 && value > maxCapacity) {
                                                    return "El stock actual no puede exceder la capacidad máxima del tanque.";
                                                }
                                                return true;
                                            }
                                        })}
                                    />
                                    {errors.currentStock && <div className="invalid-feedback">{errors.currentStock.message}</div>}
                                </div>
                            </div>
                            <div className="row g-3 mt-1">
                                <div className="col-12">
                                    <label htmlFor="minimumLevelInput" className="form-label">Nivel Mínimo (Litros)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        className={`form-control ${errors.minimumLevel ? 'is-invalid' : ''}`}
                                        id="minimumLevelInput"
                                        placeholder="Nivel mínimo de alerta"
                                        {...register("minimumLevel", {
                                            required: "El nivel mínimo es obligatorio.",
                                            min: {
                                                value: 0,
                                                message: "El nivel mínimo no puede ser negativo."
                                            },
                                            max: {
                                                value: 999999,
                                                message: "El nivel mínimo no puede exceder 999,999 litros."
                                            },
                                            valueAsNumber: true,
                                            validate: (value, formValues) => {
                                                const maxCapacity = Number(formValues.maximumCapacity) || 0;
                                                if (maxCapacity > 0 && value >= maxCapacity) {
                                                    return "El nivel mínimo debe ser menor que la capacidad máxima.";
                                                }
                                                return true;
                                            }
                                        })}
                                    />
                                    {errors.minimumLevel && <div className="invalid-feedback">{errors.minimumLevel.message}</div>}
                                    <div className="form-text text-muted">
                                        <small>Se activará alerta cuando el stock esté por debajo de este nivel</small>
                                    </div>
                                </div>
                            </div>
                            <div className="row g-3 mt-1">
                                <div className="col-12">
                                    <label htmlFor="maximumCapacityInput" className="form-label">Capacidad Máxima (Litros)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="1"
                                        className={`form-control ${errors.maximumCapacity ? 'is-invalid' : ''}`}
                                        id="maximumCapacityInput"
                                        placeholder="Capacidad máxima del tanque"
                                        {...register("maximumCapacity", {
                                            required: "La capacidad máxima es obligatoria.",
                                            min: {
                                                value: 1,
                                                message: "La capacidad máxima debe ser mayor a 0."
                                            },
                                            max: {
                                                value: 9999999,
                                                message: "La capacidad máxima no puede exceder 9,999,999 litros."
                                            },
                                            valueAsNumber: true
                                        })}
                                    />
                                    {errors.maximumCapacity && <div className="invalid-feedback">{errors.maximumCapacity.message}</div>}
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

export default FuelInventoryUpdate;
