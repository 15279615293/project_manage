<template>
  <div>
    <el-card style="margin: 20px 0px">
      <CategorySelect @getCategoryId="getCategoryId" :show="scene!=0"></CategorySelect>
    </el-card>
    <el-card>
      <div v-show="scene==0">
      <el-button type="primary" icon="el-icon-plus" :disabled="!category3Id" @click="addSpu">添加SPU</el-button>
      <el-table style="width: 100%" border :data="records">
        <el-table-column type="index" label="序号" width="80" align="center">
        </el-table-column>
        <el-table-column prop="spuName" label="SPU名称" width="width">
        </el-table-column>
        <el-table-column prop="description" label="SPU描述" width="width">
        </el-table-column>
        <el-table-column prop="prop" label="操作" width="width">
          <template slot-scope="{row}">
            <el-button type="success" icon="el-icon-plus" size="mini" title="添加sku" @click="addSku(row)"></el-button>
            <el-button type="warning" icon="el-icon-edit" size="mini" title="修改spu" @click="updateSpu(row)"></el-button>
            <el-button type="info" icon="el-icon-info" size="mini" title="查看当前spu全部sku列表" style="margin-right:7px" @click="handler(row)"></el-button>           
            <el-popconfirm title="这是一段内容确定删除吗？" @onConfirm="deleteSpu(row)">
              <el-button type="danger" icon="el-icon-delete" size="mini" title="删除spu" slot="reference"></el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table> 
      <el-pagination
        style="text-align:center"
        :current-page="page"
        :page-sizes="[3, 5, 10]"
        :page-size="limit"
        layout="prev, pager, next, jumper, ->,sizes,total"
        :total="total"
        @current-change="getSpuList"
        @size-change="handleSizeChange">
      </el-pagination>
      </div>
      <!-- 添加|修改spu -->
      <SpuForm v-show="scene==1" @changeScene="changScene" ref="spu"></SpuForm>
      <!-- 添加sku -->
      <SkuForm v-show="scene==2" ref="sku" @changeScenes="changeScenes"></SkuForm>

<!-- before-close:对话框关闭前的回调，会暂停 Dialog 的关闭 -->
    </el-card>
    <el-dialog :title="`${spu.spuName}的sku列表`" :visible.sync="dialogTableVisible" :before-close="close">
      <el-table :data="skuList" style="width: 100%" border v-loading="loading">
        <el-table-column prop="skuName" label="名称" width="width">
        </el-table-column>
        <el-table-column prop="price" label="价格" width="width">
        </el-table-column>
        <el-table-column prop="weight" label="重量" width="width">
        </el-table-column>
        <el-table-column prop="prop" label="默认图片" width="width">
          <template slot-scope="{row}">
            <img :src="row.skuDefaultImg" style="width:100px;height:100px">
          </template>
        </el-table-column>
      </el-table>
</el-dialog>
  </div>
</template>

<script>
import SpuForm from "./SpuForm"
import SkuForm from "./SkuForm"
import { done } from 'nprogress';
export default {
  name: "Spu",
  components:{SpuForm,SkuForm},
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      //控制三级联动可操作性
      page:1,
      limit:3,
      total:0,
      records:[],
      //0代表spu列表数据，1：添加|修改spu，2:添加sku
      scene:0,
      dialogTableVisible:false,//对话框的显示与隐藏
      spu:{},
      skuList:[],//sku列表数据
      loading:true
    };
  },
  methods: {
    //三级联动的自定义事件，可以把子组件的相应的id传递给父组件
    getCategoryId({ categoryId, level }) {
      if (level == 1) {
        this.category1Id = categoryId;
        this.category2Id = "";
        this.category3Id = "";
      } else if (level == 2) {
        this.category2Id = categoryId;
        this.category3Id = "";
      } else {
        this.category3Id = categoryId;
        this.getSpuList();
      }
    },
    //获取spu列表数据
    async getSpuList(pages=1){
      this.page=pages
      let {page,limit,category3Id} = this;
      let result = await this.$API.spu.reqSpuList(page,limit,category3Id)
      if(result.code==200){
        this.total=result.data.total
        this.records=result.data.records
      }
    },
    handleSizeChange(limit){
      this.limit=limit
      this.getSpuList()
    },
    //添加Spu
    addSpu(){
      this.scene=1
      this.$refs.spu.addSpuData(this.category3Id)
    },
    //修改Spu
    updateSpu(row){
      this.scene=1
      this.$refs.spu.initSpuData(row)
    },
    //spuform自定义事件
    changScene({scene,flag}){
      this.scene=scene
      if(flag=="修改"){
        this.getSpuList(this.page)
      }else{
        this.getSpuList()
      }
    },
    //删除spu
    async deleteSpu(row){
      let resule = await this.$API.spu.reqDeleteSpu(row.id)
      if(resule.code==200){
        this.$message({type:"success",message:"删除成功"})
        //如果spu个数大于1，删除的时候停留在当前页，小于一则回到上一页
        this.getSpuList(this.records.length > 1?this.page:this.page-1)
      }
    },
    //添加sku
    addSku(row){
      this.scene=2
      this.$refs.sku.getData(this.category1Id,this.category2Id,row)
    },
    //skuform自定义事件
    changeScenes(scene){
      this.scene=scene
    },
    //查看sku按钮
    async handler(spu){
      this.dialogTableVisible=true
      this.spu=spu
      let result = await this.$API.spu.reqSkuList(spu.id)
      if(result.code==200){
        this.skuList=result.data
        this.loading=false
      }
    },
    //关闭对话框
    close(done){
      this.loading=true
      this.skuList=[]
      done()
    }
  },
};
</script>

<style>
</style>