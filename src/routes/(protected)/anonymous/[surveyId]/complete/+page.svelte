<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Confetti } from 'svelte-confetti';
</script>

<div class="fullscreen">
	<Confetti
		x={[-5, 5]}
		y={[0, 0.1]}
		delay={[500, 2000]}
		duration={5000}
		amount={200}
		fallDistance="200vh"
	/>
</div>
<h1 class="mt-5 text-center text-xl font-bold">Thank You</h1>
<p class="text-center text-sm">for your time</p>
<div class=" flex justify-center">
	<img
		class=""
		src="https://i.postimg.cc/3RRzs1mf/original-ea83f90331767ab60e5eb641984115ed-removebg-preview.png"
		alt=""
	/>
</div>
<div class="mt-24 flex flex-1 justify-center">
	<h1 class="text-md">You can now close this tab</h1>
</div>
<div class="mt-4 flex flex-1 justify-center">
	<!-- <p>Or go back <a class="underline underline-offset-1" href="/">Home</a></p>   -->
</div>

<style lang="css">
	.fullscreen {
		position: fixed;
		top: -50px;
		left: 0;
		height: 100vh;
		width: 100vw;
		display: flex;
		justify-content: center;
		overflow: hidden;
		pointer-events: none;
	}
</style>
