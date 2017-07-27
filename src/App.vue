<template>
  <div id="app">
    <view-box>
        <!-- 顶部内容 -->
        <x-header
          class="header"
          slot="header"
          :left-options="{showBack:true}"
        >
          <div slot="left">直播</div>  <!-- 以插槽的形式 -->
          <div>网易新闻</div>  <!-- 以插槽的形式 -->
          <div slot="right">搜索</div>  <!-- 以插槽的形式 -->
        </x-header>

        <!-- 中间内容 -->
        <!-- 采用Scroller as sc组件可以达到更好的回弹效果，注意内面外层需要一个div -->
        <sc
          :lock-y="true"
        >
          <div class="tab">
            <tab>
              <tab-item selected>头条</tab-item>
              <tab-item>热点</tab-item>
              <tab-item>科技</tab-item>
              <tab-item>社会</tab-item>
              <tab-item>娱乐</tab-item>
              <tab-item>影视</tab-item>
              <tab-item>探索</tab-item>
              <tab-item>历史</tab-item>
              <tab-item>体育</tab-item>
              <tab-item>汽车</tab-item>
              <tab-item>财经</tab-item>
              <tab-item>军事</tab-item>
            </tab>
          </div>
        </sc>

        <scroller
          class="my-scroller"
          :on-refresh="refresh"
          :on-infinite="infinite"
          ref="myRef"
        >
          <!-- 轮播图 -->
          <swiper
            :list="swiperlist"
            v-model="swiperIndex"
            :loop="true"
            :auto="true"
            :interval=1000
          >
          </swiper>

          <!-- 跑马灯效果 -->
          <marquee
            class="my-marquee"
          >
            <marquee-item v-for="(list,index) in marrqueeList">{{list.title}}</marquee-item>
          </marquee>

          <!-- 新闻图文列表 -->
          <panel
            :list="dataList"
          ></panel>

          <panel
            :list="moreDataList"
          ></panel>

        </scroller>


        <!-- 底部内容 -->
        <tabbar slot='bottom'>
          <tabbar-item>
            <img src="./assets/icon_nav_article.png" alt="" slot="icon">
            <span slot="label">首页</span>
          </tabbar-item>
          <tabbar-item>
            <img src="./assets/icon_nav_cell.png" alt="" slot="icon">
            <span slot="label">视频</span>
          </tabbar-item>
          <tabbar-item>
            <img src="./assets/icon_nav_msg.png" alt="" slot="icon">
            <span slot="label">推荐</span>
          </tabbar-item>
          <tabbar-item>
            <img src="./assets/icon_nav_button.png" alt="" slot="icon">
            <span slot="label">我的</span>
          </tabbar-item>
        </tabbar>
    </view-box>

    <router-view></router-view>
  </div>
</template>

<script>
import { ViewBox, XHeader, Tabbar, TabbarItem, Tab, TabItem, Scroller as sc, Swiper,Marquee, MarqueeItem, Panel } from 'vux'

var refreshKey = ['A', 'B01', 'B02', 'B03', 'B04', 'B05', 'B06', 'B07', 'B08', 'B09', 'B010'];
var key = 0;
var start = 0;
var end = start + 9; //数据递增

var keyValue = 'A';

var initLoaded = false;//初始化数据时，是否加载完成

function getRefreshKey(){
  key++;
  if(key === refreshKey.length-1){
    key = 0;
  }
  keyValue = refreshKey[key];
}

