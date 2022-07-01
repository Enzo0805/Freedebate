import Vue from 'vue'
import Vuex from 'vuex'
import { getUser } from "../request/api";
Vue.use(Vuex)

const actions = {
    getUserInfo(context) {
        getUser(context.state.userInfo.id)
            .then((response) => {
                context.commit("changeUserInfo", JSON.parse(response.data.data));
            })
            .catch(function (error) {
                console.log("请求失败了");
                console.log(error.message);
            });
    }
}
const mutations = {
    changeUserInfo(state, data) {
        state.userInfo = data
    },
    //从本地localstorage中获取用户信息，检查是否登录
    checkLogin(state) {
        state.isLogin = localStorage.getItem("userInfo") ? true : false;
        if (state.isLogin === true) {
            state.userInfo = JSON.parse(localStorage.getItem("userInfo"));
            state.isAdmin = state.userInfo.level >= 2 ? true : false;
        }
        else {
            state.isAdmin = false;
        }
    },
    changeShowHeader(state) {
        state.isShowHeader = !state.isShowHeader;
    }
}
const state = {
    isShowHeader: true,
    isLogin: false,
    isAdmin: false,
    userInfo: {},
}

export default new Vuex.Store({
    state,
    mutations,
    actions
})