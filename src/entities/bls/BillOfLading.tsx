import { Control, Controller } from "react-hook-form";
import AsyncSelectInput from "../../utils/asynSelect";
import { IBLS } from "../../model/bls.model";

interface BillOfLadingProps {
  errors: { [x: string]: any };
  onNext: () => void;
  register: any;
  control: Control<any>;
  bls: IBLS | null;
}

const BillOfLading = ({ errors, onNext, register, control, bls }: BillOfLadingProps) => {
  // guía de carga
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <i className="bi bi-receipt-cutoff" style={{ color: '#0dcaf0', fontSize: '3rem', marginRight: '10px' }}></i>
        <h3>Guía de carga</h3>
      </div>
      <div className="row g-3">
        <div className="col-md-4">
          <label htmlFor="customer" className="form-label">Cliente</label>
          <input
            type="text"
            className={`form-control ${errors.customer ? 'is-invalid' : ''}`}
            id="customer"
            placeholder="Cliente"
            {...register("customer", {
              required: "Customer is required."
            })}
          />
          {errors.customer && <div className="invalid-feedback">{errors.customer.message}</div>}
        </div>
        <div className="col-md-4">
          <label htmlFor="bl" className="form-label">BL</label>
          <input
            type="text"
            className={`form-control ${errors.bl ? 'is-invalid' : ''}`}
            id="bl"
            placeholder="BL"
            {...register("bl", {
              required: "BL is required."
            })}
          />
          {errors.bl && <div className="invalid-feedback">{errors.bl.message}</div>}
        </div>
        <div className="col-md-4">
          <label htmlFor="vessel" className="form-label">Buque</label>
          <input
            type="text"
            className={`form-control ${errors.vessel ? 'is-invalid' : ''}`}
            id="vessel"
            placeholder="Buque"
            {...register("vessel", {
              required: "Vessel is required."
            })}
          />
          {errors.vessel && <div className="invalid-feedback">{errors.vessel.message}</div>}
        </div>
      </div>
      <div className="row g-3 mt-3">
        <div className="col-md-4">
          <label htmlFor="destination" className="form-label">Destino</label>
          <Controller
            name="destination"
            control={control}
            rules={{ required: 'Por favor, selecciona un destino.' }}
            render={({ field }) => (
              <AsyncSelectInput
                entityName="valuelists"
                labelField="esLabel"
                searchField="esLabel"
                onChange={value => field.onChange(value._id)}
                defaultValue={bls?.destination}
                initialConditions={encodeURIComponent(JSON.stringify({ type: 'bls-destination', alive: true }))}
                isRequired
              />
            )}
          />
          {errors.taxRegime && <div className="invalid-feedback">{errors.taxRegime.message}</div>}
        </div>
        <div className="col-md-4">
          <label htmlFor="petition" className="form-label">Pedimento</label>
          <input
            type="text"
            className={`form-control ${errors.petition ? 'is-invalid' : ''}`}
            id="petition"
            placeholder="Pedimento"
            {...register("petition", {
              required: "Petition is required."
            })}
          />
          {errors.petition && <div className="invalid-feedback">{errors.petition.message}</div>}
        </div>
        <div className="col-md-4">
          <label htmlFor="eta" className="form-label">ETA</label>
          <input
            type="date"
            className={`form-control ${errors.eta ? 'is-invalid' : ''}`}
            id="eta"
            placeholder="ETA"
            {...register("eta", {
              required: "ETA is required."
            })}
          />
          {errors.eta && <div className="invalid-feedback">{errors.eta.message}</div>}
        </div>
      </div>
      <div className="row g-3 mt-3">
        <div className="col-md-4">
          <label htmlFor="invoice" className="form-label">Factura</label>
          <input
            type="text"
            className={`form-control ${errors.invoice ? 'is-invalid' : ''}`}
            id="invoice"
            placeholder="Factura"
            {...register("invoice", {
              required: "Invoice is required."
            })}
          />
          {errors.invoice && <div className="invalid-feedback">{errors.invoice.message}</div>}
        </div>
        <div className="col-md-4">
          <label htmlFor="materialOz" className="form-label">Material Oz</label>
          <input
            type="text"
            className={`form-control ${errors.materialOz ? 'is-invalid' : ''}`}
            id="materialOz"
            placeholder="Material Oz"
            {...register("materialOz", {
              required: "Material Oz is required."
            })}
          />
          {errors.materialOz && <div className="invalid-feedback">{errors.materialOz.message}</div>}
        </div>
        <div className="col-md-4">
          <label htmlFor="emptyDelivery" className="form-label">Entrega Vacíos</label>
          <input
            type="text"
            className={`form-control ${errors.emptyDelivery ? 'is-invalid' : ''}`}
            id="emptyDelivery"
            placeholder="Entrega Vacíos"
            {...register("emptyDelivery", {
              required: "Empty Delivery is required."
            })}
          />
          {errors.emptyDelivery && <div className="invalid-feedback">{errors.emptyDelivery.message}</div>}
        </div>
      </div>
      <br />
      <div className="row g-3">
        <div className="col-md-12 text-end">
          <button type="submit" className="btn btn-primary" onClick={onNext}>Siguiente</button>
        </div>
      </div>
    </div>
  );
};

export default BillOfLading;
