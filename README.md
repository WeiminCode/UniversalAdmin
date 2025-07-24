# Vue3+Vite+Element-plus+Pinia+Apifox

## 创建项目

vite官方中文文档地址：https://cn.vitejs.dev/guide/#scaffolding-your-first-vite-project

    1、npm create vite@latest my-vue-app -- --template vue
    
    2、cd my-vue-app 
    
    3、npm install 
    
    4、npm run dev
    
    5、删除不需要的东西
    删除main.js中的 import './style.css'
    删除src/style.css 文件
    删除src/componments/HelloWorld.vue

安装必要的工具

    npm install less
    
    npm install vue-router 
    
    npm install element-plus
    
    npm install @element-plus/icons-vue
    
    安装时最好后面加个  -s  以便后面需要重新安装依赖时，自动导入

解决一下Vite 不能用@符定位到src目录的问题

    //修改全局配置vite.config.js
    
    
    export default defineConfig({
      plugins: [vue()],
      //这个resolve是添加的别名
      resolve:{
        alias:[
          {
            find: "@", replacement: "/src" 
          }
        ]
      }
    })
    

然后就是把images和less文件放入src/assets

less文件是清除初始样式的

    在main.js中引入
    
    import '@/assets/less/index.less'

配置路由

    新建src/router/index.js
    
    import { createRouter, createWebHashHistory } from 'vue-router'
    
    //制定路由规则
    const routes = [
        {
            path:'/',
            name:'main',
            component:()=>import('@/views/Main.vue')        
        }
    ];
    
    const router = createRouter({
        history:createWebHashHistory(),
        routes
    })
    
    export default router;

配置element-plus(完整引入)，也可按需引入，看下方

    //main.js
    
    import ElementPlus from 'element-plus'
    import 'element-plus/dist/index.css'
    
    app.use(ElementPlus)

按需引入

    //先安装
    npm install -D unplugin-vue-components unplugin-auto-import
    
    //再配置vite.config.js
    
    import { defineConfig } from 'vite'
    import AutoImport from 'unplugin-auto-import/vite'
    import Components from 'unplugin-vue-components/vite'
    import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
    
    export default defineConfig({
      // ...
      plugins: [
        // ...
        AutoImport({
          resolvers: [ElementPlusResolver()],
        }),
        Components({
          resolvers: [ElementPlusResolver()],
        }),
      ],
    })

配置element-plus图标，并全局注册

    //main.js
    
    import * as ElementPlusIconsVue from '@element-plus/icons-vue'
    
    const app = createApp(App)
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      app.component(key, component)
    }

配置APP.vue    全屏显示，防止滚动条出现

    <style>
        
    #app{
    	width:100%;
        height:100%;
        overflow:hidden;
    }
    
    </style>

main组件的实现

Main组件初步搭建

    <template>
      <div class="common-layout">
        <el-container class="lay-container">
          <!-- 自定义左侧组件 -->
           <common-aside/>
           <!-- 右侧 -->
          <el-container>
            <el-header class="el-header">
              <!-- 自定义右侧头部组件 -->
              <common-header/>
            </el-header>
            <el-main class="right-main">
              main
            </el-main>
          </el-container> 
        </el-container>
      </div>
    </template>
    
    <script>
    
    </script>
    
    <style scoped lang="less">
      .common-layout,.lay-container{
        height:100%;
      }
      .el-header{
        background-color: #333;
      }
    </style>

CommonAside组件静态搭建

    <template>
      <el-aside width="180px">
        <el-menu background-color="#545c64" text-color="#fff">
          <h3>通用后台管理系统</h3>
          <el-menu-item
            v-for="item in noChildren"
            :key="item.path"
            :index="item.path"
          >
            <component class="icons" :is="item.icon"> </component>
            <span>{{ item.label }}</span>
          </el-menu-item>
    
          <el-sub-menu
            v-for="item in hasChildren"
            :key="item.path"
            :index="item.path"
          >
            <template #title>
              <component class="icons" :is="item.icon"></component>
              <span>{{ item.label }}</span>
            </template>
            <el-menu-item-group>
              <el-menu-item
                v-for="(subItem, subIndex) in item.children"
                :key="subItem.path"
                :index="subItem.path"
              >
                <component class="icons" :is="subItem.icon"></component>
                <span>{{ subItem.label }}</span>
              </el-menu-item>
            </el-menu-item-group>
          </el-sub-menu>
        </el-menu>
      </el-aside>
    </template>
    
    <script setup>
    import { ref, computed } from "vue";
    
    const list = ref([
      {
        path: "/home",
        name: "home",
        label: "首页",
        icon: "house",
        url: "Home",
      },
      {
        path: "/mall",
        name: "mall",
        label: "商品管理",
        icon: "video-play",
        url: "Mall",
      },
      {
        path: "/user",
        name: "user",
        label: "用户管理",
        icon: "user",
        url: "User",
      },
      {
        path: "other",
        label: "其他",
        icon: "location",
        children: [
          {
            path: "/page1",
            name: "page1",
            label: "页面1",
            icon: "setting",
            url: "Page1",
          },
          {
            path: "/page2",
            name: "page2",
            label: "页面2",
            icon: "setting",
            url: "Page2",
          },
        ],
      },
    ]);
    
    const noChildren = computed(() => list.value.filter((item) => !item.children));
    const hasChildren = computed(() => list.value.filter((item) => item.children));
    </script>
    
    <style lang="less" scoped>
    .icons {
      width: 18px;
      height: 18px;
      margin-right: 5px;
    }
    .el-menu {
      border-right: none;
      h3 {
        line-height: 48px;
        color: #fff;
        text-align: center;
      }
    }
    .el-aside {
      background-color: #545c64;
      height: 100%;
    }
    </style>
    

Main组件引入使用CommonAside组件

    <template>
      <div class="common-layout">
        <el-container class="lay-container">
          <!-- 自定义左侧组件 -->
          <CommonAside />
          <!-- 右侧 -->
          <el-container>
            <el-header class="el-header">
              <!-- 自定义右侧头部组件 -->
              <common-header />
            </el-header>
            <el-main class="right-main"> main </el-main>
          </el-container>
        </el-container>
      </div>
    </template>
    
    <script setup>
    //引入左侧组件
    import CommonAside from "@/components/CommonAside.vue";
    </script>
    
    <style scoped lang="less">
    .common-layout,
    .lay-container {
      height: 100%;
    }
    .el-header {
      background-color: #333;
    }
    </style>
    

