<script lang="ts">
  import { onMount, tick } from 'svelte';
  import html2canvas from 'html2canvas-pro';
  import HighlightedHeadline from './HighlightedHeadline.svelte';
  
  let { originalHeadline, improvedHeadline, score, changes, originalExplanation } = $props<{
    originalHeadline: string;
    improvedHeadline: string;
    score: 0 | 1 | 2 | 3;
    changes: Array<{
      criterionId: 1 | 2 | 3;
      explanation: string;
    }>;
    originalExplanation: Array<{
      criterionId: 1 | 2 | 3;
      explanation: string;
    }>;
  }>();
  
  let canvasElement: HTMLDivElement;
  let downloadLink: HTMLAnchorElement;
  
  let showDifference = $state(false);
  let isGenerating = $state(false);
  
  // Track expanded criteria state for both sides
  let expandedOriginalCriteria = $state<number[]>([]);
  let expandedHumanizedCriteria = $state<number[]>([]);
  
  // Toggle expansion of criteria
  function toggleOriginalCriterion(criterionId: number) {
    // Don't allow toggling of criteria that are disabled due to tiered approach
    if (criterionId === 2 && !isCriterionMetInOriginal(1)) return;
    if (criterionId === 3 && (!isCriterionMetInOriginal(1) || !isCriterionMetInOriginal(2))) return;
    
    if (expandedOriginalCriteria.includes(criterionId)) {
      expandedOriginalCriteria = expandedOriginalCriteria.filter(id => id !== criterionId);
    } else {
      expandedOriginalCriteria = [...expandedOriginalCriteria, criterionId];
    }
  }
  
  function toggleHumanizedCriterion(criterionId: number) {
    if (expandedHumanizedCriteria.includes(criterionId)) {
      expandedHumanizedCriteria = expandedHumanizedCriteria.filter(id => id !== criterionId);
    } else {
      expandedHumanizedCriteria = [...expandedHumanizedCriteria, criterionId];
    }
  }
  
  // Get explanation for a criterion
  function getHumanizedExplanationForCriterion(criterionId: number): string {
    const change = changes.find((c: { criterionId: 1 | 2 | 3; explanation: string }) => c.criterionId === criterionId);
    return change ? change.explanation : "This criterion is met in the original headline.";
  }

  function getOriginalExplanationForCriterion(criterionId: number): string {
    const explanation = originalExplanation.find((c: { criterionId: 1 | 2 | 3; explanation: string }) => c.criterionId === criterionId);
    return explanation ? explanation.explanation : "This criterion is met in the original headline.";
  }

  async function downloadGeneratedImage() {
    if (!canvasElement) {
      console.error('Element to capture not found for image generation.');
      alert('Error: Could not find content to generate image from.');
      return;
    }

    isGenerating = true;
    await tick();

    try {
      const canvas = await html2canvas(canvasElement, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        logging: false
      });
      const imageUrl = canvas.toDataURL('image/png');
      
      downloadLink.href = imageUrl;
      downloadLink.download = 'reframe-headline-comparison.png';
      downloadLink.click();
    } catch (err) {
      console.error('Error generating share image:', err);
      alert('Could not generate share image. Please try again.');
    } finally {
      isGenerating = false;
    }
  }
  
  // Helper function to check if a criterion is met in the original headline
  function isCriterionMetInOriginal(criterionId: 1 | 2 | 3): boolean {
    return !changes.some((change: { criterionId: 1 | 2 | 3; explanation: string }) => change.criterionId === criterionId);
  }
  
  // Helper function to determine if a criterion should be disabled in the tiered approach
  function isOriginalCriterionDisabled(criterionId: number): boolean {
    if (criterionId === 1) return false; // First criterion is always evaluated
    if (criterionId === 2) return !isCriterionMetInOriginal(1); // Second criterion depends on first
    if (criterionId === 3) return !isCriterionMetInOriginal(1) || !isCriterionMetInOriginal(2); // Third depends on first and second
    return false;
  }
</script>

