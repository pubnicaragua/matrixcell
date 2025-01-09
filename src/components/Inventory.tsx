import React, { useState, useEffect } from 'react';
import supabase from '../api/supabase'; // Assuming this is the file where you've set up your Supabase client
import api from '../axiosConfig';

interface FileInfo {
  name: string;
  url: string;
}

interface InventoryItem {
  id: number;
  store_id: number;
  product_id: number;
  stock: number;
  created_at: string;
  products: {
    id: number;
    models: {
      id: number;
      name: string;
    };
    article: string;
  };
  store: {
    id: number;
    name: string;
  };
}

interface Store {
  id: number;
  name: string;
}

const FileUploader: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedStore, setSelectedStore] = useState<number | string>(''); // Changed to number for store id
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [editingStock, setEditingStock] = useState<number>(0);
  const [editingProduct, setEditingProduct] = useState<number>(0);
  const [editingStore, setEditingStore] = useState<number>(0);

  useEffect(() => {
    checkAuth();
    fetchFiles();
    fetchInventory();
    fetchStores();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
  };

  const fetchFiles = async () => {
    try {
      const { data, error } = await supabase.storage.from('Inventarios').list();

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
              url: urlData.publicUrl,
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

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const response = await api.get('/inventories');
      setInventory(response.data);
    } catch (error) {
      setError('Error fetching inventory');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStores = async () => {
    try {
      const response = await api.get('/stores');
      setStores(response.data);
    } catch (error) {
      setError('Error fetching stores');
      console.error(error);
    }
  };
  const handleEditClick = (item: InventoryItem) => {
    setEditingItem(item);
    setEditingStock(item.stock);
    setEditingProduct(item.product_id);
    setEditingStore(item.store_id);
  };
  const handleEditSubmit = async () => {
    if (!editingItem) return;

    try {
      const response = await api.put(`/inventories/${editingItem.id}`, {
        cantidad: editingStock,
        product_id:editingProduct,
        store_id:editingStore
      });
      setInventory(prev =>
        prev.map(item =>
          item.id === editingItem.id ? { ...item, stock: editingStock,product_id:editingProduct,store_id:editingStore } : item
        )
      );
      await fetchInventory();
      setEditingItem(null);
      setError(null);
    } catch (error) {
      console.error('Failed to update item:', error);
      setError('Failed to update item');
    }
  };

  const handleEditCancel = () => {
    setEditingItem(null);
    setEditingStock(0);
  };
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
  /*  if (!isAuthenticated) {
      setError('Por seguridad, debes añadir tus credenciales para subir el archivo');
      return;
    }*/

    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      // Upload file to Supabase storage
      const { error } = await supabase.storage.from('Inventarios').upload(file.name, file);

      if (error) {
        throw error;
      }

      // Get the public URL for the uploaded file
      const { data: urlData } = supabase.storage.from('Inventarios').getPublicUrl(file.name);

      if (!urlData || !urlData.publicUrl) {
        throw new Error('Failed to retrieve public URL');
      }

      const formData = new FormData();
      formData.append('file', file);

      // Send file data to the API endpoint
      await api.post('/products/masive-insert', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Refresh the file list
      await fetchFiles();
      await fetchInventory();
      setFile(null);
    } catch (error) {
      console.error('Error during file upload:', error);
      setError('Failed to upload and process file');
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

  const handleMoveStore = async (itemId: number,cantidad:number,product_id:number) => {
    if (!selectedStore) {
      setError('Please select a store to move inventory');
      return;
    }

    try {
      const response = await api.post('/inventories/store-moved', {
        product_id,
        origen_store:itemId,
        destino_store: selectedStore,
        cantidad,
      });

      const updatedStore = stores.find(store => store.id === selectedStore);

      // If no store is found, handle it appropriately (e.g., set an error or assign a default store)
      if (!updatedStore) {
        setError('Store not found');
        return;
      }

      setInventory(prev => prev.map(item =>
        item.id === itemId ? { ...item, store: updatedStore } : item
      ));
      await fetchInventory();
      setSelectedStore('');
      setError(null);
    } catch (error) {
      setError('Failed to move item to the new store');
      console.error(error);
    }
  };

  // Función para manejar el cambio de tienda
  const handleStoreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStore(Number(e.target.value));  // Solo actualizas el estado de selectedStore
  };

  const handleDelete = async (itemId: number) => {
    try {
      await api.delete(`/inventories/${itemId}`);
      setInventory(prev => prev.filter(item => item.id !== itemId));
      setError(null);
    } catch (error) {
      setError('Failed to delete item');
      console.error(error);
    }
  };

  return (
    <div className= "p-4" >
    <h1 className="text-2xl font-bold mb-4" > File Uploader </h1>

      <div  className = "mb-4" >
        <input type="file" onChange = { handleFileChange } className = "mb-2" />
          <button
          onClick={ handleUpload }
  disabled = { uploading || !file
}
className = "bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
  >
  { uploading? 'Uploading...': 'Upload' }
  </button>
  </div>

{ error && <p className="text-red-500 mb-4" > { error } </p> }

<h2 className="text-xl font-semibold mb-2" > Uploaded Files: </h2>
  <ul>
{
  files.map((file, index) => (
    <li key= { index } className = "mb-2" >
    { file.name }{ ' '}
  < button
              onClick = {() => handleDownload(file.url, file.name)}
className = "bg-green-500 text-white px-2 py-1 rounded text-sm"
  >
  Download
  </button>
  </li>
        ))}
</ul>

  < h2 className = "text-xl font-semibold mt-8 mb-2" > Inventory Management </h2>
    < table className = "table-auto w-full mb-4" >
      <thead>
      <tr>
      <th className="px-4 py-2" > ID </th>
        < th className = "px-4 py-2" > Producto </th>
          < th className = "px-4 py-2" > Stock </th>
            < th className = "px-4 py-2" > Tienda </th>
              < th className = "px-4 py-2" > Accciones </th>
                </tr>
                </thead>
                <tbody>
{
  loading ? (
    <tr>
    <td colSpan= { 5} className = "text-center py-4" > Loading...</td>
      </tr>
          ) : (
    inventory.map(item => (
      <tr key= { item.id } >
      <td className="px-4 py-2" > { item.id } </td>
    < td className = "px-4 py-2" > { item.products.article } </td>
    <td className="px-4 py-2">
                  {editingItem?.id === item.id ? (
                    <input
                      type="number"
                      value={editingStock}
                      onChange={e => setEditingStock(Number(e.target.value))}
                      className="border px-2 py-1 w-full"
                    />
                  ) : (
                    item.stock
                  )}
                </td>
    < td className = "px-4 py-2" >
    { item.store.name }
    < select
value = { selectedStore || ""}
onChange = { handleStoreChange }
className = "border px-2 py-1"
  >
  <option value="" > Select Store </option>
{
  stores.map(store => (
    <option key= { store.id } value = { store.id } > { store.name } </option>
  ))
}
</select>
  < button
onClick = {() => handleMoveStore(item.store.id,item.stock,item.product_id)}
className = "bg-yellow-500 text-white px-2 py-1 rounded ml-2"
  >
  Move
  </button>
  </td>
  < td className = "px-4 py-2" >
  {editingItem?.id === item.id ? (
    <>
      <button
        onClick={handleEditSubmit}
        className="bg-green-500 text-white px-2 py-1 rounded mr-2"
      >
        Save
      </button>
      <button
        onClick={handleEditCancel}
        className="bg-gray-500 text-white px-2 py-1 rounded"
      >
        Cancel
      </button>
    </>
  ) : (
    <>
      <button
        onClick={() => handleEditClick(item)}
        className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
      >
        Edit
      </button>
      <button
        onClick={() => handleDelete(item.id)}
        className="bg-red-500 text-white px-2 py-1 rounded"
      >
        Delete
      </button>
    </>
  )}
  </td>
  </tr>
            ))
          )}
</tbody>
  </table>
  </div>
  );
};

export default FileUploader;
