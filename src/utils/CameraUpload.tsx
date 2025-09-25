import React, { useState, useRef, useCallback, useEffect } from 'react';
import { S3 } from 'aws-sdk';
import { toast } from 'react-toastify';
import { awsConfig } from '../config/aws-config';

interface CameraUploadProps {
  onUploadSuccess: (s3Object: S3.ManagedUpload.SendData) => void;
}

const CameraUpload: React.FC<CameraUploadProps> = ({ onUploadSuccess }) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<Blob | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const s3 = new S3({
    accessKeyId: awsConfig.accessKeyId,
    secretAccessKey: awsConfig.secretAccessKey,
    region: awsConfig.region,
  });

  useEffect(() => {
    if (isCameraOpen && stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [isCameraOpen, stream]);

  const openCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      setStream(mediaStream);
      setIsCameraOpen(true);
    } catch (error) {
      toast.error('Error al acceder a la cámara. Por favor, revise los permisos.');
      console.error('Error al acceder a la cámara:', error);
    }
  };

  const closeCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    setStream(null);
    setIsCameraOpen(false);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const takePicture = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setImagePreview(dataUrl);
        canvas.toBlob((blob) => {
          if (blob) {
            setImageFile(blob);
          }
        }, 'image/jpeg');
        closeCamera();
      }
    }
  }, []);

  const handleUpload = async () => {
    if (!imageFile) return;

    setIsUploading(true);
    const fileName = `photo-${Date.now()}.jpg`;
    const params = {
      Bucket: awsConfig.bucketName,
      Key: fileName,
      Body: imageFile,
      ContentType: imageFile.type,
    };

    try {
      const uploadResult = await s3.upload(params).promise();
      toast.success('¡Foto cargada exitosamente!');
      onUploadSuccess(uploadResult);
      setImagePreview(null);
      setImageFile(null);
    } catch (error) {
      toast.error('Error al cargar la foto.');
      console.error('Error al cargar a S3:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    setImagePreview(null);
    setImageFile(null);
  };

  if (isCameraOpen) {
    return (
      <div className="row g-3">
        <div className="col-md-12">
            <canvas ref={canvasRef} style={{ display: 'none' }} />
          <video ref={videoRef} autoPlay muted playsInline style={{ width: '100%' }} />
        </div>
        <div className="col-md-12 text-center">
          <button type="button" className="btn btn-primary" title='Tomar fotografia' onClick={takePicture} style={{ marginRight: '10px' }}>
            <i className="bi bi-camera"></i>
          </button>
          <button type="button" className="btn btn-danger" title='Cerrar camara' onClick={closeCamera}>
            <i className="bi bi-camera-video-off"></i>
          </button>
        </div>
      </div>
    );
  }

  if (imagePreview) {
    return (
      <div className="row g-3">
        <div className="col-md-12">
          <img src={imagePreview} alt="Preview" style={{ width: '100%' }} />
        </div>
        <div className="col-md-12 text-center">
          <button type="button" className="btn btn-primary" title='Guardar fotografia' onClick={handleUpload} disabled={isUploading} style={{ marginRight: '10px' }}>
            {isUploading ? 'Uploading...' : <i className="bi bi-floppy-fill"></i>}
          </button>
          <button type="button" className="btn btn-danger" title="Eliminar fotografia" onClick={handleCancel} disabled={isUploading}>
            <i className="bi bi-trash3"></i>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <button type="button" className="btn btn-primary" title="Tomar fotografia" onClick={openCamera} style={{ marginRight: '10px' }}>
        <i className="bi bi-camera"></i>
      </button>
      <button type="button" className="btn btn-secondary" title="Subir fotografia" onClick={() => fileInputRef.current?.click()}>
        <i className="bi bi-image"></i>
      </button>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept="image/*"
        onChange={handleFileSelect}
      />
    </div>
  );
};

export default CameraUpload;
