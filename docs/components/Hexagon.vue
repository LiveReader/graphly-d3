<template>
	<svg
		width="100%"
		height="100%"
		viewBox="0 0 597 520"
		version="1.1"
		xmlns="http://www.w3.org/2000/svg"
		xmlns:xlink="http://www.w3.org/1999/xlink"
		xml:space="preserve"
		xmlns:serif="http://www.serif.com/"
		style="fill-rule: evenodd; clip-rule: evenodd; stroke-linejoin: round; stroke-miterlimit: 2"
	>
		<g transform="matrix(1,0,0,1,-101.915,-40.1924)">
			<g transform="matrix(8.33117e-17,-1.36058,1.36058,8.33117e-17,9.05891,870.52)">
				<path
					d="M384.617,88.155C406.11,75.826 432.531,75.826 454.023,88.155C488.394,107.873 540.748,137.906 575.236,157.69C596.908,170.123 610.273,193.199 610.273,218.184L610.273,356.483C610.273,381.468 596.908,404.544 575.236,416.977C540.748,436.761 488.394,466.794 454.023,486.512C432.531,498.841 406.11,498.841 384.617,486.512C350.246,466.794 297.892,436.761 263.405,416.977C241.733,404.544 228.367,381.468 228.367,356.483L228.367,218.184C228.367,193.199 241.733,170.123 263.405,157.69C297.892,137.906 350.246,107.873 384.617,88.155Z"
					style="stroke: #101213; stroke-width: 0.5"
					:style="{ fill: color }"
				/>
			</g>
			<rect x="34%" y="42%" width="65%" height="30%" rx="80" ry="80" style="fill: #101213" />
			<text
				x="66%"
				y="57%"
				text-anchor="middle"
				dominant-baseline="central"
				style="font-family: roboto; font-size: 80px; font-weight: bold; fill: #eaeaea"
			>
				{{ title }}
			</text>
		</g>
	</svg>
</template>

<script setup>
const props = defineProps({
	color: { type: String, default: "#000000" },
	title: { type: String, default: "" },
});
</script>
