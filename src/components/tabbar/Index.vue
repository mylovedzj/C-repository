<template>
    <van-tabbar v-model="activeTab">
        <template v-for="item in tabbar.list" :key="item.name">
            <template v-if="!item.slot">
                <van-tabbar-item :name="item.name"
                                 :to="item.name=='home'?`/${dkxh}`:`/${item.name}`"
                                 :icon="item.icon">{{item.title}}
                </van-tabbar-item>
            </template>
            <template v-else>
                <van-tabbar-item :name="item.name"
                                 :to="`/${item.name}`">
                    <span>{{item.title}}</span>
                    <template #icon="props">
                        <img :src="activeTab === item.name ? item.activeImg : item.unActiveImg"/>
                    </template>
                </van-tabbar-item>
            </template>
        </template>
        <template v-if="isShowList">
            <van-tabbar-item name="list"
                             to="/allList"
                             icon="todo-list-o">全部
            </van-tabbar-item>
        </template>
    </van-tabbar>
</template>

<script>
    import {Tabbar, TabbarItem} from 'vant';
    import {ref, reactive, defineAsyncComponent} from 'vue';
    //引入本地图片
    import LogoImg from '@/assets/logo.png';

    export default {
        name: "WeiTabbar",
        components: {
            [Tabbar.name]: Tabbar,
            [TabbarItem.name]: TabbarItem
        },
        props: {
            activeTab: {
                type: String,
                default: 'edit'
            },
            isShowList:{
                type: Boolean,
                default: false
            },
            dkxh: {
                type: String
            },
        },
        setup() {
            let tabbar = reactive({
                list: [
                    {title: '填写', icon: 'edit', name: 'home'},
                    {title: '我的', icon: 'manager-o', name: 'me'},
                ]
            });
            return {
                tabbar
            }
        }
    }
</script>

<style lang="less" scoped>
    .van-tabbar {
        .van-tabbar-item {
            .van-tabbar-item__icon {
                img {
                    width: 30px;
                }
            }
        }
    }
</style>