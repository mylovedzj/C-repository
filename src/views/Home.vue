<template>
	<van-grid clickable :gutter="2" :column-num="3" class=".exp1">
		<van-grid-item icon="calendar-o" :to="url.txUrl" text="填写计划" />
		<van-grid-item icon="contact" :to="url.mytjUrl" text="我提交的" />
		<van-grid-item icon="orders-o" :to="url.myshUrl" text="我审批的" />
		<van-grid-item icon="orders-o" v-if="url.isAdmin" :to="url.listUrl" text="全部" />
		<van-grid-item icon="ecard-pay"  v-if="url.Secondaryadmini"  @click="tz" text="数据导出" />
		<van-grid-item icon="exchange"  v-if="url.isAdmin"  @click="tz1" text="审批移交" />
		<van-grid-item icon="share-o"  v-if="num"  @click="toShare" text="分享内容" />
	</van-grid>
</template>

<script>
import { Grid, GridItem } from "vant";
import { defineAsyncComponent, onMounted, reactive } from "vue";
//引入router
import { useRouter, useRoute } from "vue-router";
import $function from "@/utils/function.ts";
import $axios from "@/utils/axios.js";
import $vant from "@/utils/vant.ts";
export default {
	name: "Home",
	components: {
		[Grid.name]: Grid,
		[GridItem.name]: GridItem,
	},
	data(){
		return{
			num:0,
			userinfo:{},
		}
	},
	setup() {
		const route = useRoute(); // 必须在setup的根作用域调用，在函数中调返回undefined
		const router = useRouter();
		let dkxh = route.params.dkxh;
		//console.log(dkxh);
		$function.setSessionStorage("isShowList", true);
		$function.setSessionStorage("dkxh", dkxh);

		let adminList = ["K012", "J601", "4914", "8557"];
		let	qxdj=["K012", "J601", "4914", "8557","0088","4165","6730","E757","L640","A145","D138","0587","L227","8200","4009","K208","5548","A666","8584"];
		const url = reactive({
			txUrl: "/plan/" + dkxh + "/0/0/n",
			mytjUrl: "/me/apply",
			myshUrl: "/me/approve",
			listUrl: "/allList",
			//dcExcelUrl:"/dcExcel/"+dkxh,
			isAdmin: false,
			Secondaryadmini:false,
		});
		const getUserInfo = () => {
			$axios({
				url: "/common/getUserInfo",
				method: "get",
				data: {
					dkxh: dkxh,
				},
				success(data) {
						if(data.code==8000){
							$function.setSessionStorage("userInfo", JSON.stringify(data.data));
							
						if (adminList.indexOf(dkxh) >= 0) {
							url.isAdmin = true;
						}if(qxdj.indexOf(dkxh)>=0){
							//console.log(dkxh);
							url.Secondaryadmini=true;
						}
					 }
				},
			});
		};
	onMounted(() => {
			getUserInfo();
		});
		return {
			isShowList: true,
			dkxh: dkxh,
			url,
		};
	},
	mounted(){
			//this.qxkz;
			this.getShareList();
	},
	methods:{
		tz(){
			//alert(111);
			this.$router.push("/downExcel/"+this.dkxh);
		},
		tz1(){
			//alert(111);
			this.$router.push("/shupdate");
		},
		getShareList(){
			let _this = this;
			let name =JSON.parse($function.getSessionStorage('userInfo')).xm;
			name = name.trim();
			//console.log(name);
			 $axios({
				url: "/weekplan/dingweekplan/findByName",
				method: "get",
				data: {
					name:name,
				},
				success(data) {
					if(data.code==8000){
                        _this.num = data.i;
					}
				},
			});
		},
		toShare(){
            this.$router.push({path:'/share'}); 
		},
	}
};
</script>
<style lang="less" scoped>
.exp1{
	font-size: 18px;
}
</style>