<div class="mt-8">
  <!-- Image Preview (static structure, captured by html2canvas) -->
  <div class="mt-8 ">
    <div bind:this={canvasElement} class="image-render-source bg-white border-8 border-black ">
      <div class="flex flex-col md:flex-row w-full">
        <!-- Left Column: Original - Red background with white text -->
        <div class="w-full md:w-1/2 bg-red-600 px-6 py-4 md:p-12 border-b-2 md:border-b-0 md:border-r-2 border-black">
          <h3 class="text-md sm:text-2xl md:text-3xl font-black text-white mb-2 md:mb-6 uppercase">Original</h3>
          <p class="text-md sm:text-3xl md:text-3xl lg:text-4xl text-white font-semibold md:font-bold leading-tight break-words">
            <HighlightedHeadline 
              headline={originalHeadline} 
              isDarkBackground={true}
              showTooltips={!isGenerating}
              />
          </p>
          
          <!-- Criteria list for original headline -->
          <div class="mt-6 space-y-5">
            <!-- Criterion 1: Mention all parties involved -->
            <div>
              <button 
                class="w-full flex items-center text-left cursor-pointer" 
                onclick={() => toggleOriginalCriterion(1)}
              >
                <div class={`w-8 h-8 flex items-center justify-center border border-white ${isCriterionMetInOriginal(1) ? 'bg-white' : 'bg-transparent'}`}>
                  {#if isCriterionMetInOriginal(1)}
                    <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
                    </svg>
                  {:else}
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  {/if}
                </div>
                <span class="ml-3 text-white">Mention all parties involved</span>
                <svg class="w-5 h-5 ml-auto text-white transform transition-transform duration-200 {expandedOriginalCriteria.includes(1) ? 'rotate-180' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              
              {#if expandedOriginalCriteria.includes(1)}
                <div class="pl-11 mt-2 text-white text-sm border-l-2 border-white ml-4">
                  {#if !isCriterionMetInOriginal(1)}
                    {getOriginalExplanationForCriterion(1)}
                  {:else}
                    This criterion is met in the original headline.
                  {/if}
                </div>
              {/if}
            </div>
            
            <!-- Criterion 2: Uses human terms -->
            <div>
              <div 
                class="w-full flex items-center text-left {!isOriginalCriterionDisabled(2) ? 'cursor-pointer' : 'opacity-50 cursor-not-allowed'}" 
                onclick={() => !isOriginalCriterionDisabled(2) && toggleOriginalCriterion(2)}
              >
                <div class={`w-8 h-8 flex items-center justify-center border border-white ${isOriginalCriterionDisabled(2) ? 'bg-transparent' : isCriterionMetInOriginal(2) ? 'bg-white' : 'bg-transparent'}`}>
                  {#if !isOriginalCriterionDisabled(2) && isCriterionMetInOriginal(2)}
                    <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
                    </svg>
                  {:else if !isOriginalCriterionDisabled(2)}
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  {:else}
                    <span class="text-xs text-white">-</span>
                  {/if}
                </div>
                <span class="ml-3 text-white">Uses human terms</span>
                {#if !isOriginalCriterionDisabled(2)}
                  <svg class="w-5 h-5 ml-auto text-white transform transition-transform duration-200 {expandedOriginalCriteria.includes(2) ? 'rotate-180' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                {/if}
              </div>
              
              {#if !isOriginalCriterionDisabled(2) && expandedOriginalCriteria.includes(2)}
                <div class="pl-11 mt-2 text-white text-sm border-l-2 border-white ml-4">
                  {#if !isCriterionMetInOriginal(2)}
                    {getOriginalExplanationForCriterion(2)}
                  {:else}
                    This criterion is met in the original headline.
                  {/if}
                </div>
              {/if}
            </div>
            
            <!-- Criterion 3: Active voice -->
            <div>
              <div 
                class="w-full flex items-center text-left {!isOriginalCriterionDisabled(3) ? 'cursor-pointer' : 'opacity-50 cursor-not-allowed'}" 
                onclick={() => !isOriginalCriterionDisabled(3) && toggleOriginalCriterion(3)}
              >
                <div class={`w-8 h-8 flex items-center justify-center border border-white ${isOriginalCriterionDisabled(3) ? 'bg-transparent' : isCriterionMetInOriginal(3) ? 'bg-white' : 'bg-transparent'}`}>
                  {#if !isOriginalCriterionDisabled(3) && isCriterionMetInOriginal(3)}
                    <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
                    </svg>
                  {:else if !isOriginalCriterionDisabled(3)}
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  {:else}
                    <span class="text-xs text-white">-</span>
                  {/if}
                </div>
                <span class="ml-3 text-white">Active voice</span>
                {#if !isOriginalCriterionDisabled(3)}
                  <svg class="w-5 h-5 ml-auto text-white transform transition-transform duration-200 {expandedOriginalCriteria.includes(3) ? 'rotate-180' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                {/if}
              </div>
              
              {#if !isOriginalCriterionDisabled(3) && expandedOriginalCriteria.includes(3)}
                <div class="pl-11 mt-2 text-white text-sm border-l-2 border-white ml-4">
                  {#if !isCriterionMetInOriginal(3)}
                    {getOriginalExplanationForCriterion(3)}
                  {:else}
                    This criterion is met in the original headline.
                  {/if}
                </div>
              {/if}
            </div>
          </div>
        </div>
        
        <!-- Right Column: Humanized - White background with black text -->
        <div class="w-full md:w-1/2 bg-white px-6 py-4 md:p-12">
          <h3 class="text-md sm:text-2xl md:text-3xl font-black text-black mb-2 md:mb-6 uppercase">Humanized</h3>
          <p class="text-md sm:text-3xl md:text-3xl lg:text-4xl text-black font-semibold md:font-bold leading-tight break-words">
            <HighlightedHeadline 
              headline={improvedHeadline} 
              isDarkBackground={false}
              showTooltips={!isGenerating}
            />
          </p>
          
          <!-- Criteria list for humanized headline - all have checkmarks -->
          <div class="mt-6 space-y-5">
            <!-- Criterion 1: Mention all parties involved -->
            <div>
              <button 
                class="w-full flex items-center text-left cursor-pointer" 
                onclick={() => toggleHumanizedCriterion(1)}
              >
                <div class="w-8 h-8 flex items-center justify-center border border-black bg-red-600">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <span class="ml-3 text-black">Mention all parties involved</span>
                <svg class="w-5 h-5 ml-auto text-black transform transition-transform duration-200 {expandedHumanizedCriteria.includes(1) ? 'rotate-180' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              
              {#if expandedHumanizedCriteria.includes(1)}
                <div class="pl-11 mt-2 text-black text-sm border-l-2 border-black ml-4">
                  {#if changes.some((c: { criterionId: 1 | 2 | 3; explanation: string }) => c.criterionId === 1)}
                    {getHumanizedExplanationForCriterion(1)}
                  {:else}
                    All parties involved are properly mentioned in this headline.
                  {/if}
                </div>
              {/if}
            </div>
            
            <!-- Criterion 2: Uses human terms -->
            <div>
              <button 
                class="w-full flex items-center text-left cursor-pointer" 
                onclick={() => toggleHumanizedCriterion(2)}
              >
                <div class="w-8 h-8 flex items-center justify-center border border-black bg-red-600">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <span class="ml-3 text-black">Uses human terms</span>
                <svg class="w-5 h-5 ml-auto text-black transform transition-transform duration-200 {expandedHumanizedCriteria.includes(2) ? 'rotate-180' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              
              {#if expandedHumanizedCriteria.includes(2)}
                <div class="pl-11 mt-2 text-black text-sm border-l-2 border-black ml-4">
                  {#if changes.some((c: { criterionId: 1 | 2 | 3; explanation: string }) => c.criterionId === 2)}
                    {getHumanizedExplanationForCriterion(2)}
                  {:else}
                    Human terms are properly used in this headline.
                  {/if}
                </div>
              {/if}
            </div>
            
            <!-- Criterion 3: Active voice -->
            <div>
              <button 
                class="w-full flex items-center text-left cursor-pointer" 
                onclick={() => toggleHumanizedCriterion(3)}
              >
                <div class="w-8 h-8 flex items-center justify-center border border-black bg-red-600">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <span class="ml-3 text-black">Active voice</span>
                <svg class="w-5 h-5 ml-auto text-black transform transition-transform duration-200 {expandedHumanizedCriteria.includes(3) ? 'rotate-180' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              
              {#if expandedHumanizedCriteria.includes(3)}
                <div class="pl-11 mt-2 text-black text-sm border-l-2 border-black ml-4">
                  {#if changes.some((c: { criterionId: 1 | 2 | 3; explanation: string }) => c.criterionId === 3)}
                    {getHumanizedExplanationForCriterion(3)}
                  {:else}
                    Active voice is properly used in this headline.
                  {/if}
                </div>
              {/if}
            </div>
          </div>
        </div>
      </div>
      
      <div class="bg-black p-4 text-white flex justify-between items-center">
        <div class="text-sm md:text-lg">reframe-dev.pages.dev</div>
        <div class="text-sm md:text-lg">tell the <span class="text-amber-500">human</span> story</div>
      </div>
    </div>
    
    <div class="p-4  text-center">
      <button 
        onclick={downloadGeneratedImage} 
        class="px-8 py-3 bg-white text-black font-bold border-2 border-black hover:bg-red-600 hover:text-white hover:border-white transition-all disabled:opacity-75 disabled:cursor-not-allowed"
        disabled={isGenerating}
      >
        {#if isGenerating}
          <span class="flex items-center justify-center">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating...
          </span>
        {:else}
          DOWNLOAD IMAGE
        {/if}
      </button>
    </div>
  </div>

  
  <a bind:this={downloadLink} class="hidden" href="#top">Download Image Link</a>
</div>
