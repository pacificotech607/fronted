import React, { useState } from 'react';
import { Control, useFieldArray } from 'react-hook-form';
import AsyncSelectInput from '../../utils/asynSelect';
import { get } from 'lodash';
import { IValuelist } from '../../model/valuelist.model';

interface InvoiceRelatedProps {
    control: Control<any>;
    onNext: () => void;
    onPrev: () => void;
}

const InvoiceRelated: React.FC<InvoiceRelatedProps> = ({ control, onNext, onPrev }) => {
    const { fields, append, remove } = useFieldArray({
        control,
        name: "InvoiceRelated",
    });

    const [relationshipType, setRelationshipType] = useState<IValuelist | null>(null);
    const [invoiceFolio, setInvoiceFolio] = useState('');

    return (
        <>
            <h5>Facturas Relacionadas</h5>
            <div className="row">
                <div className="col-md-5">
                    <div className="mb-3">
                        <label htmlFor="relationshipType" className="form-label">Tipo de Relación</label>
                        <AsyncSelectInput
                            entityName="valuelists"
                            labelField="esLabel"
                            searchField="esLabel"
                            onChange={value => setRelationshipType(value)}
                            defaultValue={null}
                            initialConditions={encodeURIComponent(JSON.stringify({ type: 'relationshipType', alive: true }))}
                            isRequired
                        />
                    </div>
                </div>
                <div className="col-md-5">
                    <div className="mb-3">
                        <label htmlFor="invoiceFolio" className="form-label">Folio de Factura</label>
                        <input type="text" className="form-control" id="invoiceFolio" value={invoiceFolio} onChange={e => setInvoiceFolio(e.target.value)} />
                    </div>
                </div>
                <div className="col-md-2">
                    <div className="mb-3" style={{ paddingTop: '32px' }}>
                    <button
                        type="button"
                        title="Agregar Factura Relacionada"
                        style={{ width: '50px', height: '50px' }}
                        className="btn btn-outline-primary ms-auto"
                        onClick={() => {
                            if (relationshipType && invoiceFolio) {
                                append({ relationshipType, invoiceFolio });
                                setRelationshipType(null);
                                setInvoiceFolio('');
                            }
                        }}
                    >
                        <i className="bi bi-plus-lg"></i>
                    </button>
                    </div>
                </div>
            </div>
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>Tipo de Relación</th>
                        <th>Folio de Factura</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {fields.map((field, index) => (
                        <tr key={field.id}>
                            <td>{get(field, 'relationshipType.esLabel', '')}</td>
                            <td>{(field as any).invoiceFolio}</td>
                            <td className='text-center'>
                                <button type="button" title="Eliminar" className="btn btn-danger" onClick={() => remove(index)}><i className="bi bi-trash3"></i></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <br />
            <div className="row g-3">
                <div className="col-md-12 text-end">
                    <button type="button"  style={{ marginRight: '5px' }}  className="btn btn-secondary" onClick={onPrev}>Anterior</button>
                    <button type="button" className="btn btn-primary" onClick={onNext}>Siguiente</button>
                </div>
            </div>
        </>
    );
};

export default InvoiceRelated;
