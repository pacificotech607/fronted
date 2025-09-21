import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { IBLS } from '../../model/bls.model';
import GenericModal from '../../utils/Modal';

// Importa los componentes de los pasos
import BillOfLading from './BillOfLading';
import BlsContainers from './bls-Containers';
import BlsCommodity from './bls-Commodity';

interface FormValues {
  billOfLading: any;
  BlsContainers: { numero: string }[];
  commodity: {
    cantidad: number;
    claveUnidad: string;
    commodity: string;
    descripcion: string;
    peso: number;
  }[];
}

type BlsUpdateProps = {
  bls: IBLS | null;
  refresh: () => void;
};

const BlsUpdate: React.FC<BlsUpdateProps> = ({ bls, refresh }) => {
  const [step, setStep] = useState(1);
  const { control, handleSubmit, formState: { errors }, reset, register } = useForm<FormValues>({
    defaultValues: {
      billOfLading: {},
      BlsContainers: [],
      commodity: []
    }
  });

  useEffect(() => {
    if (bls) {
      const { containers, commodity, ...billOfLading } = bls;
      reset({
        billOfLading,
        BlsContainers: containers ? containers.map(c => ({ numero: c })) : [],
        commodity: commodity || []
      });
    } else {
      reset({
        billOfLading: {},
        BlsContainers: [],
        commodity: []
      });
    }
  }, [bls, reset]);

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const onSubmit = (data: any) => {
    console.log('Datos del formulario:', data);
    // Aquí puedes enviar los datos a tu API
    refresh();
  };

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
          />
        );
      case 3:
        return (
          <BlsCommodity
            control={control}
            onPrev={prevStep}
            onSubmit={handleSubmit(onSubmit)}
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
