import React, { useMemo, useState } from 'react';
import { ArrowRight, Check, Copy, Search, X } from 'lucide-react';
import {
  CHRISTMAS_MESSAGES,
  ChristmasMessage,
  MESSAGE_CATEGORIES,
  MessageCategory,
} from '../data/christmasMessages';
import { applyLibraryMessageToDraftStorage } from '../utils/storage';

interface MessageLibraryViewProps {
  /** If provided, clicking "Use Message" inserts directly in the open editor instead of navigating */
  onInsertInEditor?: (msg: ChristmasMessage) => void;
  defaultTargetFilter?: 'all' | 'invitation' | 'wishes';
}

export const MessageLibraryView: React.FC<MessageLibraryViewProps> = ({
  onInsertInEditor,
  defaultTargetFilter = 'all',
}) => {
  const [selectedCategory, setSelectedCategory] = useState<
    'All' | MessageCategory
  >(
    defaultTargetFilter === 'invitation'
      ? 'Christmas Party Invitations'
      : 'All'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredMessages = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return CHRISTMAS_MESSAGES.filter((msg) => {
      if (selectedCategory !== 'All' && msg.category !== selectedCategory) {
        return false;
      }
      if (!q) return true;
      return (
        msg.title.toLowerCase().includes(q) ||
        msg.text.toLowerCase().includes(q) ||
        msg.category.toLowerCase().includes(q)
      );
    });
  }, [selectedCategory, searchQuery]);

  const handleCopy = async (msg: ChristmasMessage) => {
    try {
      await navigator.clipboard.writeText(msg.text);
      setCopiedId(msg.id);
      window.setTimeout(() => {
        setCopiedId((prev) => (prev === msg.id ? null : prev));
      }, 2000);
    } catch {
      // Fallback copy via temporary textarea
      const ta = document.createElement('textarea');
      ta.value = msg.text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopiedId(msg.id);
      window.setTimeout(() => {
        setCopiedId((prev) => (prev === msg.id ? null : prev));
      }, 2000);
    }
  };

  const handleUseMessage = (msg: ChristmasMessage) => {
    if (onInsertInEditor) {
      onInsertInEditor(msg);
      return;
    }
    const targetHref = applyLibraryMessageToDraftStorage(
      msg.text,
      msg.targetType
    );
    window.location.href = targetHref;
  };

  return (
    <div className="space-y-6">
      {/* Search & Category Filter Toolbar */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-sm">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#D8B56D]" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search 50 original Christmas messages..."
            aria-label="Search Christmas messages"
            className="min-h-11 w-full rounded-xl border border-[#D8B56D]/25 bg-[#091725] pl-10 pr-4 text-sm text-[#F8F1E5] placeholder:text-[#F8F1E5]/45 focus:border-[#D8B56D] focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setSelectedCategory('All')}
            className={`min-h-9 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              selectedCategory === 'All'
                ? 'bg-[#D8B56D] text-[#091725]'
                : 'border border-[#D8B56D]/20 bg-[#091725]/60 text-[#F8F1E5]/80 hover:border-[#D8B56D]/50 hover:text-[#F8F1E5]'
            }`}
          >
            All (50)
          </button>
          {MESSAGE_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`min-h-9 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-[#D8B56D] text-[#091725]'
                  : 'border border-[#D8B56D]/20 bg-[#091725]/60 text-[#F8F1E5]/80 hover:border-[#D8B56D]/50 hover:text-[#F8F1E5]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <p className="text-xs text-[#B9D9EC]/80 tabular-nums">
        Showing {filteredMessages.length} of {CHRISTMAS_MESSAGES.length} messages
      </p>

      {/* Message Grid */}
      {filteredMessages.length === 0 ? (
        <div className="rounded-2xl border border-[#D8B56D]/20 bg-[#091725]/60 p-10 text-center">
          <p className="font-display text-lg text-[#F8F1E5]">
            No messages matched your search
          </p>
          <p className="mt-1 text-sm text-[#F8F1E5]/70">
            Try clearing your search term or selecting another category.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
            className="mt-4 inline-flex min-h-10 items-center rounded-lg border border-[#D8B56D]/35 px-4 py-2 text-xs font-medium text-[#D8B56D] hover:bg-[#143B2C]/40"
          >
            Show All 50 Messages
          </button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredMessages.map((msg) => {
            const isCopied = copiedId === msg.id;
            return (
              <article
                key={msg.id}
                className="flex flex-col justify-between rounded-2xl border border-[#D8B56D]/20 bg-[#091725]/80 p-5 transition-colors hover:border-[#D8B56D]/45"
              >
                <div>
                  <p className="text-[11px] font-medium text-[#D8B56D]">
                    {msg.category}
                  </p>
                  <h3 className="mt-1 font-display text-base font-semibold text-[#F8F1E5]">
                    {msg.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-[#F8F1E5]/85">
                    “{msg.text}”
                  </p>
                </div>

                <div className="mt-5 flex items-center gap-2 border-t border-[#D8B56D]/15 pt-3.5">
                  <button
                    type="button"
                    onClick={() => void handleCopy(msg)}
                    className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg border border-[#D8B56D]/30 px-3 py-1.5 text-xs font-medium text-[#F8F1E5] hover:bg-[#143B2C]/50"
                  >
                    {isCopied ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-[#D8B56D]" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5 text-[#D8B56D]" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleUseMessage(msg)}
                    className="inline-flex min-h-9 flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#D8B56D] px-3 py-1.5 text-xs font-semibold text-[#091725] transition-colors hover:bg-[#E4C788]"
                  >
                    <span>
                      {onInsertInEditor ? 'Insert Into Card' : 'Use in Editor'}
                    </span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};

interface MessageLibraryModalProps {
  open: boolean;
  onClose: () => void;
  defaultTargetFilter?: 'all' | 'invitation' | 'wishes';
  onInsert: (msg: ChristmasMessage) => void;
}

export const MessageLibraryModal: React.FC<MessageLibraryModalProps> = ({
  open,
  onClose,
  defaultTargetFilter = 'all',
  onInsert,
}) => {
  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="msg-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#050C14]/85 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="flex max-h-[88dvh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-[#D8B56D]/25 bg-[#0D1E30] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-[#D8B56D]/20 px-6 py-4">
          <div>
            <h2
              id="msg-modal-title"
              className="font-display text-xl font-semibold text-[#F8F1E5]"
            >
              50 Christmas Messages Library
            </h2>
            <p className="mt-0.5 text-xs text-[#F8F1E5]/70">
              Select any message to insert it directly into your card—you can still edit every word afterwards.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close message library"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#D8B56D]/25 text-[#F8F1E5]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-6 studio-scroll">
          <MessageLibraryView
            defaultTargetFilter={defaultTargetFilter}
            onInsertInEditor={(msg) => {
              onInsert(msg);
              onClose();
            }}
          />
        </div>
      </div>
    </div>
  );
};
