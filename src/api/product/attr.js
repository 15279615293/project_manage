//平台属性管理模块的请求文件
import requests from '@/utils/requests'

//获取一级分类数据接口
export const reqCategory1List=()=>requests({url:`/admin/product/getCategory1`,method:"get"})
//获取二级分类数据接口
export const reqCategory2List=(category1Id)=>requests({url:`/admin/product/getCategory2/${category1Id}`,method:"get"})
//获取三级分类数据接口
export const reqCategory3List=(category2Id)=>requests({url:`/admin/product/getCategory3/${category2Id}`,method:"get"})
//获取平台属性接口
export const reqAttrList=(category1Id,category2Id,category3Id)=>requests({url:`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,method:"get"})
//添加|修改属性与属性值的接口
export const reqAddOrUpdateAttr=(data)=>requests({url:`/admin/product/saveAttrInfo`,method:"post",data})
//删除某一个属性
export const reqDeleteAttr=(attrId)=>requests({url:`/admin/product/deleteAttr/${attrId}`,method:"delete"})