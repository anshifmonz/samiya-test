"use client";

import { Toaster } from "ui/toaster";
import { Toaster as Sonner } from "ui/sonner";

export function ToasterProvider() {
  return (
    <>
      <Toaster />
      <Sonner />
    </>
  );
}
