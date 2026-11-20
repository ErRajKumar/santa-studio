export type CardCategory =
  | 'invitation'
  | 'wishes'
  | 'menu'
  | 'place-card'
  | 'gift-tag'
  | 'thank-you';

export type FontChoice =
  | 'auto'
  | 'playfair'
  | 'cormorant'
  | 'dm-sans'
  | 'great-vibes'
  | 'oswald';

export type TextAlignChoice = 'auto' | 'left' | 'center' | 'right';

export interface InvitationData {
  eventTitle: string;
  eventSubtitle: string;
  hostName: string;
  eventDate: string;
  eventStartTime: string;
  eventEndTime: string;
  venueName: string;
  fullAddress: string;
  rsvpContact: string;
  rsvpDeadline: string;
  guestName: string;
  personalMessage: string;
  dressCode: string;
  additionalInfo: string;
  websiteLink: string;
}

export interface WishesData {
  recipientName: string;
  greetingHeadline: string;
  mainMessage: string;
  senderName: string;
  familyOrCompany: string;
  additionalMessage: string;
  photoCaption: string;
}

export interface MenuData {
  menuTitle: string;
  subtitle: string;
  starters: string;
  mains: string;
  sides: string;
  desserts: string;
  drinks: string;
  footerNote: string;
}

export interface PlaceCardData {
  guestName: string;
  tableOrRole: string;
  eventLabel: string;
}

export interface GiftTagData {
  headline: string;
  toName: string;
  fromName: string;
  shortNote: string;
}

export interface ThankYouData {
  headline: string;
  recipientName: string;
  message: string;
  senderName: string;
  footerNote: string;
}

export interface PhotoSettings {
  dataUrl: string | null;
  fileName: string;
  fileSize: number;
  zoom: number;
  offsetX: number;
  offsetY: number;
}

export interface DesignOverrides {
  fontFamily: FontChoice;
  textColor: string;
  backgroundColor: string;
  textAlign: TextAlignChoice;
}

export interface CardDraftState {
  category: CardCategory;
  templateId: string;
  invitation: InvitationData;
  wishes: WishesData;
  menu: MenuData;
  placeCard: PlaceCardData;
  giftTag: GiftTagData;
  thankYou: ThankYouData;
  photo: PhotoSettings;
  design: DesignOverrides;
}

export interface TemplatePalette {
  background: string;
  secondaryBackground: string;
  accent: string;
  primaryText: string;
  secondaryText: string;
  mutedText: string;
  borderColor: string;
}

export interface PhotoSlotConfig {
  shape: 'circle' | 'arch' | 'rounded' | 'polaroid';
  x: number;
  y: number;
  width: number;
  height: number;
  borderColor: string;
}

export type GiftTagShape =
  | 'clipped-rect'
  | 'arch'
  | 'scalloped'
  | 'circle'
  | 'shield';

export type StationeryFormat =
  | 'menu-emerald'
  | 'menu-classic'
  | 'menu-woodland'
  | 'menu-midnight'
  | 'menu-nordic'
  | 'place-tent'
  | 'tag-diecut'
  | 'thankyou-folded'
  | 'thankyou-postcard'
  | 'thankyou-photo'
  | 'thankyou-minimal'
  | 'thankyou-illustrated';

export interface TemplateConfig {
  id: string;
  category: CardCategory;
  name: string;
  styleLabel: string;
  description: string;
  defaultHeadline: string;
  defaultEventTitle?: string;
  defaultSubtitle?: string;
  supportsCustomBackground: boolean;
  supportsCustomAlignment: boolean;
  defaultAlign: 'left' | 'center' | 'right';
  headingFont: Exclude<FontChoice, 'auto'>;
  bodyFont: Exclude<FontChoice, 'auto'>;
  accentFont: Exclude<FontChoice, 'auto'>;
  palette: TemplatePalette;
  backgroundSwatches: string[];
  textColorSwatches: string[];
  photoSlot: PhotoSlotConfig;
  /** Links templates to an optional backdrop plate */
  backdropId?: string;
  /** Physical aspect hint for display/export */
  aspectRatio?: '4:5' | '5:7' | '7:4' | '7:5' | '3:5' | '2:3' | '7:8';
  /** Canonical design pixel dimensions */
  canvasWidth?: number;
  canvasHeight?: number;
  /** Die-cut silhouette for Gift Tags */
  tagShape?: GiftTagShape;
  /** Distinct visual architecture for stationery */
  stationeryFormat?: StationeryFormat;
}
