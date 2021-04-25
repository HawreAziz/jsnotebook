import { Command } from 'commander';
import { serve } from 'local-api';
import path from 'path'

const isProduction = process.env.NODE_ENV === "production";

export const serveCommand = new Command()
  .command("serve [filename]")
  .description("Open a file for editing")
  .option('-p, --port <number>', 'Port that the server listens on', '5004')
  .action(async (filename: string = 'notebook.js', options: { port: string }) => {
    try {
      const dir = path.join(process.cwd(), path.basename(filename))
      await serve(parseInt(options.port), path.basename(filename), dir, isProduction);
    } catch (error) {
      if (error.code === "EADDRINUSE") {
        console.error(`Port ${options.port} already in use. Try using another port`)
      } else {
        console.error(`Error code: ${error.code}`);
      }
      process.exit();
    }
  })
