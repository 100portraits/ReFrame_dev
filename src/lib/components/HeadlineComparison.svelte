<script lang="ts">
  import type { CriterionResult } from '$lib/types';
  
  export let originalHeadline: string;
  export let improvedHeadline: string;
  export let score: 0 | 1 | 2 | 3;
  export let changes: Array<{
    criterionId: 1 | 2 | 3;
    explanation: string;
  }>;
</script>

<div class="my-8">
  <h2 class="text-2xl font-bold text-black mb-6">Improved Headline</h2>
  
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
    <!-- Original Headline -->
    <div class="p-6 border border-black">
      <h3 class="font-bold uppercase text-black text-sm mb-4">Original Headline</h3>
      <p class="text-xl font-bold mb-6">{originalHeadline}</p>
      
      <div class="flex items-center">
        <div class="w-12 h-12 flex items-center justify-center border border-black">
          <span class="text-xl font-black">{score}</span>
        </div>
        <span class="ml-3 text-sm font-bold">/ 3 criteria met</span>
      </div>
    </div>
    
    <!-- Improved Headline -->
    <div class="p-6 border border-black">
      <h3 class="font-bold uppercase text-black text-sm mb-4">Humanized Headline</h3>
      <p class="text-xl font-bold mb-6">{improvedHeadline}</p>
      
      <div class="flex items-center">
        <div class="w-12 h-12 flex items-center justify-center border border-black">
          <span class="text-xl font-black">3</span>
        </div>
        <span class="ml-3 text-sm font-bold">/ 3 criteria met</span>
      </div>
    </div>
  </div>
  
  <!-- What's different section -->
  <div class="p-6 border border-black">
    <h3 class="font-bold text-black mb-4">What's the difference?</h3>
    
    <ol class="list-decimal pl-5 space-y-3">
      {#each changes as change}
        <li class="pl-1">
          <span class="font-bold">
            {#if change.criterionId === 1}
              Mention all parties involved in the crash:
            {:else if change.criterionId === 2}
              Refer to parties using human terms, not transportation modes:
            {:else if change.criterionId === 3}
              Use active voice that clearly shows who did what to whom:
            {/if}
          </span> 
          <span class="text-black">{change.explanation}</span>
        </li>
      {/each}
    </ol>
  </div>
</div>
