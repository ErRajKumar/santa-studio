import React, { useState } from 'react';
import {
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Download,
  Eye,
  Palette,
  SlidersHorizontal,
} from 'lucide-react';
import { CardThumbnail } from '../components/CardThumbnail';
import { ChristmasExtrasSection } from '../components/ChristmasExtrasSection';
import { Navbar } from '../components/Navbar';
import { PreviewModal } from '../components/PreviewModal';
import { WinterAtmosphere } from '../components/WinterAtmosphere';
import {
  GIFT_TAG_TEMPLATES,
  MENU_TEMPLATES,
} from '../templates/stationeryData';
import {
  INVITATION_TEMPLATES,
  WISHES_TEMPLATES,
} from '../templates/templatesData';
import { TemplateConfig } from '../types/card';

export const HomePage: React.FC = () => {
  const [showAllInvitations, setShowAllInvitations] = useState(false);
  const [showAllWishes, setShowAllWishes] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<TemplateConfig | null>(
    null
  );

  const visibleInvitations = showAllInvitations
    ? INVITATION_TEMPLATES
    : INVITATION_TEMPLATES.slice(0, 6);

  const visibleWishes = showAllWishes
    ? WISHES_TEMPLATES
    : WISHES_TEMPLATES.slice(0, 6);

  const heroTemplates = [
    INVITATION_TEMPLATES[0],
    WISHES_TEMPLATES[8],
    INVITATION_TEMPLATES[2],
    WISHES_TEMPLATES[1],
  ];

  return (
    <div id="home" className="relative min-h-screen bg-[#091725] text-[#F8F1E5]">
      <WinterAtmosphere variant="homepage" />

      <div className="relative z-10 flex min-h-screen flex-col">
        <Navbar />

        <main className="flex-1">
          {/* HERO SECTION */}
          <section className="mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 sm:pb-24 sm:pt-16 lg:px-8 lg:pt-20">
            <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
              {/* Left Copy Column */}
              <div className="lg:col-span-6">
                <p className="text-xs font-medium tracking-[0.18em] text-[#D8B56D]">
                  Santa Studio Atelier
                </p>

                <h1
                  className="mt-4 font-display font-semibold leading-[1.08] tracking-tight text-[#F8F1E5]"
                  style={{
                    fontSize: 'clamp(2.35rem, 4.4vw, 4.1rem)',
                    textWrap: 'balance',
                  }}
                >
                  Make the season{' '}
                  <em className="font-display italic font-normal text-[#D8B56D]">
                    unforgettable
                  </em>
                  .
                </h1>

                <p className="mt-5 max-w-xl text-base leading-relaxed text-[#F8F1E5]/80 sm:text-lg">
                  Create beautiful, personalised Christmas cards and invitations
                  in minutes. Celebrate your moments with designs made to feel
                  special.
                </p>

                {/* Primary & Secondary CTAs */}
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                  <a
                    href="#invitations"
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#D8B56D] px-6 py-3 text-sm font-semibold text-[#091725] whitespace-nowrap transition-all duration-200 hover:bg-[#E4C788] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F8F1E5]"
                  >
                    <span>Explore Invitation Cards</span>
                    <ArrowRight className="h-4 w-4" />
                  </a>
                  <a
                    href="#wishes"
                    className="inline-flex min-h-12 items-center justify-center rounded-lg border border-[#D8B56D]/40 bg-[#143B2C]/35 px-6 py-3 text-sm font-semibold text-[#F8F1E5] whitespace-nowrap transition-colors duration-200 hover:border-[#D8B56D] hover:bg-[#143B2C]/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D8B56D]"
                  >
                    Explore Wishes Cards
                  </a>
                </div>

                {/* Three Editorial Highlights */}
                <div className="mt-10 grid grid-cols-1 gap-4 border-t border-[#D8B56D]/20 pt-6 sm:grid-cols-3 sm:gap-6">
                  <div>
                    <p className="font-display text-lg font-semibold text-[#F8F1E5]">
                      50 Holiday Designs
                    </p>
                    <p className="mt-1 text-xs text-[#B9D9EC]/75">
                      20 cards & 30 matching stationery pieces
                    </p>
                  </div>
                  <div>
                    <p className="font-display text-lg font-semibold text-[#F8F1E5]">
                      50 Ready Messages
                    </p>
                    <p className="mt-1 text-xs text-[#B9D9EC]/75">
                      One-click insert, plus custom photos & type
                    </p>
                  </div>
                  <div>
                    <p className="font-display text-lg font-semibold text-[#F8F1E5]">
                      Print-Ready Exports
                    </p>
                    <p className="mt-1 text-xs text-[#B9D9EC]/75">
                      PNGs, 5×7 & Letter/A4 PDFs, & guest ZIPs
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Mockup Composition */}
              <div className="lg:col-span-6">
                {/* Desktop Overlapping Perspective Mockups */}
                <div className="relative mx-auto hidden h-[470px] max-w-[540px] lg:block">
                  <button
                    type="button"
                    onClick={() => setPreviewTemplate(heroTemplates[2])}
                    aria-label={`Preview ${heroTemplates[2].name}`}
                    className="animate-hero-float absolute left-2 top-16 w-[210px] -rotate-8 overflow-hidden rounded-xl border border-[#D8B56D]/30 shadow-[0_24px_50px_rgba(0,0,0,0.55)] transition-transform duration-300 hover:z-30 hover:scale-105"
                    style={{ animationDelay: '-2.2s' }}
                  >
                    <CardThumbnail
                      template={heroTemplates[2]}
                      width={420}
                      height={525}
                    />
                  </button>

                  <button
                    type="button"
                    onClick={() => setPreviewTemplate(heroTemplates[1])}
                    aria-label={`Preview ${heroTemplates[1].name}`}
                    className="animate-hero-float absolute right-2 top-14 w-[215px] rotate-8 overflow-hidden rounded-xl border border-[#D8B56D]/30 shadow-[0_24px_50px_rgba(0,0,0,0.55)] transition-transform duration-300 hover:z-30 hover:scale-105"
                    style={{ animationDelay: '-4.1s' }}
                  >
                    <CardThumbnail
                      template={heroTemplates[1]}
                      width={420}
                      height={525}
                    />
                  </button>

                  <button
                    type="button"
                    onClick={() => setPreviewTemplate(heroTemplates[3])}
                    aria-label={`Preview ${heroTemplates[3].name}`}
                    className="animate-hero-float absolute bottom-2 right-14 z-10 w-[205px] rotate-3 overflow-hidden rounded-xl border border-[#D8B56D]/35 shadow-[0_24px_50px_rgba(0,0,0,0.6)] transition-transform duration-300 hover:z-30 hover:scale-105"
                    style={{ animationDelay: '-1.3s' }}
                  >
                    <CardThumbnail
                      template={heroTemplates[3]}
                      width={420}
                      height={525}
                    />
                  </button>

                  <button
                    type="button"
                    onClick={() => setPreviewTemplate(heroTemplates[0])}
                    aria-label={`Preview ${heroTemplates[0].name}`}
                    className="animate-hero-float absolute left-24 top-2 z-20 w-[245px] -rotate-2 overflow-hidden rounded-xl border border-[#D8B56D]/50 shadow-[0_30px_65px_rgba(0,0,0,0.7)] transition-transform duration-300 hover:z-30 hover:scale-105"
                  >
                    <CardThumbnail
                      template={heroTemplates[0]}
                      width={480}
                      height={600}
                    />
                  </button>
                </div>

                {/* Mobile & Tablet Compact Card Showcase */}
                <div className="mx-auto grid max-w-md grid-cols-2 gap-3.5 lg:hidden">
                  <button
                    type="button"
                    onClick={() => setPreviewTemplate(heroTemplates[0])}
                    className="overflow-hidden rounded-xl border border-[#D8B56D]/35 shadow-xl transition-transform active:scale-[0.98]"
                  >
                    <CardThumbnail
                      template={heroTemplates[0]}
                      width={360}
                      height={450}
                    />
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewTemplate(heroTemplates[1])}
                    className="mt-4 overflow-hidden rounded-xl border border-[#D8B56D]/35 shadow-xl transition-transform active:scale-[0.98]"
                  >
                    <CardThumbnail
                      template={heroTemplates[1]}
                      width={360}
                      height={450}
                    />
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* INVITATION CARDS COLLECTION */}
          <section
            id="invitations"
            className="border-t border-[#D8B56D]/15 bg-[#0A1A2A]/70 py-16 sm:py-24"
          >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-medium tracking-[0.16em] text-[#D8B56D]">
                    Invitation Collection · 10 Designs
                  </p>
                  <h2
                    className="mt-2 font-display text-3xl font-semibold text-[#F8F1E5] sm:text-4xl"
                    style={{ textWrap: 'balance' }}
                  >
                    Christmas Invitations
                  </h2>
                  <p className="mt-2 max-w-xl text-sm text-[#F8F1E5]/75 sm:text-base">
                    Make every celebration worth remembering.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAllInvitations((v) => !v)}
                  className="inline-flex min-h-10 items-center gap-1.5 self-start text-sm font-medium text-[#D8B56D] underline-offset-4 hover:underline sm:self-auto"
                >
                  <span>
                    {showAllInvitations
                      ? 'Show Featured (6)'
                      : 'View All Invitations (10)'}
                  </span>
                  {showAllInvitations ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </button>
              </div>

              <div className="mt-8 grid grid-cols-1 gap-4 min-[340px]:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8">
                {visibleInvitations.map((tpl) => (
                  <TemplateGalleryCard
                    key={tpl.id}
                    template={tpl}
                    onPreview={() => setPreviewTemplate(tpl)}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* WISHES CARDS COLLECTION */}
          <section
            id="wishes"
            className="border-t border-[#D8B56D]/15 py-16 sm:py-24"
          >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-medium tracking-[0.16em] text-[#D8B56D]">
                    Greeting Cards · 10 Designs
                  </p>
                  <h2
                    className="mt-2 font-display text-3xl font-semibold text-[#F8F1E5] sm:text-4xl"
                    style={{ textWrap: 'balance' }}
                  >
                    Spread Christmas Joy
                  </h2>
                  <p className="mt-2 max-w-xl text-sm text-[#F8F1E5]/75 sm:text-base">
                    Send a little happiness to the people who matter.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAllWishes((v) => !v)}
                  className="inline-flex min-h-10 items-center gap-1.5 self-start text-sm font-medium text-[#D8B56D] underline-offset-4 hover:underline sm:self-auto"
                >
                  <span>
                    {showAllWishes
                      ? 'Show Featured (6)'
                      : 'View All Wishes Cards (10)'}
                  </span>
                  {showAllWishes ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </button>
              </div>

              <div className="mt-8 grid grid-cols-1 gap-4 min-[340px]:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8">
                {visibleWishes.map((tpl) => (
                  <TemplateGalleryCard
                    key={tpl.id}
                    template={tpl}
                    onPreview={() => setPreviewTemplate(tpl)}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* CHRISTMAS EXTRAS TOOLKIT */}
          <ChristmasExtrasSection onPreviewTemplate={setPreviewTemplate} />

          {/* HOW IT WORKS */}
          <section
            id="how-it-works"
            className="border-t border-[#D8B56D]/15 bg-[#0A1A2A]/75 py-16 sm:py-24"
          >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="max-w-2xl">
                <p className="text-xs font-medium tracking-[0.16em] text-[#D8B56D]">
                  Simple Studio Workflow
                </p>
                <h2
                  className="mt-2 font-display text-3xl font-semibold text-[#F8F1E5] sm:text-4xl"
                  style={{ textWrap: 'balance' }}
                >
                  Three effortless steps to your finished card
                </h2>
              </div>

              <div className="mt-10 grid gap-6 md:grid-cols-3 md:gap-8">
                <div className="rounded-2xl border border-[#D8B56D]/20 bg-[#0D2134]/75 p-6 sm:p-8">
                  <div className="flex items-center justify-between">
                    <span className="font-display text-3xl font-semibold text-[#D8B56D] tabular-nums">
                      01
                    </span>
                    <Palette className="h-5 w-5 text-[#D8B56D]/80" />
                  </div>
                  <h3 className="mt-5 font-display text-xl font-semibold text-[#F8F1E5]">
                    Choose Your Design
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#F8F1E5]/75">
                    Explore 50 seasonal designs across invitations, greeting
                    cards, menus, place cards, gift tags, and thank-you notes.
                  </p>
                </div>

                <div className="rounded-2xl border border-[#D8B56D]/20 bg-[#0D2134]/75 p-6 sm:p-8">
                  <div className="flex items-center justify-between">
                    <span className="font-display text-3xl font-semibold text-[#D8B56D] tabular-nums">
                      02
                    </span>
                    <SlidersHorizontal className="h-5 w-5 text-[#D8B56D]/80" />
                  </div>
                  <h3 className="mt-5 font-display text-xl font-semibold text-[#F8F1E5]">
                    Make It Personal
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#F8F1E5]/75">
                    Add your name, pick from 50 holiday messages, upload a
                    photograph, and preview every edit live.
                  </p>
                </div>

                <div className="rounded-2xl border border-[#D8B56D]/20 bg-[#0D2134]/75 p-6 sm:p-8">
                  <div className="flex items-center justify-between">
                    <span className="font-display text-3xl font-semibold text-[#D8B56D] tabular-nums">
                      03
                    </span>
                    <Download className="h-5 w-5 text-[#D8B56D]/80" />
                  </div>
                  <h3 className="mt-5 font-display text-xl font-semibold text-[#F8F1E5]">
                    Download and Print
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#F8F1E5]/75">
                    Save print-ready PNGs, exact-size 5×7, 4×6, Letter & A4 PDFs,
                    or bulk personalised guest ZIP archives.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* FINAL EDITORIAL SHOWCASE CTA */}
          <section className="border-t border-[#D8B56D]/15 py-16 sm:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="relative overflow-hidden rounded-3xl border border-[#D8B56D]/30 bg-gradient-to-br from-[#0F2C23] via-[#0B1E2E] to-[#08131E] p-7 sm:p-11 lg:p-14">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#D8B56D]/12 blur-3xl"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -bottom-24 -left-20 h-80 w-80 rounded-full bg-[#143B2C]/45 blur-3xl"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-3 rounded-2xl border border-[#D8B56D]/15"
                />

                <div className="relative grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
                  {/* Left Editorial Story & Action Column */}
                  <div className="lg:col-span-6">
                    <p className="text-xs font-medium tracking-[0.18em] text-[#D8B56D]">
                      Santa Studio Atelier · Ready in Minutes
                    </p>
                    <h2
                      className="mt-3 font-display font-semibold leading-[1.1] text-[#F8F1E5]"
                      style={{
                        fontSize: 'clamp(1.9rem, 3.2vw, 2.85rem)',
                        textWrap: 'balance',
                      }}
                    >
                      Your Christmas story deserves a{' '}
                      <em className="font-display italic font-normal text-[#D8B56D]">
                        beautiful
                      </em>{' '}
                      card.
                    </h2>
                    <p className="mt-4 max-w-xl text-sm leading-relaxed text-[#F8F1E5]/80 sm:text-base">
                      Pair your favourite family photograph with timeless serif
                      typography, curated holiday wishes, and matching dinner
                      stationery—customised privately in your browser with zero
                      sign-up.
                    </p>

                    <div className="mt-7 divide-y divide-[#D8B56D]/15 border-y border-[#D8B56D]/15 text-xs sm:text-sm">
                      <div className="flex flex-wrap items-baseline justify-between gap-2 py-3">
                        <span className="font-semibold text-[#F8F1E5]">
                          Custom Photo Frames
                        </span>
                        <span className="text-[#B9D9EC]/80">
                          Polaroid, arch & medallion slots with live crop
                        </span>
                      </div>
                      <div className="flex flex-wrap items-baseline justify-between gap-2 py-3">
                        <span className="font-semibold text-[#F8F1E5]">
                          50 Ready Holiday Messages
                        </span>
                        <span className="text-[#B9D9EC]/80">
                          One-click card insert across 6 seasonal tones
                        </span>
                      </div>
                      <div className="flex flex-wrap items-baseline justify-between gap-2 py-3">
                        <span className="font-semibold text-[#F8F1E5]">
                          Print-Ready Suite Exports
                        </span>
                        <span className="text-[#B9D9EC]/80">
                          5×7, 4×6, US Letter & A4 PDFs plus guest ZIPs
                        </span>
                      </div>
                    </div>

                    <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                      <a
                        href="./editor.html?type=invitation&template=invitation-01"
                        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#D8B56D] px-6 py-3 text-sm font-semibold text-[#091725] whitespace-nowrap transition-colors hover:bg-[#E4C788] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F8F1E5]"
                      >
                        <span>Create Your Christmas Card</span>
                        <ArrowRight className="h-4 w-4" />
                      </a>
                      <a
                        href="#extras"
                        className="inline-flex min-h-12 items-center justify-center rounded-lg border border-[#D8B56D]/40 bg-[#091725]/55 px-6 py-3 text-sm font-semibold text-[#F8F1E5] whitespace-nowrap transition-colors hover:border-[#D8B56D] hover:bg-[#143B2C]/60"
                      >
                        Explore Matching Stationery
                      </a>
                    </div>
                  </div>

                  {/* Right Interactive Layered Suite Preview */}
                  <div className="lg:col-span-6">
                    <div className="relative mx-auto hidden h-[400px] max-w-[500px] sm:block">
                      {/* Left Menu Card */}
                      <button
                        type="button"
                        onClick={() => setPreviewTemplate(MENU_TEMPLATES[0])}
                        aria-label={`Preview ${MENU_TEMPLATES[0].name}`}
                        className="absolute left-3 top-14 z-10 w-[185px] -rotate-8 overflow-hidden rounded-xl border border-[#D8B56D]/35 bg-[#07121E] shadow-[0_24px_48px_rgba(0,0,0,0.55)] transition-transform duration-200 hover:z-30 hover:scale-105"
                      >
                        <CardThumbnail
                          template={MENU_TEMPLATES[0]}
                          width={340}
                        />
                      </button>

                      {/* Right Scalloped Gift Tag */}
                      <button
                        type="button"
                        onClick={() => setPreviewTemplate(GIFT_TAG_TEMPLATES[0])}
                        aria-label={`Preview ${GIFT_TAG_TEMPLATES[0].name}`}
                        className="absolute right-4 top-16 z-10 w-[165px] rotate-8 overflow-hidden rounded-xl border border-[#D8B56D]/35 bg-[#07121E] shadow-[0_24px_48px_rgba(0,0,0,0.55)] transition-transform duration-200 hover:z-30 hover:scale-105"
                      >
                        <CardThumbnail
                          template={GIFT_TAG_TEMPLATES[0]}
                          width={320}
                        />
                      </button>

                      {/* Center Photo Frame Holiday Keepsake */}
                      <button
                        type="button"
                        onClick={() => setPreviewTemplate(WISHES_TEMPLATES[6])}
                        aria-label={`Preview ${WISHES_TEMPLATES[6].name}`}
                        className="absolute left-1/2 top-2 z-20 w-[235px] -translate-x-1/2 overflow-hidden rounded-xl border border-[#D8B56D]/55 bg-[#07121E] shadow-[0_30px_65px_rgba(0,0,0,0.72)] transition-transform duration-200 hover:z-30 hover:scale-[1.03]"
                      >
                        <CardThumbnail
                          template={WISHES_TEMPLATES[6]}
                          width={420}
                        />
                      </button>
                    </div>

                    {/* Compact Mobile Grid */}
                    <div className="mx-auto grid max-w-md grid-cols-3 items-center gap-2.5 sm:hidden">
                      <button
                        type="button"
                        onClick={() => setPreviewTemplate(MENU_TEMPLATES[0])}
                        aria-label={`Preview ${MENU_TEMPLATES[0].name}`}
                        className="overflow-hidden rounded-lg border border-[#D8B56D]/30 shadow-lg"
                      >
                        <CardThumbnail
                          template={MENU_TEMPLATES[0]}
                          width={240}
                        />
                      </button>
                      <button
                        type="button"
                        onClick={() => setPreviewTemplate(WISHES_TEMPLATES[6])}
                        aria-label={`Preview ${WISHES_TEMPLATES[6].name}`}
                        className="overflow-hidden rounded-lg border border-[#D8B56D]/50 shadow-xl"
                      >
                        <CardThumbnail
                          template={WISHES_TEMPLATES[6]}
                          width={260}
                        />
                      </button>
                      <button
                        type="button"
                        onClick={() => setPreviewTemplate(GIFT_TAG_TEMPLATES[0])}
                        aria-label={`Preview ${GIFT_TAG_TEMPLATES[0].name}`}
                        className="overflow-hidden rounded-lg border border-[#D8B56D]/30 shadow-lg"
                      >
                        <CardThumbnail
                          template={GIFT_TAG_TEMPLATES[0]}
                          width={240}
                        />
                      </button>
                    </div>

                    <p className="mt-4 text-center text-xs text-[#B9D9EC]/75">
                      Click any card to preview <span aria-hidden="true">·</span>{' '}
                      Emerald Dinner Menu, Family Photo Card & Die-Cut Gift Tag
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* FOOTER */}
        <footer className="border-t border-[#D8B56D]/15 bg-[#07121E]/95 py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-10 md:grid-cols-4">
              <div className="md:col-span-2">
                <a
                  href="#home"
                  className="inline-flex items-center gap-2 font-display text-xl font-semibold text-[#F8F1E5]"
                >
                  <svg
                    width="18"
                    height="18"
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
                <p className="mt-3 max-w-md text-sm leading-relaxed text-[#F8F1E5]/70">
                  A seasonal design studio for crafting bespoke Christmas
                  invitations and greeting cards right inside your browser.
                </p>
              </div>

              <div>
                <h3 className="text-xs font-semibold tracking-wider text-[#D8B56D]">
                  Explore
                </h3>
                <ul className="mt-3 space-y-2 text-sm text-[#F8F1E5]/75">
                  <li>
                    <a href="#invitations" className="hover:text-[#D8B56D]">
                      Invitation Cards
                    </a>
                  </li>
                  <li>
                    <a href="#wishes" className="hover:text-[#D8B56D]">
                      Wishes Cards
                    </a>
                  </li>
                  <li>
                    <a href="#extras" className="hover:text-[#D8B56D]">
                      Christmas Extras
                    </a>
                  </li>
                  <li>
                    <a href="#how-it-works" className="hover:text-[#D8B56D]">
                      How It Works
                    </a>
                  </li>
                  <li>
                    <a
                      href="./editor.html?type=invitation&template=invitation-01"
                      className="hover:text-[#D8B56D]"
                    >
                      Open Card Editor
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xs font-semibold tracking-wider text-[#D8B56D]">
                  Privacy & Contact
                </h3>
                <p className="mt-3 text-xs leading-relaxed text-[#F8F1E5]/70">
                  All photographs, guest names, and drafts stay locally on your
                  device. Nothing is ever uploaded to a server.
                </p>
                <p className="mt-3 text-xs text-[#B9D9EC]/80">
                  Contact: hello@santastudio.example
                </p>
              </div>
            </div>

            <div className="mt-10 flex flex-col items-start justify-between gap-2 border-t border-[#D8B56D]/15 pt-6 text-xs text-[#F8F1E5]/55 sm:flex-row sm:items-center">
              <p>© {new Date().getFullYear()} Santa Studio. Make the season unforgettable.</p>
              <p>Client-side static edition · Works offline & on GitHub Pages</p>
            </div>
          </div>
        </footer>
      </div>

      <PreviewModal
        template={previewTemplate}
        onClose={() => setPreviewTemplate(null)}
      />
    </div>
  );
};

interface TemplateGalleryCardProps {
  template: TemplateConfig;
  onPreview: () => void;
}

const TemplateGalleryCard: React.FC<TemplateGalleryCardProps> = ({
  template,
  onPreview,
}) => {
  const editorHref = `./editor.html?type=${template.category}&template=${template.id}`;

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-[#D8B56D]/20 bg-[#0D2134]/85 transition-transform duration-200 hover:-translate-y-1 hover:border-[#D8B56D]/45">
      <button
        type="button"
        onClick={onPreview}
        aria-label={`Preview ${template.name}`}
        className="relative block w-full overflow-hidden bg-[#07121E] text-left focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#D8B56D]"
      >
        <CardThumbnail
          template={template}
          width={480}
          height={600}
          className="transition-transform duration-300 group-hover:scale-[1.02]"
        />
      </button>

      <div className="flex flex-1 flex-col justify-between p-3.5 sm:p-5">
        <div>
          <p className="truncate text-[11px] font-medium text-[#D8B56D] sm:text-xs">
            {template.styleLabel}
          </p>
          <h3 className="mt-1 font-display text-base font-semibold text-[#F8F1E5] sm:text-lg">
            {template.name}
          </h3>
          <p className="mt-1.5 line-clamp-2 hidden text-xs leading-relaxed text-[#F8F1E5]/70 sm:block">
            {template.description}
          </p>
        </div>

        <div className="mt-4 flex flex-col gap-2 min-[460px]:flex-row">
          <button
            type="button"
            onClick={onPreview}
            className="inline-flex min-h-10 flex-1 items-center justify-center gap-1.5 rounded-lg border border-[#D8B56D]/30 px-3 py-2 text-xs font-medium text-[#F8F1E5] whitespace-nowrap transition-colors hover:bg-[#143B2C]/50"
          >
            <Eye className="h-3.5 w-3.5 text-[#D8B56D]" />
            <span>Preview</span>
          </button>
          <a
            href={editorHref}
            className="inline-flex min-h-10 flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#D8B56D] px-3 py-2 text-xs font-semibold text-[#091725] whitespace-nowrap transition-colors hover:bg-[#E4C788]"
          >
            <span>Customise</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </article>
  );
};