CommonHeader组件的静态搭建

    <template>
      <div class="header">
        <div class="left-content">
          <el-button size="small">
            <el-icon><Menu /></el-icon>
          </el-button>
          <el-breadcrumb separator="/" class="bread">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="right-content">
          <el-dropdown>
            <span class="el-dropdown-link">
              <img :src="getImageUrl('user')" class="user" />
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>个人中心</el-dropdown-item>
                <el-dropdown-item>退出</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </template>
    
    <script setup>
    import { ref, computed } from "vue";
    
    const getImageUrl = (user) => {
      return new URL(`../assets/images/${user}.png`, import.meta.url).href;
    };
    </script>
    
    <style lang="less" scoped>
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      height: 100%;
      background-color: #333;
    }
    .icons {
      width: 20px;
      height: 20px;
    }
    .left-content {
      display: flex;
      align-items: center;
      .el-button {
        margin-right: 20px;
      }
    }
    .right-content {
      .user {
        width: 40px;
        height: 40px;
        border-radius: 50%;
      }
    }
    //样式穿透
    :deep(.bread span) {
      color: #fff !important;
      cursor: pointer !important;
    }
    </style>
    

Main组件中引入使用CommonHeader组件

    <template>
      <div class="common-layout">
        <el-container class="lay-container">
          <!-- 自定义左侧组件 -->
          <CommonAside />
          <!-- 右侧 -->
          <el-container>
            <el-header class="el-header">
              <!-- 自定义右侧头部组件 -->
              <CommonHeader />
            </el-header>
            <el-main class="right-main"> main </el-main>
          </el-container>
        </el-container>
      </div>
    </template>
    
    <script setup>
    //引入左侧组件
    import CommonAside from "@/components/CommonAside.vue";
    import CommonHeader from "../components/CommonHeader.vue";
    </script>
    
    <style scoped lang="less">
    .common-layout,
    .lay-container {
      height: 100%;
    }
    .el-header {
      background-color: #333;
    }
    </style>
    

使用pinia

安装

    npm install pinia

配置main.js

    import { createPinia } from 'pinia'
    const pinia = createPinia()
    app.use(pinia)

在src下创建stores文件夹，在其中创建index.js

    import { defineStore } from "pinia";
    import { ref, computed } from "vue";
    
    function initState() {
      return {
        isCollapse: false,
      };
    }
    
    export const useAllDataStore = defineStore("allData", () => {
      //ref() 就是 state 属性
      //computed() 就是 getters
      //function() 就是 actions
      const state = ref(initState());
    
      return { state };
    });
    

CommonAside组件中使用pinia

    <template>
    <el-aside :width="width">
    	<el-menu
          background-color="#545c64"
          text-color="#fff"
          :collapse="isCollapse"
        >
        
    	<h3 v-show="!isCollapse">通用后台管理系统</h3>
         <h3 v-show="isCollapse">后台</h3>
         </el-menu>
        </el-aside>
    </template>
    
    <script>
        import { useAllDataStore } from '@/stores/index.js'
        const store = useAllDataStore();
        
        const isCollapse = computed(() => store.state.isCollapse);
        
        //width
        const width = computed(()=>store.state.isCollapse ? '64px' : '180px');
        </script>

CommonHeader组件中使用pinia

    <template>
    <el-button size="small" @click="handleCollapse">
            <el-icon><Menu /></el-icon>
          </el-button>
    <template>
        
    <script>
        import { useAllDataStore } from '@/stores/index.js'
        const store = useAllDataStore();
        
        const handleCollapse = computed(()=>{
            store.state.isCollapse = !store.state.isCollapse;
        })
    </script>

编写Home.vue

左侧的用户卡片和table表格

    <template>
      <el-row class="home" :gutter="20">
        <el-col :span="8" style="margin-top: 20px">
          <el-card shadow="hover">
            <div class="user">
              <img :src="getImageUrl('user')" class="user" />
              <div class="user-info">
                <p class="user-info-admin">Admin</p>
                <p class="user-info-p">超级管理员</p>
              </div>
            </div>
            <div class="login-info">
              <p>上次登录时间:<span>2025-7-16</span></p>
              <p>上次登录地点:<span>安徽省合肥市</span></p>
            </div>
          </el-card>
    
          <el-card shadow="hover" class="user-table">
            <el-table :data="tableData" style="width: 100%">
              <el-table-column
                v-for="(val, key) in tableLabel"
                :key="key"
                :prop="key"
                :label="val"
              >
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>
      </el-row>
    </template>
    <script setup>
    import { ref } from "vue";
    
    const getImageUrl = (user) => {
      return new URL(`../assets/images/${user}.png`, import.meta.url).href;
    };
    const tableData = ref([
      {
        name: "Java",
        todayBuy: 100,
        monthBuy: 200,
        totalBuy: 300,
      },
      {
        name: "Python",
        todayBuy: 100,
        monthBuy: 200,
        totalBuy: 300,
      },
    ]);
    
    const tableLabel = ref({
      name: "课程",
      todayBuy: "今日购买",
      monthBuy: "本月购买",
      totalBuy: "总购买",
    });
    </script>
    <style lang="less" scoped>
    .home {
      height: 100%;
      overflow: hidden;
      .user {
        display: flex;
        align-items: center;
        border-bottom: 1px solid #ccc;
        margin-bottom: 20px;
        img {
          width: 150px;
          height: 150px;
          border-radius: 50%;
          margin-right: 40px;
        }
        .user-info {
          p {
            line-height: 40px;
          }
          .user-info-p {
            color: #999;
          }
          .user-info-admin {
            font-size: 35px;
          }
        }
      }
      .login-info {
        p {
          line-height: 30px;
          font-size: 14px;
          color: #999;
          span {
            color: #666;
            margin-left: 60px;
          }
        }
      }
      .user-table {
        margin-top: 20px;
      }
    }
    </style>

mock.js的引入

安装axios

    npm install axios -D

配置mock

安装mockjs

    npm install mockjs -D

新建src/api/mock.js

    import Mock from "mockjs";
    import homeApi from "./mockData/home";
    
    //三个参数，第一个是请求(拦截)的路径，第二个是请求方式，第三个是返回的数据
    Mock.mock(/api\/home\/getTableData/, "get", homeApi.getTableData);

