<script lang="ts">
  import { onMount } from 'svelte';
  import html2canvas from 'html2canvas-pro';
  
  let { originalHeadline, improvedHeadline, score, changes } = $props<{
    originalHeadline: string;
    improvedHeadline: string;
    score: 0 | 1 | 2 | 3;
    changes: Array<{
      criterionId: 1 | 2 | 3;
      explanation: string;
    }>;
  }>();
  
  let canvasElement: HTMLDivElement;
  let downloadLink: HTMLAnchorElement;
  
  let showDifference = $state(false);
  let isGenerating = $state(false);

  async function downloadGeneratedImage() {
    if (!canvasElement) {
      console.error('Element to capture not found for image generation.');
      alert('Error: Could not find content to generate image from.');
      return;
    }

    isGenerating = true;
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
</script>

<div class="mt-8">
  <!-- Image Preview (static structure, captured by html2canvas) -->
  <div class="mt-8 ">
    <div bind:this={canvasElement} class="image-render-source bg-white border-8 border-black ">
      <div class="flex flex-col md:flex-row w-full">
        <!-- Left Column: Original - Red background with white text -->
        <div class="w-full md:w-1/2 bg-red-600 px-6 py-4 md:p-12 border-b-2 md:border-b-0 md:border-r-2 border-black">
          <h3 class="text-md sm:text-2xl md:text-3xl font-black text-white mb-2 md:mb-6 uppercase">Original Headline</h3>
          <p class="text-md sm:text-3xl md:text-3xl lg:text-4xl text-white font-semibold md:font-bold leading-tight break-words">{originalHeadline}</p>
          
          <div class="mt-4 md:mt-8 flex items-center">
            <div class="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 flex items-center justify-center border-2 border-white bg-transparent">
              <span class="text-xl sm:text-2xl md:text-3xl font-black text-white">{score}</span>
            </div>
            <span class="ml-3 text-base sm:text-lg md:text-xl font-bold text-white">/ 3 CRITERIA MET</span>
          </div>
        </div>
        
        <!-- Right Column: Humanized - White background with black text -->
        <div class="w-full md:w-1/2 bg-white px-6 py-4 md:p-12">
          <h3 class="text-md sm:text-2xl md:text-3xl font-black text-black mb-2 md:mb-6 uppercase">Humanized Headline</h3>
          <p class="text-md sm:text-3xl md:text-3xl lg:text-4xl text-black font-semibold md:font-bold leading-tight break-words">{improvedHeadline}</p>
          
          <div class="mt-4 md:mt-8 flex items-center">
            <div class="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 flex items-center justify-center border-2 border-black bg-transparent">
              <span class="text-xl sm:text-2xl md:text-3xl font-black text-black">3</span>
            </div>
            <span class="ml-3 text-base sm:text-lg md:text-xl font-bold text-black">/ 3 CRITERIA MET</span>
          </div>
        </div>
      </div>
      
      <div class="bg-black p-4 md:p-8 text-white text-center">
        <p class="text-xs md:text-xl font-bold">ReFrame • humanizing crash headlines</p>
        <p class="text-[12px] md:text-sm">
          reframe-dev.pages.dev
        </p>
      </div>
    </div>
    
    <div class="bg-black p-4 text-center">
      <button 
        onclick={downloadGeneratedImage} 
        class="px-8 py-3 bg-white text-black font-bold border-2 border-white hover:bg-red-600 hover:text-white hover:border-white transition-all disabled:opacity-75 disabled:cursor-not-allowed"
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

  <!-- What's the difference section (expandable) -->
  <div class="mt-6 p-6 border border-black">
    <button 
      onclick={() => showDifference = !showDifference} 
      class="w-full flex justify-between items-center text-left font-bold text-black focus:outline-none cursor-pointer"
    >
      <span>What's the difference?</span>
      <svg class="w-5 h-5 transform transition-transform duration-200 {showDifference ? 'rotate-180' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
      </svg>
    </button>
    
    {#if showDifference}
      <div class="mt-4">
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
    {/if}
  </div>
  
  <a bind:this={downloadLink} class="hidden" href="#top">Download Image Link</a>
</div>
