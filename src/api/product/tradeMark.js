//获取品牌管理的数据模块
import requests from "@/utils/requests"
//获取品牌列表
export const reqTradeMarkList =(page,limit)=>requests({url:`/admin/product/baseTrademark/${page}/${limit}`,method:"get"})
//添加或修改品牌
export const reqAddOrUpdateMark=(tradeMark)=>{
    if(tradeMark.id){
        // 带给服务器数据携带ID---修改
        return requests({url:`/admin/product/baseTrademark/update`,method:"put",data:tradeMark})
    }else{
        //新增品牌
        return requests({url:`/admin/product/baseTrademark/save`,method:"post",data:tradeMark})
    }
}
//删除品牌
export const reqDeleteTradeMark=(id)=>requests({url:`/admin/product/baseTrademark/remove/${id}`,method:"delete"})