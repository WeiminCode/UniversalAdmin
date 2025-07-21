import Mock from "mockjs";
import homeApi from "./mockData/home";

//三个参数，第一个是拦截的路径，第二个是请求方式，第三个是返回的数据
Mock.mock(/api\/home\/getTableData/, "get", homeApi.getTableData);
Mock.mock(/api\/home\/getCountData/, "get", homeApi.getCountData);
