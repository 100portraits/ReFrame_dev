<script lang="ts">
  import { findHeadlineTerms } from '$lib/types/headlineTerms';
  
  export let headline: string = "";
  export let isDarkBackground: boolean = false; // For styling on red vs white backgrounds
  export let showTooltips: boolean = true; // Allow disabling tooltips for image generation
  
  let activeTooltip: string | null = null;
  let tooltipX: number = 0;
  let tooltipY: number = 0;
  let tooltipContent: string = "";
  
  // Find headline terms to highlight
  $: headlineTermsFound = findHeadlineTerms(headline);
  
  function showTooltip(explanation: string, event: MouseEvent) {
    const target = event.target as HTMLElement;
    const rect = target.getBoundingClientRect();
    
    // Position tooltip above the word
    tooltipX = rect.left + (rect.width / 2);
    tooltipY = rect.top;
    
    tooltipContent = explanation;
    activeTooltip = explanation; // Use explanation as unique key
  }
  
  function hideTooltip() {
    activeTooltip = null;
  }
  
  // Function to create the HTML with spans for highlighted words
  function createHighlightedHeadline() {
    if (!showTooltips || headlineTermsFound.length === 0) {
      return headline;
    }
    
    let result = '';
    let lastIndex = 0;
    
    for (const term of headlineTermsFound) {
      // Add text before the term
      result += headline.substring(lastIndex, term.startIndex);
      
      // Add the term with highlighting
      result += `<span class="headline-term ${isDarkBackground ? 'dark-bg' : 'light-bg'}" data-explanation="${encodeURIComponent(term.explanation)}">${headline.substring(term.startIndex, term.endIndex)}</span>`;
      
      lastIndex = term.endIndex;
    }
    
    // Add remaining text
    result += headline.substring(lastIndex);
    
    return result;
  }
  
  function handleMouseOver(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (target.classList.contains('headline-term')) {
      const explanation = target.getAttribute('data-explanation');
      if (explanation) {
        showTooltip(decodeURIComponent(explanation), event);
      }
    }
  }
  
  function handleMouseOut(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (target.classList.contains('headline-term')) {
      hideTooltip();
    }
  }
</script>

<div class="headline-container" on:mouseover={handleMouseOver} on:mouseout={handleMouseOut}>
  <div class="headline-content">
    {@html createHighlightedHeadline()}
  </div>
  
  {#if activeTooltip && showTooltips}
    <div class="tooltip" style="left: {tooltipX}px; top: {tooltipY}px;">
      <div class="tooltip-content">
        <p>{tooltipContent}</p>
      </div>
    </div>
  {/if}
</div>

<style>
  .headline-container {
    position: relative;
    display: inline;
  }
  
  .headline-content {
    display: inline;
  }
  
  :global(.headline-term) {
    text-decoration: underline;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  /* For dark backgrounds (red background, white text) */
  :global(.headline-term.dark-bg) {
    color: white;
    text-decoration-color: white;
  }
  
  :global(.headline-term.dark-bg:hover) {
    background-color: rgba(255, 255, 255, 0.15);
  }
  
  /* For light backgrounds (white background, black text) */
  :global(.headline-term.light-bg) {
    color: #D32F2F;
    text-decoration-color: #D32F2F;
  }
  
  :global(.headline-term.light-bg:hover) {
    background-color: rgba(211, 47, 47, 0.1);
  }
  
  .tooltip {
    position: fixed;
    transform: translate(-50%, -100%);
    z-index: 1000;
    max-width: 300px;
    margin-top: -10px;
    filter: drop-shadow(0 2px 5px rgba(0, 0, 0, 0.15));
    pointer-events: none;
  }
  
  .tooltip-content {
    background-color: white;
    border: 1px solid #ddd;
    color: #333;
    padding: 0.75rem 1rem;
    border-radius: 4px;
    position: relative;
    font-size: 0.9rem;
    line-height: 1.4;
  }
  
  /* Arrow pointing down */
  .tooltip-content:after {
    content: "";
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    border-width: 8px 8px 0;
    border-style: solid;
    border-color: white transparent transparent;
  }
  
  .tooltip p {
    margin: 0;
  }
</style>