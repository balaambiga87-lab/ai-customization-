"use client";

import React, { useState, useEffect, useRef } from 'react';

interface TransparentImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  threshold?: number;
  bgColor?: 'white' | 'black' | 'checkerboard' | 'none';
}

export function TransparentImage({
  src,
  threshold = 210,
  bgColor = 'white',
  ...props
}: TransparentImageProps) {
  const [processedSrc, setProcessedSrc] = useState<string>(src);
  const cacheRef = useRef<Record<string, string>>({});

  useEffect(() => {
    if (!src) return;

    // SVG files and 'none' mode: render as-is
    if (src.endsWith('.svg') || bgColor === 'none') {
      setProcessedSrc(src);
      return;
    }

    const cacheKey = `${src}__${bgColor}__${threshold}`;
    if (cacheRef.current[cacheKey]) {
      setProcessedSrc(cacheRef.current[cacheKey]);
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = src;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width  = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) { setProcessedSrc(src); return; }

      ctx.drawImage(img, 0, 0);
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data    = imgData.data;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];

        if (a === 0) continue;

        const maxDiff = Math.max(Math.abs(r - g), Math.abs(g - b), Math.abs(r - b));
        const isNeutral = maxDiff < 22;

        // Preserve gold/warm metallic luster (high R & G compared to B)
        const isGold = (r > g + 10 && g > b + 10) || (r > 170 && g > 130 && b < 120);
        // Preserve vivid gem color facets (ruby, emerald, sapphire)
        const isGemColor = (b > r + 30) || (r > b + 30 && g < 140) || (g > r + 20 && g > b + 20);

        if (!isGold && !isGemColor) {
          // Remove near-white OR neutral grey checkerboard tiles (#ffffff, #e2e8f0, #cccccc, #d1d5db)
          if ((isNeutral && r > 160 && g > 160 && b > 160) || (r >= threshold && g >= threshold && b >= threshold)) {
            data[i + 3] = 0;
          }
        }
      }

      ctx.putImageData(imgData, 0, 0);
      const dataUrl = canvas.toDataURL('image/png');
      cacheRef.current[cacheKey] = dataUrl;
      setProcessedSrc(dataUrl);
    };
    img.onerror = () => { setProcessedSrc(src); };
  }, [src, threshold, bgColor]);

  if (!processedSrc) {
    return <img {...props} src={src} style={{ ...props.style, opacity: 0 }} alt="" />;
  }

  return <img {...props} src={processedSrc} alt={props.alt || ''} />;
}
