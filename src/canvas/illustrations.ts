import { PhotoSettings, PhotoSlotConfig } from '../types/card';

export function drawFourPointStar(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  outerR: number,
  innerR: number,
  color: string,
  alpha = 1
): void {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const angle = (i * Math.PI) / 4 - Math.PI / 2;
    const x = cx + Math.cos(angle) * r;
    const y = cy + Math.sin(angle) * r;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

export function drawSnowflake(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  color: string,
  alpha = 0.85,
  lineWidth = 2.5
): void {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.lineCap = 'round';
  ctx.translate(cx, cy);

  for (let i = 0; i < 6; i++) {
    ctx.save();
    ctx.rotate((i * Math.PI) / 3);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -radius);
    ctx.stroke();

    // Side branches
    const b1 = -radius * 0.45;
    const b2 = -radius * 0.72;
    ctx.beginPath();
    ctx.moveTo(0, b1);
    ctx.lineTo(-radius * 0.22, b1 - radius * 0.18);
    ctx.moveTo(0, b1);
    ctx.lineTo(radius * 0.22, b1 - radius * 0.18);
    ctx.moveTo(0, b2);
    ctx.lineTo(-radius * 0.16, b2 - radius * 0.14);
    ctx.moveTo(0, b2);
    ctx.lineTo(radius * 0.16, b2 - radius * 0.14);
    ctx.stroke();
    ctx.restore();
  }
  ctx.restore();
}

