import React, { useEffect, useState } from 'react';
import { ArrowRight, Grid2X2, Utensils, X } from 'lucide-react';
import { getTemplateDimensions } from '../canvas/renderCard';
import { TemplateConfig } from '../types/card';
import { CardThumbnail } from './CardThumbnail';

interface PreviewModalProps {
  template: TemplateConfig | null;
  onClose: () => void;
}

export const PreviewModal: React.FC<PreviewModalProps> = ({
  template,
  onClose,
}) => {
  const [previewMode, setPreviewMode] = useState<'card' | 'contextual'>('card');

  useEffect(() => {
    setPreviewMode('card');
  }, [template?.id]);

  useEffect(() => {
    if (!template) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [template, onClose]);

  if (!template) return null;

  const editorHref = `./editor.html?type=${template.category}&template=${template.id}`;
  const dims = getTemplateDimensions(template);

  const categoryLabelMap: Record<TemplateConfig['category'], string> = {
    invitation: 'Invitation Card',
    wishes: 'Wishes Card',
    menu: 'Christmas Menu',
    'place-card': 'Place Card',
    'gift-tag': 'Gift Tag',
    'thank-you': 'Thank-You Card',
  };

  const hasContextualToggle =
    template.category === 'place-card' || template.category === 'gift-tag';

  const activeScene: 'card' | 'table-mockup' | 'tag-sheet' =
    previewMode === 'contextual'
      ? template.category === 'place-card'
        ? 'table-mockup'
        : template.category === 'gift-tag'
          ? 'tag-sheet'
          : 'card'
      : 'card';

  const isWide =
    activeScene === 'table-mockup' || dims.width > dims.height;

  const formatLine = (() => {
    switch (template.category) {
      case 'menu':
        return `5:7 Portrait Menu · ${dims.width * 2} × ${dims.height * 2} px HD PNG`;
      case 'place-card':
        return '7:4 Tent-Fold Card (3.5 × 2.0 in folded) · 4-Up Print Sheet';
      case 'gift-tag':
        return `Die-Cut ${template.tagShape?.replace('-', ' ') ?? 'Gift'} Tag · 6-Up Cut Sheet`;
      case 'thank-you':
        return `${dims.width > dims.height ? '7:5 Landscape' : '4:5 Portrait'} · ${dims.width * 2} × ${dims.height * 2} px HD PNG`;
      default:
        return '4:5 Portrait · Print-ready 2400 × 3000 px PNG';
    }
  })();

  const pdfLine = (() => {
    switch (template.category) {
      case 'place-card':
        return 'Print-ready PDF: 4-Up Tent Sheet with center fold lines (Letter & A4)';
      case 'gift-tag':
        return 'Print-ready PDF: 6-Up Sheet on crisp white cardstock with cut guides';
      case 'thank-you':
        return dims.width > dims.height
          ? 'Print-ready PDF: Landscape 5×7, 4×6, US Letter & A4'
          : 'Print-ready PDF: Portrait 5×7, 4×6, US Letter & A4';
      default:
        return 'Print-ready PDF export: 5×7, 4×6, US Letter & A4';
    }
  })();

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="preview-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#050C14]/85 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[92dvh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-[#D8B56D]/25 bg-[#0D1E30] shadow-2xl md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close preview"
          className="absolute right-3 top-3 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#091725]/80 text-[#F8F1E5] hover:bg-[#143B2C] focus-visible:outline-2 focus-visible:outline-[#D8B56D]"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex flex-col items-center justify-center gap-4 bg-[#07111C] p-5 sm:p-8 md:w-[58%]">
          {hasContextualToggle && (
            <div className="flex items-center gap-1 rounded-lg border border-[#D8B56D]/20 bg-[#0D2134] p-1">
              <button
                type="button"
                onClick={() => setPreviewMode('card')}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  previewMode === 'card'
                    ? 'bg-[#D8B56D] text-[#091725]'
                    : 'text-[#F8F1E5]/80 hover:text-[#F8F1E5]'
                }`}
              >
                {template.category === 'place-card'
                  ? 'Card Close-Up'
                  : 'Tag Close-Up'}
              </button>
              <button
                type="button"
                onClick={() => setPreviewMode('contextual')}
                className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  previewMode === 'contextual'
                    ? 'bg-[#D8B56D] text-[#091725]'
                    : 'text-[#F8F1E5]/80 hover:text-[#F8F1E5]'
                }`}
              >
                {template.category === 'place-card' ? (
                  <>
                    <Utensils className="h-3.5 w-3.5" />
                    <span>On Dinner Table</span>
                  </>
                ) : (
                  <>
                    <Grid2X2 className="h-3.5 w-3.5" />
                    <span>6-Up Printable Sheet</span>
                  </>
                )}
              </button>
            </div>
          )}

          <div
            className={`w-full overflow-hidden rounded-xl shadow-[0_24px_48px_rgba(0,0,0,0.5)] ${
              isWide ? 'max-w-[440px]' : 'max-w-[310px]'
            }`}
          >
            <CardThumbnail
              template={template}
              scene={activeScene}
              width={isWide ? 960 : 720}
            />
          </div>
        </div>

        <div className="flex flex-col justify-between gap-6 p-6 sm:p-8 md:w-[42%]">
          <div>
            <p className="text-xs font-medium tracking-wide text-[#D8B56D]">
              {categoryLabelMap[template.category]}{' '}
              <span aria-hidden="true">·</span> {template.styleLabel}
            </p>
            <h2
              id="preview-modal-title"
              className="mt-2 font-display text-2xl font-semibold text-[#F8F1E5]"
            >
              {template.name}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[#F8F1E5]/75">
              {template.description}
            </p>

            <div className="mt-6 space-y-2 border-t border-[#D8B56D]/15 pt-4 text-xs text-[#B9D9EC]/85">
              <p>{formatLine}</p>
              <p>{pdfLine}</p>
              <p>Customisable names, fonts, colours & bulk downloads</p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <a
              href={editorHref}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#D8B56D] px-5 py-2.5 text-sm font-semibold text-[#091725] transition-colors hover:bg-[#E4C788]"
            >
              <span>Customise This Design</span>
              <ArrowRight className="h-4 w-4" />
            </a>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[#D8B56D]/25 px-5 py-2.5 text-sm font-medium text-[#F8F1E5]/85 hover:bg-[#143B2C]/40"
            >
              Back to Collection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
