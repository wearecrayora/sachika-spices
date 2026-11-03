"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Flip } from "gsap/Flip";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, Flip, useGSAP);
  gsap.defaults({ ease: "expo.out", duration: 1 });
}

export { gsap, ScrollTrigger, SplitText, Flip, useGSAP };

/*
  True while `npx boneyard-js build` is capturing skeletons. The capture skips
  anything hidden or at opacity 0, so entrance animations must stand down.
*/
export const isSkeletonCapture = () =>
  typeof window !== "undefined" && !!(window as unknown as { __BONEYARD_BUILD?: boolean }).__BONEYARD_BUILD;

export const reduceMotion = () =>
  typeof window !== "undefined" && (isSkeletonCapture() || window.matchMedia("(prefers-reduced-motion: reduce)").matches);

export const isFinePointer = () =>
  typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches;
