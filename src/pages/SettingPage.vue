<template>
  <div class="setting-page">
    <div class="page-header">
      <h1 class="page-title">Pengaturan</h1>
      <p class="page-sub">Personalisasi tampilanmu</p>
    </div>

    <div class="setting-body no-scrollbar">
      <!-- Font size section -->
      <div class="setting-section glass-card">
        <div class="section-label">
          <Type :size="16" />
          Kustomisasi Huruf
        </div>

        <div class="font-preview">
          <p class="arabic-text" :style="{ fontSize: `${fontSize * 1.4}px` }">
            بِسْمِ اللَّهِ
          </p>
          <p class="latin-preview" :style="{ fontSize: `${fontSize}px` }">
            Bismillaah
          </p>
        </div>

        <div class="slider-wrap">
          <span class="slider-label">A</span>
          <input
            type="range"
            min="14"
            max="22"
            step="1"
            :value="fontSize"
            @input="onFontChange"
            class="font-slider"
          />
          <span class="slider-label big">A</span>
        </div>
        <p class="size-badge">{{ fontSize }}px</p>

        <div class="section-row !mt-4">
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

      <!-- Theme section -->
      <div class="setting-section glass-card">
        <div class="section-label">
          <Palette :size="16" />
          Tema Warna
        </div>

        <div class="theme-grid">
          <button
            v-for="t in allThemes"
            :key="t.name"
            class="theme-card"
            :class="{ active: currentTheme === t.name }"
            @click="selectTheme(t.name)"
          >
            <!-- Gradient preview -->
            <div
              class="theme-preview-bg"
              :style="{
                background: `linear-gradient(135deg, ${t.gradientFrom}, ${t.gradientTo})`,
              }"
            >
              <div class="theme-blob" :style="{ background: t.shapeColor }" />
              <!-- Mini card preview -->
              <div class="mini-card">
                <div
                  class="mini-line accent"
                  :style="{ background: t.accent }"
                />
                <div class="mini-line" />
                <div class="mini-line short" />
              </div>
            </div>
            <div class="theme-info">
              <span class="theme-name">{{ t.label }}</span>
              <div
                v-if="currentTheme === t.name"
                class="active-dot"
                :style="{ background: t.accent }"
              />
            </div>
          </button>
        </div>
      </div>

      <div class="bottom-pad" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { Type, Palette } from "lucide-vue-next";
import { useSettingStore, THEMES, type ThemeName } from "@/stores/setting";

const settingStore = useSettingStore();
const fontSize = computed(() => settingStore.fontSize);
const currentTheme = computed(() => settingStore.theme);

const allThemes = Object.values(THEMES);

function onFontChange(e: Event) {
  const val = Number((e.target as HTMLInputElement).value);
  settingStore.setFontSize(val);
}

function selectTheme(name: ThemeName) {
  settingStore.setTheme(name);
}

const showArabic = ref(true);
const showLatin = ref(true);

watch(
  showArabic,
  (val) => {
    settingStore.setShowTranslate(val);
  },
  { immediate: true },
);

watch(
  showLatin,
  (val) => {
    settingStore.setShowLatin(val);
  },
  { immediate: true },
);
</script>

<style scoped>
.setting-page {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.page-header {
  padding: 20px 18px 12px;
  flex-shrink: 0;
}

.page-title {
  font-size: 1.4rem;
  font-weight: 800;
  color: var(--theme-text-primary);
  line-height: 1.1;
}

.page-sub {
  font-size: 0.75rem;
  color: var(--theme-text-secondary);
  margin-top: 2px;
}

.setting-body {
  flex: 1;
  overflow-y: auto;
  padding: 4px 18px 0;
}

.setting-section {
  border-radius: 20px;
  padding: 18px;
  margin-bottom: 14px;
}

.section-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--theme-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 16px;
}

/* Font preview */
.font-preview {
  background: var(--theme-shape);
  border-radius: 14px;
  padding: 14px;
  margin-bottom: 16px;
  text-align: center;
}

.arabic-text {
  font-family: "Amiri", serif;
  direction: rtl;
  color: var(--theme-text-primary);
  margin-bottom: 4px;
  transition: font-size 0.2s;
}

.latin-preview {
  color: var(--theme-text-secondary);
  font-style: italic;
  transition: font-size 0.2s;
}

.slider-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
}

.slider-label {
  font-size: 12px;
  font-weight: 700;
  color: var(--theme-text-secondary);
  width: 14px;
  text-align: center;
}
.slider-label.big {
  font-size: 20px;
}

.font-slider {
  flex: 1;
  -webkit-appearance: none;
  height: 5px;
  border-radius: 10px;
  background: var(--theme-card-border);
  outline: none;
}
.font-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: var(--theme-accent);
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transition: transform 0.15s;
}
.font-slider::-webkit-slider-thumb:active {
  transform: scale(1.15);
}

.size-badge {
  font-size: 11px;
  font-weight: 700;
  color: var(--theme-accent);
  text-align: right;
  margin-top: 8px;
}

/* Theme grid */
.theme-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.theme-card {
  border: 2px solid transparent;
  border-radius: 18px;
  overflow: hidden;
  cursor: pointer;
  background: none;
  padding: 0;
  transition:
    border-color 0.2s,
    transform 0.15s,
    box-shadow 0.2s;
  text-align: left;
}
.theme-card.active {
  border-color: var(--theme-accent);
  transform: scale(1.02);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
}

.theme-preview-bg {
  height: 100px;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.theme-blob {
  position: absolute;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  top: -30px;
  right: -20px;
  filter: blur(20px);
}

.mini-card {
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(6px);
  border-radius: 10px;
  padding: 10px;
  width: 70px;
  position: relative;
  z-index: 1;
}

.mini-line {
  height: 4px;
  background: rgba(0, 0, 0, 0.15);
  border-radius: 4px;
  margin-bottom: 5px;
}
.mini-line.accent {
  height: 5px;
  margin-bottom: 7px;
}
.mini-line.short {
  width: 60%;
  margin-bottom: 0;
}

.theme-info {
  background: rgba(255, 255, 255, 0.7);
  padding: 8px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.theme-name {
  font-size: 12px;
  font-weight: 700;
  color: #444;
}

.active-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.bottom-pad {
  height: 24px;
}
</style>
