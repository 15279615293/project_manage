<template>
  <div>
    <el-card style="margin: 20px 0px">
      <CategorySelect @getCategoryId="getCategoryId" :show="!isShowTable"></CategorySelect>
    </el-card>
    <el-card>
      <div v-show="isShowTable">
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!category3Id"
          @click="addAttr"
          >添加属性</el-button
        >
        <!-- 表格：展示平台属性 -->
        <el-table style="width: 100%" border :data="attrList">
          <el-table-column type="index" label="序号" width="80">
          </el-table-column>
          <el-table-column prop="attrName" label="属性名称" width="150">
          </el-table-column>
          <el-table-column prop="prop" label="属性值列表" width="width">
            <template slot-scope="{ row }">
              <el-tag
                type="success"
                v-for="attValue in row.attrValueList"
                :key="attValue.id"
                style="margin: 0px 10px"
                >{{ attValue.valueName }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="150">
            <template slot-scope="{ row }">
              <el-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                @click="updataAttr(row)"
                style="margin-right:5px"
              ></el-button>
             <el-popconfirm :title="`你确定删除${row.attrName}吗？`" @onConfirm="deleteAttr(row)">
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  slot="reference"                
                ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 添加属性|修改属性的结构 -->
      <div v-show="!isShowTable">
        <el-form :inline="true" ref="form" label-width="80px" :model="attrInfo">
          <el-form-item label="属性名">
            <el-input
              placeholder="请输入属性名"
              v-model="attrInfo.attrName"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="addAttrValue"
          :disabled="!attrInfo.attrName"
          >添加属性值</el-button
        >
        <el-button @click="isShowTable = true">取消</el-button>
        <el-table
          style="width: 100%; margin: 20px 0px"
          border
          :data="attrInfo.attrValueList"
        >
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="prop" label="属性名称" width="width">
            <template slot-scope="{ row, $index }">
              <el-input
                v-model="row.valueName"
                placeholder="请输入属性值名称"
                size="mini"
                v-if="row.flag"
                @blur="toLook(row)"
                @keyup.native.enter="toLook(row)"
                :ref="$index"
              ></el-input>
              <span
                v-else
                @click="toEdit(row, $index)"
                style="display: block"
                >{{ row.valueName }}</span
              >
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row,$index}">
              <!-- 气泡确认框 -->
              <el-popconfirm :title="`你确定删除${row.valueName}吗？`" @onConfirm="deleteAttrValue($index)">
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  slot="reference"
                ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" @click="addOrUpdateeAttr" :disabled="attrInfo.attrValueList.length<1">保存</el-button>
        <el-button @click="isShowTable = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
//按需引入lodash当中的深拷贝
import cloneDeep from "lodash/cloneDeep";
export default {
  name: "Attr",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      // 平台属性
      attrList: [],
      isShowTable: true,
      //收集新增属性|修改属性使用
      attrInfo: {
        attrName: "", //属性名
        //属性值
        attrValueList: [],
        categoryId: 0, //三级分类的id
        categoryLevel: 3, //区分几级分类id
      },
    };
  },
  methods: {
    getCategoryId({ categoryId, level }) {
      //区分三级分类相应的Id，以及父组件进行存储
      if (level == 1) {
        this.category1Id = categoryId;
        this.category2Id = "";
        this.category3Id = "";
      } else if (level == 2) {
        this.category2Id = categoryId;
        this.category3Id = "";
      } else {
        this.category3Id = categoryId;
        this.getAttrList();
      }
    },
    //获取平台属性的数据
    async getAttrList() {
      const { category1Id, category2Id, category3Id } = this;
      let result = await this.$API.attr.reqAttrList(
        category1Id,
        category2Id,
        category3Id
      );
      if (result.code == 200) {
        this.attrList = result.data;
      }
    },
    //添加属性值
    addAttrValue() {
      this.attrInfo.attrValueList.push({
        // 添加属性值的操作，还没有相应属性的id，所以定义undefined
        //如果在修改属性zhi的时候，新增属性值，则需要把id带上
        attrId: this.attrInfo.id,
        valueName: "",
        //用于切换编辑模式与查看模式。好处：每一个属性值都可以控制自己的切换模式
        flag: true,
      });
      this.$nextTick(() => {
        this.$refs[this.attrInfo.attrValueList.length - 1].focus();
      });
    },
    //添加属性按钮回调
    addAttr() {
      this.isShowTable = false;
      this.attrInfo = {
        attrName: "", //属性名
        //属性值
        attrValueList: [],
        categoryId: this.category3Id, //三级分类的id
        categoryLevel: 3, //区分几级分类id
      };
    },
    //修改某一个属性
    updataAttr(row) {
      this.isShowTable = false;
      //应为数据结构中在对象里嵌套数组，素组里面有嵌套对象，所以要使用深拷贝解决问题
      this.attrInfo = cloneDeep(row);
      //添加一个flag属性标记
      this.attrInfo.attrValueList.forEach((item) => {
        //不能写成item.flag=false,这样写不是响应式的
        //$set:向响应式对象中添加一个 property，并确保这个新 property 同样是响应式的，且触发视图更新。
        //它必须用于向响应式对象上添加新 property，因为 Vue 无法探测普通的新增 property
        this.$set(item, "flag", false);
      });
    },
    //失去焦点的事件---切换为查看模式，显示span
    toLook(row) {
      //属性值不能为空
      //trim():返回移除头尾空格的字符串。
      if (row.valueName.trim() == "") {
        this.$message("请输入一个正常的值");
        return;
      }
      //新增的属性值不能与已有的重复
      //some()用于检测数组中的元素是否满足指定条件,如果有一个元素满足条件，则表达式返回true , 剩余的元素不会再执行检测。
      //如果没有满足条件的元素，则返回false。
      let isRepat = this.attrInfo.attrValueList.some((item) => {
        if (row !== item) {
          return row.valueName == item.valueName;
        }
      });
      if (isRepat) return;
      row.flag = false;
    },
    //点击span的回调
    toEdit(row, index) {
      row.flag = true;
      //浏览器不能立马获取到input，使用nextTick，当节点渲染完毕，会执行一次
      this.$nextTick(() => {
        //focus():聚焦
        this.$refs[index].focus();
      });
    },
    //气泡确认框确定按钮的回调
    deleteAttrValue(index){
      this.attrInfo.attrValueList.splice(index,1)
    },
    //保存按钮
    async addOrUpdateeAttr(){
      //filter():创建一个新的数组，新数组中的元素是通过检查指定数组中符合条件的所有元素
      this.attrInfo.attrValueList=this.attrInfo.attrValueList.filter(item=>{
        //属性值为空的属性值不应该传给服务器
        if(item.valueName!=""){
          //带给服务器的数据没有flag属性，删除flag属性
          delete item.flag;
          return true;
        }
      })
      try {
        await this.$API.attr.reqAddOrUpdateAttr(this.attrInfo)
        this.isShowTable=true
        this.$message({type:"success",message:"保存成功"})
        this.getAttrList()
      } catch (error) {
        alert(error.message)
      }
    },
    //删除某一个属性
    async deleteAttr(row){
      try {
        await this.$API.attr.reqDeleteAttr(row.id)
        this.$message({type:"success", message:"删除成功"})
        this.getAttrList()
      } catch (error) {
        alert(error.message)
      }
    }
  },
};
</script>

<style>
</style>