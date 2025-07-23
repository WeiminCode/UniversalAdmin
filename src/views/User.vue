<template>
    <div class="user-header">
        <el-button type="primary" @click="handleAdd">添加</el-button>
        <el-form :inline="true" :model="formInline">
            <el-form-item label="请输入">
                <el-input placeholder="请输入用户名" v-model="formInline.keyword"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handleSearch">搜索</el-button>
            </el-form-item>
        </el-form>
    </div>

    <div class="table">
        <el-table :data="tableData" style="width: 100%">
            <el-table-column
                v-for="item in tableLabel"
                :key="item.prop"
                :width="item.width ? item.width : 125"
                :prop="item.prop"
                :label="item.label"
            />
            <el-table-column fixed="right" label="Operations" min-width="120">
                <template #="scope">
                    <el-button  type="primary" size="small" @click="handleEdit(scope.row)">
                    编辑
                    </el-button>
                    <el-button  type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            class="pager"
            background 
            layout="prev, pager, next" 
            size="small"
            :total="config.total" 
            @current-change="handleChange"
        />
    </div>

    <el-dialog
    v-model="dialogVisible"
    :title="action == 'add' ? '新增用户' : '编辑用户'"
    width="35%"
    :before-close="handleClose"
  >
       <!--需要注意的是设置了:inline="true"，
		会对el-select的样式造成影响，我们通过给他设置一个class=select-clearn
		在css进行处理-->
    <el-form :inline="true" :model="formUser" :rules="rules" ref="userForm">
      <el-row>
        <el-col :span="12">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="formUser.name" placeholder="请输入姓名" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="年龄" prop="age">
            <el-input v-model.number="formUser.age" placeholder="请输入年龄" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item class="select-clearn" label="性别" prop="sex">
            <el-select  v-model="formUser.sex" placeholder="请选择">
              <el-option label="男" value="1" />
              <el-option label="女" value="0" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="出生日期" prop="birth">
            <el-date-picker
              v-model="formUser.birth"
              type="date"
              placeholder="请输入"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item
          label="地址"
          prop="addr"
        >
          <el-input v-model="formUser.addr" placeholder="请输入地址" />
        </el-form-item>
      </el-row>
      <el-row style="justify-content: flex-end">
        <el-form-item>
          <el-button type="primary" @click="handleCancel">取消</el-button>
          <el-button type="primary" @click="onSubmit">确定</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </el-dialog>
</template>

<script setup>
import { getUserData, deleteUser, createUser, editUser } from '@/api/api'
import { reactive, onMounted, ref, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const formInline = reactive({
    keyword: '',
})
const config = reactive({
    name: '',
    total: 0,
    page: 1,
})

const tableLabel = reactive([
    {
        prop: 'name',
        label: '姓名',
    },
    {
        prop: 'age',
        label: '年龄',
    },
    {
        prop: 'sex',
        label: '性别',
    },
    {
        prop: 'birth',
        label: '出生日期',
        width: 200,
    },
    {
        prop: 'addr',
        label: '地址',
        width: 400,
    }
])

const tableData = ref([])

const getList = () => {
  getUserData(config).then(res => {
    tableData.value = res.list.map(item => ({
        ...item,
        sex: item.sex === 1 ? '男' : '女',
    }))
    config.total = res.count
  })
}



const handleSearch = () => {
  config.name = formInline.keyword
  getList() // 重新获取数据
}

const handleChange = (page) => {
  config.page = page
  getList()
}

const handleDelete = (val) => {
  ElMessageBox.confirm('确定删除该用户吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    deleteUser({id:val.id}).then(res => {
        ElMessage.success("删除成功")
        getList()
    })
  })
}

onMounted(() => {
  getList()
})

//以下是新增和编辑用户的代码
//控制对话框是否显示
const dialogVisible = ref(false)

//新增和编辑共用一个窗口，所以通过设置action区分
const action = ref("add")

