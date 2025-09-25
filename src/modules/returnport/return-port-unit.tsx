import { IBLS } from '../../model/bls.model';
import GenericModal from '../../utils/Modal';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateEntity } from '../../entities/bls/bls.reducer';
import CameraUpload from '../../utils/CameraUpload';
import { toast } from 'react-toastify';
import { statusBls } from '../../constants/bls.constans';
import { S3 } from 'aws-sdk';
import { awsConfig } from '../../config/aws-config';

type ReturnPortUnitProps = {
  bls: IBLS | null;
  refresh: () => void;
};

interface IReturnPortUnitForm {
  frontal?: string;
  rightSidePhotograph?: string;
  leftSidePhotograph?: string;
  rear?: string;
}

const ReturnPortUnit: React.FC<ReturnPortUnitProps> = ({ bls, refresh }) => {
  const dispatch = useDispatch();
  const [frontal, setFrontal] = useState<{ key: string, url: string } | null>(null);
  const [rightSide, setRightSide] = useState<{ key: string, url: string } | null>(null);
  const [leftSide, setLeftSide] = useState<{ key: string, url: string } | null>(null);
  const [rear, setRear] = useState<{ key: string, url: string } | null>(null);

  const {
    handleSubmit,
    reset,
    clearErrors,
  } = useForm<IReturnPortUnitForm>({
    mode: 'onChange',
  });

  const s3 = new S3({
    accessKeyId: awsConfig.accessKeyId,
    secretAccessKey: awsConfig.secretAccessKey,
    region: awsConfig.region,
  });

  const generateUrl = async (key: string) => {
    const url = await s3.getSignedUrlPromise('getObject', {
      Bucket: awsConfig.bucketName,
      Key: key,
      Expires: 60 * 60, // 1 hour
    });
    return { key, url };
  };


  const onSubmit = (data: IReturnPortUnitForm) => {
    if (bls) {
      const entity = {
        ...bls,
        ...data,
        status: statusBls.exitReviewPort.value,
        returnPhotos: [frontal, rightSide, leftSide, rear]
      };

      const fieldsToProcess: (keyof IBLS)[] = ['origin', 'destination', 'typeLoad', 'motorTransport', 'operator'];

      fieldsToProcess.forEach(field => {
        const value = entity[field];
        if (typeof value === 'object' && value !== null && '_id' in value) {
          (entity as any)[field] = (value as any)._id;
        }
      });

      dispatch(updateEntity(entity));
      toast.success(`BL ${bls.bl} actualizado con exito`);
      reset();
    }
    refresh();
  };

  const handleUpload = async (s3Object: S3.ManagedUpload.SendData, setter: React.Dispatch<React.SetStateAction<{ key: string, url: string } | null>>) => {
    const url = await generateUrl(s3Object.Key);
    setter(url);
  };

  const handleDelete = async (key: string, setter: React.Dispatch<React.SetStateAction<{ key: string, url: string } | null>>) => {
    try {
      await s3.deleteObject({
        Bucket: awsConfig.bucketName,
        Key: key,
      }).promise();
      setter(null);
      toast.success('Imagen eliminada con éxito');
    } catch (error) {
      toast.error('Error al eliminar la imagen');
      console.error('Error deleting from S3:', error);
    }
  };

  return (
    <GenericModal id="blsReturnPortModal" title="Revisión de regreso a puerto" size='lg'>
      <div className="form-container">
        <form className="needs-validation" onSubmit={handleSubmit(onSubmit)}>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-6">
                <label htmlFor="frontal" className="form-label">Fotografia frontal</label>
                <CameraUpload onUploadSuccess={(s3Object) => handleUpload(s3Object, setFrontal)} />
                {frontal && (
                  <div className="mt-2 position-relative d-inline-block">
                    <img src={frontal.url} alt="Frontal" className="img-thumbnail" />
                    <button type="button" title="Eliminar fotografia frontal" className="btn btn-danger btn-sm position-absolute top-0 end-0" onClick={() => handleDelete(frontal.key, setFrontal)}>
                      <i className="bi bi-trash3"></i>
                    </button>
                  </div>
                )}
              </div>
              <div className="col-md-6">
                <label htmlFor="rightSidePhotograph" className="form-label">Fotografia Lateral derecho</label>
                <CameraUpload onUploadSuccess={(s3Object) => handleUpload(s3Object, setRightSide)} />
                {rightSide && (
                  <div className="mt-2 position-relative d-inline-block">
                    <img src={rightSide.url} alt="Right Side" className="img-thumbnail" />
                    <button type="button" title="Eliminar fotografia Lateral derecho" className="btn btn-danger btn-sm position-absolute top-0 end-0" onClick={() => handleDelete(rightSide.key, setRightSide)}>
                      <i className="bi bi-trash3"></i>
                    </button>
                  </div>
                )}
              </div>
              <div className="col-md-6">
                <label htmlFor="leftSidePhotograph" className="form-label">Fotografia Lateral izquierdo</label>
                <CameraUpload onUploadSuccess={(s3Object) => handleUpload(s3Object, setLeftSide)} />
                {leftSide && (
                  <div className="mt-2 position-relative d-inline-block">
                    <img src={leftSide.url} alt="Left Side" className="img-thumbnail" />
                    <button type="button" title="Eliminar fotografia Lateral izquierdo" className="btn btn-danger btn-sm position-absolute top-0 end-0" onClick={() => handleDelete(leftSide.key, setLeftSide)}>
                      <i className="bi bi-trash3"></i>
                    </button>
                  </div>
                )}
              </div>
              <div className="col-md-6">
                <label htmlFor="rear" className="form-label">Fotografia trasera</label>
                <CameraUpload onUploadSuccess={(s3Object) => handleUpload(s3Object, setRear)} />
                {rear && (
                  <div className="mt-2 position-relative d-inline-block">
                    <img src={rear.url} alt="Rear" className="img-thumbnail" />
                    <button type="button" title="Eliminar fotografia trasera" className="btn btn-danger btn-sm position-absolute top-0 end-0" onClick={() => handleDelete(rear.key, setRear)}>
                      <i className="bi bi-trash3"></i>
                    </button>
                  </div>
                )}
              </div>
            </div>
            <br />
            <div className="row g-3">
              <div className="col-md-12 text-end">
                <button
                  style={{ marginRight: '10px' }}
                  onClick={() => {
                    reset();
                    clearErrors();
                  }}
                  data-bs-dismiss="modal"
                  className="btn btn-danger"
                  type="button"
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </GenericModal>
  );
};

export default ReturnPortUnit;
