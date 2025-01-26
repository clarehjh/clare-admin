<template>
  <el-dialog
    v-model="dialogVisible"
    width="500px"
    draggable
    :show-close="needClose"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <template #header>
      <div class="my-header">
        <div style="font-weight: 500">修改密码</div>
      </div>
    </template>
    <el-form :model="ruleForm" label-position="right" label-width="100px" :rules="rules" ref="ruleFormRef">
      <el-form-item label="旧密码：" prop="oldPassword">
        <el-input v-model="ruleForm.oldPassword" type="password" placeholder="请输入旧密码" show-password />
        <template #label></template>
      </el-form-item>
      <el-form-item label="新密码：" prop="newPassword">
        <el-input
          @change="changePassword"
          v-model="ruleForm.newPassword"
          type="password"
          show-password
          placeholder="密码需包含数字、大、小写字母及符号，且至少8位"
        />
      </el-form-item>

      <el-form-item label="密码强度：" align="center">
        <el-progress :percentage="percentage" :color="customColorMethod"> {{ strength }} </el-progress>
      </el-form-item>
      <el-form-item label="确认新密码：" prop="password">
        <el-input
          v-model="ruleForm.password"
          placeholder="请再次输入新的密码"
          type="password"
          show-password
          autocomplete="new-password"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="footer">
        <!-- <el-button @click="dialogVisible = false">取消</el-button> -->
        <el-button type="primary" @click="submitForm">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { validatePasswordStrength } from "@/utils/checkPassword";
import { type FormInstance, type FormRules } from "element-plus";

const ruleFormRef = ref<FormInstance>();
// 强度条说明
const strength = ref("");
const percentage = ref(0);

// 密码校验规则
const validatePassword = (rule: any, value: string, callback: any) => {
  if (value === "") {
    callback(new Error("请输入新密码"));
  } else {
    const { message, tips } = validatePasswordStrength(value);
    strength.value = message;
    if (strength.value === "弱密码") {
      percentage.value = 25;
    }
    if (strength.value === "中密码") {
      percentage.value = 50;
    }
    if (strength.value === "强密码") {
      percentage.value = 75;
    }
    if (strength.value === "极强密码") {
      percentage.value = 100;
    }
    if (tips) callback(tips);
  }
};

const validatePass = (rule: any, value: string, callback: any) => {
  if (value === "") {
    callback(new Error("请输入旧密码"));
  } else {
    // if (props.oldPassword !== value) {
    //   callback(new Error("请输入正确的旧密码"));
    // } else {
    callback();
    // }
  }
};

const check = (rule: any, value: string, callback: any) => {
  if (value === "") {
    callback(new Error("请输入密码"));
  } else {
    if (ruleForm.newPassword !== value) {
      callback(new Error("两次密码不一致"));
    } else {
      callback();
    }
  }
};

const ruleForm = reactive({
  oldPassword: "",
  newPassword: "",
  password: ""
});
const rules = reactive<FormRules>({
  oldPassword: [{ validator: validatePass, trigger: "blur" }],
  newPassword: [{ validator: validatePassword, trigger: "change" }],
  password: [{ validator: check, trigger: "blur" }]
});

const customColorMethod = (percentage: number) => {
  if (percentage === 25) {
    return "#ec716f";
  }
  if (percentage === 50) {
    return "#e0a444";
  }
  if (percentage === 75) {
    return "#66b77b";
  }
  if (percentage === 100) {
    return "#4187f7";
  }
  return "#ffff";
};
const changePassword = (value: string | number) => {
  console.log(value);
  ruleForm.password = "";
};

const submitForm = () => {
  if (!ruleForm) return;
  if (strength.value !== "极强密码") return;
  if (ruleForm.newPassword !== ruleForm.password) return;
  if (ruleForm.password.length < 8) return;

  // modfyPassword({
  //   password: ruleForm.oldPassword,
  //   newPassword: ruleForm.newPassword
  // }).then((res: any) => {
  //   if (res.code === 200) {
  //     userStore.setToken(res.data);
  //     emit("success");
  //     // ElNotification.success("修改密码成功,2秒后自动跳转到登陆页面！");
  //     // setTimeout(() => {
  //     //   userStore.logOut();
  //     // }, 2000);
  //   }
  // });
};
const needClose = ref(false);
const dialogVisible = ref(false);
const openDialog = (tag?: number) => {
  needClose.value = tag ? true : false;
  dialogVisible.value = !dialogVisible.value;
};

defineExpose({ openDialog });
</script>
<style lang="scss" scoped>
:deep(.el-form) {
  width: 50%;
}
.el-progress--line {
  width: 100%;
}
.footer {
  padding-bottom: 24px;
}
</style>
