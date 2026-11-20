import React, { useRef, useState } from 'react';
import {
  ImagePlus,
  RefreshCw,
  Trash2,
  Move,
  ZoomIn,
  AlertCircle,
} from 'lucide-react';
import { PhotoSettings } from '../types/card';
import { formatFileSize, processUploadedPhotoFile } from '../utils/storage';

interface PhotoUploaderProps {
  photo: PhotoSettings;
  onChange: (next: PhotoSettings) => void;
}

export const PhotoUploader: React.FC<PhotoUploaderProps> = ({
  photo,
  onChange,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const dragOriginRef = useRef<{
    clientX: number;
    clientY: number;
    startX: number;
    startY: number;
  } | null>(null);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setErrorMsg(null);
    setIsProcessing(true);
    try {
      const processed = await processUploadedPhotoFile(file);
      onChange({
        dataUrl: processed.dataUrl,
        fileName: processed.fileName,
        fileSize: processed.fileSize,
        zoom: 1,
        offsetX: 0,
        offsetY: 0,
      });
    } catch (err) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : 'Unable to load that photograph. Please try another file.'
      );
    } finally {
      setIsProcessing(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    void handleFile(file);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!photo.dataUrl) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    dragOriginRef.current = {
      clientX: e.clientX,
      clientY: e.clientY,
      startX: photo.offsetX,
      startY: photo.offsetY,
    };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragOriginRef.current) return;
    const dx = e.clientX - dragOriginRef.current.clientX;
    const dy = e.clientY - dragOriginRef.current.clientY;
    const nextX = Math.max(-100, Math.min(100, Math.round(dragOriginRef.current.startX + dx * 0.7)));
    const nextY = Math.max(-100, Math.min(100, Math.round(dragOriginRef.current.startY + dy * 0.7)));
    onChange({
      ...photo,
      offsetX: nextX,
      offsetY: nextY,
    });
  };

  const handlePointerUp = () => {
    dragOriginRef.current = null;
  };

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
        className="sr-only"
        aria-label="Upload personal photograph"
        onChange={(e) => void handleFile(e.target.files?.[0])}
      />

      {!photo.dataUrl ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`rounded-xl border-2 border-dashed p-5 text-center transition-colors ${
            isDragging
              ? 'border-[#D8B56D] bg-[#1D4A35]/70'
              : 'border-[#D8B56D]/55 bg-[#143B2C]/55 hover:border-[#D8B56D]'
          }`}
        >
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#091725]/60 text-[#D8B56D]">
            <ImagePlus className="h-6 w-6" />
          </div>
          <p className="mt-3 text-sm font-semibold text-[#F8F1E5]">
            Add your personal touch
          </p>
          <p className="mt-1 text-xs leading-relaxed text-[#F8F1E5]/75">
            Upload a photo to make your Christmas card special.
          </p>
          <button
            type="button"
            disabled={isProcessing}
            onClick={() => inputRef.current?.click()}
            className="mt-4 inline-flex min-h-10 items-center justify-center rounded-lg bg-[#D8B56D] px-4 py-2 text-xs font-semibold text-[#091725] transition-colors hover:bg-[#E4C788] disabled:opacity-60"
          >
            {isProcessing ? 'Preparing Photo...' : 'Browse Photos'}
          </button>
          <p className="mt-2.5 text-[11px] text-[#B9D9EC]/75">
            JPG, PNG or WebP up to 10 MB · Processed privately on your device
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-[#D8B56D]/30 bg-[#143B2C]/40 p-4 space-y-4">
          {/* Interactive drag-to-pan crop preview */}
          <div className="flex items-start gap-3.5">
            <div
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              title="Drag to reposition photo"
              className="relative h-24 w-24 shrink-0 cursor-grab active:cursor-grabbing overflow-hidden rounded-lg border border-[#D8B56D]/50 bg-[#091725] touch-none select-none"
            >
              <img
                src={photo.dataUrl}
                alt="Uploaded card photo preview"
                draggable={false}
                className="h-full w-full object-cover transition-transform duration-75"
                style={{
                  transform: `scale(${photo.zoom}) translate(${photo.offsetX * 0.22}%, ${photo.offsetY * 0.22}%)`,
                }}
              />
              <span className="pointer-events-none absolute bottom-1 right-1 rounded bg-[#091725]/80 p-1 text-[#D8B56D]">
                <Move className="h-3 w-3" />
              </span>
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-[#F8F1E5]">
                {photo.fileName || 'Uploaded photograph'}
              </p>
              <p className="mt-0.5 text-xs text-[#B9D9EC]/80">
                {formatFileSize(photo.fileSize)} · Drag image or use sliders to crop
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-[#D8B56D]/35 bg-[#091725]/60 px-3 py-1.5 text-xs font-medium text-[#F8F1E5] hover:bg-[#091725]"
                >
                  <RefreshCw className="h-3.5 w-3.5 text-[#D8B56D]" />
                  <span>Replace</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    onChange({
                      dataUrl: null,
                      fileName: '',
                      fileSize: 0,
                      zoom: 1,
                      offsetX: 0,
                      offsetY: 0,
                    })
                  }
                  className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-[#A92332]/50 bg-[#751C2C]/35 px-3 py-1.5 text-xs font-medium text-[#F8F1E5] hover:bg-[#A92332]/50"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Remove</span>
                </button>
              </div>
            </div>
          </div>

          {/* Crop & Position Controls */}
          <div className="space-y-2.5 border-t border-[#D8B56D]/15 pt-3">
            <label className="block">
              <div className="mb-1 flex items-center justify-between text-xs text-[#F8F1E5]/85">
                <span className="inline-flex items-center gap-1.5">
                  <ZoomIn className="h-3.5 w-3.5 text-[#D8B56D]" />
                  Zoom
                </span>
                <span className="tabular-nums text-[#D8B56D]">
                  {photo.zoom.toFixed(1)}×
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={2.4}
                step={0.05}
                value={photo.zoom}
                onChange={(e) =>
                  onChange({ ...photo, zoom: parseFloat(e.target.value) })
                }
                className="w-full accent-[#D8B56D]"
              />
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <div className="mb-1 flex justify-between text-[11px] text-[#F8F1E5]/80">
                  <span>Horizontal</span>
                  <span className="tabular-nums">{photo.offsetX}%</span>
                </div>
                <input
                  type="range"
                  min={-100}
                  max={100}
                  step={2}
                  value={photo.offsetX}
                  onChange={(e) =>
                    onChange({ ...photo, offsetX: parseInt(e.target.value, 10) })
                  }
                  className="w-full accent-[#D8B56D]"
                />
              </label>

              <label className="block">
                <div className="mb-1 flex justify-between text-[11px] text-[#F8F1E5]/80">
                  <span>Vertical</span>
                  <span className="tabular-nums">{photo.offsetY}%</span>
                </div>
                <input
                  type="range"
                  min={-100}
                  max={100}
                  step={2}
                  value={photo.offsetY}
                  onChange={(e) =>
                    onChange({ ...photo, offsetY: parseInt(e.target.value, 10) })
                  }
                  className="w-full accent-[#D8B56D]"
                />
              </label>
            </div>
          </div>
        </div>
      )}

      {errorMsg && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-lg border border-[#A92332]/60 bg-[#751C2C]/40 p-3 text-xs text-[#F8F1E5]"
        >
          <AlertCircle className="h-4 w-4 shrink-0 text-[#F8F1E5]" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
};
