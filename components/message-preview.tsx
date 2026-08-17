"use client";

import { Check, MessageCircle, X } from "lucide-react";
import { useLocale } from "./providers";

export function MessagePreview({ title, message, url, onClose }: { title?: string; message: string; url: string; onClose: () => void }) {
  const { t } = useLocale();
  return (
    <div className="modal-layer" role="dialog" aria-modal="true" aria-labelledby="preview-title" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div className="message-preview">
        <button className="modal-close" onClick={onClose} aria-label={t.close} type="button"><X /></button>
        <span className="preview-check"><Check /></span>
        <p className="eyebrow">{t.qualifiedLead}</p>
        <h2 id="preview-title">{title || t.receiveTitle}</h2>
        <p className="preview-help">{t.receiveHelp}</p>
        <pre>{message}</pre>
        <a className="button button-whatsapp button-full" target="_blank" rel="noreferrer" href={url}><MessageCircle size={19} />{t.sendWhatsApp}</a>
      </div>
    </div>
  );
}
