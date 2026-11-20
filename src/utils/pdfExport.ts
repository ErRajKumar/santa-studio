import { jsPDF } from 'jspdf';
import {
  getTemplateDimensions,
  renderCardToJpegDataUrl,
} from '../canvas/renderCard';
import { getTemplateById } from '../templates/templatesData';
import { CardDraftState } from '../types/card';
import { triggerBlobDownload } from './exportZip';
import { buildCardDownloadFilename } from './storage';

export type PdfPageFormat = '5x7' | '4x6' | 'letter' | 'a4';

export interface PdfExportOptions {
  format: PdfPageFormat;
  includeCropMarks: boolean;
  sheetMode: 'single' | 'multi-sheet';
  batchNames?: string[];
}

interface PageDimensions {
  widthIn: number;
  heightIn: number;
  label: string;
}

const PAGE_SIZES: Record<PdfPageFormat, PageDimensions> = {
  '5x7': { widthIn: 5, heightIn: 7, label: '5 × 7 inches' },
  '4x6': { widthIn: 4, heightIn: 6, label: '4 × 6 inches' },
  letter: { widthIn: 8.5, heightIn: 11, label: 'US Letter (8.5 × 11 in)' },
  a4: { widthIn: 8.2677, heightIn: 11.6929, label: 'A4 (210 × 297 mm)' },
};

function drawCropMarks(
  doc: jsPDF,
  x: number,
  y: number,
  w: number,
  h: number,
  markLen = 0.14,
  offset = 0.05
): void {
  doc.setDrawColor(120, 120, 120);
  doc.setLineWidth(0.008);

  // Top-left
  doc.line(x - offset - markLen, y, x - offset, y);
  doc.line(x, y - offset - markLen, x, y - offset);
  // Top-right
  doc.line(x + w + offset, y, x + w + offset + markLen, y);
  doc.line(x + w, y - offset - markLen, x + w, y - offset);
  // Bottom-left
  doc.line(x - offset - markLen, y + h, x - offset, y + h);
  doc.line(x, y + h + offset, x, y + h + offset + markLen);
  // Bottom-right
  doc.line(x + w + offset, y + h, x + w + offset + markLen, y + h);
  doc.line(x + w, y + h + offset, x + w, y + h + offset + markLen);
}

function drawDashedRect(
  doc: jsPDF,
  x: number,
  y: number,
  w: number,
  h: number
): void {
  doc.setDrawColor(145, 145, 145);
  doc.setLineWidth(0.008);
  doc.setLineDashPattern([0.07, 0.05], 0);
  doc.rect(x, y, w, h);
  doc.setLineDashPattern([], 0);
}

function drawDashedLine(
  doc: jsPDF,
  x1: number,
  y1: number,
  x2: number,
  y2: number
): void {
  doc.setDrawColor(135, 135, 135);
  doc.setLineWidth(0.009);
  doc.setLineDashPattern([0.1, 0.06], 0);
  doc.line(x1, y1, x2, y2);
  doc.setLineDashPattern([], 0);
}

