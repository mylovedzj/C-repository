<template>
  <van-nav-bar left-text="返回" title="全部记录" @click-left="navLeftClick" />

   <div class="vant-table">
          <table cellspacing="0" style="width: 100%" class="table">
            <tr>
              <th class="th">姓名</th>
              <th class="th">第几周</th>
              <th class="th">是否审核</th>
              <th class="th">>></th>
            </tr>
            <tr class="list-tr" v-for="(weekPlan,index) in weekPlanList" :key="index">
                <td>{{weekPlan.xm}}</td>
                <td>{{weekPlan.week}}</td>
                <td>{{weekPlan.status == 0? '未审核':'已审核'}}</td>
                <td><van-button round type="info" size="mini" :to="'/plan/' + weekPlan.dkxh + '/'+weekPlan.status+'/' + weekPlan.id + '/y'">查看</van-button></td>
            </tr>
          </table>
          <van-pagination v-model="currentPage" :total-items="totalItems" :items-per-page="itemsPerPage" @change="getWeekList" />
        </div>
</template>

<script>
import { Tabs, Tab, Empty, Cell, NavBar,Pagination,Button  } from "vant";
import { ref, reactive, defineAsyncComponent } from "vue";
import { useRouter } from "vue-router";
import $function from "@/utils/function.ts";
import $axios from "@/utils/axios.js";

export default {
  name: "List",
  components: {
    [Tabs.name]: Tabs,
    [Tab.name]: Tab,
    [Empty.name]: Empty,
    [Cell.name]: Cell,
    [NavBar.name]: NavBar,
    [Pagination.name]:Pagination,
    [Button.name]:Button
  },
   data() {
    return {
      userInfo: {},
      weekPlanList: [],
      active: "",
      start: 1,
      activeNames: [],
      status: 0,
      currentPage:1,
      totalItems:100,
      itemsPerPage:10
    };
  },

  created() {
    // this.userInfo.dkxh = this.$route.params.dkxh;
  },
  mounted() {
    this.getWeekList();
    // this.getPlanInfo();
  },
  methods: {
    getWeekList() {
      var _this = this;
        $axios({
          url: "/weekplan/dingweekplan/list",
          method: "get",
          data: {
              cursor:_this.currentPage,
              limit:_this.itemsPerPage
          },
          success(data) {
            _this.weekPlanList = data.page.records
            _this.currentPage = data.page.current
            _this.totalItems = data.page.total
            _this.itemsPerPage = data.page.size
          },
        });
    },
    navLeftClick(){
        this.$router.go(-1);
    }
  },
};
</script>

<style lang="less" scoped>
.vant-table {
  .table {
    font-size: 14px;
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
      height: 1.074074rem;
      // line-height: 1.074074rem;
    }
    .list-tr:nth-child(2n) {
      background-color: #f6f5ec;
      
    }
  }
}
</style>