export default {
  name: 'app',
  components: {
    ViewBox,
    XHeader,
    Tabbar,
    TabbarItem,
    Tab,
    TabItem,
    sc,
    Swiper,
    Marquee,
    MarqueeItem,
    Panel
  },// 为防止vue-scroller和scroller重名，将Scroller起了个别名：sc
  created(){  //组件加载成功后需要执行的函数
    // 第三步：从网址http://3g.163.com/touch/jsonp/sy/recommend/0-9.html中接入数据，然后通过then()方法把数据提取出来
    this.$jsonp('http://3g.163.com/touch/jsonp/sy/recommend/0-9.html').then(data=>{

      console.log(data);

      // （第三步第1分步：先过滤需要的轮播图数据）
      // 找到data下的focus并循环找到想要的数据,赋值给swiperlist
      // map() 方法返回一个新数组,数组中的元素为原始数组元素调用函数处理后的值
      this.swiperlist = data.focus.filter(item=>{
        return item.addata === null && item.picInfo[0];
      }).map(item=>{
        return{
          url: item.link,
          img: item.picInfo[0].url,
          title: item.title
        }
      })

      // （第三步第2分步：过滤需要的跑马灯数据）
      this.marrqueeList = data.live.filter(item=>{
        return item.addata === null && item.picInfo[0];
      }).map(item=>{
        return{
          title: item.title
        }
      })

      // （第三步第3分步：过滤需要的新闻列表数据）
      this.dataList = data.list.filter(item=>{
        return item.addata === null && item.picInfo[0];
      }).map(item=>{
        return{
          src: item.picInfo[0].url,
          title: item.title,
          desc: item.digest,
          url: 'item.link'
        }
      })

      initLoaded = true;

    })
  },
  data(){
    // var dataList=[];
    // for(var i=0;i<10;i++){
    //   dataList.push({
    //     src: 'http://placeholder.qiniudn.com/60x60/3cc51f/ffffff',
    //     title: '标题一',
    //     desc: '由各种物质组成的巨型球状天体，叫做星球。星球有一定的形状，有自己的运行轨道。',
    //     url: '/component/cell'
    //   })
    // }
    return{
      swiperlist: [],  //轮播图数据
      swiperIndex: 0,  //用来控制，使最开始进入网页后显示为第一章图片
      marrqueeList: [],
      dataList: [],
      moreDataList: []
    }
  },
  methods: {
    refresh(){
      // console.log(11);
      // 下拉数据加载
      getRefreshKey()
      this.$jsonp('http://3g.163.com/touch/jsonp/sy/recommend/0-9.html',{
        miss: '00',
        refresh: keyValue
      }).then(data=>{
        console.log(data);
        // console.log(this.$refs.myRef);

        // 刷新后得到需要的新闻列表数据
        this.dataList = data.list.filter(item=>{
          return item.addata === null && item.picInfo[0];
        }).map(item=>{
          return{
            src: item.picInfo[0].url,
            title: item.title,
            desc: item.digest,
            url: 'item.link'
          }
        })
        this.$refs.myRef.finishPullToRefresh();
        this.$vux.toast.text(`成功为您推荐${this.dataList.length}条新内容`, 'top');//参考https://vux.li/#/zh-CN/components?id=toast
      })
    },
    infinite(){
      if(!initLoaded){
        this.$refs.myRef.finishInfinite();
        return;
      }

      console.log(22);

      this.$jsonp('http://3g.163.com/touch/jsonp/sy/recommend/${start}-${end}.html',{
        miss: '00',
        refresh: keyValue
      }).then(data=>{

        // 上拉加载更多
        setTimeout(()=>{
          var dataList = data.list.filter(item=>{
            return item.addata === null && item.picInfo[0];
          }).map(item=>{
            return{
              src: item.picInfo[0].url,
              title: item.title,
              desc: item.digest,
              url: 'item.link'
            }
          })

          this.moreDataList = this.moreDataList.concat(dataList)

          start += 10;
          end = start + 9;
          this.$refs.myRef.finishInfinite();
        },1000)
      })
    }
  }
}
</script>

<style lang='less'>
  @import '~vux/src/styles/reset.less';
  html,body{
    margin: 0;
    width:100%;
    height: 100%;
    overflow: hidden;
  }
  #app{
    height: 100%;

    .header{
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      z-index: 999;
    }
    .vux-header-back, .left-arrow{
      display: none;
    }
    .tab{
      margin-top: 46px;
      width: 1200px;
    }
    .my-scroller{
      top: 90px; /*防止覆盖顶部内容*/
    }
    .loading-layer{
      padding-bottom: 90px;
    }
    .my-marquee{
      margin: 10px 0 10px 0;
    }
    .weui-media-box__hd, .weui-media-box__hd img {
      width: 120px;
      height: 78px;
    }
    .weui-media-box__bd{
      height: 78px;
    }
    .weui-media-box__desc{
      font-size: 100%;
      font-family: '楷体'
    }
  }
</style>
