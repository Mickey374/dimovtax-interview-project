import test from "node:test";
import assert from "node:assert/strict";
import { getProjectCacheKey, getProjectCacheKeysToInvalidate } from "./project-cache";

test("getProjectCacheKey builds list keys by scope", () => {
  assert.equal(getProjectCacheKey({ scope: "all" }), "projects:all:none");
  assert.equal(getProjectCacheKey({ scope: "all", limit: 5 }), "projects:all:5");
  assert.equal(getProjectCacheKey({ scope: "user", userId: "user-1" }), "projects:user:user-1:none");
});

test("getProjectCacheKeysToInvalidate covers current project list variants", () => {
  assert.deepEqual(getProjectCacheKeysToInvalidate(["user-1", null]), [
    "projects:all:none",
    "projects:user:user-1:none",
    "projects:all:5",
    "projects:user:user-1:5",
  ]);
});
