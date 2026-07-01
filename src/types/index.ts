import { Sharp } from 'sharp';

export type ActionType = 'crop' | 'resize';

export type GravityType = 'c' | 'e' | 'w' | 'n' | 'ne' | 'nw' | 's' | 'se' | 'sw';

export type ImageFormat = 'png' | 'jpg' | 'jpeg' | 'webp' | 'tiff' | 'avif' | 'gif' | 'svg';

export interface ResizeOptions {
    action: ActionType;
    width: number;
    height: number;
    gravity: GravityType;
    format: ImageFormat;
    quality: number;
    url: string;
    contentType: string;
    fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
    withoutEnlargement?: boolean;
    rotate?: 'auto' | number;
    blur?: number;
    grayscale?: boolean;
}
