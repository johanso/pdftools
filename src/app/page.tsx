'use client';

import PdfUploadContainer from "../components/pdf-upload/PdfUploadContainer";


export default function Home() {

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-8 sm:p-20">
      <div className="w-full max-w-2xl">
        <PdfUploadContainer />
      </div>
    </main>
  );
}
