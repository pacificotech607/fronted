import React from 'react';
import { IInvoice } from '../../model/invoice.model';
import { get } from 'lodash';
import GenericModal from '../../utils/Modal';

interface InvoiceRelatedProps {
  invoice: IInvoice | null;
}

const InvoicesRelatedModal: React.FC<InvoiceRelatedProps> = ({ invoice }) => {

  return (
    <GenericModal
      id="invoicesRelatedModal"
      title="Facturas Relacionadas"
      size="lg"
    >
      <div className="card-body p-0">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Tipo de Relación</th>
              <th>Folio de Factura</th>
            </tr>
          </thead>
          <tbody>
            {invoice && invoice.relatedInvoices.map((related, index) => (
              <tr key={index}>
                <td>{get(related, 'relationshipType.esLabel', '')}</td>
                <td>{related.invoiceFolio}</td>
              </tr>
            ))}
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

export default InvoicesRelatedModal;
