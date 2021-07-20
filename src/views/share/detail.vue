<template>
    <div>
         <table>
            <tr>
              <td >项目</td>
              <td >目标</td>	
			  <td v-if="weekPlan.status>=2" >完成</td>
            
            </tr>
			<tr v-for="(gjzb, index) in gjzbs" :key="index">
					<td >{{gjzb.jtxm.nr}}</td>
					<td >{{gjzb.gzmb.nr}}</td>
					<td v-if="weekPlan.status>=2" >{{gjzb.wcqk.nr}}</td>
			</tr> 	
          </table>
    </div>
</template>
<script>
import $axios from "@/utils/axios.js";
export default {
    data(){
        return {
           weekPlan:{},
           gjzbs:[],
        }
    },
    created(){
        let id = this.$route.query.id;
         
        this.detailInfo(id);
    },
    methods:{
       detailInfo(id){
           let _this = this;
            $axios({
               url:'/weekplan/dingweekplan/findById',
               methods:'get',
               data:{id:id},
               success(data){
                  console.log(data);
                 _this.gjzbs= JSON.parse(data.weekPlan.gjzbs);
                 // console.log(_this.gjzbs);
               }
           })
       },
    },
}
</script>
<style>
table{
	background:#ffffff;
	border-collapse: collapse;
	margin-bottom: 0.2rem;
	width: 100%;
	border-left: 1px solid #ebedf0;
	border-right:  1px solid #ebedf0;
}
 table tr th,table tr td{
	border:1px solid #ebedf0;
	font-size: 0.8em;
	text-align: left;
	padding: 0.15rem 0.4rem;
	line-height: 0.45rem;
}
</style>