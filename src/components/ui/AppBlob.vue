<template>
  <!--
    The goo: every shape under one filter. Blur, then a steep alpha curve, then the source drawn
    back on top, so shapes that come within about 2σ of each other fuse into one outline with a
    smooth inner corner. The canvas has a fixed size; only the shapes move. No slot: text laid
    over the blob is the parent's HTML, so it is never filtered.
  -->
  <svg
    class="vt-blob pointer-events-none overflow-visible"
    :class="[flipX && flipY ? '-scale-100' : flipX ? '-scale-x-100' : flipY ? '-scale-y-100' : '']"
    :width="width"
    :height="height"
    :viewBox="`0 0 ${width} ${height}`"
    aria-hidden="true"
    focusable="false"
  >
    <defs>
      <filter
        :id="filterId"
        filterUnits="userSpaceOnUse"
        :x="-margin"
        :y="-margin"
        :width="width + margin * 2"
        :height="height + margin * 2"
        color-interpolation-filters="sRGB"
      >
        <feGaussianBlur in="SourceGraphic" :stdDeviation="sigma" result="blur" />
        <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10" result="goo" />
        <feComposite in="SourceGraphic" in2="goo" operator="atop" />
      </filter>
    </defs>
    <!-- With an edge the shapes draw twice: the edge colour, then the fill 1px inside it. -->
    <g v-for="layer in layers" :key="layer.cls" :class="layer.cls" :filter="`url(#${filterId})`" :style="{ fill: layer.fill }">
      <motion.rect
        v-for="shape in shapes"
        :key="shape.key"
        :rx="corner(shape, layer.inset)"
        :ry="corner(shape, layer.inset)"
        :initial="false"
        :animate="geometry(shape, layer.inset)"
        :transition="shape.transition ?? motionTransition"
      />
    </g>
  </svg>
</template>

<script setup lang="ts">
  /**
   * AppBlob: the morph canvas. Shapes of one colour that fuse where they meet, after the goo in
   * Sileo by Aaryan (github.com/hiaaryan/sileo, MIT). The only place the goo filter may live
   * (DESIGN-BIBLE §10): AppToast, the segmented indicators and the tooltip nub all draw through it.
   */
  import { computed, useId } from 'vue';
  import { motion } from 'motion-v';
  import { useBlob, type BlobSpring } from '@/composables/useBlob';

  export interface BlobShape {
    /** Stable key, so a shape moves instead of being redrawn. */
    key: string | number;
    x?: number;
    y?: number;
    width: number;
    height: number;
    /** Corner radius; defaults to the canvas's. */
    radius?: number;
    /** 0 hides the shape (it fades out of the fuse); fills stay opaque. */
    opacity?: number;
    /** This shape's own transition, for a head that leads and a tail that follows. */
    transition?: BlobSpring | Record<string, unknown>;
  }

  const props = withDefaults(
    defineProps<{
      /** Canvas size in px. Fixed: the shapes move inside it. */
      width: number;
      height: number;
      shapes: BlobShape[];
      /** One opaque colour (any CSS colour or `var(--color-…)`). Translucency goes on the canvas's `opacity`. */
      fill?: string;
      /** A border colour: the shapes draw again underneath, 1px larger. */
      edge?: string;
      /** The goo's σ. Defaults to `useBlob`: radius × 0.5, at least 4. */
      blur?: number;
      /** Corner radius in px. Defaults to `--radius-2xl`. */
      radius?: number;
      /** How the shapes move. Defaults to `useBlob().spring(true)`. */
      transition?: BlobSpring | Record<string, unknown>;
      /** Mirror left to right (RTL). */
      flipX?: boolean;
      /** Mirror top to bottom (a shape growing upward). */
      flipY?: boolean;
      /** Room the filter keeps outside the canvas. Default 2 × blur. */
      pad?: number;
    }>(),
    { fill: 'currentColor', flipX: false, flipY: false },
  );

  const blob = useBlob();
  const filterId = `${useId()}-goo`;

  const roundness = computed(() => props.radius ?? blob.roundness.value);
  // σ follows the radius actually drawn, so a `radius` prop moves the blur with it.
  const sigma = computed(() => props.blur ?? (props.radius === undefined ? blob.blur.value : Math.max(4, props.radius * 0.5)));
  const margin = computed(() => props.pad ?? sigma.value * 2);
  const motionTransition = computed(() => props.transition ?? blob.spring(true));

  const layers = computed(() =>
    props.edge
      ? [
          { cls: 'vt-edge', inset: 0, fill: props.edge },
          { cls: 'vt-fill', inset: 1, fill: props.fill },
        ]
      : [{ cls: 'vt-fill', inset: 0, fill: props.fill }],
  );

  const corner = (shape: BlobShape, inset: number) => Math.max(0, (shape.radius ?? roundness.value) - inset);
  const geometry = (shape: BlobShape, inset: number) => ({
    x: (shape.x ?? 0) + inset,
    y: (shape.y ?? 0) + inset,
    width: Math.max(0, shape.width - inset * 2),
    height: Math.max(0, shape.height - inset * 2),
    opacity: shape.opacity ?? 1,
  });

  defineExpose({ filterId });
</script>
