import * as dotenv from 'dotenv';
dotenv.config({
	path: './.env',
});

import express, { Application, NextFunction, Request, Response } from 'express';
import errorHandler from './middlewares/errorHandler';
import indexRouter from './routes/index.routes';
import connectMongo from './utils/db.connect';

dotenv.config({
	path: './.env',
});

const app: Application = express();
const port: number | string = process.env['PORT'] || 3000;

import client from 'prom-client';

const collectDefaultMetrics = client.collectDefaultMetrics;

collectDefaultMetrics({ register: client.register });

const IGNORED_ROUTES = ['./favicon.ico', '/metrics'];

const reqPerSecond = new client.Counter({
	name: 'http_requests_total',
	help: 'Total number of requests',
	labelNames: ['method', 'route', 'status'],
});

const respTimeHistogram = new client.Histogram({
	name: 'http_response_time',
	help: 'Response Time Histogram',
	labelNames: ['method', 'route', 'status'],
	buckets: [50, 100, 200, 300, 500, 1000, 2000],
});

app.use((rq: Request, rs: Response, nx: NextFunction) => {
	const currentRoute = rq.route?.path || rq.path;
	if (IGNORED_ROUTES.includes(currentRoute)) return nx();

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
	await connectMongo();
})();

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
	console.log('/');
	res.send('Welcome to Express & TypeScript Server');
});

app.use('/api', indexRouter);

app.get('/metrics', async (rq: Request, rs: Response, next: NextFunction) => {
	rs.setHeader('Content-Type', client.register.contentType);
	const metrics = await client.register.metrics();
	rs.send(metrics);
});

app.use(errorHandler);

app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});