新建src/api/mockData/home.js

    export default {
      getTableData: () => {
        return {
          code: 200,
          data: {
            tableData: [
              {
                name: "oppo",
                todayBuy: 500,
                monthBuy: 3500,
                totalBuy: 22000,
              },
              {
                name: "vivo",
                todayBuy: 300,
                monthBuy: 2200,
                totalBuy: 24000,
              },
              {
                name: "苹果",
                todayBuy: 800,
                monthBuy: 4500,
                totalBuy: 65000,
              },
              {
                name: "小米",
                todayBuy: 1200,
                monthBuy: 6500,
                totalBuy: 45000,
              },
              {
                name: "三星",
                todayBuy: 300,
                monthBuy: 2000,
                totalBuy: 34000,
              },
              {
                name: "魅族",
                todayBuy: 350,
                monthBuy: 3000,
                totalBuy: 22000,
              },
            ],
          },
        };
      },
    };
    

在main.js中配置

    import "@/api/mock.js"; // 引入mockjs配置

Home.vue中使用

    <script>
    import axios from 'axios'
    
        axios({
            url:'/api/home/getTableData',
            method:'get'
        }).then(res=>{
            if(res.data.code === 200){
                tableData.value = res.data.data.tableData;
            }
        })
        
    </script>

axios二次封装

新建src/api/request.js

    import axios from 'axios'
    import ELMessage from 'element-plus'
    
    const service = axios.create();
    const NETWORK_ERROR = "网络错误..." 
    // 添加请求拦截器
    service.interceptors.request.use(function (config) {
        // 在发送请求之前做些什么
        return config;
      }, function (error) {
        // 对请求错误做些什么
        return Promise.reject(error);
      });
    
    // 添加响应拦截器
    service.interceptors.response.use(
        //对响应数据做点什么
        (res)=>{
            const {code,data,msg} = res.data;
            if(code === 200){
                return data;
            } else {
                //对错误数据做点什么
                ELMessage.error(msg || NETWORK_ERROR);
                return Promise.reject(msg || NETWORK_ERROR);
            }
        }
        
    );
    
    function request(options){
        options.method = options.method || "get";
        return service(options);
    }
    
    export default request;
    
    

创建src/api/api.js

    import request from './request'
    
    export function getTableData(){
        return request({
            url: "/api/home/getTableData",
            method: "get"
        })
    }

此时就可简化Home.vue中接口的使用了

    <script>
    import { getTableData } from '@/api/api.js'
    import { onBeforeMount } from 'vue'
        
        
        onBeforeMount({
            getTableData().then((res)=>{
            tableData.value = res.tableData;
        })
     })
    
        
        
        
    </script>

解决每次使用Vue的钩子都要Import，麻烦的问题

unplugin-auto-import插件的作用

核心功能：自动导入项目中使用的库（如 Vue、React 等）及其组件/函数，避免每个文件重复手动引入相同依赖。

1、安装

    npm i unplugin-auto-import -D

2、配置

在vite.config.js中

    import AutoImport from "unplugin-auto-import/vite";
    
    export default defineConfig({
        plugins:[
            vue(),
            AutoImport({
                imports:['vue','vue-router'],
            })
        ]
    })

数据交互升级引入配置文件

新建src/config/index.js

    /**
     * 环境配置文件
     * 一般在企业级项目里面有三个环境
     * 开发环境
     * 测试环境
     * 线上环境
     */
    
    // 当前的环境
    const env = import.meta.env.MODE || "prod";
    
    const EnvConfig = {
      development: {
        baseApi: "/api",
        mockApi: "https://mock.apifox.cn/m1/4068509-0-default/api",
      },
      test: {
        baseApi: "//test.future.com/api",
        mockApi: "https://mock.apifox.cn/m1/4068509-0-default/api",
      },
      pro: {
        baseApi: "//future.com/api",
        mockApi: "https://mock.apifox.cn/m1/4068509-0-default/api",
      },
    };
    
    export default {
      env,
      mock: true,
      ...EnvConfig[env],
    };
    

修改src/api/request.js

    import axios from "axios";
    import { ElMessage } from "element-plus";
    import config from "@/config";
    
    const service = axios.create({ baseURL: config.baseApi });
    const NETWORK_ERROR = "网络错误...";
    
    // 添加请求拦截器
    service.interceptors.request.use(
      function (config) {
        // 在发送请求之前做些什么
        return config;
      },
      function (error) {
        // 对请求错误做些什么
        return Promise.reject(error);
      }
    );
    
    // 添加响应拦截器
    service.interceptors.response.use((res) => {
      //对响应数据做点什么
      const { code, data, msg } = res.data;
      if (code === 200) {
        return data;
      } else {
        //对响应错误做点什么
        ElMessage.error(msg || NETWORK_ERROR);
        return Promise.reject(msg || NETWORK_ERROR);
      }
    });
    
    function request(options) {
      options.method = options.method || "get";
    
      //关于get请求的data参数调整
      if (options.method.toLowerCase() === "get") {
        options.params = options.data;
      }
      //对mock的开关做一个处理
      let isMock = config.mock;
      if (typeof options.mock !== "undefined") {
        isMock = options.mock;
      }
    
      //针对环境做一个处理
      if (config.env === "prod") {
        //不能用mock
        service.defaults.baseURL = config.baseApi;
      } else {
        service.defaults.baseURL = isMock ? config.mockApi : config.baseApi;
      }
    
      return service(options);
    }
    
    export default request;
    

api.js做改动

    import request from "./request";
    
    //请求首页左侧表格数据
    export function getTableData() {
      return request({
        url: "/home/getTableData",
        method: "get",
      });
    }

首页count数据获取与渲染

在src/api/mockData/home.js中新增数据

    getCountData: () => {
        return {
          code: 200,
          data: [
            {
              name: "今日支付订单",
              value: 1234,
              icon: "SuccessFilled",
              color: "#2ec7c9",
            },
            {
              name: "今日收藏订单",
              value: 210,
              icon: "StarFilled",
              color: "#ffb980",
            },
            {
              name: "今日未支付订单",
              value: 1234,
              icon: "GoodsFilled",
              color: "#5ab1ef",
            },
            {
              name: "本月支付订单",
              value: 1234,
              icon: "SuccessFilled",
              color: "#2ec7c9",
            },
            {
              name: "本月收藏订单",
              value: 210,
              icon: "StarFilled",
              color: "#ffb980",
            },
            {
              name: "本月未支付订单",
              value: 1234,
              icon: "GoodsFilled",
              color: "#5ab1ef",
            },
          ],
        };
      },

