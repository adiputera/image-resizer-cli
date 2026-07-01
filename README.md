# CLI Image Resizer

A lightweight CLI tool for image resizing and conversion, built with TypeScript and [Sharp](https://sharp.pixelplumbing.com/).

It supports resizing, cropping, converting formats (WebP, AVIF, PNG, JPEG), HEIC decoding, rotation, grayscale, and blur processing. You can also provide URLs directly as input!

## Prerequisites

- Node.js 18+ or 20+

## Setup

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

You can run the tool via npm if in the repository directory:
```bash
npm run cli -- -i <input> -o <output> [options]
```

Or globally if you have installed/linked it:
```bash
image-resizer -i <input> -o <output> [options]
```

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
