<template>
    <el-container style="width:1560px;">
       <el-aside style="width:230px;">
             <el-tree :data="treeData" icon-class="el-icon-arrow-down"   accordion @node-click="handleNodeClick" node-key="id" :default-expanded-keys=treeData></el-tree>
         </el-aside> 
        <el-container>
        <el-header>
           <el-row>
              <el-col :span="1" style="text-align:left;font-size:18px;"><span @click="toback">返回</span></el-col>
              <el-col :span="4" style="font-size:18px;"> 周工作计划详情</el-col>
               <el-col :span="2"> </el-col>
              <el-col :span="13">
                  <el-radio-group v-model="radio" style="margin-top:10px;" >
                    <el-radio :label="1" size="small" style="font-size:10px;">全部</el-radio>
                    <el-radio :label="2">未审批</el-radio>
                    <el-radio :label="3">已审批</el-radio>
                  </el-radio-group>
                    <el-button type="primary" plain style="margin-left:30px;" @click="exportData">导出</el-button>
              </el-col>
           </el-row>
        </el-header>
        <el-main>
             <el-row style="margin-bottom:20px;">
                  <el-col :span="8" >
                        <el-breadcrumb  style="height:40px;line-height:3;font-size:16px;">
                            <el-breadcrumb-item :to="{ path: '/'+ dkxh}">首页</el-breadcrumb-item>
                            <el-breadcrumb-item>{{breadCrumb[0]}}</el-breadcrumb-item>
                            <el-breadcrumb-item>{{breadCrumb[1]}}</el-breadcrumb-item>
                            <el-breadcrumb-item>{{breadCrumb[2]}}</el-breadcrumb-item>
                        </el-breadcrumb>
                  </el-col>
                  <el-col :span="3">
                       <el-input v-model="searchName" placeholder="请输入姓名" style="font-size:14px;"></el-input>
                  </el-col>
                  <el-col :span="3" :offset="1" >
                       <el-select v-model="searchWeek" placeholder="请选择周"   size="small" style="font-size:14px;">
                            <el-option
                             v-for="(item,index) in weekOption"
                            :key="index"
                            :label="item"
                            :value="item" style="font-size:14px;">
                            </el-option>
                        </el-select>
                  </el-col>
                  <el-col :span="2">
                      <el-button type="primary" plain @click="search">搜索</el-button>
                  </el-col>
             </el-row>
           
          <el-table :data="tableData" border  v-loading="loading"  style="width:1050px;">
                <el-table-column  fixed  prop="num"  label="序号"  width="60">  </el-table-column>
                <el-table-column  prop="xm"  label="姓名"  width="100">   </el-table-column>
                <el-table-column  prop="zt"  label="处理状态"   width="100"> </el-table-column>
                <el-table-column  prop="txsj" label="申报时间" width="200"> </el-table-column>
                <el-table-column  prop="shsj"  label="审核时间"  width="200"> </el-table-column>
                <el-table-column  prop="week"  label="周"  width="80" ></el-table-column>
                <el-table-column  prop="bm"  label="部门"   width="160"></el-table-column>
                <el-table-column    label="操作"  width="90" > 
                 <template #default="scope">
                    <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
                </template>
                </el-table-column>
            </el-table>
            <el-row style="margin-top:20px;">
                 <el-col :span="24">
                        <el-pagination
                        background
                        small
                        layout=" prev,pager,next, jumper"
                        prev-text="上一页"
                        next-text="下一页"
                        jumper
                        v-model:current-page=currentPage
                        :total="total" @current-change="changePage">
                        </el-pagination>
                 </el-col>
            </el-row>
            <el-row style="margin-top:20px;">
                <el-col :span="14">
                
                </el-col>
            </el-row>
        </el-main>
        <el-footer>远大集团</el-footer>
        </el-container>
    </el-container>
</template>

