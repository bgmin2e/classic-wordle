import { KeyStatus } from "../models/key-status";

export const keyStatusColors: Map<KeyStatus, string> = new Map([
  ["correct", "green"],
  ["present", "amber"],
  ["absent", "gray"],
]);
