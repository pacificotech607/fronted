import React from 'react';
import { Control, Controller, FieldErrors, UseFormRegister } from 'react-hook-form';
import AsyncSelectInput from '../../utils/asynSelect';
import { IInvoice } from '../../model/invoice.model';

interface InvoiceDataProps {
  control: Control<any>;
  errors: FieldErrors;
  register: UseFormRegister<any>;
  invoice: IInvoice | null;
  onNext: () => void;
}

const InvoiceData: React.FC<InvoiceDataProps> = ({ control, errors, register, invoice, onNext }) => {
  return (
    <>
      <div className="row">
        <div className="col-md-4">
          <div className="mb-3">
            <label htmlFor="customer" className="form-label">Cliente</label>
            <input type="text" placeholder='Cliente' className="form-control" id="customer" {...register("customer")} />
          </div>
        </div>
        <div className="col-md-4">
          <div className="mb-3">
            <label htmlFor="issuing" className="form-label">Emisor</label>
            <Controller
              name="issuing"
              control={control}
              rules={{ required: 'Por favor, selecciona un puesto.' }}
              render={({ field }) => (
                <AsyncSelectInput
                  entityName="valuelists"
                  labelField="esLabel"
                  searchField="esLabel"
                  onChange={value => field.onChange(value._id)}
                  defaultValue={invoice?.issuing}
                  initialConditions={encodeURIComponent(JSON.stringify({ type: 'issuing', alive: true }))}
                  isRequired
                />
              )}
            />
          </div>
        </div>
        <div className="col-md-4">
          <div className="mb-3">
            <label htmlFor="typeReceipt" className="form-label">Tipo de Comprobante</label>
            <Controller
              name="typeReceipt"
              control={control}
              rules={{ required: 'Por favor, selecciona un puesto.' }}
              render={({ field }) => (
                <AsyncSelectInput
                  entityName="valuelists"
                  labelField="esLabel"
                  searchField="esLabel"
                  onChange={value => field.onChange(value._id)}
                  defaultValue={invoice?.typeReceipt}
                  initialConditions={encodeURIComponent(JSON.stringify({ type: 'typeReceipt', alive: true }))}
                  isRequired
                />
              )}
            />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-4">
          <div className="mb-3">
            <label htmlFor="useVoucher" className="form-label">Uso de Comprobante</label>
            <Controller
              name="useVoucher"
              control={control}
              rules={{ required: 'Por favor, selecciona un puesto.' }}
              render={({ field }) => (
                <AsyncSelectInput
                  entityName="valuelists"
                  labelField="esLabel"
                  searchField="esLabel"
                  onChange={value => field.onChange(value._id)}
                  defaultValue={invoice?.useVoucher}
                  initialConditions={encodeURIComponent(JSON.stringify({ type: 'useVoucher', alive: true }))}
                  isRequired
                />
              )}
            />
          </div>
        </div>
        <div className="col-md-4">
          <div className="mb-3">
            <label htmlFor="methodOfPayment" className="form-label">Método de Pago</label>
            <Controller
              name="methodOfPayment"
              control={control}
              rules={{ required: 'Por favor, selecciona un puesto.' }}
              render={({ field }) => (
                <AsyncSelectInput
                  entityName="valuelists"
                  labelField="esLabel"
                  searchField="esLabel"
                  onChange={value => field.onChange(value._id)}
                  defaultValue={invoice?.methodOfPayment}
                  initialConditions={encodeURIComponent(JSON.stringify({ type: 'methodOfPayment', alive: true }))}
                  isRequired
                />
              )}
            />
          </div>
        </div>
        <div className="col-md-4">
          <div className="mb-3">
            <label htmlFor="paymentMethod" className="form-label">Forma de Pago</label>
            <Controller
              name="paymentMethod"
              control={control}
              rules={{ required: 'Por favor, selecciona un puesto.' }}
              render={({ field }) => (
                <AsyncSelectInput
                  entityName="valuelists"
                  labelField="esLabel"
                  searchField="esLabel"
                  onChange={value => field.onChange(value._id)}
                  defaultValue={invoice?.paymentMethod}
                  initialConditions={encodeURIComponent(JSON.stringify({ type: 'paymentMethod', alive: true }))}
                  isRequired
                />
              )}
            />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-4">
          <div className="mb-3">
            <label htmlFor="currency" className="form-label">Moneda</label>
            <Controller
              name="currency"
              control={control}
              rules={{ required: 'Por favor, selecciona un puesto.' }}
              render={({ field }) => (
                <AsyncSelectInput
                  entityName="valuelists"
                  labelField="esLabel"
                  searchField="esLabel"
                  onChange={value => field.onChange(value._id)}
                  defaultValue={invoice?.currency}
                  initialConditions={encodeURIComponent(JSON.stringify({ type: 'currency', alive: true }))}
                  isRequired
                />
              )}
            />
          </div>
        </div>
        <div className="col-md-4">
          <div className="mb-3">
            <label htmlFor="exchangeRate" className="form-label">Tipo de Cambio</label>
            <input type="text" placeholder='Tipo de Cambio' className="form-control" id="exchangeRate" {...register("exchangeRate")} />
          </div>
        </div>
      </div>
      <div className="d-flex justify-content-end">
        <button type="button" className="btn btn-primary" onClick={onNext}>Siguiente</button>
      </div>
    </>
  );
};

export default InvoiceData;
