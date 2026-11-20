import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Archive,
  ArrowLeft,
  Check,
  Download,
  Eye,
  FileText,
  Grid2X2,
  Loader2,
  SlidersHorizontal,
  Utensils,
  X,
} from 'lucide-react';
import {
  getTemplateDimensions,
  renderCardToCanvas,
  renderCardToPngBlob,
  renderGiftTagSheetToCanvas,
  renderPlaceCardMockupToCanvas,
} from '../canvas/renderCard';
import { BulkDownloadModal } from '../components/BulkDownloadModal';
import { CardThumbnail } from '../components/CardThumbnail';
import { EditorFormPanel } from '../components/EditorFormPanel';
import { PdfExportModal } from '../components/PdfExportModal';
import { WinterAtmosphere } from '../components/WinterAtmosphere';
import {
  getTemplateById,
  getTemplatesByCategory,
  INVITATION_TEMPLATES,
} from '../templates/templatesData';
import { CardCategory, CardDraftState } from '../types/card';
import { triggerBlobDownload } from '../utils/exportZip';
import {
  buildCardDownloadFilename,
  clearDraftFromLocalStorage,
  createInitialDraft,
  loadDraftFromLocalStorage,
  saveDraftToLocalStorage,
} from '../utils/storage';

const CATEGORY_TABS: { id: CardCategory; label: string; count: number }[] = [
  { id: 'invitation', label: 'Invitations', count: 10 },
  { id: 'wishes', label: 'Wishes', count: 10 },
  { id: 'menu', label: 'Menus', count: 5 },
  { id: 'place-card', label: 'Place Cards', count: 10 },
  { id: 'gift-tag', label: 'Gift Tags', count: 10 },
  { id: 'thank-you', label: 'Thank-You', count: 5 },
];

const CATEGORY_LABEL: Record<CardCategory, string> = {
  invitation: 'Invitation Card',
  wishes: 'Wishes Card',
  menu: 'Christmas Menu',
  'place-card': 'Place Card',
  'gift-tag': 'Gift Tag',
  'thank-you': 'Thank-You Card',
};

function resolveInitialTemplate(): { category: CardCategory; templateId: string } {
  const params = new URLSearchParams(window.location.search);
  const typeParam = params.get('type') as CardCategory | null;
  const templateParam = params.get('template');

  if (templateParam) {
    const matched = getTemplateById(templateParam);
    return { category: matched.category, templateId: matched.id };
  }

  if (
    typeParam &&
    ['invitation', 'wishes', 'menu', 'place-card', 'gift-tag', 'thank-you'].includes(
      typeParam
    )
  ) {
    const list = getTemplatesByCategory(typeParam);
    return { category: typeParam, templateId: list[0].id };
  }

  return { category: 'invitation', templateId: INVITATION_TEMPLATES[0].id };
}

