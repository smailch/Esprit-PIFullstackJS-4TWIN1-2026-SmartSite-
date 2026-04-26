import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import AccessibilityMenu, {
  chunkTextForSpeech,
} from "../AccessibilityMenu";

describe("chunkTextForSpeech", () => {
  it("découpe sur les fins de phrase et le reste", () => {
    expect(chunkTextForSpeech("A. B! C? D")).toEqual([
      "A.",
      "B!",
      "C?",
      "D",
    ]);
  });
  it("applique maxTotal", () => {
    const t = "x".repeat(10);
    const out = chunkTextForSpeech(t, 5);
    expect(out[0].length).toBeLessThanOrEqual(6);
  });
});

describe("AccessibilityMenu", () => {
  const speak = vi.fn();
  const cancel = vi.fn();

  beforeEach(() => {
    localStorage.clear();
    document.body.innerHTML = '<div id="main-content">Line one. Line two.</div>';
    vi.stubGlobal("speechSynthesis", {
      speak,
      cancel,
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("affiche le déclencheur et le panneau accessibilité", async () => {
    const user = userEvent.setup();
    render(<AccessibilityMenu />);
    const trigger = screen.getByRole("button", {
      name: /accessibility options/i,
    });
    expect(trigger).toBeInTheDocument();
    await user.click(trigger);
    // Libellé du menu (Radix peut lier le nom via aria-labelledby ; on vérifie un item stable)
    expect(await screen.findByText(/reduce animations/i)).toBeInTheDocument();
  });
});
