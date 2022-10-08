<template>
  <div class="range-slider-container">
    <div class="bar" ref="barRef">
      <div class="slider slider-min" ref="sliderMinRef" @mousedown="clickSliderHandler('min', $event)">
        <div class="range-selected">
          {{ formatValuesFunction(minValue) }}
        </div>

        <div class="bar-range" ref="barRangeRef" :style="`left:${barRangeLeftPos}px; width:${barRangeWidth}px`"></div>
        <div class="slider slider-max" ref="sliderMaxRef" @mousedown="clickSliderHandler('max', $event)">
          <div class="range-selected range-selected-max">{{ formatValuesFunction(maxValue) }}</div>
        </div>
        <div class="labels">
          <div>
            {{ formatValuesFunction(min) }}
          </div>
          <div>
            {{ formatValuesFunction(max) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  props: {
    min: { type: Number, required: true },
    max: { type: Number, required: true },
    startingMin: { type: Number },
    startingMax: { type: Number },
    formatValuesFunction: {
      type: Function,
      default: (x: any) => {
        return x;
      },
    },
  },
  setup(props, context) {
    const sliderWidth = 15;
    const barRangeLeftPos = ref(0);
    const barRangeWidth = ref(0);
    const sliderMoving = ref("");
    const startX = ref(0);
    const minValue = ref(props.startingMin || props.min);
    const maxValue = ref(props.startingMax || props.max);

    const barRef = ref(null as unknown as HTMLElement);
    const sliderMinRef = ref(null as unknown as HTMLElement);
    const sliderMaxRef = ref(null as unknown as HTMLElement);

    const setSlidersPositionByValue = () => {
      const xMaxPos = (barRef.value.getBoundingClientRect().width * maxValue.value) / (props.max - props.min);
      const xMinPos = (barRef.value.getBoundingClientRect().width * minValue.value) / (props.max - props.min);

      sliderMinRef.value.style.left = xMinPos + "px";
      sliderMaxRef.value.style.left = xMaxPos + "px";
    };

    const setBarRangeWidthAndPosition = () => {
      barRangeLeftPos.value = (sliderMinRef.value.offsetLeft || 0) + sliderWidth;
      barRangeWidth.value = (sliderMaxRef.value.offsetLeft || 0) - (sliderMinRef.value.offsetLeft || 0) - sliderWidth;
      setSlidersPositionByValue();
    };

    const clickSliderHandler = (slider: string = "max", event: any) => {
      event.preventDefault();
      sliderMoving.value = slider;
      startX.value = event.clientX;
      window.addEventListener("mouseup", mouseUpHandler);
      window.addEventListener("mousemove", moveSliderHandler);
    };

    const mouseUpHandler = (): any => {
      window.removeEventListener("mouseup", mouseUpHandler);
      window.removeEventListener("mousemove", moveSliderHandler);
      context.emit("onRangeSelectedUpdate", [minValue.value, maxValue.value]);
    };

    const moveSliderHandler = (event: any): any => {
      event.preventDefault();
      if (sliderMoving.value === "min" && sliderMinRef.value) {
        const newXPosition = event.clientX - barRef.value.getBoundingClientRect().x;

        const maxSliderPosition = sliderMaxRef.value.offsetLeft - sliderWidth;

        if (newXPosition < maxSliderPosition && newXPosition >= 0) {
          sliderMinRef.value.style.left = newXPosition + "px";
          minValue.value = (props.max - props.min) * (newXPosition / barRef.value.getBoundingClientRect().width);
        }
      }

      if (sliderMoving.value == "max") {
        const newXPosition = event.clientx - barRef.value.getBoundingClientRect().x;
        const minSliderPosition = sliderMinRef.value.offsetLeft + sliderWidth;

        if (newXPosition > minSliderPosition && newXPosition <= barRef.value.getBoundingClientRect().width) {
          sliderMaxRef.value.style.left = newXPosition + "px";
          maxValue.value = (props.max - props.min) * (newXPosition / barRef.value.getBoundingClientRect().width);
        }
      }
      setBarRangeWidthAndPosition();
    };

    return {
      barRef,
      sliderMaxRef,
      sliderMinRef,
      clickSliderHandler,
      barRangeLeftPos,
      barRangeWidth,
      minValue,
      maxValue,
    };
  },
});
</script>

<style scoped>
.range-slider-container {
  padding-top: 30px;
  padding-bottom: 10px;
  padding-right: 15px;
}

.bar {
  height: 5px;
  background-color: rgb(225, 225, 225);
  border-radius: 20px;
  position: relative;
}

.bar-range {
  height: 5px;
  width: 120px;
  position: absolute;
  background-color: #b0d1eab3;
}

.slider {
  position: absolute;
  height: 15px;
  width: 15px;
  border-radius: 20px;
  background-color: royalblue;
  top: -5px;
}

.slider-min {
  left: 0px;
}

.slider-max {
  right: 0px;
}

.labels {
  display: flex;
  font-size: 12px;
  justify-content: space-between;
  margin-top: 5px;
  font-weight: 600;
}

.range-selected {
  margin-top: -20px;
  width: 50px;
  font-size: 10px;
  background-color: royalblue;
  color: white;
  font-weight: 600;
  padding: 1px 6px;
  width: max-content;
  border-radius: 5px;
  z-index: 3;
}

.range-selected-max {
  margin-left: -35px;
}
</style>
