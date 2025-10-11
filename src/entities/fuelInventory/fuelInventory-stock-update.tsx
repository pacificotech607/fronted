import { IFuelInventory } from '../../model/fuelInventory.model';
import GenericModal from '../../utils/Modal';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { updateEntity } from './fuelInventory.reducer';
import { toast } from 'react-toastify';


type FuelEntryForm = {
    quantity: number | undefined;
    reason: string;
};

type FuelInventoryStockUpdateProps = {
    fuelInventory: IFuelInventory | null;
    refresh: () => void;
};

const FuelInventoryStockUpdate: React.FC<FuelInventoryStockUpdateProps> = ({ fuelInventory, refresh }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const {
        register,
        formState: { errors },
        handleSubmit,
        reset,
        clearErrors,
        watch,
    } = useForm<FuelEntryForm>({
        mode: 'onSubmit',
        defaultValues: {
            quantity: undefined,
            reason: ''
        }
    });

    const quantity = watch('quantity');

    const dispatch = useDispatch();
    const onSubmit = async (data: FuelEntryForm) => {
        if (!fuelInventory || !fuelInventory._id) return;
        setIsSubmitting(true);
        try {
            const previousStock = fuelInventory.currentStock || 0;
            // Usar Redux para actualizar el stock
            const entityToUpdate = {
                ...fuelInventory,
                currentStock: previousStock + (data.quantity || 0),
                // Puedes agregar otros campos si tu backend los requiere
            };
            // Llama a updateEntity (esto retorna una promesa si usas redux-promise-middleware)
            const result: any = await dispatch(updateEntity(entityToUpdate));
            const updated = result?.payload?.data?.data || entityToUpdate;
            const newStock = updated.currentStock;

            // Registrar el movimiento en el historial
            const movementData = {
                inventoryId: fuelInventory._id,
                movementType: 'entrada',
                quantity: data.quantity,
                reason: data.reason,
                previousStock: previousStock,
                newStock: newStock,
                performedBy: 'current-user' // Aquí deberías usar el ID del usuario actual
            };
            await axios.post('/api/fuel-movements', movementData);
            toast.success(`Entrada de combustible registrada: +${data.quantity}L. Nuevo stock: ${newStock}L`);
            reset({ quantity: undefined, reason: '' });
            refresh();
            // Cerrar el modal usando Bootstrap de forma nativa
            const modalElement = document.getElementById('fuelInventoryStockUpdateModal');
            if (modalElement) {
                const closeButton = modalElement.querySelector('.btn-close') as HTMLButtonElement;
                if (closeButton) closeButton.click();
            }
        } catch (error: any) {
            console.error('Error al registrar entrada:', error);
            toast.error(
                error.response?.data?.message ||
                'Error al registrar la entrada de combustible'
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        if (fuelInventory) {
            reset({
                quantity: undefined,
                reason: ''
            });
        }
        clearErrors();
    }, [fuelInventory, reset, clearErrors]);

    // Effect para resetear el formulario cada vez que se abra el modal
    useEffect(() => {
        const modalElement = document.getElementById('fuelInventoryStockUpdateModal');
        const handleModalShow = () => {
            reset({
                quantity: undefined,
                reason: ''
            });
            clearErrors();
        };
        if (modalElement) {
            modalElement.addEventListener('show.bs.modal', handleModalShow);
        }
        return () => {
            if (modalElement) {
                modalElement.removeEventListener('show.bs.modal', handleModalShow);
            }
        };
    }, [fuelInventory, reset, clearErrors]);

    const calculateNewStock = () => {
        if (!fuelInventory || !quantity) return fuelInventory?.currentStock || 0;
        
        const currentStock = fuelInventory.currentStock || 0;
        return currentStock + (quantity || 0);
    };

    return (
        <GenericModal
            id="fuelInventoryStockUpdateModal"
            title="Entrada de Combustible"
        >
            <div className="form-container">
                {fuelInventory && (
                    <div className="alert alert-info mb-3">
                        <h6 className="alert-heading">
                            <i className="bi bi-info-circle me-2"></i>
                            Información del Inventario
                        </h6>
                        <div className="row">
                            <div className="col-md-6">
                                <strong>Tipo:</strong> <span style={{ whiteSpace: 'nowrap' }}>{fuelInventory.fuelType}</span><br />
                                <strong>Tanque:</strong> <span style={{ whiteSpace: 'nowrap' }}>{fuelInventory.tanque}</span>
                            </div>
                            <div className="col-md-6">
                                <strong>Stock Actual:</strong> <span style={{ whiteSpace: 'nowrap' }}>{fuelInventory.currentStock?.toLocaleString() || 0} L</span><br />
                                <strong>Capacidad Máxima:</strong> <span style={{ whiteSpace: 'nowrap' }}>{fuelInventory.maximumCapacity?.toLocaleString() || 0} L</span>
                            </div>
                        </div>
                    </div>
                )}
                
                <form className="needs-validation" onSubmit={handleSubmit(onSubmit)}>
                    <div className="card-body">
                        <div className="row g-3">
                            <div className="col-md-12">
                                <label htmlFor="quantityInput" className="form-label">
                                    <i className="bi bi-fuel-pump me-2"></i>Cantidad (Litros)
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0.01"
                                    className={`form-control ${errors.quantity ? 'is-invalid' : ''}`}
                                    id="quantityInput"
                                    placeholder="0"
                                    {...register("quantity", {
                                        required: "La cantidad es obligatoria.",
                                        min: {
                                            value: 0.01,
                                            message: "La cantidad debe ser mayor a 0."
                                        },
                                        max: fuelInventory ? {
                                            value: (fuelInventory.maximumCapacity || 0) - (fuelInventory.currentStock || 0),
                                            message: "La cantidad excede la capacidad disponible del tanque."
                                        } : undefined,
                                        valueAsNumber: true
                                    })}
                                />
                                {errors.quantity && <div className="invalid-feedback">{errors.quantity.message}</div>}
                            </div>
                        </div>
                        
                        {/* Previsualización de la entrada */}
                        {quantity && quantity > 0 && fuelInventory && (
                            <div className="row g-3 mt-2">
                                <div className="col-md-12">
                                    <div className="alert alert-light border border-success">
                                        <h6 className="mb-2">
                                            <i className="bi bi-plus-circle-fill text-success me-2"></i>
                                            Previsualización de la Entrada
                                        </h6>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <strong>Stock Actual:</strong> {fuelInventory.currentStock?.toLocaleString() || 0} L
                                            </div>
                                            <div className="text-success">
                                                <i className="bi bi-arrow-right mx-2"></i>
                                                <strong>+{quantity?.toLocaleString() || 0} L</strong>
                                            </div>
                                            <div>
                                                <strong>Nuevo Stock:</strong> 
                                                <span className="text-success">
                                                    {calculateNewStock()?.toLocaleString() || 0} L
                                                </span>
                                            </div>
                                        </div>
                                        <div className="progress mt-2" style={{ height: '8px' }}>
                                            <div 
                                                className="progress-bar bg-success"
                                                style={{ 
                                                    width: `${Math.min(100, (calculateNewStock() / (fuelInventory.maximumCapacity || 1)) * 100)}%`
                                                }}
                                            ></div>
                                        </div>
                                        <small className="text-muted">
                                            Ocupación después de la entrada: {Math.min(100, Math.round((calculateNewStock() / (fuelInventory.maximumCapacity || 1)) * 100))}%
                                        </small>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="row g-3 mt-1">
                            <div className="col-md-12">
                                <label htmlFor="reasonInput" className="form-label">
                                    Motivo/Razón <span className="text-danger">*</span>
                                </label>
                                <textarea
                                    className={`form-control ${errors.reason ? 'is-invalid' : ''}`}
                                    id="reasonInput"
                                    rows={3}
                                    placeholder="Describe el motivo de esta entrada de combustible"
                                    {...register("reason", {
                                        required: "El motivo de la entrada es obligatorio.",
                                        minLength: {
                                            value: 5,
                                            message: "El motivo debe tener al menos 5 caracteres."
                                        },
                                        maxLength: {
                                            value: 500,
                                            message: "El motivo no puede exceder 500 caracteres."
                                        }
                                    })}
                                />
                                {errors.reason && <div className="invalid-feedback">{errors.reason.message}</div>}
                                <div className="form-text text-muted">
                                    <small>Proporciona el motivo de esta entrada para el historial</small>
                                </div>
                            </div>
                        </div>
                        
                        <br />
                        <div className="row g-3">
                            <div className="col-md-12 text-end">
                                <button
                                    style={{ marginRight: '10px' }}
                                    onClick={() => {
                                        reset({
                                            quantity: undefined,
                                            reason: ''
                                        });
                                        clearErrors();
                                    }}
                                    className="btn btn-danger"
                                    type="button"
                                    disabled={isSubmitting}
                                    data-bs-dismiss="modal"
                                >
                                    Cancelar
                                </button>
                                <button 
                                    type="submit" 
                                    className="btn btn-primary"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Registrando...' : 'Cargar combustible'}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </GenericModal>
    );
};

export default FuelInventoryStockUpdate;