<script>
import $axios from "@/utils/axios.js";
import $vant from "@/utils/vant.ts";
  export default {
    data() {
      return {
        isCollapse: true,
        userInfo:{},//用户的所在部门信息
        currentPage:1,//当前页码
        searchWeek:'',
        searchName:'',
        tableData: [],//表格的周数
        weekOption:[],
        treeData:[],
        radio:1,
        breadCrumb:['一级部门','二级部门','三级部门'],
        dkxh:'',
        total:100,
        loading: true,
        topData:{},
      };
    },
    created(){
        let dkxh = this.$route.params.dkxh;
        this.dkxh=dkxh;
        this.userData(dkxh);//获取用户所在部门
        this.weekList();
        //获取所有的部门
    },
    mounted(){
      //this.toLargerCSV();
    },
    methods: {
      toback(){
        this.$router.go(-1);
      },
      handleClick(rowdata){//查看
         //  console.log(rowdata);
         $axios({
				url: "/weekplan/dingweekplan/geturl/"+rowdata.id,
				method: "get",
				success(data) {
            if(data.code==8000){
               window.location.href = data.url;
            }
				},
        fail(data){
              $vant.errorMsg(data.msg);
          }
		  	})
      },
      changePage(){//点击页码
          this.departmentData();
      },
      search(){//点击搜索
         this.departmentData();
      },
      handleNodeClick(data){//树控件点击事件
      //console.log(data);
           let len = data.id.length;
           len == 3 ? this.breadCrumb.splice(0,3,data.label) :len==5 ? this.breadCrumb.splice(1,2,data.label) : len==7 ? this.breadCrumb.splice(2,1,data.label) :this.breadCrumb;
          this.userInfo.qxbm = data.id;
          this.departmentData();
      },
      userData(dkxh){//获取用户的所属的部门信息
          let _this = this;
        $axios({
				url: "/weekplan/dinguserqx/getByDkxh/"+dkxh,
				method: "get",
				success(data) {
                    if(data.code==8000){
                       _this.userInfo = data.qx;
                       _this.departmentData();
                       _this.departmentList();
                    }
			      	},
                fail(data){
                    $vant.errorMsg(data.msg);
                }
			    })
       },
      departmentData(){//获取显示在表格中的数据
            let _this = this;
            if(this.searchWeek == '全部') this.searchWeek='';
           $axios({
				url: "/weekplan/dingweekplan/dcexcel",
				method: "get",
                data:{
                    current: _this.currentPage,//当前页码
                    zs: _this.searchWeek,
                    strid: _this.userInfo.qxbm,//部门编码
                    xm:_this.searchName,
                },
				success(data) {
                    if(data.code==8000){
                      _this.tableData = data.page.records;
                      _this.loading = false;
                      _this.total=data.page.total;
                      for(let i=0;i< _this.tableData.length;i++){
                          _this.tableData[i].num = i+1;//加入表格序号
                      }
                    }
				},
                fail(data){
                    $vant.errorMsg(data.msg);
                }
			})
        },
       departmentList(){//获取用户所在公司的所有部门列表,下一级部门的pid等于上一级部门的id
           let _this = this;
           const parentData = []; 
         
           $axios({
               url:"/weekplan/dingweekplan/jttree/"+_this.userInfo.qxbm,
               methods:'get',
               success(data){
                   if(data.code==8000){
                     data.bmfl.forEach((item)=>{
                         if(item.pid=='A'){
                              let obj = {label:item.name,children:[],id:item.id}
                              parentData.push(obj);
                         }
                         _this.treeData =  parentData;
                         if(!item.pid){
                            _this.topData = item;
                           // console.log( _this.topData);
                         }
                     })
                        _this.Nodechildren(data.bmfl);
                   }
               },
               fail(data){
                    $vant.errorMsg(data.msg);
                }
           })
       },
       Nodechildren(bmfl){//要修改的地方
           let _this = this;
            function dg(item){
             // console.log(item);
                  for(let i=0;i<item.length;i++){
                     for(let j=0; j<bmfl.length;j++){
                    if(bmfl[j].pid == item[i].id){
                        let obj = {label:bmfl[j].name,children:[],id:bmfl[j].id};
                        item[i].children.push(obj);
                     }
                  }
                  dg(item[i].children);//此处递归调用
              }
           }
           
           new Promise((resolve,reject)=>{
               dg(this.treeData);
               resolve();
           }).then(()=>{
              let temp = [];
              if(JSON.stringify(_this.topData)!=='{}'){
                // console.log(_this.topData,'11');
                 let obj = {label:_this.topData.name,children:_this.treeData,id:_this.topData.id};
                temp.push(obj);
                _this.treeData = temp;
              }
              else{
                return _this.treeData;
                 console.log(_this.treeData,'22')
              }
           }).catch((e)=>{
              $vant.errorMsg(e);
           })
       },
       weekList(){//获取周列表
          let _this = this;
           $axios({
               url:"/weekplan/dingweekplan/getAscriptions",
               methods:'get',
               success(data){
                   if(data.code==8000){
                       _this.weekOption = data.data;
                      _this.weekOption.splice(0, 0, "全部");
                   }
               },
               fail(data){
                    $vant.errorMsg(data.msg);
                }
           })
       },
       exportData(){
         let _this = this;
           $axios({
               url:"/weekplan/dingweekplan/dc",
               methods:'get',
               data:{
                 zs: _this.searchWeek,
                 strid: _this.userInfo.qxbm,
                 xm:_this.searchName,
               },
               success(data){
                   if(data.code==8000){
                      if(data.page.length>0){
                        _this.toLargerCSV(data.page);
                      }
                      else{
                         $vant.errorMsg('没有查询到数据');
                      }
                   }
               },
               fail(data){
                    $vant.errorMsg(data.msg);
                }
           })
       },
     formatJson(filterVal, jsonData) {
          return jsonData.map(v => filterVal.map(j => v[j]))
                },
      toLargerCSV(dataPage){
        //CSV格式可以自己设定，适用MySQL导入或者excel打开。
        //由于Excel单元格对于数字只支持15位，且首位为0会舍弃 建议用 =“数值” 
        let str = '姓名,处理状态,申报时间,审核时间,周,内容\n';
        for(let i=0;i<dataPage.length;i++){
          str += `${dataPage[i].xm},${dataPage[i].zt},${dataPage[i].txsj+'\t'},${dataPage[i].shsj+'\t'},${dataPage[i].week},${dataPage[i].nr.replace(/\s/g,"")}\n`;
        }
         str = "\uFEFF"+ str;
         // console.log(str);
         let blob = new Blob([str], {type: "text/csv;charset=utf-8"});  
         // blob = new Blob([String.fromCharCode(0xFEFF), blob], {type: blob.type});  //解决中文乱码问题
         //console.log(window.URL.createObjectURL(blob));
         let object_url = window.URL.createObjectURL(blob); 
         var link = document.createElement("a");
         link.href = object_url;
         link.download = dataPage.length+".csv";
         document.body.appendChild(link);
         link.click();
         document.body.removeChild(link);        
        }
     }
  }
</script>

<style lang="less" >
.el-header, .el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 40px;
  }
 .el-aside {
    background: white;
    text-align: center;
  } 
.el-tree{
   padding:40px 0 0 15px;
}
.el-table {
  text-align: center;
  font-size:10px;
}
.el-tree-node__label{
  font-size: 10px !important;
}

 .el-tree-node__content{
   height: 26px;
 } 
.el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
  }

  body > .el-container {
    margin-bottom: 40px;
  }
 .el-input--small .el-input__inner {
    height: 0.842105rem;
    line-height: 0.842105rem;
    font-size: 10px;
} 
.el-pager li{
  font-size: 14px;
}
</style>
