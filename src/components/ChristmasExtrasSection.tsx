import React, { useMemo, useState } from 'react';
import {
  Archive,
  ArrowRight,
  BookOpen,
  Check,
  ClipboardList,
  Download,
  Eye,
  FileText,
  Grid2X2,
  Layers,
  Mail,
  MessageSquareHeart,
  Palette,
  Printer,
  Sparkles,
  Tag,
  Utensils,
  UtensilsCrossed,
} from 'lucide-react';
import {
  ALL_STATIONERY_TEMPLATES,
  GIFT_TAG_TEMPLATES,
  MENU_TEMPLATES,
  PLACE_CARD_TEMPLATES,
  THANK_YOU_TEMPLATES,
} from '../templates/stationeryData';
import { TemplateConfig } from '../types/card';
import {
  downloadAllPlanningPrintablesZip,
  downloadPlanningPrintable,
  PARTY_PLANNING_PRINTABLES,
  PrintablePaperSize,
} from '../utils/planningPrintablesPdf';
import { CardThumbnail } from './CardThumbnail';
import { MessageLibraryView } from './MessageLibraryView';

type ExtrasTab = 'stationery' | 'messages' | 'printables' | 'guide';
type StationeryFilter =
  | 'all'
  | 'menu'
  | 'place-card'
  | 'gift-tag'
  | 'thank-you';

interface ChristmasExtrasSectionProps {
  onPreviewTemplate: (template: TemplateConfig) => void;
}

const STATIONERY_CATEGORIES: {
  id: Exclude<StationeryFilter, 'all'>;
  title: string;
  countLabel: string;
  subtitle: string;
  icon: React.FC<{ className?: string }>;
}[] = [
  {
    id: 'menu',
    title: 'Menus',
    countLabel: '5 Designs',
    subtitle: '5:7 portrait dinner menus with starters, mains, dessert & drinks.',
    icon: UtensilsCrossed,
  },
  {
    id: 'place-card',
    title: 'Place Cards',
    countLabel: '10 Designs',
    subtitle: '7:4 folded tent cards for long guest names & table settings.',
    icon: Utensils,
  },
  {
    id: 'gift-tag',
    title: 'Gift Tags',
    countLabel: '10 Designs',
    subtitle: '5 die-cut shapes with eyelet hole, ribbon & 6-up cut sheets.',
    icon: Tag,
  },
  {
    id: 'thank-you',
    title: 'Thank-You Cards',
    countLabel: '5 Designs',
    subtitle: 'Folded, postcard, photo keepsake, minimal & illustrated cards.',
    icon: Mail,
  },
];

