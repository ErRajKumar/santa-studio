import {
  CardDraftState,
  GiftTagShape,
  TemplateConfig,
} from '../types/card';
import {
  drawCandyCaneBorder,
  drawCozyCabinScene,
  drawCrescentMoon,
  drawFourPointStar,
  drawKraftPaperTexture,
  drawLayeredWreath,
  drawOrnamentBall,
  drawPhotoInSlot,
  drawPhotoPlaceholderInSlot,
  drawPineBranch,
  drawRibbonBow,
  drawSnowflake,
  drawStylizedPineTree,
} from './illustrations';

export interface StationeryStyleContext {
  primaryTextColor: string;
  secondaryTextColor: string;
  mutedTextColor: string;
  headingFamily: string;
  bodyFamily: string;
  accentFamily: string;
  align: CanvasTextAlign;
  hasCustomColor: boolean;
  customBgColor: string;
  textShadow?: string;
  renderMode?: 'studio' | 'print-cut';
  showPhotoPlaceholder?: boolean;
  isDarkBackdrop?: boolean;
}

/* -------------------------------------------------------------------------- */
/* Shared Typography Helpers                                                  */
/* -------------------------------------------------------------------------- */

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

interface BlockOpts {
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
  shadowColor?: string;
}

function drawBlock(ctx: CanvasRenderingContext2D, opts: BlockOpts): number {
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
      opts.x - opts.maxWidth * 0.4,
      opts.y,
      opts.x + opts.maxWidth * 0.4,
      opts.y + totalH
    );
    grad.addColorStop(0, '#FFF5CC');
    grad.addColorStop(0.3, '#E8C470');
    grad.addColorStop(0.55, '#B78930');
    grad.addColorStop(0.8, '#F6DD98');
    grad.addColorStop(1, '#CCA047');
    ctx.fillStyle = grad;
    ctx.shadowColor = 'rgba(0,0,0,0.45)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 3;
  } else {
    ctx.fillStyle = opts.color;
    if (opts.shadowColor) {
      ctx.shadowColor = opts.shadowColor;
      ctx.shadowBlur = 8;
      ctx.shadowOffsetY = 2;
    }
  }

  lines.forEach((line, idx) => {
    ctx.fillText(line, opts.x, opts.y + idx * opts.lineHeight);
  });
  ctx.restore();
  return lines.length * opts.lineHeight;
}

function fitSize(
  ctx: CanvasRenderingContext2D,
  text: string,
  weight: string,
  family: string,
  startSize: number,
  minSize: number,
  maxWidth: number
): number {
  let s = startSize;
  while (s > minSize) {
    ctx.font = `${weight} ${s}px ${family}`;
    if (ctx.measureText(text).width <= maxWidth) break;
    s -= 2;
  }
  return s;
}

function drawDividerRule(
  ctx: CanvasRenderingContext2D,
  cx: number,
  y: number,
  halfW: number,
  color: string
): void {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.globalAlpha = 0.65;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx - halfW, y);
  ctx.lineTo(cx - 18, y);
  ctx.moveTo(cx + 18, y);
  ctx.lineTo(cx + halfW, y);
  ctx.stroke();
  drawFourPointStar(ctx, cx, y, 9, 3, color, 0.9);
  ctx.restore();
}

function drawGoldStag(
  ctx: CanvasRenderingContext2D,
  cx: number,
  baseY: number,
  scale: number,
  color: string
): void {
  ctx.save();
  ctx.translate(cx, baseY);
  ctx.scale(scale, scale);
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // Body
  ctx.beginPath();
  ctx.ellipse(0, -48, 34, 18, -0.1, 0, Math.PI * 2);
  ctx.fill();

  // Neck & chest
  ctx.beginPath();
  ctx.moveTo(18, -56);
  ctx.lineTo(36, -98);
  ctx.lineTo(44, -95);
  ctx.lineTo(30, -44);
  ctx.closePath();
  ctx.fill();

  // Head & snout
  ctx.beginPath();
  ctx.ellipse(44, -100, 14, 7.5, 0.2, 0, Math.PI * 2);
  ctx.fill();

  // Tail
  ctx.beginPath();
  ctx.ellipse(-34, -56, 7, 4, -0.6, 0, Math.PI * 2);
  ctx.fill();

  // Legs
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(-22, -38);
  ctx.lineTo(-28, 0);
  ctx.moveTo(-12, -38);
  ctx.lineTo(-10, 0);
  ctx.moveTo(16, -38);
  ctx.lineTo(14, 0);
  ctx.moveTo(26, -42);
  ctx.lineTo(34, 0);
  ctx.stroke();

  // Antlers
  ctx.lineWidth = 3.2;
  ctx.beginPath();
  ctx.moveTo(36, -106);
  ctx.quadraticCurveTo(22, -138, 8, -150);
  ctx.moveTo(24, -124);
  ctx.lineTo(34, -142);
  ctx.moveTo(18, -136);
  ctx.lineTo(4, -138);
  ctx.moveTo(41, -106);
  ctx.quadraticCurveTo(54, -136, 62, -148);
  ctx.moveTo(48, -124);
  ctx.lineTo(38, -142);
  ctx.stroke();

  ctx.restore();
}

