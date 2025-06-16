import express, { Request, Response } from 'express';
import leadsRouter from './routes/leads.router';
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use("/leads",leadsRouter)
app.get('/', (req: Request, res: Response) => {
  res.send('Hello from TypeScript + Express!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