修改mock.js

    import Mock from "mockjs";
    import homeApi from "./mockData/home";
    
    //三个参数，第一个是拦截的路径，第二个是请求方式，第三个是返回的数据
    Mock.mock(/api\/home\/getTableData/, "get", homeApi.getTableData);
    Mock.mock(/api\/home\/getCountData/, "get", homeApi.getCountData);
    

Home.vue中渲染

    <template>
    	<el-col :span="16" style="margin-top: 20px;">
        	<div class="num">
                <el-card
                  :body-style="{display:flex , padding: 0 }"
                  :v-for="item in countData"
                  :ket= "item.name"
                 >
                    <component 
                      :is="item.icon" 
                      class="icons" 
                      :style="{background:item.color}">
        		   </component>
                    <div class="detail">
                        <p class="num">￥{{ item.value }}</p>
                        <p class="txt">￥{{ item.name }}</p>
        		   </div>
        		</el-card>
        	</div>
        </el-col>
    </template>
    
    <script setup>
    import { getCountData } from "@/api/api.js"
    import { ref, onBeforeMount } from "vue"
    
    const countData = ref([]);
        
    onBeforeMount({
        getCountData().then(res=>{
           console.log(res);
           countData.value = res;
        })
    })
    </script>
    
    <style lang="less" scoped>
    .home {
        .num{
            display:flex ;
            flex-wrap:wrap;
            justify-content:space-between;
            .el-card{
                width:32%;
                margin-bottom:20px;
            }
            .icons{
                width:80px;
                height:80px;
                fone-size:30px;
                text-align: center;
          		line-height: 80px;
          		color: #fff;
            }
            .detail{
                 margin-left: 15px;
                 display: flex;
                 flex-direction: column;
                 justify-content: center;
                 .num {
                    font-size: 30px;
                    margin-bottom: 10px;
                 }
                 .txt {
                    font-size: 15px;
                    text-align: center;
                    color: #999;
                 }
            }
        }      
    }
    
    </style>

echarts数据的获取

在api下的api.js

    export function getCountData() {
      return request({
        url: "/home/getCountData",
        method: "get",
      });
    }

2.mock拦截

    Mock.mock(/home\/getChartData/,"get", homeApi.getChartData)

3.定义处理请求方法

在api下的mockData下的home.js

     getChartData: () => {
        return {
          code: 200,
          data: {
            orderData: {
              date: [
                "2019-10-01",
                "2019-10-02",
                "2019-10-03",
                "2019-10-04",
                "2019-10-05",
                "2019-10-06",
                "2019-10-07",
              ],
              data: [
                {
                  苹果: 3839,
                  小米: 1423,
                  华为: 4965,
                  oppo: 3334,
                  vivo: 2820,
                  一加: 4751,
                },
                {
                  苹果: 3560,
                  小米: 2099,
                  华为: 3192,
                  oppo: 4210,
                  vivo: 1283,
                  一加: 1613,
                },
                {
                  苹果: 1864,
                  小米: 4598,
                  华为: 4202,
                  oppo: 4377,
                  vivo: 4123,
                  一加: 4750,
                },
                {
                  苹果: 2634,
                  小米: 1458,
                  华为: 4155,
                  oppo: 2847,
                  vivo: 2551,
                  一加: 1733,
                },
                {
                  苹果: 3622,
                  小米: 3990,
                  华为: 2860,
                  oppo: 3870,
                  vivo: 1852,
                  一加: 1712,
                },
                {
                  苹果: 2004,
                  小米: 1864,
                  华为: 1395,
                  oppo: 1315,
                  vivo: 4051,
                  一加: 2293,
                },
                {
                  苹果: 3797,
                  小米: 3936,
                  华为: 3642,
                  oppo: 4408,
                  vivo: 3374,
                  一加: 3874,
                },
              ],
            },
            videoData: [
              { name: "小米", value: 2999 },
              { name: "苹果", value: 5999 },
              { name: "vivo", value: 1500 },
              { name: "oppo", value: 1999 },
              { name: "魅族", value: 2200 },
              { name: "三星", value: 4500 },
            ],
            userData: [
              { date: "周一", new: 5, active: 200 },
              { date: "周二", new: 10, active: 500 },
              { date: "周三", new: 12, active: 550 },
              { date: "周四", new: 60, active: 800 },
              { date: "周五", new: 65, active: 550 },
              { date: "周六", new: 53, active: 770 },
              { date: "周日", new: 33, active: 170 },
            ],
          },
        };
      }

回到home.vue中

    <template>
    
     <el-card class="top-chart">
            <div ref="echartRef" style="height: 280px"></div>
     </el-card>
     <div class="graph">
     	<el-card>
          	<div ref="userechartRef" style="height: 240px"></div>
     	</el-card>
         <el-card>
             <div ref="videoechartRef" style="height: 240px"></div>
         </el-card>
    </div>
    </template>
    
    <script>
    import { getChartData } from '@/api/api.js'
    import * as echarts from "echarts";
     
    const echartRef = ref(null);
    const userechartRef = ref(null);
    const videoechartRef = ref(null);
    
    onBeforeMount({
      getChartData().then(res=>{
         const { orderData, userData, videoData } = res;
         // 对第一个图表进行 X轴 和 series 赋值
        xOptions.xAxis.data = orderData.date;
        xOptions.series = Object.keys(orderData.data[0]).map((val) => ({
          name: val,
          data: orderData.data.map((item) => item[val]),
          type: "line",
        }));
        const oneEchart = echarts.init(echartRef.value);
        oneEchart.setOption(xOptions);
    
        // 对第二个表格进行渲染
    
        xOptions.xAxis.data = userData.map((item) => item.date);
        xOptions.series = [
          {
            name: "新增用户",
            data: userData.map((item) => item.new),
            type: "bar",
          },
          {
            name: "活跃用户",
            data: userData.map((item) => item.active),
            type: "bar",
          },
        ];
        const twoEchart = echarts.init(userechartRef.value);
        twoEchart.setOption(xOptions);
    
        //对饼状图进行渲染
        pieOptions.series = [
          {
            data: videoData,
            type: "pie",
          },
        ];
        const threeEchart = echarts.init(videoechartRef.value);
        threeEchart.setOption(pieOptions);
      })
    })
    </script>

监听页面变化，使图表跟着变化

    <script>
    const observer = ref(null);
        
    onBeforeMount({
        getchartData().then(res=>{
           //省略渲染代码
            //监听页面的变化
            observer.value = new ResizeObserver(() => {
              oneEchart.resize();
              twoEchart.resize();
              threeEchart.resize();
            });
    
            if (echartRef.value) {
              observer.value.observe(echartRef.value);
            }
        })
    })
        
    </script>
    

