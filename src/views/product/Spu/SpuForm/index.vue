<template>
  <div>
    <el-form ref="form" label-width="80px" :model="spu">
      <el-form-item label="SPU品牌">
        <el-input placeholder="SPU名称" v-model="spu.spuName"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select placeholder="请选择品牌" v-model="spu.tmId">
          <el-option
            :label="tm.tmName"
            :value="tm.id"
            v-for="tm in tradeMarkList"
            :key="tm.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input
          type="textarea"
          rows="4"
          placeholder="描述"
          v-model="spu.description"
        ></el-input>
      </el-form-item>
      <el-form-item label="SPU图片">
        <!--  list-type:文件列表的类型 
        on-preview:点击文件列表中已上传的文件时的钩子 
        on-remove:文件列表移除文件时的钩子
        on-success：文件上传成功时的钩子
        file-list:照片墙需要展示的数据, 例如: [{name: 'food.jpg', url: 'https://xxx.cdn.com/xxx.jpg'}]-->
        <el-upload
          action="/brand-api/admin/product/upload"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :file-list="spuImageList"
          :on-success="handlerSuccess"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select :placeholder="`还有${unSelectSaleAttr.length}未选择`" v-model="attrIdAndAttrName">
          <el-option :label="unselect.name" :value="`${unselect.id}:${unselect.name}`" v-for="unselect in unSelectSaleAttr" :key="unselect.id"></el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-plus" :disabled="!attrIdAndAttrName" @click="addSaleAttr">添加销售属性</el-button>
        <el-table style="width: 100%" border :data="spu.spuSaleAttrList">
          <el-table-column type="index" label="序号" width="80px" align="center">
          </el-table-column>
          <el-table-column prop="saleAttrName" label="属性名" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="属性值列表" width="width">
            <template slot-scope="{ row }">
              <el-tag :key="tag.id" v-for="(tag,index) in row.spuSaleAttrValueList" closable :disable-transitions="false" @close="row.spuSaleAttrValueList.splice(index,1)">
                {{tag.saleAttrValueName}}
              </el-tag>
              <!-- 底下结构为span与input切换 -->
              <el-input class="input-new-tag" v-if="row.inputVisible" v-model="row.inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(row)" @blur="handleInputConfirm(row)">
              </el-input>
              <!-- @click="showInput" -->
              <el-button v-else class="button-new-tag" size="small" @click="addSaleAttrValue(row)">+添加</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{row,$index}">
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="spu.spuSaleAttrList.splice($index,1)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addOrUpdateSpu">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SpuForm",
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      spu: {
        category3Id: 0,
        //描述
        description: "",
        spuName: "",
        //品牌的id
        tmId: "",
        //收集spu图片信息
        spuImageList: [
          //   {
          //     id: 0,
          //     imgName: "string",
          //     imgUrl: "string",
          //     spuId: 0,
          //   },
        ],
        //平台属性与属性值
        spuSaleAttrList: [
          //   {
          //     baseSaleAttrId: 0,
          //     id: 0,
          //     saleAttrName: "string",
          //     spuId: 0,
          //     spuSaleAttrValueList: [
          //       {
          //         baseSaleAttrId: 0,
          //         id: 0,
          //         isChecked: "string",
          //         saleAttrName: "string",
          //         saleAttrValueName: "string",
          //         spuId: 0,
          //       },
          //     ],
          //   },
        ],
      },
      tradeMarkList: [],
      spuImageList: [],
      saleAttrList: [],
      attrIdAndAttrName:"",//收集未选择的销售属性Id
    };
  },
  methods: {
    handleRemove(file, fileList) {
        // file：删除的那张图片  fileList：剩余的图片
        //收集数据
      this.spuImageList=fileList
    },
    //预览照片墙
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    async initSpuData(spu) {
      //获取spu信息的数据
      let spuResule = await this.$API.spu.reqSpu(spu.id);
      if (spuResule.code == 200) {
        this.spu = spuResule.data;
      }
      //获取品牌信息
      let tradeMarkResult = await this.$API.spu.reqTradeMarkList();
      if (tradeMarkResult.code == 200) {
        this.tradeMarkList = tradeMarkResult.data;
      }
      //获取spu图片数据
      let spuImageResult = await this.$API.spu.reqSpuImageList(spu.id);
      if (spuImageResult.code == 200) {
        let listArr = spuImageResult.data;
        //照片墙显示的数据需要数组，里面的元素需要有name与url字段
        listArr.forEach((item) => {
          item.name = item.imgName;
          item.url = item.imgUrl;
        });
        this.spuImageList = listArr;
      }
      //获取平台所有销售属性
      let saleResult = await this.$API.spu.reqBaseSaleAttrList();
      if (saleResult.code == 200) {
        this.saleAttrList = saleResult.data;
      }
    },
    //照片墙图片上传成功的回调
    handlerSuccess(response, file, fileList){
        this.spuImageList=fileList
    },
    //添加新的销售属性
    addSaleAttr(){
      let [baseSaleAttrId,saleAttrName] = this.attrIdAndAttrName.split(":");
      let newSakeAttr = {baseSaleAttrId,saleAttrName,spuSaleAttrValueList:[]}
      this.spu.spuSaleAttrList.push(newSakeAttr)
      this.attrIdAndAttrName=""
    },
    //添加按钮的回调
    addSaleAttrValue(row){
      //控制button与input切换
      this.$set(row,"inputVisible",true)
      //通过响应式数据inputValue字段收集新增的销售属性值
      this.$set(row,"inputValue","")
    },
    //el-input失去焦点事件回调
    handleInputConfirm(row){
      const {baseSaleAttrId,inputValue} = row
      if(inputValue.trim()==""){
        this.$message("属性值不能为空")
        return
      }
      //属性值不能重复
      let result =row.spuSaleAttrValueList.every(item=>item.saleAttrValueName!=inputValue)
      if(!result) return;
      let newSaleAttrValue = {baseSaleAttrId,saleAttrValueName:inputValue}
      row.spuSaleAttrValueList.push(newSaleAttrValue)
      row.inputVisible=false
    },
    //保存按钮的回调
    async addOrUpdateSpu(){
      this.spu.spuImageList=this.spuImageList.map((item)=>{
        return{
          imageName:item.name,
          imageUrl:(item.response && item.response.data) || item.url
        }
      })
      let result = await this.$API.spu.reqAddOrUpdateSpu(this.spu)
      if(result.code==200){
        this.$message({type:"success",message:"保存成功"})
        this.$emit("changeScene",{scene:0,flag:this.spu.id?"修改":"添加"})
      }
      Object.assign(this._data,this.$options.data())
    },
    //点击添加按钮的时候，发请求的函数
    async addSpuData(category3Id){
      //添加spu的时候收集三级分类的id
      this.spu.category3Id=category3Id
       //获取品牌信息
       let tradeMarkResult = await this.$API.spu.reqTradeMarkList();
      if (tradeMarkResult.code == 200) {
        this.tradeMarkList = tradeMarkResult.data;
      }
      //获取平台所有销售属性
      let saleResult = await this.$API.spu.reqBaseSaleAttrList();
      if (saleResult.code == 200) {
        this.saleAttrList = saleResult.data;
      }
    },
    //取消按钮的回调
    cancel(){
      this.$emit('changeScene', {scene:0,flag:''})
      //清除数据
      //Object.assign：ES6新语法，合并对象
      Object.assign(this._data,this.$options.data())
    }
  },
  computed:{
    //计算出还未选择的销售属性
    unSelectSaleAttr(){
        return this.saleAttrList.filter(item=>{
            // return:true则过滤出需要的元素
            return this.spu.spuSaleAttrList.every(item1=>{
                return item.name!=item1.saleAttrName
            })
        })
    }
  }
};
</script>

<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>