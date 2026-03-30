<template>
  <!-- Desktop guard -->
  <div v-if="isDesktop" class="desktop-guard">
    <div class="guard-content">
      <div class="guard-emoji">📱</div>
      <h1>bukanya di hp mang</h1>
      <p>App ini didesain khusus buat mobile.</p>
    </div>
  </div>

  <!-- Mobile app -->
  <div v-else class="app-wrapper">
    <!-- Animated background -->
    <div class="app-bg">
      <div class="bg-shape shape-1" />
      <div class="bg-shape shape-2" />
      <div class="bg-shape shape-3" />
    </div>

    <!-- Router view -->
    <div class="app-content">
      <RouterView />
    </div>

    <button v-if="canInstall" class="install-btn" @click="installApp">
      Install App
    </button>

    <!-- Bottom Nav (hidden on share page) -->
    <nav v-if="!isSharePage" class="bottom-nav">
      <RouterLink
        to="/pagi"
        class="nav-item"
        :class="{ active: route.path === '/pagi' }"
      >
        <Sun :size="22" />
        <span>Pagi</span>
      </RouterLink>
      <RouterLink
        to="/petang"
        class="nav-item"
        :class="{ active: route.path === '/petang' }"
      >
        <Moon :size="22" />
        <span>Petang</span>
      </RouterLink>
      <RouterLink
        to="/setting"
        class="nav-item"
        :class="{ active: route.path === '/setting' }"
      >
        <Settings2 :size="22" />
        <span>Pengaturan</span>
      </RouterLink>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { RouterView, RouterLink, useRoute } from "vue-router";
import { Sun, Moon, Settings2 } from "lucide-vue-next";
import { useSettingStore } from "@/stores/setting";

const route = useRoute();
const setting = useSettingStore();

const isDesktop = computed(() => window.innerWidth >= 768);
const isSharePage = computed(() => route.path === "/share");

const deferredPrompt = ref<any>(null);
const canInstall = ref(false);

onMounted(() => {
  setting.loadFromStorage();
  window.addEventListener("beforeinstallprompt", (e: any) => {
    e.preventDefault();
    deferredPrompt.value = e;
    canInstall.value = true;
  });

  window.addEventListener("appinstalled", () => {
    canInstall.value = false;
    deferredPrompt.value = null;
    console.log("App installed ✅");
  });
});

async function installApp() {
  if (!deferredPrompt.value) return;

  deferredPrompt.value.prompt();
  const choice = await deferredPrompt.value.userChoice;

  if (choice.outcome === "accepted") {
    console.log("User accepted install");
  } else {
    console.log("User dismissed install");
  }

  deferredPrompt.value = null;
  canInstall.value = false;
}
</script>

<style scoped>
.desktop-guard {
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #fde8ef, #fbaed2);
  font-family: "Plus Jakarta Sans", sans-serif;
}
.guard-content {
  text-align: center;
  padding: 2rem;
}
.guard-emoji {
  font-size: 4rem;
  margin-bottom: 1rem;
}
.guard-content h1 {
  font-size: 2rem;
  font-weight: 800;
  color: #7c3d52;
  margin-bottom: 0.5rem;
}
.guard-content p {
  color: #a05070;
  font-size: 1rem;
}

.app-wrapper {
  min-height: 100dvh;
  max-height: 100dvh;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

.app-bg {
  position: fixed;
  inset: 0;
  background: linear-gradient(
    160deg,
    var(--theme-grad-from),
    var(--theme-grad-via),
    var(--theme-grad-to)
  );
  z-index: 0;
  transition: background 0.6s ease;
}

.bg-shape {
  position: absolute;
  border-radius: 50%;
  background: var(--theme-shape);
  transition: background 0.6s ease;
  pointer-events: none;
}
.shape-1 {
  width: 280px;
  height: 280px;
  top: -80px;
  right: -80px;
  filter: blur(40px);
}
.shape-2 {
  width: 200px;
  height: 200px;
  bottom: 120px;
  left: -60px;
  filter: blur(30px);
}
.shape-3 {
  width: 150px;
  height: 150px;
  top: 40%;
  right: 20%;
  filter: blur(50px);
  opacity: 0.5;
}

.app-content {
  flex: 1;
  position: relative;
  z-index: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.bottom-nav {
  position: relative;
  z-index: 10;
  display: flex;
  background: var(--theme-nav-bg);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-top: 1px solid var(--theme-card-border);
  padding: 8px 0 max(8px, env(safe-area-inset-bottom));
  transition:
    background 0.4s,
    border-color 0.4s;
}

.nav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  text-decoration: none;
  color: var(--theme-nav-text);
  font-size: 11px;
  font-weight: 600;
  padding: 4px 0;
  transition:
    color 0.2s,
    transform 0.15s;
}
.nav-item.active {
  color: var(--theme-nav-active);
  transform: translateY(-1px);
}
.nav-item span {
  font-family: "Plus Jakarta Sans", sans-serif;
}

.install-btn {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;

  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  color: white;
  padding: 14px 22px;
  border-radius: 999px;

  font-size: 14px;
  font-weight: 700;

  box-shadow: 0 10px 30px rgba(124, 58, 237, 0.4);

  border: none;
  cursor: pointer;

  transition:
    transform 0.2s,
    opacity 0.2s;
}

.install-btn:active {
  transform: translateX(-50%) scale(0.95);
}
</style>
