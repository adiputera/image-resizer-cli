# CLI Image Resizer

A lightweight CLI tool for image resizing and conversion, built with TypeScript, [Sharp](https://sharp.pixelplumbing.com/), and [heic-decode](https://github.com/catdad-experiments/heic-decode).

## Features

- 📸 **HEIC/HEIF Support**: Convert HEIC/HEIF images to standard formats (PNG, JPEG, WebP, AVIF, GIF)
- 🖼️ **Multiple Formats**: Support for WebP, AVIF, PNG, JPEG, GIF
- 📏 **Smart Resizing**: Multiple fit strategies (cover, contain, fill, inside, outside)
- 🎨 **Image Effects**: Rotation, blur, grayscale, and cropping
- 🌐 **URL Support**: Download and process images directly from URLs
- ⚡ **Fast & Efficient**: Powered by Sharp's high-performance image processing

## Prerequisites

- Node.js 18+ or 20+

## Installation

Install globally via npm:
```bash
npm install -g @adiputera/cli-image-resizer
```

Alternatively, run it directly without installing using `npx`:
```bash
npx @adiputera/cli-image-resizer -i <input> -o <output> [options]
```

## Local Development Setup

If you want to run or modify the tool locally:

1. Install dependencies:
```bash
npm install
```

2. Build the project:
```bash
npm run build
```

3. (Optional) Link globally to use as `image-resizer` everywhere:
```bash
npm link
```

## Usage

Once installed globally or linked, you can run the tool using the `image-resizer` command:
```bash
image-resizer -i <input> -o <output> [options]
```

*(Note: If you are running this from the local repository setup, simply replace `image-resizer` with `npm run cli --` in the examples below.)*

### Options

- `-i, --input <path/url>` **(Required)**: Input file path or URL to download.
- `-o, --output <path>` **(Required)**: Output file path.
- `-w, --width <pixels>`: Target width in pixels.
- `-h, --height <pixels>`: Target height in pixels.
- `-f, --format <format>`: Output format (e.g., `webp`, `jpeg`, `png`, `avif`, `gif`).
- `-q, --quality <number>`: Output quality (1-100). Default is `80`.
- `-a, --action <action>`: Action to perform (`resize`, `crop`). Default is `resize`.
- `--fit <strategy>`: Fit strategy (`cover`, `contain`, `fill`, `inside`, `outside`).
- `--withoutEnlargement`: Prevent enlarging the image if it is smaller than the target size.
- `--rotate <degrees/auto>`: Degrees to rotate the image, or `auto` for EXIF orientation.
- `--blur <sigma>`: Sigma value for Gaussian blur.
- `--grayscale`: Convert the image to grayscale.
- `--help`: Show the help message.

---

### Examples

**Basic Resize (Local file)**
Resize an image to 800x600 pixels.
```bash
image-resizer -i photo.jpg -o photo-resized.jpg -w 800 -h 600
```

**Convert HEIC to Standard Format**
Convert HEIC/HEIF images to PNG, JPEG, or WebP.
```bash
# Convert HEIC to JPEG
image-resizer -i IMG_1234.HEIC -o output.jpg -f jpg -q 90

# Convert HEIC to WebP with resize
image-resizer -i IMG_1234.HEIC -o output.webp -f webp -w 1920 -q 85
```

**Convert Format & Adjust Quality**
Convert a PNG to WebP with 90% quality.
```bash
image-resizer -i image.png -o image.webp -f webp -q 90
```

**Process an Image from a URL**
Download and convert an image from the web directly into AVIF format.
```bash
image-resizer -i "https://example.com/logo.png" -o logo.avif -f avif
```

**Advanced Transformations (Grayscale, Blur, and Rotate)**
Rotate by 90 degrees, convert to grayscale, and add a blur effect.
```bash
image-resizer -i original.jpg -o modified.jpg --rotate 90 --grayscale --blur 5.5
```

**Use a Specific Fit Strategy**
Ensure the entire image is visible within a 500x500 box without cropping (`contain`), preserving aspect ratio.
```bash
image-resizer -i photo.jpg -o photo-contained.jpg -w 500 -h 500 --fit contain
```

## Contributing & Bug Reports

Contributions, issues, and feature requests are very welcome! 

- **Found a bug?** Please feel free to open an issue in the repository with details about what went wrong and, if possible, the image file that caused the problem.
- **Want to contribute?** Feel free to fork the repository and submit a Pull Request.

## License

This project is licensed under the [MIT License](LICENSE).
