<template>
     <iframe :src=this.url width="100%" scrolling="no" height="2000px"></iframe>
</template>
<script>
import { NavBar,Field,Button} from "vant";
export default {
	components: {
		[NavBar.name]: NavBar,
		[Field.name]: Field,
		[Button.name]: Button,
	},
data() {
		return {
			zs:"",
			weekplanList:[],
			dkxh:"",
			url:"http://ding.broad.org:88/zlsq/#/dcExcel"
		};
	},
	created(){
     	this.dkxh = this.$route.params.dkxh;
		this.url=this.url+"/"+this.dkxh;
	},
	mounted() {
		
	},
	methods: {
		
		
}}
</script>