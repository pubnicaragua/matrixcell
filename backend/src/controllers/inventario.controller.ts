import { Request, Response } from "express";
import supabase from "../config/supabaseClient";
import { BaseService } from "../services/base.service";
import { MovimientoInventario } from "../models/movimientoInventario.model";
import { Inventory } from "../models/inventory.model";
import { error } from "console";

const tableName = 'inventory'
export const InventoryController = {
    async getAllInventory(req: Request, res: Response) {
        try {
            const where = { ...req.query }; // Convertir los parámetros de consulta en filtros
            const inventarios = await BaseService.getAll<Inventory>(tableName, ['id', 'store_id', 'product_id', 'stock', 'created_at', 'products(id,article,price,busines_price,models(id,name),categories(id,name))', 'store(id,name)', 'imei'], where);
            res.json(inventarios);
        } catch (error) {
            console.error(error);
            res.status(500).send('Error al obtener inventarios');
        }
    },
    async inventoryMoved(req: Request, res: Response) {
        try {
            // Datos recibidos desde el frontend
            const { userId } = req;
            const { store_id, inventario_id, cantidad, tipo_movimiento, motivo, codigoProducto } = req.body;

            let inventario;

            // Verificar si se proporciona inventario_id primero
            if (inventario_id) {
                // Paso 1: Buscar el inventario utilizando el inventario_id
                const { data: inventarioData, error: inventarioError } = await supabase
                    .from('inventory')
                    .select('*')
                    .eq('id', inventario_id)  // Filtrar por inventario_id
                    .eq('store_id', store_id)  // Filtrar por store_id
                    .single();

                // Si no existe inventario para el inventario_id, retornar un error
                if (inventarioError || !inventarioData) {
                    throw new Error('Inventario no encontrado para este inventario_id y store.');
                }
                inventario = inventarioData;  // Usamos el inventario encontrado
            } else if (codigoProducto) {
                // Paso 2: Buscar el producto por el codigoProducto y luego el inventario
                const { data: producto, error: productoError } = await supabase
                    .from('productos')
                    .select('product_id')
                    .eq('codigo', codigoProducto)
                    .single();

                // Si no se encuentra el producto, retornar un error
                if (productoError || !producto) {
                    throw new Error('Producto no encontrado con el código proporcionado.');
                }

                const product_id = producto.product_id;  // Guardamos el ID del producto encontrado

                // Paso 3: Buscar el inventario utilizando el product_id y store_id
                const { data: inventarioData, error: inventarioError } = await supabase
                    .from('inventory')
                    .select('*')
                    .eq('product_id', product_id)  // Filtrar por product_id
                    .eq('store_id', store_id)     // Filtrar por store_id
                    .single();

                // Si no existe inventario para el producto en esa store, retornar un error
                if (inventarioError || !inventarioData) {
                    throw new Error('Inventario no encontrado para este producto en la store especificada.');
                }
                inventario = inventarioData;  // Usamos el inventario encontrado
            } else {
                throw new Error('Se debe proporcionar al menos un inventario_id o codigoProducto.');
            }

            // Definir el cambio en cantidad_fisica y stock dependiendo del tipo de movimiento
            let cambioCantidadFisica = 0;
            let cambioStock = 0;

            // Lógica de acuerdo al tipo de movimiento
            if (tipo_movimiento === 'entrada') {
                cambioCantidadFisica = cantidad;
                cambioStock = cantidad;
            } else if (tipo_movimiento === 'salida') {
                cambioCantidadFisica = -cantidad;
                cambioStock = -cantidad;
            } else if (tipo_movimiento === 'ajuste') {
                cambioCantidadFisica = cantidad;
                cambioStock = 0;  // El ajuste no afecta el stock
            } else {
                throw new Error('Tipo de movimiento no válido. Use "entrada", "salida" o "ajuste".')
            }

            // Paso 4: Actualizar el inventario según el tipo de movimiento
            const { data: updatedInventario, error: updateError } = await supabase
                .from('inventory')
                .update({
                    cantidad_fisica: inventario.stock + cambioStock,
                    stock: inventario.stock + cambioStock,
                })
                .eq('id', inventario.id);

            // Registrar el movimiento de inventario
            await BaseService.create<MovimientoInventario>('movimiento_inventario', {
                inventario_id: inventario.id,
                cantidad,
                tipo_movimiento,
                motivo
            }, userId);

            // Si hubo un error al actualizar el inventario
            if (updateError) {
                throw new Error('Error al actualizar el inventario.')
            }

            // Devolver la respuesta con el inventario actualizado
            res.status(200).json({
                mensaje: 'Movimiento registrado correctamente',
                inventario_actualizado: updatedInventario,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al registrar el movimiento de inventario.' });
        }
    },
    async storeMoved(req: Request, res: Response) {
        const { product_id, origen_store, destino_store, cantidad } = req.body;
        try {
            // Verificar stock en la store de origen
            const { data: sourceStock, error: stockError } = await supabase
                .from('inventory')
                .select('stock')
                .eq('product_id', product_id)
                .eq('store_id', origen_store)
                .single();

            if (stockError || !sourceStock || sourceStock.stock < cantidad) {
                res.status(400).json({ error: 'Stock insuficiente' });
            }
            // Reducir stock en la store de origen
            const { error: updateSourceError } = await supabase
                .from('inventory')
                .update({
                    stock: sourceStock?.stock - cantidad,
                    cantidad_fisica: sourceStock?.stock - cantidad
                })
                .eq('product_id', product_id)
                .eq('store_id', origen_store);

            if (updateSourceError) {
                throw new Error('Error al actualizar stock de origen');

            }
            // Verificar y actualizar o insertar stock en la store destino
            const { data: destStock } = await supabase
                .from('inventory')
                .select('stock, cantidad_fisica')
                .eq('product_id', product_id)
                .eq('store_id', destino_store)
                .single();

            if (destStock) {
                const { error: updateDestError } = await supabase
                    .from('inventory')
                    .update({
                        stock: destStock.stock + cantidad,
                        cantidad_fisica: destStock.cantidad_fisica + cantidad
                    })
                    .eq('product_id', product_id)
                    .eq('store_id', destino_store);

                if (updateDestError) {
                    throw new Error('Error al actualizar stock de destino: '+updateDestError.message);
                }
            } else {
                const { error: insertDestError } = await supabase
                    .from('inventory')
                    .insert({
                        product_id,
                        store_id: destino_store,
                        stock: cantidad,
                        cantidad_fisica: cantidad
                    });

                if (insertDestError) {
                    throw new Error('Error al insertar stock en destino: '+insertDestError.message);
                }
            }

            // Registrar el movimiento
            const { error: movementError } = await supabase
                .from('transfer')
                .insert({
                    product_id,
                    origin_store: origen_store,
                    destination_store: destino_store,
                    quantity: cantidad,
                });

            if (movementError) {
                throw new Error(movementError.message);
            }

            // Responder con éxito
            res.status(200).json({ message: 'Transferencia completada correctamente' });

        } catch (error: any) {
            console.error(error);
            res.status(500).json({ error: `Error en transferencia: ${error.message}` });
        }
    },
    async updateInventory(req: Request, res: Response) {
        const { product_id, store_id, cantidad, imei } = req.body;
        const imei_product = imei === undefined ? null : imei;
        try {
            // Verificar que la cantidad a editar sea válida
            if (cantidad <= 0) {
                throw new Error('La cantidad debe ser mayor a cero');
            }

            // Verificar si el producto existe en el inventario de la tienda
            const { data: currentStock, error: stockError } = await supabase
                .from('inventory')
                .select('stock, cantidad_fisica')
                .eq('product_id', product_id)
                .eq('store_id', store_id)
                .single();

            if (stockError) {
                throw new Error( 'Error al verificar el stock: '+stockError.message);
            }

            if (!currentStock) {
                throw new Error( 'Producto no encontrado en la tienda');
            }

            // Actualizar el stock en la tienda
            const { error: updateError } = await supabase
                .from('inventory')
                .update({
                    stock: cantidad,
                    cantidad_fisica: cantidad,
                    imei: imei_product
                })
                .eq('product_id', product_id)
                .eq('store_id', store_id);

            if (updateError) {
                throw new Error( 'Error al actualizar el stock: '+updateError.message);
            }
            // Responder con éxito
            res.status(200).json({ message: 'Stock editado correctamente' });

        } catch (error: any) {
            console.error(error);
            res.status(500).json({ error: `Error en la edición: ${error.message}` });
        }
    },
    async deleteInventory(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { userId } = req;

            await BaseService.delete<Inventory>('inventory', id, userId);
            res.json({ message: 'Client eliminada correctamente' });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }
}