<template>
	<div   >
		<template v-if="fx == undefined || (fx == 'n' && status == 0)">
			<van-nav-bar    left-text="返回" :title="userInfo.xm + '的' + weekPlan.week + '周计划'" @click-left="navLeftClick" />
		</template>

		<template v-else>
			<van-cell
				v-if="fx != 'y'"
				is-link
				:title="userInfo.xm + '的' + weekPlan.week + '周计划'"
				value="所有"
				:to="'/me/apply'"
			/>
			<van-cell v-else :title="userInfo.xm + '的' + weekPlan.week + '周计划'" value="所有" />
		</template>

		<txPage v-if="status == undefined || status == 0" :weekPlan="weekPlan" :isReadonly2="true"> </txPage>

		<shPage v-else :weekPlan="weekPlan" :fx="fx"></shPage>

		<van-divider />

		<van-cell
		class="exp1"
			:is-link="status == 0"
			v-if="status == 0 && fx != 'y'"
			title="选择分享人"
			:value="weekPlan.fxrNames"
			@click="selectFxr"
		/>
		<van-cell v-else-if="status == 0 && fx == 'y'" title="已分享：" :value="weekPlan.fxrNames" />
		<van-divider />
		<van-collapse v-model="lstWeekActiveNames" v-if="fx != 'y'">
			<van-collapse-item :name="1" :title="'第' + (weekPlan.week - 1) + '周工作计划'">
				<template #value>
					<van-row>
					<!--	<van-col span="8">{{
							lastWeekPlan == null ? "" : lastWeekPlan.status == 99 ? "已审核" : "未审核"
						}}</van-col>-->
						<van-col span="8" v-if="lastWeekPlan == null">{{
							""
						}}</van-col>
						<van-col span="8" v-else-if="lastWeekPlan == null ? '' : lastWeekPlan.status == 99 ">{{
							"已评价"
						}}</van-col>
						<van-col span="8" v-else style="color:red">{{
							"未评价"
						}}</van-col>
						<!--<van-col span="8">{{
							lastWeekPlan == null ? "无数据" : lastWeekPlan.status >= 2 ? "已反馈" : "未反馈"
						}}</van-col>-->
						<van-col span="8" v-if="lastWeekPlan == null" >{{
							"无数据"
						}}</van-col>
						<van-col span="8" v-else-if="lastWeekPlan == null ? '无数据' : lastWeekPlan.status >= 2 ">{{
							"已反馈"
						}}</van-col>
						<van-col span="8" v-else style="color:red">{{
							"未反馈"
						}}</van-col>
						<!--<van-col span="8">{{ lastWeekPlan == null ? "" : lastWeekPlan.isRead == "y" ? "已读" : "未读" }} </van-col>-->
						<van-col 
						 span="8" v-if="lastWeekPlan == null " >{{ "" }} </van-col>
						<van-col 
						 span="8" v-else-if="lastWeekPlan == null ? '' : lastWeekPlan.isRead == 'y'" >{{ "已读" }} </van-col>
						<van-col span="8" v-else style="color:red">{{ "未读" }} </van-col>
					</van-row>
					
					
				</template>
				<template #right-icon>
					<van-icon name="arrow" v-if="lastWeekPlan == null ? true : lastWeekPlan.isRead == 'y'" />
					<van-icon name="arrow" v-else dot />
				</template>

				<txPage v-if="(lastWeekPlan != null && lastWeekPlan.status < 2 )|| status==0" :weekPlan="lastWeekPlan"> </txPage>
				<shPage v-else :weekPlan="lastWeekPlan" :fx="fx"></shPage>
				<van-empty v-if="lastWeekPlan == null" image="search" description="无数据" />
			</van-collapse-item>
		</van-collapse>
		<van-divider />
		<van-row v-if="fx == undefined || (fx == 'n' && status == 0)">
			<van-col span="8"><van-button type="warning" icon="label-o" block @click="share()">分享</van-button></van-col>
			<van-col span="8"
				>
				<van-button type="success" icon="label-o" block @click="save('bc')" :disabled="batDis"
					>保存</van-button
				></van-col
			>
			<van-col span="8"
				><van-button type="primary" icon="share" block @click="save('tj')" :disabled="batDis1">提交</van-button></van-col
			>
		</van-row>
		<van-row v-else>
			
		<!--	<van-col span="12"
				><van-button type="warning" icon="bullhorn-o" block @click="reject()" v-show="fx != 'y'|| weekPlan.status <2"
					>驳回</van-button
				></van-col
			>
			<van-col span="12"
				><van-button type="success" icon="bullhorn-o" block @click="save('tz')" v-show="fx != 'y'"
					>审核</van-button
				></van-col
			>--><van-col span="12"
				><van-button type="warning" icon="bullhorn-o" block @click="reject()" v-show="weekPlan.status <2 "
					>驳回</van-button
				></van-col
			>
			<van-col span="12"
				><van-button type="success" icon="bullhorn-o" block @click="save('tz')" v-show="weekPlan.status <2"
					>审核</van-button
				></van-col
			>
			
		</van-row>
		<!-- <van-notice-bar
			v-if="fx == undefined"
			mode="closeable"
			left-icon="volume-o"
			text="写作对象：各级负责人、营销/服务岗位员工。"
		/>
		<van-notice-bar
			v-if="fx == undefined"
			mode="closeable"
			left-icon="volume-o"
			text="流程：员工每周一填写具体项目及工作目标→上级审核→员工下周一提交完成情况及改进措施、补充临时工作→上级评价→员工确认。"
		/> -->
		<van-steps :active="weekPlan.status" :direction="isMobile ? 'vertical' : 'horizontal'" >
			<van-step v-if="weekPlan.writeDate" >填写时间:
				  <p style="margin:5px 0 0;">{{ weekPlan.writeDate }}</p>
			</van-step>
			<van-step v-else>填写
			</van-step>
			<van-step v-if="weekPlan.shDate">{{ sprInfo.pzrXm }}审核时间:
					 <p style="margin:5px 0 0;">{{ weekPlan.shDate }}</p>
			</van-step>
			<van-step v-else>{{ sprInfo.pzrXm }}审核</van-step>

			<van-step v-if="weekPlan.fkDate">反馈时间:
				<p style="margin:5px 0 0;">{{weekPlan.fkDate}}</p>
			</van-step>
			<van-step v-else>反馈</van-step>

			<van-step v-if="weekPlan.spDate">{{ sprInfo.pzrXm }}评价时间:
				<p style="margin:5px 0 0;">
				 {{ weekPlan.spDate }}
				</p>
			</van-step>
			<van-step v-else>{{ sprInfo.pzrXm }}评价</van-step>
		</van-steps>

		<van-row v-if="fx == 'db'">
			<van-col span="10"
				><van-button type="warning" icon="arrow-up" size="small" @click="getOaUrl('last')">上一条</van-button></van-col
			>
			<van-col span="4"></van-col>
			<van-col span="10"
				><van-button type="warning" icon="arrow-down" size="small" @click="getOaUrl('next')"
					>下一条</van-button
				></van-col
			>
		</van-row>
		<van-dialog
			v-model:show="show"
			title="标题"
			show-cancel-button
			@confirm="confirm_bh()"
		>
			<van-field v-model="bh" rows="2" autosize label="改进措施" placeholder="请输入改进措施" type="textarea" />
		</van-dialog>
	</div>
