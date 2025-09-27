import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IInvoice } from '../../model/invoice.model';
import InvoiceUpdate from './invoice-update';
import InvoiceDetail from './invoice-detail';
import InvoiceDelete from './invoice-delete';
import InvoiceConceptsModal from './invoice-concepts-modal';
import InvoicesRelatedModal from './invoices-related-modal';
import { IRootState } from '../../model/root-state';
import { getEntities } from './invoice.reducer';
import GenericMultiTagSearch from '../../utils/searchInput';
import { invoiceAggregate } from '../../constants/invoice.constants';
import { get } from 'lodash';

const Invoice: React.FC = () => {
  const dispatch = useDispatch();
  const invoices = useSelector((state: IRootState) => state.invoice.invoices);
  const totalPages = useSelector((state: IRootState) => state.invoice.totalPages);
  const activePage = useSelector((state: IRootState) => state.invoice.page);

  const [invoice, setInvoice] = useState<IInvoice | null>(null);
  const [invoiceConcepts, setInvoiceConcepts] = useState<IInvoice | null>(null);
  const [invoicesRelated, setInvoicesRelated] = useState<IInvoice | null>(null);

  const [searchQuery, setSearchQuery] = useState<string | null>(
    JSON.stringify([
      ...invoiceAggregate,
      { $match: { alive: true } },
    ])
  );

  useEffect(() => {
    dispatch(getEntities(0, 20, searchQuery || undefined));
  }, [dispatch, searchQuery]);

  const handlePagination = (page: number) => {
    dispatch(getEntities(page, 20, searchQuery || undefined));
  };

  const handleSearch = (query: string | null) => {
    const baseQuery = invoiceAggregate;

    let matchStage: any = { $match: { alive: true } };

    if (query) {
      try {
        const userQuery = JSON.parse(query);
        matchStage = { $match: { $and: [{ alive: true }, userQuery] } };
      } catch (error) {
        console.error('Failed to parse search query:', error);
      }
    }

    const finalQuery = [...baseQuery, matchStage];
    const finalQueryString = JSON.stringify(finalQuery);
    setSearchQuery(finalQueryString);
    dispatch(getEntities(0, 20, finalQueryString));
  };

  const searchOptions = [
    { value: 'customer', label: 'Cliente' },
    { value: 'issuing.esLabel', label: 'Emisor' },
    { value: 'typeReceipt.esLabel', label: 'Tipo de Comprobante' },
    { value: 'useVoucher.esLabel', label: 'Uso de Comprobante' },
    { value: 'methodOfPayment.esLabel', label: 'Método de Pago' },
    { value: 'paymentMethod.esLabel', label: 'Forma de Pago' },
    { value: 'currency.esLabel', label: 'Moneda' },
  ];


  return (
    <div className="app-main">
      <div className="app-content-header">
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-6">
              <h3 className="mb-0">Facturas</h3>
            </div>
            <div className="col-sm-6 text-end">
              <button
                type="button"
                className="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target="#invoiceUpdateModal"
                onClick={() => setInvoice(null)}
              >
                Crear nueva Factura
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="app-content" style={{ margin: '10px' }}>
        <div style={{ marginBottom: '20px' }}>
          <GenericMultiTagSearch
            searchOptions={searchOptions}
            onSearchButtonClick={handleSearch}
          />
        </div>
        <div className="table-responsive">
          <table className="table table-bordered">
          <thead>
            <tr>
              <th style={{ minWidth: '100px' }}>Acciones</th>
              <th style={{ minWidth: '200px' }}>Cliente</th>
              <th style={{ minWidth: '150px' }}>Emisor</th>
              <th style={{ minWidth: '150px' }}>Tipo de Comprobante</th>
              <th style={{ minWidth: '150px' }}>Uso de Comprobante</th>
              <th style={{ minWidth: '150px' }}>Método de Pago</th>
              <th style={{ minWidth: '120px' }}>Forma de Pago</th>
              <th style={{ minWidth: '150px' }}>Moneda</th>
              <th style={{ minWidth: '150px' }}>Tipo de Cambio</th>
              <th style={{ minWidth: '100px' }}>Conceptos</th>
              <th style={{ minWidth: '100px' }}>Facturas Relacionadas</th>
            </tr>
          </thead>
          <tbody>
            {invoices && invoices.map((invoice, i) => (
              <tr key={`entity-${i}`} className="align-middle">
                <td style={{ width: '10px' }}>
                  <div className="btn-group mb-2" role="group" aria-label="Basic outlined example">
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      data-bs-toggle="modal"
                      data-bs-target="#invoiceDetailModal"
                      onClick={() => setInvoice(invoice)}
                      title="Ver"
                    >
                      <i className="bi bi-eye"></i>
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-danger"
                      data-bs-toggle="modal"
                      data-bs-target="#invoiceDeleteModal"
                      onClick={() => setInvoice(invoice)}
                      title="Eliminar"
                    >
                      <i className="bi bi-trash3"></i>
                    </button>
                  </div>
                </td>
                <td>{invoice.customer}</td>
                <td>{get(invoice.issuing, 'esLabel', '')}</td>
                <td>{get(invoice.typeReceipt, 'esLabel', '')}</td>
                <td>{get(invoice.useVoucher, 'esLabel', '')}</td>
                <td>{get(invoice.methodOfPayment, 'esLabel', '')}</td>
                <td>{get(invoice.paymentMethod, 'esLabel', '')}</td>
                <td>{get(invoice.currency, 'esLabel', '')}</td>
                <td>{invoice.exchangeRate}</td>
                <td className='text-center'><button type="button"
                  data-bs-toggle="modal"
                  data-bs-target="#invoiceConceptsModal"
                  onClick={() => setInvoiceConcepts(invoice)}
                  title="Ver Conceptos" style={{ background: 'transparent', border: 'none' }}><i className="bi bi-file-earmark-break" style={{ color: '#0dcaf0' }}></i></button></td>
                <td className='text-center'><button type="button"
                  data-bs-toggle="modal"
                  data-bs-target="#invoicesRelatedModal"
                  onClick={() => setInvoicesRelated(invoice)}
                  title="Ver Facturas Relacionadas" style={{ background: 'transparent', border: 'none' }}><i className="bi bi-receipt" style={{ color: '#0dcaf0' }}></i></button></td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
      <div className="card-footer d-flex justify-content-center">
        <nav aria-label="Page navigation example">
          <ul className="pagination">
            <li className={`page-item ${activePage === 0 ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => handlePagination(activePage - 1)} disabled={activePage === 0}>Previous</button>
            </li>
            {Array.from(Array(totalPages).keys()).map(i => (
              <li key={i} className={`page-item ${activePage === i ? 'active' : ''}`}>
                <button className="page-link" onClick={() => handlePagination(i)}>{i + 1}</button>
              </li>
            ))}
            <li className={`page-item ${activePage === totalPages - 1 ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => handlePagination(activePage + 1)} disabled={activePage === totalPages - 1}>Next</button>
            </li>
          </ul>
        </nav>
      </div>
      <InvoiceUpdate invoice={invoice} refresh={() => { dispatch(getEntities(0, 20, searchQuery || undefined)); }} />
      <InvoiceDetail invoice={invoice} />
      <InvoiceDelete invoice={invoice} refresh={() => { dispatch(getEntities(0, 20, searchQuery || undefined)); }} />
      <InvoiceConceptsModal invoice={invoiceConcepts} />
      <InvoicesRelatedModal invoice={invoicesRelated} />
    </div>
  );
};

export default Invoice;
