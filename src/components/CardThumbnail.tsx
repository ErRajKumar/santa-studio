import React, { useEffect, useRef, useState } from 'react';
import {
  getTemplateDimensions,
  renderCardToCanvas,
  renderGiftTagSheetToCanvas,
  renderPlaceCardMockupToCanvas,
} from '../canvas/renderCard';
import { TemplateConfig } from '../types/card';
import { createInitialDraft } from '../utils/storage';

interface CardThumbnailProps {
  template: TemplateConfig;
  width?: number;
  /** Kept for backwards compatibility; ignored so true aspect ratio is never distorted */
  height?: number;
  scene?: 'card' | 'table-mockup' | 'tag-sheet';
  className?: string;
}

export const CardThumbnail: React.FC<CardThumbnailProps> = ({
  template,
  width = 480,
  scene = 'card',
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [visible, setVisible] = useState(false);
  const [rendered, setRendered] = useState(false);

  const dims = getTemplateDimensions(template);
  const isTableMockup =
    scene === 'table-mockup' && template.category === 'place-card';
  const isTagSheet =
    scene === 'tag-sheet' && template.category === 'gift-tag';

  const aspectW = isTableMockup ? 1200 : isTagSheet ? 850 : dims.width;
  const aspectH = isTableMockup ? 860 : isTagSheet ? 1100 : dims.height;

  const targetW = width;
  const targetH = Math.round(targetW * (aspectH / aspectW));

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (!('IntersectionObserver' in window)) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '250px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || !canvasRef.current) return;
    let cancelled = false;
    setRendered(false);

    const draft = createInitialDraft(template.category, template.id);
    const renderPromise = isTableMockup
      ? renderPlaceCardMockupToCanvas(canvasRef.current, draft, targetW, targetH)
      : isTagSheet
        ? renderGiftTagSheetToCanvas(canvasRef.current, draft, targetW, targetH)
        : renderCardToCanvas(canvasRef.current, draft, targetW, targetH);

    renderPromise.then(() => {
      if (!cancelled) setRendered(true);
    });

    return () => {
      cancelled = true;
    };
  }, [visible, template.id, template.category, targetW, targetH, isTableMockup, isTagSheet]);

  return (
    <div
      ref={containerRef}
      style={{ aspectRatio: `${aspectW} / ${aspectH}` }}
      className={`relative w-full overflow-hidden bg-[#0D2134] ${className}`}
    >
      {!rendered && (
        <div
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center bg-[#0F2438]"
          style={{ backgroundColor: template.palette.background }}
        >
          <span className="px-2 text-center text-xs font-medium text-[#F8F1E5]/70">
            {template.name}
          </span>
        </div>
      )}
      <canvas
        ref={canvasRef}
        aria-label={`${template.name} preview`}
        className={`block h-full w-full transition-opacity duration-300 ${
          rendered ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
};
