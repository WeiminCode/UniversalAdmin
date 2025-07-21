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