export async function exportCardToPdf(
  draft: CardDraftState,
  options: PdfExportOptions
): Promise<string> {
  const dim = PAGE_SIZES[options.format];
  const template = getTemplateById(draft.templateId);
  const dims = getTemplateDimensions(template);
  const cardAspect = dims.width / dims.height;

  // Multi-up sheet for Gift Tags or Place Cards on US Letter / A4
  if (
    options.sheetMode === 'multi-sheet' &&
    (options.format === 'letter' || options.format === 'a4') &&
    (draft.category === 'gift-tag' || draft.category === 'place-card')
  ) {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'in',
      format: [dim.widthIn, dim.heightIn],
      compress: true,
    });

    const names =
      options.batchNames && options.batchNames.length > 0
        ? options.batchNames
        : null;

    if (draft.category === 'gift-tag') {
      // 6-up Die-Cut Gift Tags (2 columns x 3 rows on clean white cardstock)
      const cols = 2;
      const rows = 3;
      const perPage = cols * rows;
      const itemH = 3.0;
      const itemW = itemH * cardAspect;
      const gapX = 0.65;
      const gapY = 0.34;
      const totalGridW = cols * itemW + (cols - 1) * gapX;
      const totalGridH = rows * itemH + (rows - 1) * gapY;
      const startX = (dim.widthIn - totalGridW) / 2;
      const startY = (dim.heightIn - totalGridH) / 2 + 0.12;

      const totalItems = names ? names.length : perPage;
      const totalPages = Math.ceil(totalItems / perPage);

      for (let page = 0; page < totalPages; page++) {
        if (page > 0) doc.addPage([dim.widthIn, dim.heightIn], 'portrait');

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(95, 95, 95);
        doc.text(
          `Santa Studio · Printable Die-Cut Gift Tags (${dim.label}) · Cut along dashed tag outlines`,
          dim.widthIn / 2,
          0.38,
          { align: 'center' }
        );

        for (let slotIdx = 0; slotIdx < perPage; slotIdx++) {
          const itemIdx = page * perPage + slotIdx;
          if (names && itemIdx >= names.length) break;

          const col = slotIdx % cols;
          const row = Math.floor(slotIdx / cols);
          const x = startX + col * (itemW + gapX);
          const y = startY + row * (itemH + gapY);

          const itemDraft: CardDraftState = names
            ? {
                ...draft,
                giftTag: { ...draft.giftTag, toName: names[itemIdx] },
              }
            : draft;

          const imgData = await renderCardToJpegDataUrl(
            itemDraft,
            Math.round(dims.width * 1.5),
            Math.round(dims.height * 1.5),
            { renderMode: 'print-cut' }
          );
          doc.addImage(imgData, 'JPEG', x, y, itemW, itemH, undefined, 'FAST');

          if (options.includeCropMarks) {
            drawCropMarks(doc, x, y, itemW, itemH, 0.08, 0.03);
          }
        }
      }
    } else {
      // 4-up Tent-Fold Place Cards (2 cols x 2 rows, each 3.5 x 4.0 in flat -> folds to 3.5 x 2.0 in exact 7:4!)
      const cols = 2;
      const rows = 2;
      const perPage = cols * rows;
      const itemW = 3.5;
      const halfH = 2.0;
      const itemH = halfH * 2;
      const gapX = 0.45;
      const gapY = 0.5;
      const totalGridW = cols * itemW + (cols - 1) * gapX;
      const totalGridH = rows * itemH + (rows - 1) * gapY;
      const startX = (dim.widthIn - totalGridW) / 2;
      const startY = (dim.heightIn - totalGridH) / 2 + 0.14;

      const totalItems = names ? names.length : perPage;
      const totalPages = Math.ceil(totalItems / perPage);

      for (let page = 0; page < totalPages; page++) {
        if (page > 0) doc.addPage([dim.widthIn, dim.heightIn], 'portrait');

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(95, 95, 95);
        doc.text(
          `Santa Studio · 4-Up Tent Place Cards (${dim.label}) · 3.5 × 2.0 in folded · Score dashed center line`,
          dim.widthIn / 2,
          0.4,
          { align: 'center' }
        );

        for (let slotIdx = 0; slotIdx < perPage; slotIdx++) {
          const itemIdx = page * perPage + slotIdx;
          if (names && itemIdx >= names.length) break;

          const col = slotIdx % cols;
          const row = Math.floor(slotIdx / cols);
          const x = startX + col * (itemW + gapX);
          const y = startY + row * (itemH + gapY);

          const itemDraft: CardDraftState = names
            ? {
                ...draft,
                placeCard: { ...draft.placeCard, guestName: names[itemIdx] },
              }
            : draft;

          // Subtle guide label on white back flap
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(7);
          doc.setTextColor(170, 170, 170);
          doc.text(
            'Back Tent Flap · Fold Along Center Dashed Line',
            x + itemW / 2,
            y + halfH / 2,
            { align: 'center' }
          );

          // Front 7:4 face on bottom half
          const imgData = await renderCardToJpegDataUrl(
            itemDraft,
            1400,
            800,
            { renderMode: 'print-cut' }
          );
          doc.addImage(
            imgData,
            'JPEG',
            x,
            y + halfH,
            itemW,
            halfH,
            undefined,
            'FAST'
          );

          // Fold guide + outer trim rectangle
          drawDashedLine(doc, x, y + halfH, x + itemW, y + halfH);
          drawDashedRect(doc, x, y, itemW, itemH);

          if (options.includeCropMarks) {
            drawCropMarks(doc, x, y, itemW, itemH, 0.1, 0.03);
          }
        }
      }
    }

    const pdfBlob = doc.output('blob');
    const filename = buildCardDownloadFilename(
      draft.category,
      `printable-sheet-${options.format}`,
      'pdf'
    );
    triggerBlobDownload(pdfBlob, filename);
    return filename;
  }

  // Single Card Export (respects portrait vs landscape orientation & exact aspect ratio)
  const isLandscape = dims.width > dims.height;
  const pageW = isLandscape ? dim.heightIn : dim.widthIn;
  const pageH = isLandscape ? dim.widthIn : dim.heightIn;

  const doc = new jsPDF({
    orientation: isLandscape ? 'landscape' : 'portrait',
    unit: 'in',
    format: [pageW, pageH],
    compress: true,
  });

  const imgData = await renderCardToJpegDataUrl(
    draft,
    Math.round(dims.width * 1.5),
    Math.round(dims.height * 1.5),
    { renderMode: draft.category === 'gift-tag' ? 'print-cut' : 'studio' }
  );

  let margin = 0.25;
  if (options.format === 'letter' || options.format === 'a4') {
    margin = 0.75;
  } else if (options.format === '4x6') {
    margin = 0.18;
  }

  const maxW = pageW - margin * 2;
  const maxH = pageH - margin * 2;
  let drawW = maxW;
  let drawH = drawW / cardAspect;

  if (drawH > maxH) {
    drawH = maxH;
    drawW = drawH * cardAspect;
  }

  // Natural physical sizing when printing single items on Letter / A4
  if (options.format === 'letter' || options.format === 'a4') {
    let targetW = drawW;
    if (draft.category === 'wishes') targetW = 4.4;
    else if (draft.category === 'menu' || draft.category === 'invitation')
      targetW = 5.0;
    else if (draft.category === 'place-card') targetW = 5.25;
    else if (draft.category === 'gift-tag') targetW = 2.5;
    else if (draft.category === 'thank-you')
      targetW = isLandscape ? 7.0 : 5.0;

    if (targetW <= maxW && targetW / cardAspect <= maxH) {
      drawW = targetW;
      drawH = targetW / cardAspect;
    }
  }

  const x = (pageW - drawW) / 2;
  const y = (pageH - drawH) / 2;

  doc.addImage(imgData, 'JPEG', x, y, drawW, drawH, undefined, 'FAST');

  if (options.includeCropMarks) {
    drawCropMarks(doc, x, y, drawW, drawH);
  }

  if (options.format === 'letter' || options.format === 'a4') {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text(
      `Santa Studio · ${dim.label}${isLandscape ? ' (Landscape)' : ''} · Print at 100% / Actual Size`,
      pageW / 2,
      pageH - 0.35,
      { align: 'center' }
    );
  }

  const personName =
    draft.category === 'invitation'
      ? draft.invitation.guestName || draft.invitation.eventTitle
      : draft.category === 'wishes'
        ? draft.wishes.recipientName || draft.wishes.greetingHeadline
        : draft.category === 'menu'
          ? draft.menu.menuTitle
          : draft.category === 'place-card'
            ? draft.placeCard.guestName
            : draft.category === 'gift-tag'
              ? draft.giftTag.toName || draft.giftTag.headline
              : draft.thankYou.recipientName || draft.thankYou.headline;

  const filename = buildCardDownloadFilename(
    draft.category,
    `${personName}-${options.format}`,
    'pdf'
  );
  const pdfBlob = doc.output('blob');
  triggerBlobDownload(pdfBlob, filename);
  return filename;
}
