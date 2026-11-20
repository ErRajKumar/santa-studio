import {
  CardDraftState,
  FontChoice,
  TemplateConfig,
} from '../types/card';
import {
  BackdropPlacement,
  TEMPLATE_BACKDROPS,
} from '../templates/backdropAssets';
import { getTemplateById } from '../templates/templatesData';
import {
  drawFourPointStar,
  drawPhotoInSlot,
  drawPhotoPlaceholderInSlot,
} from './illustrations';
import {
  renderGiftTagSheetPreview,
  renderGiftTagTemplate,
  renderMenuTemplate,
  renderPlaceCardTableScene,
  renderPlaceCardTemplate,
  renderThankYouTemplate,
  StationeryStyleContext,
} from './stationeryArt';

const CANONICAL_W = 1200;
const CANONICAL_H = 1500;

export interface RenderCardOptions {
  renderMode?: 'studio' | 'print-cut';
  showPhotoPlaceholder?: boolean;
}

export function getTemplateDimensions(template: TemplateConfig): {
  width: number;
  height: number;
} {
  return {
    width: template.canvasWidth || CANONICAL_W,
    height: template.canvasHeight || CANONICAL_H,
  };
}

export function resolveFontFamily(choice: Exclude<FontChoice, 'auto'>): string {
  switch (choice) {
    case 'playfair':
      return '"Playfair Display", Georgia, serif';
    case 'cormorant':
      return '"Cormorant Garamond", Georgia, serif';
    case 'great-vibes':
      return '"Great Vibes", cursive';
    case 'oswald':
      return '"Oswald", sans-serif';
    case 'dm-sans':
    default:
      return '"DM Sans", system-ui, sans-serif';
  }
}

let fontsPromise: Promise<void> | null = null;
export function ensureCanvasFontsReady(): Promise<void> {
  if (typeof document === 'undefined' || !('fonts' in document)) {
    return Promise.resolve();
  }
  if (!fontsPromise) {
    fontsPromise = Promise.all([
      document.fonts.load('400 48px "Playfair Display"').catch(() => {}),
      document.fonts.load('600 48px "Playfair Display"').catch(() => {}),
      document.fonts.load('700 48px "Playfair Display"').catch(() => {}),
      document.fonts.load('italic 400 48px "Playfair Display"').catch(() => {}),
      document.fonts.load('400 48px "Cormorant Garamond"').catch(() => {}),
      document.fonts.load('700 48px "Cormorant Garamond"').catch(() => {}),
      document.fonts.load('400 32px "DM Sans"').catch(() => {}),
      document.fonts.load('600 32px "DM Sans"').catch(() => {}),
      document.fonts.load('700 32px "DM Sans"').catch(() => {}),
      document.fonts.load('400 72px "Great Vibes"').catch(() => {}),
      document.fonts.load('500 54px "Oswald"').catch(() => {}),
      document.fonts.load('700 54px "Oswald"').catch(() => {}),
    ]).then(() => document.fonts.ready.then(() => undefined));
  }
  return fontsPromise;
}

const imageCache = new Map<string, HTMLImageElement>();

export function loadImageElement(src: string): Promise<HTMLImageElement | null> {
  if (!src) return Promise.resolve(null);
  const cached = imageCache.get(src);
  if (cached && cached.complete && cached.naturalWidth > 0) {
    return Promise.resolve(cached);
  }
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      if (imageCache.size > 40) {
        const firstKey = imageCache.keys().next().value;
        if (firstKey) imageCache.delete(firstKey);
      }
      imageCache.set(src, img);
      resolve(img);
    };
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

function wrapLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxLines = 8
): string[] {
  const clean = text.trim();
  if (!clean) return [];
  const paragraphs = clean.split(/\r?\n/);
  const lines: string[] = [];

  for (const para of paragraphs) {
    const words = para.trim().split(/\s+/).filter(Boolean);
    if (words.length === 0) continue;
    let current = '';

    for (const word of words) {
      const test = current ? `${current} ${word}` : word;
      if (ctx.measureText(test).width <= maxWidth) {
        current = test;
      } else {
        if (current) {
          lines.push(current);
          current = word;
        } else {
          let chunk = '';
          for (const ch of word) {
            if (ctx.measureText(chunk + ch).width > maxWidth && chunk) {
              lines.push(chunk);
              chunk = ch;
            } else {
              chunk += ch;
            }
          }
          current = chunk;
        }
      }
      if (lines.length >= maxLines) break;
    }
    if (current && lines.length < maxLines) {
      lines.push(current);
    }
    if (lines.length >= maxLines) break;
  }

  return lines.slice(0, maxLines);
}

interface TextBlockOptions {
  text: string;
  x: number;
  y: number;
  maxWidth: number;
  font: string;
  color: string;
  align?: CanvasTextAlign;
  lineHeight: number;
  maxLines?: number;
  letterSpacing?: string;
  metallicGold?: boolean;
  neonGlow?: boolean;
  shadowColor?: string;
}

