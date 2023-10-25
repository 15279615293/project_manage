import requests from '@/utils/requests'

//获取SPU列表数据的接口
export const reqSpuList=(page,limit,category3Id)=>requests({url:`/admin/product/${page}/${limit}`,method:"get",params:{category3Id}})
//获取spu信息
export const reqSpu=(spuId)=>requests({url:`/admin/product/getSpuById/${spuId}`,method:"get"})
//获取品牌信息
export const reqTradeMarkList=()=>requests({url:`/admin/product/baseTrademark/getTrademarkList`,method:"get"})
//获取spu图片
export const reqSpuImageList=(spuId)=>requests({url:`/admin/product/spuImageList/${spuId}`,method:"get"})
//获取平台全部的销售属性----一共三个
export const reqBaseSaleAttrList=()=>requests({url:`/admin/product/baseSaleAttrList`,method:"get"})
//修改|添加spu
export const reqAddOrUpdateSpu=(spuInfo)=>{
    if(spuInfo.id){
        return requests({url:`/admin/product/updateSpuInfo`,method:"post",data:spuInfo})
    }else{
        return requests({url:`/admin/product/saveSpuInfo`,method:"post",data:spuInfo})
    }
}
//删除spu
export const reqDeleteSpu=(spuId)=>requests({url:`/admin/product/deleteSpu/${spuId}`,method:"delete"})

//获取图片数据
export const reqSpuImageLIst=(spuId)=>requests({url:`/admin/product/spuImageList/${spuId}`,method:"get"})
//获取销售属性数据
export const reqSpuSalaAttrList=(spuId)=>requests({url:`/admin/product/spuSaleAttrList/${spuId}`,method:"get"})
//获取平台属性数据
export const reqAttrInfoList=(category1Id,category2Id,category3Id)=>requests({url:`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,method:'get'})
//添加sku
export const requAddSku=(skuInfo)=>requests({url:`/admin/product/saveSkuInfo`,method:"post",data:skuInfo})
//获取SKU列表数据
export const reqSkuList=(spuId)=>requests({url:`/admin/product/findBySpuId/${spuId}`,method:"get"})