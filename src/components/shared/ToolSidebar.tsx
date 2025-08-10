// src/components/shared/ToolSidebar.tsx
'use client';

import { ReactNode, useState } from 'react';
import { usePdf } from '@/app/contexts/PdfContext';
import { ChevronDown, ChevronUp, File as FileIcon } from 'lucide-react';
import { formatFileSize } from '@/lib/utils';

interface ToolSidebarProps {
  toolInfoSection: ReactNode;  // Espacio para la información específica de la herramienta
  actionButton: ReactNode;     // Espacio para el botón de acción principal
  actionDescription: string;   // Texto de ayuda para el botón
  documentDetails?: ReactNode;
}

export default function ToolSidebar({ 
  toolInfoSection, 
  actionButton, 
  actionDescription,
  documentDetails
 }: ToolSidebarProps) {
  const { currentFile, pageCount } = usePdf();
  const [showSidebar, setShowSidebar] = useState(false);

  if (!currentFile && !documentDetails) return null;

  return (
    <aside 
      className="md:col-start-5 md:col-span-2 h-fit fixed left-0 bottom-0 right-0 md:left-auto md:sticky md:top-4 md:p-0">
      <div 
        onClick={() => setShowSidebar(!showSidebar)}
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
        <div className={"p-4 pb-0" + (showSidebar ? ' block' : ' hidden') + " md:block"}>
          
          {documentDetails ? (
            documentDetails
          ) : currentFile ? (
            <>
              <div className="space-y-2 text-sm text-gray-700">
                <h3 className="flex font-semibold text-lg items-center gap-2 mb-3">
                  <FileIcon className="h-5 w-5 text-black" />
                  Detalles del Documento
                </h3>
                <div className="flex justify-between">
                  <span className="text-black">Nombre:</span>
                  <span className="truncate max-w-[150px]" title={currentFile?.name}>
                    {currentFile?.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Páginas Totales:</span>
                  <span>{pageCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Tamaño:</span>
                  <span>{formatFileSize(currentFile?.size || 0)}</span>
                </div>
              </div>
            </>
          ) : null}
        </div>
        
        <div className={"p-4 border-b flex-grow" + (showSidebar ? ' block' : ' hidden') + " md:block"}>
          {toolInfoSection}
        </div>
        
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