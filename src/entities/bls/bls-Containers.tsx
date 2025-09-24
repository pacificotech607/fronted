import React, { useState } from 'react';
import { useFieldArray, Control, Controller } from 'react-hook-form';
import AsyncSelectInput from '../../utils/asynSelect';
import { IBLS } from '../../model/bls.model';

interface BlsContainersProps {
  control: Control<any>;
  onNext: () => void;
  onPrev: () => void;
  bls: IBLS | null;
}
const BlsContainers: React.FC<BlsContainersProps> = ({ control, onNext, onPrev, bls }) => {

  const { fields, append, remove } = useFieldArray({
    control,
    name: "BlsContainers"
  });
  const [newContainer, setNewContainer] = useState("");

  const handleAddContainer = () => {
    if (newContainer.trim() !== "") {
      append({ numero: newContainer });
      setNewContainer("");
    }
  };
  return (
    <div>
      <div className="d-flex align-items-center">
        <i className="bi bi-inboxes" style={{ color: '#0dcaf0', fontSize: '3rem', marginRight: '10px' }}></i>
        <h3>Contenedores</h3>
      </div>
      <div className="row g-3 mt-3">
        <div className="col-md-12">
          <label htmlFor="typeLoad" className="form-label">Tipo de Carga</label>
          <Controller
            name="typeLoad"
            control={control}
            rules={{ required: 'Por favor, selecciona un tipo de carga.' }}
            render={({ field }) => (
              <AsyncSelectInput
                entityName="valuelists"
                labelField="esLabel"
                searchField="esLabel"
                onChange={value => field.onChange(value._id)}
                defaultValue={bls?.typeLoad}
                initialConditions={encodeURIComponent(JSON.stringify({ type: 'type-Load', alive: true }))}
                isRequired
              />
            )}
          />
        </div>
        <div className="col-md-10">
          <input
            type="text"
            className="form-control"
            placeholder="Ingrese el número de contenedor"
            value={newContainer}
            onChange={(e) => setNewContainer(e.target.value)}
          />
        </div>
        <div className="col-md-2">
          <button type="button" style={{ width: '50px', height: '50px' }} title='Agregar contenedor' className="btn btn-outline-primary ms-auto" onClick={handleAddContainer}><i className="bi bi-plus-lg"></i></button>
        </div>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Contenedor</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {fields.map((field, index) => (
            <tr key={field.id}>
              <td>{(field as any).numero}</td>
              <td className="text-end">
                <button
                  type="button"
                  className="btn btn-danger"
                  title="Eliminar"
                  onClick={() => remove(index)}
                >
                  <i className="bi bi-trash"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <br />
      <div className="row g-3">
        <div className="col-md-12 text-end">
          <button type="button" style={{ marginRight: '5px' }} className="btn btn-secondary" onClick={onPrev}>Anterior</button>
          <button type="submit" className="btn btn-primary" onClick={onNext}>Siguiente</button>
        </div>
      </div>
    </div>
  );
};

export default BlsContainers;