function drawGoldFiligreeCorner(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  flipX: number,
  flipY: number,
  color: string,
  size = 135
): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(flipX, flipY);
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 2.4;

  // Outer L frame
  ctx.beginPath();
  ctx.moveTo(0, size);
  ctx.lineTo(0, 0);
  ctx.lineTo(size, 0);
  ctx.stroke();

  // Inner scroll curl
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.moveTo(14, size * 0.72);
  ctx.bezierCurveTo(14, 24, 24, 14, size * 0.72, 14);
  ctx.stroke();

  // Leaf accents along curve
  const leaves = [
    { px: 22, py: 22, a: -0.75 },
    { px: 46, py: 14, a: -0.25 },
    { px: 14, py: 46, a: -1.3 },
    { px: 74, py: 14, a: -0.15 },
    { px: 14, py: 74, a: -1.45 },
  ];
  for (const lf of leaves) {
    ctx.save();
    ctx.translate(lf.px, lf.py);
    ctx.rotate(lf.a);
    ctx.beginPath();
    ctx.ellipse(0, 0, 11, 4.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  ctx.restore();
}

function drawMiniCottage(
  ctx: CanvasRenderingContext2D,
  cx: number,
  baseY: number,
  scale: number
): void {
  ctx.save();
  ctx.translate(cx, baseY);
  ctx.scale(scale, scale);

  // Snowy mound
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.ellipse(0, 0, 120, 26, 0, Math.PI, 0);
  ctx.fill();

  // Walls
  ctx.fillStyle = '#F7EFE2';
  ctx.fillRect(-52, -52, 104, 52);

  // Roof
  ctx.fillStyle = '#A91E2C';
  ctx.beginPath();
  ctx.moveTo(-66, -48);
  ctx.lineTo(0, -96);
  ctx.lineTo(66, -48);
  ctx.closePath();
  ctx.fill();

  // Snow trim on roof
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(-66, -48);
  ctx.lineTo(0, -96);
  ctx.lineTo(66, -48);
  ctx.stroke();

  // Windows & door
  ctx.fillStyle = '#F9C75E';
  ctx.fillRect(-36, -36, 20, 20);
  ctx.fillRect(16, -36, 20, 20);
  ctx.fillStyle = '#6A231E';
  ctx.fillRect(-10, -34, 20, 34);
  ctx.restore();
}

function drawPineconeCluster(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  angle: number
): void {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(angle);
  ctx.fillStyle = '#5C3A22';
  ctx.beginPath();
  ctx.ellipse(0, 0, 22, 34, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#8F6240';
  ctx.lineWidth = 2.2;
  for (let row = -20; row <= 20; row += 10) {
    ctx.beginPath();
    ctx.arc(0, row, 16 - Math.abs(row) * 0.3, 0.2, Math.PI - 0.2);
    ctx.stroke();
  }
  ctx.restore();
}

function drawBotanicalFern(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  len: number,
  angle: number,
  color: string
): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 2.4;

  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(len * 0.5, -24, len, -8);
  ctx.stroke();

  const count = 11;
  for (let i = 1; i < count; i++) {
    const t = i / count;
    const bx = t * len;
    const by = Math.sin(t * Math.PI) * -14;
    const leafLen = 26 * (1 - t * 0.45);
    ctx.save();
    ctx.translate(bx, by);
    ctx.rotate(-0.6);
    ctx.beginPath();
    ctx.ellipse(leafLen * 0.5, 0, leafLen * 0.5, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.translate(bx, by);
    ctx.rotate(0.65);
    ctx.beginPath();
    ctx.ellipse(leafLen * 0.45, 0, leafLen * 0.45, 4.8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  ctx.restore();
}

/* -------------------------------------------------------------------------- */
/* 1. CHRISTMAS MENUS (5 Distinct Designs · 1200 x 1680 Portrait 5:7)         */
/* -------------------------------------------------------------------------- */

export function renderMenuTemplate(
  ctx: CanvasRenderingContext2D,
  template: TemplateConfig,
  draft: CardDraftState,
  style: StationeryStyleContext
): void {
  const W = 1200;
  const H = 1680;
  const bg = style.customBgColor || template.palette.background;
  const format = template.stationeryFormat || 'menu-emerald';

  // Background Base + Distinct Artwork per Menu Style
  if (format === 'menu-emerald') {
    const grad = ctx.createRadialGradient(W / 2, H * 0.42, 100, W / 2, H * 0.5, 980);
    grad.addColorStop(0, style.customBgColor || '#134430');
    grad.addColorStop(1, style.customBgColor || '#082217');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Subtle sparkle specks
    for (let i = 0; i < 45; i++) {
      const sx = (i * 211 + 80) % W;
      const sy = (i * 337 + 60) % H;
      drawFourPointStar(ctx, sx, sy, 5, 1.8, '#E5C375', 0.32);
    }

    // Pine & berry corners top-left & top-right
    drawPineBranch(ctx, 20, 40, 290, 0.28, '#236647', '#C22735');
    drawPineBranch(ctx, 40, 120, 230, 0.65, '#194F36', '#E5C375');
    drawPineBranch(ctx, W - 20, 40, 290, Math.PI - 0.28, '#236647', '#C22735');
    drawPineBranch(ctx, W - 40, 120, 230, Math.PI - 0.65, '#194F36', '#E5C375');

    // Gold decorative border frame + corner filigree
    ctx.strokeStyle = '#D8B56D';
    ctx.lineWidth = 3;
    ctx.strokeRect(56, 56, W - 112, H - 112);
    ctx.lineWidth = 1.4;
    ctx.strokeRect(72, 72, W - 144, H - 144);

    drawGoldFiligreeCorner(ctx, 80, 80, 1, 1, '#E5C375', 140);
    drawGoldFiligreeCorner(ctx, W - 80, 80, -1, 1, '#E5C375', 140);
    drawGoldFiligreeCorner(ctx, 80, H - 80, 1, -1, '#E5C375', 140);
    drawGoldFiligreeCorner(ctx, W - 80, H - 80, -1, -1, '#E5C375', 140);

    // Bottom pine forest & golden stag centerpiece
    drawStylizedPineTree(ctx, 210, H - 78, 120, 175, '#1B5139');
    drawStylizedPineTree(ctx, 300, H - 78, 90, 130, '#14412D');
    drawStylizedPineTree(ctx, W - 210, H - 78, 120, 175, '#1B5139');
    drawStylizedPineTree(ctx, W - 300, H - 78, 90, 130, '#14412D');
    drawGoldStag(ctx, W / 2, H - 86, 1.05, '#E5C375');
  } else if (format === 'menu-classic') {
    drawKraftPaperTexture(ctx, W, H, bg);
    ctx.fillStyle = 'rgba(255, 250, 242, 0.55)';
    ctx.fillRect(0, 0, W, H);

    // Classic crimson double border
    ctx.strokeStyle = '#A91E2C';
    ctx.lineWidth = 5;
    ctx.strokeRect(54, 54, W - 108, H - 108);
    ctx.lineWidth = 1.6;
    ctx.strokeRect(68, 68, W - 136, H - 136);

    // Pine garlands left/right of bow + top crimson bow
    drawPineBranch(ctx, 90, 110, 280, 0.25, '#1E543C', '#B32434');
    drawPineBranch(ctx, W - 90, 110, 280, Math.PI - 0.25, '#1E543C', '#B32434');
    drawRibbonBow(ctx, W / 2, 116, 76, '#A91E2C', '#D8B56D');

    // Bottom corners: evergreen cluster left + snowy red cottage vignette right
    drawPineBranch(ctx, 76, H - 90, 220, -0.35, '#1E543C', '#B32434');
    drawStylizedPineTree(ctx, 185, H - 64, 105, 165, '#1D4F38', '#FFFFFF');
    drawStylizedPineTree(ctx, 880, H - 64, 95, 145, '#1D4F38', '#FFFFFF');
    drawMiniCottage(ctx, 1015, H - 64, 0.92);
  } else if (format === 'menu-woodland') {
    drawKraftPaperTexture(ctx, W, H, bg);

    // Pine & berry garland with pinecones + twine bow at top
    drawPineBranch(ctx, 40, 80, 360, 0.24, '#1B442E', '#9E1F25');
    drawPineBranch(ctx, W - 40, 80, 360, Math.PI - 0.24, '#1B442E', '#9E1F25');
    drawPineconeCluster(ctx, 240, 145, -0.35);
    drawPineconeCluster(ctx, W - 240, 145, 0.35);
    drawRibbonBow(ctx, W / 2, 118, 68, '#8C6A46', '#D7B992');

    // Subtle rustic dark frame
    ctx.strokeStyle = 'rgba(73, 54, 41, 0.45)';
    ctx.lineWidth = 2;
    ctx.strokeRect(72, 72, W - 144, H - 144);

    // Woodland forest silhouettes across bottom
    const trees = [
      { x: 130, w: 150, h: 245, c: '#2C281E' },
      { x: 255, w: 120, h: 195, c: '#383226' },
      { x: 365, w: 95, h: 150, c: '#2C281E' },
      { x: 835, w: 95, h: 150, c: '#2C281E' },
      { x: 945, w: 120, h: 195, c: '#383226' },
      { x: 1070, w: 150, h: 245, c: '#2C281E' },
    ];
    for (const t of trees) {
      drawStylizedPineTree(ctx, t.x, H - 58, t.w, t.h, t.c);
    }
  } else if (format === 'menu-midnight') {
    const sky = ctx.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, style.customBgColor || '#071124');
    sky.addColorStop(0.65, style.customBgColor || '#0D2345');
    sky.addColorStop(1, '#1A3E68');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, H);

    // Golden Crescent Moon & North Star
    drawCrescentMoon(ctx, 210, 185, 58, '#F6DA8E', style.customBgColor || '#091830');
    drawFourPointStar(ctx, 880, 150, 26, 8, '#FCE8A6', 0.95);
    for (let i = 0; i < 65; i++) {
      const sx = (i * 179 + 45) % W;
      const sy = (i * 251 + 40) % (H * 0.72);
      ctx.fillStyle = i % 3 === 0 ? '#FCE8A6' : 'rgba(255,255,255,0.75)';
      ctx.beginPath();
      ctx.arc(sx, sy, i % 4 === 0 ? 3 : 1.7, 0, Math.PI * 2);
      ctx.fill();
    }

    // Center dark halo behind text
    const scrim = ctx.createRadialGradient(W / 2, H * 0.48, 80, W / 2, H * 0.48, 620);
    scrim.addColorStop(0, 'rgba(6, 15, 32, 0.55)');
    scrim.addColorStop(1, 'rgba(6, 15, 32, 0)');
    ctx.fillStyle = scrim;
    ctx.fillRect(0, 0, W, H);

    // Cozy Snowy Village + Pines along bottom
    drawCozyCabinScene(ctx, W, H - 40);
    drawStylizedPineTree(ctx, 130, H * 0.85, 165, 290, '#102B42', '#E5F2FB');
    drawStylizedPineTree(ctx, 1070, H * 0.85, 165, 290, '#102B42', '#E5F2FB');

    // Fine gold frame
    ctx.strokeStyle = 'rgba(232, 201, 122, 0.55)';
    ctx.lineWidth = 2;
    ctx.strokeRect(48, 48, W - 96, H - 96);
  } else {
    // menu-nordic (Minimal Nordic Menu)
    drawKraftPaperTexture(ctx, W, H, bg);
    ctx.fillStyle = 'rgba(255, 252, 245, 0.65)';
    ctx.fillRect(0, 0, W, H);

    // Hand-drawn gold botanical branch left + red berry branch right
    drawBotanicalFern(ctx, 35, 360, 320, -0.82, '#C8A565');
    drawBotanicalFern(ctx, 35, 590, 230, -0.55, '#C8A565');
    drawPineBranch(ctx, W - 20, 120, 310, Math.PI - 0.35, '#1D4A35', '#B32434');

    // Soft minimalist Nordic trees bottom-left and bottom-right
    drawStylizedPineTree(ctx, 155, H - 64, 135, 220, '#B89B6E');
    drawStylizedPineTree(ctx, 255, H - 64, 95, 155, '#D2BA8F');
    drawStylizedPineTree(ctx, W - 155, H - 64, 140, 230, '#8A795E');
    drawStylizedPineTree(ctx, W - 265, H - 64, 90, 145, '#B2A184');

    // Subtle inset hairline
    ctx.strokeStyle = 'rgba(184, 149, 88, 0.38)';
    ctx.lineWidth = 1.6;
    ctx.strokeRect(64, 64, W - 128, H - 128);
  }

  // Shared Menu Content Hierarchy across all 5 distinct backgrounds
  const data = draft.menu;
  const maxW = 790;
  const anchorX =
    style.align === 'left' ? (W - maxW) / 2 : style.align === 'right' ? W - (W - maxW) / 2 : W / 2;
  let y = format === 'menu-classic' || format === 'menu-woodland' ? 230 : 190;
  const bottomLimit = H - 250;

  const titleText = data.menuTitle.trim() || template.defaultHeadline;
  const isScript =
    draft.design.fontFamily === 'great-vibes' ||
    (draft.design.fontFamily === 'auto' && template.headingFont === 'great-vibes');
  const titleSize = fitSize(
    ctx,
    titleText,
    isScript ? '400' : '700',
    style.headingFamily,
    isScript ? 104 : 74,
    42,
    maxW
  );

  y +=
    drawBlock(ctx, {
      text: titleText,
      x: anchorX,
      y,
      maxWidth: maxW,
      font: `${isScript ? '400' : '700'} ${titleSize}px ${style.headingFamily}`,
      color: style.secondaryTextColor,
      align: style.align,
      lineHeight: titleSize * 1.06,
      maxLines: 2,
      metallicGold:
        (format === 'menu-emerald' || format === 'menu-midnight') && !style.hasCustomColor,
      shadowColor: style.textShadow,
    }) + 12;

  if (data.subtitle.trim()) {
    y +=
      drawBlock(ctx, {
        text: data.subtitle.trim().toUpperCase(),
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
      }) + 22;
  }

  drawDividerRule(
    ctx,
    W / 2,
    y,
    180,
    style.hasCustomColor ? style.primaryTextColor : template.palette.borderColor
  );
  y += 30;

  const courses: { heading: string; items: string }[] = [
    { heading: 'STARTERS', items: data.starters },
    { heading: 'MAIN COURSE', items: data.mains },
    { heading: 'ACCOMPANIMENTS', items: data.sides },
    { heading: 'DESSERT', items: data.desserts },
    { heading: 'DRINKS', items: data.drinks },
  ];

  for (const c of courses) {
    if (!c.items.trim() || y > bottomLimit - 68) continue;
    y +=
      drawBlock(ctx, {
        text: c.heading,
        x: anchorX,
        y,
        maxWidth: maxW,
        font: `700 22px ${style.bodyFamily}`,
        color: style.secondaryTextColor,
        align: style.align,
        lineHeight: 28,
        letterSpacing: '3.5px',
        maxLines: 1,
        shadowColor: style.textShadow,
      }) + 6;

    y +=
      drawBlock(ctx, {
        text: c.items,
        x: anchorX,
        y,
        maxWidth: maxW - 20,
        font: `400 25px ${style.bodyFamily}`,
        color: style.primaryTextColor,
        align: style.align,
        lineHeight: 34,
        maxLines: 3,
        shadowColor: style.textShadow,
      }) + 26;
  }

  if (data.footerNote.trim() && y < bottomLimit + 40) {
    drawBlock(ctx, {
      text: data.footerNote.trim(),
      x: anchorX,
      y: Math.min(y + 8, bottomLimit + 18),
      maxWidth: maxW,
      font: `italic 400 24px ${style.accentFamily}`,
      color: style.mutedTextColor,
      align: style.align,
      lineHeight: 30,
      maxLines: 1,
      shadowColor: style.textShadow,
    });
  }
}

/* -------------------------------------------------------------------------- */
/* 2. CHRISTMAS PLACE CARDS (10 Tent Designs · 1400 x 800 Horizontal 7:4)     */
/* -------------------------------------------------------------------------- */

export function renderPlaceCardTemplate(
  ctx: CanvasRenderingContext2D,
  template: TemplateConfig,
  draft: CardDraftState,
  style: StationeryStyleContext
): void {
  const W = 1400;
  const H = 800;
  const bg = style.customBgColor || template.palette.background;
  const isLight =
    template.id === 'place-02' ||
    template.id === 'place-05' ||
    template.id === 'place-06' ||
    template.id === 'place-08' ||
    template.id === 'place-09' ||
    template.id === 'place-10';

  if (template.id === 'place-05') {
    drawCandyCaneBorder(ctx, W, H, 36, '#A91E2C', '#FFFFFF');
    ctx.fillStyle = bg;
    ctx.fillRect(36, 36, W - 72, H - 72);
  } else if (template.id === 'place-06') {
    drawKraftPaperTexture(ctx, W, H, bg);
  } else {
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);
  }

  // Subtle folded tent top crease indicator in studio mode only
  if (style.renderMode !== 'print-cut') {
    const topSheen = ctx.createLinearGradient(0, 0, 0, 80);
    topSheen.addColorStop(0, isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.08)');
    topSheen.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = topSheen;
    ctx.fillRect(0, 0, W, 80);
  }

  // Delicate outer & inner frames (never competing with the guest name!)
  const borderCol = style.hasCustomColor
    ? style.primaryTextColor
    : template.palette.borderColor;

  ctx.save();
  ctx.strokeStyle = borderCol;
  ctx.globalAlpha = 0.72;
  ctx.lineWidth = template.id === 'place-07' ? 3 : 2;
  ctx.strokeRect(46, 46, W - 92, H - 92);
  if (template.id === 'place-07' || template.id === 'place-01') {
    ctx.lineWidth = 1.2;
    ctx.strokeRect(60, 60, W - 120, H - 120);
  }
  ctx.restore();

  // Subtle template-specific corner accents (kept small & strictly in corners)
  switch (template.id) {
    case 'place-01':
      drawGoldFiligreeCorner(ctx, 64, 64, 1, 1, '#E3C172', 88);
      drawGoldFiligreeCorner(ctx, W - 64, 64, -1, 1, '#E3C172', 88);
      drawGoldFiligreeCorner(ctx, 64, H - 64, 1, -1, '#E3C172', 88);
      drawGoldFiligreeCorner(ctx, W - 64, H - 64, -1, -1, '#E3C172', 88);
      break;
    case 'place-02':
      drawBotanicalFern(ctx, 56, 175, 165, -0.68, '#9E7830');
      drawBotanicalFern(ctx, W - 56, H - 175, 165, Math.PI - 0.68, '#9E7830');
      break;
    case 'place-03':
      drawPineBranch(ctx, 58, 70, 155, 0.38, '#286A4A', '#E6C677');
      drawPineBranch(ctx, W - 58, H - 70, 155, Math.PI + 0.38, '#286A4A', '#E6C677');
      break;
    case 'place-04':
      drawFourPointStar(ctx, 118, 112, 16, 5, '#E6C677', 0.9);
      drawFourPointStar(ctx, 166, 92, 9, 3, '#E6C677', 0.65);
      drawFourPointStar(ctx, W - 118, 112, 16, 5, '#E6C677', 0.9);
      drawFourPointStar(ctx, W - 166, 92, 9, 3, '#E6C677', 0.65);
      break;
    case 'place-06':
      drawPineBranch(ctx, 58, 72, 155, 0.42, '#1E4C34', '#8B1E29');
      drawPineconeCluster(ctx, W - 108, H - 102, 0.35);
      break;
    case 'place-07':
      drawFourPointStar(ctx, 100, 100, 12, 4, '#E5C375', 0.85);
      drawFourPointStar(ctx, W - 100, 100, 12, 4, '#E5C375', 0.85);
      drawFourPointStar(ctx, 100, H - 100, 12, 4, '#E5C375', 0.85);
      drawFourPointStar(ctx, W - 100, H - 100, 12, 4, '#E5C375', 0.85);
      break;
    case 'place-08':
      drawSnowflake(ctx, 120, 122, 34, '#153A5B', 0.35, 2);
      drawSnowflake(ctx, W - 120, H - 122, 34, '#153A5B', 0.35, 2);
      drawSnowflake(ctx, W - 120, 115, 22, '#FFFFFF', 0.8, 2);
      break;
    case 'place-09':
      drawBotanicalFern(ctx, 56, 175, 165, -0.68, '#1D4A35');
      break;
    case 'place-10':
      ctx.fillStyle = '#B81C2E';
      ctx.fillRect(W / 2 - 48, 44, 96, 8);
      ctx.fillRect(W / 2 - 48, H - 52, 96, 8);
      break;
    default:
      break;
  }

  // Generous central zone dedicated cleanly to Guest Name (handles very long names gracefully)
  const data = draft.placeCard;
  const maxW = 1140;

  if (data.eventLabel.trim()) {
    drawBlock(ctx, {
      text: data.eventLabel.trim().toUpperCase(),
      x: W / 2,
      y: 126,
      maxWidth: maxW,
      font: `600 24px ${style.bodyFamily}`,
      color: style.secondaryTextColor,
      align: 'center',
      lineHeight: 30,
      letterSpacing: '5px',
      maxLines: 1,
      shadowColor: style.textShadow,
    });
  }

  const guest = data.guestName.trim() || 'Guest Name';
  const isScript =
    draft.design.fontFamily === 'great-vibes' ||
    (draft.design.fontFamily === 'auto' && template.headingFont === 'great-vibes');

  const gSize = fitSize(
    ctx,
    guest,
    isScript ? '400' : '700',
    style.headingFamily,
    isScript ? 132 : 96,
    46,
    maxW
  );

  // Measure height to vertically center guest name block
  ctx.save();
  ctx.font = `${isScript ? '400' : '700'} ${gSize}px ${style.headingFamily}`;
  const lines = wrapLines(ctx, guest, maxW, 2);
  ctx.restore();
  const blockH = lines.length * gSize * 1.12;
  const guestY = Math.max(210, H / 2 - blockH / 2 - 14);

  drawBlock(ctx, {
    text: guest,
    x: W / 2,
    y: guestY,
    maxWidth: maxW,
    font: `${isScript ? '400' : '700'} ${gSize}px ${style.headingFamily}`,
    color: style.primaryTextColor,
    align: 'center',
    lineHeight: gSize * 1.12,
    maxLines: 2,
    metallicGold: !isLight && !style.hasCustomColor && template.id !== 'place-03',
    shadowColor: style.textShadow,
  });

  drawDividerRule(
    ctx,
    W / 2,
    guestY + blockH + 26,
    210,
    borderCol
  );

  if (data.tableOrRole.trim()) {
    drawBlock(ctx, {
      text: data.tableOrRole.trim(),
      x: W / 2,
      y: Math.min(H - 140, guestY + blockH + 58),
      maxWidth: maxW,
      font: `600 28px ${style.bodyFamily}`,
      color: style.mutedTextColor,
      align: 'center',
      lineHeight: 34,
      maxLines: 1,
      shadowColor: style.textShadow,
    });
  }
}

/**
 * Renders a realistic Dinner Table Setting mockup showing the folded Place Card
 * standing above a porcelain charger plate & linen napkin.
 */
export async function renderPlaceCardTableScene(
  canvas: HTMLCanvasElement,
  template: TemplateConfig,
  draft: CardDraftState,
  style: StationeryStyleContext,
  targetW = 1200,
  targetH = 860
): Promise<void> {
  canvas.width = targetW;
  canvas.height = targetH;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.save();
  ctx.scale(targetW / 1200, targetH / 860);

  // Warm candlelit linen tablecloth
  const tableGrad = ctx.createRadialGradient(600, 320, 80, 600, 430, 850);
  tableGrad.addColorStop(0, '#2C2119');
  tableGrad.addColorStop(0.55, '#1B1510');
  tableGrad.addColorStop(1, '#0E0B09');
  ctx.fillStyle = tableGrad;
  ctx.fillRect(0, 0, 1200, 860);

  // Subtle woven linen grain
  ctx.strokeStyle = 'rgba(255, 240, 220, 0.03)';
  ctx.lineWidth = 1;
  for (let y = 0; y < 860; y += 8) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(1200, y);
    ctx.stroke();
  }

  // Ceramic dinner plate + gold rim peeking at bottom foreground
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.55)';
  ctx.shadowBlur = 40;
  ctx.shadowOffsetY = 14;
  ctx.fillStyle = '#F6F1E7';
  ctx.beginPath();
  ctx.arc(600, 885, 360, Math.PI, 0);
  ctx.fill();
  ctx.restore();

  ctx.strokeStyle = '#D4AF63';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(600, 885, 344, Math.PI, 0);
  ctx.stroke();

  // Folded cream linen napkin on left & pine sprig
  ctx.save();
  ctx.fillStyle = '#EAE0CE';
  ctx.shadowColor = 'rgba(0,0,0,0.4)';
  ctx.shadowBlur = 18;
  ctx.beginPath();
  ctx.roundRect(140, 560, 200, 340, 10);
  ctx.fill();
  ctx.restore();
  drawPineBranch(ctx, 185, 760, 210, -1.18, '#1E543C', '#B32434');

  // Soft warm candlelight glow top-right
  const candle = ctx.createRadialGradient(1040, 120, 10, 1040, 120, 260);
  candle.addColorStop(0, 'rgba(255, 214, 130, 0.25)');
  candle.addColorStop(1, 'rgba(255, 214, 130, 0)');
  ctx.fillStyle = candle;
  ctx.fillRect(0, 0, 1200, 860);

  // Render Place Card onto offscreen buffer first
  const cardCanvas = document.createElement('canvas');
  cardCanvas.width = 1400;
  cardCanvas.height = 800;
  const cCtx = cardCanvas.getContext('2d');
  if (cCtx) {
    renderPlaceCardTemplate(cCtx, template, draft, {
      ...style,
      renderMode: 'print-cut',
    });
  }

  // Draw standing folded tent card center-stage
  const cardW = 680;
  const cardH = 388;
  const cardX = (1200 - cardW) / 2;
  const cardY = 178;

  // Back leg of folded tent card peeking slightly at sides
  ctx.save();
  ctx.fillStyle = '#070B0E';
  ctx.globalAlpha = 0.65;
  ctx.filter = 'blur(16px)';
  ctx.beginPath();
  ctx.ellipse(600, cardY + cardH + 14, cardW * 0.52, 24, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Subtle folded top back-panel edge
  ctx.save();
  ctx.fillStyle = template.palette.secondaryBackground;
  ctx.beginPath();
  ctx.moveTo(cardX + 26, cardY - 16);
  ctx.lineTo(cardX + cardW - 26, cardY - 16);
  ctx.lineTo(cardX + cardW, cardY);
  ctx.lineTo(cardX, cardY);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // Front tent face
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.5)';
  ctx.shadowBlur = 24;
  ctx.shadowOffsetY = 12;
  ctx.drawImage(cardCanvas, cardX, cardY, cardW, cardH);
  ctx.restore();

  // Crisp top crease highlight
  ctx.strokeStyle = 'rgba(255,255,255,0.45)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cardX, cardY + 1);
  ctx.lineTo(cardX + cardW, cardY + 1);
  ctx.stroke();

  cardCanvas.width = 0;
  cardCanvas.height = 0;
  ctx.restore();
}

