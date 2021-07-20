<template>
	<van-collapse v-model="ldspActiveNames">
		
         <van-collapse-item name="详情">
			<template #title>
			<div>周计划详情 <van-icon name="question-o" /></div>
			</template>
            <div class="div1">
          <table>
            <tr>
              <td >项目</td>
              <td >目标</td>	
			  <td v-if="weekPlan.status>=2" >完成</td>
            
            </tr>
			<tr v-for="(gjzb, index) in weekPlan.gjzbList" :key="index">
					<td >{{gjzb.jtxm.nr}}</td>
					<td >{{gjzb.gzmb.nr}}</td>
					<td v-if="weekPlan.status>=2" >{{gjzb.wcqk.nr}}</td>
			</tr> 	
          </table>
          <van-pagination v-model="currentPage" :total-items="totalItems" :items-per-page="itemsPerPage" @change="getWeekList"   />
        </div>
         </van-collapse-item>

		<van-collapse-item   :name="'重点' + (index + 1)" v-for="(gjzb, index) in weekPlan.gjzbList" :key="index" v-if="show||(weekPlan.status>=2&&weekPlan.status<99)">
			<template #title  >
				<div class="exp1" > 
					{{
						"工作" +
						(index + 1) +
						"：" +
						(gjzb.jtxm.nr != ""
							? gjzb.jtxm.nr.length >= 7
								? gjzb.jtxm.nr.substring(0, 6) + "..."
								: gjzb.jtxm.nr
							: "空") +
						"/" +
						(gjzb.gzmb.nr != ""
							? gjzb.gzmb.nr.length >= 7
								? gjzb.gzmb.nr.substring(0, 6) + "..."
								: gjzb.gzmb.nr
							: "空")
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
				
			/>
			<van-field
				v-model="gjzb.gzmb.nr"
				rows="2"
				autosize
				label="工作目标"
				
				placeholder="请输入工作目标"
				:maxlength="50"
			/>
			<van-field
				v-model="gjzb.wcqk.nr"
				rows="2"
				autosize
				label="完成情况"
				type="textarea"
				:placeholder=" '请输入完成情况'"
				:maxlength="50"
				v-show="weekPlan.status >= 2"
			/>
			<van-field
				v-model="gjzb.gjcs.nr"
				rows="2"
				autosize
				label="改进措施"
				type="textarea"
				:placeholder="'请输入改进措施'"
				:maxlength="50"
				v-show="weekPlan.status >= 2"
			/>
			<van-cell
				center
				title="上级确认"
				:value="gjzb.sjqr.isDone"
				value-class="cell_value_color"
				v-if="weekPlan.status >= 2"
			>
				<template #right-icon>
					<van-switch
						v-model="gjzb.sjqr.isDone"
						active-value="完成"
						inactive-value="未完成"
						size="24"
						:disabled="weekPlan.status == 99"
					/>
				</template>
			</van-cell>
			<van-cell title="  " v-if="weekPlan.status <= 1 && fx!='y'">
				<template #right-icon>
					<van-button
						icon="minus"
						round
						color="linear-gradient(to right, #009ad6)"
						type="primary"
						size="small"
						@click="less('gjzb', index)"
					>
						</van-button
					>
				</template>
			</van-cell>
		</van-collapse-item>
		<van-collapse-item :name="'临时' + (index + 1)" v-for="(lsgz, index) in weekPlan.lsgzList" :key="index">
			<template #title>
				<div>
					{{
						"临时" +
						(index + 1) +
						"：" +
						(lsgz.jtxm.nr != ""
							? lsgz.jtxm.nr.length >= 7
								? lsgz.jtxm.nr.substring(0, 6) + "..."
								: lsgz.jtxm.nr
							: "空") +
						"/" +
						(lsgz.gzmb.nr != ""
							? lsgz.gzmb.nr.length >= 7
								? lsgz.gzmb.nr.substring(0, 6) + "..."
								: lsgz.gzmb.nr
							: "空")
					}}
				</div>
			</template>
			<van-field
				v-model="lsgz.jtxm.nr"
				rows="2"
				autosize
				label="具体项目"
				:placeholder="'请输入具体项目'"
				:maxlength="50"
			/>
			<van-field
				v-model="lsgz.gzmb.nr"
				rows="2"
				autosize
				label="工作目标"
				:placeholder="'请输入工作目标'"
				:maxlength="50"
			/>
			<van-field
				v-model="lsgz.wcqk.nr"
				rows="2"
				autosize
				label="完成情况"
				type="textarea"
				:placeholder="'请输入完成情况'"
				:maxlength="50"
				v-show="weekPlan.status >= 2"
                :readonly="fx == 'y'"
			/>
			<van-field
				v-model="lsgz.gjcs.nr"
				rows="2"
				autosize
				label="改进措施"
				type="textarea"
				:placeholder="'请输入改进措施'"
				:maxlength="50"
				v-show="weekPlan.status >= 2"
                :readonly="fx == 'y'"
			/>
			<van-cell
				center
				title="上级确认"
				:value="lsgz.sjqr.isDone"
				value-class="cell_value_color"
				v-if="weekPlan.status >= 2"
			>
				<template #right-icon>
					<van-switch
						v-model="lsgz.sjqr.isDone"
						active-value="完成"
						inactive-value="未完成"
						size="24"
						:disabled="weekPlan.status == 99 || fx == 'y'"
					/>
				</template>
			</van-cell>
			<van-cell title="  " v-if="weekPlan.status <=1 && fx!='y'">
				<template #right-icon>
					<van-button
						icon="minus"
						round
						color="linear-gradient(to right, #009ad6)"
						type="primary"
						size="small"
						@click="less('lsgz', index)"
					>
						</van-button
					>
				</template>
			</van-cell>
		</van-collapse-item>
        <template v-if="weekPlan.status <= 1 && fx!='y'" style="margin-top:20px; ">
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
					icon="plus"
					round
					color="linear-gradient(to right, #009ad6)"
					type="primary"
					size="small"
					@click="add('lsgz')"
				>临时工作
				</van-button>
		</template>
	</van-collapse>
    <van-divider />
    <template v-if="weekPlan.status >= 2">
			<van-field
				v-model="weekPlan.sjpj"
				rows="3"
				autosize
				label="上级评价"
				maxlength="200"
				type="textarea"
				:placeholder="'请输入上级评价'"
				:readonly="weekPlan.status == 99"
			/>
			<van-divider />
		</template>
        <van-row v-if="weekPlan.status >= 2 && weekPlan.status< 99">
            <van-col span="12"
				><van-button
					type="primary"
					icon="share"
					block
					@click="save('sh', weekPlan)"
					:disabled="weekPlan.status == 99 && status>0"
					>审批</van-button
				></van-col>
        </van-row>
</template>

<script>
import { Tabbar, TabbarItem, Divider, Tab, Tabs, Field, Button, Switch, Cell, Collapse, CollapseItem,Col,Row} from "vant";
import { ref, reactive, defineAsyncComponent } from "vue";
import moment from "moment";
import $vant from "@/utils/vant.ts";
import $axios from "@/utils/axios.js";

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
	},
	props: {
		weekPlan: {
			type: Object,
			default: () => {},
		},
		status: {
			type: Number,
			default: 0,
		},
		active: {
			type: String,
			default: "",
		},
		fx: {
			type: String,
			default: "",
		}
	},
	data() {
		return {
			show:false,
            ldspActiveNames:['详情'],
			gjzbActiveNames: ["1"],
			lsgzActiveNames: [1],
			weekDay: moment().weekday(),
            showWeek:moment().week(),
            isfk:false,
		};
	},
	created() {
		if (this.weekPlan.status>=1) {
			this.weekPlan.gjzbList = JSON.parse(this.weekPlan.gjzbs);
			this.weekPlan.lsgzList = JSON.parse(this.weekPlan.lsgzs);
            this.weekPlan.type = 'fk'
		}
        
	},
	mounted() {
        if(this.showWeek!=this.weekPlan.week || this.weekDay>=6){
            this.isfk = true
        }
		// let gjzbList=JSON.parse(window.localStorage.getItem("sh_week_gjzbList"))
		// let lsgzList=JSON.parse(window.localStorage.getItem("sh_week_lsgzList"))
		// if(gjzbList!=null && gjzbList.length>0){
		// 	this.weekPlan.gjzbList = gjzbList;
		// }
		// if(lsgzList!=null && lsgzList.length>0){
		// 	this.weekPlan.lsgzList = lsgzList;
		// }
		// console.log(this.weekPlan)
    },
	methods: {
		add(external) {
			this.show=true;
			switch (external) {
				case "gjzb":
					this.weekPlan.gjzbList.push({
						jtxm: { nr: "" },
						gzmb: { nr: "" },
						wcqk: { nr: "" },
						gjcs: { nr: "" },
						sjqr: { isDone: "未完成" },
					});
					this.ldspActiveNames = ['重点'+this.weekPlan.gjzbList.length];
                    console.log(this.ldspActiveNames)
					break;
				case "lsgz":
					this.weekPlan.lsgzList.push({
						jtxm: { nr: "" },
						gzmb: { nr: "" },
						wcqk: { nr: "" },
						gjcs: { nr: "" },
						sjqr: { isDone: "未完成" },
					});
					this.ldspActiveNames = ['临时'+this.weekPlan.lsgzList.length];
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
					this.ldspActiveNames = ['重点'+this.weekPlan.gjzbList.length];
					break;
			}
		},
        
        save(type) {
			var isSave = false;
			
			if (this.weekPlan.sjpj == null) {
				isLastSave = true;
			}
			if (isSave) {
				$vant.errorMsg("请输入上级评价！");
				return;
			}
			this.weekPlan.fxrIds = JSON.stringify(this.weekPlan.fxrIds);
			this.weekPlan.gjzbs = JSON.stringify(this.weekPlan.gjzbList);
			this.weekPlan.lsgzs = JSON.stringify(this.weekPlan.lsgzList);
			this.weekPlan.type = type;

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
					$vant.successMsg("评价成功！");
				},
			});
		},
	},
    watch:{
		
    }
};
</script>
<style>
.van-divider{
	margin:0.1rem 0;
}
.van-field{
	height: 1rem;
	padding: 0.163158rem 0.421053rem;
}
.van-cell{
	padding: 0.163158rem 0.421053rem;
}			 
.van-collapse-item__content{
	padding: 0;
}
.div1{
	text-align: center;
	align-content: center;
	margin: auto;
	width: 98%;
	}
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
.cell_value_color {
	color: #d71345;
}

.exp1{
	height: 0.5rem;
}

</style>

