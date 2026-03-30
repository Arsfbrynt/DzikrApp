import { defineStore } from "pinia";
import { ref, watch } from "vue";

export type ThemeName = "pink" | "blue" | "sage" | "peach" | "lilac" | "yellow";

export interface ThemeConfig {
  name: ThemeName;
  label: string;
  gradientFrom: string;
  gradientVia: string;
  gradientTo: string;
  textPrimary: string;
  textSecondary: string;
  accent: string;
  cardBg: string;
  cardBorder: string;
  shapeColor: string;
  navBg: string;
  navText: string;
  navActive: string;
}

export const THEMES: Record<ThemeName, ThemeConfig> = {
  pink: {
    name: "pink",
    label: "Pinkeu",
    gradientFrom: "#FDE8EF",
    gradientVia: "#FCE4F0",
    gradientTo: "#FBAED2",
    textPrimary: "#7C3D52",
    textSecondary: "#A05070",
    accent: "#F472B6",
    cardBg: "rgba(255,255,255,0.65)",
    cardBorder: "rgba(244,114,182,0.25)",
    shapeColor: "rgba(244,114,182,0.18)",
    navBg: "rgba(255,255,255,0.7)",
    navText: "#A05070",
    navActive: "#F472B6",
  },
  blue: {
    name: "blue",
    label: "Baby Blue",
    gradientFrom: "#E0F0FF",
    gradientVia: "#D0E8FF",
    gradientTo: "#BFDBFE",
    textPrimary: "#1E3A5F",
    textSecondary: "#3A6090",
    accent: "#60A5FA",
    cardBg: "rgba(255,255,255,0.65)",
    cardBorder: "rgba(96,165,250,0.25)",
    shapeColor: "rgba(96,165,250,0.15)",
    navBg: "rgba(255,255,255,0.7)",
    navText: "#3A6090",
    navActive: "#60A5FA",
  },
  sage: {
    name: "sage",
    label: "Ijo Estetik :v",
    gradientFrom: "#D4E9DF",
    gradientVia: "#C2DFCF",
    gradientTo: "#A8D5B5",
    textPrimary: "#2D4A3E",
    textSecondary: "#4A7060",
    accent: "#6EBF8B",
    cardBg: "rgba(255,255,255,0.65)",
    cardBorder: "rgba(110,191,139,0.25)",
    shapeColor: "rgba(110,191,139,0.18)",
    navBg: "rgba(255,255,255,0.7)",
    navText: "#4A7060",
    navActive: "#6EBF8B",
  },
  peach: {
    name: "peach",
    label: "Peacheu",
    gradientFrom: "#FFE8DA",
    gradientVia: "#FFD4BC",
    gradientTo: "#FFBFA0",
    textPrimary: "#7C3A28",
    textSecondary: "#A05540",
    accent: "#FB8C6A",
    cardBg: "rgba(255,255,255,0.65)",
    cardBorder: "rgba(251,140,106,0.25)",
    shapeColor: "rgba(251,140,106,0.18)",
    navBg: "rgba(255,255,255,0.7)",
    navText: "#A05540",
    navActive: "#FB8C6A",
  },
  lilac: {
    name: "lilac",
    label: "Lilac",
    gradientFrom: "#F5EDFF",
    gradientVia: "#EBDDFF",
    gradientTo: "#DCCBFF",
    textPrimary: "#4B3A6B",
    textSecondary: "#6B5A8E",
    accent: "#A78BFA",
    cardBg: "rgba(255,255,255,0.65)",
    cardBorder: "rgba(167,139,250,0.25)",
    shapeColor: "rgba(167,139,250,0.15)",
    navBg: "rgba(255,255,255,0.7)",
    navText: "#6B5A8E",
    navActive: "#A78BFA",
  },
  yellow: {
    name: "yellow",
    label: "Soft Honey",
    gradientFrom: "#FFFBEA",
    gradientVia: "#FFF4CC",
    gradientTo: "#FDE68A",
    textPrimary: "#5C4A1F",
    textSecondary: "#8A6E2F",
    accent: "#FACC15",
    cardBg: "rgba(255,255,255,0.65)",
    cardBorder: "rgba(250,204,21,0.25)",
    shapeColor: "rgba(250,204,21,0.15)",
    navBg: "rgba(255,255,255,0.7)",
    navText: "#8A6E2F",
    navActive: "#FACC15",
  },
};

export const useSettingStore = defineStore("setting", () => {
  const theme = ref<ThemeName>("pink");
  const fontSize = ref<number>(16); // px, range 14-22
  const isShowTranslate = ref<boolean>(false);
  const isShowLatin = ref<boolean>(false);

  const currentTheme = (): ThemeConfig => THEMES[theme.value];

  function setTheme(t: ThemeName) {
    theme.value = t;
    applyTheme();
  }

  function setFontSize(size: number) {
    fontSize.value = size;
    document.documentElement.style.setProperty(
      "--dzikr-font-size",
      `${size}px`,
    );
  }

  function setShowTranslate(t: boolean) {
    isShowTranslate.value = t;
  }

  function setShowLatin(t: boolean) {
    isShowLatin.value = t;
  }

  function applyTheme() {
    const t = THEMES[theme.value];
    const root = document.documentElement;
    root.style.setProperty("--theme-grad-from", t.gradientFrom);
    root.style.setProperty("--theme-grad-via", t.gradientVia);
    root.style.setProperty("--theme-grad-to", t.gradientTo);
    root.style.setProperty("--theme-text-primary", t.textPrimary);
    root.style.setProperty("--theme-text-secondary", t.textSecondary);
    root.style.setProperty("--theme-accent", t.accent);
    root.style.setProperty("--theme-card-bg", t.cardBg);
    root.style.setProperty("--theme-card-border", t.cardBorder);
    root.style.setProperty("--theme-shape", t.shapeColor);
    root.style.setProperty("--theme-nav-bg", t.navBg);
    root.style.setProperty("--theme-nav-text", t.navText);
    root.style.setProperty("--theme-nav-active", t.navActive);
    root.style.setProperty("--dzikr-font-size", `${fontSize.value}px`);
  }

  // Persist to localStorage
  function loadFromStorage() {
    const saved = localStorage.getItem("dzikr-settings");
    if (saved) {
      const parsed = JSON.parse(saved);
      theme.value = parsed.theme ?? "pink";
      fontSize.value = parsed.fontSize ?? 16;
    }
    applyTheme();
  }

  watch([theme, fontSize], () => {
    localStorage.setItem(
      "dzikr-settings",
      JSON.stringify({ theme: theme.value, fontSize: fontSize.value }),
    );
  });

  return {
    theme,
    fontSize,
    currentTheme,
    isShowTranslate,
    isShowLatin,
    setTheme,
    setFontSize,
    setShowLatin,
    setShowTranslate,
    applyTheme,
    loadFromStorage,
  };
});
