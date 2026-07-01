import test from "node:test";
import assert from "node:assert/strict";
import { ProjectStatus } from "@prisma/client";
import { formatProjectDateForInput, serializeProjectFormValues } from "./project-form";

test("formatProjectDateForInput returns a date input value", () => {
  assert.equal(formatProjectDateForInput("2026-07-01T12:34:56.000Z"), "2026-07-01");
  assert.equal(formatProjectDateForInput(new Date("2026-08-15T00:00:00.000Z")), "2026-08-15");
  assert.equal(formatProjectDateForInput(undefined), "");
});

test("serializeProjectFormValues normalizes the payload", () => {
  const payload = serializeProjectFormValues({
    title: "  Build dashboard  ",
    description: "  Launch overview  ",
    status: ProjectStatus.ON_HOLD,
    deadline: "2026-09-10",
    budget: 1250,
    assignedToId: "",
  });

  assert.equal(payload.title, "Build dashboard");
  assert.equal(payload.description, "Launch overview");
  assert.equal(payload.status, ProjectStatus.ON_HOLD);
  assert.equal(payload.deadline, "2026-09-10T00:00:00.000Z");
  assert.equal(payload.assignedToId, null);
});