<script lang="ts">
  import { tick } from 'svelte';
  import Header from '$lib/components/Header.svelte';
  import ExampleArticles from '$lib/components/ExampleArticles.svelte';
  import HeadlineForm from '$lib/components/HeadlineForm.svelte';
  import AnalysisResult from '$lib/components/AnalysisResult.svelte';
  import { analyzeHeadline } from '$lib/services/llmService';
  import type { HeadlineAnalysis } from '$lib/types';
  
  // State using Svelte 5 runes
  let isAnalyzing = $state(false);
  let analysis = $state<HeadlineAnalysis | null>(null);
  
  // State for form inputs, to be updated by ExampleArticles
  let headlineInput = $state('');
  let articleBodyInput = $state('');

  // Handle example selection
  function handleExampleSelect(event: CustomEvent<{ headline: string; articleBody: string }>) {
    headlineInput = event.detail.headline;
    articleBodyInput = event.detail.articleBody;
    analysis = null; // Clear previous analysis when a new example is selected
  }

  // Handle form submission
  async function handleAnalyze(event: CustomEvent<{ headline: string; articleBody: string }>) {
    isAnalyzing = true;

    // Clear previous analysis to ensure UI updates to loading state if analyzing again
    if (analysis !== null) {
      analysis = null;
      await tick(); // Allow DOM to clear previous results
    }
    
    try {
      // Call the LLM service
      const result = await analyzeHeadline({
        headline: event.detail.headline,
        articleBody: event.detail.articleBody
      });
      
      // Update state with analysis results
      analysis = result.analysis;

      // After analysis is set and UI should update to show results
      await tick(); // Wait for Svelte to render the AnalysisResult component

      if (analysis) { // If there's any analysis result (relevant or not)
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }

    } catch (error) {
      console.error('Analysis failed:', error);
      // Could add error state handling here
    } finally {
      isAnalyzing = false;
    }
  }
  
  // Reset the analysis to allow for a new submission
  function resetAnalysis(event: Event) {
    //prevent default form submission
    event.preventDefault();
    analysis = null;
    headlineInput = '';
    articleBodyInput = '';

    //scroll to the top of the page
    window.scrollTo({ top: 0, behavior: 'smooth',  });
  }
</script>

<div class="min-h-screen bg-white py-10 px-4 sm:px-6 lg:px-8">
  <div class="max-w-5xl mx-auto">
    <Header />
    
    <main>
      {#if !analysis}
        <div class="form-container bg-white border border-black p-8 mb-8">
          <ExampleArticles on:select={handleExampleSelect} />
          <HeadlineForm 
            headline={headlineInput} 
            articleBody={articleBodyInput} 
            on:analyze={handleAnalyze}
            isAnalyzing={isAnalyzing}
          />
        </div>
      {:else}
        <div class="results-container">
          <AnalysisResult {analysis} />
          
          <div class="mt-8 text-center">
            <button 
              onclick={(event) => resetAnalysis(event as Event)}
              class="px-8 py-4 bg-black text-white text-lg font-semibold border border-black hover:bg-white hover:text-red-700 hover:border-red-700 transition-all"
            >
              Analyze Another Headline
            </button>
          </div>
        </div>
      {/if}
    </main>
    
    <footer class="mt-16 py-6 border-t border-black text-center">
      <div class="bg-white border border-black p-8">
        <h2 class="text-2xl font-bold mb-4 text-black">About ReFrame</h2>
        <div class="space-y-4 text-lg">
          <p>ReFrame is part of a research project at the University of Amsterdam exploring how language shapes our perception of road safety.</p>
          <div class="pt-4">
            <a href="tel:+31616972205"
              class="inline-block px-6 py-3 bg-black text-white border border-black hover:bg-red-700 hover:border-red-700 transition-all"
            >
              Send me a message (sahir) at +31 6 1697 2205 if you have any questions or want to read more!
            </a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</div>

<style>
  :global(body) {
    font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif;
    background-color: #FFFFFF;
    color: #000000;
  }
</style>
