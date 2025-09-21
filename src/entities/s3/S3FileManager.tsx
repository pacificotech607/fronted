import React, { useState, useEffect } from 'react';
import { uploadFile, listFiles, deleteFile, getFile } from '../../services/s3Service';

const S3FileManager: React.FC = () => {
  const [files, setFiles] = useState<any[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    const s3Files = await listFiles();
    setFiles(s3Files || []);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (selectedFile) {
      await uploadFile(selectedFile);
      setSelectedFile(null);
      fetchFiles();
    }
  };

  const handleDelete = async (key: string) => {
    await deleteFile(key);
    fetchFiles();
  };

  const handleView = async (key: string) => {
    const content = await getFile(key);
    setFileContent(content);
  };

  return (
    <div>
      <h2>S3 File Manager</h2>
      <div>
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload} disabled={!selectedFile}>
          Upload
        </button>
      </div>
      <h3>Files in Bucket</h3>
      <ul>
        {files.map((file) => (
          <li key={file.Key}>
            {file.Key}
            <button onClick={() => handleView(file.Key)}>View</button>
            <button onClick={() => handleDelete(file.Key)}>Delete</button>
          </li>
        ))}
      </ul>
      {fileContent && (
        <div>
          <h3>File Content</h3>
          <pre>{fileContent}</pre>
        </div>
      )}
    </div>
  );
};

export default S3FileManager;
