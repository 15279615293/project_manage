import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter,asynRoutes,constantRoutes,anyRouter} from '@/router'
import router from "@/router"

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
     //服务器返回的菜单信息【根据不同的角色：返回的标记信息，数组里面的元素是字符串】
     routes:[],
     //角色信息
     roles:[],
     //按钮权限的信息
     buttons:[],
     //对比之后【项目中已有的路由与服务器返回的标记信息进行对比最终需要展示的路由】
     resultAsyncRoutes:[],
     //用户需要展示的全部路由
     resultAllRoutes:[]
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
//存储用户信息
  SET_USERINFO:(state,userInfo)=>{
    //用户名
    state.name=userInfo.name
    //头像
    state.avatar=userInfo.avatar
    //菜单权限标记
    state.routes=userInfo.routes
    //按钮权限标记
    state.buttons=userInfo.buttons
    //角色信息标记
    state.roles=userInfo.roles
  },
  //最终计算出的异步路由
  SET_RESULTASYNCROUTES(state,resultAsyncRoutes){
    state.resultAsyncRoutes=resultAsyncRoutes
    //合并所有路由
    state.resultAllRoutes=constantRoutes.concat(state.resultAsyncRoutes,anyRouter)
    //给路由添加新的路由
    router.addRoutes(state.resultAllRoutes)
  }
}

//定义一个函数：两个数组进行对比，对比出当前用户到底展示那些异步路由
const computedAsyncRoutes=(asynRoutes,routes)=>{
  //过滤出当前用户需要展示的路由
  return asynRoutes.filter(item=>{
    if(routes.indexOf(item.name)!=-1){
      //递归，二级三级...路由也需要过滤
      if(item.children&&item.children.lenght){
        item.children=computedAsyncRoutes(item.children,routes)
      }
      return true;
    }
  })
}
const actions = {
  // user login
  async login({ commit }, userInfo) {
    const { username, password } = userInfo
    let result = await login({ username: username.trim(), password: password })
    if(result.code==20000){
      commit('SET_TOKEN', result.data.token)
      setToken(result.data.token)
      return "ok"
    }else{
      return Promise.reject(new Error(result.message))
    }
    // return new Promise((resolve, reject) => {
    //   login({ username: username.trim(), password: password }).then(response => {
    //     const { data } = response
    //     commit('SET_TOKEN', data.token)
    //     setToken(data.token)
    //     resolve()
    //   }).catch(error => {
    //     reject(error)
    //   })
    // })
  },

  // 获取用户信息
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          return reject('Verification failed, please Login again.')
        }
      //储存用户全部的信息
       commit("SET_USERINFO",data)
       commit("SET_RESULTASYNCROUTES",computedAsyncRoutes(asynRoutes,data.routes))
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

