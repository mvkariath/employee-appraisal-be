import express, { Request, Response } from 'express';
import { LoggerService } from './services/logger.service';
import loggerMiddleware from './middlewares/loggerMiddleware';
import { authMiddleware } from './middlewares/auth.middleware';
import employeeRouter from './routes/employee.route';
import { authRouter } from './routes/auth.route';
import { errorHandlineMiddleware } from './middlewares/errorHandlingMiddleware';
import cors from 'cors'
import datasource from '../db/data-source';
import appraisalCycleRouter from './routes/appraisalCycle.route';
import appraisalRouter from './routes/appraisal.route';
import selfAppraisalEntryRouter from './routes/selfAppraisal.route';
import auditLogRouter from './routes/auditLog.route';

import { performanceFactorsRouter } from './routes/performance-factors.route';
import dashboardMetricsRouter from './routes/dashboardMetric.route';
const app = express();

app.use(express.json());
const logger = LoggerService.getInstance('app()');

app.use(cors())
app.use(express.json());
app.use(loggerMiddleware);

app.use("/employee", authMiddleware, employeeRouter);
app.use("/appraisal-cycle", authMiddleware, appraisalCycleRouter);
app.use("/appraisal", authMiddleware, appraisalRouter);
app.use("/self-appraisal", authMiddleware, selfAppraisalEntryRouter);
app.use("/audit-log", auditLogRouter);
app.use("/dashboard-metrics",authMiddleware, dashboardMetricsRouter);

app.use("/performance_factors", authMiddleware,performanceFactorsRouter);


app.use("/auth",authRouter)


app.use(errorHandlineMiddleware)


app.get('/', (req: Request, res: Response) => {
  res.send('Hello from TypeScript + Express!');
});


(async () => {
  try{
    await datasource.initialize();
    logger.info("DB connected");
  }
  catch(error) {
    logger.error(`Failed to connect to DB - ${error}`);
    process.exit(1);
  }
  app.listen(3000, () => {
    logger.info("server listening to 3000");
  });

})();
