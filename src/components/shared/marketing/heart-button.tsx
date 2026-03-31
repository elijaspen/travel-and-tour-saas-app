"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { toggleSaveTourAction } from "@/modules/saved-tours/saved-tours.actions";

type HeartButtonProps = {
  tourId: string;
  initialIsSaved?: boolean;
};

export function HeartButton({ tourId, initialIsSaved = true }: HeartButtonProps) {
  const [isSaved, setIsSaved] = useState(initialIsSaved);
  const [isPending, setIsPending] = useState(false);

  const handleToggle = async (e: React.MouseEvent) => {
    // Prevent the click from triggering the "View Details" link underneath
    e.preventDefault(); 
    e.stopPropagation();

    if (isPending) return;

    setIsSaved(!isSaved);
    setIsPending(true);

    try {
      const result = await toggleSaveTourAction(tourId);
      
      if (!result.success) {
        // If it failed on the server (e.g., not logged in), revert the heart
        setIsSaved(isSaved);
        console.error("Failed to toggle save:", result.message);
      } 
      
    } catch (error) {
      setIsSaved(isSaved);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <button 
      onClick={handleToggle}
      disabled={isPending}
      className={`absolute top-3 right-3 h-8 w-8 rounded-full bg-white flex items-center justify-center shadow-sm transition-transform ${isPending ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
      aria-label={isSaved ? "Unsave tour" : "Save tour"}
    >
      <Heart 
        className={`h-4 w-4 transition-colors ${
          isSaved 
            ? "fill-red-500 text-red-500" 
            : "fill-transparent text-zinc-500 hover:text-zinc-900"
        }`} 
      />
    </button>
  );
}