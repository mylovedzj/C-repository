<template>
    <div>
       <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad">
            <van-cell is-link arrow-direction="right" 
             v-for="item in shareList" :key="item.id" :title="item.xm" 
             :value="item.week+'周'"
             icon="star-o"
             size="large"
              :to="{ path: 'detail',query:{id:item.id}}"
             />
       </van-list>
    </div>
</template>
<script>
import $axios from "@/utils/axios.js";
import {Collapse,CollapseItem, List ,Cell} from "vant";
import $function from "@/utils/function.ts";
export default {
    data(){
        return {
            shareList:[],
            loading: false,
            finished: false,
        }
    },
    components:{
        [Collapse.name]: Collapse,
		[CollapseItem.name]: CollapseItem,
        [List.name]:List,
        [Cell.name]:Cell,
    },
    created(){
        this.getList();
    },
    methods:{
        getList(){
            let _this = this;
            let name =JSON.parse($function.getSessionStorage('userInfo')).xm;
			name = name.trim();
           $axios({
               url:'/weekplan/dingweekplan/sendfx',
               methods:'get',
               data:{name:name},
               success(data){
                 // console.log(data);
                  _this.shareList= data.list;
               }
           })
        },
       onLoad() {
      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
    //   setTimeout(() => {
    //     for (let i = 0; i < 10; i++) {
    //       this.list.push(this.list.length + 1);
    //     }
    //     // 加载状态结束
    //     this.loading = false;
    //     // 数据全部加载完成
    //     if (this.list.length >= 40) {
    //       this.finished = true;
    //     }
    //   }, 1000);
     },
    }
}
</script>
<style lang="scss" scoped>

</style>