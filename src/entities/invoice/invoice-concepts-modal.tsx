import React from 'react';
import { IInvoice } from '../../model/invoice.model';
import GenericModal from '../../utils/Modal';

interface InvoiceConceptsProps {
  invoice: IInvoice | null;
}

const InvoiceConceptsModal: React.FC<InvoiceConceptsProps> = ({ invoice }) => {
  return (
        <GenericModal
            id="invoiceConceptsModal"
            title="Detalles de los Conceptos de la Factura"
            size='xl'
        >
            <div className="card-body p-0">
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
                </tr>
              </thead>
              <tbody>
                {invoice && invoice.concepts.map((concept: any, index: number) => {
                  const amount = parseFloat(concept.amount) || 0;
                  const ivaAmount = concept.iva ? amount * 0.16 : 0;
                  const retentionAmount = concept.retention ? amount * 0.04 : 0;
                  return (
                    <tr key={index}>
                      <td>{concept.serviceKey}</td>
                      <td>{concept.Unit}</td>
                      <td>{concept.description}</td>
                      <td>{concept.cant}</td>
                      <td>{concept.p_unit}</td>
                      <td>{amount.toFixed(2)}</td>
                      <td>{ivaAmount.toFixed(2)}</td>
                      <td>{retentionAmount.toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
                            <br />
                <div className="row g-3">
                    <div className="col-md-12 text-end">
                        <button
                            type="button"
                            className="btn btn-primary"
                            data-bs-dismiss="modal"
                        >Aceptar</button>
                    </div>
                </div>
                   </div>
        </GenericModal>

  );
};

export default InvoiceConceptsModal;
