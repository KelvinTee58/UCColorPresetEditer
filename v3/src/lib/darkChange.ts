import { useColorMode } from "@vueuse/core";
import { nextTick } from "vue";
const mode = useColorMode();

export default function toggleDark(event: MouseEvent, modeType: any = "auto") {
  // console.log(event, modeType, "now mode>", mode.value, mode.value == "dark");
  if (mode.value == modeType) {
    mode.value = modeType;
    return;
  }
  console.log("transition dark mode>");
  const x = event.clientX;
  const y = event.clientY;
  const endRadius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  // @ts-expect-error: Transition API
  const transition = document.startViewTransition(async () => {
    mode.value = modeType;
    await nextTick();
  });
  transition.ready.then(() => {
    const clipPath = [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`];
    document.documentElement.animate(
      {
        clipPath: clipPath,
      },
      {
        duration: 400,
        easing: "ease-out",
        pseudoElement: "::view-transition-new(root)",
      }
    );
  });
}
