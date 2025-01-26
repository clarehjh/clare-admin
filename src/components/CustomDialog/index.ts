import { reactive } from "vue";
type dialogOptions = {
  title: string;
  component: any;
  props?: Object;
  width: string;
  top?: string;
  class?: string;
  alignCenter?: boolean; //垂直居中在弹性盒子中，所以top属性将不起作用
  visible?: boolean;
  callBack?: Function;
  allCloseCallBack?: Function; //所有关闭回调
  showCloseButton?: boolean; // 控制是否显示关闭按钮
};
export const dialogList: dialogOptions[] = reactive([]);

export const addDialog = (options: dialogOptions) => {
  dialogList.push(Object.assign(options, { visible: true }));
};

export const closeDialog = (item: dialogOptions, i: number, args?: any, isNativeClose?: boolean) => {
  dialogList.splice(i, 1);
  item.allCloseCallBack && item.allCloseCallBack(...args);
  if (!isNativeClose) item.callBack && item.callBack(...args);
};

// addDialogPromise
import { shallowRef } from "vue";
export const addDialogPromise = (title: string, component: any, width?: string, options?: Partial<dialogOptions>) => {
  return new Promise(resolve => {
    addDialog({
      title,
      width: width || "550px",
      alignCenter: true,
      props: {},
      ...options,
      component: shallowRef(component),
      allCloseCallBack: (data: any) => {
        return resolve(data);
      }
    });
  });
};

export const closeAllDialogs = (args?: any) => {
  dialogList.forEach((item, index) => {
    closeDialog(item, index, args, true);
  });
  dialogList.length = 0; // 清空对话框列表
};