function drawTextBlock(
  ctx: CanvasRenderingContext2D,
  opts: TextBlockOptions
): number {
  if (!opts.text || !opts.text.trim()) return 0;
  ctx.save();
  ctx.font = opts.font;
  ctx.textAlign = opts.align ?? 'center';
  ctx.textBaseline = 'top';
  if ('letterSpacing' in ctx && opts.letterSpacing) {
    (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing =
      opts.letterSpacing;
  }

  const lines = wrapLines(ctx, opts.text, opts.maxWidth, opts.maxLines ?? 6);
  const totalH = Math.max(opts.lineHeight, lines.length * opts.lineHeight);

  if (opts.metallicGold) {
    const grad = ctx.createLinearGradient(
      opts.x - opts.maxWidth * 0.45,
      opts.y,
      opts.x + opts.maxWidth * 0.45,
      opts.y + totalH
    );
    grad.addColorStop(0, '#FFF5CC');
    grad.addColorStop(0.28, '#E6C26E');
    grad.addColorStop(0.52, '#B68932');
    grad.addColorStop(0.75, '#F5DC96');
    grad.addColorStop(1, '#CCA047');
    ctx.fillStyle = grad;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.58)';
    ctx.shadowBlur = 12;
    ctx.shadowOffsetY = 4;
  } else if (opts.neonGlow) {
    const grad = ctx.createLinearGradient(0, opts.y, 0, opts.y + totalH);
    grad.addColorStop(0, '#FFD4EF');
    grad.addColorStop(0.45, '#FF47AD');
    grad.addColorStop(1, '#FF1E8A');
    ctx.fillStyle = grad;
    ctx.shadowColor = '#FF2E93';
    ctx.shadowBlur = 28;
  } else {
    ctx.fillStyle = opts.color;
    if (opts.shadowColor) {
      ctx.shadowColor = opts.shadowColor;
      ctx.shadowBlur = 10;
      ctx.shadowOffsetY = 2;
    }
  }

  lines.forEach((line, idx) => {
    ctx.fillText(line, opts.x, opts.y + idx * opts.lineHeight);
  });
  ctx.restore();
  return lines.length * opts.lineHeight;
}

function fitFontSize(
  ctx: CanvasRenderingContext2D,
  text: string,
  fontWeight: string,
  fontFamily: string,
  startSize: number,
  minSize: number,
  maxWidth: number
): number {
  let size = startSize;
  while (size > minSize) {
    ctx.font = `${fontWeight} ${size}px ${fontFamily}`;
    if (ctx.measureText(text).width <= maxWidth) break;
    size -= 2;
  }
  return size;
}

function drawBackdropImage(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement | null,
  placement: BackdropPlacement,
  fallbackBg: string,
  customBgColor: string
): void {
  if (!img) {
    ctx.fillStyle = fallbackBg;
    ctx.fillRect(0, 0, CANONICAL_W, CANONICAL_H);
    return;
  }

  const imgRatio = img.naturalWidth / img.naturalHeight;
  const targetRatio = CANONICAL_W / CANONICAL_H;

  let drawW = CANONICAL_W;
  let drawH = CANONICAL_H;
  if (imgRatio > targetRatio) {
    drawH = CANONICAL_H;
    drawW = CANONICAL_H * imgRatio;
  } else {
    drawW = CANONICAL_W;
    drawH = CANONICAL_W / imgRatio;
  }

  drawW *= placement.cropScale;
  drawH *= placement.cropScale;

  const dx = (CANONICAL_W - drawW) / 2;
  const dy = (CANONICAL_H - drawH) / 2;
  ctx.drawImage(img, dx, dy, drawW, drawH);

  // Apply tasteful color tint if user explicitly chose a custom background swatch
  if (customBgColor) {
    ctx.save();
    ctx.globalCompositeOperation = 'color';
    ctx.globalAlpha = 0.55;
    ctx.fillStyle = customBgColor;
    ctx.fillRect(0, 0, CANONICAL_W, CANONICAL_H);
    ctx.restore();
  }

  // Optional soft radial contrast scrim behind text zone for crisp readability
  if (placement.centerScrimColor) {
    ctx.save();
    const cy = (placement.textTopY + placement.textBottomY) / 2;
    const grad = ctx.createRadialGradient(
      CANONICAL_W / 2,
      cy,
      120,
      CANONICAL_W / 2,
      cy,
      580
    );
    grad.addColorStop(0, placement.centerScrimColor);
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, CANONICAL_W, CANONICAL_H);
    ctx.restore();
  }
}

function drawOrnamentalRule(
  ctx: CanvasRenderingContext2D,
  cx: number,
  y: number,
  halfSpan: number,
  color: string
): void {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.globalAlpha = 0.65;
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.moveTo(cx - halfSpan, y);
  ctx.lineTo(cx - 20, y);
  ctx.moveTo(cx + 20, y);
  ctx.lineTo(cx + halfSpan, y);
  ctx.stroke();
  drawFourPointStar(ctx, cx, y, 10, 3.5, color, 0.9);
  ctx.restore();
}

function drawVintageBarcode(
  ctx: CanvasRenderingContext2D,
  cx: number,
  y: number,
  color: string
): void {
  ctx.save();
  ctx.fillStyle = color;
  const pattern = [
    4, 2, 7, 3, 2, 6, 4, 2, 3, 8, 2, 4, 3, 6, 2, 5, 3, 2, 7, 3, 4, 2, 6, 3, 5,
    2, 7, 3, 4,
  ];
  const totalUnits = pattern.reduce((a, b) => a + b, 0);
  const unitW = 4.2;
  let curX = cx - (totalUnits * unitW) / 2;
  pattern.forEach((units, idx) => {
    const barW = units * unitW;
    if (idx % 2 === 0) {
      ctx.fillRect(curX, y, barW, 64);
    }
    curX += barW;
  });
  ctx.restore();
}

const DARK_TEMPLATE_IDS = new Set([
  'invitation-01',
  'invitation-02',
  'invitation-04',
  'invitation-06',
  'invitation-08',
  'wishes-01',
  'wishes-03',
  'wishes-04',
  'wishes-07',
  'wishes-09',
  'menu-01',
  'menu-04',
  'place-01',
  'place-03',
  'place-04',
  'place-07',
  'tag-01',
  'tag-05',
  'tag-06',
  'thankyou-01',
  'thankyou-05',
]);

