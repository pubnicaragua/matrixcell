import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { Server } from 'socket.io';
import http from 'http';
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
import clientRoutes from './routes/client.routes';
import operationRoutes from './routes/operation.routes';
import paymentRoutes from './routes/payment.routes';
import statusRoutes from './routes/status.routes';
import inventoryRoutes from './routes/inventory.routes';
import productRoutes from './routes/product.routes';
import paymentPlanRoutes from './routes/paymentPlan.routes';
import contractRoutes from './routes/contract.routes';
import { ClientController } from './controllers/client.controller';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

// Importar configuraciones y servicios
import { config } from './config/gobal';
import { sessionAuth } from './middlewares/supabaseMidleware';

dotenv.config();
const app = express();
const { port, allowedOrigin } = config;

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Handle joining device-specific room
  socket.on('join-device', (androidId: string) => {
    socket.join(`device_${androidId}`);
    console.log(`Client ${socket.id} joined room for device: ${androidId}`);
  });

  // Handle device blocking
  socket.on('block-device', (data: { androidId: string, reason?: string }) => {
    io.to(`device_${data.androidId}`).emit('device-blocked', {
      blocked: true,
      reason: data.reason || 'Device blocked by administrator'
    });
    console.log(`Block signal sent to device: ${data.androidId}`);
  });

  // Handle device unblocking
  socket.on('unblock-device', (androidId: string) => {
    io.to(`device_${androidId}`).emit('device-unblocked', {
      blocked: false
    });
    console.log(`Unblock signal sent to device: ${androidId}`);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Export io instance for use in other files
export { io };

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
app.use('/technical_services', technicalServicesRoute);
app.use('/devices', devicesRoute);
app.use('/invoices', invoicesRoute);
app.use('/device_logs', deviceLogRoute);
app.use('/audit_logs', auditLogRoute);
app.use('/notifications', notificationRoute);
app.use('/operations', operationRoutes);
app.use('/payments', paymentRoutes);
app.use('/payment-plans', paymentPlanRoutes);
app.use('/contracts', contractRoutes);
app.use('/status', statusRoutes);
app.use('/clients', clientRoutes);
app.use('/inventories', inventoryRoutes);
app.use('/products', productRoutes);

// Ruta independiente para generar el informe
app.post('/generate-report', sessionAuth, ClientController.generateEquifaxReport);

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
app.use("/documentacion", swaggerUi.serve, swaggerUi.setup(specs));

// Start the server
server.listen(port, () => {
  console.log(`Server running on https://matrixcell.onrender.com:${port}`);
});