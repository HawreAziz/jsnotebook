import express from 'express';
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';


interface Cell {
  id: string;
  content: string;
  type: 'code' | 'text'
}

export const createCellRouter = (dir: string, filename: string) => {
  const router = express.Router();
  router.use(express.json())
  const fullPath = dir;
  console.log(dir, filename);
  console.log(fullPath)

  router.get("/cells", async (_, res) => {
    try {
      const cells = readFileSync(fullPath, { encoding: 'utf-8' })
      res.send(JSON.parse(cells))
    } catch (error) {
      if (error.code === "ENOENT") {
        writeFileSync(fullPath, '[]', 'utf-8');
        res.send([])
      } else {
        throw error;
      }

    }
  });


  router.post("/cells", async (req, res) => {
    const { cells }: { cells: Cell[] } = req.body;
    writeFileSync(fullPath, JSON.stringify(cells), 'utf-8')
    res.send({ 'status': fullPath });
  });

  return router;
}