export const EditorPage: React.FC = () => {
  const [draft, setDraft] = useState<CardDraftState>(() => {
    const initial = resolveInitialTemplate();
    const base = createInitialDraft(initial.category, initial.templateId);
    const saved = loadDraftFromLocalStorage();
    if (!saved) return base;

    return {
      ...base,
      invitation: saved.invitation
        ? { ...base.invitation, ...saved.invitation }
        : base.invitation,
      wishes: saved.wishes ? { ...base.wishes, ...saved.wishes } : base.wishes,
      menu: saved.menu ? { ...base.menu, ...saved.menu } : base.menu,
      placeCard: saved.placeCard
        ? { ...base.placeCard, ...saved.placeCard }
        : base.placeCard,
      giftTag: saved.giftTag
        ? { ...base.giftTag, ...saved.giftTag }
        : base.giftTag,
      thankYou: saved.thankYou
        ? { ...base.thankYou, ...saved.thankYou }
        : base.thankYou,
      photo: saved.photo ? { ...base.photo, ...saved.photo } : base.photo,
      // Only restore design overrides if editing the exact same template
      design:
        saved.templateId === base.templateId && saved.design
          ? { ...base.design, ...saved.design }
          : base.design,
    };
  });

  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [pdfOpen, setPdfOpen] = useState(false);
  const [fullscreenPreviewOpen, setFullscreenPreviewOpen] = useState(false);
  const [previewScene, setPreviewScene] = useState<'card' | 'mockup'>('card');
  const [isDownloading, setIsDownloading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [draftSavedAt, setDraftSavedAt] = useState<string>('Saved locally');

  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const fullscreenCanvasRef = useRef<HTMLCanvasElement>(null);
  const renderTimerRef = useRef<number | null>(null);

  const activeTemplate = useMemo(
    () => getTemplateById(draft.templateId),
    [draft.templateId]
  );

  const activeDims = useMemo(
    () => getTemplateDimensions(activeTemplate),
    [activeTemplate]
  );

  const hasContextualMockup =
    draft.category === 'place-card' || draft.category === 'gift-tag';

  const effectiveScene: 'card' | 'mockup' = hasContextualMockup
    ? previewScene
    : 'card';

  const canvasAspect =
    effectiveScene === 'mockup'
      ? draft.category === 'place-card'
        ? { w: 1200, h: 860 }
        : { w: 850, h: 1100 }
      : { w: activeDims.width, h: activeDims.height };

  const categoryTemplates = useMemo(
    () => getTemplatesByCategory(draft.category),
    [draft.category]
  );

  useEffect(() => {
    setPreviewScene('card');
  }, [draft.category]);

  const showToast = useCallback((message: string) => {
    setToast(message);
    window.setTimeout(() => {
      setToast((prev) => (prev === message ? null : prev));
    }, 3200);
  }, []);

  // Debounced live canvas preview rendering
  useEffect(() => {
    if (renderTimerRef.current) {
      window.clearTimeout(renderTimerRef.current);
    }

    renderTimerRef.current = window.setTimeout(() => {
      const renderTarget = (
        canvas: HTMLCanvasElement,
        baseLongEdge: number
      ) => {
        if (effectiveScene === 'mockup') {
          if (draft.category === 'place-card') {
            return renderPlaceCardMockupToCanvas(
              canvas,
              draft,
              baseLongEdge,
              Math.round(baseLongEdge * (860 / 1200))
            );
          }
          if (draft.category === 'gift-tag') {
            return renderGiftTagSheetToCanvas(
              canvas,
              draft,
              Math.round(baseLongEdge * (850 / 1100)),
              baseLongEdge
            );
          }
        }
        const ratio = activeDims.height / activeDims.width;
        const targetW =
          activeDims.width >= activeDims.height
            ? baseLongEdge
            : Math.round(baseLongEdge / ratio);
        const targetH = Math.round(targetW * ratio);
        return renderCardToCanvas(canvas, draft, targetW, targetH);
      };

      if (previewCanvasRef.current) {
        void renderTarget(previewCanvasRef.current, 1080);
      }
      if (fullscreenPreviewOpen && fullscreenCanvasRef.current) {
        void renderTarget(fullscreenCanvasRef.current, 1280);
      }
    }, 35);

    return () => {
      if (renderTimerRef.current) window.clearTimeout(renderTimerRef.current);
    };
  }, [draft, fullscreenPreviewOpen, effectiveScene, activeDims]);

  // Persist draft locally on changes
  useEffect(() => {
    const id = window.setTimeout(() => {
      const ok = saveDraftToLocalStorage(draft);
      if (ok) {
        setDraftSavedAt('Draft saved');
      }
    }, 250);
    return () => window.clearTimeout(id);
  }, [draft]);

  const handleSelectTemplate = (templateId: string) => {
    const nextTpl = getTemplateById(templateId);
    setDraft((prev) => ({
      ...prev,
      category: nextTpl.category,
      templateId: nextTpl.id,
      design: {
        fontFamily: 'auto',
        textColor: '',
        backgroundColor: '',
        textAlign: 'auto',
      },
    }));
    const url = new URL(window.location.href);
    url.searchParams.set('type', nextTpl.category);
    url.searchParams.set('template', nextTpl.id);
    window.history.replaceState({}, '', url.toString());
  };

  const handleSwitchCategory = (category: CardCategory) => {
    if (category === draft.category) return;
    const firstTpl = getTemplatesByCategory(category)[0];
    handleSelectTemplate(firstTpl.id);
  };

  const handleDownloadPng = async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    try {
      const hdW = activeDims.width * 2;
      const hdH = activeDims.height * 2;
      const blob = await renderCardToPngBlob(draft, hdW, hdH);
      let personName = '';
      switch (draft.category) {
        case 'invitation':
          personName = draft.invitation.guestName || draft.invitation.eventTitle;
          break;
        case 'wishes':
          personName =
            draft.wishes.recipientName || draft.wishes.greetingHeadline;
          break;
        case 'menu':
          personName = draft.menu.menuTitle;
          break;
        case 'place-card':
          personName = draft.placeCard.guestName;
          break;
        case 'gift-tag':
          personName = draft.giftTag.toName || draft.giftTag.headline;
          break;
        case 'thank-you':
          personName = draft.thankYou.recipientName || draft.thankYou.headline;
          break;
      }
      const filename = buildCardDownloadFilename(draft.category, personName);
      triggerBlobDownload(blob, filename);
      showToast(`Downloaded ${filename} (${hdW} × ${hdH} px)`);
    } catch {
      showToast('Could not generate the PNG file. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleResetDefaults = () => {
    clearDraftFromLocalStorage();
    const fresh = createInitialDraft(draft.category, draft.templateId);
    setDraft(fresh);
    showToast('Reset card fields to template defaults.');
  };

  return (
    <div className="relative min-h-dvh bg-[#091725] text-[#F8F1E5] lg:flex lg:h-dvh lg:flex-col lg:overflow-hidden">
      <WinterAtmosphere variant="editor" />

      <div className="relative z-10 flex min-h-dvh flex-col lg:h-dvh lg:min-h-0">
        {/* TOP HEADER */}
        <header className="shrink-0 border-b border-[#D8B56D]/20 bg-[#091725]/90 backdrop-blur-md">
          <div className="flex items-center justify-between gap-3 px-4 py-2.5 sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <a
                href="./index.html"
                className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-[#D8B56D]/25 px-3 py-1.5 text-xs font-medium text-[#F8F1E5] whitespace-nowrap shrink-0 transition-colors hover:bg-[#143B2C]/50"
              >
                <ArrowLeft className="h-4 w-4 text-[#D8B56D]" />
                <span className="hidden sm:inline">Back to Collections</span>
                <span className="sm:hidden">Back</span>
              </a>

              <div className="min-w-0">
                <p className="truncate text-[11px] font-medium text-[#D8B56D]">
                  {CATEGORY_LABEL[activeTemplate.category]}{' '}
                  <span aria-hidden="true">·</span> {activeTemplate.styleLabel}
                </p>
                <h1 className="truncate font-display text-sm font-semibold text-[#F8F1E5] sm:text-base">
                  {activeTemplate.name}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="hidden items-center gap-1 text-xs text-[#B9D9EC]/75 md:inline-flex">
                <Check className="h-3.5 w-3.5 text-[#D8B56D]" />
                {draftSavedAt}
              </span>

              <button
                type="button"
                onClick={() => setPdfOpen(true)}
                className="inline-flex min-h-9 items-center gap-1 rounded-lg border border-[#D8B56D]/30 px-2.5 py-1.5 text-xs font-medium text-[#F8F1E5] hover:bg-[#143B2C]/50 lg:hidden"
              >
                <FileText className="h-3.5 w-3.5 text-[#D8B56D]" />
                <span>PDF</span>
              </button>

              <button
                type="button"
                onClick={() => setBulkOpen(true)}
                className="inline-flex min-h-9 items-center gap-1 rounded-lg border border-[#D8B56D]/30 px-2.5 py-1.5 text-xs font-medium text-[#F8F1E5] hover:bg-[#143B2C]/50 lg:hidden"
              >
                <Archive className="h-3.5 w-3.5 text-[#D8B56D]" />
                <span>ZIP</span>
              </button>

              <a
                href="./index.html"
                className="hidden items-center gap-2 font-display text-base font-semibold text-[#F8F1E5] lg:inline-flex"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                  className="text-[#D8B56D]"
                >
                  <path
                    d="M12 2L14.3 9.7L22 12L14.3 14.3L12 22L9.7 14.3L2 12L9.7 9.7L12 2Z"
                    fill="currentColor"
                  />
                </svg>
                <span>Santa Studio</span>
              </a>
            </div>
          </div>
        </header>

        {/* MAIN WORKSPACE */}
        <main className="flex min-h-0 flex-1 flex-col lg:grid lg:grid-cols-[430px_1fr] xl:grid-cols-[460px_1fr]">
          {/* DESKTOP LEFT PANEL — INDEPENDENTLY SCROLLABLE FORM */}
          <aside
            aria-label="Card customisation form"
            className="hidden border-r border-[#D8B56D]/20 bg-[#0A1929]/85 lg:block lg:min-h-0 lg:overflow-y-auto studio-scroll"
          >
            <EditorFormPanel
              draft={draft}
              template={activeTemplate}
              onUpdateInvitation={(patch) =>
                setDraft((prev) => ({
                  ...prev,
                  invitation: { ...prev.invitation, ...patch },
                }))
              }
              onUpdateWishes={(patch) =>
                setDraft((prev) => ({
                  ...prev,
                  wishes: { ...prev.wishes, ...patch },
                }))
              }
              onUpdateMenu={(patch) =>
                setDraft((prev) => ({
                  ...prev,
                  menu: { ...prev.menu, ...patch },
                }))
              }
              onUpdatePlaceCard={(patch) =>
                setDraft((prev) => ({
                  ...prev,
                  placeCard: { ...prev.placeCard, ...patch },
                }))
              }
              onUpdateGiftTag={(patch) =>
                setDraft((prev) => ({
                  ...prev,
                  giftTag: { ...prev.giftTag, ...patch },
                }))
              }
              onUpdateThankYou={(patch) =>
                setDraft((prev) => ({
                  ...prev,
                  thankYou: { ...prev.thankYou, ...patch },
                }))
              }
              onUpdatePhoto={(photo) => setDraft((prev) => ({ ...prev, photo }))}
              onUpdateDesign={(patch) =>
                setDraft((prev) => ({
                  ...prev,
                  design: { ...prev.design, ...patch },
                }))
              }
              onResetDefaults={handleResetDefaults}
            />
          </aside>

          {/* RIGHT PANEL — LIVE CARD PREVIEW + TEMPLATE SELECTOR + ACTION BAR */}
          <section
            aria-label="Live card preview"
            className="flex min-h-0 flex-1 flex-col pb-20 lg:pb-0"
          >
            {/* Preview Canvas Container */}
            <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-3 p-4 sm:p-6">
              {hasContextualMockup && (
                <div className="flex shrink-0 items-center gap-1 rounded-lg border border-[#D8B56D]/25 bg-[#0E2236] p-1">
                  <button
                    type="button"
                    onClick={() => setPreviewScene('card')}
                    className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                      effectiveScene === 'card'
                        ? 'bg-[#D8B56D] text-[#091725]'
                        : 'text-[#F8F1E5]/80 hover:text-[#F8F1E5]'
                    }`}
                  >
                    {draft.category === 'place-card'
                      ? 'Tent Card'
                      : 'Die-Cut Tag'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewScene('mockup')}
                    className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                      effectiveScene === 'mockup'
                        ? 'bg-[#D8B56D] text-[#091725]'
                        : 'text-[#F8F1E5]/80 hover:text-[#F8F1E5]'
                    }`}
                  >
                    {draft.category === 'place-card' ? (
                      <>
                        <Utensils className="h-3.5 w-3.5" />
                        <span>On Dinner Table</span>
                      </>
                    ) : (
                      <>
                        <Grid2X2 className="h-3.5 w-3.5" />
                        <span>6-Up Sheet</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              <div className="relative flex min-h-0 flex-1 max-h-[55dvh] w-full items-center justify-center lg:max-h-full">
                <canvas
                  ref={previewCanvasRef}
                  aria-label="Live personalised Christmas card preview"
                  className="max-h-full max-w-full rounded-xl border border-[#D8B56D]/30 shadow-[0_24px_60px_rgba(0,0,0,0.6)]"
                  style={{
                    aspectRatio: `${canvasAspect.w} / ${canvasAspect.h}`,
                    width: 'auto',
                    height: 'auto',
                  }}
                />
              </div>

              {(draft.category === 'invitation' ||
                draft.category === 'wishes' ||
                draft.category === 'thank-you') &&
                !draft.photo.dataUrl && (
                  <p className="hidden shrink-0 text-center text-xs text-[#B9D9EC]/80 sm:block">
                    Photo slot shown for layout preview{' '}
                    <span aria-hidden="true">·</span> Upload a picture in the{' '}
                    <span className="font-medium text-[#D8B56D]">Photo</span>{' '}
                    panel, or export cleanly without one.
                  </p>
                )}
            </div>

            {/* Horizontal Template Selector Strip */}
            <div className="shrink-0 border-t border-[#D8B56D]/15 bg-[#081523]/90 px-4 py-3">
              <div className="mb-2 flex items-center justify-between gap-3">
                <div className="studio-scroll flex items-center gap-1 overflow-x-auto rounded-lg bg-[#0E2236] p-1">
                  {CATEGORY_TABS.map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => handleSwitchCategory(tab.id)}
                      className={`shrink-0 rounded-md px-2.5 py-1 text-xs font-medium whitespace-nowrap transition-colors ${
                        draft.category === tab.id
                          ? 'bg-[#D8B56D] text-[#091725]'
                          : 'text-[#F8F1E5]/75 hover:text-[#F8F1E5]'
                      }`}
                    >
                      {tab.label} ({tab.count})
                    </button>
                  ))}
                </div>

                <span className="hidden shrink-0 text-xs text-[#B9D9EC]/75 xl:inline">
                  {activeDims.width * 2} × {activeDims.height * 2} px PNG · Print PDF
                </span>
              </div>

              <div className="studio-scroll flex gap-2.5 overflow-x-auto pb-1">
                {categoryTemplates.map((tpl) => {
                  const isActive = tpl.id === draft.templateId;
                  const tplDims = getTemplateDimensions(tpl);
                  const isWideTpl = tplDims.width > tplDims.height;
                  return (
                    <button
                      key={tpl.id}
                      type="button"
                      onClick={() => handleSelectTemplate(tpl.id)}
                      className={`group flex shrink-0 flex-col items-center gap-1 rounded-lg p-1 text-left transition-colors ${
                        isWideTpl ? 'w-28' : 'w-20'
                      } ${
                        isActive
                          ? 'bg-[#143B2C]/80 ring-2 ring-[#D8B56D]'
                          : 'hover:bg-[#143B2C]/35'
                      }`}
                    >
                      <div className="flex h-20 w-full items-center justify-center overflow-hidden rounded-md border border-white/10 bg-[#07121E]">
                        <div className={isWideTpl ? 'w-full' : 'h-full'}>
                          <CardThumbnail template={tpl} width={180} />
                        </div>
                      </div>
                      <span
                        className={`w-full truncate text-center text-[10px] font-medium ${
                          isActive ? 'text-[#D8B56D]' : 'text-[#F8F1E5]/75'
                        }`}
                      >
                        {tpl.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* DESKTOP BOTTOM ACTION BAR */}
            <div className="hidden shrink-0 items-center justify-between gap-3 border-t border-[#D8B56D]/20 bg-[#091725]/95 px-6 py-3 lg:flex">
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setFullscreenPreviewOpen(true)}
                  className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-[#D8B56D]/30 px-3.5 py-2 text-sm font-medium text-[#F8F1E5] hover:bg-[#143B2C]/50"
                >
                  <Eye className="h-4 w-4 text-[#D8B56D]" />
                  <span>Preview</span>
                </button>
                <button
                  type="button"
                  onClick={() => setBulkOpen(true)}
                  className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-[#D8B56D]/30 px-3.5 py-2 text-sm font-medium text-[#F8F1E5] hover:bg-[#143B2C]/50"
                >
                  <Archive className="h-4 w-4 text-[#D8B56D]" />
                  <span>Bulk ZIP</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPdfOpen(true)}
                  className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-[#D8B56D]/30 px-3.5 py-2 text-sm font-medium text-[#F8F1E5] hover:bg-[#143B2C]/50"
                >
                  <FileText className="h-4 w-4 text-[#D8B56D]" />
                  <span>Export PDF</span>
                </button>
              </div>

              <button
                type="button"
                disabled={isDownloading}
                onClick={() => void handleDownloadPng()}
                className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#D8B56D] px-6 py-2 text-sm font-semibold text-[#091725] transition-colors hover:bg-[#E4C788] disabled:opacity-60"
              >
                {isDownloading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                <span>{isDownloading ? 'Rendering HD...' : 'Download PNG'}</span>
              </button>
            </div>
          </section>
        </main>
      </div>

      {/* MOBILE FIXED BOTTOM ACTION BAR (<= 15% mobile viewport height, safe-area aware) */}
      <div
        className="fixed inset-x-0 bottom-0 z-30 border-t border-[#D8B56D]/25 bg-[#091725]/95 px-4 pt-2.5 backdrop-blur-md lg:hidden"
        style={{ paddingBottom: 'max(0.625rem, env(safe-area-inset-bottom))' }}
      >
        <div className="mx-auto flex max-w-md items-center gap-2.5">
          <button
            type="button"
            onClick={() => setMobileSheetOpen(true)}
            className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg border border-[#D8B56D]/40 bg-[#143B2C]/65 px-4 py-2 text-sm font-semibold text-[#F8F1E5]"
          >
            <SlidersHorizontal className="h-4 w-4 text-[#D8B56D]" />
            <span>Customize It</span>
          </button>
          <button
            type="button"
            disabled={isDownloading}
            onClick={() => void handleDownloadPng()}
            className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-[#D8B56D] px-4 py-2 text-sm font-semibold text-[#091725] disabled:opacity-60"
          >
            {isDownloading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            <span>{isDownloading ? 'Saving...' : 'Download'}</span>
          </button>
        </div>
      </div>

      {/* MOBILE STEP 2: FULL-SCREEN / SHEET CUSTOMISATION PANEL */}
      {mobileSheetOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Customize your Christmas card"
          className="fixed inset-0 z-40 flex flex-col bg-[#091725] lg:hidden"
        >
          <div className="flex shrink-0 items-center justify-between border-b border-[#D8B56D]/20 px-4 py-3">
            <div>
              <p className="text-[11px] font-medium text-[#D8B56D]">
                {activeTemplate.name}
              </p>
              <h2 className="font-display text-lg font-semibold text-[#F8F1E5]">
                Personalise Card
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setMobileSheetOpen(false)}
              aria-label="Close customisation panel"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#D8B56D]/25 text-[#F8F1E5]"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto studio-scroll">
            <EditorFormPanel
              draft={draft}
              template={activeTemplate}
              onUpdateInvitation={(patch) =>
                setDraft((prev) => ({
                  ...prev,
                  invitation: { ...prev.invitation, ...patch },
                }))
              }
              onUpdateWishes={(patch) =>
                setDraft((prev) => ({
                  ...prev,
                  wishes: { ...prev.wishes, ...patch },
                }))
              }
              onUpdateMenu={(patch) =>
                setDraft((prev) => ({
                  ...prev,
                  menu: { ...prev.menu, ...patch },
                }))
              }
              onUpdatePlaceCard={(patch) =>
                setDraft((prev) => ({
                  ...prev,
                  placeCard: { ...prev.placeCard, ...patch },
                }))
              }
              onUpdateGiftTag={(patch) =>
                setDraft((prev) => ({
                  ...prev,
                  giftTag: { ...prev.giftTag, ...patch },
                }))
              }
              onUpdateThankYou={(patch) =>
                setDraft((prev) => ({
                  ...prev,
                  thankYou: { ...prev.thankYou, ...patch },
                }))
              }
              onUpdatePhoto={(photo) => setDraft((prev) => ({ ...prev, photo }))}
              onUpdateDesign={(patch) =>
                setDraft((prev) => ({
                  ...prev,
                  design: { ...prev.design, ...patch },
                }))
              }
              onResetDefaults={handleResetDefaults}
            />
          </div>

          <div
            className="flex shrink-0 items-center gap-2.5 border-t border-[#D8B56D]/20 bg-[#081320] px-4 pt-2.5"
            style={{
              paddingBottom: 'max(0.625rem, env(safe-area-inset-bottom))',
            }}
          >
            <button
              type="button"
              onClick={() => setMobileSheetOpen(false)}
              className="inline-flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-lg border border-[#D8B56D]/40 bg-[#143B2C]/65 px-4 py-2 text-sm font-semibold text-[#F8F1E5]"
            >
              <Eye className="h-4 w-4 text-[#D8B56D]" />
              <span>Preview Card</span>
            </button>
            <button
              type="button"
              disabled={isDownloading}
              onClick={() => void handleDownloadPng()}
              className="inline-flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#D8B56D] px-4 py-2 text-sm font-semibold text-[#091725] disabled:opacity-60"
            >
              {isDownloading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              <span>Download</span>
            </button>
          </div>
        </div>
      )}

      {/* FULLSCREEN PREVIEW MODAL (Desktop Preview button) */}
      {fullscreenPreviewOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Full size card preview"
          onClick={() => setFullscreenPreviewOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#050C14]/90 p-6 backdrop-blur-sm"
        >
          <div
            className="relative flex max-h-[92dvh] flex-col items-center gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setFullscreenPreviewOpen(false)}
              aria-label="Close full preview"
              className="absolute -right-2 -top-2 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#D8B56D]/35 bg-[#091725] text-[#F8F1E5] hover:bg-[#143B2C]"
            >
              <X className="h-5 w-5" />
            </button>
            <canvas
              ref={fullscreenCanvasRef}
              className="max-h-[82dvh] max-w-[90vw] w-auto rounded-xl border border-[#D8B56D]/35 shadow-2xl"
              style={{
                aspectRatio: `${canvasAspect.w} / ${canvasAspect.h}`,
              }}
            />
          </div>
        </div>
      )}

      {/* BULK ZIP MODAL */}
      <BulkDownloadModal
        open={bulkOpen}
        onClose={() => setBulkOpen(false)}
        draft={draft}
      />

      {/* PRINT-READY PDF EXPORT MODAL */}
      <PdfExportModal
        open={pdfOpen}
        onClose={() => setPdfOpen(false)}
        draft={draft}
      />

      {/* FRIENDLY TOAST NOTIFICATION */}
      {toast && (
        <div
          role="status"
          className="fixed right-4 top-16 z-50 flex items-center gap-2 rounded-xl border border-[#D8B56D]/40 bg-[#143B2C] px-4 py-2.5 text-xs font-medium text-[#F8F1E5] shadow-xl"
        >
          <Check className="h-4 w-4 shrink-0 text-[#D8B56D]" />
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
};
