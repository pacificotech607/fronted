import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { IBLS } from '../../model/bls.model';
import GenericModal from '../../utils/Modal';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { createEntity, updateEntity } from './bls.reducer';

// Importa los componentes de los pasos
import BillOfLading from './BillOfLading';
import BlsContainers from './bls-Containers';
import BlsCommodity from './bls-Commodity';

interface FormValues {
  customer?: string;
  bl?: string;
  vessel?: string;
  destination?: string;
  petition?: string;
  eta?: string;
  invoice?: string;
  materialOz?: string;
  emptyDelivery?: string;
  status?: string;
  typeLoad?: string;
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
      const { containers, ...restOfBls } = bls;
      reset({
        ...restOfBls,
        BlsContainers: containers ? containers.map(c => ({ numero: c })) : [],
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
    const { BlsContainers, ...rest } = data;
    const finalData = {
      ...rest,
      containers: BlsContainers?.map(c => c.numero)
    };
    console.log('Datos del formulario:', finalData);
    if (bls && bls._id) {
      dispatch(updateEntity(finalData));
      toast.success(`Bl ${finalData.bl} editado`, {
        position: "top-right",
      });
    } else {
      dispatch(createEntity(finalData));
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
          />
        );
      case 2:
        return (
          <BlsContainers
            control={control}
            onNext={nextStep}
            onPrev={prevStep}
            register={register}
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
