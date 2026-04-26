import { afterEach, beforeEach, beforeAll, describe, expect, it, vi } from "vitest";
import {
  SPEAK_SELECTION_STORAGE_KEY,
  isSpeakSelectionEnabled,
  speakSelectionAnnouncement,
} from "../speak-selection-announcement";

beforeAll(() => {
  if (typeof globalThis.SpeechSynthesisUtterance === "undefined") {
    globalThis.SpeechSynthesisUtterance = class {
      text = "";
      lang = "";
      constructor(s: string) {
        this.text = s;
      }
    } as unknown as typeof SpeechSynthesisUtterance;
  }
});

describe("speak-selection-announcement", () => {
  const orig = window.speechSynthesis;
  const origGet = localStorage.getItem;

  beforeEach(() => {
    localStorage.setItem(SPEAK_SELECTION_STORAGE_KEY, "1");
  });

  afterEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).speechSynthesis = orig;
    localStorage.removeItem(SPEAK_SELECTION_STORAGE_KEY);
    localStorage.getItem = origGet;
  });

  it("isSpeakSelectionEnabled respecte le stockage", () => {
    expect(isSpeakSelectionEnabled()).toBe(true);
    localStorage.setItem(SPEAK_SELECTION_STORAGE_KEY, "0");
    expect(isSpeakSelectionEnabled()).toBe(false);
  });

  it("speakSelectionAnnouncement no-op si speechSynthesis absent", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (window as any).speechSynthesis;
    expect(() => speakSelectionAnnouncement("hello")).not.toThrow();
  });

  it("speakSelectionAnnouncement enfile une locution quand l’a11y est activée", () => {
    const speak = vi.fn();
    const cancel = vi.fn();
    const resume = vi.fn();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).speechSynthesis = {
      speak,
      cancel,
      resume,
    };
    localStorage.setItem(SPEAK_SELECTION_STORAGE_KEY, "1");
    vi.useFakeTimers();
    speakSelectionAnnouncement("Test");
    vi.runAllTimers();
    expect(cancel).toHaveBeenCalled();
    expect(speak).toHaveBeenCalled();
    vi.useRealTimers();
  });
});