// 初始化表单数据对象
const formUser = reactive({
  name: '',
  age: '',
  sex: '1',  // 默认为男，使用字符串与选项值匹配
  birth: '',
  addr: ''
})
//表单校验规则
const rules = reactive({
  name: [{ required: true, message: "姓名是必填项", trigger: "blur" }],
  age: [
    { required: true, message: "年龄是必填项", trigger: "blur" },
    { type: "number", message: "年龄必须是数字" },
  ],
  sex: [{ required: true, message: "性别是必选项", trigger: "change" }],
  birth: [{ required: true, message: "出生日期是必选项" }],
  addr:[{ required: true, message: '地址是必填项' }]
})

// 创建表单引用
const userForm = ref(null)

//这个方法之前定义过
const handleAdd = () => {
    action.value = "add"
    // 重置表单数据为默认值
    Object.assign(formUser, {
      name: '',
      age: '',
      sex: '1',  // 默认为男
      birth: '',
      addr: ''
    })
    //打开对话窗
    dialogVisible.value = true
}

//对话框右上角的关闭事件
const handleClose = () => {
    //获取到表单dom，执行resetFields重置表单
    userForm.value.resetFields()
    //关闭对话框
    dialogVisible.value=false
}

//对话框右下角的取消事件
const handleCancel = () => {
    userForm.value.resetFields()
    dialogVisible.value=false
}

//格式化日期，格式化为：1997-01-02这种
const timeFormat = (time) => {
    var time = new Date(time);
    var year = time.getFullYear();
    var month = time.getMonth() + 1;
    var date = time.getDate();
    function add(m) {
        return m < 10 ? "0" + m : m;
    }
    return year + "-" + add(month) + "-" + add(date);
}

const onSubmit = () => {
    //执行userForm表单的validate进行规则校验，传入一个回调函数，回调函数会接受到一个是否校验通过的变量
    userForm.value.validate(async (valid)=>{
        
        //如果校验成功
        if (valid) {
                //res用于接收添加用户或者编辑用户接口的返回值
                let res = null
                //这里无论是新增或者是编辑，我们都要对这个日期进行一个格式化
                //如果不是1997-01-02这种格式，使用timeFormat方法进行格式化
                formUser.birth = /^\d{4}-\d{2}-\d{2}$/.test(formUser.birth) ? formUser.birth : timeFormat(formUser.birth)
                
                // 确保年龄为数字类型
                formUser.age = Number(formUser.age)
                // 确保性别为数字类型
                formUser.sex = Number(formUser.sex)
                
                //如果当前的操作是新增，则调用新增接口
                if (action.value == "add") {
                    res = await createUser(formUser);
                } else if(action.value == "edit") {
                    // 编辑功能
                    res = await editUser(formUser);
                }
                //如果接口调用成功
                if(res) {
                        //关闭对话框，重置表单，重新请求用户数据
                        dialogVisible.value = false;
                        userForm.value.resetFields();
                        getList();
                }

		//如果校验失败
        } else {
          ElMessage({
            showClose: true,
            message: "请输入正确的内容",
            type: "error",
          });
        }

    })
}

const handleEdit =  (val) => {
    action.value="edit"
    dialogVisible.value=true
    
    nextTick(()=>{
        //因为在第一次显示弹窗的时候form组件没有加载出来，如果直接对formUser赋值，这个值会作为form表单的初始值
        //所以使用nextTick，赋值的操作在一个微任务中，这样就可以避免在from表单加载之前赋值
       
        Object.assign(formUser,{...val,sex:""+val.sex})
        //这里需要改变sex数据类型，是因为el-option的value有类型的校验
    })
}
</script>



<style scoped lang="less">
.user-header {
    display: flex;
    justify-content: space-between;
}
.table {
    position: relative;
    height: 520px;
    .pager {
        position: absolute;
        right: 10px;
        bottom: 30px;
    }
    .el-table {
        width: 100%;
        height: 500px;
  }
}
.select-clearn {
  display: flex;
}
</style>