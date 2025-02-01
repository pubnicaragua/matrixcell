import React from 'react';
import { Button } from "../components/ui/button";
import { Download } from 'lucide-react';

const DescargarApk = () => {
  // Ruta al archivo APK dentro de src/files
  const apkUrl = '/files/apk.apk';

  return (
    <Button 
      asChild 
      variant="outline"
      className="w-full bg-white hover:bg-gray-100 text-gray-800 w-50 font-semibold py-2 px-4 border border-gray-400 rounded shadow transition duration-300 ease-in-out transform hover:scale-105"
    >
      <a href={apkUrl} download className="flex items-center justify-center">
        <Download className="mr-2 h-4 w-4" />
        Descargar nuestra app
      </a>
    </Button>
  );
};

export default DescargarApk;
