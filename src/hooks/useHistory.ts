import { ref, watch } from "vue";

export interface History {
  canGoBack: boolean;
  canGoForward: boolean;
  currentUrl: string;
  history: string[];
  moveHistory: (step: number) => void;
  position: number;
}
,
export default function useHistory(url: string, id: string): History {
  const currentUrl = ref(url);
  const history = ref([url]);
  const position = ref(0);

  const setCurrentUrl = (newUrl: string) => (currentUrl.value = newUrl);
  const setHistory = (newHistory: string[]) => (history.value = newHistory);
  const setPosition = (newPosition: number) => (position.value = newPosition);

  watch(currentUrl, async function (newUrl, oldUrl) {
    if (newUrl !== oldUrl) {
      setPosition(position.value + 1);
      setCurrentUrl(newUrl);
      setHistory([...history.value.slice(0, position.value + 1), newUrl]);
    }
  });

  const moveHistory = (step: number): void => {
    const newPosition = position.value + step;

    setPosition(newPosition);
    setCurrentUrl(history.value[newPosition]);
  };

  return {
    canGoBack: position.value > 0,
    canGoForward: position.value < history.value.length - 1,
    currentUrl: currentUrl.value,
    history: history.value,
    moveHistory,
    position: position.value,
  };
}
