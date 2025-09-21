import React from 'react';
import { Controller, useFieldArray, Control } from 'react-hook-form';

interface commodityItem {
  cantidad: number;
  claveUnidad: string;
  commodity: string;
  descripcion: string;
  peso: number;
}

interface commodityProps {
  control: Control<any>;
  onPrev: () => void;
  onSubmit: () => void;
}

const BlsCommodity: React.FC<commodityProps> = ({ control, onPrev, onSubmit }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "commodity"
  });

  const handleAddcommodity = () => {
    append({ cantidad: 1, claveUnidad: "", commodity: "", descripcion: "", peso: 0 });
  };

  return (
    <form onSubmit={onSubmit}>
      <h2>Mercancía</h2>
      {fields.map((field, index) => (
        <div key={field.id} className="commodity-item">
          <Controller
            name={`commodity.${index}.cantidad`}
            control={control}
            defaultValue={(field as any).cantidad}
            render={({ field }) => <input type="number" {...field} placeholder="Cantidad" />}
          />
          <Controller
            name={`commodity.${index}.claveUnidad`}
            control={control}
            defaultValue={(field as any).claveUnidad}
            render={({ field }) => <input {...field} placeholder="Clave Unidad" />}
          />
          <Controller
            name={`commodity.${index}.commodity`}
            control={control}
            defaultValue={(field as any).commodity}
            render={({ field }) => <input {...field} placeholder="Commodity" />}
          />
          <Controller
            name={`commodity.${index}.descripcion`}
            control={control}
            defaultValue={(field as any).descripcion}
            render={({ field }) => <input {...field} placeholder="Descripcion" />}
          />
          <Controller
            name={`commodity.${index}.peso`}
            control={control}
            defaultValue={(field as any).peso}
            render={({ field }) => <input type="number" {...field} placeholder="Peso" />}
          />
          <button type="button" onClick={() => remove(index)}>Eliminar</button>
        </div>
      ))}
      <button type="button" onClick={handleAddcommodity}>Agregar Mercancía</button>
      <div className="navegacion-botones">
        <button type="button" onClick={onPrev}>Anterior</button>
        <button type="submit">Guardar</button>
      </div>
    </form>
  );
};

export default BlsCommodity;
