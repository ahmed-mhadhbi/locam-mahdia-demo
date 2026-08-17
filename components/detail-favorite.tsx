"use client";

import { Heart } from "lucide-react";
import { useFavorites, useLocale } from "./providers";

export function DetailFavorite({ reference }: { reference: string }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { t } = useLocale();
  const favorite = isFavorite(reference);
  return <button className={`detail-favorite ${favorite ? "active" : ""}`} onClick={() => toggleFavorite(reference)} type="button"><Heart fill={favorite ? "currentColor" : "none"} />{favorite ? t.saved : t.addFavorites}</button>;
}