export function buildStyleContext(
  template: TemplateConfig,
  draft: CardDraftState,
  options?: RenderCardOptions
): StationeryStyleContext {
  const hasCustomColor = Boolean(draft.design.textColor);
  const primaryTextColor =
    draft.design.textColor || template.palette.primaryText;
  const secondaryTextColor =
    draft.design.textColor || template.palette.secondaryText;
  const mutedTextColor = draft.design.textColor || template.palette.mutedText;

  const headingFamily = resolveFontFamily(
    draft.design.fontFamily === 'auto'
      ? template.headingFont
      : draft.design.fontFamily
  );
  const bodyFamily = resolveFontFamily(
    draft.design.fontFamily === 'auto'
      ? template.bodyFont
      : draft.design.fontFamily === 'great-vibes'
        ? template.bodyFont
        : draft.design.fontFamily
  );
  const accentFamily = resolveFontFamily(
    draft.design.fontFamily === 'auto'
      ? template.accentFont
      : draft.design.fontFamily
  );

  const align: CanvasTextAlign =
    template.supportsCustomAlignment && draft.design.textAlign !== 'auto'
      ? draft.design.textAlign
      : template.defaultAlign;

  const customBgColor = template.supportsCustomBackground
    ? draft.design.backgroundColor
    : '';

  const textShadow = DARK_TEMPLATE_IDS.has(template.id)
    ? 'rgba(0, 0, 0, 0.55)'
    : undefined;

  return {
    primaryTextColor,
    secondaryTextColor,
    mutedTextColor,
    headingFamily,
    bodyFamily,
    accentFamily,
    align,
    hasCustomColor,
    customBgColor,
    textShadow,
    renderMode: options?.renderMode ?? 'studio',
    showPhotoPlaceholder: options?.showPhotoPlaceholder ?? true,
    isDarkBackdrop: DARK_TEMPLATE_IDS.has(template.id),
  };
}

export async function renderCardToCanvas(
  canvas: HTMLCanvasElement,
  draft: CardDraftState,
  targetWidth?: number,
  targetHeight?: number,
  options?: RenderCardOptions
): Promise<void> {
  await ensureCanvasFontsReady();

  const template = getTemplateById(draft.templateId);
  const dims = getTemplateDimensions(template);
  const outW = targetWidth ?? dims.width;
  const outH =
    targetHeight ?? Math.round(outW * (dims.height / dims.width));

  const isLegacyBackdrop =
    template.category === 'invitation' || template.category === 'wishes';
  const placement =
    TEMPLATE_BACKDROPS[template.id] || TEMPLATE_BACKDROPS['invitation-01'];

  const [backdropImg, loadedPhoto] = await Promise.all([
    isLegacyBackdrop ? loadImageElement(placement.src) : Promise.resolve(null),
    draft.photo.dataUrl
      ? loadImageElement(draft.photo.dataUrl)
      : Promise.resolve(null),
  ]);

  canvas.width = outW;
  canvas.height = outH;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const scaleX = outW / dims.width;
  const scaleY = outH / dims.height;
  ctx.save();
  ctx.clearRect(0, 0, outW, outH);
  ctx.scale(scaleX, scaleY);

  const styleCtx = buildStyleContext(template, draft, options);

  if (template.category === 'menu') {
    renderMenuTemplate(ctx, template, draft, styleCtx);
  } else if (template.category === 'place-card') {
    renderPlaceCardTemplate(ctx, template, draft, styleCtx);
  } else if (template.category === 'gift-tag') {
    renderGiftTagTemplate(ctx, template, draft, styleCtx, dims);
  } else if (template.category === 'thank-you') {
    renderThankYouTemplate(ctx, template, draft, loadedPhoto, styleCtx, dims);
  } else {
    drawBackdropImage(
      ctx,
      backdropImg,
      placement,
      template.palette.background,
      styleCtx.customBgColor
    );

    if (template.category === 'invitation') {
      renderInvitationContent(ctx, template, placement, draft, loadedPhoto, styleCtx);
    } else {
      renderWishesContent(ctx, template, placement, draft, loadedPhoto, styleCtx);
    }
  }

  ctx.restore();
}

export async function renderPlaceCardMockupToCanvas(
  canvas: HTMLCanvasElement,
  draft: CardDraftState,
  targetW = 1200,
  targetH = 860
): Promise<void> {
  await ensureCanvasFontsReady();
  const template = getTemplateById(draft.templateId);
  const styleCtx = buildStyleContext(template, draft, { renderMode: 'studio' });
  await renderPlaceCardTableScene(canvas, template, draft, styleCtx, targetW, targetH);
}

export async function renderGiftTagSheetToCanvas(
  canvas: HTMLCanvasElement,
  draft: CardDraftState,
  targetW = 850,
  targetH = 1100
): Promise<void> {
  await ensureCanvasFontsReady();
  const template = getTemplateById(draft.templateId);
  const dims = getTemplateDimensions(template);
  const styleCtx = buildStyleContext(template, draft, { renderMode: 'print-cut' });
  renderGiftTagSheetPreview(canvas, template, draft, styleCtx, dims, targetW, targetH);
}

