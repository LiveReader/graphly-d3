import DefaultTheme from "vitepress/theme";
import GraphlyLayout from "../../components/Layout.vue";
import "./theme.css";

export default {
	...DefaultTheme,
	Layout: GraphlyLayout,
};
