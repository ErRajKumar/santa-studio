import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Archive,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
} from 'lucide-react';
import { getTemplateDimensions } from '../canvas/renderCard';
import { getTemplateById } from '../templates/templatesData';
import { CardDraftState } from '../types/card';
import {
  BulkExportProgress,
  generateBulkZipExport,
} from '../utils/exportZip';

interface BulkDownloadModalProps {
  open: boolean;
  onClose: () => void;
  draft: CardDraftState;
}

export const BulkDownloadModal: React.FC<BulkDownloadModalProps> = ({
  open,
  onClose,
  draft,
}) => {
  const [namesText, setNamesText] = useState(
    'Oliver\nEthan\nHannah\nLiam\nGrace'
  );
  const [quality, setQuality] = useState<'hd' | 'standard'>('hd');
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState<BulkExportProgress | null>(null);
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const parsedNames = useMemo(
    () =>
      namesText
        .split(/\r?\n/)
        .map((n) => n.trim())
        .filter(Boolean),
    [namesText]
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isExporting) onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, isExporting, onClose]);

  if (!open) return null;

  const dims = getTemplateDimensions(getTemplateById(draft.templateId));
  const stdRes = { width: dims.width, height: dims.height };
  const hdRes = { width: dims.width * 2, height: dims.height * 2 };

  const handleStartExport = async () => {
    if (parsedNames.length === 0) {
      setStatusMessage({
        type: 'error',
        text: 'Please enter at least one guest or recipient name.',
      });
      return;
    }

    const controller = new AbortController();
    abortRef.current = controller;
    setIsExporting(true);
    setStatusMessage(null);
    setProgress({
      completed: 0,
      total: parsedNames.length,
      currentName: parsedNames[0],
    });

    const resolution = quality === 'hd' ? hdRes : stdRes;

    try {
      const count = await generateBulkZipExport(
        draft,
        parsedNames,
        resolution,
        (prog) => setProgress(prog),
        controller.signal
      );
      setStatusMessage({
        type: 'success',
        text: `${count} personalised PNG cards packaged and downloaded as a ZIP file.`,
      });
    } catch (err) {
      setStatusMessage({
        type: 'error',
        text:
          err instanceof Error
            ? err.message
            : 'Could not complete bulk ZIP export.',
      });
    } finally {
      setIsExporting(false);
      abortRef.current = null;
    }
  };

  const handleCancelExport = () => {
    abortRef.current?.abort();
  };

  const progressPct =
    progress && progress.total > 0
      ? Math.round((progress.completed / progress.total) * 100)
      : 0;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="bulk-zip-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#050C14]/80 p-4 backdrop-blur-sm"
      onClick={() => {
        if (!isExporting) onClose();
      }}
    >
      <div
        className="w-full max-w-lg rounded-2xl border border-[#D8B56D]/25 bg-[#0D1E30] p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2
              id="bulk-zip-title"
              className="font-display text-xl font-semibold text-[#F8F1E5]"
            >
              Bulk Personalised ZIP Download
            </h2>
            <p className="mt-1 text-xs leading-relaxed text-[#F8F1E5]/75">
              Enter one{' '}
              {draft.category === 'invitation' || draft.category === 'place-card'
                ? 'guest name'
                : 'recipient name'}{' '}
              per line. Santa Studio renders each card in your browser and
              packages them into one ZIP file.
            </p>
          </div>
          <button
            type="button"
            disabled={isExporting}
            onClick={onClose}
            aria-label="Close bulk export dialog"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[#F8F1E5]/70 hover:bg-[#143B2C]/50 hover:text-[#F8F1E5] disabled:opacity-40"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 space-y-4">
          <div>
            <div className="mb-1.5 flex items-center justify-between text-xs">
              <label
                htmlFor="bulk-names-textarea"
                className="font-medium text-[#F8F1E5]"
              >
                {draft.category === 'invitation' ||
                draft.category === 'place-card'
                  ? 'Guest Names (one per line)'
                  : 'Recipient Names (one per line)'}
              </label>
              <span className="tabular-nums text-[#D8B56D]">
                {parsedNames.length}{' '}
                {parsedNames.length === 1 ? 'card' : 'cards'} to generate
              </span>
            </div>
            <textarea
              id="bulk-names-textarea"
              rows={6}
              disabled={isExporting}
              value={namesText}
              onChange={(e) => setNamesText(e.target.value)}
              placeholder={'Oliver\nEthan\nHannah\nLiam\nGrace'}
              className="w-full rounded-xl border border-[#D8B56D]/25 bg-[#091725] p-3 text-sm text-[#F8F1E5] placeholder:text-[#F8F1E5]/35 focus:border-[#D8B56D] focus:outline-none disabled:opacity-60"
            />
          </div>

          <div className="flex items-center justify-between gap-3 rounded-xl border border-[#D8B56D]/15 bg-[#091725]/60 p-3">
            <span className="text-xs font-medium text-[#F8F1E5]/85">
              Export Resolution
            </span>
            <div className="flex gap-1.5">
              <button
                type="button"
                disabled={isExporting}
                onClick={() => setQuality('standard')}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  quality === 'standard'
                    ? 'bg-[#D8B56D] text-[#091725]'
                    : 'text-[#F8F1E5]/75 hover:bg-[#143B2C]/50'
                }`}
              >
                {stdRes.width} × {stdRes.height}
              </button>
              <button
                type="button"
                disabled={isExporting}
                onClick={() => setQuality('hd')}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  quality === 'hd'
                    ? 'bg-[#D8B56D] text-[#091725]'
                    : 'text-[#F8F1E5]/75 hover:bg-[#143B2C]/50'
                }`}
              >
                Print HD {hdRes.width} × {hdRes.height}
              </button>
            </div>
          </div>

          {isExporting && progress && (
            <div className="space-y-2 rounded-xl border border-[#D8B56D]/25 bg-[#091725]/80 p-3.5">
              <div className="flex items-center justify-between text-xs">
                <span className="inline-flex items-center gap-2 text-[#F8F1E5]">
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-[#D8B56D]" />
                  Rendering: <strong>{progress.currentName}</strong>
                </span>
                <span className="tabular-nums text-[#D8B56D]">
                  {progress.completed} / {progress.total}
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-[#143B2C]">
                <div
                  className="h-full bg-[#D8B56D] transition-all duration-150"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          )}

          {statusMessage && (
            <div
              role="status"
              className={`flex items-start gap-2.5 rounded-xl border p-3 text-xs ${
                statusMessage.type === 'success'
                  ? 'border-[#1D4A35] bg-[#143B2C]/60 text-[#F8F1E5]'
                  : 'border-[#A92332]/60 bg-[#751C2C]/40 text-[#F8F1E5]'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-[#D8B56D]" />
              ) : (
                <AlertCircle className="h-4 w-4 shrink-0 text-[#F8F1E5]" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
          {isExporting ? (
            <button
              type="button"
              onClick={handleCancelExport}
              className="inline-flex min-h-10 items-center justify-center rounded-lg border border-[#A92332]/60 bg-[#751C2C]/40 px-4 py-2 text-sm font-medium text-[#F8F1E5] hover:bg-[#A92332]/60"
            >
              Cancel Export
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex min-h-10 items-center justify-center rounded-lg border border-[#D8B56D]/25 px-4 py-2 text-sm font-medium text-[#F8F1E5]/85 hover:bg-[#143B2C]/40"
              >
                Close
              </button>
              <button
                type="button"
                disabled={parsedNames.length === 0}
                onClick={() => void handleStartExport()}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#D8B56D] px-5 py-2 text-sm font-semibold text-[#091725] transition-colors hover:bg-[#E4C788] disabled:opacity-50"
              >
                <Archive className="h-4 w-4" />
                <span>Generate & Download ZIP</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
