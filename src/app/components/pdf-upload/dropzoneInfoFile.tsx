import React from 'react';

interface DropzoneInfoFileProps {
  uploadedFile: File;
}

const DropzoneInfoFile: React.FC<DropzoneInfoFileProps> = ({ uploadedFile }) => {
  return (
    <div className="mt-6 p-4 bg-green-50 rounded-md">
      <h3 className="text-sm font-medium text-green-800">Archivo cargado exitosamente</h3>
      <div className="mt-2 text-sm text-green-700">
        <p>Nombre: {uploadedFile.name}</p>
        <p>Tamaño: {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</p>
        <p>Tipo: {uploadedFile.type}</p>
      </div>
    </div>
  );
};

export default DropzoneInfoFile;