<script lang="ts">
  import type { HeadlineAnalysis } from '$lib/types';
  import ImageGenerator from './ImageGenerator.svelte';
  
  import RewriteGuide from './RewriteGuide.svelte';
  const { analysis } = $props<{ analysis: HeadlineAnalysis }>();

  let showModal = $state(false);
</script>

<RewriteGuide showModal={showModal} onClose={() => showModal = false}/>


<div class="bg-white border border-black p-8 mb-8">
  {#if analysis.isRelevant}
    <div class="results-container">
      <h2 class="text-4xl font-normal text-black mb-2">Results:</h2>
      <a class="text-lg text-black underline underline-offset-4 decoration-0 hover:decoration-1 hover:text-red-600 transition-all cursor-pointer" onclick={() => showModal = true}>
        Are you a journalist (or curious about how we did this)?
      </a>
      
      <!-- Image generator now directly shows the comparison and includes 'What's the difference' -->
      <ImageGenerator 
        originalHeadline={analysis.originalHeadline}
        originalExplanation={analysis.criteriaResults}
        improvedHeadline={analysis.improvedHeadline}
        score={analysis.score}
        changes={analysis.changes}
      />
    </div>
  {:else}
    <div class="p-6 border border-black">
      <h3 class="text-2xl font-bold text-black mb-4">Not a Traffic Crash Article</h3>
      <div class="mb-6 text-lg">
        <p>The article you submitted does not appear to be about a traffic crash. This tool is designed specifically to analyze and improve crash reporting headlines.</p>
      </div>
      <button 
        class="px-6 py-3 bg-black text-white font-semibold border border-black hover:bg-white hover:text-black transition-all" 
        onclick={() => window.location.reload()}
      >
        Try Another Article
      </button>
    </div>
  {/if}
</div>
