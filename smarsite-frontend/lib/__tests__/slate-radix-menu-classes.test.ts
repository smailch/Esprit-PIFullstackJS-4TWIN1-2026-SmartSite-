import { describe, expect, it } from "vitest";
import {
  SLATE_COMMAND_ITEM,
  SLATE_RADIX_CHECKBOX_ITEM,
  SLATE_RADIX_ITEM_WITH_VARIANTS,
  SLATE_RADIX_RADIO_ITEM,
  SLATE_RADIX_SUB_TRIGGER,
  TW_SVG_SIZE_ROW,
  classNameRadixSubContent8,
} from "@/components/ui/slate-radix-menu-classes";

describe("slate-radix-menu-classes", () => {
  it("TW_SVG_SIZE_ROW contient le trio utilitaire SVG", () => {
    expect(TW_SVG_SIZE_ROW).toContain("pointer-events-none");
    expect(TW_SVG_SIZE_ROW).toContain("size-4");
  });

  it("classNameRadixSubContent8 distingue dropdown et context", () => {
    const d = classNameRadixSubContent8("dropdown");
    const c = classNameRadixSubContent8("context");
    expect(d).toContain("radix-dropdown-menu");
    expect(c).toContain("radix-context-menu");
    expect(d).toContain("z-50 min-w-[8rem]");
    expect(c).toContain("z-50 min-w-[8rem]");
    expect(d).not.toEqual(c);
  });

  it("les constantes SLATE_* se terminent par le suffixe SVG commun", () => {
    for (const s of [
      SLATE_RADIX_SUB_TRIGGER,
      SLATE_RADIX_ITEM_WITH_VARIANTS,
      SLATE_RADIX_CHECKBOX_ITEM,
      SLATE_RADIX_RADIO_ITEM,
      SLATE_COMMAND_ITEM,
    ]) {
      expect(s).toContain(TW_SVG_SIZE_ROW);
    }
  });
});
