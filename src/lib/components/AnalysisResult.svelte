<script lang="ts">
  import type { HeadlineAnalysis } from '$lib/types';
  import CriteriaScorecard from './CriteriaScorecard.svelte';
  import ImageGenerator from './ImageGenerator.svelte';
  
  export let analysis: HeadlineAnalysis;
</script>

<div class="bg-white border border-black p-8 mb-12">
  {#if analysis.isRelevant}
    <div class="results-container">
      <h2 class="text-2xl font-bold text-black mb-6">Headline Analysis Results</h2>
      
      <div class="mb-10">
        <h3 class="text-2xl font-bold text-black mb-6">Original Headline</h3>
        <div class="p-6 border border-black mb-6">
          <p class="text-xl font-bold">{analysis.originalHeadline}</p>
        </div>
        
        <CriteriaScorecard 
          score={analysis.score} 
          criteriaResults={analysis.criteriaResults} 
        />
      </div>
      
      <!-- Image generator now directly shows the comparison and includes 'What's the difference' -->
      <ImageGenerator 
        originalHeadline={analysis.originalHeadline}
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
        on:click={() => window.location.reload()}
      >
        Try Another Article
      </button>
    </div>
  {/if}
</div>
