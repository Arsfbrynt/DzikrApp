<template>
  <div class="card-outer" ref="cardOuter">
    <!-- Share action revealed on swipe left -->
    <div
      class="share-reveal"
      :style="{
        opacity: revealOpacity,
        transform: `translateX(${revealTranslate}px)`,
      }"
    >
      <button class="share-btn" @click="handleShare">
        <Share2 :size="20" />
        <span>Share</span>
      </button>
    </div>

    <!-- Main card -->
    <div
      class="dzikir-card glass-card"
      translate="no"
      :style="{
        transform: `translateX(${dragX}px)`,
        transition: isDragging
          ? 'none'
          : 'transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      }"
      @touchstart.passive="onTouchStart"
      @touchmove.passive="onTouchMove"
      @touchend="onTouchEnd"
    >
      <!-- Card number badge -->
      <div class="flex items-start justify-between">
        <div class="flex gap-2 items-start">
          <div class="card-number">{{ index + 1 }}</div>

          <!-- source -->
          <div
            class="text-xs flex font-semibold !pt-1"
            :style="{ color: 'var(--theme-accent)' }"
          >
            {{ card.surah || "" }}
          </div>
        </div>

        <div v-if="card.faedah">
          <MessageCircleQuestionMark
            :size="12"
            style="color: var(--theme-accent)"
            class="!w-6 !h-6 !pt-1 cursor-pointer"
            @click="$emit('play', card)"
          />
        </div>
      </div>
      <!-- Arabic -->
      <p
        class="arabic-text notranslate"
        lang="ar"
        dir="rtl"
        translate="no"
        :style="{ fontSize: `calc(var(--dzikr-font-size) * 1.4)` }"
      >
        {{ card.arabic }}
      </p>

      <!-- Divider -->
      <div
        class="card-divider"
        v-if="settingStore.isShowLatin || settingStore.isShowTranslate"
      />

      <!-- Latin -->
      <p
        class="latin-text notranslate"
        lang="id"
        translate="no"
        :style="{ fontSize: `var(--dzikr-font-size)` }"
        v-if="settingStore.isShowLatin"
      >
        {{ card.latin }}
      </p>

      <!-- Terjemahan -->
      <p
        v-if="settingStore.isShowTranslate"
        class="terjemahan-text"
        lang="id"
        :style="{ fontSize: `calc(var(--dzikr-font-size) * 0.88)` }"
      >
        {{ card.terjemahan }}
      </p>

      <!-- Swipe hint (only on first card) -->
      <div v-if="index === 0 && showHint" class="swipe-hint">
        <ChevronLeft :size="14" />
        <span>geser untuk share</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import {
  Share2,
  ChevronLeft,
  MessageCircleQuestionMark,
} from "lucide-vue-next";
import { useDzikirStore } from "@/stores/dzikir";
import { useSettingStore } from "@/stores/setting";

interface Card {
  id: number;
  arabic: string;
  latin: string;
  surah?: string | null;
  faedah?: string | null;
  terjemahan?: string;
  source?: any;
}

const props = defineProps<{
  card: Card;
  index: number;
  source: any;
}>();

const router = useRouter();
const dzikirStore = useDzikirStore();
const settingStore = useSettingStore();

const dragX = ref(0);
const isDragging = ref(false);
const startX = ref(0);
const showHint = ref(true);

const SWIPE_THRESHOLD = -70;
const MAX_DRAG = -100;

const revealOpacity = computed(() => Math.min(1, Math.abs(dragX.value) / 80));
const revealTranslate = computed(() => 80 + dragX.value);

function onTouchStart(e: TouchEvent) {
  startX.value = e.touches[0].clientX;
  isDragging.value = true;
  showHint.value = false;
}

function onTouchMove(e: TouchEvent) {
  if (!isDragging.value) return;
  const dx = e.touches[0].clientX - startX.value;
  if (dx > 0) {
    dragX.value = 0;
    return;
  }
  dragX.value = Math.max(MAX_DRAG, dx);
}

function onTouchEnd() {
  isDragging.value = false;
  if (dragX.value < SWIPE_THRESHOLD) {
    dragX.value = -88; // snap open
  } else {
    dragX.value = 0; // snap close
  }
}

function handleShare() {
  dzikirStore.setSelectedCard({ ...props.card, source: props.source });
  dragX.value = 0;
  router.push("/share");
}
</script>

<style scoped>
.notranslate {
  unicode-bidi: isolate;
}
.card-outer {
  position: relative;
  overflow: hidden;
  border-radius: 20px;
  margin-bottom: 14px;
}

.share-reveal {
  position: absolute;
  right: 0;
  padding-left: 20px;
  top: 0;
  bottom: 0;
  width: 88px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 0;
}

.share-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  background: var(--theme-accent);
  border: none;
  border-radius: 16px;
  color: white;
  font-family: "Plus Jakarta Sans", sans-serif;
  font-size: 11px;
  font-weight: 700;
  padding: 12px 16px;
  cursor: pointer;
  width: 72px;
  transition:
    opacity 0.2s,
    transform 0.15s;
}
.share-btn:active {
  transform: scale(0.95);
}

.dzikir-card {
  position: relative;
  z-index: 1;
  border-radius: 20px;
  padding: 20px 18px 16px;
  will-change: transform;
  cursor: grab;
}
.dzikir-card:active {
  cursor: grabbing;
}

.card-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: var(--theme-accent);
  color: white;
  font-size: 11px;
  font-weight: 800;
  margin-bottom: 14px;
  opacity: 0.85;
}

.arabic-text {
  font-family: "Amiri", serif;
  direction: rtl;
  text-align: right;
  line-height: 2.2;
  color: var(--theme-nav-text);
  margin-bottom: 14px;
}

.card-divider {
  height: 1px;
  background: var(--theme-card-border);
  margin: 12px 0;
}

.latin-text {
  color: var(--theme-text-secondary);
  line-height: 1.7;
  font-style: italic;
  margin-bottom: 10px;
}

.terjemahan-text {
  color: var(--theme-text-secondary);
  line-height: 1.65;
  opacity: 0.85;
}

.swipe-hint {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--theme-accent);
  font-size: 11px;
  font-weight: 600;
  margin-top: 14px;
  opacity: 0.7;
  animation: hint-bounce 1.5s ease-in-out infinite;
}

@keyframes hint-bounce {
  0%,
  100% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(-4px);
  }
}
</style>
