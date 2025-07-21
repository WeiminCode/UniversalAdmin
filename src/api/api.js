import { mock } from "mockjs";
import request from "./request";

//请求首页左侧表格数据
export function getTableData() {
  return request({
    url: "/home/getTableData",
    method: "get",
  });
}

export function getCountData() {
  return request({
    url: "/home/getCountData",
    method: "get",
  });
}
