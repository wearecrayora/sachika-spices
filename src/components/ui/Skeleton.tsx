"use client";

/*
  Boneyard skeletons for the site.

  Bones are captured from the real rendered UI with `npm run bones` (dev server
  running) and written to src/bones. The generated registry registers them and
  applies the colours from boneyard.config.json, so every
  <Skeleton name="…"> resolves its bones automatically.
*/
import { useSyncExternalStore } from "react";
import { Skeleton } from "boneyard-js/react";
import { isSkeletonCapture } from "@/lib/gsap";
import "@/bones/registry";

export { Skeleton };

const noSubscribe = () => () => {};

/*
  True only inside `npm run bones`. Skeletons that normally disappear once the
  bag hydrates stay mounted then, so the CLI can capture their fixtures.
*/
export function useSkeletonCapture() {
  return useSyncExternalStore(noSubscribe, isSkeletonCapture, () => false);
}
