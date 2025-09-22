"use client";

import { toast } from "@/components/ui/use-toast";
import { ToastActionElement } from "@/components/ui/toast";

export function useCustomToast() {
  // Enhanced toast function that ensures toasts are visible
  const showToast = ({
    title,
    description,
    variant = "default",
    duration = 3000,
    action,
  }: {
    title: string;
    description: string;
    variant?: "default" | "destructive" | "success";
    duration?: number;
    action?: ToastActionElement;
  }) => {    
    // Use a more reliable approach with a longer timeout
    setTimeout(() => {
      try {
        toast({
          title,
          description,
          variant,
          duration,
          action,
        });
        
        // Log for debugging
      } catch (error) {
      }
    }, 50); // Slightly longer delay for more reliability
  };

  return { showToast };
}
