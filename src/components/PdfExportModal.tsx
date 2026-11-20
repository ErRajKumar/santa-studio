import React, { useEffect, useMemo, useState } from 'react';
import {
  CheckCircle2,
  FileText,
  Loader2,
  Printer,
  X,
} from 'lucide-react';
import { CardDraftState } from '../types/card';
import { exportCardToPdf, PdfPageFormat } from '../utils/pdfExport';

interface PdfExportModalProps {
  open: boolean;
  onClose: () => void;
  draft: CardDraftState;
}

const FORMAT_OPTIONS: {
  id: PdfPageFormat;
  title: string;
  dimensions: string;
  note: string;
}[] = [
  {
    id: '5x7',
    title: '5 × 7 Inches (A7 Card)',
    dimensions: '5.0 × 7.0 in',
    note: 'Standard size for Christmas invitations, menus & thank-you cards.',
  },
  {
    id: '4x6',
    title: '4 × 6 Inches (Greeting Card)',
    dimensions: '4.0 × 6.0 in',
    note: 'Ideal photo-lab & greeting card size for wishes cards.',
  },
  {
    id: 'letter',
    title: 'US Letter',
    dimensions: '8.5 × 11.0 in',
    note: 'Home & office printing (single card or multi-up tag/place-card sheets).',
  },
  {
    id: 'a4',
    title: 'A4 International',
    dimensions: '210 × 297 mm',
    note: 'Standard international paper (single card or multi-up tag/place-card sheets).',
  },
];

