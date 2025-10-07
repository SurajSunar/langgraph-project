// src/index.ts
    import express, { Application, Request, Response } from 'express';
import { agent } from './agent';
import { HumanMessage } from '@langchain/core/messages';

    const app: Application = express();
    const PORT: number = 3000;

    app.use(express.json())

    app.post('/', async (req: Request, res: Response) => {

      console.log(req.body)
      try {
        const result = await agent.invoke({
          messages: [new HumanMessage(req.body.messages)]
        })
        
        res.send({result: result.messages});
      } catch (error) {
        res.send('Error: ' + error);
      }
    });

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });