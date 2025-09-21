import React from 'react';
import { Controller, useFieldArray, Control } from 'react-hook-form';

interface commodityProps {
  control: Control<any>;
  onPrev: () => void;
  onSubmit: () => void;
  containers?: { numero: string }[];
}

const BlsCommodity: React.FC<commodityProps> = ({ control, onPrev, onSubmit, containers }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "commodity"
  });

  const [newCommodity, setNewCommodity] = React.useState<any>({
    Container: '',
    quantity: 1,
    unitKey: '',
    commodity: '',
    description: '',
    weightKg: 0
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewCommodity({ ...newCommodity, [name]: value });
  };

  const handleAddCommodity = () => {
    append(newCommodity);
    setNewCommodity({
      Container: '',
      quantity: 1,
      unitKey: '',
      commodity: '',
      description: '',
      weightKg: 0
    });
  };

  return (
    <div>
      <div className="d-flex align-items-center">
        <i className="bi bi-inboxes-fill" style={{ color: '#0dcaf0', fontSize: '3rem', marginRight: '10px' }}></i>
        <h3>Mercancia</h3>
      </div>
      <form>
        <div className="row g-3 my-3">
          <div className="col-md-4">
            <label htmlFor="Container" className="form-label">Container</label>
            <select name="Container" value={newCommodity.Container} onChange={handleInputChange} className="form-control" id="Container">
              <option value="">Seleccione un contenedor</option>
              {containers?.map((container, index) => (
                <option key={index} value={container.numero}>
                  {container.numero}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-4">
            <label htmlFor="quantity" className="form-label">Quantity</label>
            <input type="number" className="form-control" id="quantity" placeholder="quantity" name="quantity" value={newCommodity.quantity} onChange={handleInputChange} />
          </div>
          <div className="col-md-4">
            <label htmlFor="unitKey" className="form-label">Unit Key</label>
            <input type="text" className="form-control" id="unitKey" placeholder="unitKey" name="unitKey" value={newCommodity.unitKey} onChange={handleInputChange} />
          </div>
        </div>
        <div className="row g-3 my-3">
          <div className="col-md-4">
            <label htmlFor="commodity" className="form-label">Commodity</label>
            <input type="text" className="form-control" id="commodity" placeholder="commodity" name="commodity" value={newCommodity.commodity} onChange={handleInputChange} />
          </div>
          <div className="col-md-4">
            <label htmlFor="description" className="form-label">Description</label>
            <input type="text" className="form-control" id="description" placeholder="description" name="description" value={newCommodity.description} onChange={handleInputChange} />
          </div>
          <div className="col-md-4">
            <label htmlFor="weightKg" className="form-label">Weight (Kg)</label>
            <input type="text" className="form-control" id="weightKg" placeholder="weightKg" name="weightKg" value={newCommodity.weightKg} onChange={handleInputChange} />
          </div>
        </div>
        <div className="row my-3">
          <div className="col-12 text-end">
            <button type="button" className="btn btn-primary" onClick={handleAddCommodity}>Agregar</button>
          </div>
        </div>
      </form>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Contenedor</th>
            <th>Quantity</th>
            <th>Unit Key</th>
            <th>Commodity</th>
            <th>Description</th>
            <th>Weight (Kg)</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {fields.map((item, index) => (
            <tr key={item.id}>
              <td>
                <Controller
                  render={({ field }) => <>{field.value}</>}
                  name={`commodity.${index}.Container`}
                  control={control}
                />
              </td>
              <td>
                <Controller
                  render={({ field }) => <>{field.value}</>}
                  name={`commodity.${index}.quantity`}
                  control={control}
                />
              </td>
              <td>
                <Controller
                  render={({ field }) => <>{field.value}</>}
                  name={`commodity.${index}.unitKey`}
                  control={control}
                />
              </td>
              <td>
                <Controller
                  render={({ field }) => <>{field.value}</>}
                  name={`commodity.${index}.commodity`}
                  control={control}
                />
              </td>
              <td>
                <Controller
                  render={({ field }) => <>{field.value}</>}
                  name={`commodity.${index}.description`}
                  control={control}
                />
              </td>
              <td>
                <Controller
                  render={({ field }) => <>{field.value}</>}
                  name={`commodity.${index}.weightKg`}
                  control={control}
                />
              </td>
              <td>
                <button type="button" className="btn btn-danger" onClick={() => remove(index)}>
                  Eliminar
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
          <button type="submit" className="btn btn-primary" data-bs-dismiss="modal" onClick={onSubmit}>Guardar</button>
        </div>
      </div>
    </div>
  );
};

export default BlsCommodity;
