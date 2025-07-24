<template>
    <div class="body-login">
        <el-form :model="loginForm" class="login-container">
            <h1>欢迎登录</h1>
            <el-form-item>
                <el-input  type="input" v-model="loginForm.username" placeholder="请输入账号"></el-input>
            </el-form-item>
            <el-form-item>
                <el-input  type="password" v-model="loginForm.password" placeholder="请输入密码"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="login">登录</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup>
import { reactive } from 'vue';
const loginForm = reactive({
    username: '',
    password: ''
})
const login = () => {
    console.log(loginForm);
}
</script>

<style scoped lang="less">
.body-login {
    width: 100%;
    height: 100%;
    background-image: url('@/assets/images/background.png');
    background-size: cover;
    overflow: hidden;
}
.login-container {
    width: 350px;
    background-color: #fff;
    border: 1px solid #eaeaea;
    border-radius: 15px;
    padding: 35px 35px 15px 35px;
    box-shadow: 0 0 25px 0 #cacaca;
    margin: 250px auto;
    h1 {
        text-align: center;
        margin-bottom: 20px;
        color: #505450;

    }
    //样式穿透
    :deep(.el-form-item__content) {
        justify-content: center;
    }
}
</style>