interface StyleContext {
  primaryTextColor: string;
  secondaryTextColor: string;
  mutedTextColor: string;
  headingFamily: string;
  bodyFamily: string;
  accentFamily: string;
  align: CanvasTextAlign;
  hasCustomColor: boolean;
  textShadow?: string;
  showPhotoPlaceholder?: boolean;
  isDarkBackdrop?: boolean;
}

function getAnchorX(
  align: CanvasTextAlign,
  maxWidth: number
): number {
  const margin = (CANONICAL_W - maxWidth) / 2;
  if (align === 'left') return margin;
  if (align === 'right') return CANONICAL_W - margin;
  return CANONICAL_W / 2;
}

function renderInvitationContent(
  ctx: CanvasRenderingContext2D,
  template: TemplateConfig,
  placement: BackdropPlacement,
  draft: CardDraftState,
  photoImg: HTMLImageElement | null,
  style: StyleContext
): void {
  const data = draft.invitation;

  // Special Ticket Layout (Invitation 10)
  if (template.id === 'invitation-10') {
    drawTextBlock(ctx, {
      text: 'ADMIT ONE',
      x: 600,
      y: 186,
      maxWidth: 520,
      font: `700 34px ${style.headingFamily}`,
      color: style.secondaryTextColor,
      align: 'center',
      lineHeight: 40,
      letterSpacing: '6px',
    });

    drawTextBlock(ctx, {
      text: "YOU'RE INVITED TO",
      x: 600,
      y: 252,
      maxWidth: 560,
      font: `600 22px ${style.bodyFamily}`,
      color: style.primaryTextColor,
      align: 'center',
      lineHeight: 28,
      letterSpacing: '4px',
    });

    const hasPhotoArea = Boolean(photoImg || style.showPhotoPlaceholder);
    let y = 515;
    if (photoImg) {
      const slot = { ...template.photoSlot, y: y + 90 };
      drawPhotoInSlot(ctx, photoImg, slot, draft.photo);
      y += 205;
    } else if (style.showPhotoPlaceholder) {
      const slot = {
        ...template.photoSlot,
        height: Math.min(template.photoSlot.height, 175),
        y: y + 86,
      };
      drawPhotoPlaceholderInSlot(ctx, slot, false);
      y += 196;
    }

    const titleText = (
      data.eventTitle.trim() ||
      template.defaultEventTitle ||
      'CHRISTMAS NIGHT'
    ).toUpperCase();
    const titleSize = fitFontSize(
      ctx,
      titleText,
      '700',
      style.headingFamily,
      hasPhotoArea ? 64 : 84,
      38,
      680
    );
    y +=
      drawTextBlock(ctx, {
        text: titleText,
        x: 600,
        y,
        maxWidth: 680,
        font: `700 ${titleSize}px ${style.headingFamily}`,
        color: style.secondaryTextColor,
        align: 'center',
        lineHeight: titleSize * 1.08,
        maxLines: 2,
      }) + 12;

    if (data.eventSubtitle.trim()) {
      y +=
        drawTextBlock(ctx, {
          text: data.eventSubtitle.toUpperCase(),
          x: 600,
          y,
          maxWidth: 660,
          font: `600 20px ${style.bodyFamily}`,
          color: style.primaryTextColor,
          align: 'center',
          lineHeight: 28,
          letterSpacing: '3px',
          maxLines: 1,
        }) + 16;
    }

    drawOrnamentalRule(ctx, 600, y, 250, template.palette.borderColor);
    y += 24;

    if (data.guestName.trim()) {
      y +=
        drawTextBlock(ctx, {
          text: `GUEST: ${data.guestName.trim().toUpperCase()}`,
          x: 600,
          y,
          maxWidth: 660,
          font: `700 24px ${style.bodyFamily}`,
          color: style.secondaryTextColor,
          align: 'center',
          lineHeight: 32,
          maxLines: 1,
        }) + 10;
    }

    const timeRange = [data.eventStartTime.trim(), data.eventEndTime.trim()]
      .filter(Boolean)
      .join(' – ');
    const dtLine = [data.eventDate.trim(), timeRange].filter(Boolean).join('  ·  ');
    if (dtLine) {
      y +=
        drawTextBlock(ctx, {
          text: dtLine,
          x: 600,
          y,
          maxWidth: 660,
          font: `700 26px ${style.bodyFamily}`,
          color: style.primaryTextColor,
          align: 'center',
          lineHeight: 34,
          maxLines: 2,
        }) + 10;
    }

    if (data.venueName.trim()) {
      y +=
        drawTextBlock(ctx, {
          text: data.venueName.trim().toUpperCase(),
          x: 600,
          y,
          maxWidth: 660,
          font: `700 24px ${style.bodyFamily}`,
          color: style.primaryTextColor,
          align: 'center',
          lineHeight: 32,
          maxLines: 1,
        }) + 4;
    }

    if (data.fullAddress.trim()) {
      y +=
        drawTextBlock(ctx, {
          text: data.fullAddress.trim(),
          x: 600,
          y,
          maxWidth: 660,
          font: `400 21px ${style.bodyFamily}`,
          color: style.mutedTextColor,
          align: 'center',
          lineHeight: 28,
          maxLines: 2,
        }) + 12;
    }

    if (data.personalMessage.trim() && !hasPhotoArea) {
      y +=
        drawTextBlock(ctx, {
          text: data.personalMessage,
          x: 600,
          y,
          maxWidth: 620,
          font: `italic 400 22px ${style.accentFamily}`,
          color: style.mutedTextColor,
          align: 'center',
          lineHeight: 30,
          maxLines: 2,
        }) + 14;
    }

    const rsvpLine = [
      data.rsvpContact.trim() ? `RSVP: ${data.rsvpContact.trim()}` : '',
      data.rsvpDeadline.trim() ? `by ${data.rsvpDeadline.trim()}` : '',
    ]
      .filter(Boolean)
      .join(' ');
    if (rsvpLine && y < 1125) {
      drawTextBlock(ctx, {
        text: rsvpLine,
        x: 600,
        y,
        maxWidth: 660,
        font: `600 20px ${style.bodyFamily}`,
        color: style.secondaryTextColor,
        align: 'center',
        lineHeight: 28,
        maxLines: 2,
      });
    }

    drawVintageBarcode(ctx, 600, 1185, '#261714');
    drawTextBlock(ctx, {
      text: data.hostName.trim()
        ? `HOSTED BY ${data.hostName.trim().toUpperCase()}  ·  NO. 000728`
        : 'NO. 000728',
      x: 600,
      y: 1262,
      maxWidth: 640,
      font: `600 18px ${style.bodyFamily}`,
      color: style.mutedTextColor,
      align: 'center',
      lineHeight: 24,
      letterSpacing: '2px',
    });
    return;
  }

  // Rustic Kraft Gift Tag Stamp (Invitation 05)
  if (template.id === 'invitation-05') {
    ctx.save();
    ctx.translate(972, 412);
    ctx.rotate(0.28);
    ctx.fillStyle = '#4A2F1D';
    ctx.font = 'italic 600 34px "Playfair Display", Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('Eat', 0, -40);
    ctx.fillText('Drink', 0, 0);
    ctx.fillText('Be Merry', 0, 40);
    ctx.restore();
  }

  // Editorial Stacked Layout inside each template's safe vertical bounds
  const maxW = placement.maxTextWidth;
  const anchorX = getAnchorX(style.align, maxW);
  let y = placement.textTopY;
  const bottomLimit = placement.textBottomY;
  const availH = bottomLimit - placement.textTopY;
  const hasPhotoArea = Boolean(photoImg || style.showPhotoPlaceholder);

  // Optional Photo placement near top of safe text zone
  if (photoImg) {
    const slot = { ...template.photoSlot };
    slot.y = y + slot.height / 2;
    slot.x = 600;
    drawPhotoInSlot(ctx, photoImg, slot, draft.photo);
    y += slot.height + 24;
  } else if (style.showPhotoPlaceholder) {
    const maxSlotH = availH < 750 ? 164 : availH < 860 ? 182 : template.photoSlot.height;
    const scale = Math.min(1, maxSlotH / template.photoSlot.height);
    const slot = {
      ...template.photoSlot,
      width: Math.round(template.photoSlot.width * scale),
      height: Math.round(template.photoSlot.height * scale),
      x: 600,
      y: 0,
    };
    slot.y = y + slot.height / 2;
    drawPhotoPlaceholderInSlot(
      ctx,
      slot,
      Boolean(style.isDarkBackdrop),
      undefined,
      style.primaryTextColor
    );
    y += slot.height + (slot.shape === 'polaroid' ? 56 : 20);
  }

  // Kicker
  y +=
    drawTextBlock(ctx, {
      text: template.defaultHeadline.toUpperCase(),
      x: anchorX,
      y,
      maxWidth: maxW,
      font: `600 22px ${style.bodyFamily}`,
      color: style.secondaryTextColor,
      align: style.align,
      lineHeight: 28,
      letterSpacing: '4px',
      maxLines: 1,
      shadowColor: style.textShadow,
    }) + 12;

  // Main Event Title (flowing gold/neon script or bold display)
  const titleText = data.eventTitle.trim() || template.defaultEventTitle || '';
  if (titleText) {
    const isScript =
      draft.design.fontFamily === 'great-vibes' ||
      (draft.design.fontFamily === 'auto' &&
        template.headingFont === 'great-vibes');
    const baseSize = isScript
      ? hasPhotoArea
        ? 82
        : 102
      : hasPhotoArea
        ? 64
        : 78;
    const fittedSize = fitFontSize(
      ctx,
      titleText,
      isScript ? '400' : '700',
      style.headingFamily,
      baseSize,
      40,
      maxW
    );
    y +=
      drawTextBlock(ctx, {
        text: titleText,
        x: anchorX,
        y,
        maxWidth: maxW,
        font: `${isScript ? '400' : '700'} ${fittedSize}px ${style.headingFamily}`,
        color:
          template.id === 'invitation-03' || template.id === 'invitation-05'
            ? style.secondaryTextColor
            : style.primaryTextColor,
        align: style.align,
        lineHeight: fittedSize * 1.08,
        maxLines: 2,
        metallicGold: Boolean(placement.metallicGoldTitle && !style.hasCustomColor),
        neonGlow: Boolean(placement.neonGlowTitle && !style.hasCustomColor),
        shadowColor: style.textShadow,
      }) + 12;
  }

  // Event Subtitle
  if (data.eventSubtitle.trim()) {
    y +=
      drawTextBlock(ctx, {
        text: data.eventSubtitle.toUpperCase(),
        x: anchorX,
        y,
        maxWidth: maxW,
        font: `600 20px ${style.bodyFamily}`,
        color: style.mutedTextColor,
        align: style.align,
        lineHeight: 28,
        letterSpacing: '2.5px',
        maxLines: 2,
        shadowColor: style.textShadow,
      }) + 16;
  }

  drawOrnamentalRule(
    ctx,
    600,
    y,
    180,
    style.hasCustomColor ? style.primaryTextColor : template.palette.borderColor
  );
  y += 24;

  // Guest Salutation (omitted if blank)
  if (data.guestName.trim()) {
    y +=
      drawTextBlock(ctx, {
        text: `Dear ${data.guestName.trim()},`,
        x: anchorX,
        y,
        maxWidth: maxW,
        font: `600 26px ${style.bodyFamily}`,
        color: style.secondaryTextColor,
        align: style.align,
        lineHeight: 34,
        maxLines: 1,
        shadowColor: style.textShadow,
      }) + 8;
  }

  // Personal Message
  if (data.personalMessage.trim() && y < bottomLimit - 240) {
    y +=
      drawTextBlock(ctx, {
        text: data.personalMessage,
        x: anchorX,
        y,
        maxWidth: maxW - 40,
        font: `400 23px ${style.bodyFamily}`,
        color: style.mutedTextColor,
        align: style.align,
        lineHeight: 33,
        maxLines: hasPhotoArea ? 2 : 3,
        shadowColor: style.textShadow,
      }) + 20;
  }

  // Event Date & Time
  const timeRange = [data.eventStartTime.trim(), data.eventEndTime.trim()]
    .filter(Boolean)
    .join(' – ');
  if (data.eventDate.trim()) {
    y +=
      drawTextBlock(ctx, {
        text: data.eventDate.trim().toUpperCase(),
        x: anchorX,
        y,
        maxWidth: maxW,
        font: `700 28px ${style.bodyFamily}`,
        color: style.primaryTextColor,
        align: style.align,
        lineHeight: 36,
        letterSpacing: '2px',
        maxLines: 1,
        shadowColor: style.textShadow,
      }) + 4;
  }
  if (timeRange) {
    y +=
      drawTextBlock(ctx, {
        text: timeRange,
        x: anchorX,
        y,
        maxWidth: maxW,
        font: `600 24px ${style.bodyFamily}`,
        color: style.secondaryTextColor,
        align: style.align,
        lineHeight: 32,
        maxLines: 1,
        shadowColor: style.textShadow,
      }) + 16;
  }

  // Venue Name & Address
  if (data.venueName.trim() && y < bottomLimit - 95) {
    y +=
      drawTextBlock(ctx, {
        text: data.venueName.trim().toUpperCase(),
        x: anchorX,
        y,
        maxWidth: maxW,
        font: `700 25px ${style.bodyFamily}`,
        color: style.primaryTextColor,
        align: style.align,
        lineHeight: 33,
        letterSpacing: '1.5px',
        maxLines: 1,
        shadowColor: style.textShadow,
      }) + 4;
  }
  if (data.fullAddress.trim() && y < bottomLimit - 70) {
    y +=
      drawTextBlock(ctx, {
        text: data.fullAddress.trim(),
        x: anchorX,
        y,
        maxWidth: maxW - 30,
        font: `400 22px ${style.bodyFamily}`,
        color: style.mutedTextColor,
        align: style.align,
        lineHeight: 30,
        maxLines: 2,
        shadowColor: style.textShadow,
      }) + 16;
  }

  // Host & Dress Code
  const hostDress = [
    data.hostName.trim() ? `Hosted by ${data.hostName.trim()}` : '',
    data.dressCode.trim() ? data.dressCode.trim() : '',
  ]
    .filter(Boolean)
    .join('  ·  ');
  if (hostDress && y < bottomLimit - 45) {
    y +=
      drawTextBlock(ctx, {
        text: hostDress,
        x: anchorX,
        y,
        maxWidth: maxW,
        font: `500 21px ${style.bodyFamily}`,
        color: style.secondaryTextColor,
        align: style.align,
        lineHeight: 28,
        maxLines: 1,
        shadowColor: style.textShadow,
      }) + 10;
  }

  // RSVP & Additional Info
  const rsvpParts = [
    data.rsvpContact.trim() ? `RSVP to ${data.rsvpContact.trim()}` : '',
    data.rsvpDeadline.trim() ? `by ${data.rsvpDeadline.trim()}` : '',
  ].filter(Boolean);
  if (rsvpParts.length > 0 && y < bottomLimit - 24) {
    y +=
      drawTextBlock(ctx, {
        text: rsvpParts.join(' '),
        x: anchorX,
        y,
        maxWidth: maxW,
        font: `600 21px ${style.bodyFamily}`,
        color: style.primaryTextColor,
        align: style.align,
        lineHeight: 28,
        maxLines: 2,
        shadowColor: style.textShadow,
      }) + 6;
  }

  const extra = [data.additionalInfo.trim(), data.websiteLink.trim()]
    .filter(Boolean)
    .join('  ·  ');
  if (extra && y < bottomLimit) {
    drawTextBlock(ctx, {
      text: extra,
      x: anchorX,
      y,
      maxWidth: maxW - 30,
      font: `400 19px ${style.bodyFamily}`,
      color: style.mutedTextColor,
      align: style.align,
      lineHeight: 26,
      maxLines: 2,
      shadowColor: style.textShadow,
    });
  }
}