/* -------------------------------------------------------------------------- */
/* 3. DIE-CUT GIFT TAGS (10 Designs · 5 Distinct Tag Shapes + Eyelet/Ribbon)  */
/* -------------------------------------------------------------------------- */

function getTagHolePos(
  shape: GiftTagShape,
  W: number,
  H: number
): { hx: number; hy: number; r: number } {
  switch (shape) {
    case 'circle':
      return { hx: W / 2, hy: 222, r: 22 };
    case 'arch':
      return { hx: W / 2, hy: 228, r: 24 };
    case 'scalloped':
      return { hx: W / 2, hy: 224, r: 24 };
    case 'shield':
      return { hx: W / 2, hy: 220, r: 24 };
    case 'clipped-rect':
    default:
      return { hx: W / 2, hy: 228, r: 24 };
  }
}

function buildTagPath(
  ctx: CanvasRenderingContext2D,
  shape: GiftTagShape,
  padX: number,
  topY: number,
  tagW: number,
  tagH: number
): void {
  const left = padX;
  const right = padX + tagW;
  const bottom = topY + tagH;
  const cx = padX + tagW / 2;

  ctx.beginPath();
  if (shape === 'circle') {
    const r = tagW / 2;
    const cy = topY + r + 52;
    // Small top brass/paper ornament neck
    ctx.moveTo(cx - 58, cy - r + 14);
    ctx.lineTo(cx - 48, topY + 8);
    ctx.arc(cx, topY + 8, 48, Math.PI, 0, false);
    ctx.lineTo(cx + 58, cy - r + 14);
    ctx.arc(cx, cy, r, -Math.PI / 2 + 0.14, Math.PI * 1.5 - 0.14, false);
    ctx.closePath();
  } else if (shape === 'clipped-rect') {
    const bevel = 148;
    ctx.moveTo(left + bevel, topY);
    ctx.lineTo(right - bevel, topY);
    ctx.lineTo(right, topY + bevel);
    ctx.lineTo(right, bottom - 28);
    ctx.quadraticCurveTo(right, bottom, right - 28, bottom);
    ctx.lineTo(left + 28, bottom);
    ctx.quadraticCurveTo(left, bottom, left, bottom - 28);
    ctx.lineTo(left, topY + bevel);
    ctx.closePath();
  } else if (shape === 'arch') {
    const r = tagW / 2;
    ctx.moveTo(left, bottom - 24);
    ctx.lineTo(left, topY + r);
    ctx.arc(cx, topY + r, r, Math.PI, 0, false);
    ctx.lineTo(right, bottom - 24);
    ctx.quadraticCurveTo(right, bottom, right - 24, bottom);
    ctx.lineTo(left + 24, bottom);
    ctx.quadraticCurveTo(left, bottom, left, bottom - 24);
    ctx.closePath();
  } else if (shape === 'scalloped') {
    const r = 36;
    const step = 64;
    // Top scalloped crown + sides
    ctx.moveTo(left + 32, topY + 26);
    for (let x = left + 32; x < right - 32; x += step) {
      const mx = Math.min(x + step / 2, right - 32);
      ctx.quadraticCurveTo(mx, topY - 12, Math.min(x + step, right - 32), topY + 26);
    }
    for (let y = topY + 26; y < bottom - 32; y += step) {
      const my = Math.min(y + step / 2, bottom - 32);
      ctx.quadraticCurveTo(right + 16, my, right - 24, Math.min(y + step, bottom - 32));
    }
    for (let x = right - 24; x > left + 32; x -= step) {
      const mx = Math.max(x - step / 2, left + 32);
      ctx.quadraticCurveTo(mx, bottom + 14, Math.max(x - step, left + 32), bottom - 24);
    }
    for (let y = bottom - 24; y > topY + 26; y -= step) {
      const my = Math.max(y - step / 2, topY + 26);
      ctx.quadraticCurveTo(left - r * 0.45, my, left + 32, Math.max(y - step, topY + 26));
    }
    ctx.closePath();
  } else {
    // shield shape
    const shoulderY = topY + 125;
    ctx.moveTo(cx, topY);
    ctx.quadraticCurveTo(cx + tagW * 0.25, topY + 62, right, shoulderY);
    ctx.lineTo(right, bottom - 220);
    ctx.quadraticCurveTo(right - 20, bottom - 80, cx, bottom);
    ctx.quadraticCurveTo(left + 20, bottom - 80, left, bottom - 220);
    ctx.lineTo(left, shoulderY);
    ctx.quadraticCurveTo(cx - tagW * 0.25, topY + 62, cx, topY);
    ctx.closePath();
  }
}

