"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
dotenv.config({
    path: './.env',
});
const express_1 = __importDefault(require("express"));
const errorHandler_1 = __importDefault(require("./middlewares/errorHandler"));
const index_routes_1 = __importDefault(require("./routes/index.routes"));
const db_connect_1 = __importDefault(require("./utils/db.connect"));
dotenv.config({
    path: './.env',
});
const app = (0, express_1.default)();
const port = process.env['PORT'] || 3000;
const prom_client_1 = __importDefault(require("prom-client"));
const collectDefaultMetrics = prom_client_1.default.collectDefaultMetrics;
collectDefaultMetrics({ register: prom_client_1.default.register });
const IGNORED_ROUTES = ['./favicon.ico', '/metrics'];
const reqPerSecond = new prom_client_1.default.Counter({
    name: 'http_requests_total',
    help: 'Total number of requests',
    labelNames: ['method', 'route', 'status'],
});
const respTimeHistogram = new prom_client_1.default.Histogram({
    name: 'http_response_time',
    help: 'Response Time Histogram',
    labelNames: ['method', 'route', 'status'],
    buckets: [50, 100, 200, 300, 500, 1000, 2000],
});
app.use((rq, rs, nx) => {
    const currentRoute = rq.route?.path || rq.path;
    if (IGNORED_ROUTES.includes(currentRoute))
        return nx();
    const reqStartTime = process.hrtime.bigint();
    rs.on('finish', () => {
        const reqEndTime = process.hrtime.bigint();
        const durationInMs = Number(reqEndTime - reqStartTime) / 1e6;
        let labels = {
            method: rq.method,
            route: currentRoute,
            status: rs.statusCode,
        };
        reqPerSecond.inc(labels);
        respTimeHistogram.observe(labels, durationInMs);
    });
    nx();
});
(async () => {
    await (0, db_connect_1.default)();
})();
app.use(express_1.default.json());
app.get('/', (req, res) => {
    console.log('/');
    res.send('Welcome to Express & TypeScript Server');
});
app.use('/api', index_routes_1.default);
app.get('/metrics', async (rq, rs, next) => {
    rs.setHeader('Content-Type', prom_client_1.default.register.contentType);
    const metrics = await prom_client_1.default.register.metrics();
    rs.end(metrics);
});
app.use(errorHandler_1.default);
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
