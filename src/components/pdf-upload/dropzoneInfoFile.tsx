import React from 'react';

interface DropzoneInfoFileProps {
  uploadedFile: File;
  pageCount: number;
}

const DropzoneInfoFile: React.FC<DropzoneInfoFileProps> = ({ uploadedFile, pageCount }) => {
  return (
    <div className="bg-gray-50 border border-gray-200 w-full py-2 px-4 rounded-md">
      <div className="text-sm flex flex-col gap-2">
        <ul className="flex flex-col gap-1">
          <li>{uploadedFile.name}</li>
          <li>Tamaño: {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</li>
          <li>Páginas: {pageCount}</li>
        </ul>
      </div>
    </div>
  );
};

export default DropzoneInfoFile;