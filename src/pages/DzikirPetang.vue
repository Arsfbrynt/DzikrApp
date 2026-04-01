<template>
  <div class="dzikir-page">
    <!-- Header -->
    <div class="page-header">
      <div class="header-inner">
        <Moon :size="20" class="header-icon" />
        <div>
          <h1 class="page-title">Dzikir Petang</h1>
          <p class="page-sub">Dibaca Setelah Ashar - Maghrib</p>
        </div>
      </div>

      <!-- SoundCloud embed -->
      <div
        v-if="!showPlayer"
        class="mx-auto w-full flex flex-col items-center gap-1"
      >
        <Play
          :size="12"
          class="header-icon !w-7 !h-7"
          @click="showPlayer = true"
        />
        <p
          class="text-[11px] flex font-semibold"
          :style="{ color: 'var(--theme-accent)' }"
        >
          Klik ini kalo mau dibantuin baca
        </p>
      </div>
      <div class="soundcloud-wrap" v-if="showPlayer">
        <iframe
          :key="iframeSrc"
          width="100%"
          height="166"
          scrolling="no"
          frameborder="no"
          allow="autoplay"
          :src="iframeSrc"
        />
      </div>
    </div>

    <!-- Cards scroll area -->
    <div class="cards-scroll no-scrollbar">
      <DzikirCard
        v-for="(card, i) in cards"
        :key="card.id"
        :card="card"
        :index="i"
        source="petang"
        @play="openDetail"
      />
      <div class="scroll-bottom-pad" />
    </div>
    <DzikirDetailModal
      :visible="showDetail"
      :card="selectedCard"
      @close="showDetail = false"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { Moon, Play } from "lucide-vue-next";
import DzikirCard from "@/components/DzikirCard.vue";
import dzikirData from "@/data/dzikirPetang.json";
import DzikirDetailModal from "@/components/DzikirModal.vue";

const cards = ref(dzikirData);
const showPlayer = ref(false);

const showDetail = ref(false);
const selectedCard = ref<(typeof dzikirData)[0] | null>(null);

function openDetail(card: (typeof dzikirData)[0]) {
  selectedCard.value = card;
  showDetail.value = true;
}

const accentColor = getComputedStyle(document.documentElement)
  .getPropertyValue("--theme-grad-to")
  .trim();

const encodedColor = encodeURIComponent(accentColor);
const iframeSrc = computed(() => {
  if (!showPlayer.value) return "";

  return `https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/soundcloud%253Atracks%253A1950712179&color=${encodedColor}&auto_play=true&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=true`;
});
</script>

<style scoped>
.dzikir-page {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.page-header {
  padding: 20px 18px 12px;
  flex-shrink: 0;
}

.header-inner {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
}

.header-icon {
  color: var(--theme-accent);
  background: linear-gradient(
    120deg,
    var(--theme-grad-from),
    var(--theme-grad-to)
  );
  padding: 8px;
  border-radius: 12px;
  width: 40px;
  height: 40px;
}

.page-title {
  font-size: 1rem;
  font-weight: 800;
  color: var(--theme-text-primary);
  line-height: 1.1;
}

.page-sub {
  font-size: 0.75rem;
  color: var(--theme-text-secondary);
  margin-top: 2px;
}

.soundcloud-wrap {
  border-radius: 14px;
  overflow: hidden;
  background: var(--theme-card-bg);
  border: 1px solid var(--theme-card-border);
}

.cards-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 4px 18px 0;
}

.scroll-bottom-pad {
  height: 20px;
}
</style>
