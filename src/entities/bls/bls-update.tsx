import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { IBLS } from '../../model/bls.model';
import GenericModal from '../../utils/Modal';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { createEntity, updateEntity } from './bls.reducer';
import { statusBls } from '../../constants/bls.constans';
// Importa los componentes de los pasos
import BillOfLading from './BillOfLading';
import BlsContainers from './bls-Containers';
import BlsCommodity from './bls-Commodity';
import { IValuelist } from '../../model/valuelist.model';

interface FormValues {
  customer?: string;
  bl?: string;
  vessel?: string;
  destination?: string | IValuelist;
  petition?: string;
  eta?: string;
  invoice?: string;
  materialOz?: string;
  emptyDelivery?: string;
  status?: string;
  typeLoad?: string | IValuelist;
  BlsContainers?: { numero: string }[];
  commodity?: {
    Container?: string;
    quantity?: number;
    unitKey?: string;
    commodity?: string;
    description?: string;
    weightKg?: string;
  }[];
}

type BlsUpdateProps = {
  bls: IBLS | null;
  refresh: () => void;
};

const BlsUpdate: React.FC<BlsUpdateProps> = ({ bls, refresh }) => {
  const dispatch = useDispatch();
  const [step, setStep] = useState(1);
  const { control, handleSubmit, formState: { errors }, reset, register, watch } = useForm<FormValues>({
    defaultValues: {
      BlsContainers: [],
      commodity: []
    }
  });

  useEffect(() => {
    if (bls) {
      const { containers, commodity, ...restOfBls } = bls;
      reset({
        ...restOfBls,
        BlsContainers: containers ? containers.map(c => ({ numero: c })) : [],
        commodity: commodity || []
      });
    } else {
      reset({
        customer: '',
        bl: '',
        vessel: '',
        destination: '',
        petition: '',
        eta: '',
        invoice: '',
        materialOz: '',
        emptyDelivery: '',
        status: '',
        typeLoad: '',
        BlsContainers: [],
        commodity: []
      });
    }
  }, [bls, reset]);

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const onSubmit = (data: FormValues) => {
    const processedData = { ...data };

    const fieldsToProcess: (keyof FormValues)[] = ['destination', 'typeLoad'];

    fieldsToProcess.forEach(field => {
      const value = processedData[field];
      if (typeof value === 'object' && value !== null && '_id' in value) {
        (processedData as any)[field] = (value as any)._id;
      }
    });

    const { BlsContainers, ...rest } = processedData;

    const finalData = {
      ...rest,
      containers: BlsContainers?.map(c => c.numero),
      status: statusBls.inactive.value
    };

    if (bls && bls._id) {
      dispatch(updateEntity({ ...finalData, _id: bls._id } as any));
      toast.success(`Bl ${finalData.bl} editado`, {
        position: "top-right",
      });
    } else {
      dispatch(createEntity(finalData as any));
      toast.success(`Bl ${finalData.bl} Creado`, {
        position: "top-right",
      });
    }
    refresh();
    reset({
      customer: '',
      bl: '',
      vessel: '',
      destination: '',
      petition: '',
      eta: '',
      invoice: '',
      materialOz: '',
      emptyDelivery: '',
      status: '',
      typeLoad: '',
      BlsContainers: [],
      commodity: []
    });
    setStep(1);
  };

  const BlsContainersValues = watch("BlsContainers");

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <BillOfLading
            errors={errors}
            onNext={nextStep}
            register={register}
            control={control}
            bls={bls}
          />
        );
      case 2:
        return (
          <BlsContainers
            control={control}
            onNext={nextStep}
            onPrev={prevStep}
            bls={bls}
          />
        );
      case 3:
        return (
          <BlsCommodity
            control={control}
            onPrev={prevStep}
            onSubmit={handleSubmit(onSubmit)}
            containers={BlsContainersValues}
          />
        );
      default:
        return null;
    }
  };

  return (
    <GenericModal
      id="blUpdateModal"
      title={bls && bls.bl ? 'Editar Bls' : 'Crear nuevo Bls'}
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

export default BlsUpdate;
