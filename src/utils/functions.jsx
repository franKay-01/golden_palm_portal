import useAxios from "../hooks/hook"
import Cookies from 'js-cookie';

const useFunctions = () => {
  const { executeGet, executeReq } = useAxios();

  const getHomeData = async () => {
    try{
      const { data } = await executeGet('common/home-analytics')
      return {response_code: data.response_code, userCount: data.userCount,
        orderCount: data.orderCount, productCount: data.productCount,
        latestUsers: data.latestUsers, latestOrders: data.latestOrders
      }
    }catch{
      return {response_code: '001'}
    }
  }

  const adminCreateShippingRate = async (params) => {
    try{
      const { data } = await executeReq('common/shipping-rates', params)
      return {response_code: data.response_code, response_message: data.response_message}
    }catch{
      return {response_code: '001'}
    }
  }
  
  const getUsersInfo = async () => {
    try{
      const { data } = await executeGet('users')
      return {response_code: data.response_code, allUsers: data.users}
    }catch{
      return {response_code: '001'}
    }
  }

  const getProductInfo = async () => {
    try{
      const { data } = await executeGet('common/product-info')
      return {response_code: data.response_code, allCategories: data.allCategories, allProducts: data.allProducts}
    }catch{
      return {response_code: '001'}
    }
  }

  const adminCreateCategory = async (params) => {
    try{
      const { data } = await executeReq('categories', params)
      return {response_code: data.response_code, response_message: data.response_message}
    }catch{
      return {response_code: '001'}
    }
  }

  const adminCreateProduct = async (params) => {
    try{
      const { data } = await executeReq('product-info', params)
      return {response_code: data.response_code, response_message: data.response_message}
    }catch{
      return {response_code: '001'}
    }
  }

  const adminChangeUserStatus = async (params) => {
    try{
      const { data } = await executeReq('users/status', params)
      return {response_code: data.response_code, response_message: data.response_message}
    }catch{
      return {response_code: '001'}
    }
  }

  const adminChangeProductStatus = async (params) => {
    try{
      const { data } = await executeReq('product-info/status', params)
      return {response_code: data.response_code, response_message: data.response_message}
    }catch{
      return {response_code: '001'}
    }
  }

  const adminEditProduct = async (params) => {
    try{
      const { data } = await executeReq('product-info/edit', params)
      return {response_code: data.response_code, response_message: data.response_message}
    }catch{
      return {response_code: '001'}
    }
  }

  const adminLogin = async (params) => {
    try{
      const { data } = await executeReq('users/signin', params)
      return {response_code: data.response_code, admin_name: data.username, token: data.token}
    }catch{
      return {response_code: '001'}
    }
  }

  return { adminLogin, getHomeData, getProductInfo, adminCreateCategory, adminCreateProduct, 
    adminEditProduct, adminChangeProductStatus, getUsersInfo, adminChangeUserStatus, adminCreateShippingRate
  }
}

export default useFunctions