export const ChristmasExtrasSection: React.FC<ChristmasExtrasSectionProps> = ({
  onPreviewTemplate,
}) => {
  const [activeTab, setActiveTab] = useState<ExtrasTab>('stationery');
  const [stationeryFilter, setStationeryFilter] =
    useState<StationeryFilter>('menu');
  const [placeScene, setPlaceScene] = useState<'card' | 'table-mockup'>('card');
  const [tagScene, setTagScene] = useState<'card' | 'tag-sheet'>('card');
  const [paperSize, setPaperSize] = useState<PrintablePaperSize>('letter');
  const [kitFeedback, setKitFeedback] = useState<string | null>(null);
  const [isZippingKit, setIsZippingKit] = useState(false);

  const visibleStationery = useMemo(() => {
    switch (stationeryFilter) {
      case 'menu':
        return MENU_TEMPLATES;
      case 'place-card':
        return PLACE_CARD_TEMPLATES;
      case 'gift-tag':
        return GIFT_TAG_TEMPLATES;
      case 'thank-you':
        return THANK_YOU_TEMPLATES;
      default:
        return ALL_STATIONERY_TEMPLATES;
    }
  }, [stationeryFilter]);

  const activeCategoryMeta = STATIONERY_CATEGORIES.find(
    (c) => c.id === stationeryFilter
  );

  const handleDownloadSinglePrintable = (
    id: (typeof PARTY_PLANNING_PRINTABLES)[number]['id']
  ) => {
    const filename = downloadPlanningPrintable(id, paperSize);
    setKitFeedback(`Downloaded ${filename}`);
    window.setTimeout(() => setKitFeedback(null), 3200);
  };

  const handleDownloadFullKit = async () => {
    setIsZippingKit(true);
    try {
      const zipName = await downloadAllPlanningPrintablesZip(paperSize);
      setKitFeedback(`Downloaded ${zipName} (all 5 printables)`);
      window.setTimeout(() => setKitFeedback(null), 3500);
    } finally {
      setIsZippingKit(false);
    }
  };

  return (
    <section
      id="extras"
      className="border-t border-[#D8B56D]/15 bg-[#081523]/85 py-16 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl">
          <p className="text-xs font-medium tracking-[0.16em] text-[#D8B56D]">
            Complete Holiday Toolkit
          </p>
          <h2
            className="mt-2 font-display text-3xl font-semibold text-[#F8F1E5] sm:text-4xl"
            style={{ textWrap: 'balance' }}
          >
            Christmas Extras
          </h2>
          <p className="mt-2.5 text-sm leading-relaxed text-[#F8F1E5]/75 sm:text-base">
            Matching stationery tailored to each format—menus, folded tent place
            cards, die-cut gift tags, and varied thank-you cards—alongside 50
            original messages, printable party planners, and a quick-start guide.
          </p>
        </div>

        {/* Interactive Feature Switcher */}
        <div
          role="tablist"
          aria-label="Christmas Extras categories"
          className="mt-8 grid grid-cols-2 gap-2 rounded-2xl border border-[#D8B56D]/20 bg-[#0D2134]/85 p-1.5 sm:inline-grid sm:grid-cols-4"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'stationery'}
            onClick={() => setActiveTab('stationery')}
            className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold whitespace-nowrap transition-colors sm:text-sm ${
              activeTab === 'stationery'
                ? 'bg-[#D8B56D] text-[#091725]'
                : 'text-[#F8F1E5]/80 hover:bg-[#143B2C]/40 hover:text-[#F8F1E5]'
            }`}
          >
            <Sparkles className="h-4 w-4 shrink-0" />
            <span>Stationery (30)</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'messages'}
            onClick={() => setActiveTab('messages')}
            className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold whitespace-nowrap transition-colors sm:text-sm ${
              activeTab === 'messages'
                ? 'bg-[#D8B56D] text-[#091725]'
                : 'text-[#F8F1E5]/80 hover:bg-[#143B2C]/40 hover:text-[#F8F1E5]'
            }`}
          >
            <MessageSquareHeart className="h-4 w-4 shrink-0" />
            <span>50 Messages</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'printables'}
            onClick={() => setActiveTab('printables')}
            className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold whitespace-nowrap transition-colors sm:text-sm ${
              activeTab === 'printables'
                ? 'bg-[#D8B56D] text-[#091725]'
                : 'text-[#F8F1E5]/80 hover:bg-[#143B2C]/40 hover:text-[#F8F1E5]'
            }`}
          >
            <ClipboardList className="h-4 w-4 shrink-0" />
            <span>Party Kit (5 PDFs)</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'guide'}
            onClick={() => setActiveTab('guide')}
            className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold whitespace-nowrap transition-colors sm:text-sm ${
              activeTab === 'guide'
                ? 'bg-[#D8B56D] text-[#091725]'
                : 'text-[#F8F1E5]/80 hover:bg-[#143B2C]/40 hover:text-[#F8F1E5]'
            }`}
          >
            <BookOpen className="h-4 w-4 shrink-0" />
            <span>Quick-Start Guide</span>
          </button>
        </div>

        {/* TAB 1: MATCHING STATIONERY COLLECTION (30 DESIGNS) */}
        {activeTab === 'stationery' && (
          <div className="mt-8 space-y-6">
            {/* 4 Architectural Category Selector Cards */}
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              {STATIONERY_CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const active = stationeryFilter === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setStationeryFilter(cat.id)}
                    className={`flex items-center gap-3.5 rounded-2xl border p-4 text-left transition-colors ${
                      active
                        ? 'border-[#D8B56D] bg-[#143B2C]/55 shadow-[0_8px_24px_rgba(216,181,109,0.12)]'
                        : 'border-[#D8B56D]/20 bg-[#0D2134]/75 hover:border-[#D8B56D]/45 hover:bg-[#0D2134]'
                    }`}
                  >
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${
                        active
                          ? 'border-[#D8B56D]/60 bg-[#D8B56D]/15 text-[#D8B56D]'
                          : 'border-[#D8B56D]/20 bg-[#091725]/70 text-[#D8B56D]/80'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-display text-base font-semibold text-[#F8F1E5] sm:text-lg">
                        {cat.title}
                      </p>
                      <p className="text-xs font-medium text-[#D8B56D]">
                        {cat.countLabel}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Stationery Showcase Frame */}
            <div className="rounded-3xl border border-[#D8B56D]/20 bg-[#0A1A2B]/80 p-5 sm:p-7">
              <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#D8B56D]/15 pb-5">
                <div>
                  <h3 className="font-display text-2xl font-semibold text-[#F8F1E5]">
                    {activeCategoryMeta
                      ? `Christmas ${activeCategoryMeta.title}`
                      : 'All Christmas Stationery (30)'}
                  </h3>
                  <p className="mt-1 text-xs text-[#F8F1E5]/75 sm:text-sm">
                    {activeCategoryMeta
                      ? activeCategoryMeta.subtitle
                      : 'Every category rendered in its authentic shape and printable proportion.'}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  {stationeryFilter === 'place-card' && (
                    <div className="flex items-center gap-1 rounded-lg border border-[#D8B56D]/25 bg-[#091725] p-1">
                      <button
                        type="button"
                        onClick={() => setPlaceScene('card')}
                        className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                          placeScene === 'card'
                            ? 'bg-[#D8B56D] text-[#091725]'
                            : 'text-[#F8F1E5]/75 hover:text-[#F8F1E5]'
                        }`}
                      >
                        Tent Card
                      </button>
                      <button
                        type="button"
                        onClick={() => setPlaceScene('table-mockup')}
                        className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                          placeScene === 'table-mockup'
                            ? 'bg-[#D8B56D] text-[#091725]'
                            : 'text-[#F8F1E5]/75 hover:text-[#F8F1E5]'
                        }`}
                      >
                        <Utensils className="h-3.5 w-3.5" />
                        <span>On Dinner Table</span>
                      </button>
                    </div>
                  )}

                  {stationeryFilter === 'gift-tag' && (
                    <div className="flex items-center gap-1 rounded-lg border border-[#D8B56D]/25 bg-[#091725] p-1">
                      <button
                        type="button"
                        onClick={() => setTagScene('card')}
                        className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                          tagScene === 'card'
                            ? 'bg-[#D8B56D] text-[#091725]'
                            : 'text-[#F8F1E5]/75 hover:text-[#F8F1E5]'
                        }`}
                      >
                        Die-Cut Tag
                      </button>
                      <button
                        type="button"
                        onClick={() => setTagScene('tag-sheet')}
                        className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                          tagScene === 'tag-sheet'
                            ? 'bg-[#D8B56D] text-[#091725]'
                            : 'text-[#F8F1E5]/75 hover:text-[#F8F1E5]'
                        }`}
                      >
                        <Grid2X2 className="h-3.5 w-3.5" />
                        <span>6-Up Cut Sheet</span>
                      </button>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() =>
                      setStationeryFilter(
                        stationeryFilter === 'all' ? 'menu' : 'all'
                      )
                    }
                    className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-[#D8B56D]/30 px-3.5 py-1.5 text-xs font-medium text-[#D8B56D] transition-colors hover:bg-[#143B2C]/50"
                  >
                    <span>
                      {stationeryFilter === 'all'
                        ? 'Browse by Category'
                        : 'View All 30 Designs'}
                    </span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Cards Grid */}
              <div
                className={`mt-6 grid gap-4 sm:gap-5 ${
                  stationeryFilter === 'menu' || stationeryFilter === 'thank-you'
                    ? 'grid-cols-1 min-[440px]:grid-cols-2 lg:grid-cols-5'
                    : stationeryFilter === 'place-card'
                      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                      : 'grid-cols-1 min-[440px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
                }`}
              >
                {visibleStationery.map((tpl) => {
                  const editorHref = `./editor.html?type=${tpl.category}&template=${tpl.id}`;
                  const itemScene: 'card' | 'table-mockup' | 'tag-sheet' =
                    stationeryFilter === 'place-card'
                      ? placeScene
                      : stationeryFilter === 'gift-tag'
                        ? tagScene
                        : 'card';

                  const isWideThumb =
                    (tpl.category === 'place-card' &&
                      (itemScene === 'card' || itemScene === 'table-mockup')) ||
                    (tpl.category === 'thank-you' &&
                      (tpl.canvasWidth || 1200) > (tpl.canvasHeight || 1500));

                  return (
                    <article
                      key={`${tpl.id}-${itemScene}`}
                      className="group flex flex-col overflow-hidden rounded-2xl border border-[#D8B56D]/20 bg-[#0D2134]/85 transition-transform duration-200 hover:-translate-y-1 hover:border-[#D8B56D]/50"
                    >
                      <button
                        type="button"
                        onClick={() => onPreviewTemplate(tpl)}
                        aria-label={`Preview ${tpl.name}`}
                        className={`flex w-full items-center justify-center overflow-hidden bg-[#07121E] ${
                          stationeryFilter === 'menu'
                            ? 'p-0'
                            : stationeryFilter === 'place-card'
                              ? 'p-3'
                              : 'aspect-[4/4.6] p-3'
                        }`}
                      >
                        <div
                          className={`overflow-hidden rounded-lg shadow-[0_12px_28px_rgba(0,0,0,0.45)] transition-transform duration-300 group-hover:scale-[1.02] ${
                            stationeryFilter === 'menu'
                              ? 'w-full rounded-none'
                              : isWideThumb
                                ? 'w-full'
                                : 'h-full max-h-[245px] w-auto max-w-full'
                          }`}
                        >
                          <CardThumbnail
                            template={tpl}
                            scene={itemScene}
                            width={isWideThumb ? 560 : 420}
                          />
                        </div>
                      </button>

                      <div className="flex flex-1 flex-col justify-between p-3.5 sm:p-4">
                        <div>
                          <p className="truncate text-[11px] font-medium text-[#D8B56D]">
                            {tpl.styleLabel}
                          </p>
                          <h4 className="mt-1 font-display text-base font-semibold text-[#F8F1E5]">
                            {tpl.name}
                          </h4>
                        </div>

                        <div className="mt-3.5 flex gap-2">
                          <button
                            type="button"
                            onClick={() => onPreviewTemplate(tpl)}
                            className="inline-flex min-h-9 flex-1 items-center justify-center gap-1 rounded-lg border border-[#D8B56D]/30 px-2.5 py-1.5 text-xs font-medium text-[#F8F1E5] hover:bg-[#143B2C]/50"
                          >
                            <Eye className="h-3.5 w-3.5 text-[#D8B56D]" />
                            <span>Preview</span>
                          </button>
                          <a
                            href={editorHref}
                            className="inline-flex min-h-9 flex-1 items-center justify-center gap-1 rounded-lg bg-[#D8B56D] px-2.5 py-1.5 text-xs font-semibold text-[#091725] hover:bg-[#E4C788]"
                          >
                            <span>Customise</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                          </a>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>

            {/* Cohesive Value Bar */}
            <div className="grid gap-4 rounded-2xl border border-[#D8B56D]/20 bg-[#0D2134]/75 p-5 sm:grid-cols-2 lg:grid-cols-4">
              <div className="flex items-center gap-3">
                <Layers className="h-5 w-5 shrink-0 text-[#D8B56D]" />
                <div>
                  <p className="text-sm font-semibold text-[#F8F1E5]">
                    Editable Text
                  </p>
                  <p className="text-xs text-[#F8F1E5]/70">
                    Personalise every course, guest & note
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Palette className="h-5 w-5 shrink-0 text-[#D8B56D]" />
                <div>
                  <p className="text-sm font-semibold text-[#F8F1E5]">
                    Cohesive Collection
                  </p>
                  <p className="text-xs text-[#F8F1E5]/70">
                    Distinct shapes, shared holiday palette
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Download className="h-5 w-5 shrink-0 text-[#D8B56D]" />
                <div>
                  <p className="text-sm font-semibold text-[#F8F1E5]">
                    Print Ready
                  </p>
                  <p className="text-xs text-[#F8F1E5]/70">
                    High-res PNG & clean cardstock PDFs
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Printer className="h-5 w-5 shrink-0 text-[#D8B56D]" />
                <div>
                  <p className="text-sm font-semibold text-[#F8F1E5]">
                    Multiple Formats
                  </p>
                  <p className="text-xs text-[#F8F1E5]/70">
                    A4, US Letter, 5×7, 4×6 & cut sheets
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: 50 ORIGINAL CHRISTMAS MESSAGES */}
        {activeTab === 'messages' && (
          <div className="mt-8">
            <MessageLibraryView />
          </div>
        )}

        {/* TAB 3: PARTY PLANNING PRINTABLES MINI KIT */}
        {activeTab === 'printables' && (
          <div className="mt-8 space-y-6">
            <div className="flex flex-col justify-between gap-4 rounded-2xl border border-[#D8B56D]/25 bg-[#0D2134]/85 p-5 sm:flex-row sm:items-center">
              <div>
                <h3 className="font-display text-lg font-semibold text-[#F8F1E5]">
                  Christmas Party Planning Mini Kit
                </h3>
                <p className="mt-1 text-xs text-[#F8F1E5]/75">
                  Five crisp, handwriting-friendly PDF sheets designed to print cleanly at home.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1 rounded-lg bg-[#091725] p-1">
                  <button
                    type="button"
                    onClick={() => setPaperSize('letter')}
                    className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                      paperSize === 'letter'
                        ? 'bg-[#D8B56D] text-[#091725]'
                        : 'text-[#F8F1E5]/75 hover:text-[#F8F1E5]'
                    }`}
                  >
                    US Letter
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaperSize('a4')}
                    className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                      paperSize === 'a4'
                        ? 'bg-[#D8B56D] text-[#091725]'
                        : 'text-[#F8F1E5]/75 hover:text-[#F8F1E5]'
                    }`}
                  >
                    A4 Size
                  </button>
                </div>

                <button
                  type="button"
                  disabled={isZippingKit}
                  onClick={() => void handleDownloadFullKit()}
                  className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#D8B56D] px-4 py-2 text-xs font-semibold text-[#091725] hover:bg-[#E4C788] disabled:opacity-60"
                >
                  <Archive className="h-4 w-4" />
                  <span>
                    {isZippingKit
                      ? 'Packaging ZIP...'
                      : 'Download All 5 (ZIP)'}
                  </span>
                </button>
              </div>
            </div>

            {kitFeedback && (
              <div
                role="status"
                className="flex items-center gap-2 rounded-xl border border-[#1D4A35] bg-[#143B2C]/65 px-4 py-3 text-xs text-[#F8F1E5]"
              >
                <Check className="h-4 w-4 text-[#D8B56D]" />
                <span>{kitFeedback}</span>
              </div>
            )}

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {PARTY_PLANNING_PRINTABLES.map((item, idx) => (
                <article
                  key={item.id}
                  className="flex flex-col justify-between rounded-2xl border border-[#D8B56D]/20 bg-[#0D2134]/85 p-6"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-display text-2xl font-semibold text-[#D8B56D] tabular-nums">
                        0{idx + 1}
                      </span>
                      <FileText className="h-5 w-5 text-[#D8B56D]/80" />
                    </div>
                    <p className="mt-3 text-[11px] font-medium text-[#B9D9EC]/80">
                      {item.subtitle}
                    </p>
                    <h4 className="mt-1 font-display text-lg font-semibold text-[#F8F1E5]">
                      {item.title}
                    </h4>
                    <p className="mt-2 text-xs leading-relaxed text-[#F8F1E5]/75">
                      {item.description}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDownloadSinglePrintable(item.id)}
                    className="mt-5 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-lg border border-[#D8B56D]/40 bg-[#143B2C]/45 px-4 py-2 text-xs font-semibold text-[#F8F1E5] transition-colors hover:bg-[#D8B56D] hover:text-[#091725]"
                  >
                    <Download className="h-4 w-4" />
                    <span>
                      Download PDF ({paperSize === 'letter' ? 'US Letter' : 'A4'})
                    </span>
                  </button>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: PREMIUM QUICK-START GUIDE */}
        {activeTab === 'guide' && <QuickStartGuideView />}
      </div>
    </section>
  );
};

const GUIDE_TOPICS: {
  number: string;
  title: string;
  body: string;
  tip: string;
}[] = [
  {
    number: '01',
    title: 'Choosing a Design',
    body: 'Browse Christmas Invitations, Wishes Cards, or the matching Stationery Suite (Menus, Place Cards, Gift Tags, Thank-You Cards). Click Preview to inspect any card up close—including table & cut-sheet views—or Customise to open it in the studio editor.',
    tip: 'Tip: Pick matching designs (for example, Classic Christmas Elegance invitation + Emerald & Gold menu and place cards) for a cohesive celebration table.',
  },
  {
    number: '02',
    title: 'Customising Text & Omitting Optional Lines',
    body: 'On desktop, edit fields in the left sidebar and watch the live card update immediately on the right. On mobile, tap Customize It at the bottom, make your edits, then tap Preview Card. Any optional field left empty disappears cleanly without leaving blank gaps.',
    tip: 'Tip: Need inspiration? Click “Browse 50 Messages” inside the editor to insert a polished greeting in one click, then tweak any word you like.',
  },
  {
    number: '03',
    title: 'Changing Fonts, Colours & Alignment',
    body: 'Open the Design Options section inside the editor to switch between editorial serif, festive script, clean modern sans, or bold display fonts. Tap any curated colour swatch—or use the custom colour picker—to adjust text and background tones.',
    tip: 'Tip: Click “Use Default” anytime to restore the designer’s original metallic gold or ink pairing.',
  },
  {
    number: '04',
    title: 'Uploading & Cropping Personal Photos',
    body: 'Open the Photo section and drag and drop a JPG, PNG, or WebP photograph (or tap Browse Photos on your phone). Drag directly on the thumbnail preview or use the Zoom, Horizontal, and Vertical sliders to frame faces neatly inside the card’s window.',
    tip: 'Privacy note: Photos stay 100% on your device and are never uploaded to any server.',
  },
  {
    number: '05',
    title: 'Personalising Guest Names',
    body: 'Type a guest or recipient name into the Guest Name or Recipient Name field to create a personal salutation (“Dear Oliver,”). For place cards and gift tags, enter each person’s name and table or “To / From” note—long names auto-fit cleanly.',
    tip: 'Tip: Leave Guest Name blank if you are creating one general invitation to share on WhatsApp or social media.',
  },
  {
    number: '06',
    title: 'Downloading High-Res PNGs',
    body: 'Click Download PNG in the editor’s bottom bar to export a crisp 2× HD image matched to your card’s true proportions—ready for digital sharing on phones, email invitations, or crisp photo-lab printing.',
    tip: 'Filenames are generated automatically from your guest name (e.g. christmas-invitation-oliver.png).',
  },
  {
    number: '07',
    title: 'Bulk Downloading Personalised Cards (ZIP)',
    body: 'Click Bulk ZIP Export in the editor, paste or type one guest name per line (e.g. Oliver, Ethan, Hannah, Liam), choose Print HD or Standard resolution, and click Generate & Download ZIP. Santa Studio renders every card automatically.',
    tip: 'You can cancel mid-export anytime, and your browser stays responsive while cards render.',
  },
  {
    number: '08',
    title: 'Exporting Print-Ready PDFs & Cut Sheets',
    body: 'Click Export PDF in the editor to pick exact physical print dimensions: 5 × 7 inches, 4 × 6 inches, US Letter, or A4. For Gift Tags and Place Cards on US Letter or A4, switch to Multi-Up Sheet mode for 6 tags or 4 folded tent place cards per page with cut and fold guides.',
    tip: 'You can type multiple names in the PDF sheet modal to print a different guest on each tag or tent place card!',
  },
  {
    number: '09',
    title: 'Recommended Printing Settings',
    body: 'Open your downloaded PDF in Adobe Reader, Apple Preview, or your browser. Set Scale to “100%” or “Actual Size” (never “Fit to Page”) so dimensions remain exact. Print on 250–300 gsm matte or textured cotton cardstock.',
    tip: 'For tent place cards, score lightly along the dashed center fold line with a butter knife or ruler before folding.',
  },
];

const QuickStartGuideView: React.FC = () => (
  <div className="mt-8 space-y-6">
    <div className="flex flex-col justify-between gap-4 rounded-2xl border border-[#D8B56D]/25 bg-[#0D2134]/85 p-6 sm:flex-row sm:items-center">
      <div>
        <h3 className="font-display text-xl font-semibold text-[#F8F1E5]">
          Santa Studio Quick-Start Guide
        </h3>
        <p className="mt-1 text-sm text-[#F8F1E5]/75">
          Everything you need to design, personalise, and print like a pro—no design software required.
        </p>
      </div>
      <div className="flex items-center gap-2 text-xs text-[#D8B56D]">
        <Printer className="h-4 w-4" />
        <span>9 Simple Steps · Works Offline</span>
      </div>
    </div>

    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {GUIDE_TOPICS.map((topic) => (
        <article
          key={topic.number}
          className="flex flex-col justify-between rounded-2xl border border-[#D8B56D]/20 bg-[#0D2134]/85 p-6"
        >
          <div>
            <span className="font-display text-2xl font-semibold text-[#D8B56D] tabular-nums">
              {topic.number}
            </span>
            <h4 className="mt-2 font-display text-lg font-semibold text-[#F8F1E5]">
              {topic.title}
            </h4>
            <p className="mt-2.5 text-xs leading-relaxed text-[#F8F1E5]/80 sm:text-sm">
              {topic.body}
            </p>
          </div>
          <p className="mt-4 border-t border-[#D8B56D]/15 pt-3 text-xs leading-relaxed text-[#B9D9EC]/85">
            {topic.tip}
          </p>
        </article>
      ))}
    </div>
  </div>
);
