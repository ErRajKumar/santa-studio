import {
  CardCategory,
  CardDraftState,
} from '../types/card';
import {
  DEFAULT_GIFT_TAG_DATA,
  DEFAULT_MENU_DATA,
  DEFAULT_PLACE_CARD_DATA,
  DEFAULT_THANK_YOU_DATA,
} from '../templates/stationeryData';
import {
  DEFAULT_DESIGN_OVERRIDES,
  DEFAULT_INVITATION_DATA,
  DEFAULT_PHOTO_SETTINGS,
  DEFAULT_WISHES_DATA,
  getTemplateById,
} from '../templates/templatesData';

const DRAFT_STORAGE_KEY = 'santa_studio_draft_v1';

export function createInitialDraft(
  category: CardCategory,
  templateId: string
): CardDraftState {
  const tpl = getTemplateById(templateId);
  return {
    category: tpl.category,
    templateId: tpl.id,
    invitation: {
      ...DEFAULT_INVITATION_DATA,
      eventTitle: tpl.defaultEventTitle || DEFAULT_INVITATION_DATA.eventTitle,
      eventSubtitle: tpl.defaultSubtitle || DEFAULT_INVITATION_DATA.eventSubtitle,
    },
    wishes: {
      ...DEFAULT_WISHES_DATA,
      greetingHeadline:
        tpl.category === 'wishes'
          ? tpl.defaultHeadline
          : DEFAULT_WISHES_DATA.greetingHeadline,
    },
    menu: {
      ...DEFAULT_MENU_DATA,
    },
    placeCard: {
      ...DEFAULT_PLACE_CARD_DATA,
    },
    giftTag: {
      ...DEFAULT_GIFT_TAG_DATA,
      headline:
        tpl.category === 'gift-tag'
          ? tpl.defaultHeadline
          : DEFAULT_GIFT_TAG_DATA.headline,
    },
    thankYou: {
      ...DEFAULT_THANK_YOU_DATA,
      headline:
        tpl.category === 'thank-you'
          ? tpl.defaultHeadline
          : DEFAULT_THANK_YOU_DATA.headline,
    },
    photo: { ...DEFAULT_PHOTO_SETTINGS },
    design: { ...DEFAULT_DESIGN_OVERRIDES },
  };
}

export function saveDraftToLocalStorage(draft: CardDraftState): boolean {
  try {
    const serialized = JSON.stringify(draft);
    localStorage.setItem(DRAFT_STORAGE_KEY, serialized);
    return true;
  } catch {
    try {
      const textOnly: CardDraftState = {
        ...draft,
        photo: { ...DEFAULT_PHOTO_SETTINGS },
      };
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(textOnly));
      return true;
    } catch {
      return false;
    }
  }
}

export function loadDraftFromLocalStorage(): Partial<CardDraftState> | null {
  try {
    const raw = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Partial<CardDraftState>;
  } catch {
    return null;
  }
}

export function clearDraftFromLocalStorage(): void {
  try {
    localStorage.removeItem(DRAFT_STORAGE_KEY);
  } catch {
    // Ignore storage access errors
  }
}

export function applyLibraryMessageToDraftStorage(
  messageText: string,
  targetType: 'wishes' | 'invitation'
): string {
  const targetTemplate =
    targetType === 'invitation' ? 'invitation-01' : 'wishes-01';
  const existing = loadDraftFromLocalStorage();
  const base = createInitialDraft(targetType, targetTemplate);

  const next: CardDraftState = {
    ...base,
    invitation: existing?.invitation
      ? { ...base.invitation, ...existing.invitation }
      : base.invitation,
    wishes: existing?.wishes
      ? { ...base.wishes, ...existing.wishes }
      : base.wishes,
    menu: existing?.menu ? { ...base.menu, ...existing.menu } : base.menu,
    placeCard: existing?.placeCard
      ? { ...base.placeCard, ...existing.placeCard }
      : base.placeCard,
    giftTag: existing?.giftTag
      ? { ...base.giftTag, ...existing.giftTag }
      : base.giftTag,
    thankYou: existing?.thankYou
      ? { ...base.thankYou, ...existing.thankYou }
      : base.thankYou,
    photo: existing?.photo ? { ...base.photo, ...existing.photo } : base.photo,
  };

  if (targetType === 'invitation') {
    next.invitation.personalMessage = messageText;
  } else {
    next.wishes.mainMessage = messageText;
  }

  saveDraftToLocalStorage(next);
  return `./editor.html?type=${targetType}&template=${targetTemplate}`;
}

export function sanitizeFilenameSegment(input: string): string {
  const cleaned = input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return cleaned || 'design';
}

export function buildCardDownloadFilename(
  category: CardCategory,
  personName: string,
  ext: 'png' | 'pdf' = 'png'
): string {
  const slug = sanitizeFilenameSegment(personName);
  const prefixMap: Record<CardCategory, string> = {
    invitation: 'christmas-invitation',
    wishes: 'christmas-wishes',
    menu: 'christmas-menu',
    'place-card': 'christmas-place-card',
    'gift-tag': 'christmas-gift-tag',
    'thank-you': 'christmas-thank-you',
  };
  return `${prefixMap[category]}-${slug}.${ext}`;
}

export function formatFileSize(bytes: number): string {
  if (bytes <= 0) return '0 KB';
  if (bytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const ACCEPTED_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
]);

const MAX_PHOTO_BYTES = 10 * 1024 * 1024;

export async function processUploadedPhotoFile(
  file: File
): Promise<{ dataUrl: string; fileName: string; fileSize: number }> {
  const ext = file.name.split('.').pop()?.toLowerCase() || '';
  const validExt = ['jpg', 'jpeg', 'png', 'webp'].includes(ext);

  if (!ACCEPTED_TYPES.has(file.type) && !validExt) {
    throw new Error(
      'Please choose a JPG, JPEG, PNG, or WebP photograph.'
    );
  }

  if (file.size > MAX_PHOTO_BYTES) {
    throw new Error(
      `This file is ${formatFileSize(file.size)}. Please choose a photo under 10 MB.`
    );
  }

  const rawDataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') resolve(reader.result);
      else reject(new Error('Could not read the selected image.'));
    };
    reader.onerror = () => reject(new Error('Could not read the selected image.'));
    reader.readAsDataURL(file);
  });

  const optimized = await new Promise<string>((resolve) => {
    const img = new Image();
    img.onload = () => {
      const maxDim = 2000;
      if (img.naturalWidth <= maxDim && img.naturalHeight <= maxDim) {
        resolve(rawDataUrl);
        return;
      }
      const scale = Math.min(maxDim / img.naturalWidth, maxDim / img.naturalHeight);
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.naturalWidth * scale);
      canvas.height = Math.round(img.naturalHeight * scale);
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(rawDataUrl);
        return;
      }
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const out = canvas.toDataURL('image/jpeg', 0.92);
      canvas.width = 0;
      canvas.height = 0;
      resolve(out);
    };
    img.onerror = () => resolve(rawDataUrl);
    img.src = rawDataUrl;
  });

  return {
    dataUrl: optimized,
    fileName: file.name,
    fileSize: file.size,
  };
}
