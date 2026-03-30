import { defineStore } from "pinia";
import { ref } from "vue";

export interface DzikirCard {
  id: number;
  arabic: string;
  latin: string;
  terjemahan?: string;
  source: "pagi" | "petang";
}

export const useDzikirStore = defineStore("dzikir", () => {
  const selectedCard = ref<DzikirCard | null>(null);

  function setSelectedCard(card: DzikirCard) {
    selectedCard.value = card;
  }

  function clearSelectedCard() {
    selectedCard.value = null;
  }

  return { selectedCard, setSelectedCard, clearSelectedCard };
});
