import sharp, { Sharp, ResizeOptions as SharpResizeOptions } from 'sharp';
import { ResizeOptions } from '../types';

export default function transformationHandler(options: ResizeOptions): Sharp {
    const { action, format, quality, width, height, fit, withoutEnlargement, rotate, blur, grayscale } = options;

    const transform = sharp({ animated: true, pages: -1 });

    if (rotate !== undefined) {
        transform.rotate(rotate === 'auto' ? undefined : (rotate as number));
    }

    if (blur !== undefined) {
        transform.blur(blur);
    }

    if (grayscale) {
        transform.grayscale();
    }

    // process width & height
    if (width > 10000 || height > 10000) {
        throw new Error('Input pixel width or height exceeds limit');
    }

    const resizeOptions: SharpResizeOptions = {};
    if (fit) resizeOptions.fit = fit;
    if (withoutEnlargement !== undefined) resizeOptions.withoutEnlargement = withoutEnlargement;

    if (width && height) {
        transform.resize({ width, height, ...resizeOptions });
    } else if (height) {
        transform.resize({ height, ...resizeOptions });
    } else if (width) {
        transform.resize({ width, ...resizeOptions });
    }

    if (action === 'crop') {
        transform.trim();
    }

    // process format
    if (format === 'webp') {
        if (quality) {
            transform.webp({ quality });
        } else {
            transform.webp();
        }
        options.contentType = 'image/webp';
    } else if (format === 'avif') {
        if (quality) {
            transform.avif({ quality });
        } else {
            transform.avif();
        }
        options.contentType = 'image/avif';
    } else if (format === 'gif') {
        transform.gif();
        options.contentType = 'image/gif';
    } else if (format === 'jpg' || format === 'jpeg') {
        if (quality) {
            transform.jpeg({ quality, progressive: true });
        } else {
            transform.jpeg({ progressive: true });
        }
        options.contentType = 'image/jpeg';
    } else {
        if (quality) {
            transform.png({ quality });
        } else {
            transform.png();
        }
        options.contentType = 'image/png';
    }

    return transform;
}