用户静态页面搭建

路由创建 @/router/index.js

    {
            path: "user",
            name: "user",
            component: () => import("@/views/User.vue"),
    },

新建@/views/User.vue

    <template>
        <div class="user-header">
            <el-button type="primary">添加</el-button>
            <el-form :inline="true">
                <el-form-item label="请输入">
                    <el-input placeholder="请输入用户名"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary">搜索</el-button>
                </el-form-item>
            </el-form>
        </div>
    
        <div class="table">
            <el-table :data="tableData" style="width: 100%">
                <el-table-column fixed prop="date" label="Date" width="150" />
                <el-table-column prop="name" label="Name" width="120" />
                <el-table-column prop="state" label="State" width="120" />
                <el-table-column prop="city" label="City" width="120" />
                <el-table-column prop="address" label="Address" width="600" />
                <el-table-column prop="zip" label="Zip" width="120" />
                <el-table-column fixed="right" label="Operations" min-width="120">
                    <template #default>
                        <el-button  type="primary" size="small" @click="handleClick">
                        编辑
                        </el-button>
                        <el-button  type="danger" size="small">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </template>
    
    <script setup>
    
    const handleClick = () => {
      console.log('click')
    }
    
    const tableData = [
      {
        date: '2016-05-03',
        name: 'Tom',
        state: 'California',
        city: 'Los Angeles',
        address: 'No. 189, Grove St, Los Angeles',
        zip: 'CA 90036',
        tag: 'Home',
      },
      {
        date: '2016-05-02',
        name: 'Tom',
        state: 'California',
        city: 'Los Angeles',
        address: 'No. 189, Grove St, Los Angeles',
        zip: 'CA 90036',
        tag: 'Office',
      },
      {
        date: '2016-05-04',
        name: 'Tom',
        state: 'California',
        city: 'Los Angeles',
        address: 'No. 189, Grove St, Los Angeles',
        zip: 'CA 90036',
        tag: 'Home',
      },
      {
        date: '2016-05-01',
        name: 'Tom',
        state: 'California',
        city: 'Los Angeles',
        address: 'No. 189, Grove St, Los Angeles',
        zip: 'CA 90036',
        tag: 'Office',
      },
    ]
    
    </script>
    
    
    
    <style scoped lang="less">
    .user-header {
        display: flex;
        justify-content: space-between;
    }
    </style>

用户表格数据获取渲染

新增api.js

    //请求用户表格数据
    export function getUserData() {
      return request({
        url: "/home/getUserData",
        method: "get",
      });
    }

创建@/api/mockData/user.js

    import Mock from 'mockjs'
    
    // get请求从config.url获取参数，post从config.body中获取参数
    function param2Obj(url) {
      const search = url.split('?')[1]
      if (!search) {
        return {}
      }
      return JSON.parse(
        '{"' +
        decodeURIComponent(search)
          .replace(/"/g, '\\"')
          .replace(/&/g, '","')
          .replace(/=/g, '":"') +
        '"}'
      )
    }
    
    let List = []
    const count = 200
    //模拟200条用户数据
    for (let i = 0; i < count; i++) {
      List.push(
        Mock.mock({
          id: Mock.Random.guid(),
          name: Mock.Random.cname(),
          addr: Mock.mock('@county(true)'),
          'age|18-60': 1,
          birth: Mock.Random.date(),
          sex: Mock.Random.integer(0, 1)
        })
      )
    }
    
    
    export default {
      /**
       * 获取列表
       * 要带参数 name, page, limt; name可以不填, page,limit有默认值。
       * @param name, page, limit
       * @return {{code: number, count: number, data: *[]}}
       */
      getUserList: config => {
          					  //limit默认是10，因为分页器默认也是一页10个
        const { name, page = 1, limit = 10 } = param2Obj(config.url)
       
        const mockList = List.filter(user => {
            //如果name存在会，根据name筛选数据
          if (name && user.name.indexOf(name) === -1) return false
          return true
        })
         //分页
        const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))
        return {
          code: 200,
          data: {
            list: pageList,
            count: mockList.length, //数据总条数需要返回
          }
        }
      },
    
    }

新增mock.js

    import userApi from "./mockData/user"
    Mock.mock(/api\/home\/getUserData/, "get", userApi.getUserList);

User.vue渲染

    <template>
        <div class="user-header">
            <el-button type="primary">添加</el-button>
            <el-form :inline="true" >
                <el-form-item label="请输入">
                    <el-input placeholder="请输入用户名" ></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" >搜索</el-button>
                </el-form-item>
            </el-form>
        </div>
    
        <div class="table">
            <el-table :data="tableData" style="width: 100%">
                <el-table-column
                    v-for="item in tableLabel"
                    :key="item.prop"
                    :width="item.width ? item.width : 125"
                    :prop="item.prop"
                    :label="item.label"
                />
                <el-table-column fixed="right" label="Operations" min-width="120">
                    <template #default>
                        <el-button  type="primary" size="small" @click="handleClick">
                        编辑
                        </el-button>
                        <el-button  type="danger" size="small">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            
        </div>
    </template>
    
    <script setup>
    import { getUserData } from '@/api/api'
    import { reactive, onMounted, ref } from 'vue'
    
    
    const tableLabel = reactive([
        {
            prop: 'name',
            label: '姓名',
        },
        {
            prop: 'age',
            label: '年龄',
        },
        {
            prop: 'sex',
            label: '性别',
        },
        {
            prop: 'birth',
            label: '出生日期',
            width: 200,
        },
        {
            prop: 'addr',
            label: '地址',
            width: 400,
        }
    ])
    
    const tableData = ref([])
    
    const getList = () => {
      getUserData().then(res => {
        tableData.value = res.list.map(item => ({
            ...item,
            sex: item.sex === 1 ? '男' : '女',
        }))
      })
    }
    
    onMounted(() => {
      getList()
    })
    
    const handleClick = () => {
      console.log('click')
    }
    
    
    </script>
    
    
    
    <style scoped lang="less">
    .user-header {
        display: flex;
        justify-content: space-between;
    }
    </style>

用户搜索和分页的实现

