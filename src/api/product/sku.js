import requests from '@/utils/requests'

//获取sku列表
export const reqSkuList=(page,limit)=>requests({url:`/admin/product/list/${page}/${limit}`,method:"get"})
//上架
export const reqSale=(skuId)=>requests({url:`/admin/product/onSale/${skuId}`,method:"get"})
//下架
export const reqCancel=(skuId)=>requests({url:`/admin/product/cancelSale/${skuId}`,method:"get"})
//获取sku详情
export const reqSkuById=(skuId)=>requests({url:`/admin/product/getSkuById/${skuId}`,method:"get"})