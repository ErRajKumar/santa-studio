import React, { useState } from 'react';
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  ChevronDown,
  ChevronRight,
  MessageSquareHeart,
  RotateCcw,
} from 'lucide-react';
import {
  CardDraftState,
  FontChoice,
  TemplateConfig,
  TextAlignChoice,
} from '../types/card';
import { MessageLibraryModal } from './MessageLibraryView';
import { PhotoUploader } from './PhotoUploader';

interface EditorFormPanelProps {
  draft: CardDraftState;
  template: TemplateConfig;
  onUpdateInvitation: (patch: Partial<CardDraftState['invitation']>) => void;
  onUpdateWishes: (patch: Partial<CardDraftState['wishes']>) => void;
  onUpdateMenu: (patch: Partial<CardDraftState['menu']>) => void;
  onUpdatePlaceCard: (patch: Partial<CardDraftState['placeCard']>) => void;
  onUpdateGiftTag: (patch: Partial<CardDraftState['giftTag']>) => void;
  onUpdateThankYou: (patch: Partial<CardDraftState['thankYou']>) => void;
  onUpdatePhoto: (photo: CardDraftState['photo']) => void;
  onUpdateDesign: (patch: Partial<CardDraftState['design']>) => void;
  onResetDefaults: () => void;
}

const FONT_OPTIONS: { value: FontChoice; label: string }[] = [
  { value: 'auto', label: 'Template Default' },
  { value: 'playfair', label: 'Playfair Display (Editorial Serif)' },
  { value: 'cormorant', label: 'Cormorant Garamond (Classic Luxury)' },
  { value: 'great-vibes', label: 'Great Vibes (Festive Script)' },
  { value: 'dm-sans', label: 'DM Sans (Clean Modern)' },
  { value: 'oswald', label: 'Oswald (Bold Display)' },
];

