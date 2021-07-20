<template>
	<van-nav-bar left-text="返回" title="我审批的" @click-left="navLeftClick" />

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
	<van-swipe-cell>
			
			<div>
				<van-row>
					<van-col style="background-color: #ffffff" span="24"
						><h3>第{{ state.selectWeek>0?state.selectWeek:week }}周工作计划填写情况</h3></van-col
					>
				</van-row>
				<van-row>
					<van-col span="8">
						<van-cell :title="tj.ytrs" label="应填人数" />
					</van-col>
					<van-col span="8">
						<van-cell :title="tj.yjtx" label="已填写人数" />
					</van-col>
					<van-col span="8">
						<van-cell :title="tj.wtx" label="未填写人数" />
					</van-col>
				</van-row>
			</div>
			
	</van-swipe-cell>
	<van-divider>已反馈</van-divider>
	<tian-list @myRef="pageList.ref" :url="pageList.url" :data="pageList.data" @change="pageList.change">
		<!--一定要设置无数据的时候,占位用的dom,否则可能出错-->
		<template v-if="null == pageList.list || 0 >= pageList.list.length">
			<van-empty image="search" description="无数据" />
		</template>
		<template v-else>
			<template v-for="item in pageList.list" :key="item.id">
				<van-cell
					is-link
					:title="item.dingWeekplan.xm + '的第' + item.dingWeekplan.week + '周周计划'"
					:label="item.dingWeekplan.status == 0 ? '未审核' : '已审核'"
					:to="'/plan/' + item.dingWeekplan.dkxh + '/1/' + item.dingWeekplan.id + '/n'"
				/>
			</template>
		</template>
	</tian-list>
	<template v-if="week == state.selectWeek && year == state.selectYear">
		<van-divider>未反馈</van-divider>
		<van-cell-group v-for="(xm, index) in onSubmit.list" :key="index" v-show="onSubmit.list.length > 0">
			<van-cell :title="xm" is-link @click="remind(xm)" value="提醒" />
		</van-cell-group>
	</template>
	<template v-else>
		<van-divider>未反馈</van-divider>
		<van-cell-group v-for="(xm, index) in onSubmit.list" :key="index" v-show="onSubmit.list.length > 0">
			<van-cell :title="xm" value="未反馈（无法填写）" />
		</van-cell-group>
	</template>
</template>

<script>
import { NavBar, Cell, Empty, Cascader, Field, Popup, Divider, CellGroup,SwipeCell,Button,Switch,Col,Row } from "vant";
import { ref, reactive, defineAsyncComponent, onMounted } from "vue";
import { useRouter } from "vue-router";
import $function from "@/utils/function.ts";
import $axios from "@/utils/axios.js";
import moment from "moment";
import $vant from "@/utils/vant.ts";

export default {
	name: "Me",
	components: {
		[NavBar.name]: NavBar,
		[Cell.name]: Cell,
		[Empty.name]: Empty,
		[Cascader.name]: Cascader,
		[Field.name]: Field,
		[Popup.name]: Popup,
		[Divider.name]: Divider,
		[CellGroup.name]: CellGroup,[SwipeCell.name]: SwipeCell,[Button.name]: Button,
		[Switch.name]: Switch,
		[Col.name]: Col,
		[Row.name]: Row,
		"tian-list": defineAsyncComponent(() => import("@/components/list/PageList.vue")),
	},
	setup() {
		const userInfo = JSON.parse($function.getSessionStorage("userInfo"));
		const state = reactive({
			show: false,
			fieldValue: "",
			cascaderValue: "",
			selectYear: 0,
			selectWeek: 0,
		});
		const week = moment().week();
		const year = moment().year();

		const onSubmit = reactive({
			list: [],
		});
		//类似于vue2  $refs['ref']
		let $pageListRef = null;
		//pageList
		const pageList = reactive({
			ref: (ref) => {
				$pageListRef = ref;
			},
			url: "/weekplan/dingweekplan/getMyApprove",
			//请求参数
			data: {
				chuliUsername: userInfo.xm,
				year: 0,
				week: 0,
			},
			//显示的list
			list: [],
			//子组件改变时触发
			change: (data) => {
				// console.log(data[1])
				pageList.list = data;
			},
		});
		const tj = reactive({
			ytrs:0,
			yjtx:0,
			wtx:0
		})
		const onFinish = ({ selectedOptions }) => {
			state.show = false;

			state.fieldValue = selectedOptions.map((option) => option.text).join("-");
			state.selectYear = selectedOptions[0].value;
			state.selectWeek = selectedOptions[1].value;
			pageList.data["year"] = selectedOptions[0].value;
			pageList.data["week"] = selectedOptions[1].value;
			$pageListRef.resetDataRequest();
			getAllNoSubmit();
			getStatistics(state.selectWeek)
		};

		const getAllNoSubmit = () => {
			$axios({
				url: "/weekplan/dingweekplan/getAllNoSubmit",
				method: "get",
				data: {
					chuliUsername: userInfo.xm,
					year: state.selectYear,
					week: state.selectWeek,
				},
				success(data) {
					onSubmit.list = data.data;
				},
			});
		};

		const getStatistics =(week)=> {
			$axios({
				url: "/weekplan/dingweekplan/getStatistics",
				method: "get",
				data: {
					appName: userInfo.xm,
					week: week,
				},
				success(data) {
					tj.ytrs = data.tj.ytrs;
					tj.yjtx = data.tj.yjtx;
					tj.wtx = data.tj.wtx;
				},
			});
		};
		onMounted(() => {
			// getAllNoSubmit();
			getStatistics(week);
		});

		const remind = (xm) => {
			$axios({
				url: "/weekplan/dingweekplan/remind",
				method: "get",
				data: {
					year: year,
					week: week,
					xm: xm,
				},
				success(data) {
					$vant.successMsg("已成功提醒" + xm);
				},
			});
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
			onSubmit,
			remind,
			week,
			year,
			tj
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
