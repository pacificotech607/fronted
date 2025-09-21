import React, { useState } from 'react';
import { useFieldArray, Control, UseFormRegister } from 'react-hook-form';

interface BlsContainersProps {
  control: Control<any>;
  register: UseFormRegister<any>;
  onNext: () => void;
  onPrev: () => void;
}
const BlsContainers: React.FC<BlsContainersProps> = ({ control, onNext, onPrev, register }) => {

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
          <select id="typeLoad" className="form-select" {...register("typeLoad")}>
            <option value="containerized">Contenerizada</option>
            <option value="loose">Carga Suelta</option>
          </select>
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
