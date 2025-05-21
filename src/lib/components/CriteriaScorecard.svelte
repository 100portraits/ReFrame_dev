<script lang="ts">
  import type { CriterionResult } from '$lib/types';
  
  export let score: 0 | 1 | 2 | 3;
  export let criteriaResults: CriterionResult[];
  
  // Criteria definitions for display
  const criteriaDefinitions = [
    {
      id: 1,
      name: "Mention all parties involved",
      description: "The headline should mention all key parties involved in the crash."
    },
    {
      id: 2,
      name: "Use human terms, not transportation modes",
      description: "Refer to people as humans (driver, cyclist, pedestrian), not vehicles (car, truck, bike)."
    },
    {
      id: 3,
      name: "Active voice",
      description: "Use active voice that clearly shows who did what to whom."
    }
  ];
</script>

<div class="p-6 border border-black">
  <div class="flex flex-col md:flex-row gap-6 mb-6">
    <div class="flex-shrink-0 flex flex-col items-center md:items-start">
      <div class="w-24 h-24 flex items-center justify-center border border-black">
        <div class="text-center">
          <span class="block text-3xl font-black text-black">{score}</span>
          <span class="block text-sm font-bold text-black">of 3</span>
        </div>
      </div>
      <p class="text-center mt-2 text-sm font-bold text-black">Humanization<br>Score</p>
      {#if score === 0}
        <p class="text-xs mt-1 text-red-600 font-bold">Failed at criterion 1</p>
      {/if}
    </div>
    
    <div class="flex-grow">
      <h3 class="font-bold text-black mb-4">Assessment</h3>
      
      {#each criteriaResults as result, index}
        {@const criterion = criteriaDefinitions.find(c => c.id === result.criterionId)}
        {@const isNotEvaluated = index > score}
        
        <div class="mb-4 {isNotEvaluated ? 'opacity-50' : ''}">
          <p>
            <span class="mr-2 font-bold">{result.criterionId}.</span>
            <strong class="{result.passed ? 'text-black' : 'text-red-600'}">
              {criterion?.name}{#if !isNotEvaluated}: {result.passed ? 'Yes' : 'No'} - {result.explanation}{/if}
            </strong>
            {#if isNotEvaluated}
              <span class="text-gray-400"> (Not Evaluated)</span>
            {/if}
          </p>
        </div>
      {/each}
    </div>
  </div>
</div>

<style>

</style>
