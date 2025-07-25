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
//配置持久化插件
// import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
//配置mockjs
import "@/api/mock.js";

import { useAllDataStore } from "@/stores";

const pinia = createPinia();

//使用持久化插件
// pinia.use(piniaPluginPersistedstate);

const app = createApp(App);

app.use(pinia);

const store = useAllDataStore();

store.addMenu(router,"refresh");

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.use(router);

app.use(ElementPlus);


//挂载
app.mount("#app");
