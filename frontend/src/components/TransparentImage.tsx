"use client";

import React, { useState, useEffect, useRef } from 'react';

interface TransparentImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  threshold?: number;
}

export function TransparentImage({ src, threshold = 220, ...props }: TransparentImageProps) {
  const [processedSrc, setProcessedSrc] = useState<string>(src);
  const cacheRef = useRef<Record<string, string>>({});

  useEffect(() => {
    if (!src) return;
    if (src.endsWith('.svg')) {
      setProcessedSrc(src);
      return;
    }
    if (cacheRef.current[src]) {
      setProcessedSrc(cacheRef.current[src]);
      return;
    }

    const img = new Image();
    img.src = src;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setProcessedSrc(src);
        return;
      }
      ctx.drawImage(img, 0, 0);
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        if (r >= threshold && g >= threshold && b >= threshold) {
          data[i + 3] = 0;
        }
      }
      ctx.putImageData(imgData, 0, 0);
      const dataUrl = canvas.toDataURL();
      cacheRef.current[src] = dataUrl;
      setProcessedSrc(dataUrl);
    };
    img.onerror = () => {
      setProcessedSrc(src);
    };
  }, [src, threshold]);

  if (!processedSrc) {
    return <img {...props} src={src} style={{ ...props.style, opacity: 0 }} alt="" />;
  }

  return <img {...props} src={processedSrc} alt={props.alt || ''} />;
}
