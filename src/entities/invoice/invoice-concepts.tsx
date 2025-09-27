import React, { useState } from 'react';
import { Control, useFieldArray } from 'react-hook-form';

interface InvoiceConceptsProps {
  control: Control<any>;
  onSubmit: () => void;
  onPrev: () => void;
}

const InvoiceConcepts: React.FC<InvoiceConceptsProps> = ({ control, onSubmit, onPrev }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "Invoiceconcepts",
  });

  const [concept, setConcept] = useState({
    serviceKey: '',
    Unit: '',
    description: '',
    cant: '',
    p_unit: '',
    amount: '',
    iva: false,
    retention: false,
  });

  return (
    <>
      <h5>Conceptos</h5>
      <div className="row">
        <div className="col-md-3">
          <div className="mb-3">
            <label htmlFor="serviceKey" className="form-label">Clave de Servicio</label>
            <input type="text" className="form-control" id="serviceKey" value={concept.serviceKey} onChange={e => setConcept({ ...concept, serviceKey: e.target.value })} />
          </div>
        </div>
        <div className="col-md-3">
          <div className="mb-3">
            <label htmlFor="Unit" className="form-label">Unidad</label>
            <input type="text" className="form-control" id="Unit" value={concept.Unit} onChange={e => setConcept({ ...concept, Unit: e.target.value })} />
          </div>
        </div>
        <div className="col-md-3">
          <div className="mb-3">
            <label htmlFor="description" className="form-label">Descripción</label>
            <input type="text" className="form-control" id="description" value={concept.description} onChange={e => setConcept({ ...concept, description: e.target.value })} />
          </div>
        </div>
        <div className="col-md-3">
          <div className="mb-3">
            <label htmlFor="cant" className="form-label">Cantidad</label>
            <input type="text" className="form-control" id="cant" value={concept.cant} onChange={e => setConcept({ ...concept, cant: e.target.value })} />
          </div>
        </div>
        <div className="col-md-3">
          <div className="mb-3">
            <label htmlFor="p_unit" className="form-label">Precio Unitario</label>
            <input type="text" className="form-control" id="p_unit" value={concept.p_unit} onChange={e => setConcept({ ...concept, p_unit: e.target.value })} />
          </div>
        </div>
        <div className="col-md-3">
          <div className="mb-3">
            <label htmlFor="amount" className="form-label">Importe</label>
            <input type="text" className="form-control" id="amount" value={concept.amount} onChange={e => setConcept({ ...concept, amount: e.target.value })} />
          </div>
        </div>
        <div className="col-md-2" style={{ paddingTop: '25px' }}>
          <div className="form-check">
            <input className="form-check-input" type="checkbox" id="iva" checked={concept.iva} onChange={e => setConcept({ ...concept, iva: e.target.checked })} />
            <label className="form-check-label" htmlFor="iva">
              IVA 16%
            </label>
          </div>
          <div className="form-check">
            <input className="form-check-input" type="checkbox" id="retention" checked={concept.retention} onChange={e => setConcept({ ...concept, retention: e.target.checked })} />
            <label className="form-check-label" htmlFor="retention">
              Retención 4%
            </label>
          </div>
        </div>
        <div className="col-md-1" style={{ paddingTop: '32px' }}>
          <button
            type="button"
            title="Agregar Concepto"
            style={{ width: '50px', height: '50px' }}
            className="btn btn-outline-primary ms-auto"
            onClick={() => {
              append(concept);
              setConcept({
                serviceKey: '',
                Unit: '',
                description: '',
                cant: '',
                p_unit: '',
                amount: '',
                iva: false,
                retention: false,
              });
            }}
          >
            <i className="bi bi-plus-lg"></i>
          </button>
        </div>
      </div>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Clave de Servicio</th>
            <th>Unidad</th>
            <th>Descripción</th>
            <th>Cantidad</th>
            <th>P. Unitario</th>
            <th>Importe</th>
            <th>IVA (16%)</th>
            <th>Retención (4%)</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {fields.map((field, index) => {
            const amount = parseFloat((field as any).amount) || 0;
            const ivaAmount = (field as any).iva ? amount * 0.16 : 0;
            const retentionAmount = (field as any).retention ? amount * 0.04 : 0;
            return (
              <tr key={field.id}>
                <td>{(field as any).serviceKey}</td>
                <td>{(field as any).Unit}</td>
                <td>{(field as any).description}</td>
                <td>{(field as any).cant}</td>
                <td>{(field as any).p_unit}</td>
                <td>{amount.toFixed(2)}</td>
                <td>{ivaAmount.toFixed(2)}</td>
                <td>{retentionAmount.toFixed(2)}</td>
                <td className='text-center'>
                  <button type="button" className="btn btn-danger" onClick={() => remove(index)}><i className="bi bi-trash3"></i></button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="row justify-content-end mt-3">
        <div className="col-md-4">
          <table className="table">
            <tbody>
              <tr>
                <th>Subtotal</th>
                <td className="text-end">
                  {fields.reduce((acc, field) => acc + (parseFloat((field as any).amount) || 0), 0).toFixed(2)}
                </td>
              </tr>
              <tr>
                <th>IVA (16%)</th>
                <td className="text-end">
                  {fields.reduce((acc, field) => {
                    const amount = parseFloat((field as any).amount) || 0;
                    return acc + ((field as any).iva ? amount * 0.16 : 0);
                  }, 0).toFixed(2)}
                </td>
              </tr>
              <tr>
                <th>Retención (4%)</th>
                <td className="text-end">
                  {fields.reduce((acc, field) => {
                    const amount = parseFloat((field as any).amount) || 0;
                    return acc + ((field as any).retention ? amount * 0.04 : 0);
                  }, 0).toFixed(2)}
                </td>
              </tr>
              <tr>
                <th>Total</th>
                <td className="text-end">
                  {(
                    fields.reduce((acc, field) => acc + (parseFloat((field as any).amount) || 0), 0) +
                    fields.reduce((acc, field) => {
                      const amount = parseFloat((field as any).amount) || 0;
                      return acc + ((field as any).iva ? amount * 0.16 : 0);
                    }, 0) -
                    fields.reduce((acc, field) => {
                      const amount = parseFloat((field as any).amount) || 0;
                      return acc + ((field as any).retention ? amount * 0.04 : 0);
                    }, 0)
                  ).toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <br />
      <div className="row g-3">
        <div className="col-md-12 text-end">
          <button type="button" style={{ marginRight: '5px' }} className="btn btn-secondary" onClick={onPrev}>Anterior</button>
          <button type="button" className="btn btn-primary" onClick={onSubmit}>Guardar</button>
        </div>
      </div>
    </>
  );
};

export default InvoiceConcepts;
