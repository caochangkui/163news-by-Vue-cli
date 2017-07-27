// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import  { ToastPlugin } from 'vux'  //用来提示的组件

import VueScroller from 'vue-scroller'//vue-scroller第一步:引入

import VueJsonp from 'vue-jsonp'  //vue-jsonp第一步：引入vue-jsonp

Vue.config.productionTip = false

Vue.use(VueJsonp)   //第二步:使用vue-jsonp；第三步见App.vue
Vue.use(VueScroller)  //第二步： 使用
Vue.use(ToastPlugin)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
