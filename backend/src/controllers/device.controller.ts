import { Request, Response } from "express";
import { Device } from "../models/device.model";
import { Notification } from "../models/notification.model";
import { validateDevice } from "../requests/device.request";
import { BaseService } from "../services/base.service";
import { DeviceResource } from "../resources/device.resource";
import supabase from "../config/supabaseClient";
import * as XLSX from 'xlsx';
import { generarCedulaEcuatoriana, generarCodigoDesbloqueo } from "../services/client.service";
import { Client } from "../models/client.model";
import { io } from "..";


const tableName = 'devices'; // Nombre de la tabla en la base de datos
export const DeviceController = {

    async getAllDevices(req: Request, res: Response) {
        try {
            const where = { ...req.query };
            //const devices = await BaseService.getAll<Device>(tableName, ['id', 'created_at', 'imei', 'owner', 'store_id', 'brand', 'model', 'price', 'status', 'unlock_code'], where);
            const devices = await BaseService.getAll<Device>(tableName, ['id', 'created_at', 'imei', 'owner', 'store_id', 'status', 'unlock_code', 'marca', 'modelo', 'price'], where);

            // Asegurarse de que `formatDevice` pueda manejar un arreglo de dispositivos
            res.json(devices.map(device => DeviceResource.formatDevice(device)));
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    },


    async createDevice(req: Request, res: Response) {
        try {
            validateDevice(req.body); // Validar los datos
            const { userId } = req;
            const device = await BaseService.create<Device>(tableName, req.body, userId);
            res.status(201).json(DeviceResource.formatDevice(device));
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    },

    async updateDevice(req: Request, res: Response) {
        try {
            const { id } = req.params;
            validateDevice(req.body);
            const { userId } = req;
            const device = await BaseService.update<Device>(tableName, parseInt(id), req.body, userId);

            if (device.status === 'Desbloqueado') {
                const unlockCode = generarCodigoDesbloqueo();

                const { error: errorActualizacion } = await supabase
                    .from('devices')
                    .update({ unlock_code: unlockCode })
                    .eq('id', id);

                if (errorActualizacion) {
                    throw new Error('Error actualizando el código de desbloqueo.');
                }

                // Emitir evento de desbloqueo usando Socket.IO
                io.to(`device_${device.imei}`).emit('device-unblocked', {
                    blocked: false,
                    deviceId: id,
                    unlockCode: unlockCode
                });
            } else if (device.status === 'Bloqueado') {
                // Emitir evento de bloqueo usando Socket.IO
                io.to(`device_${device.imei}`).emit('device-blocked', {
                    blocked: true,
                    deviceId: id,
                    reason: 'Dispositivo bloqueado por actualización'
                });
            }

            res.json(DeviceResource.formatDevice(device));
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    },

    async deleteDevice(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { userId } = req;

            await BaseService.delete<Device>(tableName, id, userId);
            res.json({ message: 'Device eliminada correctamente' });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    },
    async processMasiveDevices(req: Request, res: Response) {
        try {

            // Verifica si hay un archivo cargado
            if (!req.file) {
                throw new Error('Archivo no encontrado.');
            }
            type DeviceRow = {
                imei: string;
                action: 'bloqueado' | 'desbloqueado';
            };
            // Lee el archivo Excel
            const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
            const sheetName = workbook.SheetNames[0]; // Usamos la primera hoja del archivo
            const sheetData: DeviceRow[] = XLSX.utils.sheet_to_json<DeviceRow>(workbook.Sheets[sheetName]);

            // Valida que el archivo tenga datos
            if (sheetData.length === 0) {
                throw new Error('El archivo está vacío.');
            }

            // Procesar cada fila (se espera que tenga las columnas "imei" y "action")
            const results: { imei: string; status: string }[] = [];
            for (const row of sheetData) {
                const imei = row['imei'];
                const action = row['action']; // "block" o "unblock"

                if (!imei || !['bloqueado', 'desbloqueado'].includes(action)) {
                    results.push({ imei, status: 'Datos inválidos.' });
                    continue;
                }

                // Lógica para bloquear/desbloquear el dispositivo (Supabase u otro servicio)
                const { error } =
                    action === 'bloqueado'
                        ? await supabase.from('devices').update({ status: 'Bloqueado' }).eq('imei', imei)
                        : await supabase.from('devices').update({ status: 'Desbloqueado' }).eq('imei', imei);

                if (error) {
                    results.push({ imei, status: `Error: ${error.message}` });
                } else {
                    results.push({ imei, status: `${action === 'bloqueado' ? 'Bloqueado' : 'Desbloqueado'} exitosamente` });
                }
            }

            res.status(200).json({ message: 'Procesamiento completo.', results });
        } catch (error) {
            console.error('Error al procesar dispositivos:', error);
            res.status(500).json({ error: 'Error interno del servidor.' });
        }
    },
    async insertMasiveDevices(req: Request, res: Response) {
        try {
            // Verifica si hay un archivo cargado
            if (!req.file) {
                throw new Error('Archivo no encontrado.');
            }

            // Tipo de datos esperados en el archivo Excel
            type DeviceRow = {
                'Nombre': string; // Nombre del cliente
                'Modelo': string;        // Modelo del dispositivo
                'IMEI': string;          // IMEI del dispositivo
                'Marca': string;         // Marca del dispositivo
            };

            // Lee el archivo Excel
            const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
            const sheetName = workbook.SheetNames[0]; // Usamos la primera hoja del archivo
            const sheetData: DeviceRow[] = XLSX.utils.sheet_to_json<DeviceRow>(workbook.Sheets[sheetName]);

            // Valida que el archivo tenga datos
            if (sheetData.length === 0) {
                res.status(400).json({ error: 'El archivo está vacío.' });
            }

            // Obtén nombres únicos de clientes y stores
            const nombresClientes = Array.from(new Set(sheetData.map(row => row['Nombre'])));

            // Busca IDs de clientes existentes
            const { data: clientesExistentes, error: errorClientes } = await supabase
                .from('clients')
                .select('id, name')
                .ilike('name', `%${nombresClientes}%`);

            if (errorClientes) {
                res.status(500).json({ error: `Error al obtener IDs de clientes: ${errorClientes.message}` });
            }

            // Determina clientes que no existen
            const clientesExistentesSet = new Set(clientesExistentes?.map(client => client.name));
            const nuevosClientes = nombresClientes.filter(nombre => !clientesExistentesSet.has(nombre));

            // Inserta nuevos clientes
            if (nuevosClientes.length > 0) {
                const nuevosClientesInsertar = nuevosClientes.map(name => ({ name, identity_number: generarCedulaEcuatoriana() }));
                const { data: nuevosClientesData, error: errorInsertClientes } = await supabase
                    .from('clients')
                    .insert(nuevosClientesInsertar)
                    .select();

                if (errorInsertClientes) {
                    throw new Error(`Error al insertar nuevos clientes: ${errorInsertClientes.message}`);
                }

                // Agrega los nuevos clientes al mapa de IDs
                nuevosClientesData?.forEach(cliente => {
                    clientesExistentesSet.add(cliente.name);
                    clientesExistentes?.push(cliente);
                });
            }

            // Crea un mapa de nombres de clientes a IDs
            const clienteIdMap = new Map(clientesExistentes?.map(client => [client.name, client.id]));

            // Construye los datos para la inserción
            const devicesToInsert = sheetData.map(row => {
                const clienteId = clienteIdMap.get(row['Nombre']);

                if (!clienteId) {
                    throw new Error(`No se encontró un cliente con el nombre: ${row['Nombre']}`);
                }

                return {
                    owner: clienteId,
                    imei: row.IMEI,
                    modelo: row['Modelo'] || '',
                    marca: row['Marca'] || '',
                    status: 'Desbloqueado',
                };
            });

            // Inserción masiva de dispositivos
            const { error: errorInsert } = await supabase.from('devices').insert(devicesToInsert);
            if (errorInsert) {
                throw new Error(`Error al insertar dispositivos: ${errorInsert.message}`);
            }

            res.status(200).json({ message: 'Dispositivos insertados exitosamente.' });
        } catch (error: any) {
            res.status(500).json({ error: 'Error interno del servidor.', details: error.message });
        }
    },

    async blockDevices(req: Request, res: Response) {
        const { id } = req.params;

        if (!id) {
            throw new Error('El ID del dispositivo es requerido.');
        }

        try {
            // Actualizar el estado del dispositivo a "blocked"
            const { data: device, error } = await supabase
                .from('devices')
                .update({ status: 'Bloqueado' })
                .eq('id', id)
                .select('imei')
                .single();

            if (error) {
                throw new Error('Error al bloquear el dispositivo en la base de datos.');
            }

            if (!device) {
                throw new Error('Dispositivo no encontrado.');
            }

            // Obtener el push_token del dispositivo bloqueado
            const pushToken = device?.imei;

            // Enviar notificación si el push_token existe
            if (pushToken) {
                const message = {
                    body: 'Tu dispositivo ha sido bloqueado. Por favor, realiza el pago para desbloquearlo.',
                    data: { deviceId: id },
                };

                try {

                    //  await sendPushNotification([pushToken], message);
                } catch (notificationError) {
                    console.error('Error enviando notificación push:', notificationError);
                    res.status(500).json({
                        success: false,
                        message: 'El dispositivo fue bloqueado, pero no se pudo enviar la notificación.'
                    });
                }
            }

            res.status(200).json({
                success: true,
                message: 'Dispositivo bloqueado y notificación enviada correctamente.'
            });

        } catch (error) {
            console.error('Error bloqueando el dispositivo:', error);
            res.status(500).json({ success: false, message: 'Error bloqueando el dispositivo.' });
        }
    },
    async unlockDevices(req: Request, res: Response) {
        const { id } = req.params;
        const { unlockCode } = req.body;  // El código de desbloqueo debe ser enviado en el cuerpo de la solicitud

        if (!id) {
            res.status(400).json({ success: false, message: 'El ID del dispositivo es requerido.' });
        }

        if (!unlockCode) {
            res.status(400).json({ success: false, message: 'El código de desbloqueo es requerido.' });
        }

        try {
            // Actualizar el estado del dispositivo a "desbloqueado"
            const { data: device, error } = await supabase
                .from('devices')
                .update({ status: 'Desbloqueado', unlock_code: '' })
                .eq('id', id)
                .select('imei')
                .single();

            if (error) {
                throw new Error('Error al actualizar el estado del dispositivo: ' + error.message); // Lanzar error
            }

            if (!device) {
                throw new Error('Dispositivo no encontrado.'); // Lanzar error
            }

            // Obtener el push_token del dispositivo desbloqueado
            const pushToken = device?.imei;

            // Enviar notificación si el push_token existe
            if (pushToken) {
                const message = {
                    body: 'Tu dispositivo ha sido desbloqueado. ¡Gracias por realizar el pago!',
                    data: { deviceId: id },
                };
                try {
                    // Emitir evento de desbloqueo usando Socket.IO
                    io.to(`device_${device.imei}`).emit('device-unblocked', {
                        blocked: false,
                        deviceId: id,
                        unlockCode: unlockCode
                    });
                } catch (notificationError) {
                    throw new Error('El dispositivo fue desbloqueado, pero no se pudo enviar la notificación.'); // Lanzar error
                }
            }

            res.status(200).json({
                success: true,
                message: 'Dispositivo desbloqueado y notificación enviada correctamente.'
            });

        } catch (error) {
            console.error('Error desbloqueando el dispositivo:', error);
            res.status(500).json({ success: false, message: 'Error desbloqueando el dispositivo.' });
        }
    },
    async unlockRequest(req: Request, res: Response) {
        try {
            const { CODIGO_ID_SUJETO, VOUCHER_PAGO, imei, ip } = req.body;

            // Generar código de desbloqueo
            const unlockCode = generarCodigoDesbloqueo();

            let dispositivo = null;

            // Intentar buscar dispositivo por IP
            const { data: dispositivoPorIp, error: errorPorIp } = await supabase
                .from('devices')
                .select('*')
                .eq('ip', ip)
                .single();

            if (!errorPorIp && dispositivoPorIp) {
                dispositivo = dispositivoPorIp;
            } else {
                // Si no se encuentra por IP, intentar buscar por IMEI
                const { data: dispositivoPorImei, error: errorPorImei } = await supabase
                    .from('devices')
                    .select('*')
                    .eq('imei', imei)
                    .single();

                if (!errorPorImei && dispositivoPorImei) {
                    dispositivo = dispositivoPorImei;
                } else {
                    // Si no se encuentra por IMEI, buscar cliente
                    const { data: cliente, error: errorCliente } = await supabase
                        .from('clients')
                        .select('id')
                        .eq('identity_number', CODIGO_ID_SUJETO)
                        .single();

                    if (errorCliente || !cliente) {
                        throw new Error('Cliente no encontrado.'); // Lanzar error
                    }

                    // Buscar dispositivo por cliente
                    const { data: dispositivoPorCliente, error: errorPorCliente } = await supabase
                        .from('devices')
                        .select('*')
                        .or(`owner.eq.${cliente?.id}`)
                        .single();

                    if (!errorPorCliente && dispositivoPorCliente) {
                        dispositivo = dispositivoPorCliente;
                    }
                }
            }

            if (!dispositivo) {
                throw new Error('Dispositivo no encontrado.'); // Lanzar error
            }

            // Actualizar el código de desbloqueo en la tabla `devices`
            const { error: errorActualizacion } = await supabase
                .from('devices')
                .update({ unlock_code: unlockCode, imei: imei })
                .eq('id', dispositivo.id);

            if (errorActualizacion) {
                throw new Error('Error actualizando el código de desbloqueo.'); // Lanzar error
            }

            // Crear notificación
            const mensaje = {
                message: `El cliente con CODIGO_ID_SUJETO: ${CODIGO_ID_SUJETO} y VOUCHER_PAGO: ${VOUCHER_PAGO} está solicitando el desbloqueo de su dispositivo con IMEI: ${imei} e IP: ${ip}`,
                status: 'No Leida',
            };
            await BaseService.create<Notification>('notifications', mensaje);

            res.status(200).json({
                status: 'success',
                message: 'Solicitud recibida. Nos comunicaremos pronto.',
                unlock_code: unlockCode, // Opcional, si deseas devolver el código
                status_device: dispositivo.status
            });
        } catch (error: any) {
            console.error(error);

            // Manejo de diferentes tipos de errores
            let statusCode = 500;
            let errorMessage = 'Error interno del servidor.';

            if (error.message === 'Cliente no encontrado.') {
                statusCode = 404;
                errorMessage = error.message;
            } else if (error.message === 'Dispositivo no encontrado.') {
                statusCode = 404;
                errorMessage = error.message;
            } else if (error.message === 'Error actualizando el código de desbloqueo.') {
                statusCode = 500;
                errorMessage = error.message;
            }

            res.status(statusCode).json({ error: errorMessage });
        }
    },
    async unlockValidate(req: Request, res: Response) {
        try {
            // Validar que se envíe al menos uno de los parámetros necesarios
            const { code, imei } = req.body;
            let queryResult;
            // Intentar buscar por IMEI si se proporciona
            if (imei) {
                const { data, error } = await supabase
                    .from(tableName)
                    .select('clients(identity_number,operations(prox_due_date))')
                    .eq('imei', imei);

                if (error) {
                    throw new Error("Error al consultar la base de datos por IMEI.");
                }

                // Si se encuentran resultados, usar estos datos
                if (data && data.length > 0) {
                    queryResult = data;
                }
            }

            // Si no se encontraron resultados con el IMEI, intentar por código
            if (!queryResult || queryResult.length === 0) {
                const { data, error } = await supabase
                    .from(tableName)
                    .select('clients(identity_number,operations(prox_due_date))')
                    .eq('unlock_code', code);

                if (error) {
                    throw new Error("Error al consultar la base de datos por código.");
                }

                // Validar si no se encontraron resultados
                if (!data || data.length === 0) {
                    throw new Error("Código o IMEI incorrectos.");
                }

                queryResult = data;
            }
            const { error: updateError } = await supabase
                .from(tableName)
                .update({ status: 'Desbloqueado' }) // Cambiar el campo `status` a "Desbloqueado"
                .eq('unlock_code', code);
            if (updateError) {
                throw new Error("Error al consultar la base de datos por IMEI.");
            }
            // Respuesta exitosa
            res.status(200).json({
                "status": "success",
                "message": "Código válido. Dispositivo desbloqueado.",
                "next_due_date": ""
            }
            );
        } catch (error: any) {
            let statusCode = 500;
            let message = "Error interno del servidor.";
            if (error.message.includes("obligatorios")) {
                statusCode = 400;
                message = error.message;
            } else if (error.message.includes("incorrectos")) {
                statusCode = 404;
                message = error.message;
            } else if (error.message.includes("Error al consultar la base de datos")) {
                statusCode = 500;
                message = error.message;
            }
            res.status(statusCode).json({
                status: "error",
                message,
            });
        }
    },
    async validateCode(req: Request, res: Response) {
        try {
            const { code, imei } = req.body;
            let queryResult;

            // Intentar buscar por IMEI si se proporciona
            if (imei) {
                const { data, error } = await supabase
                    .from(tableName)
                    .select('clients(identity_number,operations(prox_due_date))')
                    .eq('imei', imei);

                if (error) {
                    throw new Error("Error al consultar la base de datos por IMEI.");
                }

                // Si se encuentran resultados, usar estos datos
                if (data && data.length > 0) {
                    queryResult = data;
                }
            }

            // Si no se encontraron resultados con el IMEI, intentar por código
            if (!queryResult || queryResult.length === 0) {
                const { data, error } = await supabase
                    .from(tableName)
                    .select('clients(identity_number,operations(prox_due_date))')
                    .eq('unlock_code', code);

                if (error) {
                    throw new Error("Error al consultar la base de datos por código.");
                }

                // Validar si no se encontraron resultados
                if (!data || data.length === 0) {
                    throw new Error("Código o IMEI incorrectos.");
                }

                queryResult = data;
            }

            // Actualizar el estado a "Desbloqueado" en la base de datos
            const { error: updateError } = await supabase
                .from(tableName)
                .update({ status: 'Desbloqueado' }) // Cambiar el campo `status` a "Desbloqueado"
                .eq('unlock_code', code);

            if (updateError) {
                throw new Error("Error al actualizar el estado en la base de datos.");
            }

            // Respuesta exitosa
            res.status(200).json({
                status: "success",
                message: "Desbloqueado",
                data: queryResult,
            });
        } catch (error: any) {
            let statusCode = 500;
            let message = "Error interno del servidor.";
            if (error.message.includes("obligatorios")) {
                statusCode = 400;
                message = error.message;
            } else if (error.message.includes("incorrectos")) {
                statusCode = 404;
                message = error.message;
            } else if (error.message.includes("Error al consultar la base de datos")) {
                statusCode = 500;
                message = error.message;
            }
            res.status(statusCode).json({
                status: "error",
                message,
            });
        }
    }

}    
