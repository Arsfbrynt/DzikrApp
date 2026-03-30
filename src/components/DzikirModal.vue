<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="visible" class="modal-backdrop" @click.self="close">
        <Transition name="modal-slide">
          <div v-if="visible" class="modal-sheet">
            <!-- Close button -->
            <button class="close-btn" @click="close">
              <X :size="16" />
            </button>

            <!-- Title -->
            <p class="modal-title">Faedah & Sumber</p>

            <!-- Body -->
            <div class="modal-body">
              <!-- Balloon area -->
              <div class="balloon-zone">
                <div class="balloon">
                  <div class="balloon-scroll">
                    <!-- Faedah -->
                    <div v-if="card?.faedah">
                      <p class="section-label">Faedah</p>
                      <p class="section-text">{{ card.faedah }}</p>
                    </div>

                    <!-- Source -->
                    <div v-if="card?.source" class="source-block">
                      <p class="section-label">Sumber</p>
                      <p class="source-text">{{ card.source }}</p>
                    </div>
                  </div>
                  <!-- Balloon tail -->
                  <div class="balloon-tail" />
                </div>
              </div>

              <!-- Avatar -->
              <div class="avatar-wrap">
                <img
                  :src="`/avatar/${avatarIndex}.webp`"
                  :alt="`avatar ${avatarIndex}`"
                  class="avatar-img"
                />
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { X } from "lucide-vue-next";

interface CardDetail {
  id?: number;
  faedah?: string | null;
  source?: string | null;
  [key: string]: unknown;
}

const props = defineProps<{
  visible: boolean;
  card: CardDetail | null;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

function close() {
  emit("close");
}

const avatarIndex = ref(1);

// Randomize avatar (1–4) setiap modal terbuka
watch(
  () => props.visible,
  (val) => {
    if (val) {
      avatarIndex.value = Math.floor(Math.random() * 4) + 1;
    }
  },
);
</script>
<style scoped>
/* ── Backdrop ── */
.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: color-mix(in srgb, var(--theme-text-primary) 28%, transparent);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: env(safe-area-inset-bottom, 0px);
}

/* ── Sheet ── */
.modal-sheet {
  background: linear-gradient(
    145deg,
    var(--theme-grad-from),
    var(--theme-grad-via) 50%,
    var(--theme-grad-to)
  );
  border-radius: 28px 28px 20px 20px;
  width: 100%;
  max-width: 440px;
  height: 55vh;
  padding: 20px 20px 0;
  position: relative;
  box-shadow: 0 -4px 40px rgba(124, 61, 82, 0.15);
}

/* ── Close ── */
.close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 1.5px solid var(--theme-card-border);
  background: var(--theme-card-bg);
  color: var(--theme-text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s;
}
.close-btn:active {
  background: var(--theme-shape);
}

/* ── Title ── */
.modal-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--theme-text-primary);
  margin: 0 0 16px;
  padding-right: 36px;
}

/* ── Body layout ── */
.modal-body {
  align-items: flex-end;
  padding-bottom: 16px;
}

/* ── Balloon ── */
.balloon-zone {
  position: relative;
}

.balloon {
  background: var(--theme-card-bg);
  border: 1px solid var(--theme-card-border);
  border-radius: 18px 18px 18px 4px;
  padding: 14px 14px 12px;
  position: relative;
}

.balloon-scroll {
  max-height: 220px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: var(--theme-accent) transparent;
  padding-right: 2px;
}
.balloon-scroll::-webkit-scrollbar {
  width: 3px;
}
.balloon-scroll::-webkit-scrollbar-thumb {
  background: var(--theme-accent);
  border-radius: 4px;
  opacity: 0.4;
}

/* tail — warna harus match background balloon */
.balloon-tail {
  position: absolute;
  bottom: -10px;
  right: 30px;
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 0 solid transparent;
  border-top: 10px solid var(--theme-card-bg);
}

/* ── Section labels ── */
.section-label {
  font-size: 10px;
  font-weight: 700;
  color: var(--theme-accent);
  text-transform: uppercase;
  letter-spacing: 0.07em;
  margin: 0 0 5px;
}

.section-text {
  font-size: 12.5px;
  color: var(--theme-text-primary);
  line-height: 1.7;
  margin: 0 0 12px;
}

.source-block {
  border-top: 1px solid var(--theme-card-border);
  padding-top: 10px;
  margin-top: 4px;
}

.source-text {
  font-size: 11px;
  color: var(--theme-text-secondary);
  font-style: italic;
  line-height: 1.55;
  margin: 0;
}

/* ── Avatar ── */
.avatar-wrap {
  display: flex;
  flex-direction: column;
  align-items: end;
  justify-content: flex-end;
  padding-top: 10px;
}

.avatar-img {
  width: 100%;
  max-width: 64px;
  height: 100%;
  object-fit: cover;
}

/* ── Transitions ── */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.25s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-slide-enter-active {
  transition: transform 0.32s cubic-bezier(0.34, 1.2, 0.64, 1);
}
.modal-slide-leave-active {
  transition: transform 0.22s ease-in;
}
.modal-slide-enter-from,
.modal-slide-leave-to {
  transform: translateY(100%);
}
</style>
