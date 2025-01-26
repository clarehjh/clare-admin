<template>
  <Teleport to="body">
    <el-dialog
      v-for="(item, index) in dialogList"
      :key="index"
      :title="item.title"
      :width="item.width"
      :top="item.top || ''"
      :class="item.class"
      :align-center="item.alignCenter || false"
      :close-on-click-modal="false"
      :show-close="item.showCloseButton !== false"
      v-model="item.visible"
      @close="() => closeDialog(item, index, '', true)"
    >
      <component :is="item.component" v-bind="item.props" @close="(...args: any) => closeDialog(item, index, args)" />
    </el-dialog>
  </Teleport>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount } from "vue";
import { dialogList, closeDialog } from "./index";

const handlePopState = () => {
  dialogList.forEach((item, index) => {
    if (item.visible) {
      closeDialog(item, index, "", true);
    }
  });
};

onMounted(() => {
  window.onpopstate = handlePopState;
});

onBeforeUnmount(() => {
  window.onpopstate = null;
});
</script>

<style>
.el-dialog__title {
  font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
  font-weight: bold;
}
</style>
