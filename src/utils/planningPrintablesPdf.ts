import { jsPDF } from 'jspdf';
import JSZip from 'jszip';
import { triggerBlobDownload } from './exportZip';

export type PrintablePaperSize = 'letter' | 'a4';

export type PrintableKitId =
  | 'guest-list'
  | 'rsvp-tracker'
  | 'prep-checklist'
  | 'shopping-list'
  | 'budget-planner';

export interface PrintableKitItem {
  id: PrintableKitId;
  title: string;
  subtitle: string;
  description: string;
}

export const PARTY_PLANNING_PRINTABLES: PrintableKitItem[] = [
  {
    id: 'guest-list',
    title: 'Guest List Tracker',
    subtitle: 'Names · Party Size · Dietary Notes · Invite Status',
    description:
      'Keep every invitee, contact detail, allergy note, and confirmation checkbox organised on one clean sheet.',
  },
  {
    id: 'rsvp-tracker',
    title: 'RSVP Tracker',
    subtitle: 'Attending · Headcount · Dish Contributions',
    description:
      'Track confirmed yes/no responses, adult and child headcounts, plus potluck or drink contributions.',
  },
  {
    id: 'prep-checklist',
    title: 'Christmas Party Preparation Checklist',
    subtitle: '4 Weeks Out → Christmas Day Timeline',
    description:
      'A calm, step-by-step countdown covering invitations, menu planning, décor, table setting, and hosting day prep.',
  },
  {
    id: 'shopping-list',
    title: 'Christmas Shopping List',
    subtitle: 'Groceries · Bakery · Drinks · Décor & Wrapping',
    description:
      'Structured into clear store sections with quantity lines and check-off boxes for effortless holiday shopping.',
  },
  {
    id: 'budget-planner',
    title: 'Party Budget Planner',
    subtitle: 'Planned vs Actual Costs · Payment Tracker',
    description:
      'Monitor spending across food, beverages, décor, stationery, and gifts with an easy summary tally.',
  },
];

function getPageIn(paper: PrintablePaperSize): {
  w: number;
  h: number;
  label: string;
} {
  return paper === 'letter'
    ? { w: 8.5, h: 11, label: 'US Letter' }
    : { w: 8.2677, h: 11.6929, label: 'A4' };
}

function drawPrintableChrome(
  doc: jsPDF,
  w: number,
  h: number,
  title: string,
  subtitle: string,
  paperLabel: string
): number {
  const m = 0.55;

  // Warm cream top header band with evergreen & gold accents
  doc.setFillColor(20, 59, 44); // #143B2C evergreen
  doc.rect(m, m, w - m * 2, 1.02, 'F');

  // Gold hairline inside header
  doc.setDrawColor(216, 181, 109);
  doc.setLineWidth(0.014);
  doc.rect(m + 0.06, m + 0.06, w - m * 2 - 0.12, 1.02 - 0.12);

  doc.setTextColor(216, 181, 109);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('SANTA STUDIO  ·  CHRISTMAS PARTY PLANNING KIT', w / 2, m + 0.28, {
    align: 'center',
  });

  doc.setTextColor(248, 241, 229);
  doc.setFont('times', 'bold');
  doc.setFontSize(20);
  doc.text(title, w / 2, m + 0.62, { align: 'center' });

  doc.setTextColor(215, 228, 220);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(subtitle, w / 2, m + 0.86, { align: 'center' });

  // Outer subtle border frame
  doc.setDrawColor(205, 195, 175);
  doc.setLineWidth(0.01);
  doc.rect(m, m, w - m * 2, h - m * 2);

  // Quiet footer
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.text(
    `Santa Studio · Printable ${paperLabel} Edition · Fill in by hand`,
    w / 2,
    h - 0.34,
    { align: 'center' }
  );

  return m + 1.24; // startY for body content
}