</template>

<script>
import {
	Tab,
	Tabs,
	Cell,
	CellGroup,
	Divider,
	Stepper,
	Field,
	SubmitBar,
	Grid,
	GridItem,
	Picker,
	Popup,
	Toast,
	Collapse,
	CollapseItem,
	Icon,
	Button,
	Switch,
	Col,
	Row,
	SwipeCell,
	NoticeBar,
	NavBar,
	Step,
	Steps,
	Empty,
	Dialog,
} from "vant";
import moment from "moment";
//引入封装的axios
import $axios from "@/utils/axios.js";
//引入vant封装方法
import $vant from "@/utils/vant.ts";
import $function from "@/utils/function.ts";

import { useRouter } from "vue-router";
import { ref, reactive, defineAsyncComponent, onMounted } from "vue";
import * as dd from "dingtalk-jsapi";
export default {
	name: "plan",
	components: {
		[Tab.name]: Tab,
		[Tabs.name]: Tabs,
		[Cell.name]: Cell,
		[CellGroup.name]: CellGroup,
		[Divider.name]: Divider,
		[Stepper.name]: Stepper,
		[Field.name]: Field,
		[SubmitBar.name]: SubmitBar,
		[Grid.name]: Grid,
		[GridItem.name]: GridItem,
		[Picker.name]: Picker,
		[Popup.name]: Popup,
		[Toast.name]: Toast,
		[Collapse.name]: Collapse,
		[CollapseItem.name]: CollapseItem,
		[Icon.name]: Icon,
		[Button.name]: Button,
		[Switch.name]: Switch,
		[Col.name]: Col,
		[Row.name]: Row,
		[SwipeCell.name]: SwipeCell,
		[NoticeBar.name]: NoticeBar,
		[NavBar.name]: NavBar,
		[Step.name]: Step,
		[Steps.name]: Steps,
		[Empty.name]: Empty,
		[Dialog.Component.name]: Dialog.Component,
		txPage: defineAsyncComponent(() => import("@/components/txPage.vue")),
		shPage: defineAsyncComponent(() => import("@/components/shPage.vue")),
	},
	setup() {
		const $router = useRouter();
		const navLeftClick = () => {
			$router.go(-1);
		};
		const show = ref(false);
		return {
			navLeftClick,
			show,
		};
	},
	data() {
		return {
			userInfo: {},
			id:"",
			weekPlan: {
				xm: "",
				bm: "",
				gw: "",
				dkxh: "",
				status: 0,
				week: moment().week(), // 数字
				startDate: moment().weekday(1).format("YYYY-MM-DD"),
				endDate: moment().weekday(7).format("YYYY-MM-DD"),
				gjzbList: [
					{
						jtxm: { nr: "" },
						gzmb: { nr: "" },
						wcqk: { nr: "" },
						gjcs: { nr: "" },
						sjqr: { isDone: "未完成" },
					},
				],
				gjzbs: "",
				zdgzs: "",
				lsgzList: [],
				lsgzs: "",
				sjpj: "",
				assess: "",
				fxrNames: "",
				fxrIds: [],
				isRead: "n",
				appName: "",
			},
			lastWeekPlan: null,
			active: "",
			start: 1,
			cebc:"",
			gjzbActiveNames: [1],
			zdgzActiveNames: [1],
			lsgzActiveNames: [1],
			ldspActiveNames: [],
			lstWeekActiveNames: [],
			isShowLastWeek: false,
			status: 0,
			fx: "",
			isReadonly: false,
			isReadonly2: false,
			batDis: false,
			batDis1: false,
			weekDay: moment().weekday(),
			sj:moment().hours(),
			isMobile: true,
			tj: {
				ytrs: 0,
				yjtx: 0,
				wtx: 0,
			},
			showWeek: moment().week(),
			isAdmin: false,
			sprInfo: {},
			sprList: [{ rq: "" }, { rq: "" }],
			bh: "",
			//bmList: ["A513611", "A52", "A6537", "A6507"],
		};
	},

	created() {
		this.isMobile = $function._isMobile();
		this.userInfo.dkxh = this.$route.params.dkxh;
		//alert(this.userInfo.dkxh)
		this.status = this.$route.params.status;
		// this.status = 1;
		this.weekPlan.id = this.$route.params.id;
		this.fx = this.$route.params.fx;
		if (this.fx === "y") {
			this.isReadonly = true;
			this.isReadonly2 = true;
		}
		if (this.status == 2) {
			this.batDis = true;
		}
	},
	mounted() {
		if (this.weekDay == 6) {
			this.weekPlan.week += 1;
			this.showWeek += 1;
			this.weekPlan.startDate = moment().week(this.weekPlan.week).weekday(1).format("YYYY-MM-DD");
			this.weekPlan.endDate = moment().week(this.weekPlan.week).weekday(7).format("YYYY-MM-DD");
		}

		this.getUserInfo();
		this.getPlanInfo();
		// this.timer = setInterval(this.get, 10000);
		 this.id = this.$route.params.id;

	},
	beforeDestroy() {
      clearInterval(this.timer);
    },
	methods: {
		get(){
			if(this.id==0){
			localStorage.setItem('weekPlan',JSON.stringify(this.weekPlan))
				console.log(this.weekPlan);
			}else{
				console.log("别的页面");
			}
			

		},
		getUserInfo() {
			 let letUserInfo = JSON.parse($function.getSessionStorage("userInfo"));
			 if(letUserInfo != null){
				 this.userInfo = letUserInfo
				this.weekPlan.xm = this.userInfo.xm;
				this.weekPlan.dkxh = this.userInfo.dkxh;
				this.weekPlan.gw = this.userInfo.zwmc;
				this.weekPlan.bm = this.userInfo.bmmc;
			 }
			// this.userInfo.dkxh = this.$route.params.dkxh;
		},
		getSprList() {
			var _this = this;
			$axios({
				url: "/common/dingprocess/list",
				method: "get",
				data: {
					dkxh: this.userInfo.dkxh,
					type: "weekPlan",
					id: this.weekPlan.id,
				},
				success(data) {
					_this.sprList = data.dingProcess.records;
					if (_this.sprList.length > 0) {
						_this.sprList.forEach((a) => {
							if (a.nodeNum === 1) {
								_this.sprInfo.pzrXm = a.chuliUsername;
							}
						});
					}
				},
			});
		},
		getSprInfo() {
			var _this = this;
			$axios({
				url: "/common/getSprInfo",
				method: "get",
				data: {
					dkxh: this.userInfo.dkxh,
					fl: "wc",
				},
				success(data) {
					_this.sprInfo = data.spr;
				},
			});
		},
		getPlanInfo() {
			if (!$function.isBlank(this.weekPlan.id)) {
				if (this.weekPlan.id <= 0) {
					this.getPlanInfoByWeek();
					return;
				}
				if (this.status > 0) {
					this.updateRead();
				}
				this.getSprList();
				var _this = this;
				$axios({
					url: "/weekplan/dingweekplan/info/" + this.weekPlan.id,
					method: "get",
					success(data) {
						_this.weekPlan = data.data;
						_this.weekPlan.gjzbList = JSON.parse(_this.weekPlan.gjzbs);
						_this.weekPlan.lsgzList = JSON.parse(_this.weekPlan.lsgzs);
						_this.weekPlan.fxrIds = JSON.parse(_this.weekPlan.fxrIds);
						_this.userInfo.xm = _this.weekPlan.xm;
						_this.userInfo.dkxh = _this.weekPlan.dkxh;
						_this.userInfo.zwmc = _this.weekPlan.gw;
						_this.userInfo.bmmc = _this.weekPlan.bm;
						$function.setSessionStorage("dkxh", _this.weekPlan.dkxh);
						$function.setSessionStorage("xm", _this.userInfo.xm);
						if (_this.weekPlan.status == 99) {
							$vant.errorMsg("此计划已被审核，无法重复审核！", 5000);
							_this.batDis = true;
						}
						_this.getLastWeekPlan();
						if (_this.status == 1) {
							_this.isReadonly2 = true;
							_this.getStatistics(_this.showWeek);
						}
					},
				});
			} else {
				this.getPlanInfoByWeek();
			}
			// if (this.weekDay < 5 && this.weekPlan.week>=this.showWeek) {
			// 	this.isReadonly2 = true;
			// } else {
			// 	this.isReadonly = true;
			// }
		},
		getPlanInfoByWeek() {
			console.log(this.showWeek); 
			var _this = this;
			$axios({
				url: "/weekplan/dingweekplan/getInfoByWeek",
				method: "get",
				data: {
					dkxh: _this.userInfo.dkxh,
					week: _this.showWeek,
				},
				success(data) {
					if (data.data != null) {
						//alert(222);
						_this.weekPlan = data.data;
						_this.weekPlan.gjzbList = JSON.parse(_this.weekPlan.gjzbs);
						_this.weekPlan.lsgzList = JSON.parse(_this.weekPlan.lsgzs);
						_this.weekPlan.fxrIds = JSON.parse(_this.weekPlan.fxrIds);
						_this.userInfo.xm = _this.weekPlan.xm;
						_this.userInfo.dkxh = _this.weekPlan.dkxh;
						_this.userInfo.zwmc = _this.weekPlan.gw;
						_this.userInfo.bmmc = _this.weekPlan.bm;
						$function.setSessionStorage("dkxh", _this.weekPlan.dkxh);
						$function.setSessionStorage("xm", _this.userInfo.xm);
						if (_this.weekPlan.status >= 0) {
							$vant.successMsg("本周计划已填写");
						}
						
						if (_this.weekPlan.status >= 1) {
							$vant.successMsg("本周计划领导已审核无法进行修改");
							_this.batDis = true;
						}
					}else{
						//localStorage.setItem('weekPlan',JSON.stringify(this.weekPlan))
						//alert(111);
						if((_this.weekDay==3&&_this.sj>=15)||_this.weekDay>3){
				 	 	$vant.errorMsg("已超过规定提交时间，无法填写",4000);
	           			_this.batDis1=true;
						   }

						var plan=JSON.parse(localStorage.getItem("weekPlan"))
					
						
					//	console.log(plan);
						if(null==plan){
							//console.log(222);
						//localStorage.setItem('weekPlan',JSON.stringify(this.weekPlan))	;
						//this.weekPlan=JSON.parse(localStorage.getItem("weekPlan"));
						}else{
						//console.log(plan.week)
						//console.log(_this.week)
						if(plan.week<_this.showWeek||plan.xm!=_this.userInfo.xm){
							//alert(333);
							//console.log(111)
							localStorage.removeItem('weekPlan')
						//localStorage.clear();
						}else{
							//console.log(333);
					_this.weekPlan=plan;
						}
						}
							
					}
					_this.getSprInfo();
					_this.getLastWeekPlan();
				},
			});
			// if (this.weekDay < 5 && this.weekPlan.week>=this.showWeek) {
			// 	this.isReadonly2 = true;
			// } else {
			// 	this.isReadonly = true;
			// }
		},
		getLastWeekPlan() {
			if (this.weekPlan.week > 1) {
				var _this = this;
				$axios({
					url: "/weekplan/dingweekplan/getInfoByWeek",
					method: "get",
					data: {
						dkxh: _this.userInfo.dkxh,
						week: _this.weekPlan.week - 1,
					},
					success(data) {
						if (data.data != null) {
							_this.lastWeekPlan = data.data;
							_this.lastWeekPlan.gjzbList = JSON.parse(_this.lastWeekPlan.gjzbs);
							_this.lastWeekPlan.lsgzList = JSON.parse(_this.lastWeekPlan.lsgzs);
							_this.lastWeekPlan.fxrIds = JSON.parse(_this.lastWeekPlan.fxrIds);
						}
					},
				});
			}
		},
		save(type) {
			var isSave = false;
			var isLastSave = false;
			let weekNum = 0;
			let lastWeekNum = 0;
			this.weekPlan.gjzbList.forEach((gjzb, i) => {
				if ($function.isBlank(gjzb.jtxm.nr) || $function.isBlank(gjzb.gzmb.nr)) {
					weekNum = i + 1;
					isSave = true;
				}
			});
			if (this.lastWeekPlan != null) {
				this.lastWeekPlan.gjzbList.forEach((gjzb, i) => {
					if ($function.isBlank(gjzb.wcqk.nr)) {
						lastWeekNum = i + 1;
						isLastSave = true;
					}
				});
			}
			if (isSave) {
				$vant.errorMsg("本周计划工作" + weekNum + "未填写完成！");
				return;
			}
			if (isLastSave && type != "bc") {
				$vant.errorMsg("上周计划工作" + lastWeekNum + "完成情况未填写！");
				return;
			}
		
			this.weekPlan.fxrIds = JSON.stringify(this.weekPlan.fxrIds);
			this.weekPlan.gjzbs = JSON.stringify(this.weekPlan.gjzbList);
			this.weekPlan.lsgzs = JSON.stringify(this.weekPlan.lsgzList);
			this.weekPlan.status = $function.isBlank(this.weekPlan.status) ? this.status : this.weekPlan.status;
			this.weekPlan.type = type;

			if (this.lastWeekPlan != null) {
				this.lastWeekPlan.fxrIds = JSON.stringify(this.lastWeekPlan.fxrIds);
				this.lastWeekPlan.gjzbs = JSON.stringify(this.lastWeekPlan.gjzbList);
				this.lastWeekPlan.lsgzs = JSON.stringify(this.lastWeekPlan.lsgzList);
				if (this.lastWeekPlan.type == null || this.lastWeekPlan.type == "") {
					this.lastWeekPlan.type = "bc";
				}
			}
			if(type=='tj')
			{
				this.batDis1=true;

			}
			
			
		
			
		
			let weekList = [this.lastWeekPlan, this.weekPlan];
			console.log(this.weekPlan);
			var _this = this;
			$axios({
				url: "/weekplan/dingweekplan/save",
				method: "post",
				data: JSON.stringify(weekList),
				contentType: "application/json;charset=UTF-8",
				success(data) {
					_this.weekPlan = data.data[1];
					_this.weekPlan.gjzbList = JSON.parse(_this.weekPlan.gjzbs);
					_this.weekPlan.lsgzList = JSON.parse(_this.weekPlan.lsgzs);
					_this.weekPlan.fxrIds = JSON.parse(_this.weekPlan.fxrIds);
					if (type == "fk") {
						$vant.successMsg("反馈成功！");
						return;
					}
					if (type != "bc") {
						$vant.successMsg("提交成功");
					} else {
						$vant.successMsg("保存成功");
					}
				},
			});
		},
		share() {
			this.weekPlan.fxrIds = JSON.stringify(this.weekPlan.fxrIds);
			this.weekPlan.gjzbs = JSON.stringify(this.weekPlan.gjzbList);
			this.weekPlan.lsgzs = JSON.stringify(this.weekPlan.lsgzList);
			this.weekPlan.status = $function.isBlank(this.weekPlan.status) ? this.status : this.weekPlan.status;
			this.weekPlan.type = "fx";
			let weekList = [this.weekPlan];
			var _this = this;
			$axios({
				url: "/weekplan/dingweekplan/save",
				method: "post",
				data: JSON.stringify(weekList),
				contentType: "application/json;charset=UTF-8",
				success(data) {
					_this.weekPlan = data.data[0];
					_this.weekPlan.gjzbList = JSON.parse(_this.weekPlan.gjzbs);
					_this.weekPlan.lsgzList = JSON.parse(_this.weekPlan.lsgzs);
					_this.weekPlan.fxrIds = JSON.parse(_this.weekPlan.fxrIds);

					$vant.successMsg("分享成功！");
				},
			});
		},
		reject() {
			this.show = true;
		},
		confirm_bh(){
			var _this = this;
			$axios({
				url: "/weekplan/dingweekplan/reject",
				method: "get",
				data: {
					id: _this.weekPlan.id,
					msg: _this.bh,
				},
				success(data) {
					console.log(data)
				},
			});
		},
		selectFxr() {
			let _this = this;
			dd.biz.contact.complexPicker({
				title: "选择员工", //标题
				corpId: "dingd53808c7ab699fd8", //企业的corpId
				multiple: true, //是否多选
				limitTips: "超过可选人数", //超过限定人数返回提示
				maxUsers: 5, //最大可选人数
				pickedUsers: _this.weekPlan.fxrIds, //已选用户
				pickedDepartments: [], //已选部门
				disabledUsers: [], //不可选用户
				disabledDepartments: [], //不可选部门
				requiredUsers: [], //必选用户（不可取消选中状态）
				requiredDepartments: [], //必选部门（不可取消选中状态）
				appId: "", //微应用的Id
				permissionType: "xxx", //可添加权限校验，选人权限，目前只有GLOBAL这个参数
				responseUserOnly: false, //返回人，或者返回人和部门
				startWithDepartmentId: 0, //仅支持0和-1
				onSuccess: function (result) {
					let userJson = "";
					let userIds = [];
					for (let i = 0, len = result.users.length; i < len; i++) {
						userJson += result.users[i].name;
						userIds.push(result.users[i].emplId);
						if (i != len - 1) {
							userJson += ",";
						}
					}

					_this.weekPlan.fxrNames = userJson;
					_this.weekPlan.fxrIds = userIds;
				},
				onFail: function (err) {
					if (err.errorCode < 0) {
						//已取消
						$vant.errorMsg("未选择分享人");
					} else {
						$vant.errorMsg(JSON.stringify(err));
					}
				},
			});
		},
		getOaUrl(type) {
			var partUrl = this.$route.path;
			var _this = this;
			$axios({
				url: "/common/getDingOAUrl",
				method: "get",
				data: {
					xm: _this.weekPlan.appName,
					partUrl: partUrl,
					type: type,
				},
				success(data) {
					if (data.code == 8000) {
					/*	if (response.url.indexOf("/approve/") >= 0) {
							var url = response.url.substring(response.url.indexOf("/approve/"));
							_this.$router.push(url);
							window.location.reload();
						} else {*/
						
							window.location.href = data.url;
						
					} else {
						alert(response.msg);
					}
				},
			});
		},
		updateRead() {
			var _this = this;
			this.weekPlan.isRead = "y";
			$axios({
				url: "/weekplan/dingweekplan/updateRead",
				method: "get",
				data: {
					id: _this.weekPlan.id,
				},
			});
		},
		lastWeek() {
			this.showWeek = this.showWeek - 1;
			this.getStatistics(this.showWeek);
		},
		nextWeek() {
			this.showWeek = this.showWeek + 1;
			this.getStatistics(this.showWeek);
		},
	},
	watch: {
		$route(to, from) {
      location. reload()
      }
    }
	,
};
</script>

<style lang="less" >
.vant-table {
	.table {
		border-radius: 0.185185rem;
		.th {
			height: 1.074074rem;
			line-height: 1.074074rem;
			background-color: #d3d7d4;
			text-align: left;
			border-top-left-radius: 0.185185rem;
			border-top-right-radius: 0.185185rem;
		}
		.list-tr {
			height: 1.074074rem; // line-height: 1.074074rem;
		}
		.list-tr:nth-child(2n) {
			background-color: #f6f5ec;
		}
	}
}
// .van-step--horizontal {
//     line-height: 18px;
// }


.van-step--horizontal .van-step__circle-container {
    padding: 0 !important;
	background: none !important;
}
.van-steps--horizontal .van-steps__items {
    height: 30px !important;
}
.van-step--horizontal .van-step__circle-container {
    top: 40px !important;
}
.van-step--horizontal .van-step__line {
    top: 40px !important;
}
</style>
