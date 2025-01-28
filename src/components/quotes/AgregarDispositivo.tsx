import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../components/ui/dialog";
import axios from "../../axiosConfig";

interface AgregarDispositivoProps {
  isOpen: boolean;
  onClose: () => void;
  onDispositivoAgregado: () => void;
}

export function AgregarDispositivo({ isOpen, onClose, onDispositivoAgregado }: AgregarDispositivoProps) {
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [precio, setPrecio] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await axios.post("/devices", {
        marca,
        modelo,
        precio: Number(precio),
      });

      setMarca("");
      setModelo("");
      setPrecio("");
      onDispositivoAgregado();
      onClose();
    } catch (err: any) {
      setError("Error al agregar el dispositivo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Agregar Nuevo Dispositivo</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="marca">Marca</Label>
            <Input id="marca" value={marca} onChange={(e) => setMarca(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="modelo">Modelo</Label>
            <Input id="modelo" value={modelo} onChange={(e) => setModelo(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="precio">Precio</Label>
            <Input id="precio" type="number" value={precio} onChange={(e) => setPrecio(e.target.value)} required />
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Agregando..." : "Agregar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
