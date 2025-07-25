import { defineStore } from "pinia";
import { ref, watch } from "vue";

function initState() {
  return {
    isCollapse: false,
    tags: [
      {
        path: '/home',
        name: 'home',
        label: '首页',
        icon: 'home'
      },
    ],
    currentMenu: null,
    menuList:[],
    token:"",
    routerList:[],

  };
}

export const useAllDataStore = defineStore("allData", () => {
  //ref() 就是 state 属性
  //computed() 就是 getters
  //function() 就是 actions
  const state = ref(initState());

  watch(state,(newObj)=>{
    if(!newObj.token) return;
    localStorage.setItem('store',JSON.stringify(newObj));
  },{deep:true})

  function selectMenu(val) {
    if(val.name === "home") {
      state.value.currentMenu = null;
    }else{
      let index = state.value.tags.findIndex(item => item.name === val.name);
      index === -1 ? state.value.tags.push(val) : "";
    }
  }

  function updateTags(tag) {
    let index = state.value.tags.findIndex(item => item.name === tag.name);
    state.value.tags.splice(index,1);
  }

  function updateMenuList(val){
    state.value.menuList = val;
  }

  //动态路由，根据菜单生成路由
  function addMenu(router,type){
    if(type === "refresh"){
      if(JSON.parse(localStorage.getItem('store'))){
        state.value = JSON.parse(localStorage.getItem('store'));
        //
        state.value.routerList = [];
      }else{
        return;
      }
    }
    const menu = state.value.menuList;
    console.log(menu);
    const module = import.meta.glob('../views/**/*.vue');
    const routeArr = [];
    //解决多账号路由问题
    let routers = router.getRoutes();
    // console.log(routers); 
    routers.forEach((item)=>{
      if(item.name === 'main' || item.name === 'login'){
        return;
      } else{
        router.removeRoute(item.name);
      }
    })
    //
    menu.forEach((item)=>{
      if (item.children){
        item.children.forEach((val)=>{
          let url = `../views/${val.url}.vue`;
          val.component = module[url];
          routeArr.push(...item.children);
        })
      } else {
        let url = `../views/${item.url}.vue`;
        item.component = module[url];
        routeArr.push(item);
      }
    })
    routeArr.forEach((item)=>{
      state.value.routerList.push(router.addRoute('main',item));
    })
  }

  function logout(){
    state.value.routerList.forEach((item)=>{
      if(item) item();
    })
    // 清空所有数据
    state.value = initState();
    // 清空本地存储
    localStorage.removeItem('store');

  }

  return { 
    state, 
    selectMenu, 
    updateTags,
    updateMenuList,
    addMenu,
    logout
  };

});
