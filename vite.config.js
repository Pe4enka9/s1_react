import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react-swc';
import imagemin from 'vite-plugin-imagemin';
import {visualizer} from "rollup-plugin-visualizer";

export default defineConfig({
    plugins: [
        react(),
        visualizer({
            filename: 'bundle-analysis.html',
            open: false,
            gzipSize: true,
            brotliSize: true,
        }),
        imagemin({
            gifsicle: {optimizationLevel: 3},
            mozjpeg: {quality: 75, progressive: true},
            pngquant: {quality: [0.65, 0.8], speed: 4},
            svgo: {
                plugins: [
                    {name: 'removeViewBox'},
                    {name: 'removeEmptyAttrs', active: false},
                ]
            },
            webp: {quality: 75}
        })
    ],
    base: './',
    build: {
        outDir: 'build',
        assetsDir: 'assets',
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom'],
                    swiper: ['swiper'],
                    date: ['date-fns', 'date-fns-tz', 'react-datepicker'],
                    forms: ['axios', 'react-imask']
                }
            }
        }
    }
});
