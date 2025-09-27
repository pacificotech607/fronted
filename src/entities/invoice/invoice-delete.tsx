import React from 'react';
import { useDispatch } from 'react-redux';
import { IInvoice } from '../../model/invoice.model';
import { deleteEntity } from './invoice.reducer';
import GenericModal from '../../utils/Modal';
import { toast } from 'react-toastify';

type InvoiceDeleteProps = {
  invoice: IInvoice | null;
  refresh: () => void;
};

const InvoiceDelete: React.FC<InvoiceDeleteProps> = ({ invoice, refresh }) => {
  const dispatch = useDispatch();

  const handleDelete = () => {
    if (invoice && invoice._id) {
      dispatch(deleteEntity(invoice._id));
      toast.error(`Factura ${invoice._id} eliminada`, {
        position: "top-right",
      });
      refresh();
    }
  };

  return (
    <GenericModal
      id="invoiceDeleteModal"
      title="¿Estás seguro de eliminar la factura?"
    >
      <div className="card-body p-0 text-center">
        <i className="bi bi-trash" style={{ color: '#e93e3e', fontSize: '200px' }}></i>
        <p>¿Estás seguro de que deseas eliminar esta pestaña {invoice?._id}?</p>
        <br />
        <div className="row g-3">
          <div className="col-md-12 text-center">
            <button type="button" className="btn btn-primary" data-bs-dismiss="modal" style={{ marginRight: '10px' }}>Cancelar</button>
            <button type="button" className="btn btn-danger" onClick={handleDelete} data-bs-dismiss="modal">Eliminar</button>
          </div>
        </div>
      </div>
    </GenericModal>
  );
};

export default InvoiceDelete;
