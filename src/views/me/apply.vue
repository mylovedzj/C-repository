<template>
	<van-nav-bar left-text="返回" title="已提交的" @click-left="navLeftClick" />

	<van-field
		v-model="state.fieldValue"
		is-link
		readonly
		label="时间"
		placeholder="请选择周计划所在时间"
		@click="state.show = true"
	/>
	<van-popup v-model:show="state.show" round position="bottom">
		<van-cascader
			v-model="state.cascaderValue"
			title="请选择周计划所在时间"
			:options="options"
			@close="state.show = false"
			@finish="onFinish"
		/>
	</van-popup>

	<tian-list @myRef="pageList.ref" :url="pageList.url" :data="pageList.data" @change="pageList.change">
		<!--一定要设置无数据的时候,占位用的dom,否则可能出错-->
		<template v-if="null == pageList.list || 0 >= pageList.list.length">
			<van-empty image="search" description="无数据" />
		</template>
		<template v-else>
			<template v-for="item in pageList.list" :key="item.id">
				<van-cell
					is-link
					:title="'第' + item.week + '周周计划'"
					:label="item.status == 0 ? '上级未审核' : '上级已审核'"
					:to="'/plan/' + item.dkxh + '/0/' + item.id + '/n'"
				/>
			</template>
		</template>
	</tian-list>
</template>

<script>
import { NavBar, Cell, Empty, Cascader, Field, Popup } from "vant";
import { ref, reactive, defineAsyncComponent } from "vue";
import { useRouter } from "vue-router";
import $function from "@/utils/function.ts";
import $axios from "@/utils/axios.js";

export default {
	name: "Me",
	components: {
		[NavBar.name]: NavBar,
		[Cell.name]: Cell,
		[Empty.name]: Empty,
		[Cascader.name]: Cascader,
		[Field.name]: Field,
		[Popup.name]: Popup,
		"tian-list": defineAsyncComponent(() => import("@/components/list/PageList.vue")),
	},
	setup() {
		const state = reactive({
			show: false,
			fieldValue: "",
			cascaderValue: "",
			selectYear: 0,
			selectWeek: 0,
		});
		//类似于vue2  $refs['ref']
		let $pageListRef = null;
		//pageList
		const pageList = reactive({
			ref: (ref) => {
				$pageListRef = ref;
			},
			url: "/weekplan/dingweekplan/list",
			//请求参数
			data: {
				dkxh: $function.getSessionStorage("dkxh"),
				year: 0,
				week: 0,
			},
			//显示的list
			list: [],
			//子组件改变时触发
			change: (data) => {
				pageList.list = data;
			},
		});

		const onFinish = ({ selectedOptions }) => {
			state.show = false;

			state.fieldValue = selectedOptions.map((option) => option.text).join("-");
      pageList.data['year'] = selectedOptions[0].value;
      pageList.data['week'] = selectedOptions[1].value;
      $pageListRef.resetDataRequest();
		};
		const $router = useRouter();
		const navLeftClick = () => {
			$router.go(-1);
		};
		return {
			pageList,
			navLeftClick,
			state,
			onFinish,
		};
	},
	data() {
		return {
			nf: [],
			options: [],
		};
	},
	mounted() {
		this.getAllYearWeek();
	},
	methods: {
		getAllYearWeek() {
			var _this = this;
			$axios({
				url: "/weekplan/dingweekplan/getAllYearWeek",
				method: "get",
				success(data) {
					data.data.nfList.forEach((a) => {
						var children = [];
						data.data[a].forEach((b) => {
							children.push({ text: b + "周", value: b });
						});
						_this.options.push({ text: a + "年", value: a, children: children });
					});
				},
			});
		},
	},
};
</script>
