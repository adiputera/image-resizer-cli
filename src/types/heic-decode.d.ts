declare module 'heic-decode' {
    interface DecodeResult {
        width: number;
        height: number;
        data: Uint8ClampedArray;
    }

    interface DecodeOptions {
        buffer: Buffer;
    }

    function decode(options: DecodeOptions): Promise<DecodeResult>;
    
    export = decode;
}
