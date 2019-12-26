import axios from 'axios';
import qs from 'qs';

import { Toast } from 'vant';
import router from '../router';

// 请求接口地址
let interfaceApi = {
    user: `/user`,
}


let baseURL = '';
if( process.env.NODE_ENV === 'development'){
    baseURL = 'http://127.0.0.1:9000';
}else{
    // baseURL = 'http://127.0.0.1:9000';
};

// 请求实例默认配置
axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8';
let instance = axios.create({
    baseURL: baseURL,
    timeout: 3000
});

instance.interceptors.request.use(
    config => {
        let token = localStorage.getItem('token') || '';
        if( token ){
            config.headers.token = `${token}`;
        };
        return config;
    },
    err => Promise.reject( err )
);

// 过期登录
const toLogin = function(){
    Toast('登录已过期~');
    localStorage.removeItem('token');
    console.log("TCL: toLogin -> router", router)
    setTimeout( () => {
        router.replace({
            path: '/login',
            query: { redirect: router.currentRoute.fullPath }
        });
    }, 1000);
};

// 统一后台请求通讯层状态码出错处理
const handleError = function( status, message ){
    switch (status) {
        case 401:
            toLogin();
            break;
        case 403:
            toLogin();
            break;
        case 404:
            Toast('请求的资源不存在');
            break;
        case 500:
            Toast('服务器异常，请稍后再试');
            break;
        default:
            console.log(message);
    }
}

instance.interceptors.response.use(
    res => {
        if( res.status == 401 ){
            toLogin();
        };
        return res;
    },
    error => { 
        const { response } = error;
        handleError( response.status, response.data.message );
        return Promise.reject( response );
    }
)

/**
 * 
 * @param {*} requestType  请求type类型
 * @param {*} url          url.prefixURL:请求的接口前缀地址  url.suffixURL:动态后缀id类值地址
 * @param {*} params       get请求时所需要的参数，可能为空 
 * @param {*} data         非get请求时所需要的参数，不可为空 
 */

// 资源中心模块请求
export function createRequest(requestType, url, params) {
    return instance({
        method: requestType,
        url: url.suffixURL ? interfaceApi[url.prefixURL] + url.suffixURL : interfaceApi[url.prefixURL],
        params: requestType === 'get' ? params : null,
        data: requestType !== 'get' ? params : null
    }).then(res => {
        if (res.status === 200) {
            return res.data;
        } else {
            Toast(res.msg);
        }
    }).catch(err => console.log(err))
}