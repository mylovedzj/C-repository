<template>
	<van-divider>第{{ weekPlan.week }}周工作计划({{ weekPlan.startDate }}~{{ weekPlan.endDate }})</van-divider>

	<van-collapse v-model="gjzbActiveNames">
		<van-collapse-item :name="'重点' + (index + 1)" v-for="(gjzb, index) in weekPlan.gjzbList" :key="index" >
			<template #title>
				<div>
					{{
						"工作" +
						(index + 1) +
						(gjzb.jtxm.nr != ""
							? gjzb.jtxm.nr.length >= 10
								? "：" + gjzb.jtxm.nr.substring(0, 10) + "..."
								: "：" + gjzb.jtxm.nr
							: "：空")
					}}
				</div>
			</template>
			<van-field
				v-model="gjzb.jtxm.nr"
				rows="2"
				autosize
				label="具体项目"
				placeholder="请输入具体项目"
				:maxlength="50"
				:readonly="isReadonly"
			 />
			<van-field
				v-model="gjzb.gzmb.nr"
				rows="2"
				autosize
				label="工作目标"
				placeholder="请输入工作目标"
				:readonly="isReadonly"
				:maxlength="50"
			 ><template #right-icon>
					<van-button
						icon="minus"
						round
						color="linear-gradient(to right, #009ad6)"
						type="primary"
						size="mini"
						@click="less('gjzb', index)"
					>
					</van-button> 
					<van-button
					
					icon="plus"
					round
					color="linear-gradient(to right, #009ad6)"
					type="primary"
					size="mini"
					@click="add('gjzb')"
				>
				</van-button
			>
				</template></van-field>
			
			<van-field
				v-model="gjzb.wcqk.nr"
				rows="2"
				autosize
				label="完成情况"
				type="textarea"
				:placeholder="'请输入完成情况'"
				v-show="isfk && !isReadonly2"
			/>
			<van-field
				v-model="gjzb.gjcs.nr"
				rows="2"
				autosize
				label="改进措施"
				type="textarea"
				:placeholder="'请输入改进措施'"
				v-show="isfk && !isReadonly2"
				:maxlength="50"
			/>

			
		</van-collapse-item>

		<van-collapse-item :name="'临时' + (index + 1)" v-for="(lsgz, index) in weekPlan.lsgzList" :key="index">
			<template #title>
				<div>
					{{
						"临时" +
						(index + 1) +
						(lsgz.jtxm.nr != ""
							? lsgz.jtxm.nr.length >= 9
								? "：" + lsgz.jtxm.nr.substring(0, 8) + "..."
								: "：" + lsgz.jtxm.nr
							: "：空")
					}}
				</div>
			</template>
			<van-field
				v-model="lsgz.jtxm.nr"
				rows="1"
				size="small"
				label="具体项目"
				type="textarea"
				:placeholder="'请输入具体项目'"
				
			     />
			<van-field
				v-model="lsgz.gzmb.nr"
				rows="2"
				autosize
				label="工作目标"
				:placeholder="'请输入工作目标'"
				type="textarea"
				:maxlength="50"
			/>
			<van-field
				v-model="lsgz.wcqk.nr"
				rows="2"
				autosize
				label="完成情况"
				:placeholder="'请输入完成情况'"
				type="textarea"
				:maxlength="50"
				v-show="weekPlan.status >= 2"
			/>
			<van-field
				v-model="lsgz.gjcs.nr"
				rows="2"
				autosize
				label="改进措施"
				:placeholder="'请输入改进措施'"
				type="textarea"
				:maxlength="50"
				v-show="weekPlan.status >= 2"
			/>

			<van-cell title="  " v-if="weekPlan.status <= 1">
				<template #right-icon>
					<van-button
						icon="minus"
						round
						color="linear-gradient(to right,#009ad6)"
						type="primary"
						size="small"
						@click="less('lsgz', index)"
					>
					</van-button>
				</template>
			</van-cell>
		</van-collapse-item>
	</van-collapse>

	<!--  -->
	<van-row v-if="weekPlan.status >= 1">
		<van-col span="24" style="padding-left: 31px">
			<van-button
				icon="plus"
				round
				color="linear-gradient(to right, #009ad6)"
				type="primary"
				size="small"
				@click="add('gjzb')"
				>重点/专项工作
			</van-button>
			<van-button
				v-if="weekPlan.status >= 1 && showWeek != weekPlan.week"
				icon="plus"
				round
				color="linear-gradient(to right, #009ad6)"
				type="primary"
				size="small"
				@click="add('lsgz')"
				>临时工作
			</van-button>
		</van-col>
	</van-row>
	<!--<template v-else>
		<van-row>
			<van-col span="12" />
			<van-col span="12" style="text-align: right; padding-right: 20px"
				><van-button
					icon="plus"
					round
					color="linear-gradient(to right, #009ad6)"
					type="primary"
					size="small"
					@click="add('gjzb')"
				>
				</van-button
			></van-col>
		</van-row>
	</template>-->
	<!-- <template v-if="weekPlan.status <= 1">
		<van-row>
			<van-col span="12" />
			<van-col span="12" style="text-align: right; padding-right: 32px"
				><van-button
					icon="plus"
					round
					color="linear-gradient(to right, #009ad6)"
					type="primary"
					size="small"
					@click="add('lsgz')"
				>
				</van-button
			></van-col>
		</van-row>
	</template> -->