api.js稍作调整传参

    //请求用户表格数据
    export function getUserData(data) {
      return request({
        url: "/home/getUserData",
        method: "get",
        data,
      });
    }
    //按理get方法的参数应该是params 但是我们request.js里设置了，所以是一样的。

    <template>
        <div class="user-header">
            <el-button type="primary">添加</el-button>
            <el-form :inline="true" :model="formInline">
                <el-form-item label="请输入">
                    <el-input placeholder="请输入用户名" v-model="formInline.keyword"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleSearch">搜索</el-button>
                </el-form-item>
            </el-form>
        </div>
    
        <div class="table">
            <el-table :data="tableData" style="width: 100%">
                <el-table-column
                    v-for="item in tableLabel"
                    :key="item.prop"
                    :width="item.width ? item.width : 125"
                    :prop="item.prop"
                    :label="item.label"
                />
                <el-table-column fixed="right" label="Operations" min-width="120">
                    <template #default>
                        <el-button  type="primary" size="small" @click="handleClick">
                        编辑
                        </el-button>
                        <el-button  type="danger" size="small">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                class="pager"
                background 
                layout="prev, pager, next" 
                size="small"
                :total="config.total" 
                @current-change="handleChange"
            />
        </div>
    </template>
    
    <script setup>
    import { getUserData } from '@/api/api'
    import { reactive, onMounted, ref } from 'vue'
    
    const formInline = reactive({
        keyword: '',
    })
    const config = reactive({
        name: '',
        total: 0,
        page: 1,
    })
    
    const tableLabel = reactive([
        {
            prop: 'name',
            label: '姓名',
        },
        {
            prop: 'age',
            label: '年龄',
        },
        {
            prop: 'sex',
            label: '性别',
        },
        {
            prop: 'birth',
            label: '出生日期',
            width: 200,
        },
        {
            prop: 'addr',
            label: '地址',
            width: 400,
        }
    ])
    
    const tableData = ref([])
    
    const getList = () => {
      getUserData(config).then(res => {
        tableData.value = res.list.map(item => ({
            ...item,
            sex: item.sex === 1 ? '男' : '女',
        }))
        config.total = res.count
      })
    }
    
    onMounted(() => {
      getList()
    })
    
    const handleClick = () => {
      console.log('click')
    }
    
    const handleSearch = () => {
      config.name = formInline.keyword
      getList() // 重新获取数据
    }
    
    const handleChange = (page) => {
      config.page = page
      getList()
    }
    
    </script>
    
    
    
    <style scoped lang="less">
    .user-header {
        display: flex;
        justify-content: space-between;
    }
    .table {
        position: relative;
        height: 520px;
        .pager {
            position: absolute;
            right: 10px;
            bottom: 30px;
        }
        .el-table {
            width: 100%;
            height: 500px;
      }
    }
    </style>

用户删除的实现

定义处理请求的方法

在mockData下的user.js中

    //在原来的export default 中添加
    
      /**
       * 删除用户
       * @param id
       * @return {*}
       */
    deleteUser: config => {
        const { id } = param2Obj(config.url)
    
        if (!id) {
          return {
            code: -999,
            message: '参数不正确'
          }
        } else {
          List = List.filter(u => u.id !== id)
          return {
            code: 200,
            message: '删除成功'
          }
        }
      },

新增api.js

    //删除用户
    export function deleteUser(data) {
      return request({
        url: "/user/deleteUser",
        method: "get",
        data,
      });
    }

mock拦截

    Mock.mock(/api\/home\/deleteUser/, "get", userApi.deleteUser);

User.vue

    <template>
     
     	<template #="scope">
              <el-button  type="primary" size="small" @click="handleClick">
                        编辑
               </el-button>
           <el-button  type="danger" size="small" 				    @click="handleDelete(scope.row)">删除</el-button>
         </template>
    </template>
    
    <script>
     import { deleteUser } from '@/api/api.js'
     import { ELMessage, ELMessageBox } from 'element-plus'
        
        const handleDelete = (val)=>{
            ELMessageBox.confirm('确定删除该用户吗'，'提示'，{
                confireButtonText:'确定',
                cancleButtonText:'取消',
                type:'warning',
            }).then(()=>{
                deleteUser({id:val.id}).then((res)=>{
                    ELMessage.success('删除成功')
                    getList()
                })
            })
        }
     
    </script>

新增用户的实现

    <template>
    <el-dialog
        v-model="dialogVisible"
        :title="action == 'add' ? '新增用户' : '编辑用户'"
        width="35%"
        :before-close="handleClose"
      >
           <!--需要注意的是设置了:inline="true"，
    		会对el-select的样式造成影响，我们通过给他设置一个class=select-clearn
    		在css进行处理-->
        <el-form :inline="true"  :model="formUser" :rules="rules" ref="userForm">
          <el-row>
            <el-col :span="12">
              <el-form-item label="姓名" prop="name">
                <el-input v-model="formUser.name" placeholder="请输入姓名" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="年龄" prop="age">
                <el-input v-model.number="formUser.age" placeholder="请输入年龄" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item class="select-clearn" label="性别" prop="sex">
                <el-select  v-model="formUser.sex" placeholder="请选择">
                  <el-option label="男" value="1" />
                  <el-option label="女" value="0" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="出生日期" prop="birth">
                <el-date-picker
                  v-model="formUser.birth"
                  type="date"
                  placeholder="请输入"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-form-item
              label="地址"
              prop="addr"
            >
              <el-input v-model="formUser.addr" placeholder="请输入地址" />
            </el-form-item>
          </el-row>
          <el-row style="justify-content: flex-end">
            <el-form-item>
              <el-button type="primary" @click="handleCancel">取消</el-button>
              <el-button type="primary" @click="onSubmit">确定</el-button>
            </el-form-item>
          </el-row>
        </el-form>
      </el-dialog>
    </template>
    
    <script>
    //控制对话框是否显示
    const dialogVisible = ref(false)
    
    //新增和编辑共用一个窗口，所以通过设置action区分
    const action = ref("add")
    
    const formUser = reactive({})
    //表单校验规则
    const rules = reactive({
      name: [{ required: true, message: "姓名是必填项", trigger: "blur" }],
      age: [
        { required: true, message: "年龄是必填项", trigger: "blur" },
        { type: "number", message: "年龄必须是数字" },
      ],
      sex: [{ required: true, message: "性别是必选项", trigger: "change" }],
      birth: [{ required: true, message: "出生日期是必选项" }],
      addr:[{ required: true, message: '地址是必填项' }]
    })
    
    
    //这个方法之前定义过
    const handleAdd = () => {
        action.value="add"
        //打开对话窗
        dialogVisible.value=true
    }
    
    //对话框右上角的关闭事件
    const handleClose = () => {
        //获取到表单dom，执行resetFields重置表单
        proxy.$refs["userForm"].resetFields()
        //关闭对话框
        dialogVisible.value=false
    }
    
    //对话框右下角的取消事件
    const handleCancel = () => {
        proxy.$refs["userForm"].resetFields()
        dialogVisible.value=false
    }    
        
    </script>

