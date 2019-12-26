<template>
    <div class="home">
        <div @click="getUser('xiaoming')">获取小明信息</div>
        <div @click="getUser('xiaohua')">获取小华信息</div>
        <div @click="getUser('xiaohong')">获取小红信息</div>
        <div @click="getUser('xiaoli')">获取小李信息</div>
        <div @click="getUser('xiaofang')">获取小方信息</div>

        
        <div>姓名：{{ name }}</div>
        <div>密码：{{ password }}</div>
    </div>
</template>

<script>
import { createRequest } from '@/server/api'

export default {
    name: 'home',
    data(){
        return {
            name: '',
            password: ''
        }
    },
    methods: {
        async getUser(name){
            let result = await createRequest('get', { prefixURL: 'user'}, { name: name } );
            // console.log("TCL: getUser -> user", result)

            if(result && result.status === 200){
                this.name = result.data.name;
                this.password = result.data.password;
            }
        }
    }
}
</script>