function drawCheckbox(doc: jsPDF, x: number, y: number, size = 0.13): void {
  doc.setDrawColor(20, 59, 44);
  doc.setLineWidth(0.01);
  doc.rect(x, y, size, size);
}

function buildGuestListPdf(doc: jsPDF, w: number, h: number, label: string): void {
  const m = 0.55;
  let y = drawPrintableChrome(
    doc,
    w,
    h,
    'Christmas Guest List Tracker',
    'Organise invitees, party sizes, contact details & dietary preferences',
    label
  );

  // Event header fields
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(20, 59, 44);
  doc.text('Event / Date:', m + 0.15, y);
  doc.setDrawColor(180, 170, 152);
  doc.line(m + 1.05, y + 0.03, w / 2 - 0.15, y + 0.03);
  doc.text('Total Invited:', w / 2 + 0.1, y);
  doc.line(w / 2 + 1.0, y + 0.03, w - m - 0.15, y + 0.03);
  y += 0.32;

  const cols = [
    { label: 'Guest / Household Name', ratio: 0.28 },
    { label: 'Guests', ratio: 0.08 },
    { label: 'Phone or Email', ratio: 0.25 },
    { label: 'Dietary / Notes', ratio: 0.23 },
    { label: 'Sent', ratio: 0.08 },
    { label: 'RSVP', ratio: 0.08 },
  ];
  const tableW = w - m * 2 - 0.24;
  const startX = m + 0.12;
  const headerH = 0.34;
  const rowH = 0.44;

  // Table header
  doc.setFillColor(242, 234, 218);
  doc.rect(startX, y, tableW, headerH, 'F');
  doc.setDrawColor(20, 59, 44);
  doc.setLineWidth(0.01);
  doc.rect(startX, y, tableW, headerH);

  let cx = startX;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(20, 59, 44);
  cols.forEach((col, i) => {
    const cw = tableW * col.ratio;
    doc.text(col.label, cx + cw / 2, y + 0.21, { align: 'center' });
    if (i > 0) doc.line(cx, y, cx, y + headerH);
    cx += cw;
  });
  y += headerH;

  const rowCount = 17;
  for (let r = 0; r < rowCount; r++) {
    if (r % 2 === 1) {
      doc.setFillColor(251, 249, 244);
      doc.rect(startX, y, tableW, rowH, 'F');
    }
    doc.setDrawColor(210, 202, 188);
    doc.rect(startX, y, tableW, rowH);

    let rx = startX;
    cols.forEach((col, i) => {
      const cw = tableW * col.ratio;
      if (i > 0) doc.line(rx, y, rx, y + rowH);
      if (col.label === 'Sent' || col.label === 'RSVP') {
        drawCheckbox(doc, rx + cw / 2 - 0.065, y + rowH / 2 - 0.065);
      }
      rx += cw;
    });
    y += rowH;
  }
}