新增用户api

    //新增用户
    export function createUser(data) {
      return request({
        url: "/user/addUser",
        method: "post",
        data,
      });
    }
    

mock拦截

    Mock.mock(/api\/user\/addUser/, "post", userApi.createUser);

3.添加处理请求方法

在mockData下的user.js

    /**
       * 增加用户
       * @param name, addr, age, birth, sex
       * @return {{code: number, data: {message: string}}}
       */
      createUser: config => {
        const { name, addr, age, birth, sex } = JSON.parse(config.body)
        List.unshift({
          id: Mock.Random.guid(),
          name: name,
          addr: addr,
          age: age,
          birth: birth,
          sex: sex
        })
        return {
          code: 200,
          data: {
            message: '添加成功'
          }
        }
      },

User.vue处理

    <script>
     import { add }
     const formUser = reactive({})   
        
     //格式化日期，格式化为：1997-01-02这种
    const timeFormat = (time) => {
        var time = new Date(time);
        var year = time.getFullYear();
        var month = time.getMonth() + 1;
        var date = time.getDate();
        function add(m) {
            return m < 10 ? "0" + m : m;
        }
        return year + "-" + add(month) + "-" + add(date);
    }
    
    const onSubmit = () => {
        //执行userForm表单的validate进行规则校验，传入一个回调函数，回调函数会接受到一个是否校验通过的变量
        userForm.value.validate(async (valid)=>{
            
            //如果校验成功
            if (valid) {
                    //res用于接收添加用户或者编辑用户接口的返回值
                    let res = null
                    //这里无论是新增或者是编辑，我们都要对这个日期进行一个格式化
                    //如果不是1997-01-02这种格式，使用timeFormat方法进行格式化
                    formUser.birth = /^\d{4}-\d{2}-\d{2}$/.test(formUser.birth) ? formUser.birth : timeFormat(formUser.birth)
                    //如果当前的操作是新增，则调用新增接口
                    if (action.value == "add") {
                        res = await createUser(formUser);
                    } else if(action.value == "edit") {
                        res = await editUser(formUser);
                    }
                    //如果接口调用成功
                    if(res) {
                            //关闭对话框，重置表单，重新请求用户数据
                            dialogVisible.value = false;
                            userForm.value.resetFields();
                            getList();
                    }
    
    		//如果校验失败
            } else {
              ElMessage({
                showClose: true,
                message: "请输入正确的内容",
                type: "error",
              });
            }
    
        })
    }
    
    </script>
    
    <style scoped lang='less'>
        .select-clearn{
            display:flex;
        }   
        
        </style>

编辑用户的实现

编辑用户的api

    //编辑用户
    export function editUser(data) {
      return request({
        url: "/user/editUser",
        method: "post",
        data,
      });
    }

mock拦截

    Mock.mock(/api\/user\/editUser/, "post", userApi.editUser);

3.处理请求方法

mockData下的user.js

    updateUser: config => {
        const { id, name, addr, age, birth, sex } = JSON.parse(config.body)
        const sex_num = parseInt(sex)
        List.some(u => {
          if (u.id === id) {
            u.name = name
            u.addr = addr
            u.age = age
            u.birth = birth
            u.sex = sex_num
            return true
          }
        })
        return {
          code: 200,
          data: {
            message: '编辑成功'
          }
        }
      }

User.vue

    <script>
     import { editUser } from '@/api/api'
     import { nextTick } from 'vue'
        
    const handleEdit =  (val) => {
        action.value="edit"
        dialogVisible.value=true
        
        nextTick(()=>{
            //因为在第一次显示弹窗的时候form组件没有加载出来，如果直接对formUser赋值，这个值会作为form表单的初始值
            //所以使用nextTick，赋值的操作在一个微任务中，这样就可以避免在from表单加载之前赋值
           
            Object.assign(formUser,{...val,sex:""+val.sex})
            //这里需要改变sex数据类型，是因为el-option的value有类型的校验
        })
    }
    </script>

tag的静态实现

新建@/components/CommonTab.vue

    <template>
        <div class="tags">
            <el-tag
                v-for="(tag,index) in tags"
                :key="tag.name"
                :closable="tag.name !== 'home'"
                :effect="tag.name === route.name ? 'dark' : 'plain'" 
            >
            {{ tag.label }}
            </el-tag>
    
        </div>
    
    </template>
    
    <script setup>
    import { ref } from 'vue';
    import { useRoute } from 'vue-router';
    const tags = ref([
        {
            path: '/home',
            name: 'home',
            label: '首页',
            icon: 'home'
        },
    ])
    
    const route = useRoute();
    
    
    </script>
    
    <style scoped lang="less">
    .tags{
        margin: 20px 0 0 20px;
    }
    .el-tag{
        margin-right: 10px;
    }
    
    </style>

修改Main.vue

    <template>
      <div class="common-layout">
        <el-container class="lay-container">
          <!-- 自定义左侧组件 -->
          <CommonAside />
          <!-- 右侧 -->
          <el-container>
            <el-header class="el-header">
              <!-- 自定义右侧头部组件 -->
              <CommonHeader />
            </el-header>
            <CommomTab />
            <el-main class="right-main">
              <router-view />
            </el-main>
          </el-container>
        </el-container>
      </div>
    </template>
    
    <script setup>
    //引入左侧组件
    import CommonAside from "@/components/CommonAside.vue";
    import CommonHeader from "../components/CommonHeader.vue";
    import CommomTab from "@/components/CommomTab.vue";
    </script>
    
    <style scoped lang="less">
    .common-layout,
    .lay-container {
      height: 100%;
    }
    .el-header {
      background-color: #333;
    }
    </style>
    

tag通过pinia管理

