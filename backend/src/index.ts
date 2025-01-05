import express, { Request, Response } from 'express';
import cors from 'cors'; // Importar cors
import multer, { DiskStorageOptions } from 'multer'; // Importar multer
import dotenv from 'dotenv'; // Importar dotenv
import bodyParser from 'body-parser';
import { CronJob } from 'cron';
// Importar rutas
import authRoutes from './routes/auth';
import usuarioRoutes from './routes/usuario.routes';
import rolRoutes from './routes/rol.route';
import permisosRoutes from './routes/permiso.routes';
import storesRoutes from './routes/store.routes';
import technicalServicesRoute from './routes/technicalService.routes';
import devicesRoute from './routes/device.routes';
import invoicesRoute from './routes/invoice.routes';
import deviceLogRoute from './routes/deviceLog.routes';
import auditLogRoute from './routes/auditLog.routes';
import notificationRoute from './routes/notification.routes';
import clientRoutes from './routes/client.routes'; // Importar rutas de clientes
import { ClientController } from './controllers/client.controller'; // Importar controlador de clientes

// Importar configuraciones y servicios
import { config } from './config/gobal';
import { sessionAuth } from './middlewares/supabaseMidleware';
// Cargar las variables de entorno
dotenv.config();
const app = express();
const { port, allowedOrigin } = config;
// Middleware global
app.use(cors({
  origin: allowedOrigin,
}));
app.use(express.json());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Registrar rutas
app.use('/auth/', authRoutes);
app.use('/usuarios', usuarioRoutes);
app.use('/roles', rolRoutes);
app.use('/permissions', permisosRoutes);
app.use('/stores', storesRoutes);
app.use('/technical_services', technicalServicesRoute)
app.use('/devices', devicesRoute)
app.use('/invoices', invoicesRoute)
app.use('/device_logs', deviceLogRoute)
app.use('/audit_logs', auditLogRoute)
app.use('/notifications', notificationRoute)
app.use('/clients', clientRoutes); // Registrar rutas de clientes
// Ruta independiente para generar el informe
app.post('/generate-report',sessionAuth, ClientController.generateEquifaxReport);
// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
