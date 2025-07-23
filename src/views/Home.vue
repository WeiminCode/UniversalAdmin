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
    <el-col :span="16" style="margin-top: 20px">
      <div class="num">
        <el-card
          :body-style="{ display: 'flex', padding: 0 }"
          v-for="item in countData"
          :key="item.name"
        >
          <component
            :is="item.icon"
            class="icons"
            :style="{ background: item.color }"
          ></component>
          <div class="detail">
            <p class="num">￥{{ item.value }}</p>
            <p class="txt">￥{{ item.name }}</p>
          </div>
        </el-card>
      </div>
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
    </el-col>
  </el-row>
</template>
<script setup>
//api
import { getTableData, getCountData, getChartData } from "@/api/api.js";
//echarts
import * as echarts from "echarts";

const getImageUrl = (user) => {
  return new URL(`../assets/images/${user}.png`, import.meta.url).href;
};

const echartRef = ref(null);
const userechartRef = ref(null);
const videoechartRef = ref(null);
const tableData = ref([]);
const countData = ref([]);

const tableLabel = ref({
  name: "课程",
  todayBuy: "今日购买",
  monthBuy: "本月购买",
  totalBuy: "总购买",
});

//observer 接收观察器实例对象
const observer = ref(null);

//这个是折线图和柱状图 两个图表共用的公共配置
const xOptions = reactive({
  // 图例文字颜色
  textStyle: {
    color: "#333",
  },
  legend: {},
  grid: {
    left: "20%",
  },
  // 提示框
  tooltip: {
    trigger: "axis",
  },
  xAxis: {
    type: "category", // 类目轴
    data: [],
    axisLine: {
      lineStyle: {
        color: "#17b3a3",
      },
    },
    axisLabel: {
      interval: 0,
      color: "#333",
    },
  },
  yAxis: [
    {
      type: "value",
      axisLine: {
        lineStyle: {
          color: "#17b3a3",
        },
      },
    },
  ],
  color: ["#2ec7c9", "#b6a2de", "#5ab1ef", "#ffb980", "#d87a80", "#8d98b3"],
  series: [],
});

const pieOptions = reactive({
  tooltip: {
    trigger: "item",
  },
  legend: {},
  color: [
    "#0f78f4",
    "#dd536b",
    "#9462e5",
    "#a6a6a6",
    "#e1bb22",
    "#39c362",
    "#3ed1cf",
  ],
  series: [],
});

onBeforeMount(() => {
  getTableData().then((res) => {
    tableData.value = res.tableData;
  });
  getCountData().then((res) => {
    // countData.value = res.countData;
    // console.log(res);
    countData.value = res;
  });
  getChartData().then((res) => {
    // 处理图表数据
    const { orderData, userData, videoData } = res;
    // console.log(orderData);
    // console.log(userData);
    console.log(videoData);

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

    //监听页面的变化
    observer.value = new ResizeObserver(() => {
      oneEchart.resize();
      twoEchart.resize();
      threeEchart.resize();
    });

    if (echartRef.value) {
      observer.value.observe(echartRef.value);
    }
  });
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
  .num {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .el-card {
      width: 32%;
      margin-bottom: 20px;
    }
    .icons {
      width: 80px;
      height: 80px;
      font-size: 30px;
      text-align: center;
      line-height: 80px;
      color: #fff;
    }
    .detail {
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
  .graph {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
    .el-card {
      width: 48%;
      height: 260px;
    }
  }
}
</style>
