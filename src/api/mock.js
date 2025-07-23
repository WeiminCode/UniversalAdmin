import Mock from "mockjs";
import homeApi from "./mockData/home";
import userApi from "./mockData/user";

//三个参数，第一个是拦截的路径，第二个是请求方式，第三个是返回的数据
Mock.mock(/api\/home\/getTableData/, "get", homeApi.getTableData);
Mock.mock(/api\/home\/getCountData/, "get", homeApi.getCountData);
Mock.mock(/api\/home\/getChartData/, "get", homeApi.getChartData);
Mock.mock(/api\/home\/getUserData/, "get", userApi.getUserList);
Mock.mock(/api\/home\/deleteUser/, "get", userApi.deleteUser);
Mock.mock(/api\/user\/addUser/, "post", userApi.createUser);
Mock.mock(/api\/user\/editUser/, "post", userApi.updateUser);
