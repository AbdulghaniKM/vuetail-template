<template>
  <Teleport to="body">
    <section
      v-for="[pos, list] in groups"
      :key="pos"
      role="region"
      :aria-label="groups.size > 1 ? `${label}, ${pos.replace('-', ' ')}` : label"
      class="vt-toaster pointer-events-none fixed z-[10000] p-3"
      :data-toaster="uid"
      :data-position="pos"
      :style="{ width: `${width + 24}px` }"
    >
      <div class="relative" :style="{ height: `${stackHeight(list)}px` }">
        <AnimatePresence>
          <motion.div
            v-for="toast in list"
            :key="toast.id"
            class="vt-toast pointer-events-auto absolute inset-x-0"
            :class="edge(toast) === 'bottom' ? 'top-0' : 'bottom-0'"
            :data-type="toast.type"
            :data-tone="tone"
            :style="{ height: `${heightOf(toast)}px`, zIndex: list.length - list.indexOf(toast) }"
            :initial="reduced ? { opacity: 0, y: offsetOf(toast, list) } : { opacity: 0, scale: 0.95, y: offsetOf(toast, list) + (edge(toast) === 'bottom' ? -6 : 6) }"
            :animate="{ opacity: 1, scale: 1, y: offsetOf(toast, list) }"
            :exit="reduced ? { opacity: 0, transition: exit() } : { opacity: 0, scale: 0.95, transition: exit() }"
            :transition="reduced ? enter() : spring(true)"
            @mouseenter="hold(toast.id, true)"
            @mouseleave="hold(toast.id, false)"
            @focusin="hold(toast.id, true)"
            @focusout="onFocusOut($event, toast.id)"
            @keydown.esc="removeToast(toast.id)"
            @pointerdown="onPointerDown($event, toast.id)"
          >
            <div class="vt-swipe relative size-full" :data-swipe="toast.id">
              <!--
                The goo: pill and body are two rects under one filter. Blur, then a steep alpha
                curve, then the source drawn back on top, so where the two meet they fuse
                instead of overlapping. The canvas has a fixed size; only the shapes move.
              -->
              <svg
                class="vt-canvas pointer-events-none absolute inset-x-0 overflow-visible"
                :class="edge(toast) === 'bottom' ? 'top-0' : 'bottom-0 -scale-y-100'"
                :width="width"
                :height="canvasHeight(toast)"
                :viewBox="`0 0 ${width} ${canvasHeight(toast)}`"
                aria-hidden="true"
              >
                <defs>
                  <filter
                    :id="filterId(toast.id)"
                    filterUnits="userSpaceOnUse"
                    :x="-blur * 2"
                    :y="-blur * 2"
                    :width="width + blur * 4"
                    :height="canvasHeight(toast) + blur * 4"
                    color-interpolation-filters="sRGB"
                  >
                    <feGaussianBlur in="SourceGraphic" :stdDeviation="blur" result="blur" />
                    <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10" result="goo" />
                    <feComposite in="SourceGraphic" in2="goo" operator="atop" />
                  </filter>
                </defs>
                <!-- Surface draws the shape twice: the border colour, then the fill 1px inside it. -->
                <g v-for="layer in layers" :key="layer.cls" :filter="`url(#${filterId(toast.id)})`" :class="layer.cls">
                  <motion.rect
                    :rx="Math.max(0, roundness - layer.inset)"
                    :ry="Math.max(0, roundness - layer.inset)"
                    :initial="false"
                    :animate="pillShape(toast, layer.inset)"
                    :transition="spring(isOpen(toast))"
                  />
                  <motion.rect
                    :y="PILL_H"
                    :rx="Math.max(0, roundness - layer.inset)"
                    :ry="Math.max(0, roundness - layer.inset)"
                    :initial="false"
                    :animate="bodyShape(toast, layer.inset)"
                    :transition="spring(isOpen(toast))"
                  />
                </g>
              </svg>

              <!-- The pill's content: badge and title. It opens the toast when there is more. -->
              <motion.div
                class="absolute flex items-center"
                :class="edge(toast) === 'bottom' ? 'top-0' : 'bottom-0'"
                :style="{ height: `${PILL_H}px` }"
                :initial="false"
                :animate="{
                  x: pillX(toast),
                  y: isOpen(toast) ? (edge(toast) === 'bottom' ? 3 : -3) : 0,
                  scale: isOpen(toast) ? 0.9 : 1,
                }"
                :transition="spring(isOpen(toast))"
              >
                <component
                  :is="isDisclosure(toast) ? 'button' : 'div'"
                  :type="isDisclosure(toast) ? 'button' : undefined"
                  :aria-expanded="isDisclosure(toast) ? isOpen(toast) : undefined"
                  :aria-controls="isDisclosure(toast) ? bodyId(toast.id) : undefined"
                  class="vt-pill relative flex h-full items-center gap-2 rounded-full p-2 text-start"
                  :data-measure="toast.id"
                  @click="isDisclosure(toast) && togglePinned(toast.id)"
                >
                  <Transition name="vt-swap">
                    <span :key="`${toast.type}|${pillText(toast)}`" class="flex items-center gap-2 whitespace-nowrap">
                      <span class="vt-badge flex size-6 shrink-0 items-center justify-center rounded-full">
                        <AppIcon :name="toast.icon ?? ICONS[toast.type]" :size="0.875" />
                      </span>
                      <span class="vt-title pe-1 text-sm leading-4 font-medium">{{ pillText(toast) }}</span>
                    </span>
                  </Transition>
                </component>
              </motion.div>

              <!-- More: the description and the buttons, in the body the pill melts into. -->
              <div
                v-if="hasMore(toast)"
                :id="bodyId(toast.id)"
                class="vt-body absolute inset-x-0"
                :class="edge(toast) === 'bottom' ? '' : 'top-0'"
                :style="edge(toast) === 'bottom' ? { top: `${PILL_H}px` } : undefined"
                :data-open="isOpen(toast)"
                :inert="!isOpen(toast) || undefined"
              >
                <div class="p-4 text-sm leading-5" :data-body="toast.id">
                  <p v-if="moreText(toast)" class="vt-description">{{ moreText(toast) }}</p>
                  <div class="mt-3 flex items-center gap-2">
                    <button
                      v-if="toast.action"
                      type="button"
                      class="vt-button vt-button-action relative h-7 rounded-full px-3 text-xs font-medium"
                      @click="runAction(toast)"
                    >
                      {{ toast.action.label }}
                    </button>
                    <button type="button" class="vt-button relative h-7 rounded-full px-3 text-xs font-medium" @click="removeToast(toast.id)">
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>

              <!-- The countdown: a hairline along the bottom of what is showing, frozen while held. -->
              <div
                v-if="progress && toast.duration && toast.duration > 0"
                class="vt-countdown pointer-events-none absolute h-0.5 overflow-hidden rounded-full"
                :style="countdownBox(toast)"
                aria-hidden="true"
              >
                <div
                  :key="`${toast.type}|${toast.message}|${toast.duration}`"
                  class="vt-countdown-bar size-full origin-left"
                  :style="{ animationDuration: `${toast.duration}ms`, animationPlayState: toast.paused || held === toast.id ? 'paused' : 'running' }"
                />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  </Teleport>
