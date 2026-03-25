import React, { useState } from 'react';
import { X, Trash2, ChevronLeft } from 'lucide-react';
import type { GalleryItem } from '@/hooks/useGallery';

interface GalleryProps {
  items: GalleryItem[];
  onClose: () => void;
  onDelete: (id: string) => void;
}

const Gallery: React.FC<GalleryProps> = ({ items, onClose, onDelete }) => {
  const [preview, setPreview] = useState<GalleryItem | null>(null);

  return (
    <div className="fixed inset-0 z-50 flex flex-col animate-fade-up"
      style={{ background: 'hsl(var(--background) / 0.97)', backdropFilter: 'blur(16px)' }}>

      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-safe-top py-4 border-b border-border/50">
        {preview ? (
          <button
            className="zen-button"
            onClick={() => setPreview(null)}
            aria-label="Back"
          ><ChevronLeft size={20} /></button>
        ) : (
          <span />
        )}
        <h2 className="font-display text-xl tracking-wide text-foreground/80">
          {preview ? 'Saved Drawing' : 'Gallery'}
        </h2>
        <button className="zen-button" onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>
      </div>

      {/* Content */}
      {preview ? (
        /* Preview single */
        <div className="flex-1 flex flex-col items-center justify-center gap-5 p-6">
          <img
            src={preview.dataUrl}
            alt="Sand drawing"
            className="max-w-full max-h-[65vh] rounded-xl shadow-float object-contain"
          />
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground font-zen">
              {new Date(preview.createdAt).toLocaleDateString()} · {preview.mode}
            </span>
            <button
              onClick={() => {
                onDelete(preview.id);
                setPreview(null);
              }}
              className="zen-button"
              aria-label="Delete"
            ><Trash2 size={16} /></button>
          </div>
        </div>
      ) : items.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center px-8">
          <div className="text-5xl mb-2">☁️</div>
          <p className="font-display text-lg text-muted-foreground">No saved drawings yet</p>
          <p className="text-sm text-muted-foreground/70 font-zen">
            Draw something beautiful, then tap the save icon.
          </p>
        </div>
      ) : (
        /* Grid */
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {items.map(item => (
              <div
                key={item.id}
                className="relative group rounded-xl overflow-hidden cursor-pointer shadow-sand aspect-square"
                onClick={() => setPreview(item)}
              >
                <img
                  src={item.dataUrl}
                  alt="Sand drawing"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-sand-shadow/0 group-hover:bg-sand-shadow/25 transition-colors" />
                <button
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity zen-button !w-8 !h-8"
                  onClick={e => { e.stopPropagation(); onDelete(item.id); }}
                  aria-label="Delete"
                ><Trash2 size={13} /></button>
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-sand-shadow/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-xs text-sand-light font-zen capitalize">{item.mode}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