export const PdfExportModal: React.FC<PdfExportModalProps> = ({
  open,
  onClose,
  draft,
}) => {
  const defaultFormat: PdfPageFormat =
    draft.category === 'wishes'
      ? '4x6'
      : draft.category === 'gift-tag' || draft.category === 'place-card'
        ? 'letter'
        : '5x7';

  const [format, setFormat] = useState<PdfPageFormat>(defaultFormat);
  const [includeCropMarks, setIncludeCropMarks] = useState(true);
  const [sheetMode, setSheetMode] = useState<'single' | 'multi-sheet'>(
    draft.category === 'gift-tag' || draft.category === 'place-card'
      ? 'multi-sheet'
      : 'single'
  );
  const [batchNamesText, setBatchNamesText] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [resultMsg, setResultMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setFormat(defaultFormat);
    setSheetMode(
      draft.category === 'gift-tag' || draft.category === 'place-card'
        ? 'multi-sheet'
        : 'single'
    );
    setResultMsg(null);
  }, [open, defaultFormat, draft.category]);

  const supportsMultiSheet =
    (draft.category === 'gift-tag' || draft.category === 'place-card') &&
    (format === 'letter' || format === 'a4');

  const parsedBatchNames = useMemo(
    () =>
      batchNamesText
        .split(/\r?\n/)
        .map((n) => n.trim())
        .filter(Boolean),
    [batchNamesText]
  );

  if (!open) return null;

  const handleDownloadPdf = async () => {
    setIsExporting(true);
    setResultMsg(null);
    try {
      const filename = await exportCardToPdf(draft, {
        format,
        includeCropMarks,
        sheetMode: supportsMultiSheet ? sheetMode : 'single',
        batchNames: parsedBatchNames.length > 0 ? parsedBatchNames : undefined,
      });
      setResultMsg(`Downloaded print-ready PDF: ${filename}`);
    } catch {
      setResultMsg('Could not generate the PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="pdf-export-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#050C14]/85 p-4 backdrop-blur-sm"
      onClick={() => {
        if (!isExporting) onClose();
      }}
    >
      <div
        className="max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-2xl border border-[#D8B56D]/25 bg-[#0D1E30] p-6 shadow-2xl studio-scroll"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2
              id="pdf-export-title"
              className="font-display text-xl font-semibold text-[#F8F1E5]"
            >
              Export Print-Ready PDF
            </h2>
            <p className="mt-1 text-xs text-[#F8F1E5]/75">
              Exact physical dimensions with zero stretching—ready for home printers or professional print shops.
            </p>
          </div>
          <button
            type="button"
            disabled={isExporting}
            onClick={onClose}
            aria-label="Close PDF export dialog"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[#F8F1E5]/75 hover:bg-[#143B2C]/50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 space-y-4">
          {/* Format Picker */}
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {FORMAT_OPTIONS.map((opt) => {
              const active = format === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setFormat(opt.id)}
                  className={`rounded-xl border p-3 text-left transition-colors ${
                    active
                      ? 'border-[#D8B56D] bg-[#143B2C]/65'
                      : 'border-[#D8B56D]/20 bg-[#091725]/70 hover:border-[#D8B56D]/45'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-[#F8F1E5]">
                      {opt.title}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[11px] font-medium text-[#D8B56D]">
                    {opt.dimensions}
                  </p>
                  <p className="mt-1 text-[11px] leading-snug text-[#F8F1E5]/70">
                    {opt.note}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Multi-up Sheet Option for Place Cards & Gift Tags */}
          {(draft.category === 'gift-tag' || draft.category === 'place-card') && (
            <div className="rounded-xl border border-[#D8B56D]/20 bg-[#091725]/75 p-4 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-[#F8F1E5]">
                  Sheet Layout (US Letter / A4)
                </span>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    disabled={!supportsMultiSheet}
                    onClick={() => setSheetMode('multi-sheet')}
                    className={`rounded-md px-2.5 py-1 text-xs font-medium ${
                      supportsMultiSheet && sheetMode === 'multi-sheet'
                        ? 'bg-[#D8B56D] text-[#091725]'
                        : 'text-[#F8F1E5]/70 hover:text-[#F8F1E5] disabled:opacity-40'
                    }`}
                  >
                    {draft.category === 'gift-tag'
                      ? '6-Up Tag Sheet'
                      : '4-Up Tent Sheet'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSheetMode('single')}
                    className={`rounded-md px-2.5 py-1 text-xs font-medium ${
                      !supportsMultiSheet || sheetMode === 'single'
                        ? 'bg-[#D8B56D] text-[#091725]'
                        : 'text-[#F8F1E5]/70 hover:text-[#F8F1E5]'
                    }`}
                  >
                    Single Item
                  </button>
                </div>
              </div>

              {supportsMultiSheet && sheetMode === 'multi-sheet' && (
                <div>
                  <label
                    htmlFor="pdf-batch-names"
                    className="mb-1 block text-[11px] text-[#B9D9EC]/85"
                  >
                    Optional: Enter multiple names (one per line) to print personalised{' '}
                    {draft.category === 'gift-tag' ? 'tags' : 'place cards'} on one sheet—or leave empty to repeat the current design:
                  </label>
                  <textarea
                    id="pdf-batch-names"
                    rows={3}
                    value={batchNamesText}
                    onChange={(e) => setBatchNamesText(e.target.value)}
                    placeholder={'Oliver\nEthan\nHannah\nLiam'}
                    className="w-full rounded-lg border border-[#D8B56D]/25 bg-[#0D1E30] p-2.5 text-xs text-[#F8F1E5] placeholder:text-[#F8F1E5]/35 focus:border-[#D8B56D] focus:outline-none"
                  />
                </div>
              )}
            </div>
          )}

          {/* Crop Marks Checkbox */}
          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#D8B56D]/20 bg-[#091725]/60 p-3 text-xs text-[#F8F1E5]">
            <input
              type="checkbox"
              checked={includeCropMarks}
              onChange={(e) => setIncludeCropMarks(e.target.checked)}
              className="h-4 w-4 accent-[#D8B56D]"
            />
            <span>
              Include corner trim / crop marks for clean paper cutting
            </span>
          </label>

          {/* Printing Tip */}
          <div className="flex items-start gap-2.5 rounded-xl border border-[#D8B56D]/15 bg-[#143B2C]/35 p-3 text-xs text-[#F8F1E5]/85">
            <Printer className="mt-0.5 h-4 w-4 shrink-0 text-[#D8B56D]" />
            <span>
              When printing, select <strong>Actual Size / 100% Scale</strong> in your printer dialog and use 250–300 gsm matte cardstock for crisp results.
            </span>
          </div>

          {resultMsg && (
            <div
              role="status"
              className="flex items-start gap-2 rounded-xl border border-[#1D4A35] bg-[#143B2C]/65 p-3 text-xs text-[#F8F1E5]"
            >
              <CheckCircle2 className="h-4 w-4 shrink-0 text-[#D8B56D]" />
              <span>{resultMsg}</span>
            </div>
          )}
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            disabled={isExporting}
            onClick={onClose}
            className="inline-flex min-h-10 items-center rounded-lg border border-[#D8B56D]/25 px-4 py-2 text-sm font-medium text-[#F8F1E5]/85 hover:bg-[#143B2C]/40"
          >
            Close
          </button>
          <button
            type="button"
            disabled={isExporting}
            onClick={() => void handleDownloadPdf()}
            className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#D8B56D] px-5 py-2 text-sm font-semibold text-[#091725] transition-colors hover:bg-[#E4C788] disabled:opacity-60"
          >
            {isExporting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <FileText className="h-4 w-4" />
            )}
            <span>{isExporting ? 'Generating PDF...' : 'Download Print PDF'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