export function renderGiftTagTemplate(
  ctx: CanvasRenderingContext2D,
  template: TemplateConfig,
  draft: CardDraftState,
  style: StationeryStyleContext,
  dims: { width: number; height: number }
): void {
  const W = dims.width;
  const H = dims.height;
  const shape: GiftTagShape = template.tagShape || 'clipped-rect';
  const isPrintCut = style.renderMode === 'print-cut';

  // Studio mat backdrop vs clean white printable background
  if (isPrintCut) {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, W, H);
  } else {
    const matGrad = ctx.createRadialGradient(W / 2, H * 0.45, 60, W / 2, H * 0.5, H * 0.72);
    matGrad.addColorStop(0, '#16293D');
    matGrad.addColorStop(1, '#091522');
    ctx.fillStyle = matGrad;
    ctx.fillRect(0, 0, W, H);
  }

  const padX = shape === 'circle' ? 80 : 66;
  const topY = 148;
  const tagW = W - padX * 2;
  const tagH = H - topY - 56;
  const bg = style.customBgColor || template.palette.background;
  const borderCol = style.hasCustomColor
    ? style.primaryTextColor
    : template.palette.borderColor;
  const { hx, hy, r: holeR } = getTagHolePos(shape, W, H);

  // Drop shadow behind tag in studio preview
  if (!isPrintCut) {
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.58)';
    ctx.shadowBlur = 42;
    ctx.shadowOffsetY = 20;
    buildTagPath(ctx, shape, padX, topY, tagW, tagH);
    ctx.fillStyle = bg;
    ctx.fill();
    ctx.restore();
  }

  // Clip interior to exact tag silhouette
  ctx.save();
  buildTagPath(ctx, shape, padX, topY, tagW, tagH);
  ctx.clip();

  if (template.id === 'tag-02') {
    drawKraftPaperTexture(ctx, W, H, bg);
  } else if (template.id === 'tag-03') {
    drawCandyCaneBorder(ctx, W, H, 68, '#A91E2C', '#FFFFFF');
    ctx.fillStyle = bg;
    ctx.fillRect(padX + 26, topY + 26, tagW - 52, tagH - 52);
  } else {
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);
  }

  // Shape-aligned botanical/festive decorations inside clipped tag
  if (template.id === 'tag-01' || template.id === 'tag-06') {
    drawPineBranch(ctx, padX + 18, topY + 125, 195, 0.45, '#1F5C3F', '#C42836');
    drawPineBranch(ctx, padX + tagW - 18, topY + 125, 195, Math.PI - 0.45, '#1F5C3F', '#C42836');
    drawFourPointStar(ctx, W / 2, H - 145, 22, 7, borderCol, 0.75);
  } else if (template.id === 'tag-02' || template.id === 'tag-10') {
    drawPineBranch(ctx, padX + 45, H - 180, 210, -0.45, '#1E4D36', '#8B1E29');
    drawPineBranch(ctx, padX + tagW - 45, H - 180, 210, Math.PI + 0.45, '#1E4D36', '#8B1E29');
  } else if (template.id === 'tag-04' || template.id === 'tag-09') {
    drawBotanicalFern(ctx, padX + 24, topY + 340, 210, -0.78, borderCol);
    drawBotanicalFern(ctx, padX + tagW - 24, H - 150, 190, Math.PI - 0.78, borderCol);
  } else if (template.id === 'tag-05') {
    drawCrescentMoon(ctx, W / 2 - 220, topY + 290, 40, '#F5D688', bg);
    for (let i = 0; i < 24; i++) {
      drawFourPointStar(
        ctx,
        padX + ((i * 193) % tagW),
        topY + 120 + ((i * 227) % (tagH - 220)),
        7,
        2.5,
        '#F5D688',
        0.55
      );
    }
  } else if (template.id === 'tag-08') {
    drawSnowflake(ctx, padX + 130, topY + 280, 42, '#FFFFFF', 0.85, 2.6);
    drawSnowflake(ctx, padX + tagW - 130, topY + 280, 42, '#FFFFFF', 0.85, 2.6);
    drawSnowflake(ctx, W / 2, H - 175, 36, '#153A5B', 0.35, 2.2);
  } else if (template.id === 'tag-07') {
    drawRibbonBow(ctx, W / 2, H - 165, 44, '#B3262E', '#D8B56D');
  }

  // Inner inset border trace matching tag silhouette
  ctx.save();
  ctx.strokeStyle = borderCol;
  ctx.lineWidth = 3;
  ctx.globalAlpha = 0.78;
  buildTagPath(ctx, shape, padX + 24, topY + 24, tagW - 48, tagH - 48);
  ctx.stroke();
  ctx.restore();

  // Typography inside Tag
  const data = draft.giftTag;
  const maxW = tagW - 135;
  let y = hy + 96;

  const headline = data.headline.trim() || template.defaultHeadline;
  const isScript =
    draft.design.fontFamily === 'great-vibes' ||
    (draft.design.fontFamily === 'auto' && template.headingFont === 'great-vibes');
  const hSize = fitSize(
    ctx,
    headline,
    isScript ? '400' : '700',
    style.headingFamily,
    isScript ? 82 : 56,
    34,
    maxW
  );

  y +=
    drawBlock(ctx, {
      text: headline,
      x: W / 2,
      y,
      maxWidth: maxW,
      font: `${isScript ? '400' : '700'} ${hSize}px ${style.headingFamily}`,
      color: style.secondaryTextColor,
      align: 'center',
      lineHeight: hSize * 1.1,
      maxLines: 2,
      metallicGold:
        (template.id === 'tag-01' || template.id === 'tag-05' || template.id === 'tag-06') &&
        !style.hasCustomColor,
      shadowColor: style.textShadow,
    }) + 22;

  drawDividerRule(ctx, W / 2, y, 130, borderCol);
  y += 32;

  if (data.toName.trim()) {
    y +=
      drawBlock(ctx, {
        text: 'TO:',
        x: W / 2,
        y,
        maxWidth: maxW,
        font: `700 20px ${style.bodyFamily}`,
        color: style.secondaryTextColor,
        align: 'center',
        lineHeight: 26,
        letterSpacing: '4px',
        shadowColor: style.textShadow,
      }) + 4;

    const toSize = fitSize(ctx, data.toName.trim(), '600', style.accentFamily, 50, 30, maxW);
    y +=
      drawBlock(ctx, {
        text: data.toName.trim(),
        x: W / 2,
        y,
        maxWidth: maxW,
        font: `600 ${toSize}px ${style.accentFamily}`,
        color: style.primaryTextColor,
        align: 'center',
        lineHeight: toSize * 1.15,
        maxLines: 2,
        shadowColor: style.textShadow,
      }) + 24;
  }

  if (data.fromName.trim()) {
    y +=
      drawBlock(ctx, {
        text: 'FROM:',
        x: W / 2,
        y,
        maxWidth: maxW,
        font: `700 20px ${style.bodyFamily}`,
        color: style.secondaryTextColor,
        align: 'center',
        lineHeight: 26,
        letterSpacing: '4px',
        shadowColor: style.textShadow,
      }) + 4;

    const fromSize = fitSize(ctx, data.fromName.trim(), '600', style.accentFamily, 42, 26, maxW);
    y +=
      drawBlock(ctx, {
        text: data.fromName.trim(),
        x: W / 2,
        y,
        maxWidth: maxW,
        font: `600 ${fromSize}px ${style.accentFamily}`,
        color: style.primaryTextColor,
        align: 'center',
        lineHeight: fromSize * 1.15,
        maxLines: 2,
        shadowColor: style.textShadow,
      }) + 20;
  }

  if (data.shortNote.trim() && y < topY + tagH - 125) {
    drawBlock(ctx, {
      text: data.shortNote.trim(),
      x: W / 2,
      y,
      maxWidth: maxW,
      font: `italic 400 23px ${style.accentFamily}`,
      color: style.mutedTextColor,
      align: 'center',
      lineHeight: 30,
      maxLines: 2,
      shadowColor: style.textShadow,
    });
  }

  ctx.restore(); // end tag silhouette clip

  // Outer cut/paper rim line
  ctx.save();
  buildTagPath(ctx, shape, padX, topY, tagW, tagH);
  if (isPrintCut) {
    ctx.strokeStyle = 'rgba(120, 120, 120, 0.55)';
    ctx.lineWidth = 2.5;
    ctx.setLineDash([12, 8]);
  } else {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 2;
  }
  ctx.stroke();
  ctx.restore();

  // Punched eyelet hole + grommet ring
  ctx.save();
  ctx.fillStyle = isPrintCut ? '#FFFFFF' : '#0D1E30';
  ctx.beginPath();
  ctx.arc(hx, hy, holeR, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = borderCol;
  ctx.lineWidth = 9;
  ctx.beginPath();
  ctx.arc(hx, hy, holeR + 4, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // Tied satin ribbon or twine loop (shown in studio preview; hidden on cut sheets)
  if (!isPrintCut) {
    const isTwine = template.id === 'tag-02' || template.id === 'tag-09';
    const cordColor = isTwine
      ? '#B7956C'
      : template.id === 'tag-03' || template.id === 'tag-07' || template.id === 'tag-10'
        ? '#B32434'
        : '#D8B56D';

    ctx.save();
    ctx.strokeStyle = cordColor;
    ctx.lineWidth = isTwine ? 8 : 11;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(hx - 6, hy);
    ctx.bezierCurveTo(hx - 54, hy - 70, hx - 22, 16, hx, 12);
    ctx.bezierCurveTo(hx + 22, 16, hx + 54, hy - 70, hx + 6, hy);
    ctx.stroke();

    // Small ribbon knot at eyelet
    ctx.fillStyle = cordColor;
    ctx.beginPath();
    ctx.ellipse(hx, hy - holeR - 8, 14, 9, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

/**
 * Renders a 6-Up Printable Gift Tag Sheet preview (US Letter proportion)
 * showing how 6 cut-ready tags tile cleanly with dashed cutting guides.
 */
export function renderGiftTagSheetPreview(
  canvas: HTMLCanvasElement,
  template: TemplateConfig,
  draft: CardDraftState,
  style: StationeryStyleContext,
  dims: { width: number; height: number },
  targetW = 850,
  targetH = 1100
): void {
  canvas.width = targetW;
  canvas.height = targetH;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.save();
  ctx.scale(targetW / 850, targetH / 1100);

  // Crisp printable white paper sheet
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, 850, 1100);

  ctx.fillStyle = '#5B626A';
  ctx.font = '600 16px "DM Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(
    'SANTA STUDIO  ·  6-UP PRINTABLE GIFT TAG SHEET (CUT ALONG DASHED LINES)',
    425,
    46
  );

  // Offscreen clean print-cut tag buffer
  const tagCanvas = document.createElement('canvas');
  tagCanvas.width = dims.width;
  tagCanvas.height = dims.height;
  const tCtx = tagCanvas.getContext('2d');
  if (tCtx) {
    renderGiftTagTemplate(
      tCtx,
      template,
      draft,
      { ...style, renderMode: 'print-cut' },
      dims
    );
  }

  const slotH = 295;
  const slotW = slotH * (dims.width / dims.height);
  const gapX = 95;
  const gapY = 34;
  const startX = (850 - (slotW * 2 + gapX)) / 2;
  const startY = 82;

  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 2; col++) {
      const x = startX + col * (slotW + gapX);
      const y = startY + row * (slotH + gapY);
      ctx.drawImage(tagCanvas, x, y, slotW, slotH);
    }
  }

  tagCanvas.width = 0;
  tagCanvas.height = 0;
  ctx.restore();
}

