import { describe, expect, it } from "vitest";
import {
  extractAssignmentResourceId,
  getAssignedHumanDisplayName,
  normalizeAssignedResourceForForm,
} from "../assignedResource";
import type { AssignedResource } from "../types";

describe("assignedResource", () => {
  it("extractAssignmentResourceId gère string, $oid, _id", () => {
    expect(extractAssignmentResourceId({ resourceId: "abc" })).toBe("abc");
    expect(
      extractAssignmentResourceId({ resourceId: { $oid: "507f1f77bcf86cd799439011" } }),
    ).toBe("507f1f77bcf86cd799439011");
    expect(
      extractAssignmentResourceId({ resourceId: { _id: "xx" } }),
    ).toBe("xx");
    expect(extractAssignmentResourceId({})).toBeNull();
  });

  it("normalizeAssignedResourceForForm", () => {
    const ar: AssignedResource = {
      resourceId: "id1",
      type: "Human",
    };
    expect(normalizeAssignedResourceForForm(ar)).toEqual({
      resourceId: "id1",
      type: "Human",
    });
    const eq: AssignedResource = { resourceId: "e1", type: "Equipment" };
    expect(normalizeAssignedResourceForForm(eq)?.type).toBe("Equipment");
  });

  it("getAssignedHumanDisplayName", () => {
    expect(
      getAssignedHumanDisplayName({
        resourceId: "507f1f77bcf86cd799439011",
        type: "Human",
        name: "  Jean  ",
      }),
    ).toBe("Jean");
    expect(
      getAssignedHumanDisplayName({
        resourceId: { firstName: "A", lastName: "B" },
        type: "Human",
      }),
    ).toBe("A B");
    expect(
      getAssignedHumanDisplayName({
        resourceId: "nope",
        type: "Human",
      }),
    ).toContain("nope");
  });
});