</template>

<script setup lang="ts">
  /**
   * AppToast: a pill that melts into a card when it has more to say, after Sileo by
   * Aaryan (github.com/hiaaryan/sileo, MIT): the goo filter, the autopilot that opens and folds
   * a toast on its own, and the header that cross-fades between states are his. This port runs on
   * the VueTail tokens and the useToast store, announces through the shared live regions, gives
   * every control its own real button, and moves the stack on transforms only.
   */
  import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, useId, watch } from 'vue';
  import { AnimatePresence, motion } from 'motion-v';
  import type { Toast, ToastPosition, ToastType } from '@/composables/useToast';
  import AppIcon from './AppIcon.vue';
  import { useAnnouncer } from '@/composables/useAnnouncer';
  import { useMotionTokens } from '@/composables/useMotionTokens';
  import { useReducedMotion } from '@/composables/useReducedMotion';

  export interface AppToastProps {
    toasts: Toast[];
    position?: ToastPosition;
    /** Name of the toast region. Give a second toaster on the same page its own. */
    label?: string;
    /**
     * When a toast with more to say opens. `auto`: on its own (see `autopilot`), and while held.
     * `hover`: only while hovered, focused or clicked open. `always`: it is a card from the start
     * and never folds, for formal apps.
     */
    expand?: 'auto' | 'hover' | 'always';
    /** Timing for `expand: 'auto'`: open `expand` ms after it appears, fold `collapse` ms before it leaves. */
    autopilot?: false | { expand?: number; collapse?: number };
    /** `inverse`: the page's text colour as the fill, the expressive default. `surface`: a raised surface with a border, quiet. */
    tone?: 'inverse' | 'surface';
    /** A hairline countdown along the bottom, frozen while the toast is held. */
    progress?: boolean;
  }

  const props = withDefaults(defineProps<AppToastProps>(), {
    position: 'top-right',
    label: 'Notifications',
    expand: 'auto',
    autopilot: () => ({ expand: 150, collapse: 2000 }),
    tone: 'inverse',
    progress: false,
  });

  const emit = defineEmits<{
    remove: [id: string];
    pause: [id: string];
    resume: [id: string];
  }>();

  const PILL_H = 40;
  const MAX_WIDTH = 350;
  const GAP = 12;
  const MIN_OPEN = PILL_H * 2.25;
  // Sileo's spring length. The bounce is the preset's (`--vt-toast-bounce`).
  const SPRING_S = 0.6;

  const ICONS: Record<ToastType, string> = {
    success: 'icon-[heroicons--check]',
    error: 'icon-[heroicons--x-mark]',
    warning: 'icon-[heroicons--exclamation-triangle]',
    info: 'icon-[heroicons--information-circle]',
    loading: 'icon-[heroicons--arrow-path] animate-spin motion-reduce:animate-pulse',
  };

  const { enter, exit } = useMotionTokens();
  const reduced = useReducedMotion();
  const uid = useId();

  /* ------------------------------ Tokens ------------------------------- */

  const readToken = (name: string) =>
    typeof document === 'undefined' ? '' : getComputedStyle(document.documentElement).getPropertyValue(name).trim();

  // Read when the stack renders, so a preset switch reaches the next toast.
  const tokenTick = ref(0);
  const roundness = computed(() => {
    void tokenTick.value;
    const px = Number.parseFloat(readToken('--radius-2xl'));
    return Number.isFinite(px) ? Math.min(px, PILL_H / 2) : 16;
  });
  const blur = computed(() => roundness.value * 0.5);

  const spring = (opening: boolean) => {
    if (reduced.value) return { duration: 0 };
    const bounce = Number.parseFloat(readToken('--vt-toast-bounce'));
    return { type: 'spring' as const, duration: SPRING_S, bounce: opening && Number.isFinite(bounce) ? bounce : 0 };
  };

  /* ------------------------------ Geometry ----------------------------- */

  const width = ref(MAX_WIDTH);
  const fitWidth = () => {
    width.value = Math.min(MAX_WIDTH, window.innerWidth - 24);
    tokenTick.value++;
  };

  const pillWidths = reactive(new Map<string, number>());
  const bodyHeights = reactive(new Map<string, number>());

  const edge = (t: Toast) => ((t.position ?? props.position).startsWith('top') ? 'bottom' : 'top');
  const align = (t: Toast) => {
    const pos = t.position ?? props.position;
    return pos.endsWith('right') ? 'right' : pos.endsWith('center') ? 'center' : 'left';
  };

  const pillWidth = (t: Toast) => Math.min(width.value, Math.max(PILL_H, pillWidths.get(t.id) ?? PILL_H));
  const pillX = (t: Toast) => {
    const free = width.value - pillWidth(t);
    return align(t) === 'right' ? free : align(t) === 'center' ? free / 2 : 0;
  };
  const bodyHeight = (t: Toast) => Math.max(MIN_OPEN, PILL_H + (bodyHeights.get(t.id) ?? 0)) - PILL_H;
  const canvasHeight = (t: Toast) => (hasMore(t) ? PILL_H + bodyHeight(t) + blur.value * 3 : PILL_H + blur.value * 3);
  const heightOf = (t: Toast) => (isOpen(t) ? PILL_H + bodyHeight(t) : PILL_H);

  const layers = computed(() =>
    props.tone === 'surface' ? [{ cls: 'vt-edge', inset: 0 }, { cls: 'vt-fill', inset: 1 }] : [{ cls: 'vt-fill', inset: 0 }],
  );
  // The fill layer sits `inset` px inside the edge layer on every outside edge; where the pill
  // meets the body there is no edge, so nothing is inset there.
  const pillShape = (t: Toast, inset: number) => ({
    x: pillX(t) + inset,
    y: inset,
    width: Math.max(0, pillWidth(t) - inset * 2),
    height: isOpen(t) ? PILL_H + blur.value * 3 - inset : PILL_H - inset * 2,
  });
  const bodyShape = (t: Toast, inset: number) => ({
    x: inset,
    width: width.value - inset * 2,
    height: isOpen(t) ? Math.max(0, bodyHeight(t) - inset) : 0,
    opacity: isOpen(t) ? 1 : 0,
  });
  // Under the pill while it is a pill (and always for a stack growing upward, whose pill is at
  // the bottom); along the body once it opens downward.
  const countdownBox = (t: Toast) => {
    const r = roundness.value;
    const wide = isOpen(t) && edge(t) === 'bottom';
    return {
      bottom: '3px',
      left: `${wide ? 16 : pillX(t) + r}px`,
      width: `${wide ? width.value - 32 : Math.max(8, pillWidth(t) - r * 2)}px`,
    };
  };

  const filterId = (id: string) => `${uid}-goo-${id}`;
  const bodyId = (id: string) => `${uid}-body-${id}`;

  /* ------------------------------ Content ------------------------------ */

  // The pill carries the title, or the message when there is none; the body carries the rest.
  const pillText = (t: Toast) => t.title ?? t.message;
  const moreText = (t: Toast) => t.description ?? (t.title ? t.message : '');
  const hasMore = (t: Toast) => t.type !== 'loading' && Boolean(moreText(t) || t.action);

  /* ------------------------------- Stack ------------------------------- */

  // One region per position in use, newest first, so the newest sits nearest the edge.
  const groups = computed(() => {
    const map = new Map<ToastPosition, Toast[]>();
    for (const t of [...props.toasts].reverse()) {
      const pos = t.position ?? props.position;
      map.set(pos, [...(map.get(pos) ?? []), t]);
    }
    return map;
  });

  // Every toast sits at the sum of the ones newer than it and moves there by transform, so a
  // toast opening pushes its neighbours without anything relaying out.
  const offsetOf = (t: Toast, list: Toast[]) => {
    let y = 0;
    for (const other of list) {
      if (other.id === t.id) break;
      y += heightOf(other) + GAP;
    }
    return edge(t) === 'bottom' ? y : -y;
  };
  const stackHeight = (list: Toast[]) =>
    list.reduce((sum, t) => sum + heightOf(t), 0) + Math.max(0, list.length - 1) * GAP;

  /* ---------------------------- Measurement ---------------------------- */

  let observer: ResizeObserver | null = null;
  const measure = (el: Element) => {
    const html = el as HTMLElement;
    if (html.dataset.measure) pillWidths.set(html.dataset.measure, Math.ceil(html.scrollWidth));
    if (html.dataset.body) bodyHeights.set(html.dataset.body, Math.ceil(html.scrollHeight));
  };
  const measureAll = () => {
    for (const el of document.querySelectorAll(`[data-toaster="${uid}"] :is([data-measure], [data-body])`)) {
      measure(el);
      observer?.observe(el);
    }
  };

  /* ------------------------------ Opening ------------------------------ */

  // One toast is open at a time: the one held (hover, focus, a click on the pill), or else the
  // newest while its autopilot says so. Reduced motion skips the fold: a toast with more is open.
  const held = ref<string | null>(null);
  const pinned = reactive(new Set<string>());
  const autoOpen = reactive(new Set<string>());
  const newest = computed(() => props.toasts[props.toasts.length - 1]?.id);

  const isOpen = (t: Toast) => {
    if (!hasMore(t)) return false;
    if (reduced.value || props.expand === 'always') return true;
    if (held.value) return held.value === t.id || pinned.has(t.id);
    return pinned.has(t.id) || (autoOpen.has(t.id) && newest.value === t.id);
  };

  const hold = (id: string, on: boolean) => {
    if (on) {
      if (held.value === id) return;
      held.value = id;
      emit('pause', id);
    } else if (held.value === id) {
      held.value = null;
      emit('resume', id);
    }
  };
  const onFocusOut = (e: FocusEvent, id: string) => {
    if ((e.currentTarget as HTMLElement).contains(e.relatedTarget as Node | null)) return;
    hold(id, false);
  };
  // A pill that can open and close is a disclosure button; one that is always a card is not.
  const isDisclosure = (t: Toast) => hasMore(t) && props.expand !== 'always' && !reduced.value;
  const togglePinned = (id: string) => (pinned.has(id) ? pinned.delete(id) : pinned.add(id));

  const timers = new Map<string, ReturnType<typeof setTimeout>[]>();
  const clearTimers = (id: string) => {
    for (const t of timers.get(id) ?? []) clearTimeout(t);
    timers.delete(id);
  };
  const schedule = (t: Toast) => {
    clearTimers(t.id);
    autoOpen.delete(t.id);
    const pilot = t.autopilot ?? props.autopilot;
    if (pilot === false || props.expand !== 'auto' || !hasMore(t)) return;
    const expandAt = pilot.expand ?? 150;
    const list = [setTimeout(() => autoOpen.add(t.id), expandAt)];
    if (t.duration && t.duration > 0) {
      const collapseAt = Math.max(expandAt, t.duration - (pilot.collapse ?? 2000));
      list.push(setTimeout(() => autoOpen.delete(t.id), collapseAt));
    }
    timers.set(t.id, list);
  };

  // A new toast, or a changed one (promise() settling), runs its autopilot again.
  const seen = new Map<string, string>();
  watch(
    () => props.toasts.map((t) => [t, `${t.type}|${t.title}|${t.message}|${t.description}|${t.duration}`] as const),
    (list) => {
      const live = new Set<string>();
      for (const [t, sig] of list) {
        live.add(t.id);
        if (seen.get(t.id) === sig) continue;
        seen.set(t.id, sig);
        schedule(t);
      }
      for (const id of [...seen.keys()]) {
        if (live.has(id)) continue;
        seen.delete(id);
        clearTimers(id);
        autoOpen.delete(id);
        pinned.delete(id);
        pillWidths.delete(id);
        bodyHeights.delete(id);
        if (held.value === id) held.value = null;
      }
      nextTick(measureAll);
    },
    { immediate: true },
  );

  /* ------------------------------- Swipe ------------------------------- */

  // A short drag toward the edge or away from it dismisses, as in Sileo. Buttons keep their click.
  const onPointerDown = (e: PointerEvent, id: string) => {
    if ((e.target as HTMLElement).closest('button')) return;
    const el = (e.currentTarget as HTMLElement).querySelector<HTMLElement>(`[data-swipe="${id}"]`);
    if (!el) return;
    const start = e.clientY;
    const move = (ev: PointerEvent) => {
      const dy = ev.clientY - start;
      el.style.transform = `translateY(${Math.sign(dy) * Math.min(Math.abs(dy), 20)}px)`;
    };
    const up = (ev: PointerEvent) => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      el.style.transform = '';
      if (Math.abs(ev.clientY - start) > 30) removeToast(id);
    };
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerup', up, { passive: true });
  };

  /* --------------------------- Announcement ---------------------------- */

  // Read once through the shared live regions, and again when a toast changes (loading → done).
  // Errors interrupt; the rest waits.
  const { announce } = useAnnouncer();
  const spoken = new Map<string, string>();
  watch(
    () => props.toasts.map((t) => [t.id, t.type, [t.title, t.message, t.description].filter(Boolean).join('. ')] as const),
    (list) => {
      const live = new Set<string>();
      for (const [id, type, text] of list) {
        live.add(id);
        if (spoken.get(id) === `${type}|${text}`) continue;
        spoken.set(id, `${type}|${text}`);
        announce(text, type === 'error' ? 'assertive' : 'polite');
      }
      for (const id of spoken.keys()) if (!live.has(id)) spoken.delete(id);
    },
    { immediate: true },
  );

  /* ------------------------------ Actions ------------------------------ */

  const removeToast = (id: string) => emit('remove', id);
  // The action runs, then the toast closes: an Undo that leaves "Deleted" on screen reads as failed.
  const runAction = (t: Toast) => {
    t.action?.onClick();
    removeToast(t.id);
  };

  onMounted(() => {
    fitWidth();
    window.addEventListener('resize', fitWidth);
    observer = new ResizeObserver((entries) => entries.forEach((entry) => measure(entry.target)));
    // A preset switch changes the radius and the bounce.
    new MutationObserver(() => tokenTick.value++).observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-vt-preset', 'data-theme', 'style'],
    });
    measureAll();
  });

  onBeforeUnmount(() => {
    window.removeEventListener('resize', fitWidth);
    observer?.disconnect();
    for (const id of timers.keys()) clearTimers(id);
  });
