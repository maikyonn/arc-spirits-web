<script lang="ts">
	type NavSection = { id: string; label: string; icon: string };

	let { sections, activeSection, onNavigate } = $props<{
		sections: NavSection[];
		activeSection: string;
		onNavigate: (id: string) => void;
	}>();
</script>

<nav class="nav-bar">
	<div class="nav-inner">
		<div class="nav-brand">
			<span class="brand-slash">//</span>
			<span class="brand-text">ARC SPIRITS</span>
		</div>
		<div class="nav-links">
			{#each sections as section (section.id)}
				<button
					class="nav-link"
					class:active={activeSection === section.id}
					onclick={() => onNavigate(section.id)}
				>
					<span class="nav-icon">{section.icon}</span>
					<span class="nav-label">{section.label}</span>
				</button>
			{/each}
		</div>
	</div>
</nav>
