import { get, post } from './http'

//对辩题进行操作
//抽题页面
export function getRandomArgument() {
    return get(`http://150.158.148.69:2233/getRandomArgument`)
}

export function getArgumentByCategory(params) {
    return post(`http://150.158.148.69:2233/getArgumentByCategory`, params)
}

//添加辩题页面
export function addArgument(params) {
    return post(`http://150.158.148.69:2233/addArgument`, params)
}

//MyHeader组件
export function getAllTopic() {
    return get(`http://150.158.148.69:2233/getAllTopic`)
}

//用户信息
//获取用户信息
export function getUser(id) {
    return post(`http://150.158.148.69:2233/getUser`, { id })
}

export function updateUserInfo(userName, id, account, mailAddress, schoolName, collegeName, grade, gender) {
    return post(`http://150.158.148.69:2233/updateUser`, {
        userName,
        id,
        account,
        mailAddress,
        schoolName,
        collegeName,
        grade,
        gender,
    })
}