</script>

<style scoped>
  .vt-toaster[data-position^='top'] {
    top: 0;
  }
  .vt-toaster[data-position^='bottom'] {
    bottom: 0;
  }
  .vt-toaster[data-position$='left'] {
    inset-inline-start: 0;
  }
  .vt-toaster[data-position$='right'] {
    inset-inline-end: 0;
  }
  .vt-toaster[data-position$='center'] {
    left: 50%;
    translate: -50% 0;
  }

  /* Inverse (default): the page's text colour is the fill, so it is ink on Ink's grey, pine on
     Pine, light in dark. Surface: a raised surface with a border, like a card. */
  .vt-toast {
    --toast-fill: var(--color-text);
    --toast-edge: transparent;
    --toast-ink: var(--color-bg);
    --toast-ink-muted: color-mix(in oklch, var(--color-bg) 72%, var(--color-text));
    color: var(--toast-ink);
    touch-action: none;
  }
  .vt-toast[data-tone='surface'] {
    --toast-fill: var(--color-surface-raised);
    --toast-edge: var(--color-border-strong);
    --toast-ink: var(--color-text);
    --toast-ink-muted: var(--color-text-muted);
  }
  .vt-fill {
    fill: var(--toast-fill);
  }
  .vt-edge {
    fill: var(--toast-edge);
  }

  /* Status lives in the badge (and the countdown). */
  .vt-toast {
    --status: var(--color-info);
    --status-text: var(--color-info-text);
    --status-subtle: var(--color-info-subtle);
  }
  .vt-toast[data-type='success'] {
    --status: var(--color-success);
    --status-text: var(--color-success-text);
    --status-subtle: var(--color-success-subtle);
  }
  .vt-toast[data-type='error'] {
    --status: var(--color-danger);
    --status-text: var(--color-danger-text);
    --status-subtle: var(--color-danger-subtle);
  }
  .vt-toast[data-type='warning'] {
    --status: var(--color-warning);
    --status-text: var(--color-warning-text);
    --status-subtle: var(--color-warning-subtle);
  }
  .vt-toast[data-type='loading'] {
    --status: var(--color-text-subtle);
    --status-text: var(--color-text-muted);
    --status-subtle: var(--color-muted);
  }
  /* On the inverse fill the status colour mixes toward the page colour, so it reads on dark and light. */
  .vt-toast[data-tone='inverse'] {
    --toast-tone: color-mix(in oklch, var(--status) 70%, var(--color-bg));
    --toast-tone-bg: color-mix(in oklch, var(--toast-tone) 22%, transparent);
  }
  .vt-toast[data-tone='surface'] {
    --toast-tone: var(--status-text);
    --toast-tone-bg: var(--status-subtle);
  }
  .vt-badge {
    color: var(--toast-tone);
    background-color: var(--toast-tone-bg);
  }

  .vt-countdown {
    background-color: color-mix(in oklch, var(--toast-tone) 25%, transparent);
  }
  .vt-countdown-bar {
    background-color: var(--toast-tone);
    animation-name: vt-countdown;
    animation-timing-function: linear;
    animation-fill-mode: forwards;
  }
  @keyframes vt-countdown {
    from {
      transform: scaleX(1);
    }
    to {
      transform: scaleX(0);
    }
  }

  .vt-body {
    opacity: 0;
    pointer-events: none;
    transition: opacity calc(var(--vt-duration) * 0.5) var(--vt-ease-exit);
  }
  .vt-body[data-open='true'] {
    opacity: 1;
    pointer-events: auto;
    transition: opacity var(--vt-duration-enter) var(--vt-ease) var(--vt-duration);
  }
  .vt-description {
    color: var(--toast-ink-muted);
  }

  .vt-button {
    color: var(--toast-ink);
    background-color: color-mix(in oklch, var(--toast-ink) 12%, transparent);
    transition: background-color var(--vt-duration) var(--vt-ease);
  }
  .vt-button:hover {
    background-color: color-mix(in oklch, var(--toast-ink) 20%, transparent);
  }
  .vt-button-action {
    color: var(--toast-fill);
    background-color: var(--toast-ink);
  }
  .vt-button-action:hover {
    background-color: color-mix(in oklch, var(--toast-ink) 88%, var(--toast-fill));
  }
  /* 44px hit areas on 28px buttons (bible §2). */
  .vt-button::after {
    content: '';
    position: absolute;
    inset: -8px -4px;
  }

  .vt-pill {
    color: var(--toast-ink);
  }

  /* A state change (loading → saved) cross-fades the header through a blur, as in Sileo. */
  .vt-swap-enter-active {
    transition:
      opacity var(--vt-duration-enter) var(--vt-ease),
      filter var(--vt-duration-enter) var(--vt-ease);
  }
  .vt-swap-leave-active {
    position: absolute;
    inset-inline-start: 0.5rem;
    transition:
      opacity var(--vt-duration-exit) var(--vt-ease-exit),
      filter var(--vt-duration-exit) var(--vt-ease-exit);
  }
  .vt-swap-enter-from,
  .vt-swap-leave-to {
    opacity: 0;
    filter: blur(6px);
  }

  @media (prefers-reduced-motion: reduce) {
    .vt-swap-enter-from,
    .vt-swap-leave-to {
      filter: none;
    }
  }
</style>