</template>

<script>
import {
	Tabbar,
	TabbarItem,
	Divider,
	Tab,
	Tabs,
	Field,
	Button,
	Switch,
	Cell,
	Collapse,
	CollapseItem,
	Col,
	Row,
	ActionSheet,
} from "vant";
import { ref, reactive, defineAsyncComponent } from "vue";
import moment from "moment";
import $vant from "@/utils/vant.ts";

export default {
	name: "TianTx",
	components: {
		[Tabbar.name]: Tabbar,
		[TabbarItem.name]: TabbarItem,
		[Divider.name]: Divider,
		[Tab.name]: Tab,
		[Tabs.name]: Tabs,
		[Field.name]: Field,
		[Button.name]: Button,
		[Switch.name]: Switch,
		[Cell.name]: Cell,
		[Collapse.name]: Collapse,
		[CollapseItem.name]: CollapseItem,
		[Col.name]: Col,
		[Row.name]: Row,
		[ActionSheet.name]: ActionSheet,
	},
	props: {
		weekPlan: {
			type: Object,
			default: () => {},
			status: 0,
		},
		status: {
			type: Number,
			default: 0,
		},
		active: {
			type: String,
			default: "",
		},
		isReadonly: {
			type: Boolean,
			default: false,
		},
		isReadonly2: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			gjzbActiveNames: ["重点1"],
			lsgzActiveNames: [1],
			weekDay: moment().weekday(),
			showWeek: moment().week(),
			isfk: false,
		};
	},
	created() {
		if (this.weekDay == 6) {
			this.showWeek += 1;
		}
		if (this.weekPlan.gjzbs) {
			this.weekPlan.gjzbList = JSON.parse(this.weekPlan.gjzbs);
			this.weekPlan.lsgzList = JSON.parse(this.weekPlan.lsgzs);
			this.weekPlan.type = "fk";
		}
	},
	mounted() {
		if (this.showWeek != this.weekPlan.week || this.weekDay >= 6) {
			this.isfk = true;
		}
	},
	methods: {
		add(external) {
			switch (external) {
				case "gjzb":
					this.weekPlan.gjzbList.push({
						jtxm: { nr: "" },
						gzmb: { nr: "" },
						wcqk: { nr: "" },
						gjcs: { nr: "" },
						sjqr: { isDone: "未完成" },
					});
					this.gjzbActiveNames = ["重点" + this.weekPlan.gjzbList.length];
					break;
				case "lsgz":
					this.weekPlan.lsgzList.push({
						jtxm: { nr: "" },
						gzmb: { nr: "" },
						wcqk: { nr: "" },
						gjcs: { nr: "" },
						sjqr: { isDone: "未完成" },
					});
					this.gjzbActiveNames = ["临时" + this.weekPlan.lsgzList.length];
					break;
			}
		},
		less(external, index) {
			switch (external) {
				case "gjzb":
					if (this.weekPlan.gjzbList.length > 1) {
						this.weekPlan.gjzbList.splice(index, 1);
					} else {
						$vant.errorMsg("至少保留一项一项！");
					}
					this.gjzbActiveNames = ["重点" + this.weekPlan.gjzbList.length];
					break;
			}
		},
	},
	watch: {},
};
</script>
<style>
.van-divider{
	margin: 0.1rem 0;
}				
.van-collapse-item__content{
	padding: 0;
}
</style>