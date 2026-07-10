#!/usr/bin/env node

import { parseArgs } from 'util';
import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';
import heicDecode from 'heic-decode';
import sharp from 'sharp';
import transformationHandler from './libs/transformationHandler';
import { ResizeOptions, ActionType, ImageFormat, GravityType } from './types';

async function main() {
    const { values } = parseArgs({
        options: {
            input: { type: 'string', short: 'i' },
            output: { type: 'string', short: 'o' },
            width: { type: 'string', short: 'w' },
            height: { type: 'string', short: 'h' },
            format: { type: 'string', short: 'f' },
            quality: { type: 'string', short: 'q' },
            action: { type: 'string', short: 'a' },
            gravity: { type: 'string' },
            fit: { type: 'string' },
            withoutEnlargement: { type: 'boolean' },
            rotate: { type: 'string' },
            blur: { type: 'string' },
            grayscale: { type: 'boolean' },
            help: { type: 'boolean' },
        },
        allowPositionals: true,
    });

    if (values.help || !values.input || !values.output) {
        console.log(`
Usage: image-resizer -i <input> -o <output> [options]

Options:
  -i, --input <path/url>      Input file path or URL (required)
  -o, --output <path>         Output file path (required)
  -w, --width <pixels>        Width in pixels
  -h, --height <pixels>       Height in pixels
  -f, --format <format>       Output format (e.g., webp, jpeg, png, avif)
  -q, --quality <number>      Output quality (1-100)
  -a, --action <action>       Action (resize, crop) - default: resize
  --gravity <type>            Crop gravity (n, ne, e, se, s, sw, w, nw, c) - default: c
  --fit <strategy>            Fit strategy (default: cover):
                                - cover: Preserving aspect ratio, attempt to ensure the image covers both provided dimensions by cropping/clipping to fit.
                                - contain: Preserving aspect ratio, contain within both provided dimensions using "letterboxing" where necessary.
                                - fill: Ignore the aspect ratio of the input and stretch to both provided dimensions.
                                - inside: Preserving aspect ratio, resize the image to be as large as possible while ensuring its dimensions are less than or equal to both those specified.
                                - outside: Preserving aspect ratio, resize the image to be as small as possible while ensuring its dimensions are greater than or equal to both those specified.
  --withoutEnlargement        Do not enlarge if the width or height are already less than the specified dimensions
  --rotate <degrees/auto>     Rotate image
  --blur <sigma>              Blur image
  --grayscale                 Convert to grayscale
  --help                      Show this help message
        `);
        process.exit(values.help ? 0 : 1);
    }

    const input = values.input;
    const output = values.output;

    if (!input.startsWith('http://') && !input.startsWith('https://')) {
        const inputPath = path.resolve(process.cwd(), input);
        const outputPath = path.resolve(process.cwd(), output);
        if (inputPath === outputPath) {
            console.error('Error: Input and output paths cannot be the same file. Please specify a different output path to prevent overwriting and corrupting the original file.');
            process.exit(1);
        }
    }

    // Build ResizeOptions
    const options: ResizeOptions = {
        action: (values.action as ActionType) || 'resize',
        width: values.width ? parseInt(values.width, 10) : 0,
        height: values.height ? parseInt(values.height, 10) : 0,
        gravity: (values.gravity as GravityType) || 'c',
        format: (values.format as ImageFormat) || 'png',
        quality: values.quality ? parseInt(values.quality, 10) : 80,
        url: input,
        contentType: '', // Will be set by transformationHandler
        fit: values.fit as ResizeOptions['fit'],
        withoutEnlargement: values.withoutEnlargement,
        rotate: values.rotate === 'auto' ? 'auto' : values.rotate ? parseInt(values.rotate, 10) : undefined,
        blur: values.blur ? parseFloat(values.blur) : undefined,
        grayscale: values.grayscale,
    };

    console.log(`Input image is: ${input}`);
    console.log(`Parameters defined are:\n${JSON.stringify(options, null, 2)}`);

    const transform = transformationHandler(options);
    const writeStream = fs.createWriteStream(path.resolve(process.cwd(), output));

    writeStream.on('finish', () => {
        console.log(`Done! Output image generated to ${output}`);
    });

    writeStream.on('error', (err) => {
        console.error('Error writing output file:', err);
        process.exit(1);
    });

    transform.on('error', (err) => {
        console.error('Error transforming image. Possibly not an image? Detailed log:');
        console.error(err);
        process.exit(1);
    });

    try {
        let inputBuffer: Buffer | null = null;

        if (input.startsWith('http://') || input.startsWith('https://')) {
            console.log(`Downloading ${input}...`);
            const response = await fetch(input);
            if (!response.ok) {
                throw new Error(`Failed to fetch image: ${response.statusText}`);
            }
            
            const arrayBuffer = await response.arrayBuffer();
            inputBuffer = Buffer.from(arrayBuffer);
        } else {
            const inputPath = path.resolve(process.cwd(), input);
            if (!fs.existsSync(inputPath)) {
                throw new Error(`Input file not found: ${inputPath}`);
            }
            console.log(`Processing local file: ${inputPath}...`);
            inputBuffer = fs.readFileSync(inputPath);
        }

        // Try HEIC decode if possible
        let isHeic = false;
        try {
            const { width, height, data } = await heicDecode({ buffer: inputBuffer });
            isHeic = true;
            const rgbaBuffer = Buffer.from(data);
            let sharpImage = sharp(rgbaBuffer, { raw: { width, height, channels: 4 } });
            
            // Apply transformations in order
            if (options.rotate !== undefined) {
                sharpImage = sharpImage.rotate(options.rotate === 'auto' ? undefined : (options.rotate as number));
            }
            
            if (options.blur !== undefined) {
                sharpImage = sharpImage.blur(options.blur);
            }
            
            if (options.grayscale) {
                sharpImage = sharpImage.grayscale();
            }
            
            // Apply resize with options
            if (options.width || options.height) {
                const resizeOpts: any = {};
                if (options.width) resizeOpts.width = options.width;
                if (options.height) resizeOpts.height = options.height;
                if (options.fit) resizeOpts.fit = options.fit;
                if (options.withoutEnlargement !== undefined) resizeOpts.withoutEnlargement = options.withoutEnlargement;
                sharpImage = sharpImage.resize(resizeOpts);
            }
            
            if (options.action === 'crop') {
                sharpImage = sharpImage.trim();
            }
            
            // Apply format and quality
            const format = options.format === 'jpg' ? 'jpeg' : options.format;
            if (format === 'webp') {
                sharpImage = sharpImage.webp({ quality: options.quality });
            } else if (format === 'avif') {
                sharpImage = sharpImage.avif({ quality: options.quality });
            } else if (format === 'gif') {
                sharpImage = sharpImage.gif();
            } else if (format === 'jpeg') {
                sharpImage = sharpImage.jpeg({ quality: options.quality, progressive: true });
            } else {
                sharpImage = sharpImage.png({ quality: options.quality });
            }
            
            // Write directly to output for HEIC files
            await sharpImage.toFile(path.resolve(process.cwd(), output));
            console.log(`Done! Output image generated to ${output}`);
        } catch (err) {
            // Not a HEIC image, continue with original buffer through transform pipeline
            if (!isHeic) {
                const readableImageBuffer = new Readable();
                readableImageBuffer.push(inputBuffer);
                readableImageBuffer.push(null);
                readableImageBuffer.pipe(transform).pipe(writeStream);
            } else {
                // Was HEIC but processing failed
                throw err;
            }
        }
        
    } catch (error) {
        console.error('Error processing image. Possibly not an image? Detailed log:');
        console.error(error instanceof Error ? error.message : error);
        process.exit(1);
    }
}

main();
