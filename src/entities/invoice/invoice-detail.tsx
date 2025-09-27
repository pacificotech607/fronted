import React from 'react';
import { useLocation } from 'react-router-dom';
import { IInvoice } from '../../model/invoice.model';
import GenericModal from '../../utils/Modal';
import { get } from 'lodash';

type InvoiceDetailProps = {
  invoice: IInvoice | null;
};

const InvoiceDetail: React.FC<InvoiceDetailProps> = ({ invoice }) => {
  const location = useLocation();
  const isCreditNote = location.pathname.includes('/credit-note');
  const title = isCreditNote ? 'Detalles de la Nota de Crédito' : 'Detalles de la Factura';

  return (
    <GenericModal id="invoiceDetailModal" title={title} size='xl'>
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <p><strong>Cliente:</strong> {invoice && invoice.customer}</p>
            <p><strong>Emisor:</strong> {get(invoice && invoice.issuing, 'esLabel', '')}</p>
            <p><strong>Tipo de Comprobante:</strong> {get(invoice && invoice.typeReceipt, 'esLabel', '')}</p>
            <p><strong>Uso de Comprobante:</strong> {get(invoice && invoice.useVoucher, 'esLabel', '')}</p>
          </div>
          <div className="col-md-6">
            <p><strong>Método de Pago:</strong> {get(invoice && invoice.methodOfPayment, 'esLabel', '')}</p>
            <p><strong>Forma de Pago:</strong> {get(invoice && invoice.paymentMethod, 'esLabel', '')}</p>
            <p><strong>Moneda:</strong> {get(invoice && invoice.currency, 'esLabel', '')}</p>
            <p><strong>Tipo de Cambio:</strong> {invoice && invoice.exchangeRate}</p>
          </div>
        </div>
        <hr />
        <h5>Facturas Relacionadas</h5>
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
        <hr />
        <h5>Conceptos</h5>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Clave de Servicio</th>
              <th>Unidad</th>
              <th>Descripción</th>
              <th>Cantidad</th>
              <th>Precio Unitario</th>
              <th>Importe</th>
              <th>IVA</th>
              <th>Retención</th>
            </tr>
          </thead>
          <tbody>
            {invoice && invoice.concepts.map((concept, index) => (
              <tr key={index}>
                <td>{concept.serviceKey}</td>
                <td>{concept.Unit}</td>
                <td>{concept.description}</td>
                <td>{concept.cant}</td>
                <td>{concept.p_unit}</td>
                <td>{concept.amount}</td>
                <td>{concept.iva ? 'Sí' : 'No'}</td>
                <td>{concept.retention ? 'Sí' : 'No'}</td>
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

export default InvoiceDetail;
