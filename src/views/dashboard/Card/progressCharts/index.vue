<template>
  <div class="charts" ref="charts"></div>
</template>

<script>
import * as echarts from "echarts";
export default {
  name: "ProgressCharts",
  mounted() {
    let lineCharts = echarts.init(this.$refs.charts);
    lineCharts.setOption({
      xAxis: {
        //隐藏x轴
        show: false,
        //最小值与最大值
        min:0,
        max:100
      },
      yAxis: {
        //隐藏y轴
        show: false,
        //均分
        type: "category",
      },
      series: [
        {
          type: "bar",
          data: [78],
          color:"yellowgreen",
          //柱状图的宽度
          barWidth:10,
          //背景颜色的设置
          showBackground:true,
          backgroundStyle:{
            color:"#eee"
          },
          //文本
          label:{
            show:true,
            formatter:"|",
            //文本位置的设置
            position:"right"
          }
        },
      ],
      //布局调试
      grid: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      },
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