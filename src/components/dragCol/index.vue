<template>
  <div class="drager_col" ref="container" :style="{ width, height }">
    <div class="drager_left" :style="{ width: collapse ? '0' : left + '%' }">
      <div>
        <slot name="left"></slot>
      </div>
    </div>
    <div
      class="slider_col"
      @touchstart.passive="mobileDragCol"
      @mousedown="dragCol"
      :style="{
        width: sliderWidth + 'px',
        marginLeft: -sliderWidth + 'px',
        marginRight: -sliderWidth + 'px'
      }"
    ></div>
    <div class="drager_right" :style="{ width: collapse ? '100%' : 100 - left + '%' }">
      <div>
        <slot name="right"></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onMounted } from "vue";

export default defineComponent({
  name: "DragCol",
  props: {
    leftPercent: {
      type: Number,
      default: 50
    },
    collapse: {
      type: Boolean,
      default: false
    },

    sliderWidth: {
      type: Number,
      default: 20
    },
    width: {
      type: String,
      default: "400px"
    },
    height: {
      type: String,
      default: "400px"
    },
    sliderColor: {
      type: String,
      default: "#6f808d"
    },
    sliderBgColor: {
      type: String,
      default: "#1f2e3a"
    },
    sliderHoverColor: {
      type: String,
      default: "#6f808d"
    },
    sliderBgHoverColor: {
      type: String,
      default: "#16222a"
    },
    minLeft: {
      type: Number,
      default: 0
    },
    maxLeft: {
      type: Number,
      default: 100
    }
  },
  emits: ["isDragging", "dragging", "update:leftPercent"],

  setup(props, { emit }) {
    const container = ref<HTMLDivElement | null>(null);
    const left = ref(props.leftPercent); // Initial value of left
    const isDragging = ref(false);

    // Method to update left value within bounds
    const setLeft = (newLeft: number) => {
      if (newLeft < props.minLeft) {
        left.value = props.minLeft;
      } else if (newLeft > props.maxLeft) {
        left.value = props.maxLeft;
      } else {
        left.value = newLeft;
      }
    };

    // Mobile drag handler
    const mobileDragCol = (e: TouchEvent) => {
      e.stopPropagation();
      let oldPos = e.changedTouches[0].clientX;
      let oldPosPercent = left.value;
      let newPos: number;
      const containerWidth = container.value?.offsetWidth || 0;

      isDragging.value = true;
      emit("isDragging", isDragging.value);

      const sliderDrag = (e: TouchEvent) => {
        e.stopPropagation();
        newPos = e.changedTouches[0].clientX;
        const movingDistancePercent = ((oldPos - newPos) / containerWidth) * 100;
        const newPosPercent = oldPosPercent - movingDistancePercent;
        setLeft(newPosPercent);
        emit("dragging", left.value);
      };

      const cancelSliderDrag = () => {
        isDragging.value = false;
        emit("isDragging", isDragging.value);
        document.ontouchmove = null;
        document.ontouchend = null;
      };

      document.ontouchmove = sliderDrag;
      document.ontouchend = cancelSliderDrag;
    };

    const dragCol = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      let oldPos = e.clientX;
      let oldPosPercent = left.value;
      let newPos: number;
      const containerWidth = container.value?.offsetWidth || 0;

      isDragging.value = true;
      emit("isDragging", isDragging.value);

      const sliderDrag = (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        newPos = e.clientX;
        const movingDistancePercent = ((oldPos - newPos) / containerWidth) * 100;
        const newPosPercent = oldPosPercent - movingDistancePercent;
        setLeft(newPosPercent);
        emit("dragging", left.value);
      };

      const cancelSliderDrag = () => {
        isDragging.value = false;
        emit("isDragging", isDragging.value);
        document.onmouseup = null;
        document.onmousemove = null;
      };

      document.onmousemove = sliderDrag;
      document.onmouseup = cancelSliderDrag;
    };

    watch(left, newLeft => {
      emit("update:leftPercent", newLeft);
    });

    onMounted(() => {
      setLeft(left.value);
    });

    return {
      container,
      left,
      isDragging,
      mobileDragCol,
      dragCol
    };
  }
});
</script>

<style scoped>
.drager_col {
  box-sizing: border-box;
  display: flex;
  overflow: hidden;
}
.drager_left {
  padding-right: 10px;
}
.drager_left > div {
  height: 100%;

  /* overflow: hidden; */
}
.drager_right {
  padding-left: 10px;
}
.drager_right > div {
  height: 100%;
  overflow: hidden;
}
.slider_col {
  position: relative;
  z-index: 1;
  cursor: col-resize;
  background: var(--slider-bg-color);
  transition: background 0.2s;
}
.slider_col::before,
.slider_col::after {
  position: absolute;
  top: 50%;
  display: block;
  width: 1px;
  height: 24%;
  min-height: 30px;
  max-height: 70px;
  content: "";
  background-color: var(--slider-color);
  transition: background-color 0.2s;
  transform: translateY(-50%);
}
.slider_col:hover::before,
.slider_col:hover::after,
.slider_col:active::before,
.slider_col:active::after {
  background-color: var(--slider-hover-color);
}
.slider_col:hover,
.slider_col:active {
  background: var(--slider-bg-hover-color);
}
</style>
