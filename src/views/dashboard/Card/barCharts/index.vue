<template>
  <div class="charts" ref="charts"></div>
</template>

<script>
import * as echarts from "echarts";
export default {
  name: "BarChart",
  mounted() {
    let lineCharts = echarts.init(this.$refs.charts);
    lineCharts.setOption({
      xAxis: {
        //隐藏x轴
        show: false,
        //均分
        type: "category",
      },
      yAxis: {
        //隐藏y轴
        show: false,
      },
      series: [
        {
          type: "bar",
          data: [10, 7, 33, 12, 48, 9,29,10,44,33,22,8],
          color:"aqua"
        },
      ],
      //布局调试
      grid: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      },
      //提示信息
      tooltip:{},
    });
  },
};
</script>

<style>
.charts {
  width: 100%;
  height: 100%;
}
</style>