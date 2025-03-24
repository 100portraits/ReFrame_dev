<script>
  import { onMount } from 'svelte';

  let article = '';
  let loading = false;
  let results = null;
  let error = '';

  async function analyzeArticle() {
    if (!article.trim()) {
      error = 'Please enter an article with a headline';
      return;
    }

    loading = true;
    error = '';
    
    try {
      // Placeholder for actual API call
      // In a real implementation, you would make an API call to your LLM service here
      // This is just a mock response for demonstration
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
      
      // Mock response - this will be replaced with actual API integration
      results = {
        humanization_score: 0,
        rewritten_headline: "Driver hits and severely injures elderly woman in Los Angeles hit-and-run"
      };
    } catch (err) {
      error = 'Error analyzing article. Please try again.';
      console.error(err);
    } finally {
      loading = false;
    }
  }
</script>
<div class="container mx-auto p-4 max-w-4xl">
  <h1 class="text-7xl font-bold ">ReFrame</h1>

<div class="mb-6">
  <h2 class="mb-3">Curious about crash reporting?</h2>
</div>

<div class="mb-1">
  <label for="article" class="block mb-2 font-medium">Crash report with headline:</label>
  <textarea
    id="article"
    bind:value={article}
    placeholder="Paste your article here..."
    class="w-full h-30 p-3 border border-gray-300 rounded-md"
  ></textarea>
</div>

<button 
  on:click={analyzeArticle}
  class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:bg-gray-400"
  disabled={loading}
>
  {loading ? 'Analyzing...' : 'Analyze Article'}
</button>

{#if error}
  <div class="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
    {error}
  </div>
{/if}

{#if results}
  <div class="mt-6 p-4 border border-gray-300 rounded-md">    
    <div class="mb-3">
      <span class="font-medium">Humanization Score:</span> 
      <span class="text-lg">{results.humanization_score}/6</span>
    </div>
    
    <div>
      <span class="font-medium mb-2">Rewritten Headline:</span>
      <h3 class="my-2 p-2 bg-gray-100 rounded-md text-2xl font-bold">{results.rewritten_headline}</h3>
    </div>
    <div class="mb-4 p-4 rounded-md bg-gray-100">
      <span class="font-medium">What's the difference?:</span>
      <ol class="list-decimal list-inside">
        <li>
          Missing subject: The original headine does not mention all parties involved in the crash.
          
        </li>
        <li>
          Who are they? The original headline does not mention them as humans (e.g. "a man/woman/child"), rather than their vehicles (e.g. "a cyclist/motorcyclist/pedestrian").
        </li>

      </ol>
    </div>
  </div>

  
{/if}

<div class="my-8 p-4 rounded-md bg-gray-100">
  <h2 class="text-xl font-bold mb-3">What is this website?</h2>
  <p class="mb-6">This website is part of a research project at the University of Amsterdam.</p>
  <p class="mb-6">It is a tool to help you rewrite headlines for crash reports.</p>
  <p class="mb-6">It is part of a larger experiment to measure how editorial choices in crash reporting affect the way we think about road danger.</p>
  <p>Read more about us, and our experiment, <a href="/about">here</a>.</p>
</div>

</div>