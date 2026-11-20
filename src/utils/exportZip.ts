import JSZip from 'jszip';
import { renderCardToPngBlob } from '../canvas/renderCard';
import { CardDraftState } from '../types/card';
import { buildCardDownloadFilename } from './storage';

export interface BulkExportProgress {
  completed: number;
  total: number;
  currentName: string;
}

export function triggerBlobDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1500);
}

export async function generateBulkZipExport(
  baseDraft: CardDraftState,
  names: string[],
  resolution: { width: number; height: number },
  onProgress: (progress: BulkExportProgress) => void,
  signal?: AbortSignal
): Promise<number> {
  const cleanNames = names.map((n) => n.trim()).filter(Boolean);
  if (cleanNames.length === 0) {
    throw new Error('Please enter at least one guest or recipient name.');
  }

  const zip = new JSZip();
  const usedFilenames = new Map<string, number>();

  for (let i = 0; i < cleanNames.length; i++) {
    if (signal?.aborted) {
      throw new Error('Export cancelled.');
    }

    const name = cleanNames[i];
    onProgress({
      completed: i,
      total: cleanNames.length,
      currentName: name,
    });

    let personalizedDraft: CardDraftState;
    switch (baseDraft.category) {
      case 'invitation':
        personalizedDraft = {
          ...baseDraft,
          invitation: { ...baseDraft.invitation, guestName: name },
        };
        break;
      case 'place-card':
        personalizedDraft = {
          ...baseDraft,
          placeCard: { ...baseDraft.placeCard, guestName: name },
        };
        break;
      case 'gift-tag':
        personalizedDraft = {
          ...baseDraft,
          giftTag: { ...baseDraft.giftTag, toName: name },
        };
        break;
      case 'thank-you':
        personalizedDraft = {
          ...baseDraft,
          thankYou: { ...baseDraft.thankYou, recipientName: name },
        };
        break;
      case 'menu':
        personalizedDraft = {
          ...baseDraft,
          menu: { ...baseDraft.menu, subtitle: name },
        };
        break;
      default:
        personalizedDraft = {
          ...baseDraft,
          wishes: { ...baseDraft.wishes, recipientName: name },
        };
        break;
    }

    const blob = await renderCardToPngBlob(
      personalizedDraft,
      resolution.width,
      resolution.height
    );

    let filename = buildCardDownloadFilename(baseDraft.category, name);
    const seen = usedFilenames.get(filename) || 0;
    if (seen > 0) {
      filename = filename.replace(/\.png$/, `-${seen + 1}.png`);
    }
    usedFilenames.set(filename, seen + 1);

    zip.file(filename, blob);

    // Yield back to browser event loop to keep UI responsive
    await new Promise((r) => window.setTimeout(r, 12));
  }

  if (signal?.aborted) {
    throw new Error('Export cancelled.');
  }

  onProgress({
    completed: cleanNames.length,
    total: cleanNames.length,
    currentName: 'Packaging ZIP archive...',
  });

  const zipBlob = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  });

  const zipName = `santa-studio-${baseDraft.category}s.zip`;

  triggerBlobDownload(zipBlob, zipName);
  return cleanNames.length;
}
