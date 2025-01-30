import React from 'react';
import { Button } from "../components/ui/button";

const DownloadApkPage = () => {
  // Ruta al archivo APK dentro de src/files
  const apkUrl = '/files/apk.apk';

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 font-sans">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Descarga Nuestra Aplicación</h1>
      <p className="text-gray-600 mb-6">
        Haz clic en el botón de abajo para descargar la APK.
      </p>
      <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md">
        <a href={apkUrl} download>
          Descargar APK
        </a>
      </Button>
    </div>
  );
};

export default DownloadApkPage;