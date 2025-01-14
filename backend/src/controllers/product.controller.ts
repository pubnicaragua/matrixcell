import { Request, Response } from "express";
import supabase from "../config/supabaseClient";
import * as xlsx from 'xlsx';
import { BaseService } from "../services/base.service";
import { createProduct, createProductModel } from "../services/inventory.service";
import { ProductoExcel } from "../interface/productExcel.interface";

const tableName = 'products'; // Nombre de la tabla en la base de datos

export const ProductController = {
async getAllProducts(req: Request, res: Response) {
        try {
            const where = { ...req.query };
            const products = await BaseService.getAll<Product>(tableName, ['id', 'created_at', 'code', 'model_id', 'models(id,name)','categories(id,name)','price','busines_price'], where);
            res.json(products);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    },

async masiveProductInventory(req: Request, res: Response) {
        try {
            // Define las interfaces para estructurar los datos del Excel e inventarios
            interface InventarioData {
                id?: string;
                producto_id: string;
                store_id: string;
                modelo_producto: string; // ID del modelo de producto
                stock: number;
                cantidad_fisica: number;
            }

            // Verifica si el archivo está presente
            if (!req.file) {
                throw new Error('Archivo no encontrado.');
            }

            // Leer el archivo Excel y convertirlo en un array de objetos
            const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const data = xlsx.utils.sheet_to_json<ProductoExcel>(sheet);

            // Obtener los códigos únicos de tienda
            const storeCodes = [...new Set(data.map((item) => item.store))];

            // Consultar las tiendas en la base de datos
            const { data: stores, error: storeError } = await supabase
                .from('store')
                .select('id, name')
                .in('name', storeCodes);

            if (storeError) {
                throw new Error(`Error al obtener tiendas: ${storeError.message}`);
            }

            if (!stores || stores.length === 0) {
                throw new Error('No se encontraron tiendas para los códigos proporcionados.');
            }

            const inventarios: InventarioData[] = [];

            for (const item of data) {
                // Buscar o crear el modelo del producto
                const { data: model, error: modelError } = await supabase
                    .from('models')
                    .select('id')
                    .eq('name', item.modelo_producto)
                    .single();

                const modeloId = model?.id || (await createProductModel(item.modelo_producto));  
                
                
                const { data: categories, error: categoryError } = await supabase
                    .from('categories')
                    .select('id')
                    .eq('code', item.code_category)
                    .single();

                const categoryId = categories?.id ;

                // Buscar o crear el producto
                const { data: producto, error: productoError } = await supabase
                    .from('products')
                    .select('id')
                    .eq('codigo', item.codigo_item)
                    .single();
                const productoId = producto?.id || (await createProduct(item, modeloId,categoryId));

                // Buscar la tienda correspondiente
                const store = stores.find((s) => s.name === item.store);
                if (!store) {
                    throw new Error(`No se encontró la tienda con el código: ${item.store}`);
                }

                // Consultar o preparar inventario
                const { data: inventario, error: inventarioError } = await supabase
                    .from('inventory')
                    .select('id, stock, cantidad_fisica')
                    .eq('producto_id', productoId)
                    .eq('store_id', store.id)
                    .single();

                const stockActualizado = (inventario?.stock ?? 0) + item.Cantidad;
                const cantidadFisicaActualizada = (inventario?.cantidad_fisica ?? 0) + item.Cantidad;

                if (inventario) {
                    inventarios.push({
                        id: inventario.id,
                        producto_id: productoId,
                        store_id: store.id,
                        modelo_producto: modeloId,
                        stock: stockActualizado,
                        cantidad_fisica: cantidadFisicaActualizada,
                    });
                } else {
                    inventarios.push({
                        producto_id: productoId,
                        store_id: store.id,
                        modelo_producto: modeloId,
                        stock: stockActualizado,
                        cantidad_fisica: cantidadFisicaActualizada,
                    });
                }
            }

            // Actualizar o insertar inventarios
            await Promise.all(
                inventarios.map(async (inventario) => {
                    if (inventario.id) {
                        // Actualizar inventario existente
                        const { error: updateError } = await supabase
                            .from('inventory')
                            .update({
                                stock: inventario.stock,
                                cantidad_fisica: inventario.cantidad_fisica,
                            })
                            .eq('id', inventario.id);

                        if (updateError) {
                            throw new Error(`Error al actualizar inventario: ${updateError.message}`);
                        }
                    } else {
                        // Insertar nuevo inventario
                        const { error: insertError } = await supabase
                            .from('inventory')
                            .insert({
                                product_id: inventario.producto_id,
                                store_id: inventario.store_id,
                                stock: inventario.stock,
                                cantidad_fisica: inventario.cantidad_fisica,
                            });

                        if (insertError) {
                            throw new Error(`Error al insertar inventario: ${insertError.message}`);
                        }
                    }
                })
            );

            res.status(200).json({
                message: 'Products, modelos e inventarios actualizados correctamente.',
                data: inventarios,
            });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    },

 



}