/* -------------------------------------------------------------------------- */
/* 4. THANK-YOU CARDS (5 Distinct Formats · Folded, Postcard, Photo, Minimal, Illustrated) */
/* -------------------------------------------------------------------------- */

export function renderThankYouTemplate(
  ctx: CanvasRenderingContext2D,
  template: TemplateConfig,
  draft: CardDraftState,
  photoImg: HTMLImageElement | null,
  style: StationeryStyleContext,
  dims: { width: number; height: number }
): void {
  const W = dims.width;
  const H = dims.height;
  const format = template.stationeryFormat || 'thankyou-folded';
  const data = draft.thankYou;
  const bg = style.customBgColor || template.palette.background;
  const borderCol = style.hasCustomColor
    ? style.primaryTextColor
    : template.palette.borderColor;

  if (format === 'thankyou-folded') {
    // Landscape Folded Card (1400 x 1000)
    const grad = ctx.createRadialGradient(W / 2, H / 2, 80, W / 2, H / 2, 880);
    grad.addColorStop(0, style.customBgColor || '#14442F');
    grad.addColorStop(1, style.customBgColor || '#092116');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = borderCol;
    ctx.lineWidth = 3;
    ctx.strokeRect(48, 48, W - 96, H - 96);
    ctx.lineWidth = 1.4;
    ctx.strokeRect(64, 64, W - 128, H - 128);

    drawGoldFiligreeCorner(ctx, 72, 72, 1, 1, '#E3C172', 120);
    drawGoldFiligreeCorner(ctx, W - 72, 72, -1, 1, '#E3C172', 120);
    drawGoldFiligreeCorner(ctx, 72, H - 72, 1, -1, '#E3C172', 120);
    drawGoldFiligreeCorner(ctx, W - 72, H - 72, -1, -1, '#E3C172', 120);

    // Subtle folded edge hint along top
    if (style.renderMode !== 'print-cut') {
      const sheen = ctx.createLinearGradient(0, 0, 0, 44);
      sheen.addColorStop(0, 'rgba(255,255,255,0.12)');
      sheen.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = sheen;
      ctx.fillRect(0, 0, W, 44);
    }

    const hasPhotoArea = Boolean(photoImg || style.showPhotoPlaceholder);
    const maxW = 940;
    const anchorX =
      style.align === 'left' ? 230 : style.align === 'right' ? W - 230 : W / 2;
    let y = hasPhotoArea ? 115 : 170;

    if (photoImg) {
      drawPhotoInSlot(
        ctx,
        photoImg,
        { ...template.photoSlot, x: W / 2, y: 200, width: 170, height: 170 },
        draft.photo
      );
      y = 310;
    } else if (style.showPhotoPlaceholder) {
      drawPhotoPlaceholderInSlot(
        ctx,
        { ...template.photoSlot, x: W / 2, y: 200, width: 170, height: 170 },
        true
      );
      y = 310;
    }

    const head = data.headline.trim() || template.defaultHeadline;
    const hSize = fitSize(ctx, head, '400', style.headingFamily, hasPhotoArea ? 82 : 106, 46, maxW);
    y +=
      drawBlock(ctx, {
        text: head,
        x: anchorX,
        y,
        maxWidth: maxW,
        font: `400 ${hSize}px ${style.headingFamily}`,
        color: style.secondaryTextColor,
        align: style.align,
        lineHeight: hSize * 1.08,
        maxLines: 1,
        metallicGold: !style.hasCustomColor,
        shadowColor: style.textShadow,
      }) + 16;

    drawDividerRule(ctx, W / 2, y, 220, borderCol);
    y += 32;

    if (data.recipientName.trim()) {
      y +=
        drawBlock(ctx, {
          text: data.recipientName.trim(),
          x: anchorX,
          y,
          maxWidth: maxW,
          font: `600 28px ${style.bodyFamily}`,
          color: style.secondaryTextColor,
          align: style.align,
          lineHeight: 36,
          maxLines: 1,
        }) + 14;
    }

    if (data.message.trim()) {
      y +=
        drawBlock(ctx, {
          text: data.message.trim(),
          x: anchorX,
          y,
          maxWidth: maxW,
          font: `400 26px ${style.bodyFamily}`,
          color: style.primaryTextColor,
          align: style.align,
          lineHeight: 39,
          maxLines: hasPhotoArea ? 3 : 4,
        }) + 24;
    }

    if (data.senderName.trim()) {
      y +=
        drawBlock(ctx, {
          text: data.senderName.trim(),
          x: anchorX,
          y,
          maxWidth: maxW,
          font: `400 48px "Great Vibes", cursive`,
          color: style.secondaryTextColor,
          align: style.align,
          lineHeight: 54,
          maxLines: 1,
          metallicGold: !style.hasCustomColor,
        }) + 8;
    }

    if (data.footerNote.trim()) {
      drawBlock(ctx, {
        text: data.footerNote.trim(),
        x: anchorX,
        y: Math.min(y + 4, H - 120),
        maxWidth: maxW,
        font: `italic 400 22px ${style.accentFamily}`,
        color: style.mutedTextColor,
        align: style.align,
        lineHeight: 28,
        maxLines: 1,
      });
    }
    return;
  }

  if (format === 'thankyou-postcard') {
    // Flat Postcard (1400 x 1000) with Stamp, Postmark & Airmail Stripes
    drawKraftPaperTexture(ctx, W, H, bg);
    ctx.fillStyle = 'rgba(255, 252, 245, 0.58)';
    ctx.fillRect(0, 0, W, H);

    // Classic angled airmail border ticks
    const stripeLen = 32;
    for (let x = 20; x < W - 20; x += stripeLen * 2) {
      ctx.fillStyle = (x / (stripeLen * 2)) % 2 === 0 ? '#9E222B' : '#1D4A35';
      ctx.fillRect(x, 22, stripeLen, 12);
      ctx.fillRect(x, H - 34, stripeLen, 12);
    }

    ctx.strokeStyle = '#C9A45A';
    ctx.lineWidth = 2;
    ctx.strokeRect(48, 52, W - 96, H - 104);

    // Vintage Postage Stamp top-right
    const sx = W - 230;
    const sy = 92;
    ctx.save();
    ctx.fillStyle = '#FFFFFF';
    ctx.shadowColor = 'rgba(0,0,0,0.16)';
    ctx.shadowBlur = 10;
    ctx.fillRect(sx, sy, 145, 175);
    ctx.restore();
    ctx.strokeStyle = '#9E222B';
    ctx.setLineDash([5, 5]);
    ctx.lineWidth = 2;
    ctx.strokeRect(sx + 6, sy + 6, 133, 163);
    ctx.setLineDash([]);
    ctx.fillStyle = '#F3ECE0';
    ctx.fillRect(sx + 14, sy + 14, 117, 147);
    drawStylizedPineTree(ctx, sx + 72, sy + 132, 62, 92, '#1D4A35', '#FFFFFF');
    drawFourPointStar(ctx, sx + 72, sy + 36, 10, 4, '#C9A45A', 1);

    // Wavy postmark lines overlapping left side of stamp
    ctx.save();
    ctx.strokeStyle = 'rgba(90, 74, 64, 0.35)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(sx - 26, sy + 85, 42, 0, Math.PI * 2);
    ctx.stroke();
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(sx - 125, sy + 68 + i * 16);
      ctx.quadraticCurveTo(sx - 85, sy + 60 + i * 16, sx - 45, sy + 68 + i * 16);
      ctx.stroke();
    }
    ctx.restore();

    const hasPhotoArea = Boolean(photoImg || style.showPhotoPlaceholder);
    const postcardPhotoSlot = {
      ...template.photoSlot,
      x: W - 180,
      y: 420,
      width: 195,
      height: 230,
    };
    if (photoImg) {
      drawPhotoInSlot(ctx, photoImg, postcardPhotoSlot, draft.photo);
    } else if (style.showPhotoPlaceholder) {
      drawPhotoPlaceholderInSlot(ctx, postcardPhotoSlot, false);
    }

    // Top Postcard Header & Left-aligned Handwritten Postcard Layout
    drawBlock(ctx, {
      text: 'HOLIDAY POST CARD',
      x: 96,
      y: 96,
      maxWidth: 700,
      font: `700 20px ${style.bodyFamily}`,
      color: style.mutedTextColor,
      align: 'left',
      lineHeight: 26,
      letterSpacing: '5px',
    });

    const head = data.headline.trim() || template.defaultHeadline;
    let y = 136;
    y +=
      drawBlock(ctx, {
        text: head,
        x: 96,
        y,
        maxWidth: 880,
        font: `400 104px ${style.headingFamily}`,
        color: style.secondaryTextColor,
        align: 'left',
        lineHeight: 112,
        maxLines: 1,
      }) + 16;

    ctx.strokeStyle = 'rgba(158, 34, 43, 0.35)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(96, y);
    ctx.lineTo(W - 310, y);
    ctx.stroke();
    y += 32;

    const noteW = hasPhotoArea ? 820 : 1060;
    if (data.recipientName.trim()) {
      y +=
        drawBlock(ctx, {
          text: data.recipientName.trim(),
          x: 96,
          y,
          maxWidth: noteW,
          font: `700 30px ${style.accentFamily}`,
          color: style.primaryTextColor,
          align: 'left',
          lineHeight: 38,
          maxLines: 1,
        }) + 16;
    }

    if (data.message.trim()) {
      y +=
        drawBlock(ctx, {
          text: data.message.trim(),
          x: 96,
          y,
          maxWidth: noteW,
          font: `400 28px ${style.bodyFamily}`,
          color: style.primaryTextColor,
          align: 'left',
          lineHeight: 42,
          maxLines: 5,
        }) + 28;
    }

    if (data.senderName.trim()) {
      y +=
        drawBlock(ctx, {
          text: data.senderName.trim(),
          x: 96,
          y,
          maxWidth: noteW,
          font: `400 50px "Great Vibes", cursive`,
          color: style.secondaryTextColor,
          align: 'left',
          lineHeight: 56,
          maxLines: 1,
        }) + 10;
    }

    if (data.footerNote.trim()) {
      drawBlock(ctx, {
        text: data.footerNote.trim(),
        x: 96,
        y: Math.min(y + 4, H - 108),
        maxWidth: noteW,
        font: `italic 400 23px ${style.accentFamily}`,
        color: style.mutedTextColor,
        align: 'left',
        lineHeight: 28,
        maxLines: 1,
      });
    }
    return;
  }

  if (format === 'thankyou-photo') {
    // Split Photo Keepsake Card (1400 x 1000)
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = borderCol;
    ctx.lineWidth = 2.5;
    ctx.strokeRect(44, 44, W - 88, H - 88);

    // Left Half: Photo Frame (or festive holiday wreath keepsake fallback if no photo uploaded yet)
    const slot = {
      shape: 'rounded' as const,
      x: 375,
      y: 500,
      width: 530,
      height: 760,
      borderColor: borderCol,
    };
    if (photoImg) {
      drawPhotoInSlot(ctx, photoImg, slot, draft.photo);
    } else if (style.showPhotoPlaceholder) {
      drawPhotoPlaceholderInSlot(
        ctx,
        slot,
        false,
        undefined,
        undefined,
        'ADD YOUR HOLIDAY PHOTO'
      );
    } else {
      ctx.save();
      ctx.fillStyle = '#ECE4D3';
      ctx.strokeStyle = borderCol;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(110, 120, 530, 760, 18);
      ctx.fill();
      ctx.stroke();
      drawLayeredWreath(ctx, 375, 500, 165, '#C5A35A');
      ctx.restore();
    }

    // Right Half: Gratitude Note
    const rx = 720;
    const rMaxW = 580;
    let y = 180;

    drawBlock(ctx, {
      text: 'SEASON OF GRATITUDE',
      x: rx,
      y: 126,
      maxWidth: rMaxW,
      font: `600 18px ${style.bodyFamily}`,
      color: style.secondaryTextColor,
      align: 'left',
      lineHeight: 24,
      letterSpacing: '4px',
    });

    const head = data.headline.trim() || template.defaultHeadline;
    const hSize = fitSize(ctx, head, '700', style.headingFamily, 70, 40, rMaxW);
    y +=
      drawBlock(ctx, {
        text: head,
        x: rx,
        y,
        maxWidth: rMaxW,
        font: `700 ${hSize}px ${style.headingFamily}`,
        color: style.primaryTextColor,
        align: 'left',
        lineHeight: hSize * 1.1,
        maxLines: 2,
      }) + 18;

    ctx.strokeStyle = borderCol;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(rx, y);
    ctx.lineTo(rx + 180, y);
    ctx.stroke();
    y += 34;

    if (data.recipientName.trim()) {
      y +=
        drawBlock(ctx, {
          text: data.recipientName.trim(),
          x: rx,
          y,
          maxWidth: rMaxW,
          font: `600 26px ${style.bodyFamily}`,
          color: style.secondaryTextColor,
          align: 'left',
          lineHeight: 34,
          maxLines: 1,
        }) + 16;
    }

    if (data.message.trim()) {
      y +=
        drawBlock(ctx, {
          text: data.message.trim(),
          x: rx,
          y,
          maxWidth: rMaxW,
          font: `400 25px ${style.bodyFamily}`,
          color: style.primaryTextColor,
          align: 'left',
          lineHeight: 38,
          maxLines: 6,
        }) + 32;
    }

    if (data.senderName.trim()) {
      y +=
        drawBlock(ctx, {
          text: data.senderName.trim(),
          x: rx,
          y,
          maxWidth: rMaxW,
          font: `400 46px "Great Vibes", cursive`,
          color: style.secondaryTextColor,
          align: 'left',
          lineHeight: 54,
          maxLines: 1,
        }) + 8;
    }

    if (data.footerNote.trim()) {
      drawBlock(ctx, {
        text: data.footerNote.trim(),
        x: rx,
        y: Math.min(y + 4, H - 115),
        maxWidth: rMaxW,
        font: `italic 400 21px ${style.accentFamily}`,
        color: style.mutedTextColor,
        align: 'left',
        lineHeight: 28,
        maxLines: 1,
      });
    }
    return;
  }

  if (format === 'thankyou-minimal') {
    // Minimalist Portrait Typography Card (1200 x 1500)
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Subtle letterpress inner inset frame
    ctx.strokeStyle = 'rgba(185, 175, 155, 0.55)';
    ctx.lineWidth = 2;
    ctx.strokeRect(86, 86, W - 172, H - 172);

    // Delicate mistletoe / holly crest centered at top
    drawPineBranch(ctx, W / 2 - 80, 210, 85, -0.25, '#1D4A35', '#8B1E29');
    drawPineBranch(ctx, W / 2 + 80, 210, 85, Math.PI + 0.25, '#1D4A35', '#8B1E29');
    drawFourPointStar(ctx, W / 2, 198, 12, 4, '#C5A35A', 1);

    const hasPhotoArea = Boolean(photoImg || style.showPhotoPlaceholder);
    const minimalSlot = {
      ...template.photoSlot,
      x: W / 2,
      y: 405,
      width: 210,
      height: 240,
    };
    let y = 290;
    if (photoImg) {
      drawPhotoInSlot(ctx, photoImg, minimalSlot, draft.photo);
      y = 565;
    } else if (style.showPhotoPlaceholder) {
      drawPhotoPlaceholderInSlot(ctx, minimalSlot, false);
      y = 565;
    }

    const head = (data.headline.trim() || template.defaultHeadline).toUpperCase();
    const maxW = 820;
    const hSize = fitSize(
      ctx,
      head,
      '700',
      style.headingFamily,
      hasPhotoArea ? 64 : 84,
      42,
      maxW
    );
    y +=
      drawBlock(ctx, {
        text: head,
        x: W / 2,
        y,
        maxWidth: maxW,
        font: `700 ${hSize}px ${style.headingFamily}`,
        color: style.primaryTextColor,
        align: 'center',
        lineHeight: hSize * 1.08,
        letterSpacing: '6px',
        maxLines: 2,
      }) + 32;

    drawDividerRule(ctx, W / 2, y, 130, borderCol);
    y += 48;

    if (data.recipientName.trim()) {
      y +=
        drawBlock(ctx, {
          text: data.recipientName.trim(),
          x: W / 2,
          y,
          maxWidth: maxW,
          font: `600 28px ${style.bodyFamily}`,
          color: style.secondaryTextColor,
          align: 'center',
          lineHeight: 36,
          maxLines: 1,
        }) + 20;
    }

    if (data.message.trim()) {
      y +=
        drawBlock(ctx, {
          text: data.message.trim(),
          x: W / 2,
          y,
          maxWidth: 740,
          font: `400 26px ${style.bodyFamily}`,
          color: style.primaryTextColor,
          align: 'center',
          lineHeight: 42,
          maxLines: hasPhotoArea ? 4 : 6,
        }) + 42;
    }

    if (data.senderName.trim()) {
      y +=
        drawBlock(ctx, {
          text: data.senderName.trim(),
          x: W / 2,
          y,
          maxWidth: maxW,
          font: `400 48px "Great Vibes", cursive`,
          color: style.secondaryTextColor,
          align: 'center',
          lineHeight: 56,
          maxLines: 1,
        }) + 16;
    }

    if (data.footerNote.trim()) {
      drawBlock(ctx, {
        text: data.footerNote.trim().toUpperCase(),
        x: W / 2,
        y: Math.min(y + 12, H - 155),
        maxWidth: maxW,
        font: `500 18px ${style.bodyFamily}`,
        color: style.mutedTextColor,
        align: 'center',
        lineHeight: 24,
        letterSpacing: '3px',
        maxLines: 1,
      });
    }
    return;
  }

  // thankyou-illustrated (Illustrated Winter Village Scene · 1200 x 1500)
  const sky = ctx.createLinearGradient(0, 0, 0, H);
  sky.addColorStop(0, style.customBgColor || '#0D223E');
  sky.addColorStop(0.65, style.customBgColor || '#1C446E');
  sky.addColorStop(1, '#2D5E8C');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, H);

  // Subtle snowfall & glowing stars
  for (let i = 0; i < 65; i++) {
    const sx = (i * 197 + 35) % W;
    const sy = (i * 263 + 25) % (H * 0.72);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.beginPath();
    ctx.arc(sx, sy, (i % 3) + 1.5, 0, Math.PI * 2);
    ctx.fill();
  }
  drawOrnamentBall(ctx, 180, 175, 42, 0, '#D8B56D', '#FFF1C2');
  drawOrnamentBall(ctx, W - 180, 155, 34, 0, '#A92332', '#F7A8B0');

  // Snowy village & cozy cabin along bottom 28%
  drawCozyCabinScene(ctx, W, H);

  const hasPhotoArea = Boolean(photoImg || style.showPhotoPlaceholder);
  const illusSlot = {
    ...template.photoSlot,
    x: W / 2,
    y: 270,
    width: 205,
    height: 205,
  };
  const maxW = 860;
  let y = 170;
  if (photoImg) {
    drawPhotoInSlot(ctx, photoImg, illusSlot, draft.photo);
    y = 405;
  } else if (style.showPhotoPlaceholder) {
    drawPhotoPlaceholderInSlot(ctx, illusSlot, true);
    y = 405;
  }

  const head = data.headline.trim() || template.defaultHeadline;
  const hSize = fitSize(
    ctx,
    head,
    '400',
    style.headingFamily,
    hasPhotoArea ? 82 : 104,
    44,
    maxW
  );
  y +=
    drawBlock(ctx, {
      text: head,
      x: W / 2,
      y,
      maxWidth: maxW,
      font: `400 ${hSize}px ${style.headingFamily}`,
      color: style.secondaryTextColor,
      align: 'center',
      lineHeight: hSize * 1.1,
      maxLines: 2,
      metallicGold: !style.hasCustomColor,
      shadowColor: 'rgba(0,0,0,0.45)',
    }) + 16;

  drawDividerRule(ctx, W / 2, y, 165, borderCol);
  y += 28;

  if (data.recipientName.trim()) {
    y +=
      drawBlock(ctx, {
        text: data.recipientName.trim(),
        x: W / 2,
        y,
        maxWidth: maxW,
        font: `600 28px ${style.bodyFamily}`,
        color: style.secondaryTextColor,
        align: 'center',
        lineHeight: 36,
        maxLines: 1,
        shadowColor: 'rgba(0,0,0,0.4)',
      }) + 14;
  }

  if (data.message.trim()) {
    y +=
      drawBlock(ctx, {
        text: data.message.trim(),
        x: W / 2,
        y,
        maxWidth: maxW - 40,
        font: `400 25px ${style.bodyFamily}`,
        color: style.primaryTextColor,
        align: 'center',
        lineHeight: 38,
        maxLines: hasPhotoArea ? 3 : 5,
        shadowColor: 'rgba(0,0,0,0.45)',
      }) + 22;
  }

  if (data.senderName.trim()) {
    y +=
      drawBlock(ctx, {
        text: data.senderName.trim(),
        x: W / 2,
        y,
        maxWidth: maxW,
        font: `400 46px "Great Vibes", cursive`,
        color: style.secondaryTextColor,
        align: 'center',
        lineHeight: 54,
        maxLines: 1,
        metallicGold: !style.hasCustomColor,
        shadowColor: 'rgba(0,0,0,0.45)',
      }) + 8;
  }

  if (data.footerNote.trim() && y < H - 360) {
    drawBlock(ctx, {
      text: data.footerNote.trim(),
      x: W / 2,
      y,
      maxWidth: maxW,
      font: `italic 400 22px ${style.accentFamily}`,
      color: style.mutedTextColor,
      align: 'center',
      lineHeight: 28,
      maxLines: 1,
      shadowColor: 'rgba(0,0,0,0.4)',
    });
  }
}
