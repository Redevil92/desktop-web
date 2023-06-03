import { onMounted, onUnmounted, ref, Ref } from "vue";

export default function useIsMouseOver(elementRef: Ref<HTMLElement | null>) {
  const isMouseOver = ref(false);

  const checkMouseOver = (event: any) => {
    const boundingRect = elementRef.value?.getBoundingClientRect();
    if (
      boundingRect &&
      event.clientX < boundingRect.x + boundingRect.width &&
      event.clientX > boundingRect.x &&
      event.clientY < boundingRect.y + boundingRect.height &&
      event.clientY > boundingRect.y
    ) {
      isMouseOver.value = true;
    } else {
      isMouseOver.value = false;
    }
  };

  onMounted(() => {
    window.addEventListener("mousemove", checkMouseOver);
  });

  onUnmounted(() => {
    window.removeEventListener("mousemove", checkMouseOver);
  });

  return { isMouseOver };
}
