import { mock } from "mockjs";
import request from "./request";

//请求首页左侧表格数据
export function getTableData() {
  return request({
    url: "/home/getTableData",
    method: "get",
  });
}
//请求首页左侧表格数据
export function getCountData() {
  return request({
    url: "/home/getCountData",
    method: "get",
  });
}
//请求首页右侧图表数据
export function getChartData() {
  return request({
    url: "/home/getChartData",
    method: "get",
  });
}
//请求用户表格数据
export function getUserData(data) {
  return request({
    url: "/home/getUserData",
    method: "get",
    data,
  });
}

//删除用户
export function deleteUser(data) {
  return request({
    url: "/home/deleteUser",
    method: "get",
    data,
  });
}

//新增用户
export function createUser(data) {
  return request({
    url: "/user/addUser",
    method: "post",
    data,
  });
}

//编辑用户
export function editUser(data) {
  return request({
    url: "/user/editUser",
    method: "post",
    data,
  });
}

//登录
export function getMenu(params) {
  return request({
    url: '/permission/getMenu',
    method: 'post',
    data: params
  })
}