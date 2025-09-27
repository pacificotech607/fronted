import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { IInvoice } from '../../model/invoice.model';
import GenericModal from '../../utils/Modal';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { createEntity, updateEntity } from './invoice.reducer';
import { IValuelist } from '../../model/valuelist.model';
import InvoiceData from './invoice-data';
import InvoiceRelated from './invoices-related';
import InvoiceConcepts from './invoice-concepts';

interface FormValues {
  issuing?: IValuelist;
  customer?: string;
  typeReceipt?: IValuelist;
  useVoucher?: IValuelist;
  methodOfPayment?: IValuelist;
  paymentMethod?: IValuelist;
  currency?: IValuelist;
  exchangeRate?: string;
  relatedInvoices?: {
    relationshipType?: IValuelist;
    invoiceFolio?: string;
  }[];
  concepts?: {
    serviceKey?: string;
    Unit?: string;
    description?: string;
    cant?: string;
    p_unit?: string;
    amount?: string;
    iva?: boolean;
    retention?: boolean;
  }[];
}

type InvoiceUpdateProps = {
  invoice: IInvoice | null;
  refresh: () => void;
};

const InvoiceUpdate: React.FC<InvoiceUpdateProps> = ({ invoice, refresh }) => {
  const dispatch = useDispatch();
  const [step, setStep] = useState(1);
  const { control, handleSubmit, formState: { errors }, reset, register } = useForm<FormValues>({
    defaultValues: {
      relatedInvoices: [],
      concepts: [],
    },
  });

  useEffect(() => {
    if (invoice) {
      reset(invoice);
    } else {
      reset({
        issuing: undefined,
        customer: '',
        typeReceipt: undefined,
        useVoucher: undefined,
        methodOfPayment: undefined,
        paymentMethod: undefined,
        currency: undefined,
        exchangeRate: '',
        relatedInvoices: [],
        concepts: [],
      });
    }
  }, [invoice, reset]);

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const onSubmit = (data: FormValues) => {
    const processedData = { ...data,
      relatedInvoices: data.relatedInvoices?.map(ri => ({
        relationshipType: ri.relationshipType?._id,
        invoiceFolio: ri.invoiceFolio,
      })),
    };

    const fieldsToProcess: (keyof FormValues)[] = ['issuing', 'typeReceipt', 'useVoucher', 'methodOfPayment', 'paymentMethod', 'currency'];

    fieldsToProcess.forEach(field => {
      const value = processedData[field];
      if (typeof value === 'object' && value !== null && '_id' in value) {
        (processedData as any)[field] = (value as any)._id;
      }
    });

    if (invoice && invoice._id) {
      dispatch(updateEntity({ ...processedData, _id: invoice._id } as any));
      toast.success(`Factura ${invoice._id} editada`, {
        position: "top-right",
      });
    } else {
      dispatch(createEntity(processedData as any));
      toast.success(`Factura creada`, {
        position: "top-right",
      });
    }
    refresh();
    reset({
      issuing: undefined,
      customer: '',
      typeReceipt: undefined,
      useVoucher: undefined,
      methodOfPayment: undefined,
      paymentMethod: undefined,
      currency: undefined,
      exchangeRate: '',
      relatedInvoices: [],
      concepts: [],
    });
    setStep(1);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <InvoiceData
            control={control}
            errors={errors}
            register={register}
            invoice={invoice}
            onNext={nextStep}
          />
        );
      case 2:
        return (
          <InvoiceRelated
            control={control}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 3:
        return (
          <InvoiceConcepts
            control={control}
            onSubmit={handleSubmit(onSubmit)}
            onPrev={prevStep}
          />
        );
      default:
        return null;
    }
  };

  return (
    <GenericModal
      id="invoiceUpdateModal"
      title={invoice && invoice._id ? 'Editar Factura' : 'Crear nueva Factura'}
      size="xl"
    >
      <div className="form-container">
        <form className="needs-validation" onSubmit={handleSubmit(onSubmit)}>
      <div className="card-body">
            {renderStep()}
          </div>
        </form>
      </div>
    </GenericModal>
  );
};

export default InvoiceUpdate;
