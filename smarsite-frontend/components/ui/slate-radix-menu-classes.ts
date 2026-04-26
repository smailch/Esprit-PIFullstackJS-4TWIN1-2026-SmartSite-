/**
 * Constantes de classes Tailwind partagées entre menubar, dropdown, context (pattern Radix / shadcn).
 * Extraites pour limiter la duplication (CPD) sans changer le rendu.
 */

/** Suffixe icônes SVG (shadcn) — identique sur select, tabs, dialog, etc. */
export const TW_SVG_SIZE_ROW =
  "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"

/** Contenu sous-menu 8 rem (dropdown / context) : seul l’`origin` Radix change. */
export function classNameRadixSubContent8(
  role: "dropdown" | "context",
): string {
  const origin =
    role === "dropdown"
      ? "origin-(--radix-dropdown-menu-content-transform-origin)"
      : "origin-(--radix-context-menu-content-transform-origin)"
  return [
    "z-50 min-w-[8rem]",
    origin,
    "overflow-hidden rounded-xl border border-white/10 bg-popover/95 p-1 text-popover-foreground shadow-xl shadow-black/40 backdrop-blur-xl",
    "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
    "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
    "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
    "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
  ].join(" ")
}

export const SLATE_RADIX_SUB_TRIGGER =
  "flex cursor-default select-none items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-slate-200 outline-hidden focus:bg-white/[0.08] focus:text-slate-50 data-[state=open]:bg-white/[0.08] data-[state=open]:text-slate-50 [&_svg:not([class*='text-'])]:text-slate-400 data-[inset]:pl-8 " +
  TW_SVG_SIZE_ROW

export const SLATE_RADIX_ITEM_WITH_VARIANTS =
  "relative flex cursor-default select-none items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-slate-200 outline-hidden focus:bg-white/[0.08] focus:text-slate-50 data-[variant=destructive]:text-red-400 data-[variant=destructive]:focus:bg-red-500/15 data-[variant=destructive]:focus:text-red-300 data-[variant=destructive]:*:[svg]:!text-red-400 [&_svg:not([class*='text-'])]:text-slate-400 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 " +
  TW_SVG_SIZE_ROW

export const SLATE_RADIX_CHECKBOX_ITEM =
  "relative flex cursor-default select-none items-center gap-2 rounded-lg py-1.5 pr-2 pl-8 text-sm text-slate-200 outline-hidden focus:bg-white/[0.08] focus:text-slate-50 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 " +
  TW_SVG_SIZE_ROW

export const SLATE_RADIX_RADIO_ITEM =
  "relative flex cursor-default select-none items-center gap-2 rounded-lg py-1.5 pr-2 pl-8 text-sm text-slate-200 outline-hidden focus:bg-white/[0.08] focus:text-slate-50 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 " +
  TW_SVG_SIZE_ROW

/** Ligne d’item cmdk (pallette) — alignée sur le style slate des autres menus. */
export const SLATE_COMMAND_ITEM =
  "relative flex cursor-default select-none items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-slate-200 outline-hidden data-[selected=true]:bg-white/[0.08] data-[selected=true]:text-slate-50 [&_svg:not([class*='text-'])]:text-slate-400 data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 " +
  TW_SVG_SIZE_ROW
