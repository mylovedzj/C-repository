<template>
	<van-nav-bar left-text="返回" title="管理员移交审核"  @click-left="navLeftClick" />
     <van-divider />
    <van-contact-card  :add-text=yhtext
     @click="onAdd"   />
    <van-divider />
    <van-contact-card  :add-text=sprtext
	 @click="onAdd2" />
	 <div class="buttonBox" >
            <van-button type="primary" size="small" @click="submitInfo" :disabled="isFlag">提交审批</van-button>
	 </div>
</template>

<script>
import { defineAsyncComponent } from "vue";
import $axios from "@/utils/axios.js";
import { NavBar, Cell ,ContactCard,Divider,Button} from "vant";
import $function from "@/utils/function.ts";
import {useRouter} from 'vue-router';
import * as dd from "dingtalk-jsapi";
export default {
	name: "Me",
	components: {
		[NavBar.name]: NavBar,
		[Cell.name]: Cell,
        [ContactCard.name]: ContactCard,
        [Divider.name]: Divider,
		[Button.name]:Button,
		
	},
	data(){
		return{
			isFlag:false,
			name:"",
			yhtext:"选择用户",
			userid:"",
			sprtext:"选择审批人",
			sprid:"",

		}
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
	mounted(){
		
	},
	methods:{
		submitInfo(){
		 	 let _this = this;
			 if(_this.userid=='' || _this.sprid=='' ){
				 _this.$toast.fail("请选择用户或审批人");
				 return
			 }
			  _this.isFlag=true;
              $axios({
				url: "/weekplan/dingweekplan/zjspr",
				method: "get",
				data: {
					user:_this.userid,
					spr:_this.sprid
				},
				success(data) {
				    if(data.code=8000){
					   _this.isFlag = false;
                       _this.$toast.success('提交成功');
					}
					else{
						 _this.$toast.fail(data.msg);
					}
				},
			});
		},
		onAdd(){
             let _dd = dd;		
			 let _this=this;
              _dd.biz.contact.complexPicker({
                title: '选择部门和员工', //标题
                corpId: 'dingd53808c7ab699fd8', //企业的corpId
                multiple: true, //是否多选
                limitTips: '超过限定人数', //超过限定人数返回提示
                maxUsers: 1, //最大可选人数
                pickedUsers: [], //已选用户
                pickedDepartments: [], //已选部门
                disabledUsers: [], //不可选用户
                disabledDepartments: [], //不可选部门
                requiredUsers: [], //必选用户（不可取消选中状态）
                requiredDepartments: [], //必选部门（不可取消选中状态）
                appId: '', //微应用的Id
                permissionType: 'xxx', //可添加权限校验，选人权限，目前只有GLOBAL这个参数
                responseUserOnly: false, //返回人，或者返回人和部门
                startWithDepartmentId: 0, //仅支持0和-1
                onSuccess: function (result) {

                 // _this.$router.push("/nysbupdate/"++"/"+result.users[0].emplId+"/"+id);
				 //alert(result.users[0].name);
 				//alert(result.users[0].emplId);
				 _this.yhtext=result.users[0].name;
				  _this.userid=result.users[0].emplId;
				  //alert(_this.name);
                },
                onFail: function (err) {
                  if (err.errorCode < 0) {
                    //已取消
                   // _this.showTosat("text","已取消");
				  
					_this.$toast.fail("已取消");
                  }
                  // _this.showTosat('error', JSON.stringify(err))

                },
              })
        
		  },
			onAdd2(){
             let _dd = dd;		
			 let _this=this;
              _dd.biz.contact.complexPicker({
                title: '选择部门和员工', //标题
                corpId: 'dingd53808c7ab699fd8', //企业的corpId
                multiple: true, //是否多选
                limitTips: '超过限定人数', //超过限定人数返回提示
                maxUsers: 1, //最大可选人数
                pickedUsers: [], //已选用户
                pickedDepartments: [], //已选部门
                disabledUsers: [], //不可选用户
                disabledDepartments: [], //不可选部门
                requiredUsers: [], //必选用户（不可取消选中状态）
                requiredDepartments: [], //必选部门（不可取消选中状态）
                appId: '', //微应用的Id
                permissionType: 'xxx', //可添加权限校验，选人权限，目前只有GLOBAL这个参数
                responseUserOnly: false, //返回人，或者返回人和部门
                startWithDepartmentId: 0, //仅支持0和-1
                onSuccess: function (result) {

                 // _this.$router.push("/nysbupdate/"++"/"+result.users[0].emplId+"/"+id);
				 //alert(result.users[0].name);
 				//alert(result.users[0].emplId);
				 _this.sprtext=result.users[0].name;
				  _this.sprid=result.users[0].emplId;
				  //alert(_this.name);
                },
                onFail: function (err) {
                  if (err.errorCode < 0) {
                    //已取消
                   // _this.showTosat("text","已取消");
				  
					alert("已取消");
                  }
                  // _this.showTosat('error', JSON.stringify(err))

                },
              })


        
		}
	}
};
</script>
<style>
.buttonBox{
	margin-top:1rem;
	text-align: right;
	padding: 0 0.2rem;
}
</style>
