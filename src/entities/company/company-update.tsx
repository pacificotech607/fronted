import { ICompany } from '../../model/company.model';
import GenericModal from '../../utils/Modal';
import { useForm, Controller } from 'react-hook-form';
import AsyncSelectInput from '../../utils/asynSelect';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createEntity, updateEntity } from './company.reducer';
import axios from 'axios';
import { toast } from 'react-toastify';

type CompanyUpdateProps = {
  company: ICompany | null;
  refresh: () => void;
};

const CompanyUpdate: React.FC<CompanyUpdateProps> = ({ company, refresh }) => {
  const dispatch = useDispatch();
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    clearErrors,
    control,
  } = useForm<ICompany>({
    mode: 'onChange',
  });

  const onSubmit = (data: ICompany) => {
    const processedData = { ...data };

    // List of fields that could be objects and need to be replaced by their _id
    const fieldsToProcess: (keyof ICompany)[] = ['taxRegime', 'taxResidence'];

    fieldsToProcess.forEach(field => {
      const value = processedData[field];
      if (typeof value === 'object' && value !== null && '_id' in value) {
        processedData[field] = (value as any)._id;
      }
    });

    if (company) {
      dispatch(updateEntity(processedData));
      reset();
    } else {
      dispatch(createEntity(processedData));
            reset();
    }
    refresh();
  };

  useEffect(() => {
    if (company) {
      reset(company);
    } else {
      reset({});
    }
    clearErrors();
  }, [company, reset, clearErrors]);

  return (
    <GenericModal id="companyUpdateModal" title="Crear nueva empresa">
      <div className="form-container">
        <div className="form-container">
          <form className="needs-validation" onSubmit={handleSubmit(onSubmit)}>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <label htmlFor="nameInput" className="form-label">Nombre</label>
                  <input
                    type="text"
                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                    id="nameInput"
                    placeholder="Usuario"
                    {...register("name", {
                      required: "El nombre de usuario es obligatorio.",
                      minLength: {
                        value: 3,
                        message: "El nombre debe tener al menos 3 caracteres."
                      },
                      maxLength: {
                        value: 20,
                        message: "El nombre no puede exceder los 20 caracteres."
                      },
                      validate: async name => {
                        try {
                          const query = encodeURIComponent(JSON.stringify({ name: name }));
                          const response = await axios.get<{ data: { docs: ICompany[] } }>(`/api/companies?query=${query}`);
                          const existing = response.data.data.docs;

                          if (company && company._id) {
                            // This is an update
                            const isDuplicate = existing.some(p => p._id !== company._id);
                            if (isDuplicate) {
                              return "El nombre de la compañia ya existe.";
                            }
                          } else {
                            // This is a creation
                            if (existing.length > 0) {
                              return "El nombre de la compañia ya existe.";
                            }
                          }
                          return true;
                        } catch (error) {
                          toast.error("Error al validar el nombre de la compañia.");
                          return "Error al validar el nombre de la compañia.";
                        }
                      }
                    })}
                  />
                  {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
                </div>
                <div className="col-md-6">
                  <label htmlFor="rfcInput" className="form-label">RFC</label>
                  <input
                    type="text"
                    className={`form-control ${errors.rfc ? 'is-invalid' : ''}`}
                    id="rfcInput"
                    placeholder="RFC"
                    {...register("rfc", {
                      required: "El RFC es obligatorio.",
                      minLength: {
                        value: 3,
                        message: "El nombre debe tener al menos 3 caracteres."
                      },
                      maxLength: {
                        value: 20,
                        message: "El nombre no puede exceder los 20 caracteres."
                      },
                      validate: async rfc => {
                        try {
                          const query = encodeURIComponent(JSON.stringify({ rfc: rfc }));
                          const response = await axios.get<{ data: { docs: ICompany[] } }>(`/api/companies?query=${query}`);
                          const existing = response.data.data.docs;

                          if (company && company._id) {
                            // This is an update
                            const isDuplicate = existing.some(p => p._id !== company._id);
                            if (isDuplicate) {
                              return "El rfc de la compañia ya existe.";
                            }
                          } else {
                            // This is a creation
                            if (existing.length > 0) {
                              return "El rfc de la compañia ya existe.";
                            }
                          }
                          return true;
                        } catch (error) {
                          toast.error("Error al validar el rfc de la compañia.");
                          return "Error al validar el rfc de la compañia.";
                        }
                      }
                    })}
                  />
                  {errors.rfc && <div className="invalid-feedback">{errors.rfc.message}</div>}
                </div>
              </div>
              <div className="row g-3">
                <div className="col-md-6">
                  <label htmlFor="taxRegimeInput" className="form-label">Regimen fiscal</label>
                  <Controller
                    name="taxRegime"
                    control={control}
                    rules={{ required: 'Por favor, selecciona un puesto.' }}
                    render={({ field }) => (
                      <AsyncSelectInput
                        entityName="valuelists"
                        labelField="esLabel"
                        searchField="esLabel"
                        onChange={value => field.onChange(value._id)}
                        defaultValue={company?.taxRegime}
                        initialConditions={encodeURIComponent(JSON.stringify({ type: 'tax-Regime', alive: true }))}
                        isRequired
                      />
                    )}
                  />
                  {errors.taxRegime && <div className="invalid-feedback">{errors.taxRegime.message}</div>}
                </div>
                <div className="col-md-6">
                  <label htmlFor="taxRegistrationNoInput" className="form-label">No. de Registro Tributario</label>
                  <input
                    type="text"
                    className={`form-control ${errors.taxRegistrationNo ? 'is-invalid' : ''}`}
                    id="taxRegistrationNoInput"
                    placeholder="No. de Registro Tributario"
                    {...register("taxRegistrationNo", {
                      required: "El No. de Registro Tributario es obligatorio.",
                      minLength: {
                        value: 3,
                        message: "El nombre debe tener al menos 3 caracteres."
                      },
                      maxLength: {
                        value: 20,
                        message: "El nombre no puede exceder los 20 caracteres."
                      }
                    })}
                  />
                  {errors.taxRegistrationNo && <div className="invalid-feedback">{errors.taxRegistrationNo.message}</div>}
                </div>
                <div className="row g-3">
                  <div className="col-md-12">
                    <label htmlFor="taxResidenceInput" className="form-label">Residencia Fiscal</label>
                    <Controller
                      name="taxResidence"
                      control={control}
                      rules={{ required: 'Por favor, selecciona un puesto.' }}
                      render={({ field }) => (
                        <AsyncSelectInput
                          entityName="valuelists"
                          labelField="esLabel"
                          searchField="esLabel"
                          onChange={value => field.onChange(value._id)}
                          defaultValue={company?.taxResidence}
                          initialConditions={encodeURIComponent(JSON.stringify({ type: 'tax-Residence', alive: true }))}
                          isRequired
                        />
                      )}
                    />
                    {errors.taxResidence && <div className="invalid-feedback">{errors.taxResidence.message}</div>}
                  </div>
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

export default CompanyUpdate;
