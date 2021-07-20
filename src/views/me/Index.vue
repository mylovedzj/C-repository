<template>
	<van-nav-bar left-text="返回" title="我的" @click-left="navLeftClick" />
	<van-cell is-link title="我提交的" :to="'/me/apply'" />
	<van-cell is-link title="我审批的" :to="'/me/approve'" />
</template>

<script>
import { defineAsyncComponent } from "vue";
import { NavBar, Cell } from "vant";
import $function from "@/utils/function.ts";
import {useRouter} from 'vue-router';
export default {
	name: "Me",
	components: {
		[NavBar.name]: NavBar,
		[Cell.name]: Cell,
	},
	setup() {
        const $router = useRouter();
		const navLeftClick = () => {
			$router.go(-1);
		};
        return{
            navLeftClick
        }
	},
};
</script>
