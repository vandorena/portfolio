<script lang="ts">
	let readabilityMode = $state(false);

	function toggleReadability() {
		readabilityMode = !readabilityMode;
	}
</script>

<section class="min-h-screen w-full relative z-10 flex flex-col gap-16 items-center py-16 px-6 sm:px-10 lg:px-16">
	<div class="max-w-6xl text-center space-y-6">
		<h1 class="text-2xl sm:text-xl md:text-3xl font-bold text-white" style:font-family={readabilityMode ? 'Arial, sans-serif' : undefined}>
			We need Gen Z and Gen Alpha to be <span class="gradient-text">Creators</span> <u>Not</u> Consumers
		</h1>

		<!-- Readability Toggle Switch -->
		<div class="flex items-center justify-start gap-3 mb-4">
			<span class="text-white text-sm">Readable Font</span>
			<button
				onclick={toggleReadability}
				class="toggle-switch"
				class:active={readabilityMode}
				role="switch"
				aria-checked={readabilityMode}
				aria-label="Toggle readability mode"
			>
				<span class="toggle-slider"></span>
			</button>
		</div>
        <div class="bg-black/50 rounded-sm mb-10">
            <p class=" prose text-base sm:text-lg md:text-xl text-white leading-relaxed py-3" style:font-family={readabilityMode ? 'Arial, sans-serif' : undefined}>
               The teens building with AI today will define how we use it tomorrow—so why do we push them to be consumers instead of creators?
            </p>
        </div>
        <div class="bg-black/50 rounded-sm mb-10">
            <p class=" prose text-base sm:text-lg md:text-xl text-white leading-relaxed py-3" style:font-family={readabilityMode ? 'Arial, sans-serif' : undefined}>
                At Hack Club I've reviewed thousands of projects teens built using AI coding tools. What stands out is how easy it is to tell whether someone used AI to complement their skills or replace them entirely.
            </p>
        </div>
        <div class="bg-black/50 rounded-sm mb-10">
            <p class=" prose text-base sm:text-lg md:text-xl text-white leading-relaxed py-3" style:font-family={readabilityMode ? 'Arial, sans-serif' : undefined}>
                Vibecoding produces a finished (albeit generic and unpolished) product way too early in the development cycle. Now, Gen Z and Gen Alpha are paying the price. They see AI as their cheat code. Relying on it to earn rewards without substantial work. At the moment, they're not learning AI fluency, they're learning AI convenience.
            </p>
        </div>
        <div class="bg-black/50 rounded-sm mb-10">
            <p class=" prose text-base sm:text-lg md:text-xl text-white leading-relaxed py-3" style:font-family={readabilityMode ? 'Arial, sans-serif' : undefined}>
                Schools cannot teach AI fluency. But the real world can and does. Making projects and getting user feedback is in my eyes the only way to teach the difference between vibecoded slop, and quality AI-assisted work.
            </p>
        </div>
        <div class="bg-black/50 rounded-sm mb-10">
            <p class=" prose text-base sm:text-lg md:text-xl text-white leading-relaxed py-3" style:font-family={readabilityMode ? 'Arial, sans-serif' : undefined}>
                <a href="https://hackclub.com" class="underline hover:cursor-pointer text-white/90 hover:text-green-500">@ Hack Club,</a> I'm helping lead this change.
            </p>
        </div>
        <div class="bg-black/50 rounded-sm mb-10">
            <p class=" prose text-base sm:text-lg md:text-xl text-white leading-relaxed py-3" style:font-family={readabilityMode ? 'Arial, sans-serif' : undefined}>
                We're teaching teens AI fluency by pushing them to build creative solutions that real people actually use. Because real end-users have standards that matter. Your CS teacher doesn't.
            </p>
        </div>
        <div class="bg-black/50 rounded-sm mb-10">
            <p class=" prose text-base sm:text-lg md:text-xl text-white leading-relaxed py-3" style:font-family={readabilityMode ? 'Arial, sans-serif' : undefined}>
                The way solutions get developed is changing. We have to acknowledge it.
            </p>
        </div>
	</div>	
</section>

<style>
	.gradient-text {
		font-weight: bold;
		font-size: 1.2em;
		background: linear-gradient(
			90deg,
			#ff05ba,
			#a855f7,
			#d40651,
			#ff474a,
			#ff05ba
		);
		background-size: 200% auto;
		-webkit-background-clip: text;
		background-clip: text;
		-webkit-text-fill-color: transparent;
		animation: gradient-shift 3s ease infinite;
	}

	@keyframes gradient-shift {
		0% {
			background-position: 0% center;
		}
		50% {
			background-position: 100% center;
		}
		100% {
			background-position: 0% center;
		}
	}

	.toggle-switch {
		position: relative;
		width: 48px;
		height: 24px;
		background-color: rgba(255, 255, 255, 0.2);
		border-radius: 24px;
		border: none;
		cursor: pointer;
		transition: background-color 0.3s ease;
	}

	.toggle-switch:hover {
		background-color: rgba(255, 255, 255, 0.3);
	}

	.toggle-switch.active {
		background-color: #a855f7;
	}

	.toggle-switch.active:hover {
		background-color: #9333ea;
	}

	.toggle-slider {
		position: absolute;
		top: 2px;
		left: 2px;
		width: 20px;
		height: 20px;
		background-color: white;
		border-radius: 50%;
		transition: transform 0.3s ease;
	}

	.toggle-switch.active .toggle-slider {
		transform: translateX(24px);
	}
</style>