import { ICompany } from '../../model/company.model';
import GenericModal from '../../utils/Modal';
import { useForm, Controller } from 'react-hook-form';
import AsyncSelect from '../../utils/asynSelect';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { createEntity, updateEntity } from './company.reducer';
import { IValuelist } from '../../model/valuelist.model';

type CompanyUpdateProps = {
  company: ICompany | null;
  refresh: () => void;
};

const CompanyUpdate: React.FC<CompanyUpdateProps> = ({ company, refresh }) => {
  const [taxRegime, setTaxRegime] = useState<IValuelist | null>(null);
  const [taxResidence, setTaxResidence] = useState<IValuelist | null>(null);
  const dispatch = useDispatch();
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    clearErrors,
    control
  } = useForm<ICompany>({
    mode: 'onSubmit',
  });

  const onSubmit = (data: ICompany) => {
    const newCompany: ICompany = {
      ...data,
      taxRegime: taxRegime ? taxRegime._id : undefined,
      taxResidence: taxResidence ? taxResidence._id : undefined,
    }
          console.log('data ===============>', data)
    if (company) {
      dispatch(updateEntity(newCompany));
    } else {
      dispatch(createEntity(newCompany));
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
                  <label htmlFor="nameInput" className="form-label">Usuario</label>
                  <input
                    type="text"
                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                    id="nameInput"
                    {...register("name", {
                      required: "El nombre de usuario es obligatorio.",
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
                  {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
                </div>
                <div className="col-md-6">
                  <label htmlFor="rfcInput" className="form-label">RFC</label>
                  <input
                    type="text"
                    className={`form-control ${errors.rfc ? 'is-invalid' : ''}`}
                    id="rfcInput"
                    {...register("rfc", {
                      required: "El RFC es obligatorio.",
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
                      <AsyncSelect
                        {...field}
                        entityName="valuelists"
                        labelField="name"
                        filter="&type=taxRegime"
                        onChange={(value) => {
                          field.onChange(value);
                          setTaxRegime(value);
                        }}
                        defaultValue={taxRegime}
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
                        <AsyncSelect
                          {...field}
                          entityName="valuelists"
                          labelField="name"
                          filter="&type=taxResidence"
                          onChange={(value) => {
                            field.onChange(value);
                            setTaxResidence(value);
                          }}
                          defaultValue={taxResidence}
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
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">Submit</button>
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
