<template>
  <div class="share-page">
    <!-- Header -->
    <div class="share-header">
      <button class="back-btn" @click="goBack">
        <ArrowLeft :size="20" />
      </button>
      <span class="share-title">Bagikan Dzikir</span>
      <button class="dl-btn" @click="downloadImage" :disabled="isExporting">
        <Download :size="18" />
      </button>
    </div>

    <div class="share-body no-scrollbar">
      <!-- Preview Card (3:4 ratio) -->
      <div class="preview-wrap">
        <div
          class="card-preview"
          ref="cardRef"
          :style="{
            backgroundImage: `url(${selectedImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }"
        >
          <!-- Decorative blobs -->
          <div class="blob blob-1" :style="{ background: blobColor }" />
          <div class="blob blob-2" :style="{ background: blobColor }" />

          <!-- Content -->
          <div class="card-content">
            <div class="card-source-badge">
              <p class="flex items-center gap-1 !-top-4">
                <span class="badge-icon">
                  {{ card?.source === "pagi" ? "🌤" : "🌙" }}
                </span>
                {{ card?.source === "pagi" ? "Dzikir Pagi" : "Dzikir Petang" }}
              </p>
            </div>

            <!-- Arabic (show if showArabic ON) -->
            <p class="preview-arabic" :style="{ fontSize: `${arabicSize}px` }">
              {{ card?.arabic }}
            </p>

            <div v-if="showArabic || showLatin" class="preview-divider" />

            <!-- Latin + Terjemahan (show if showLatin ON) -->

            <p
              v-if="showLatin"
              class="preview-latin"
              :style="{ fontSize: `${latinSize}px` }"
            >
              {{ card?.latin }}
            </p>
            <p
              v-if="showArabic"
              class="preview-terjemahan"
              :style="{ fontSize: `${terjemahanSize}px` }"
            >
              {{ card?.terjemahan }}
            </p>

            <!-- Spacer biar watermark ga nempel -->
          </div>

          <!-- Watermark -->
          <div class="watermark">
            DzikrApp by
            <p class="signature">ArsFbrynt</p>
          </div>
        </div>
      </div>

      <!-- ───────── Controls ───────── -->

      <!-- Toggle switches -->
      <div class="control-section glass-card">
        <div class="section-row">
          <span class="control-label">Latin</span>
          <button
            class="toggle-btn"
            :class="{ on: showLatin }"
            @click="showLatin = !showLatin"
            :style="showLatin ? { background: 'var(--theme-accent)' } : {}"
          >
            <span class="toggle-thumb" />
          </button>
        </div>
        <div class="divider-line" />
        <div class="section-row">
          <span class="control-label">Terjemahan</span>
          <button
            class="toggle-btn"
            :class="{ on: showArabic }"
            @click="showArabic = !showArabic"
            :style="showArabic ? { background: 'var(--theme-accent)' } : {}"
          >
            <span class="toggle-thumb" />
          </button>
        </div>
      </div>

      <!-- Font size sliders -->
      <div class="control-section glass-card">
        <div class="section-label-top">
          <Type :size="14" />
          Ukuran Huruf
        </div>

        <!-- Arabic size -->
        <div class="slider-row">
          <span class="slider-tag">Arab</span>
          <input
            type="range"
            min="4"
            max="28"
            step="1"
            :value="arabicSize"
            @input="
              arabicSize = Number(($event.target as HTMLInputElement).value)
            "
            class="font-slider"
          />
          <span class="size-val">{{ arabicSize }}px</span>
        </div>

        <!-- Latin size -->
        <div v-if="showLatin" class="slider-row">
          <span class="slider-tag">Latin</span>
          <input
            type="range"
            min="4"
            max="18"
            step="1"
            :value="latinSize"
            @input="
              latinSize = Number(($event.target as HTMLInputElement).value)
            "
            class="font-slider"
          />
          <span class="size-val">{{ latinSize }}px</span>
        </div>

        <!-- Terjemahan size -->
        <div v-if="showArabic" class="slider-row">
          <span class="slider-tag">Terjemahan</span>
          <input
            type="range"
            min="4"
            max="14"
            step="1"
            :value="terjemahanSize"
            @input="
              terjemahanSize = Number(($event.target as HTMLInputElement).value)
            "
            class="font-slider"
          />
          <span class="size-val">{{ terjemahanSize }}px</span>
        </div>
      </div>

      <!-- BG picker label -->
      <p class="picker-label">Pilih Background</p>

      <!-- BG options grid -->
      <div class="bg-grid">
        <button
          v-for="(bg, i) in currentBgOptions"
          :key="i"
          class="bg-option"
          :class="{ selected: selectedImage === bg.image }"
          :style="{
            backgroundImage: `url(${bg.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }"
          @click="selectBg(bg)"
        >
          <span v-if="selectedImage === bg.image" class="check-icon">✓</span>
          <span class="bg-label">{{ bg.label }}</span>
        </button>
      </div>

      <div class="bottom-pad" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { ArrowLeft, Download, Type } from "lucide-vue-next";
import { useDzikirStore } from "@/stores/dzikir";
import html2canvas from "html2canvas";
import { useSettingStore } from "../stores/setting";

const router = useRouter();
const dzikirStore = useDzikirStore();
const settingStore = useSettingStore();
const card = computed(() => dzikirStore.selectedCard);

const cardRef = ref<HTMLElement | null>(null);
const isExporting = ref(false);
const blobColor = ref("rgba(244,114,182,0.25)");

// Toggle controls
const showArabic = ref(true);
const showLatin = ref(true);

// Font sizes
const arabicSize = ref(18);
const latinSize = ref(10);
const terjemahanSize = ref(9);

interface BgOption {
  image: string;
  label: string;
}

const currentBgOptions = computed(() => {
  return [1, 2, 3, 4].map((i) => ({
    image: `/bg/${settingStore.theme}/${i}.jpeg`,
    label: `BG ${i}`,
  }));
});

const selectedImage = ref("");

function selectBg(bg: BgOption) {
  selectedImage.value = bg.image;
}

onMounted(() => {
  selectBg(currentBgOptions.value[0]);
});

function goBack() {
  router.back();
}

async function downloadImage() {
  if (!cardRef.value || isExporting.value) return;
  isExporting.value = true;

  try {
    await document.fonts.ready;
    await new Promise((r) => setTimeout(r, 1000));

    cardRef.value.offsetHeight; // force reflow

    const canvas = await html2canvas(cardRef.value, {
      scale: 5,
      useCORS: true,
      backgroundColor: null,
      logging: false,
      removeContainer: true, // tambah ini
      width: cardRef.value.offsetWidth, // tambah ini
      height: cardRef.value.offsetHeight, // tambah ini
    });

    const link = document.createElement("a");
    link.download = `dzikr-pagi.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  } catch (e) {
    console.error(e);
  } finally {
    isExporting.value = false;
  }
}
</script>

<style>
.share-page {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.share-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 18px 12px;
  flex-shrink: 0;
}

.back-btn,
.dl-btn {
  width: 38px;
  height: 38px;
  border-radius: 12px;
  border: 1px solid var(--theme-card-border);
  background: var(--theme-card-bg);
  backdrop-filter: blur(8px);
  color: var(--theme-text-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition:
    opacity 0.2s,
    transform 0.15s;
}
.dl-btn:disabled {
  opacity: 0.5;
}
.back-btn:active,
.dl-btn:active {
  transform: scale(0.92);
}

.share-title {
  font-weight: 700;
  font-size: 1rem;
  color: var(--theme-text-primary);
}

.share-body {
  flex: 1;
  overflow-y: auto;
  padding: 0 18px;
}

.preview-wrap {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
}

.card-preview {
  position: relative;
  width: 228px;
  height: 304px;
  box-sizing: border-box;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.18);
  transition: background 0.4s ease;
}

.card-content {
  position: relative;
  z-index: 1;
  padding: 15px 10px 32px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.card-source-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 9px;
  font-weight: 700;
  margin-bottom: 20px;
  color: var(--theme-text-secondary);
}

.card-source-badge svg {
  margin-right: 5px;
}

.preview-arabic {
  font-family: "Amiri", serif;
  direction: rtl;
  text-align: right;
  line-height: 2;
  color: #2d2d2d;
  transition: font-size 0.15s;
}

.preview-divider {
  height: 1px;
  background: rgba(0, 0, 0, 0.12);
  margin: 8px 0;
}

.preview-latin {
  color: #555;
  font-style: italic;
  line-height: 1.6;
  margin-bottom: 6px;
  transition: font-size 0.15s;
}

.preview-terjemahan {
  color: #666;
  line-height: 1.55;
  transition: font-size 0.15s;
}

.watermark {
  position: absolute;
  bottom: 12px;
  opacity: 0.2;
  left: 40%;
  font-size: 7.5px;
  font-weight: 700;
  color: rgba(0, 0, 0, 0.4);
  letter-spacing: 0.3px;
  z-index: 1;
}

/* ── Controls ── */
.control-section {
  border-radius: 18px;
  padding: 14px 16px;
  margin-bottom: 12px;
}

.section-label-top {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--theme-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 14px;
}

.section-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2px 0;
}

.control-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--theme-text-primary);
}

.divider-line {
  height: 1px;
  background: var(--theme-card-border);
  margin: 10px 0;
}

/* Toggle switch */
.toggle-btn {
  width: 44px;
  height: 26px;
  border-radius: 13px;
  border: none;
  background: rgba(0, 0, 0, 0.12);
  position: relative;
  cursor: pointer;
  transition: background 0.25s ease;
  padding: 0;
  flex-shrink: 0;
}
.toggle-thumb {
  position: absolute;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: white;
  top: 3px;
  left: 3px;
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
}
.toggle-btn.on .toggle-thumb {
  transform: translateX(18px);
}

/* Sliders */
.slider-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}
.slider-row:last-child {
  margin-bottom: 0;
}

.slider-tag {
  font-size: 11px;
  font-weight: 700;
  color: var(--theme-text-secondary);
  width: 72px;
  flex-shrink: 0;
}

.font-slider {
  flex: 1;
  -webkit-appearance: none;
  height: 4px;
  border-radius: 10px;
  background: var(--theme-card-border);
  outline: none;
}
.font-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--theme-accent);
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  transition: transform 0.15s;
}
.font-slider::-webkit-slider-thumb:active {
  transform: scale(1.15);
}

.size-val {
  font-size: 10px;
  font-weight: 700;
  color: var(--theme-accent);
  width: 28px;
  text-align: right;
  flex-shrink: 0;
}

.empty-hint {
  font-size: 12px;
  color: var(--theme-text-secondary);
  text-align: center;
  padding: 4px 0;
}

/* BG Picker */
.picker-label {
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--theme-text-secondary);
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.theme-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.theme-tab {
  padding: 6px 16px;
  border-radius: 20px;
  border: 1px solid var(--theme-card-border);
  background: var(--theme-card-bg);
  font-family: "Plus Jakarta Sans", sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: var(--theme-text-secondary);
  cursor: pointer;
  transition: all 0.2s;
}

.bg-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin-bottom: 12px;
}

.bg-option {
  position: relative;
  aspect-ratio: 3/4;
  border-radius: 14px;
  border: 2px solid transparent;
  cursor: pointer;
  overflow: hidden;
  transition:
    border-color 0.2s,
    transform 0.15s;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  padding-bottom: 6px;
}
.bg-option.selected {
  border-color: var(--theme-accent);
  transform: scale(1.05);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);
}

.check-icon {
  position: absolute;
  top: 5px;
  right: 5px;
  background: white;
  color: #333;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  font-size: 9px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bg-label {
  font-size: 8.5px;
  font-weight: 700;
  color: rgba(0, 0, 0, 0.5);
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(4px);
  border-radius: 8px;
  padding: 2px 5px;
}

.bottom-pad {
  height: 24px;
}

.signature {
  font-family: "BrittanySignature", cursive;
  font-size: 8px;
  color: var(--theme-text-secondary);
  left: 1vw;
  position: relative;
}
</style>