export function drawCrescentMoon(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  color: string,
  bgColor: string
): void {
  ctx.save();
  // Soft outer halo
  const grad = ctx.createRadialGradient(cx, cy, radius * 0.4, cx, cy, radius * 2.2);
  grad.addColorStop(0, 'rgba(226, 195, 123, 0.30)');
  grad.addColorStop(1, 'rgba(226, 195, 123, 0)');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 2.2, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = bgColor;
  ctx.beginPath();
  ctx.arc(cx + radius * 0.36, cy - radius * 0.16, radius * 0.84, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

export function drawLayeredWreath(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  goldColor = '#D8B56D'
): void {
  ctx.save();
  ctx.translate(cx, cy);

  // Subtle golden backing ring
  ctx.strokeStyle = goldColor;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.stroke();

  const leafCount = 34;
  for (let i = 0; i < leafCount; i++) {
    const angle = (i / leafCount) * Math.PI * 2;
    const lx = Math.cos(angle) * radius;
    const ly = Math.sin(angle) * radius;
    ctx.save();
    ctx.translate(lx, ly);
    ctx.rotate(angle + Math.PI / 2);

    ctx.fillStyle = i % 2 === 0 ? '#1E543C' : '#2A6B4E';
    ctx.beginPath();
    ctx.ellipse(-7, 0, 9, 22, -0.35, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = i % 2 === 0 ? '#2E7354' : '#184430';
    ctx.beginPath();
    ctx.ellipse(8, 2, 8, 20, 0.38, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // Crimson berries & gold dots
  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * Math.PI * 2 + 0.15;
    const bx = Math.cos(angle) * (radius + (i % 2 === 0 ? 7 : -7));
    const by = Math.sin(angle) * (radius + (i % 2 === 0 ? 7 : -7));
    ctx.fillStyle = i % 3 === 0 ? goldColor : '#B32434';
    ctx.beginPath();
    ctx.arc(bx, by, i % 3 === 0 ? 4.5 : 6.2, 0, Math.PI * 2);
    ctx.fill();
  }

  // Top satin bow
  drawRibbonBow(ctx, 0, -radius - 4, 34, '#A92332', goldColor);
  ctx.restore();
}

export function drawRibbonBow(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number,
  color: string,
  trimColor?: string
): void {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.fillStyle = color;

  // Left loop
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(-size * 1.1, -size * 0.6, -size * 1.1, size * 0.55, 0, 4);
  ctx.fill();

  // Right loop
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(size * 1.1, -size * 0.6, size * 1.1, size * 0.55, 0, 4);
  ctx.fill();

  // Tails
  ctx.beginPath();
  ctx.moveTo(-4, 4);
  ctx.lineTo(-size * 0.58, size * 0.95);
  ctx.lineTo(-size * 0.25, size * 0.78);
  ctx.lineTo(-2, 10);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(4, 4);
  ctx.lineTo(size * 0.58, size * 0.95);
  ctx.lineTo(size * 0.25, size * 0.78);
  ctx.lineTo(2, 10);
  ctx.closePath();
  ctx.fill();

  if (trimColor) {
    ctx.strokeStyle = trimColor;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.arc(0, 2, size * 0.2, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(0, 2, size * 0.18, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

export function drawPineBranch(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  length: number,
  angle: number,
  needleColor: string,
  berryColor?: string
): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  // Branch stem
  ctx.strokeStyle = needleColor;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(length * 0.5, -14, length, 4);
  ctx.stroke();

  // Pine needles
  ctx.lineWidth = 1.8;
  const steps = Math.floor(length / 10);
  for (let i = 1; i < steps; i++) {
    const px = (i / steps) * length;
    const py = Math.sin((i / steps) * Math.PI) * -6;
    const spread = 24 - (i / steps) * 8;
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.lineTo(px + 12, py - spread);
    ctx.moveTo(px, py);
    ctx.lineTo(px + 10, py + spread * 0.9);
    ctx.stroke();
  }

  if (berryColor) {
    ctx.fillStyle = berryColor;
    const spots = [0.28, 0.55, 0.76];
    for (const s of spots) {
      ctx.beginPath();
      ctx.arc(length * s, -4, 5.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();
}

export function drawStylizedPineTree(
  ctx: CanvasRenderingContext2D,
  cx: number,
  baseY: number,
  width: number,
  height: number,
  fillColor: string,
  snowColor?: string
): void {
  ctx.save();
  const tiers = 3;
  for (let t = 0; t < tiers; t++) {
    const tierTop = baseY - height + t * (height * 0.24);
    const tierBottom = baseY - height * 0.12 + t * (height * 0.04) - (tiers - 1 - t) * (height * 0.2);
    const tierHalfW = (width * (0.48 + t * 0.26)) / 2;

    ctx.fillStyle = fillColor;
    ctx.beginPath();
    ctx.moveTo(cx, tierTop);
    ctx.lineTo(cx - tierHalfW, tierBottom);
    ctx.lineTo(cx + tierHalfW, tierBottom);
    ctx.closePath();
    ctx.fill();

    if (snowColor) {
      ctx.fillStyle = snowColor;
      ctx.beginPath();
      ctx.moveTo(cx, tierTop);
      ctx.lineTo(cx - tierHalfW * 0.52, tierTop + (tierBottom - tierTop) * 0.42);
      ctx.quadraticCurveTo(cx, tierTop + (tierBottom - tierTop) * 0.52, cx + tierHalfW * 0.52, tierTop + (tierBottom - tierTop) * 0.42);
      ctx.closePath();
      ctx.fill();
    }
  }
  ctx.restore();
}

export function drawCandyCaneBorder(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  borderSize: number,
  redColor = '#A92332',
  creamColor = '#FFFFFF'
): void {
  ctx.save();
  ctx.fillStyle = creamColor;
  ctx.fillRect(0, 0, w, h);

  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, w, h);
  ctx.rect(borderSize, borderSize, w - borderSize * 2, h - borderSize * 2);
  ctx.clip('evenodd');

  ctx.fillStyle = redColor;
  const stripeW = 34;
  for (let x = -h; x < w + h; x += stripeW * 2) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + stripeW, 0);
    ctx.lineTo(x + stripeW - h, h);
    ctx.lineTo(x - h, h);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
  ctx.restore();
}

export function drawKraftPaperTexture(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  baseColor: string
): void {
  ctx.save();
  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, w, h);

  // Deterministic organic fiber speckles
  for (let i = 0; i < 420; i++) {
    const sx = ((i * 1973) % 1200) * (w / 1200);
    const sy = ((i * 2909) % 1500) * (h / 1500);
    const r = ((i % 4) + 1) * 0.85;
    ctx.fillStyle = i % 2 === 0 ? 'rgba(84, 58, 36, 0.08)' : 'rgba(255, 248, 235, 0.09)';
    ctx.beginPath();
    ctx.arc(sx, sy, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Soft edge vignette
  const grad = ctx.createRadialGradient(w / 2, h / 2, w * 0.25, w / 2, h / 2, w * 0.85);
  grad.addColorStop(0, 'rgba(0,0,0,0)');
  grad.addColorStop(1, 'rgba(65, 42, 22, 0.22)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
  ctx.restore();
}

export function drawOrnamentBall(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  threadTopY: number,
  fillColor: string,
  highlightColor: string,
  threadColor = '#D8B56D'
): void {
  ctx.save();
  ctx.strokeStyle = threadColor;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx, threadTopY);
  ctx.lineTo(cx, cy - r - 8);
  ctx.stroke();

  // Cap
  ctx.fillStyle = threadColor;
  ctx.fillRect(cx - r * 0.24, cy - r - 9, r * 0.48, 10);

  // Sphere gradient
  const grad = ctx.createRadialGradient(cx - r * 0.32, cy - r * 0.32, r * 0.1, cx, cy, r);
  grad.addColorStop(0, highlightColor);
  grad.addColorStop(0.55, fillColor);
  grad.addColorStop(1, 'rgba(0,0,0,0.45)');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();

  // Fine band ornament pattern
  ctx.strokeStyle = 'rgba(255, 245, 220, 0.45)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.84, 0.2, Math.PI - 0.2);
  ctx.stroke();
  ctx.restore();
}

export function drawGlowingLightsStrand(
  ctx: CanvasRenderingContext2D,
  startX: number,
  endX: number,
  y: number,
  sag: number,
  bulbCount: number
): void {
  const colors = ['#FFD166', '#FF4D6D', '#4CC9F0', '#52B788', '#F4A261'];
  ctx.save();
  ctx.strokeStyle = 'rgba(180, 195, 215, 0.45)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(startX, y);
  ctx.quadraticCurveTo((startX + endX) / 2, y + sag, endX, y);
  ctx.stroke();

  for (let i = 1; i <= bulbCount; i++) {
    const t = i / (bulbCount + 1);
    const bx = (1 - t) * (1 - t) * startX + 2 * (1 - t) * t * ((startX + endX) / 2) + t * t * endX;
    const by = (1 - t) * (1 - t) * y + 2 * (1 - t) * t * (y + sag) + t * t * y;
    const color = colors[i % colors.length];

    // Halo
    const halo = ctx.createRadialGradient(bx, by + 16, 2, bx, by + 16, 44);
    halo.addColorStop(0, color);
    halo.addColorStop(0.4, color + '55');
    halo.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(bx, by + 16, 44, 0, Math.PI * 2);
    ctx.fill();

    // Socket
    ctx.fillStyle = '#2B3445';
    ctx.fillRect(bx - 4, by, 8, 8);

    // Bulb
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.ellipse(bx, by + 16, 8, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(255,255,255,0.75)';
    ctx.beginPath();
    ctx.ellipse(bx - 2.5, by + 12, 2.2, 4, -0.3, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

export function drawSantaHatAndGifts(ctx: CanvasRenderingContext2D): void {
  ctx.save();
  // Gift boxes along bottom
  const drawGift = (gx: number, gy: number, gw: number, gh: number, boxColor: string, ribbonColor: string) => {
    ctx.fillStyle = boxColor;
    ctx.fillRect(gx, gy, gw, gh);
    ctx.fillStyle = ribbonColor;
    ctx.fillRect(gx + gw / 2 - 6, gy, 12, gh);
    ctx.fillRect(gx, gy + gh / 2 - 6, gw, 12);
    ctx.fillStyle = boxColor;
    ctx.fillRect(gx - 5, gy - 14, gw + 10, 16);
    ctx.fillStyle = ribbonColor;
    ctx.fillRect(gx + gw / 2 - 6, gy - 14, 12, 16);
    drawRibbonBow(ctx, gx + gw / 2, gy - 16, 22, ribbonColor);
  };

  drawGift(130, 1285, 110, 105, '#143B2C', '#D8B56D');
  drawGift(255, 1320, 88, 70, '#D8B56D', '#A92332');
  drawGift(865, 1305, 95, 85, '#1D4A35', '#F8F1E5');
  drawGift(975, 1275, 115, 115, '#D8B56D', '#9D1D2C');

  // Stockings hanging left/right top corners
  const drawStocking = (sx: number, sy: number, flip: number) => {
    ctx.save();
    ctx.translate(sx, sy);
    ctx.scale(flip, 1);
    ctx.fillStyle = '#B82635';
    ctx.beginPath();
    ctx.roundRect(-18, 12, 36, 58, 8);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(10, 66, 26, 15, 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#F8F1E5';
    ctx.beginPath();
    ctx.roundRect(-22, 0, 44, 18, 6);
    ctx.fill();
    ctx.restore();
  };
  drawStocking(165, 140, 1);
  drawStocking(1035, 140, -1);

  // Jolly Santa Hat icon centered at top
  ctx.save();
  ctx.translate(600, 150);
  ctx.fillStyle = '#C92434';
  ctx.beginPath();
  ctx.moveTo(-48, 20);
  ctx.quadraticCurveTo(-20, -45, 45, -24);
  ctx.quadraticCurveTo(22, 8, 44, 20);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.roundRect(-54, 14, 106, 22, 11);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(48, -22, 13, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  ctx.restore();
}

export function drawGingerbreadAndReindeer(ctx: CanvasRenderingContext2D): void {
  ctx.save();
  // Smiling Gingerbread Character bottom-left
  ctx.save();
  ctx.translate(220, 1285);
  ctx.rotate(-0.1);
  ctx.fillStyle = '#B8723E';
  // Head
  ctx.beginPath();
  ctx.arc(0, -42, 26, 0, Math.PI * 2);
  ctx.fill();
  // Arms & Body
  ctx.beginPath();
  ctx.roundRect(-42, -16, 84, 24, 12);
  ctx.roundRect(-22, -20, 44, 62, 14);
  ctx.roundRect(-22, 28, 18, 36, 9);
  ctx.roundRect(4, 28, 18, 36, 9);
  ctx.fill();
  // Frosting details
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(-8, -46, 3.5, 0, Math.PI * 2);
  ctx.arc(8, -46, 3.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(0, -37, 9, 0.2, Math.PI - 0.2);
  ctx.stroke();
  ctx.fillStyle = '#B8333A';
  ctx.beginPath();
  ctx.arc(0, 0, 5, 0, Math.PI * 2);
  ctx.arc(0, 16, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Cute Reindeer bottom-right
  ctx.save();
  ctx.translate(980, 1290);
  ctx.rotate(0.08);
  // Antlers
  ctx.strokeStyle = '#6D452B';
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-16, -42);
  ctx.lineTo(-28, -74);
  ctx.moveTo(-24, -60);
  ctx.lineTo(-38, -64);
  ctx.moveTo(16, -42);
  ctx.lineTo(28, -74);
  ctx.moveTo(24, -60);
  ctx.lineTo(38, -64);
  ctx.stroke();
  // Face
  ctx.fillStyle = '#9C6644';
  ctx.beginPath();
  ctx.ellipse(0, -18, 32, 28, 0, 0, Math.PI * 2);
  ctx.fill();
  // Snout
  ctx.fillStyle = '#D7A984';
  ctx.beginPath();
  ctx.ellipse(0, -6, 20, 14, 0, 0, Math.PI * 2);
  ctx.fill();
  // Red nose
  ctx.fillStyle = '#C92A35';
  ctx.beginPath();
  ctx.arc(0, -10, 8, 0, Math.PI * 2);
  ctx.fill();
  // Eyes
  ctx.fillStyle = '#24160F';
  ctx.beginPath();
  ctx.arc(-12, -24, 3.8, 0, Math.PI * 2);
  ctx.arc(12, -24, 3.8, 0, Math.PI * 2);
  ctx.fill();
  // Scarf
  ctx.fillStyle = '#1D4A35';
  ctx.beginPath();
  ctx.roundRect(-26, 8, 52, 16, 8);
  ctx.fill();
  ctx.restore();
  ctx.restore();
}

export function drawCozyCabinScene(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  ctx.save();
  // Snowy rolling hills
  ctx.fillStyle = '#D6E8F5';
  ctx.beginPath();
  ctx.moveTo(0, h * 0.78);
  ctx.quadraticCurveTo(w * 0.28, h * 0.72, w * 0.56, h * 0.79);
  ctx.quadraticCurveTo(w * 0.82, h * 0.84, w, h * 0.76);
  ctx.lineTo(w, h);
  ctx.lineTo(0, h);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#F2F8FD';
  ctx.beginPath();
  ctx.moveTo(0, h * 0.84);
  ctx.quadraticCurveTo(w * 0.35, h * 0.89, w * 0.7, h * 0.83);
  ctx.quadraticCurveTo(w * 0.88, h * 0.80, w, h * 0.85);
  ctx.lineTo(w, h);
  ctx.lineTo(0, h);
  ctx.closePath();
  ctx.fill();

  // Pine silhouettes in background
  drawStylizedPineTree(ctx, 165, h * 0.80, 95, 165, '#193C56', '#E5F2FB');
  drawStylizedPineTree(ctx, 250, h * 0.81, 70, 120, '#224C6B', '#E5F2FB');
  drawStylizedPineTree(ctx, 975, h * 0.81, 105, 180, '#193C56', '#E5F2FB');
  drawStylizedPineTree(ctx, 1065, h * 0.82, 75, 130, '#224C6B', '#E5F2FB');

  // Cozy Cabin center-bottom
  const cx = 600;
  const cy = h * 0.83;
  // Chimney
  ctx.fillStyle = '#4A312C';
  ctx.fillRect(cx + 34, cy - 110, 22, 48);
  // Smoke curls
  ctx.fillStyle = 'rgba(255,255,255,0.4)';
  ctx.beginPath();
  ctx.arc(cx + 46, cy - 126, 9, 0, Math.PI * 2);
  ctx.arc(cx + 55, cy - 144, 13, 0, Math.PI * 2);
  ctx.arc(cx + 68, cy - 166, 16, 0, Math.PI * 2);
  ctx.fill();

  // Cabin walls
  ctx.fillStyle = '#5B3A29';
  ctx.fillRect(cx - 72, cy - 58, 144, 62);
  // Roof
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.moveTo(cx - 90, cy - 54);
  ctx.lineTo(cx, cy - 115);
  ctx.lineTo(cx + 90, cy - 54);
  ctx.closePath();
  ctx.fill();

  // Glowing windows
  ctx.fillStyle = '#FFCA64';
  ctx.fillRect(cx - 48, cy - 42, 26, 26);
  ctx.fillRect(cx + 22, cy - 42, 26, 26);
  ctx.fillStyle = '#7A2729';
  ctx.fillRect(cx - 11, cy - 38, 22, 42);
  ctx.restore();
}

function tracePhotoSlotPath(
  ctx: CanvasRenderingContext2D,
  slot: PhotoSlotConfig,
  inset = 0
): void {
  const width = Math.max(20, slot.width - inset * 2);
  const height = Math.max(20, slot.height - inset * 2);
  const { x, y, shape } = slot;
  const left = x - width / 2;
  const top = y - height / 2;

  ctx.beginPath();
  if (shape === 'circle') {
    const r = Math.min(width, height) / 2;
    ctx.arc(x, y, r, 0, Math.PI * 2);
  } else if (shape === 'arch') {
    const r = width / 2;
    ctx.moveTo(left, top + height);
    ctx.lineTo(left, top + r);
    ctx.arc(x, top + r, r, Math.PI, 0, false);
    ctx.lineTo(left + width, top + height);
    ctx.closePath();
  } else if (shape === 'polaroid') {
    ctx.rect(left, top, width, height);
  } else {
    ctx.roundRect(left, top, width, height, Math.max(8, 22 - inset));
  }
}

export function drawPhotoInSlot(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  slot: PhotoSlotConfig,
  photo: PhotoSettings,
  caption?: string,
  captionColor = '#2A2018'
): void {
  const { x, y, width, height, shape, borderColor } = slot;
  const left = x - width / 2;
  const top = y - height / 2;

  ctx.save();

  // Polaroid card backdrop if polaroid
  if (shape === 'polaroid') {
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.28)';
    ctx.shadowBlur = 24;
    ctx.shadowOffsetY = 10;
    ctx.fillStyle = '#FBF7F0';
    ctx.beginPath();
    ctx.roundRect(left - 20, top - 20, width + 40, height + 74, 8);
    ctx.fill();
    ctx.restore();
  }

  tracePhotoSlotPath(ctx, slot);

  ctx.save();
  ctx.clip();

  // Aspect-ratio-preserving cover draw + zoom + pan
  const imgRatio = img.naturalWidth / img.naturalHeight;
  const slotRatio = width / height;
  let drawW = width;
  let drawH = height;
  if (imgRatio > slotRatio) {
    drawH = height;
    drawW = height * imgRatio;
  } else {
    drawW = width;
    drawH = width / imgRatio;
  }

  drawW *= photo.zoom;
  drawH *= photo.zoom;

  const dx = x - drawW / 2 + (photo.offsetX / 100) * width * 0.45;
  const dy = y - drawH / 2 + (photo.offsetY / 100) * height * 0.45;

  ctx.drawImage(img, dx, dy, drawW, drawH);
  ctx.restore();

  // Frame border
  if (shape !== 'polaroid') {
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 5;
    ctx.stroke();
  } else if (caption && caption.trim()) {
    ctx.fillStyle = captionColor;
    ctx.font = 'italic 26px "Playfair Display", Georgia, serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(caption.trim(), x, top + height + 28, width);
  }

  ctx.restore();
}

export function drawPhotoPlaceholderInSlot(
  ctx: CanvasRenderingContext2D,
  slot: PhotoSlotConfig,
  isDarkBackdrop: boolean,
  caption?: string,
  captionColor = '#2A2018',
  customLabel?: string
): void {
  const { x, y, width, height, shape, borderColor } = slot;
  const left = x - width / 2;
  const top = y - height / 2;
  const minDim = Math.min(width, height);

  ctx.save();

  // Polaroid card backdrop if polaroid
  if (shape === 'polaroid') {
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.28)';
    ctx.shadowBlur = 24;
    ctx.shadowOffsetY = 10;
    ctx.fillStyle = '#FBF7F0';
    ctx.beginPath();
    ctx.roundRect(left - 20, top - 20, width + 40, height + 74, 8);
    ctx.fill();
    ctx.restore();
  }

  // Clipped inner placeholder surface
  tracePhotoSlotPath(ctx, slot);
  ctx.save();
  ctx.clip();

  const effectiveDark = shape === 'polaroid' ? false : isDarkBackdrop;

  const bgGrad = ctx.createLinearGradient(left, top, left + width, top + height);
  if (effectiveDark) {
    bgGrad.addColorStop(0, 'rgba(19, 44, 62, 0.92)');
    bgGrad.addColorStop(1, 'rgba(10, 25, 38, 0.96)');
  } else {
    bgGrad.addColorStop(0, '#F1E8D8');
    bgGrad.addColorStop(1, '#E3D4BC');
  }
  ctx.fillStyle = bgGrad;
  ctx.fillRect(left, top, width, height);

  // Subtle scenic pine hills silhouette near bottom of frame to suggest portrait framing
  ctx.fillStyle = effectiveDark
    ? 'rgba(216, 181, 109, 0.11)'
    : 'rgba(139, 106, 62, 0.12)';
  ctx.beginPath();
  ctx.moveTo(left, top + height * 0.78);
  ctx.quadraticCurveTo(
    left + width * 0.28,
    top + height * 0.63,
    left + width * 0.56,
    top + height * 0.76
  );
  ctx.quadraticCurveTo(
    left + width * 0.82,
    top + height * 0.86,
    left + width,
    top + height * 0.72
  );
  ctx.lineTo(left + width, top + height);
  ctx.lineTo(left, top + height);
  ctx.closePath();
  ctx.fill();

  // Soft decorative pine accents inside larger photo slots
  if (minDim >= 260) {
    drawFourPointStar(
      ctx,
      x - width * 0.28,
      top + height * 0.2,
      10,
      3.5,
      effectiveDark ? '#E3C172' : '#A97C3A',
      0.45
    );
    drawFourPointStar(
      ctx,
      x + width * 0.28,
      top + height * 0.22,
      8,
      3,
      effectiveDark ? '#E3C172' : '#A97C3A',
      0.38
    );
  }

  // Inner dashed frame inset
  tracePhotoSlotPath(ctx, slot, Math.max(9, Math.round(minDim * 0.055)));
  ctx.strokeStyle = effectiveDark
    ? 'rgba(227, 193, 114, 0.58)'
    : 'rgba(110, 82, 54, 0.45)';
  ctx.lineWidth = 2;
  ctx.setLineDash([7, 5]);
  ctx.stroke();
  ctx.setLineDash([]);

  // Center camera / photo emblem
  const iconColor = effectiveDark ? '#E8C97A' : '#6A3F2B';
  const labelColor = effectiveDark ? '#F8F1E5' : '#3B281B';
  const badgeR = Math.max(22, Math.min(36, Math.round(minDim * 0.155)));
  const badgeY = y - Math.round(minDim * 0.075);

  ctx.fillStyle = effectiveDark
    ? 'rgba(216, 181, 109, 0.16)'
    : 'rgba(139, 98, 62, 0.12)';
  ctx.beginPath();
  ctx.arc(x, badgeY, badgeR, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = effectiveDark
    ? 'rgba(227, 193, 114, 0.55)'
    : 'rgba(106, 63, 43, 0.35)';
  ctx.lineWidth = 1.6;
  ctx.stroke();

  // Crisp vector camera icon inside badge
  const camW = badgeR * 1.05;
  const camH = badgeR * 0.74;
  ctx.save();
  ctx.translate(x, badgeY + 1);
  ctx.strokeStyle = iconColor;
  ctx.fillStyle = iconColor;
  ctx.lineWidth = Math.max(2, badgeR * 0.09);
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  // Camera body
  ctx.beginPath();
  ctx.roundRect(-camW / 2, -camH / 2, camW, camH, 4);
  ctx.stroke();

  // Top viewfinder bump
  ctx.beginPath();
  ctx.roundRect(-camW * 0.22, -camH / 2 - camH * 0.22, camW * 0.44, camH * 0.24, 2);
  ctx.fill();

  // Lens circle
  ctx.beginPath();
  ctx.arc(0, 0, camH * 0.26, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // Label below emblem
  const label =
    customLabel ||
    (width >= 260 ? 'ADD YOUR PHOTO' : 'ADD PHOTO');
  const fontSize = Math.max(12, Math.min(18, Math.round(minDim * 0.078)));
  ctx.fillStyle = labelColor;
  ctx.font = `700 ${fontSize}px "DM Sans", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  if ('letterSpacing' in ctx) {
    (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing =
      '1.5px';
  }
  ctx.fillText(label, x, badgeY + badgeR + fontSize * 1.12, width - 26);
  ctx.restore();

  // Outer frame border (or Polaroid caption)
  if (shape !== 'polaroid') {
    tracePhotoSlotPath(ctx, slot);
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 4.5;
    ctx.stroke();
  } else {
    const capText = caption?.trim() || 'Your Family Photo';
    ctx.fillStyle = captionColor;
    ctx.font = 'italic 25px "Playfair Display", Georgia, serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(capText, x, top + height + 28, width);
  }

  ctx.restore();
}
