import React, { useRef, useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { IBLS } from '../../model/bls.model';
import { getFile } from '../../services/s3Service';

interface PortExitPdfReportProps {
    bl: IBLS | null;
    onClose: () => void;
}

const PortExitPdfReport: React.FC<PortExitPdfReportProps> = ({ bl, onClose }) => {
    const reportRef = useRef<HTMLDivElement>(null);
    const [imageUrls, setImageUrls] = useState<string[]>([]);

    useEffect(() => {
        const photos = bl?.exitPhotos;
        if (photos) {
            const fetchImageUrls = async () => {
                try {
                    const urls = await Promise.all(
                        photos.map((photo: { key: string }) => getFile(photo.key))
                    );
                    setImageUrls(urls.filter((url): url is string => !!url));
                } catch (error) {
                    console.error("Error fetching image URLs:", error);
                }
            };
            fetchImageUrls();
        } else {
            setImageUrls([]);
        }
    }, [bl]);

    const generatePdf = () => {
        if (reportRef.current) {
            html2canvas(reportRef.current, { useCORS: true }).then(canvas => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('p', 'mm', 'a4');
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                pdf.save(`reporte-salida-${bl?.bl || 'N/A'}.pdf`);
            });
        }
    };

    if (!bl) {
        return null;
    }

    return (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex={-1}>
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Generar Reporte PDF</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <div ref={reportRef} style={{ padding: '20px' }}>
                            <h1 className="text-center mb-4">Reporte de Salida de Puerto</h1>
                            
                            <div className="card mb-3">
                                <div className="card-header">
                                    Información General
                                </div>
                                <div className="card-body">
                                    <p><strong>BL:</strong> {bl.bl}</p>
                                    <p><strong>Autotransporte:</strong> {bl.motorTransport?.number}</p>
                                    <p><strong>Operador:</strong> {bl.operator?.name}</p>
                                    <p><strong>Fecha y hora de llegada a puerto:</strong> {bl.dateTimeArrivalPort}</p>
                                </div>
                            </div>

                            <div className="card mb-3">
                                <div className="card-header">
                                    Contenedores
                                </div>
                                <ul className="list-group list-group-flush">
                                    {bl.containers?.map((container, index) => (
                                        <li key={index} className="list-group-item">{container}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="card mb-3">
                                <div className="card-header">
                                    Mercancia
                                </div>
                                <div className="card-body">
                                    <div className="table-responsive">
                                        <table className="table table-bordered">
                                            <thead>
                                                <tr>
                                                    <th>Contenedor</th>
                                                    <th>Cantidad</th>
                                                    <th>Unidad</th>
                                                    <th>Mercancia</th>
                                                    <th>Descripción</th>
                                                    <th>Peso (Kg)</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {bl.commodity?.map((item, index) => (
                                                    <tr key={index}>
                                                        <td>{item.Container}</td>
                                                        <td>{item.quantity}</td>
                                                        <td>{item.unitKey}</td>
                                                        <td>{item.commodity}</td>
                                                        <td>{item.description}</td>
                                                        <td>{item.weightKg}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            
                            <hr />
                            <h5 className="mt-4">Fotografías</h5>
                            <div className="row">
                                {imageUrls.length > 0 ? (
                                    imageUrls.map((url, index) => (
                                        <div className="col-md-4 mb-3" key={index}>
                                            <img src={url} crossOrigin="anonymous" className="img-fluid" alt={`Foto ${index + 1}`} style={{ border: '1px solid #ddd', borderRadius: '4px', padding: '5px' }}/>
                                        </div>
                                    ))
                                ) : (
                                    <p>No hay fotografías disponibles.</p>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Cerrar</button>
                        <button type="button" className="btn btn-primary" onClick={generatePdf}>Descargar PDF</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PortExitPdfReport;
