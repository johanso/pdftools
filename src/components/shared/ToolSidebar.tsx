// src/components/shared/ToolSidebar.tsx
'use client';

import { ReactNode, useRef, useState } from 'react';
import { usePdf } from '@/app/contexts/PdfContext';
import { ArrowDown01, ArrowUp, ChevronDown, ChevronUp, File as FileIcon } from 'lucide-react';

interface ToolSidebarProps {
  toolInfoSection: ReactNode;  // Espacio para la información específica de la herramienta
  actionButton: ReactNode;     // Espacio para el botón de acción principal
  actionDescription: string;   // Texto de ayuda para el botón
}

// Función auxiliar que ahora vive aquí
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export default function ToolSidebar({ toolInfoSection, actionButton, actionDescription }: ToolSidebarProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const { currentFile, pageCount } = usePdf();
  const [showSidebar, setShowSidebar] = useState(false);

  if (!currentFile) return null;

  const handleShowSidebar = (show: boolean) => {
    // Mostrar oculatar el sidebar
    setShowSidebar(!showSidebar);
    // Scroll al elemento
  }

  return (
    <aside 
      className="md:col-start-5 md:col-span-2 h-fit fixed left-0 bottom-0 right-0 md:left-auto md:sticky md:top-24 md:p-0">


      <div 
        onClick={() => handleShowSidebar(false)}
        className='md:hidden mx-auto w-12 h-8 bg-white rounded relative top-1 border border-gray-200 border-b-0 flex items-center justify-center cursor-pointer'>
        {
          showSidebar ? (
            <ChevronDown className="h-5 w-5" />
          ) : (
            <ChevronUp className="h-5 w-5" />
          )
        }
      </div>

      <div className="bg-white border flex flex-col h-full rounded-xl">
        
        <div className={"p-4 border-b" + (showSidebar ? ' block' : ' hidden') + " md:block"}>
          <h3 className="flex font-semibold text-lg items-center gap-2 mb-3">
            <FileIcon className="h-5 w-5" />
            Detalles del Documento
          </h3>
          <div className="space-y-2 text-sm text-gray-700">
            <div className="flex justify-between">
              <span className="text-gray-700">Nombre:</span>
              <span className="truncate max-w-[150px]" title={currentFile.name}>
                {currentFile.name}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Páginas Totales:</span>
              <span>{pageCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Tamaño:</span>
              <span>{formatFileSize(currentFile.size)}</span>
            </div>
          </div>
        </div>
        
        {/* SECCIÓN 2: SECCIÓN ESPECÍFICA DE LA HERRAMIENTA (Inyectada) */}
        <div className={"p-4 border-b flex-grow" + (showSidebar ? ' block' : ' hidden') + " md:block"}>
          {toolInfoSection}
        </div>
        
        {/* SECCIÓN 3: ACCIONES (Botón y descripción inyectados) */}
        <div className="p-4 bg-white md:bg-gray-50 overflow-hidden rounded-b-xl">
           {actionButton}
            <p className={"text-xs text-center text-gray-700 mt-4 " + (showSidebar ? ' block' : ' hidden') + " md:block"}>
              {actionDescription}
            </p>
        </div>
      </div>
    </aside>
  );
}