import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Minus, Plus, X, ZoomIn } from "lucide-react";
import { fmt, useT } from "@/i18n";
import type { Product } from "@/data/products";
import { cn } from "@/lib/utils";

export function ProductGallery({ product }: { product: Product }) {
  const { lang, t } = useT();
  const imgs = product.images;
  const [i, setI] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [scale, setScale] = useState(1);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const go = useCallback((d: number) => setI((v) => (v + d + imgs.length) % imgs.length), [imgs.length]);

  useEffect(() => {
    if (!zoomOpen) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setZoomOpen(false);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "+" || e.key === "=") setScale((s) => Math.min(3, s + 0.5));
      if (e.key === "-") setScale((s) => Math.max(1, s - 0.5));
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      triggerRef.current?.focus();
    };
  }, [zoomOpen, go]);

  const current = imgs[i] ?? imgs[0]!;
  return (
    <section aria-label={t.product.gallery}>
      <div className="relative">
        <button
          ref={triggerRef}
          type="button"
          onClick={() => { setScale(1); setZoomOpen(true); }}
          className="group block w-full cursor-zoom-in overflow-hidden bg-stone"
          aria-label={`${t.product.zoom}: ${current.alt[lang]}`}
        >
          <img src={current.src} alt={current.alt[lang]} width={current.width} height={current.height} className="aspect-[4/5] w-full object-cover" />
          <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-sm bg-background/90 px-2.5 py-1.5 text-sm">
            <ZoomIn className="size-4" aria-hidden /> {t.product.zoom}
          </span>
        </button>
      </div>
      {imgs.length > 1 && (
        <ul className="mt-3 flex gap-3">
          {imgs.map((im, idx) => (
            <li key={idx}>
              <button
                type="button"
                onClick={() => setI(idx)}
                aria-label={fmt(t.product.imageN, { n: idx + 1, t: imgs.length })}
                aria-current={idx === i ? "true" : undefined}
                className={cn("block size-20 overflow-hidden border-2 bg-stone transition-colors", idx === i ? "border-primary" : "border-transparent hover:border-border")}
              >
                <img src={im.src} alt="" width={80} height={100} loading="lazy" className="h-full w-full object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {zoomOpen && (
        <div role="dialog" aria-modal="true" aria-label={t.product.gallery} className="fixed inset-0 z-50 flex flex-col bg-background animate-in fade-in duration-200">
          <div className="flex items-center gap-2 border-b px-4 py-2">
            <span className="text-sm text-muted-foreground" aria-live="polite">{fmt(t.product.imageN, { n: i + 1, t: imgs.length })}</span>
            <div className="ml-auto flex items-center gap-1">
              <button type="button" className="btn-ghost" onClick={() => setScale((s) => Math.max(1, s - 0.5))} aria-label={t.product.zoomOut}><Minus className="size-5" /></button>
              <button type="button" className="btn-ghost" onClick={() => setScale((s) => Math.min(3, s + 0.5))} aria-label={t.product.zoomIn}><Plus className="size-5" /></button>
              <button ref={closeRef} type="button" className="btn-ghost" onClick={() => setZoomOpen(false)}>
                <X className="size-5" aria-hidden /> {t.product.closeZoom}
              </button>
            </div>
          </div>
          <div className="relative flex-1 overflow-auto" style={{ touchAction: "pan-x pan-y pinch-zoom" }}>
            <img
              src={current.src}
              alt={current.alt[lang]}
              className="mx-auto max-h-full transition-[width] duration-200"
              style={{ width: scale === 1 ? "auto" : `${scale * 100}%`, maxHeight: scale === 1 ? "100%" : "none", maxWidth: scale === 1 ? "100%" : "none" }}
              onDoubleClick={() => setScale((s) => (s === 1 ? 2 : 1))}
            />
          </div>
          {imgs.length > 1 && (
            <div className="flex justify-center gap-2 border-t p-2">
              <button type="button" className="btn-ghost" onClick={() => go(-1)}><ChevronLeft className="size-5" aria-hidden /> {t.product.prevImage}</button>
              <button type="button" className="btn-ghost" onClick={() => go(1)}>{t.product.nextImage} <ChevronRight className="size-5" aria-hidden /></button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
