import DefaultTheme from "vitepress/theme";
import Layout from "../../components/Layout.vue";
import "./theme.css";

export default {
	...DefaultTheme,
	Layout: Layout,
};