function buildRsvpTrackerPdf(doc: jsPDF, w: number, h: number, label: string): void {
  const m = 0.55;
  let y = drawPrintableChrome(
    doc,
    w,
    h,
    'Christmas RSVP Tracker',
    'Monitor confirmed guests, children count & dish contributions',
    label
  );

  // Summary counters bar
  const boxW = w - m * 2 - 0.24;
  const startX = m + 0.12;
  doc.setFillColor(248, 243, 232);
  doc.setDrawColor(216, 181, 109);
  doc.rect(startX, y, boxW, 0.48, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(20, 59, 44);
  const summaryLabels = ['RSVP Deadline:', 'Confirmed Yes:', 'Declined:', 'Total Headcount:'];
  summaryLabels.forEach((lbl, idx) => {
    const sx = startX + 0.14 + idx * (boxW / 4);
    doc.text(lbl, sx, y + 0.29);
  });
  y += 0.64;

  const cols = [
    { label: 'Guest Name', ratio: 0.26 },
    { label: 'Attending', ratio: 0.16 },
    { label: 'Adults', ratio: 0.09 },
    { label: 'Kids', ratio: 0.09 },
    { label: 'Dish / Contribution / Notes', ratio: 0.40 },
  ];
  const headerH = 0.34;
  const rowH = 0.43;

  doc.setFillColor(242, 234, 218);
  doc.rect(startX, y, boxW, headerH, 'F');
  doc.setDrawColor(20, 59, 44);
  doc.rect(startX, y, boxW, headerH);

  let cx = startX;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  cols.forEach((col, i) => {
    const cw = boxW * col.ratio;
    doc.text(col.label, cx + cw / 2, y + 0.21, { align: 'center' });
    if (i > 0) doc.line(cx, y, cx, y + headerH);
    cx += cw;
  });
  y += headerH;

  for (let r = 0; r < 16; r++) {
    if (r % 2 === 1) {
      doc.setFillColor(251, 249, 244);
      doc.rect(startX, y, boxW, rowH, 'F');
    }
    doc.setDrawColor(210, 202, 188);
    doc.rect(startX, y, boxW, rowH);

    let rx = startX;
    cols.forEach((col, i) => {
      const cw = boxW * col.ratio;
      if (i > 0) doc.line(rx, y, rx, y + rowH);
      if (col.label === 'Attending') {
        drawCheckbox(doc, rx + 0.14, y + rowH / 2 - 0.06, 0.12);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(70, 70, 70);
        doc.text('Yes', rx + 0.30, y + rowH / 2 + 0.04);

        drawCheckbox(doc, rx + cw / 2 + 0.05, y + rowH / 2 - 0.06, 0.12);
        doc.text('No', rx + cw / 2 + 0.21, y + rowH / 2 + 0.04);
      }
      rx += cw;
    });
    y += rowH;
  }
}

function buildPrepChecklistPdf(doc: jsPDF, w: number, h: number, label: string): void {
  const m = 0.55;
  const startX = m + 0.14;
  const innerW = w - m * 2 - 0.28;
  let y = drawPrintableChrome(
    doc,
    w,
    h,
    'Christmas Party Preparation Checklist',
    'Calm countdown timeline from four weeks ahead through celebration day',
    label
  );

  const phases: { title: string; tasks: string[] }[] = [
    {
      title: '4 Weeks Before',
      tasks: [
        'Choose theme, date, time, and guest list',
        'Design and send personalised Santa Studio invitations',
        'Set party budget and reserve catering or venue items',
      ],
    },
    {
      title: '2 Weeks Before',
      tasks: [
        'Follow up on pending RSVPs and note dietary needs',
        'Finalise Christmas dinner menu and drinks list',
        'Order or craft matching menus, place cards, and gift tags',
      ],
    },
    {
      title: '1 Week Before',
      tasks: [
        'Shop for non-perishables, beverages, napkins, and candles',
        'Print menus, place cards, and favour tags on cardstock',
        'Prepare Christmas playlist and test lighting',
      ],
    },
    {
      title: '1–2 Days Before',
      tasks: [
        'Shop for fresh produce, herbs, bakery items, and ice',
        'Set the dining table with place cards and centrepiece',
        'Pre-prep desserts, marinades, and chill beverages',
      ],
    },
    {
      title: 'Celebration Day',
      tasks: [
        'Light candles, put on festive music, and warm starters',
        'Greet guests at the door with a welcome drink',
        'Enjoy the evening—capture a few candid family photos!',
      ],
    },
  ];

  phases.forEach((phase) => {
    doc.setFillColor(242, 234, 218);
    doc.rect(startX, y, innerW, 0.28, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(169, 35, 50); // Christmas crimson
    doc.text(phase.title.toUpperCase(), startX + 0.1, y + 0.19);
    y += 0.36;

    phase.tasks.forEach((task) => {
      drawCheckbox(doc, startX + 0.08, y - 0.11, 0.13);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(35, 35, 35);
      doc.text(task, startX + 0.3, y);
      y += 0.29;
    });

    // One blank custom task line per phase
    drawCheckbox(doc, startX + 0.08, y - 0.11, 0.13);
    doc.setDrawColor(195, 185, 168);
    doc.line(startX + 0.3, y + 0.02, startX + innerW - 0.1, y + 0.02);
    y += 0.38;
  });
}

function buildShoppingListPdf(doc: jsPDF, w: number, h: number, label: string): void {
  const m = 0.55;
  const startX = m + 0.14;
  const innerW = w - m * 2 - 0.28;
  let y = drawPrintableChrome(
    doc,
    w,
    h,
    'Christmas Shopping List',
    'Organised by aisle & category so nothing is forgotten',
    label
  );

  const categories = [
    'Mains, Roast & Deli',
    'Fresh Produce & Herbs',
    'Bakery, Dairy & Pantry',
    'Beverages, Wine & Mixers',
    'Tableware, Candles & Décor',
    'Gifts, Cards & Wrapping',
  ];

  const colGap = 0.28;
  const colW = (innerW - colGap) / 2;
  const rowsPerBox = 7;

  for (let i = 0; i < categories.length; i += 2) {
    const leftCat = categories[i];
    const rightCat = categories[i + 1];
    const boxY = y;

    [
      { title: leftCat, x: startX },
      { title: rightCat, x: startX + colW + colGap },
    ].forEach((col) => {
      doc.setFillColor(20, 59, 44);
      doc.rect(col.x, boxY, colW, 0.29, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(248, 241, 229);
      doc.text(col.title, col.x + 0.1, boxY + 0.2);

      let ly = boxY + 0.52;
      for (let r = 0; r < rowsPerBox; r++) {
        drawCheckbox(doc, col.x + 0.06, ly - 0.11, 0.12);
        doc.setDrawColor(205, 198, 184);
        doc.line(col.x + 0.25, ly + 0.02, col.x + colW - 0.55, ly + 0.02);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(145, 145, 145);
        doc.text('Qty:', col.x + colW - 0.48, ly);
        doc.line(col.x + colW - 0.26, ly + 0.02, col.x + colW - 0.04, ly + 0.02);
        ly += 0.34;
      }

      doc.setDrawColor(210, 200, 182);
      doc.rect(col.x, boxY, colW, 0.32 + rowsPerBox * 0.34);
    });

    y += 0.32 + rowsPerBox * 0.34 + 0.22;
  }
}

function buildBudgetPlannerPdf(doc: jsPDF, w: number, h: number, label: string): void {
  const m = 0.55;
  const startX = m + 0.12;
  const boxW = w - m * 2 - 0.24;
  let y = drawPrintableChrome(
    doc,
    w,
    h,
    'Christmas Party Budget Planner',
    'Track planned estimates, actual receipts & payment status',
    label
  );

  // Summary box
  doc.setFillColor(248, 243, 232);
  doc.setDrawColor(216, 181, 109);
  doc.rect(startX, y, boxW, 0.52, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(20, 59, 44);
  ['Total Budget:', 'Total Spent:', 'Remaining:'].forEach((lbl, idx) => {
    doc.text(lbl, startX + 0.16 + idx * (boxW / 3), y + 0.31);
  });
  y += 0.7;

  const cols = [
    { label: 'Expense Category / Item', ratio: 0.34 },
    { label: 'Store / Vendor', ratio: 0.21 },
    { label: 'Estimated', ratio: 0.13 },
    { label: 'Actual', ratio: 0.13 },
    { label: 'Diff (+/-)', ratio: 0.11 },
    { label: 'Paid', ratio: 0.08 },
  ];
  const headerH = 0.34;
  const rowH = 0.42;

  doc.setFillColor(242, 234, 218);
  doc.rect(startX, y, boxW, headerH, 'F');
  doc.setDrawColor(20, 59, 44);
  doc.rect(startX, y, boxW, headerH);

  let cx = startX;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  cols.forEach((col, i) => {
    const cw = boxW * col.ratio;
    doc.text(col.label, cx + cw / 2, y + 0.21, { align: 'center' });
    if (i > 0) doc.line(cx, y, cx, y + headerH);
    cx += cw;
  });
  y += headerH;

  const presets = [
    'Main Course & Poultry / Roast',
    'Appetisers, Sides & Salads',
    'Desserts & Christmas Baking',
    'Wine, Cocktails & Soft Drinks',
    'Invitations, Menus & Printing',
    'Tree, Wreath & Table Décor',
    'Candles, Napkins & Tableware',
    'Host Gifts & Party Favours',
    'Entertainment / Music / Games',
    '',
    '',
    '',
    '',
    '',
    '',
    'GRAND TOTAL',
  ];

  presets.forEach((preset, r) => {
    const isTotal = preset === 'GRAND TOTAL';
    if (isTotal) {
      doc.setFillColor(242, 234, 218);
      doc.rect(startX, y, boxW, rowH, 'F');
    } else if (r % 2 === 1) {
      doc.setFillColor(251, 249, 244);
      doc.rect(startX, y, boxW, rowH, 'F');
    }

    doc.setDrawColor(210, 202, 188);
    doc.rect(startX, y, boxW, rowH);

    let rx = startX;
    cols.forEach((col, i) => {
      const cw = boxW * col.ratio;
      if (i > 0) doc.line(rx, y, rx, y + rowH);
      if (i === 0 && preset) {
        doc.setFont('helvetica', isTotal ? 'bold' : 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(isTotal ? 20 : 45, isTotal ? 59 : 45, isTotal ? 44 : 45);
        doc.text(preset, rx + 0.1, y + 0.25);
      }
      if (col.label === 'Paid' && !isTotal) {
        drawCheckbox(doc, rx + cw / 2 - 0.06, y + rowH / 2 - 0.06, 0.12);
      }
      rx += cw;
    });
    y += rowH;
  });
}

export function createPlanningPrintableBlob(
  id: PrintableKitId,
  paper: PrintablePaperSize
): { blob: Blob; filename: string } {
  const dim = getPageIn(paper);
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'in',
    format: [dim.w, dim.h],
    compress: true,
  });

  switch (id) {
    case 'guest-list':
      buildGuestListPdf(doc, dim.w, dim.h, dim.label);
      break;
    case 'rsvp-tracker':
      buildRsvpTrackerPdf(doc, dim.w, dim.h, dim.label);
      break;
    case 'prep-checklist':
      buildPrepChecklistPdf(doc, dim.w, dim.h, dim.label);
      break;
    case 'shopping-list':
      buildShoppingListPdf(doc, dim.w, dim.h, dim.label);
      break;
    case 'budget-planner':
      buildBudgetPlannerPdf(doc, dim.w, dim.h, dim.label);
      break;
  }

  return {
    blob: doc.output('blob'),
    filename: `santa-studio-${id}-${paper}.pdf`,
  };
}

export function downloadPlanningPrintable(
  id: PrintableKitId,
  paper: PrintablePaperSize
): string {
  const { blob, filename } = createPlanningPrintableBlob(id, paper);
  triggerBlobDownload(blob, filename);
  return filename;
}

export async function downloadAllPlanningPrintablesZip(
  paper: PrintablePaperSize
): Promise<string> {
  const zip = new JSZip();
  for (const item of PARTY_PLANNING_PRINTABLES) {
    const { blob, filename } = createPlanningPrintableBlob(item.id, paper);
    zip.file(filename, blob);
  }
  const zipBlob = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  });
  const zipName = `santa-studio-party-planning-kit-${paper}.zip`;
  triggerBlobDownload(zipBlob, zipName);
  return zipName;
}
