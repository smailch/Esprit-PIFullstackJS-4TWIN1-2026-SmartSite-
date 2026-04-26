import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import Topbar from "../Topbar";

const push = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}));

function makeToken(payload: Record<string, string>) {
  const p = btoa(JSON.stringify(payload));
  return `h.${p}.s`;
}

describe("Topbar", () => {
  afterEach(() => {
    localStorage.clear();
    vi.unstubAllGlobals();
  });

  beforeEach(() => {
    push.mockClear();
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          fullName: "Loaded User",
          email: "loaded@example.com",
          profileImage: "",
        }),
      }),
    );
  });

  it("charge l’utilisateur depuis le JWT et affiche le nom", async () => {
    const token = makeToken({
      sub: "user1",
      fullName: "JWT User",
      email: "jwt@example.com",
      roleName: "Admin",
    });
    localStorage.setItem("token", token);

    render(<Topbar />);

    await waitFor(() => {
      expect(screen.getByText("Loaded User")).toBeInTheDocument();
    });
    expect(screen.getByText("loaded@example.com")).toBeInTheDocument();
  });
});