function renderWishesContent(
  ctx: CanvasRenderingContext2D,
  template: TemplateConfig,
  placement: BackdropPlacement,
  draft: CardDraftState,
  photoImg: HTMLImageElement | null,
  style: StyleContext
): void {
  const data = draft.wishes;

  // Special Bauhaus / Swiss Editorial layout (Wishes 10)
  if (template.id === 'wishes-10') {
    const headline = data.greetingHeadline.trim() || template.defaultHeadline;
    const headSize = fitFontSize(
      ctx,
      headline.toUpperCase(),
      '700',
      style.headingFamily,
      78,
      40,
      920
    );
    drawTextBlock(ctx, {
      text: headline.toUpperCase(),
      x: 130,
      y: 132,
      maxWidth: 940,
      font: `700 ${headSize}px ${style.headingFamily}`,
      color: '#F8F1E5',
      align: 'left',
      lineHeight: headSize * 1.05,
      maxLines: 2,
    });

    const hasPhoto = Boolean(photoImg || style.showPhotoPlaceholder);
    if (photoImg) {
      drawPhotoInSlot(ctx, photoImg, template.photoSlot, draft.photo);
    } else if (style.showPhotoPlaceholder) {
      drawPhotoPlaceholderInSlot(ctx, template.photoSlot, false);
    }

    const colW = hasPhoto ? 500 : 880;
    const xPos = hasPhoto ? 130 : getAnchorX(style.align, 880);
    const edAlign: CanvasTextAlign = hasPhoto ? 'left' : style.align;
    let y = 475;

    if (data.recipientName.trim()) {
      y +=
        drawTextBlock(ctx, {
          text: data.recipientName,
          x: xPos,
          y,
          maxWidth: colW,
          font: `700 28px ${style.bodyFamily}`,
          color: style.secondaryTextColor,
          align: edAlign,
          lineHeight: 36,
          maxLines: 2,
        }) + 18;
    }

    if (data.mainMessage.trim()) {
      y +=
        drawTextBlock(ctx, {
          text: data.mainMessage,
          x: xPos,
          y,
          maxWidth: colW,
          font: `400 28px ${style.bodyFamily}`,
          color: style.primaryTextColor,
          align: edAlign,
          lineHeight: 42,
          maxLines: 7,
        }) + 24;
    }

    if (data.additionalMessage.trim()) {
      y +=
        drawTextBlock(ctx, {
          text: data.additionalMessage,
          x: xPos,
          y,
          maxWidth: colW,
          font: `italic 400 25px ${style.accentFamily}`,
          color: style.mutedTextColor,
          align: edAlign,
          lineHeight: 34,
          maxLines: 3,
        }) + 26;
    }

    if (data.senderName.trim()) {
      y +=
        drawTextBlock(ctx, {
          text: data.senderName,
          x: xPos,
          y,
          maxWidth: colW,
          font: `700 30px ${style.accentFamily}`,
          color: style.primaryTextColor,
          align: edAlign,
          lineHeight: 38,
          maxLines: 2,
        }) + 8;
    }

    if (data.familyOrCompany.trim()) {
      drawTextBlock(ctx, {
        text: data.familyOrCompany.toUpperCase(),
        x: xPos,
        y,
        maxWidth: colW,
        font: `600 20px ${style.bodyFamily}`,
        color: style.secondaryTextColor,
        align: edAlign,
        lineHeight: 28,
        letterSpacing: '2px',
        maxLines: 1,
      });
    }
    return;
  }

  // Wishes 01 - 09 Editorial Composition
  const maxW = placement.maxTextWidth;
  const anchorX = getAnchorX(style.align, maxW);
  let y = placement.textTopY;
  const bottomLimit = placement.textBottomY;
  const availH = bottomLimit - placement.textTopY;
  const hasPhotoArea = Boolean(photoImg || style.showPhotoPlaceholder);

  // Wishes 07 (Christmas Family): Photo Frame centerpiece
  if (template.id === 'wishes-07') {
    if (photoImg) {
      const slot = { ...template.photoSlot, y: y + 165 };
      drawPhotoInSlot(
        ctx,
        photoImg,
        slot,
        draft.photo,
        data.photoCaption,
        '#3A1B1E'
      );
      y = slot.y + slot.height / 2 + 78;
    } else if (style.showPhotoPlaceholder) {
      const slot = { ...template.photoSlot, y: y + 165 };
      drawPhotoPlaceholderInSlot(
        ctx,
        slot,
        false,
        data.photoCaption,
        '#3A1B1E'
      );
      y = slot.y + slot.height / 2 + 78;
    }
  } else if (photoImg) {
    const slot = { ...template.photoSlot };
    slot.y = y + slot.height / 2;
    slot.x = 600;
    drawPhotoInSlot(
      ctx,
      photoImg,
      slot,
      draft.photo,
      data.photoCaption,
      style.primaryTextColor
    );
    y += slot.height + (slot.shape === 'polaroid' ? 62 : 24);
    if (slot.shape !== 'polaroid' && data.photoCaption.trim()) {
      y +=
        drawTextBlock(ctx, {
          text: data.photoCaption,
          x: 600,
          y: y - 10,
          maxWidth: maxW,
          font: `italic 400 22px ${style.accentFamily}`,
          color: style.mutedTextColor,
          align: 'center',
          lineHeight: 28,
          maxLines: 1,
          shadowColor: style.textShadow,
        }) + 12;
    }
  } else if (style.showPhotoPlaceholder) {
    const maxSlotH = availH < 750 ? 162 : availH < 840 ? 182 : template.photoSlot.height;
    const scale = Math.min(1, maxSlotH / template.photoSlot.height);
    const slot = {
      ...template.photoSlot,
      width: Math.round(template.photoSlot.width * scale),
      height: Math.round(template.photoSlot.height * scale),
      x: 600,
      y: 0,
    };
    slot.y = y + slot.height / 2;
    drawPhotoPlaceholderInSlot(
      ctx,
      slot,
      Boolean(style.isDarkBackdrop),
      data.photoCaption,
      style.primaryTextColor
    );
    y += slot.height + (slot.shape === 'polaroid' ? 60 : 20);
  }

  // Greeting Headline
  const headline = data.greetingHeadline.trim() || template.defaultHeadline;
  const isScript =
    draft.design.fontFamily === 'great-vibes' ||
    (draft.design.fontFamily === 'auto' &&
      template.headingFont === 'great-vibes');
  const baseSize = isScript
    ? hasPhotoArea
      ? 78
      : 98
    : hasPhotoArea
      ? 60
      : 74;
  const fittedSize = fitFontSize(
    ctx,
    headline,
    isScript ? '400' : '700',
    style.headingFamily,
    baseSize,
    38,
    maxW
  );

  y +=
    drawTextBlock(ctx, {
      text: headline,
      x: anchorX,
      y,
      maxWidth: maxW,
      font: `${isScript ? '400' : '700'} ${fittedSize}px ${style.headingFamily}`,
      color:
        template.id === 'wishes-02' || template.id === 'wishes-05'
          ? style.secondaryTextColor
          : style.primaryTextColor,
      align: style.align,
      lineHeight: fittedSize * 1.12,
      maxLines: 2,
      metallicGold: Boolean(placement.metallicGoldTitle && !style.hasCustomColor),
      shadowColor: style.textShadow,
    }) + 16;

  drawOrnamentalRule(
    ctx,
    600,
    y,
    165,
    style.hasCustomColor ? style.primaryTextColor : template.palette.borderColor
  );
  y += 24;

  // Recipient Name
  if (data.recipientName.trim() && y < bottomLimit - 140) {
    y +=
      drawTextBlock(ctx, {
        text: data.recipientName,
        x: anchorX,
        y,
        maxWidth: maxW,
        font: `600 28px ${style.bodyFamily}`,
        color: style.secondaryTextColor,
        align: style.align,
        lineHeight: 36,
        maxLines: 2,
        shadowColor: style.textShadow,
      }) + 14;
  }

  // Main Christmas Message
  if (data.mainMessage.trim() && y < bottomLimit - 95) {
    y +=
      drawTextBlock(ctx, {
        text: data.mainMessage,
        x: anchorX,
        y,
        maxWidth: maxW - 30,
        font: `400 25px ${style.bodyFamily}`,
        color: style.primaryTextColor,
        align: style.align,
        lineHeight: 38,
        maxLines: hasPhotoArea ? 4 : 5,
        shadowColor: style.textShadow,
      }) + 18;
  }

  // Additional Message (optional)
  if (data.additionalMessage.trim() && y < bottomLimit - 70) {
    y +=
      drawTextBlock(ctx, {
        text: data.additionalMessage,
        x: anchorX,
        y,
        maxWidth: maxW - 60,
        font: `italic 400 23px ${style.accentFamily}`,
        color: style.mutedTextColor,
        align: style.align,
        lineHeight: 32,
        maxLines: 2,
        shadowColor: style.textShadow,
      }) + 20;
  }

  // Sender Name
  if (data.senderName.trim() && y < bottomLimit - 24) {
    y +=
      drawTextBlock(ctx, {
        text: data.senderName,
        x: anchorX,
        y,
        maxWidth: maxW,
        font: `400 44px "Great Vibes", cursive`,
        color: style.secondaryTextColor,
        align: style.align,
        lineHeight: 50,
        maxLines: 1,
        metallicGold: Boolean(placement.metallicGoldTitle && !style.hasCustomColor),
        shadowColor: style.textShadow,
      }) + 6;
  }

  // Family or Company Name
  if (data.familyOrCompany.trim() && y < bottomLimit) {
    drawTextBlock(ctx, {
      text: data.familyOrCompany.toUpperCase(),
      x: anchorX,
      y,
      maxWidth: maxW,
      font: `600 20px ${style.bodyFamily}`,
      color: style.mutedTextColor,
      align: style.align,
      lineHeight: 28,
      letterSpacing: '2.5px',
      maxLines: 1,
      shadowColor: style.textShadow,
    });
  }
}

