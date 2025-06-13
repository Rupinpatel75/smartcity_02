import express, { Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import cors from "cors";
import path from "path";

const app = express();

// Security and PWA headers
app.use((req, res, next) => {
  // Force HTTPS in production (handles various proxy scenarios)
  if (process.env.NODE_ENV === 'production') {
    const forwardedProto = req.header('x-forwarded-proto') || req.header('x-forwarded-protocol');
    const cloudflareVisitorScheme = req.header('cf-visitor');
    
    if (forwardedProto !== 'https' && 
        (!cloudflareVisitorScheme || !cloudflareVisitorScheme.includes('https')) &&
        req.header('host') !== 'localhost') {
      return res.redirect(301, `https://${req.header('host')}${req.url}`);
    }
  }
  
  // Security headers for PWA compliance
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  
  // PWA caching headers for static assets
  if (req.url.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/)) {
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  } else if (req.url === '/manifest.json' || req.url === '/sw.js') {
    res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
  } else {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }
  
  next();
});

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// Serve static files with correct MIME types for PWA
app.use('/sw.js', (req, res, next) => {
  res.setHeader('Content-Type', 'application/javascript');
  next();
});

app.use('/manifest.json', (req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  next();
});

app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));



// Logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }
      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const PORT = parseInt(process.env.PORT || "5000");
  server.listen(PORT, () => {
    log(`Server running on port ${PORT}`);
  });
})();