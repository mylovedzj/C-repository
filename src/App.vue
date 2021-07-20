<template>
	<!-- <router-view v-slot="{ Component }">
		<keep-alive>
			<component :is="Component" v-if="$route.meta.keepAlive" />
		</keep-alive>
		<component :is="Component" v-if="!$route.meta.keepAlive" />
	</router-view> -->
	<router-view />
</template>

<script>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import $axios from "@/utils/axios.js";
import * as dd from "dingtalk-jsapi";
import $vant from "@/utils/vant.ts";
import $function from "@/utils/function.ts";
export default {
	setup() {
		$function.setLocationStorage("token", "v0.9.04261555");
		const router = useRouter();
		const ddjq = function () {
			if (dd.version) {
				let _dd = dd;
				$axios({
					url: "/common/getConfig",
					method: "get",
					data: {
						url: import.meta.env.VITE_APP_DZ,
					},
					success(data) {
						data = JSON.parse(data.config);
						_dd.ready(
							function () {
								_dd.config({
									appId: data.agentId,
									corpId: data.corpId,
									timeStamp: data.timeStamp,
									nonceStr: data.nonceStr,
									signature: data.signature,
									jsApiList: [
										 "runtime.info",
										 "biz.contact.complexPicker", 
										 "biz.contact.departmentsPicker"],
								});
							}.bind(this)
						);
					},
				});
			} else {
				//$vant.errorMsg("请在钉钉中打开本页面");
				//router.push("/404/cw.vue");
			}
		};
		onMounted(() => {
			ddjq();
		});
	},
};
</script>

<style lang="less">
body {
	background-color: #f5f5f5;
}

#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	color: #2c3e50;
	font-size: 16px;
}
</style>
