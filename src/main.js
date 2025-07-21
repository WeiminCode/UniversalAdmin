import { createApp } from "vue";
import App from "./App.vue";
//清除默认样式
import "@/assets/less/index.less";
//配置路由
import router from "./router";
//配置element-plus
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
//配置@element-plus/icons-vue
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
//配置pinia
import { createPinia } from "pinia";
//配置mockjs
import "@/api/mock.js";

const pinia = createPinia();

const app = createApp(App);

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.use(router);

app.use(ElementPlus);

app.use(pinia);
//挂载
app.mount("#app");
