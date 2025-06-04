<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { AnalysisRequest } from '$lib/types';
  import { Search } from '@lucide/svelte';
  const dispatch = createEventDispatcher<{
    analyze: AnalysisRequest;
  }>();
  
  // Props for headline and articleBody, bound from parent
  let { headline = '', articleBody = '', isAnalyzing = false } = $props<{
    headline?: string;
    articleBody?: string;
    isAnalyzing?: boolean;
  }>();
  
  function handleSubmit(event: Event) {
    // Access headline and articleBody directly as they are props
    if (!headline.trim() || !articleBody.trim()) return;
    //prevent default form submission
    event.preventDefault();
    dispatch('analyze', {
      headline: headline.trim(),
      articleBody: articleBody.trim()
    });
  }
</script>

<form onsubmit={handleSubmit}>
  <div class="mb-6">
    <label for="headline" class="block text-lg font-medium text-black mb-3">Headline</label>
    <input 
      id="headline"
      type="text" 
      bind:value={headline} 
      placeholder="Enter a headline to analyze or select an example" 
      class="w-full p-4 text-lg border border-black focus:outline-none transition-all"
    />
  </div>
  
  <div class="mb-6">
    <label for="article-body" class="block text-lg font-medium text-black mb-3">Article Body</label>
    <textarea 
      id="article-body"
      bind:value={articleBody} 
      placeholder="Enter or paste article body text here or select an example" 
      rows="6"
      class="w-full p-4 text-lg border border-black focus:outline-none transition-all h-48"
    ></textarea>
  </div>
  
  <div class="">
    <button 
      type="submit" 
      class="w-full  px-8 py-4 bg-red-700 text-white text-xl font-normal border border-black hover:bg-white hover:text-red-700 hover:border-red-700 transition-all disabled:opacity-70 disabled:cursor-not-allowed" 
      disabled={!headline.trim() || !articleBody.trim() || isAnalyzing}
    >
      {#if isAnalyzing}
        <span class="flex items-center justify-center">
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Analyzing...
        </span>
      {:else}
      <span class="flex items-center justify-center">
        Analyze Text
        <Search class="w-5 h-5 ml-2" />
      </span>
      {/if}
    </button>
  </div>
</form>

<style>

</style>