export const EditorFormPanel: React.FC<EditorFormPanelProps> = ({
  draft,
  template,
  onUpdateInvitation,
  onUpdateWishes,
  onUpdateMenu,
  onUpdatePlaceCard,
  onUpdateGiftTag,
  onUpdateThankYou,
  onUpdatePhoto,
  onUpdateDesign,
  onResetDefaults,
}) => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    primary: true,
    message: true,
    guests: false,
    photo: true,
    design: false,
  });
  const [messagePickerTarget, setMessagePickerTarget] = useState<
    null | 'invitation' | 'wishes' | 'thank-you'
  >(null);

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const supportsPhoto =
    draft.category === 'invitation' ||
    draft.category === 'wishes' ||
    draft.category === 'thank-you';

  return (
    <div className="space-y-3 p-4 sm:p-5">
      {draft.category === 'invitation' && (
        <>
          {/* Section 1: Event Information */}
          <AccordionSection
            title="Event Information"
            isOpen={openSections.primary}
            onToggle={() => toggleSection('primary')}
          >
            <div className="space-y-3.5">
              <FieldInput
                id="inv-event-title"
                label="Event Title"
                value={draft.invitation.eventTitle}
                placeholder="Christmas Celebration"
                onChange={(v) => onUpdateInvitation({ eventTitle: v })}
              />
              <FieldInput
                id="inv-event-subtitle"
                label="Event Subtitle"
                value={draft.invitation.eventSubtitle}
                placeholder="Dinner, Carols & Champagne"
                onChange={(v) => onUpdateInvitation({ eventSubtitle: v })}
              />
              <FieldInput
                id="inv-host-name"
                label="Host Name"
                value={draft.invitation.hostName}
                placeholder="The Bennett Family"
                onChange={(v) => onUpdateInvitation({ hostName: v })}
              />
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <FieldInput
                  id="inv-date"
                  label="Event Date"
                  value={draft.invitation.eventDate}
                  placeholder="December 24, 2026"
                  onChange={(v) => onUpdateInvitation({ eventDate: v })}
                />
                <FieldInput
                  id="inv-start-time"
                  label="Start Time"
                  value={draft.invitation.eventStartTime}
                  placeholder="7:00 PM"
                  onChange={(v) => onUpdateInvitation({ eventStartTime: v })}
                />
              </div>
              <FieldInput
                id="inv-end-time"
                label="End Time (optional)"
                value={draft.invitation.eventEndTime}
                placeholder="11:30 PM"
                onChange={(v) => onUpdateInvitation({ eventEndTime: v })}
              />
              <FieldInput
                id="inv-venue"
                label="Venue Name"
                value={draft.invitation.venueName}
                placeholder="Winterbourne Conservatory"
                onChange={(v) => onUpdateInvitation({ venueName: v })}
              />
              <FieldInput
                id="inv-address"
                label="Full Address"
                value={draft.invitation.fullAddress}
                placeholder="42 Evergreen Crescent, Kensington"
                onChange={(v) => onUpdateInvitation({ fullAddress: v })}
              />
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <FieldInput
                  id="inv-rsvp-contact"
                  label="RSVP Contact"
                  value={draft.invitation.rsvpContact}
                  placeholder="rsvp@example.com"
                  onChange={(v) => onUpdateInvitation({ rsvpContact: v })}
                />
                <FieldInput
                  id="inv-rsvp-deadline"
                  label="RSVP Deadline"
                  value={draft.invitation.rsvpDeadline}
                  placeholder="December 15"
                  onChange={(v) => onUpdateInvitation({ rsvpDeadline: v })}
                />
              </div>
            </div>
          </AccordionSection>

          {/* Section 2: Personal Message */}
          <AccordionSection
            title="Personal Message"
            isOpen={openSections.message}
            onToggle={() => toggleSection('message')}
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] text-[#B9D9EC]/80">
                  Write your own note or insert from the 50-message library
                </span>
                <button
                  type="button"
                  onClick={() => setMessagePickerTarget('invitation')}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#D8B56D]/35 bg-[#143B2C]/55 px-2.5 py-1 text-[11px] font-semibold text-[#D8B56D] hover:bg-[#143B2C]"
                >
                  <MessageSquareHeart className="h-3.5 w-3.5" />
                  <span>Browse 50 Messages</span>
                </button>
              </div>
              <FieldTextarea
                id="inv-personal-msg"
                label="Personal Invitation Message"
                value={draft.invitation.personalMessage}
                placeholder="Write a warm note inviting your guests..."
                rows={3}
                onChange={(v) => onUpdateInvitation({ personalMessage: v })}
              />
            </div>
          </AccordionSection>

          {/* Section 3: Guest Details */}
          <AccordionSection
            title="Guest Details"
            isOpen={openSections.guests}
            onToggle={() => toggleSection('guests')}
          >
            <div className="space-y-3.5">
              <FieldInput
                id="inv-guest-name"
                label="Guest Name (optional — leave blank to omit)"
                value={draft.invitation.guestName}
                placeholder="Oliver"
                onChange={(v) => onUpdateInvitation({ guestName: v })}
              />
              <FieldInput
                id="inv-dress-code"
                label="Dress Code (optional)"
                value={draft.invitation.dressCode}
                placeholder="Festive Evening Attire"
                onChange={(v) => onUpdateInvitation({ dressCode: v })}
              />
              <FieldInput
                id="inv-additional-info"
                label="Additional Information (optional)"
                value={draft.invitation.additionalInfo}
                placeholder="Valet parking available at East Gate"
                onChange={(v) => onUpdateInvitation({ additionalInfo: v })}
              />
              <FieldInput
                id="inv-website"
                label="Website or Event Link (optional)"
                value={draft.invitation.websiteLink}
                placeholder="https://example.com/christmas-party"
                onChange={(v) => onUpdateInvitation({ websiteLink: v })}
              />
            </div>
          </AccordionSection>
        </>
      )}

      {draft.category === 'wishes' && (
        <>
          {/* Wishes Section 1: Message Details */}
          <AccordionSection
            title="Greeting & Message Details"
            isOpen={openSections.primary}
            onToggle={() => toggleSection('primary')}
          >
            <div className="space-y-3.5">
              <FieldInput
                id="wish-recipient"
                label="Recipient Name"
                value={draft.wishes.recipientName}
                placeholder="Dear Friends & Family"
                onChange={(v) => onUpdateWishes({ recipientName: v })}
              />
              <FieldInput
                id="wish-headline"
                label="Greeting Headline"
                value={draft.wishes.greetingHeadline}
                placeholder="Merry Christmas"
                onChange={(v) => onUpdateWishes({ greetingHeadline: v })}
              />
              <div>
                <div className="mb-1.5 flex items-center justify-between gap-2">
                  <label
                    htmlFor="wish-main-msg"
                    className="text-xs font-medium text-[#F8F1E5]/85"
                  >
                    Main Christmas Message
                  </label>
                  <button
                    type="button"
                    onClick={() => setMessagePickerTarget('wishes')}
                    className="inline-flex items-center gap-1 rounded-md border border-[#D8B56D]/35 bg-[#143B2C]/55 px-2 py-1 text-[11px] font-semibold text-[#D8B56D] hover:bg-[#143B2C]"
                  >
                    <MessageSquareHeart className="h-3 w-3" />
                    <span>Browse 50 Messages</span>
                  </button>
                </div>
                <textarea
                  id="wish-main-msg"
                  rows={4}
                  value={draft.wishes.mainMessage}
                  placeholder="Share your warm Christmas wishes..."
                  onChange={(e) => onUpdateWishes({ mainMessage: e.target.value })}
                  className="w-full rounded-lg border border-[#D8B56D]/25 bg-[#091725] px-3 py-2 text-sm text-[#F8F1E5] placeholder:text-[#F8F1E5]/35 focus:border-[#D8B56D] focus:outline-none"
                />
              </div>
              <FieldInput
                id="wish-sender"
                label="Sender Name"
                value={draft.wishes.senderName}
                placeholder="With Love, Clara & Julian"
                onChange={(v) => onUpdateWishes({ senderName: v })}
              />
              <FieldInput
                id="wish-family"
                label="Family or Company Name (optional)"
                value={draft.wishes.familyOrCompany}
                placeholder="The Sterling Household"
                onChange={(v) => onUpdateWishes({ familyOrCompany: v })}
              />
              <FieldInput
                id="wish-extra"
                label="Additional Message (optional)"
                value={draft.wishes.additionalMessage}
                placeholder="Wishing you warmth and wonder this holiday season."
                onChange={(v) => onUpdateWishes({ additionalMessage: v })}
              />
            </div>
          </AccordionSection>
        </>
      )}

      {draft.category === 'menu' && (
        <AccordionSection
          title="Christmas Menu Courses"
          isOpen={openSections.primary}
          onToggle={() => toggleSection('primary')}
        >
          <div className="space-y-3.5">
            <FieldInput
              id="menu-title"
              label="Menu Title"
              value={draft.menu.menuTitle}
              placeholder="Christmas Eve Dinner"
              onChange={(v) => onUpdateMenu({ menuTitle: v })}
            />
            <FieldInput
              id="menu-subtitle"
              label="Subtitle / Date"
              value={draft.menu.subtitle}
              placeholder="December 24, 2026 · The Bennett Table"
              onChange={(v) => onUpdateMenu({ subtitle: v })}
            />
            <FieldTextarea
              id="menu-starters"
              label="Starters"
              value={draft.menu.starters}
              rows={2}
              onChange={(v) => onUpdateMenu({ starters: v })}
            />
            <FieldTextarea
              id="menu-mains"
              label="Main Course"
              value={draft.menu.mains}
              rows={2}
              onChange={(v) => onUpdateMenu({ mains: v })}
            />
            <FieldTextarea
              id="menu-sides"
              label="Festive Sides (optional)"
              value={draft.menu.sides}
              rows={2}
              onChange={(v) => onUpdateMenu({ sides: v })}
            />
            <FieldTextarea
              id="menu-desserts"
              label="Desserts"
              value={draft.menu.desserts}
              rows={2}
              onChange={(v) => onUpdateMenu({ desserts: v })}
            />
            <FieldInput
              id="menu-drinks"
              label="Drinks & Cocktails (optional)"
              value={draft.menu.drinks}
              onChange={(v) => onUpdateMenu({ drinks: v })}
            />
            <FieldInput
              id="menu-footer"
              label="Footer Note (optional)"
              value={draft.menu.footerNote}
              onChange={(v) => onUpdateMenu({ footerNote: v })}
            />
          </div>
        </AccordionSection>
      )}

      {draft.category === 'place-card' && (
        <AccordionSection
          title="Guest Place Card Details"
          isOpen={openSections.primary}
          onToggle={() => toggleSection('primary')}
        >
          <div className="space-y-3.5">
            <FieldInput
              id="place-guest-name"
              label="Guest Name"
              value={draft.placeCard.guestName}
              placeholder="Evelyn Bennett"
              onChange={(v) => onUpdatePlaceCard({ guestName: v })}
            />
            <FieldInput
              id="place-table-role"
              label="Table Number or Seat Label"
              value={draft.placeCard.tableOrRole}
              placeholder="Table No. 1 · Fireside"
              onChange={(v) => onUpdatePlaceCard({ tableOrRole: v })}
            />
            <FieldInput
              id="place-event-label"
              label="Event Heading"
              value={draft.placeCard.eventLabel}
              placeholder="Christmas Eve Dinner"
              onChange={(v) => onUpdatePlaceCard({ eventLabel: v })}
            />
          </div>
        </AccordionSection>
      )}

      {draft.category === 'gift-tag' && (
        <AccordionSection
          title="Gift Tag Details"
          isOpen={openSections.primary}
          onToggle={() => toggleSection('primary')}
        >
          <div className="space-y-3.5">
            <FieldInput
              id="tag-headline"
              label="Tag Headline"
              value={draft.giftTag.headline}
              placeholder="Warm Holiday Wishes"
              onChange={(v) => onUpdateGiftTag({ headline: v })}
            />
            <FieldInput
              id="tag-to"
              label="To"
              value={draft.giftTag.toName}
              placeholder="Ethan"
              onChange={(v) => onUpdateGiftTag({ toName: v })}
            />
            <FieldInput
              id="tag-from"
              label="From"
              value={draft.giftTag.fromName}
              placeholder="Clara & Julian"
              onChange={(v) => onUpdateGiftTag({ fromName: v })}
            />
            <FieldInput
              id="tag-note"
              label="Short Note (optional)"
              value={draft.giftTag.shortNote}
              placeholder="Open on Christmas morning"
              onChange={(v) => onUpdateGiftTag({ shortNote: v })}
            />
          </div>
        </AccordionSection>
      )}

      {draft.category === 'thank-you' && (
        <AccordionSection
          title="Thank-You Card Details"
          isOpen={openSections.primary}
          onToggle={() => toggleSection('primary')}
        >
          <div className="space-y-3.5">
            <FieldInput
              id="ty-headline"
              label="Card Headline"
              value={draft.thankYou.headline}
              placeholder="With Warmest Thanks"
              onChange={(v) => onUpdateThankYou({ headline: v })}
            />
            <FieldInput
              id="ty-recipient"
              label="Recipient Name"
              value={draft.thankYou.recipientName}
              placeholder="Dear Aunt Elena"
              onChange={(v) => onUpdateThankYou({ recipientName: v })}
            />
            <div>
              <div className="mb-1.5 flex items-center justify-between gap-2">
                <label
                  htmlFor="ty-message"
                  className="text-xs font-medium text-[#F8F1E5]/85"
                >
                  Thank-You Message
                </label>
                <button
                  type="button"
                  onClick={() => setMessagePickerTarget('thank-you')}
                  className="inline-flex items-center gap-1 rounded-md border border-[#D8B56D]/35 bg-[#143B2C]/55 px-2 py-1 text-[11px] font-semibold text-[#D8B56D] hover:bg-[#143B2C]"
                >
                  <MessageSquareHeart className="h-3 w-3" />
                  <span>Browse 50 Messages</span>
                </button>
              </div>
              <textarea
                id="ty-message"
                rows={4}
                value={draft.thankYou.message}
                placeholder="Thank you so much for your thoughtful gift..."
                onChange={(e) => onUpdateThankYou({ message: e.target.value })}
                className="w-full rounded-lg border border-[#D8B56D]/25 bg-[#091725] px-3 py-2 text-sm text-[#F8F1E5] placeholder:text-[#F8F1E5]/35 focus:border-[#D8B56D] focus:outline-none"
              />
            </div>
            <FieldInput
              id="ty-sender"
              label="Sender Name"
              value={draft.thankYou.senderName}
              placeholder="With Love, Clara & Julian"
              onChange={(v) => onUpdateThankYou({ senderName: v })}
            />
            <FieldInput
              id="ty-footer"
              label="Footer Note (optional)"
              value={draft.thankYou.footerNote}
              placeholder="Christmas 2026"
              onChange={(v) => onUpdateThankYou({ footerNote: v })}
            />
          </div>
        </AccordionSection>
      )}

      {/* Photo Upload Section */}
      {supportsPhoto && (
        <AccordionSection
          title="Photo"
          isOpen={openSections.photo}
          onToggle={() => toggleSection('photo')}
        >
          <div className="space-y-3.5">
            <PhotoUploader photo={draft.photo} onChange={onUpdatePhoto} />
            {draft.category === 'wishes' && (
              <FieldInput
                id="wish-photo-caption"
                label="Photo Caption (optional)"
                value={draft.wishes.photoCaption}
                placeholder="Winter Memories, 2026"
                onChange={(v) => onUpdateWishes({ photoCaption: v })}
              />
            )}
          </div>
        </AccordionSection>
      )}

      {/* Design Options Section */}
      <AccordionSection
        title="Design Options"
        isOpen={openSections.design}
        onToggle={() => toggleSection('design')}
      >
        <div className="space-y-4">
          <div>
            <label
              htmlFor="design-font-select"
              className="mb-1.5 block text-xs font-medium text-[#F8F1E5]/85"
            >
              Typography Style
            </label>
            <select
              id="design-font-select"
              value={draft.design.fontFamily}
              onChange={(e) =>
                onUpdateDesign({ fontFamily: e.target.value as FontChoice })
              }
              className="min-h-10 w-full rounded-lg border border-[#D8B56D]/25 bg-[#091725] px-3 text-sm text-[#F8F1E5] focus:border-[#D8B56D] focus:outline-none"
            >
              {FONT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Text Colour Swatches */}
          <div>
            <div className="mb-1.5 flex items-center justify-between text-xs">
              <span className="font-medium text-[#F8F1E5]/85">Text Colour</span>
              {draft.design.textColor && (
                <button
                  type="button"
                  onClick={() => onUpdateDesign({ textColor: '' })}
                  className="text-[11px] text-[#D8B56D] hover:underline"
                >
                  Use Default
                </button>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {template.textColorSwatches.map((hex) => {
                const active =
                  (draft.design.textColor || template.palette.primaryText) ===
                  hex;
                return (
                  <button
                    key={hex}
                    type="button"
                    aria-label={`Set text color ${hex}`}
                    onClick={() => onUpdateDesign({ textColor: hex })}
                    className={`h-8 w-8 rounded-full border-2 transition-transform hover:scale-105 ${
                      active
                        ? 'border-[#D8B56D] ring-2 ring-[#D8B56D]/40'
                        : 'border-white/25'
                    }`}
                    style={{ backgroundColor: hex }}
                  />
                );
              })}
              <input
                type="color"
                aria-label="Custom text color picker"
                value={draft.design.textColor || template.palette.primaryText}
                onChange={(e) => onUpdateDesign({ textColor: e.target.value })}
                className="h-8 w-10 cursor-pointer rounded border border-[#D8B56D]/30 bg-transparent p-0.5"
              />
            </div>
          </div>

          {/* Background Colour Swatches */}
          {template.supportsCustomBackground && (
            <div>
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <span className="font-medium text-[#F8F1E5]/85">
                  Background Colour
                </span>
                {draft.design.backgroundColor && (
                  <button
                    type="button"
                    onClick={() => onUpdateDesign({ backgroundColor: '' })}
                    className="text-[11px] text-[#D8B56D] hover:underline"
                  >
                    Use Default
                  </button>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {template.backgroundSwatches.map((hex) => {
                  const active =
                    (draft.design.backgroundColor ||
                      template.palette.background) === hex;
                  return (
                    <button
                      key={hex}
                      type="button"
                      aria-label={`Set background color ${hex}`}
                      onClick={() => onUpdateDesign({ backgroundColor: hex })}
                      className={`h-8 w-8 rounded-full border-2 transition-transform hover:scale-105 ${
                        active
                          ? 'border-[#D8B56D] ring-2 ring-[#D8B56D]/40'
                          : 'border-white/25'
                      }`}
                      style={{ backgroundColor: hex }}
                    />
                  );
                })}
                <input
                  type="color"
                  aria-label="Custom background color picker"
                  value={
                    draft.design.backgroundColor || template.palette.background
                  }
                  onChange={(e) =>
                    onUpdateDesign({ backgroundColor: e.target.value })
                  }
                  className="h-8 w-10 cursor-pointer rounded border border-[#D8B56D]/30 bg-transparent p-0.5"
                />
              </div>
            </div>
          )}

          {/* Alignment */}
          {template.supportsCustomAlignment && (
            <div>
              <span className="mb-1.5 block text-xs font-medium text-[#F8F1E5]/85">
                Text Alignment
              </span>
              <div className="grid grid-cols-4 gap-1.5 rounded-lg bg-[#091725] p-1">
                {(
                  [
                    { val: 'auto', label: 'Auto' },
                    { val: 'left', label: 'Left', icon: AlignLeft },
                    { val: 'center', label: 'Center', icon: AlignCenter },
                    { val: 'right', label: 'Right', icon: AlignRight },
                  ] as const
                ).map((item) => {
                  const active = draft.design.textAlign === item.val;
                  const Icon = 'icon' in item ? item.icon : null;
                  return (
                    <button
                      key={item.val}
                      type="button"
                      onClick={() =>
                        onUpdateDesign({
                          textAlign: item.val as TextAlignChoice,
                        })
                      }
                      className={`flex min-h-9 items-center justify-center gap-1 rounded-md text-xs font-medium transition-colors ${
                        active
                          ? 'bg-[#D8B56D] text-[#091725]'
                          : 'text-[#F8F1E5]/75 hover:text-[#F8F1E5]'
                      }`}
                    >
                      {Icon && <Icon className="h-3.5 w-3.5" />}
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </AccordionSection>

      {/* Reset Helper */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onResetDefaults}
          className="inline-flex min-h-9 w-full items-center justify-center gap-1.5 rounded-lg border border-[#D8B56D]/20 px-3 py-2 text-xs font-medium text-[#F8F1E5]/70 transition-colors hover:border-[#D8B56D]/45 hover:text-[#F8F1E5]"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Reset Card to Template Defaults</span>
        </button>
      </div>

      <MessageLibraryModal
        open={messagePickerTarget !== null}
        onClose={() => setMessagePickerTarget(null)}
        defaultTargetFilter={
          messagePickerTarget === 'invitation' ? 'invitation' : 'wishes'
        }
        onInsert={(msg) => {
          if (messagePickerTarget === 'invitation') {
            onUpdateInvitation({ personalMessage: msg.text });
          } else if (messagePickerTarget === 'wishes') {
            onUpdateWishes({ mainMessage: msg.text });
          } else if (messagePickerTarget === 'thank-you') {
            onUpdateThankYou({ message: msg.text });
          }
        }}
      />
    </div>
  );
};

interface AccordionSectionProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

const AccordionSection: React.FC<AccordionSectionProps> = ({
  title,
  isOpen,
  onToggle,
  children,
}) => (
  <section className="overflow-hidden rounded-xl border border-[#D8B56D]/20 bg-[#0D2134]/75">
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={isOpen}
      className="flex min-h-12 w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-[#143B2C]/35"
    >
      <span className="text-sm font-semibold text-[#F8F1E5]">{title}</span>
      {isOpen ? (
        <ChevronDown className="h-4 w-4 text-[#D8B56D]" />
      ) : (
        <ChevronRight className="h-4 w-4 text-[#D8B56D]/75" />
      )}
    </button>
    {isOpen && (
      <div className="border-t border-[#D8B56D]/15 px-4 pb-4 pt-3.5">
        {children}
      </div>
    )}
  </section>
);

interface FieldInputProps {
  id: string;
  label: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
}

const FieldInput: React.FC<FieldInputProps> = ({
  id,
  label,
  value,
  placeholder,
  onChange,
}) => (
  <div>
    <label
      htmlFor={id}
      className="mb-1.5 block text-xs font-medium text-[#F8F1E5]/85"
    >
      {label}
    </label>
    <input
      id={id}
      type="text"
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="min-h-10 w-full rounded-lg border border-[#D8B56D]/25 bg-[#091725] px-3 py-2 text-sm text-[#F8F1E5] placeholder:text-[#F8F1E5]/35 focus:border-[#D8B56D] focus:outline-none"
    />
  </div>
);

interface FieldTextareaProps {
  id: string;
  label: string;
  value: string;
  placeholder?: string;
  rows?: number;
  onChange: (value: string) => void;
}

const FieldTextarea: React.FC<FieldTextareaProps> = ({
  id,
  label,
  value,
  placeholder,
  rows = 3,
  onChange,
}) => (
  <div>
    <label
      htmlFor={id}
      className="mb-1.5 block text-xs font-medium text-[#F8F1E5]/85"
    >
      {label}
    </label>
    <textarea
      id={id}
      rows={rows}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-[#D8B56D]/25 bg-[#091725] px-3 py-2 text-sm text-[#F8F1E5] placeholder:text-[#F8F1E5]/35 focus:border-[#D8B56D] focus:outline-none"
    />
  </div>
);
