import { defineStore } from "pinia";
import { ref, computed } from "vue";

function initState() {
  return {
    isCollapse: false,
  };
}

export const useAllDataStore = defineStore("allData", () => {
  //ref() 就是 state 属性
  //computed() 就是 getters
  //function() 就是 actions
  const state = ref(initState());

  return { state };
});
