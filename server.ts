import 'dotenv/config';
import express from 'express';
import http from 'node:http';
import path from 'node:path';

const PORT = Number(process.env.PORT) || 3000;
const HOST = '0.0.0.0';

async function startServer() {
  const app = express();
  const httpServer = http.createServer(app);

  if (process.env.NODE_ENV !== 'production') {
    const hmrDisabled = process.env.DISABLE_HMR === 'true';
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        ws: hmrDisabled ? false : { server: httpServer },
        hmr: !hmrDisabled,
      },
      plugins: hmrDisabled
        ? [
            {
              name: 'aistudio-disable-hmr-client-ws',
              transform(code, id) {
                if (id.includes('vite/dist/client/client.mjs')) {
                  return code.replace(
                    'transport.connect(createHMRHandler(handleMessage));',
                    '/* HMR WebSocket disabled via DISABLE_HMR=true */'
                  );
                }
              },
            },
          ]
        : [],
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  httpServer.listen(PORT, HOST, () => {
    console.log(`[Horizonte Estelar] Servidor ativo em http://${HOST}:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[Horizonte Estelar] Erro fatal ao iniciar servidor:', err);
  process.exit(1);
});