CommonAside.vue优化点击跳转和页面刷新默认激活菜单

    <template>
      <el-aside :width="width">
        <el-menu
          background-color="#545c64"
          text-color="#fff"
          :collapse="isCollapse"
          :collapse-transition="false"
          :default-active="route.path"
        >
          <h3 v-show="!isCollapse">通用后台管理系统</h3>
          <h3 v-show="isCollapse">后台</h3>
          <el-menu-item
            v-for="item in noChildren"
            :key="item.path"
            :index="item.path"
            @click="clickMenu(item)"
          >
            <component class="icons" :is="item.icon"> </component>
            <span>{{ item.label }}</span>
          </el-menu-item>
    
          <el-sub-menu
            v-for="item in hasChildren"
            :key="item.path"
            :index="item.path"
          >
            <template #title>
              <component class="icons" :is="item.icon"></component>
              <span>{{ item.label }}</span>
            </template>
            <el-menu-item-group>
              <el-menu-item
                v-for="(subItem, subIndex) in item.children"
                :key="subItem.path"
                :index="subItem.path"
                @click="clickMenu(subItem)"
              >
                <component class="icons" :is="subItem.icon"></component>
                <span>{{ subItem.label }}</span>
              </el-menu-item>
            </el-menu-item-group>
          </el-sub-menu>
        </el-menu>
      </el-aside>
    </template>
    
    <script setup>
    import { ref, computed } from "vue";
    import { useRouter, useRoute } from "vue-router";
    
    //引入pinia
    import { useAllDataStore } from "@/stores/index.js";
    const store = useAllDataStore();
    
    const list = ref([
      {
        path: "/home",
        name: "home",
        label: "首页",
        icon: "house",
        url: "Home",
      },
      {
        path: "/mall",
        name: "mall",
        label: "商品管理",
        icon: "video-play",
        url: "Mall",
      },
      {
        path: "/user",
        name: "user",
        label: "用户管理",
        icon: "user",
        url: "User",
      },
      {
        path: "other",
        label: "其他",
        icon: "location",
        children: [
          {
            path: "/page1",
            name: "page1",
            label: "页面1",
            icon: "setting",
            url: "Page1",
          },
          {
            path: "/page2",
            name: "page2",
            label: "页面2",
            icon: "setting",
            url: "Page2",
          },
        ],
      },
    ]);
    
    const noChildren = computed(() => list.value.filter((item) => !item.children));
    const hasChildren = computed(() => list.value.filter((item) => item.children));
    
    const isCollapse = computed(() => store.state.isCollapse);
    
    //width
    const width = computed(() => (store.state.isCollapse ? "64px" : "180px"));
    
    const router = useRouter();
    const route = useRoute();
    const clickMenu = (item) => {
      router.push(item.path)
    };
    
    </script>
    
    <style lang="less" scoped>
    .icons {
      width: 18px;
      height: 18px;
      margin-right: 5px;
    }
    .el-menu {
      border-right: none;
      h3 {
        line-height: 48px;
        color: #fff;
        text-align: center;
      }
    }
    .el-aside {
      background-color: #545c64;
      height: 100%;
    }
    </style>

CommonTab.vue中的tags通过pinia来管理，新增selectMenu方法。

修改stores/index.js

    import { defineStore } from "pinia";
    import { ref, computed } from "vue";
    
    function initState() {
      return {
        isCollapse: false,
        tags: [
          {
            path: '/home',
            name: 'home',
            label: '首页',
            icon: 'home'
          },
        ],
        currentMenu: null,
    
      };
    }
    
    export const useAllDataStore = defineStore("allData", () => {
      //ref() 就是 state 属性
      //computed() 就是 getters
      //function() 就是 actions
      const state = ref(initState());
    
      function selectMenu(val) {
        if(val.name === "home") {
          state.value.currentMenu = null;
        }else{
          let index = state.value.tags.findIndex(item => item.name === val.name);
          index === -1 ? state.value.tags.push(val) : "";
        }
      }
    
      return { state, selectMenu, };
    });
    

修改CommonTab.vue

    <script>
        import { useAllDataStore } from '@/stores'
        const store = useAllDataStore();
        const tags = computed(()=>store.state.tags)
    </script>

修改CommonAside.vue

    <script>
    
    const clickMenu = (item) => {
      router.push(item.path)
      store.selectMenu(item);
    };
        
    </script>

tag收尾

CommonTab.vue

    <template>
        <div class="tags">
            <el-tag
                v-for="(tag,index) in tags"
                :key="tag.name"
                :closable="tag.name !== 'home'"
                :effect="tag.name === route.name ? 'dark' : 'plain'" 
                @click="handleMenu(tag)"
                @close="handleClose(tag,index)"
            >
            {{ tag.label }}
            </el-tag>
    
        </div>
    
    </template>
    
    <script setup>
    import { ref } from 'vue';
    import { useRoute,useRouter } from 'vue-router';
    import { useAllDataStore } from '@/stores';
    const store = useAllDataStore();
    
    const tags = computed(() => store.state.tags);
    
    const route = useRoute();
    const router = useRouter();
    
    const handleMenu = (tag) => {
        router.push(tag.path);
        store.selectMenu(tag);
    }
    
    const handleClose = (tag,index) => {
        //通过pinia管理的
        store.updateTags(tag);
        if(tag.name !== route.name) return;
        if(index === store.state.tags.length){
            store.selectMenu(store.state.tags[index-1]);
            router.push(tags.value[index-1].path);
        }else{
            store.selectMenu(store.state.tags[index]);
            router.push(store.state.tags[index].path);
        }
    }
    
    
    </script>
    
    <style scoped lang="less">
    .tags{
        margin: 20px 0 0 20px;
    }
    .el-tag{
        margin-right: 10px;
    }
    
    </style>

@/stores/index.js

    import { defineStore } from "pinia";
    import { ref, computed } from "vue";
    
    function initState() {
      return {
        isCollapse: false,
        tags: [
          {
            path: '/home',
            name: 'home',
            label: '首页',
            icon: 'home'
          },
        ],
        currentMenu: null,
    
      };
    }
    
    export const useAllDataStore = defineStore("allData", () => {
      //ref() 就是 state 属性
      //computed() 就是 getters
      //function() 就是 actions
      const state = ref(initState());
    
      function selectMenu(val) {
        if(val.name === "home") {
          state.value.currentMenu = null;
        }else{
          let index = state.value.tags.findIndex(item => item.name === val.name);
          index === -1 ? state.value.tags.push(val) : "";
        }
      }
    
      function updateTags(tag) {
        let index = state.value.tags.findIndex(item => item.name === tag.name);
        state.value.tags.splice(index,1);
      }
    
      return { state, selectMenu, updateTags };
    });
    


