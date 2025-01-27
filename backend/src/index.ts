import express, { Request, Response } from 'express';
import cors from 'cors'; // Importar cors
import dotenv from 'dotenv'; // Importar dotenv
import bodyParser from 'body-parser';
// Importar rutas
import authRoutes from './routes/auth.routes';
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
import operationRoutes from './routes/operation.routes'; // Importar rutas de clientes
import paymentRoutes from './routes/payment.routes'; // Importar rutas de clientes
import statusRoutes from './routes/status.routes'; // Importar rutas de clientes
import inventoryRoutes from './routes/inventory.routes'; // Importar rutas de clientes
import productRoutes from './routes/product.routes'; // Importar rutas de clientes
import paymentPlanRoutes from './routes/paymentPlan.routes'; // Importar rutas de clientes
import contractRoutes from './routes/contract.routes'; // Importar rutas de clientes
import { ClientController } from './controllers/client.controller'; // Importar controlador de clientes
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

// Importar configuraciones y servicios
import { config } from './config/gobal';
import { sessionAuth } from './middlewares/supabaseMidleware';
// Cargar las variables de entorno
dotenv.config();
const app = express();
const { port, allowedOrigin } = config;
// Middleware global
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Registrar rutas
app.get('/', (req: Request, res: Response) => {
  res.send('Bienvenido al API');
});
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
app.use('/operations', operationRoutes)
app.use('/payments', paymentRoutes)
app.use('/payment-plans', paymentPlanRoutes)
app.use('/contracts', contractRoutes)
app.use('/status', statusRoutes)
app.use('/clients', clientRoutes); // Registrar rutas de clientes
app.use('/inventories', inventoryRoutes);
app.use('/products', productRoutes); 
// Ruta independiente para generar el informe
app.post('/generate-report',sessionAuth, ClientController.generateEquifaxReport);
const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "Matrix Cell API",
      version: "0.1.0",
      description:
        "Esta es una API sencilla para gestionar operaciones en tienda de celulares, incluyendo el bloqueo y desbloqueo de dispositivos móviles.",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
      contact: {
        name: "Soporte Matrix-Cell",
        url: "https://matrix-cell.com",
        email: "soporte@matrix-cell.com",
      },
    },
    servers: [
      {
        url: "https://matrixcell.onrender.com/",
      },
    ],
  },
  apis: ["./src/routes/*.ts"],
};

const specs = swaggerJsdoc(options);
app.use(
  "/documentacion",
  swaggerUi.serve,
  swaggerUi.setup(specs)
);
// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
