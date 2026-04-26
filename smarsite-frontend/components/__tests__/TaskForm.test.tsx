import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TaskForm, { type TaskFormValues } from "@/components/TaskForm";

const u = userEvent.setup();

const baseValues: TaskFormValues = {
  title: "",
  description: "",
  projectId: "507f1f77bcf86cd799439011",
  duration: 1,
  priority: "MEDIUM",
  status: "À faire",
  progress: 0,
  spentBudget: 0,
  assignedTo: "",
  startDate: "",
  endDate: "",
  dependsOn: [],
};

const projects = [
  {
    _id: "507f1f77bcf86cd799439011",
    name: "P1",
    type: "Construction" as const,
    status: "En cours" as const,
    description: "",
    startDate: "",
    createdBy: "507f1f77bcf86cd799439020",
  },
];

describe("TaskForm", () => {
  it("When submit with empty title Then shows error and does not call onSubmit", async () => {
    const onSubmit = vi.fn();
    render(
      <TaskForm
        mode="create"
        showActions
        initialValues={baseValues}
        projects={projects as never}
        users={[]}
        tasks={[]}
        onSubmit={onSubmit}
      />,
    );
    await u.click(screen.getAllByRole("button", { name: "Create task" })[0]!);
    expect(await screen.findByText(/Title is required/i)).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("When valid title and Create task Then onSubmit is called with trimmed title", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const { container } = render(
      <TaskForm
        mode="create"
        showActions
        initialValues={{ ...baseValues, title: "  My task name  " }}
        projects={projects as never}
        users={[]}
        tasks={[]}
        onSubmit={onSubmit}
      />,
    );
    const form = container.querySelector("form");
    expect(form).toBeTruthy();
    fireEvent.submit(form!);
    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    expect((onSubmit.mock.calls[0][0] as TaskFormValues).title).toBe("My task name");
  });
});
