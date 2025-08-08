// next.config.ts
/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config: any, { isServer }: { isServer: boolean }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        canvas: false,
        worker_threads: false,
        child_process: false,
        net: false,
        dns: false,
        tls: false
      };
    }
    
    // Asegúrate de que pdf.worker.js se copie correctamente
    config.module.rules.push({
      test: /pdf\.worker\.js$/,
      type: 'asset/resource',
      generator: {
        filename: 'static/worker/[name].[hash].js'
      }
    });

    return config;
  },
  experimental: {
    serverComponentsExternalPackages: ['canvas', 'pdfjs-dist'],
  },
  serverExternalPackages: ['canvas'],
  images: {
    disableStaticImages: true,
  },
};

module.exports = nextConfig;