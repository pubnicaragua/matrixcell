import React, { useState, useEffect } from 'react';
import supabase from '../api/supabase'; // Assuming this is the file where you've set up your Supabase client

interface FileInfo {
  name: string;
  url: string;
}

const FileUploader: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const { data, error } = await supabase.storage
        .from('Inventarios')
        .list();

      if (error) {
        throw error;
      }

      if (data) {
        const fileInfos: FileInfo[] = await Promise.all(
          data.map(async (item) => {
            const { data: urlData } = supabase.storage
              .from('Inventarios')
              .getPublicUrl(item.name);
            return {
              name: item.name,
              url: urlData.publicUrl
            };
          })
        );
        setFiles(fileInfos);
      }
    } catch (error) {
      console.error('Error fetching files:', error);
      setError('Failed to fetch files');
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const { error } = await supabase.storage
        .from('Inventarios')
        .upload(file.name, file);

      if (error) {
        throw error;
      }

      await fetchFiles(); // Refresh the file list
      setFile(null);
    } catch (error) {
      console.error('Error uploading file:', error);
      setError('Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (fileUrl: string, fileName: string) => {
    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading file:', error);
      setError('Failed to download file');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">File Uploader</h1>
      
      <div className="mb-4">
        <input
          type="file"
          onChange={handleFileChange}
          className="mb-2"
        />
        <button
          onClick={handleUpload}
          disabled={uploading || !file}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <h2 className="text-xl font-semibold mb-2">Uploaded Files:</h2>
      <ul>
        {files.map((file, index) => (
          <li key={index} className="mb-2">
            {file.name}{' '}
            <button
              onClick={() => handleDownload(file.url, file.name)}
              className="bg-green-500 text-white px-2 py-1 rounded text-sm"
            >
              Download
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileUploader;