export async function renderCardToPngBlob(
  draft: CardDraftState,
  exportWidth?: number,
  exportHeight?: number,
  options?: RenderCardOptions
): Promise<Blob> {
  const template = getTemplateById(draft.templateId);
  const dims = getTemplateDimensions(template);
  const w = exportWidth ?? dims.width * 2;
  const h = exportHeight ?? dims.height * 2;

  const offscreen = document.createElement('canvas');
  await renderCardToCanvas(offscreen, draft, w, h, {
    ...options,
    showPhotoPlaceholder: options?.showPhotoPlaceholder ?? false,
  });

  return new Promise((resolve, reject) => {
    offscreen.toBlob(
      (blob) => {
        offscreen.width = 0;
        offscreen.height = 0;
        if (blob) resolve(blob);
        else reject(new Error('Failed to generate PNG image.'));
      },
      'image/png',
      1.0
    );
  });
}

export async function renderCardToJpegDataUrl(
  draft: CardDraftState,
  exportWidth?: number,
  exportHeight?: number,
  options?: RenderCardOptions
): Promise<string> {
  const template = getTemplateById(draft.templateId);
  const dims = getTemplateDimensions(template);
  const w = exportWidth ?? Math.round(dims.width * 1.5);
  const h = exportHeight ?? Math.round(dims.height * 1.5);

  const offscreen = document.createElement('canvas');
  await renderCardToCanvas(offscreen, draft, w, h, {
    ...options,
    showPhotoPlaceholder: options?.showPhotoPlaceholder ?? false,
  });
  const dataUrl = offscreen.toDataURL('image/jpeg', 0.96);
  offscreen.width = 0;
  offscreen.height = 0;
  return dataUrl;
}
