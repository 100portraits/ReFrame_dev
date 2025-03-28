<script>
  import { onMount } from 'svelte';
  let article = '';
  let loading = false;
  let results = null;
  let error = '';

  // Get data from the server-side load function
  export const data = async () => {
    const response = await fetch('/api/summary');
    const data = await response.json();
    return data;
  };  

  // Example article data
  const exampleArticles = [
    {
      source: "CTV News Vancouver",
      title: "Cyclist dead after East Vancouver crash",
      content: `Cyclist dead after East Vancouver crash
A man in his 60s died after being hit by a five-tonne truck while riding his bike in East Vancouver Thursday,

First responders were called to the scene at Kingsway and Nanaimo Street around 12:30 p.m. for reports of the crash,

"Despite life-saving attempts by first responders, the cyclist died at the scene," the Vancouver Police Department said in a statement, which added that the driver of the truck remained at the scene.

Anyone with information or dash-cam video is urged to call the Collision Investigation Unit at 604-717-3012.`
    },
    {
      source: "The Straits Times",
      title: "One child killed after car ploughs into London primary school",
      content: `One child killed after car ploughs into London primary school
LONDON - A girl was killed, and several other children were injured on Thursday after a car ploughed into a primary school building in south-west London, triggering a major response by emergency services. 

The crash at the private Study Prep girls' school in Wimbledon, was not being treated by police as terror-related, and the driver – a woman in her 40s who stopped at the scene – was arrested.

She was detained on suspicion of causing death by dangerous driving, London's Metropolitan Police said, confirming the death of the child.


Earlier, the force said seven children and two adults were injured in the crash, and the local MP said he understood several casualties were "being treated as critical".

Mr Stephen Hammond described the crash as "extraordinarily distressing and tragic".

Aerial footage of the scene – not far from where the Wimbledon tennis tournament was taking place – showed a Land Rover car stopped at an angle against the wall of the modern school building.

The vehicle was in a grassy area near what appeared to be coloured play mats and a table.

The police, ambulance and fire service were called to the scene in Camp Road, near Wimbledon Common, after the incident just before 10am (5pm Singapore time).

Witnesses and reporters at the scene said the road outside the school was narrow, and it would normally have been difficult to build up any speed on it.

The Study Prep school takes in girls aged four to 11. It is split into several sites, with the youngest pupils taught in Camp Road, near the Royal Wimbledon Golf Club.

Thursday was the last day of term for children aged four to eight, according to the school's website.



Health Minister Steve Barclay called the incident "distressing".

"My thoughts are with those sadly injured and everyone who has been affected," he added.

London Mayor Sadiq Khan called it "absolutely devastating". 

As well as police, crews from London Fire Brigade, London Ambulance Service and the London Air Ambulance were all called to deal with the incident. AFP`
    },
    {
      source: "NL Times",
      title: "Amsterdam taxi driver in custody after crash sends pedestrian to the hospital",
      content: `Amsterdam taxi driver in custody after crash sends pedestrian to the hospital

One person was injured in Amsterdam after a taxi struck them during the morning rush hour on Monday, police said. The driver of the vehicle was taken into custody for questioning.

The incident happened at about 8:15 a.m. on the west side of Linnaeusstraat near the intersection with Vrolikstraat in Amsterdam-Oost. Several squad cars raced to the scene, and at least two ambulances were dispatched to the location. They injured pedestrian was at the location, and a bicycle on its side was seen on the road.


"The pedestrian was taken to hospital by ambulance," and Amsterdam police spokesperson told NL Times. Details were not released regarding the victim's age, gender, hometown and condition. Both ambulances left the site of the collision with their emergency lights flashing by 8:45 a.m.

The southbound lanes of Linnaeusstraat remained closed off for some time as the police investigation continued. The driver of the taxi was speaking to investigators at the scene. He was placed into custody while the investigation continues, police said.


In most cases, suspects in custody can be held for up to three days in detention before appearing before a magistrate during a criminal investigation. The magistrate can order suspects held for up to 14 days of pre-trial detention before they appear before a three-judge panel at a district court for arraignment`
    }
  ];

  // Function to select an example
  function selectExample(index) {
    article = exampleArticles[index].content;
    // Reset results when selecting a new example
    results = null;
  }

  async function analyzeArticle() {
    if (!article.trim()) {
      error = 'Please enter an article with a headline';
      return;
    }

    loading = true;
    error = '';
    
    try {
      // Extract headline from article (assuming first line is headline)
      const lines = article.trim().split('\n');
      const headline = lines[0].trim();
      const article_text = lines.slice(1).join('\n').trim();
      
      console.log('Extracted headline:', headline);
      console.log('Extracted article text:', article_text);
      
      // Call our own server endpoint instead of OpenRouter directly
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ headline, article_text })
      });
      
      console.log('API response status:', response.status);
      const data = await response.json();
      console.log('API response data:', data);
      
      if (!response.ok) {
        console.error('API error:', data.error);
        throw new Error(data.error || 'Failed to get response from API');
      }
      
      const aiResponse = data.choices[0].message.content;
      console.log('AI response content:', aiResponse);
      
      // Check if it's a crash article
      const isCrashArticle = aiResponse.includes("### Is Crash Article: Yes");
      
      if (!isCrashArticle) {
        // Extract explanation for non-crash articles
        const notCrashExplanationMatch = aiResponse.match(/### Explanation:\s*\n([\s\S]+?)(?=\n###|$)/s);
        const notCrashSuggestionMatch = aiResponse.match(/### Suggestion:\s*\n([\s\S]+?)(?=\n###|$)/s);
        
        const explanation = notCrashExplanationMatch ? notCrashExplanationMatch[1].trim() : '';
        const suggestion = notCrashSuggestionMatch ? notCrashSuggestionMatch[1].trim() : '';
        
        results = {
          is_crash_article: false,
          explanation: explanation,
          suggestion: suggestion
        };
        
        console.log('Not a crash article:', results);
        loading = false;
        return;
      }
      
      // Parse the AI response to extract the rewritten headline and explanation
      // Using a more robust parsing approach for the new format with ### headers
      const originalHeadlineMatch = aiResponse.match(/### Original Headline:?\s*\n([^\n]+)/);
      const rewrittenHeadlineMatch = aiResponse.match(/### Rewritten Headline:?\s*\n([^\n]+)/);
      const explanationMatch = aiResponse.match(/### Explanation:?\s*\n([\s\S]+?)(?=\n###|$)/s);
      const assessmentMatch = aiResponse.match(/### Original Headline Assessment:?\s*\n([\s\S]+?)(?=\n###)/s);
      const criteriaMet = aiResponse.match(/### Criteria Met:?\s*(\d+)/);
      
      console.log('Original headline match:', originalHeadlineMatch);
      console.log('Assessment match:', assessmentMatch);
      console.log('Criteria met:', criteriaMet);
      console.log('Rewritten headline match:', rewrittenHeadlineMatch);
      console.log('Explanation match:', explanationMatch);
      
      // Get the rewritten headline, fallback to original if not found
      const rewrittenHeadline = rewrittenHeadlineMatch ? rewrittenHeadlineMatch[1].trim() : headline;
      
      // Get the original headline from the AI response, fallback to the extracted headline
      const originalHeadline = originalHeadlineMatch ? originalHeadlineMatch[1].trim() : headline;
      
      // Format the explanation to preserve the bullet points and formatting
      let explanation = '';
      if (explanationMatch) {
        explanation = explanationMatch[1].trim();
      }
      
      // Get the assessment of original headline
      let assessment = '';
      if (assessmentMatch) {
        assessment = assessmentMatch[1].trim();
      }
      
      // Get the number of criteria met by the original headline
      let originalCriteriaMet = 0;
      if (criteriaMet && criteriaMet[1]) {
        originalCriteriaMet = parseInt(criteriaMet[1]);
      }
      
      console.log('Parsed original headline:', originalHeadline);
      console.log('Parsed rewritten headline:', rewrittenHeadline);
      console.log('Parsed explanation:', explanation);
      console.log('Parsed assessment:', assessment);
      console.log('Original criteria met:', originalCriteriaMet);
      
      // Calculate a humanization score (0-4) based on the criteria met
      // If the headline was rewritten, it now meets all 4 criteria
      const humanizationScore = rewrittenHeadline !== originalHeadline ? 4 : originalCriteriaMet;
      
      console.log('Calculated humanization score:', humanizationScore);
      
      results = {
        is_crash_article: true,
        humanization_score: humanizationScore,
        original_headline: originalHeadline,
        rewritten_headline: rewrittenHeadline,
        explanation: explanation,
        assessment: assessment,
        original_criteria_met: originalCriteriaMet
      };
      
      console.log('Final results:', results);
    } catch (err) {
      console.error('Error in analyzeArticle:', err);
      error = 'Error analyzing article. Please try again.';
      console.error(err);
    } finally {
      loading = false;
    }
  }
</script>

<div class="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 py-22 px-4 sm:px-6 lg:px-8">
  <div class="max-w-5xl mx-auto">
    <!-- Header -->
    <div class="text-center mb-12">
      <h1 class="text-7xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent drop-shadow-sm">ReFrame</h1>
      <p class="mt-4 text-xl text-indigo-900 font-medium">Humanizing crash headlines for more accurate reporting</p>
    </div>

    <!-- Main Content -->
    <div class="bg-white rounded-2xl shadow-xl p-8 mb-12">
      
      <!-- Example Articles -->
      <div class="mb-8">
        <p class="text-lg mb-4">Choose an example or paste your own article:</p>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {#each exampleArticles as example, i}
            <button 
              on:click={() => selectExample(i)}
              class="p-4 flex flex-col text-left rounded-xl transition-all hover:scale-102 hover:shadow-md border-2 border-transparent hover:border-blue-400"
              style="background: linear-gradient(to bottom right, #EEF2FF, #E0E7FF);"
            >
              <span class="text-xs uppercase tracking-wide text-indigo-600 font-semibold mb-2">{example.source}</span>
              <span class="font-bold text-gray-800">{example.title}</span>
            </button>
          {/each}
        </div>
        
        <!-- Article Input -->
        <div class="mb-6">
          <label for="article" class="block text-lg font-medium text-gray-700 mb-3">Crash report with headline:</label>
          <textarea
            id="article"
            bind:value={article}
            placeholder="Paste your article here or select an example above..."
            class="w-full h-48 p-4 text-lg border-2 border-indigo-100 rounded-xl focus:border-indigo-400 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition-all"
          ></textarea>
        </div>
        
        <!-- Submit Button -->
        <button 
          on:click={analyzeArticle}
          class="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-lg font-semibold rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
          disabled={loading}
        >
          {#if loading}
            <span class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing...
            </span>
          {:else}
            Analyze Article
          {/if}
        </button>

        <!-- Error Message -->
        {#if error}
          <div class="mt-4 p-4 bg-red-100 border border-red-300 text-red-700 rounded-xl">
            {error}
          </div>
        {/if}
      </div>
    </div>

    <!-- Results Section -->
    {#if results}
      {#if results.is_crash_article === false}
        <div class="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <div class="p-6 rounded-xl bg-yellow-50 border-2 border-yellow-200">
            <h3 class="text-2xl font-bold text-yellow-800 mb-4">Not a Traffic Crash Article</h3>
            <div class="mb-6 text-lg text-yellow-700">
              <p>{results.explanation}</p>
            </div>
            <div class="p-4 bg-white rounded-lg border border-yellow-200 font-medium text-gray-700">
              <p>{results.suggestion}</p>
            </div>
          </div>
        </div>
      {:else}
        <div class="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <!-- Original Headline Section -->
          <div class="mb-10">
            <h3 class="text-2xl font-bold text-gray-800 mb-6">Original Headline</h3>
            <div class="p-6 rounded-xl bg-gray-50 border-2 border-gray-200 mb-6">
              <h4 class="text-xl font-semibold text-gray-800">{results.original_headline}</h4>
            </div>
            
            <!-- Score and Assessment -->
            <div class="flex flex-col md:flex-row gap-6">
              <div class="flex-shrink-0">
                <div class="rounded-full w-24 h-24 flex items-center justify-center border-4 border-indigo-100 bg-white">
                  <div class="text-center">
                    <span class="block text-3xl font-bold text-indigo-600">{results.original_criteria_met}</span>
                    <span class="block text-sm text-gray-500">of 4</span>
                  </div>
                </div>
                <p class="text-center mt-2 text-sm font-medium text-gray-600">Humanization<br>Score</p>
              </div>
              
              {#if results.assessment}
                <div class="flex-grow p-6 rounded-xl bg-indigo-50 border-2 border-indigo-100">
                  <h4 class="font-bold text-indigo-800 mb-4">Assessment</h4>
                  <div class="text-gray-700 assessment-text">
                    {@html results.assessment.replace(/\n/g, '<br>').replace(/\*\*([^*]+)\*\*/g, '<strong class="text-indigo-700">$1</strong>')}
                  </div>
                </div>
              {/if}
            </div>
          </div>
          
          <!-- Improved Headline Section -->
          <div class="mb-6">
            <h3 class="text-2xl font-bold text-gray-800 mb-6">Improved Headline</h3>
            <div class="p-6 rounded-xl bg-green-50 border-2 border-green-200 mb-6">
              <h4 class="text-2xl font-bold text-green-800">{results.rewritten_headline}</h4>
            </div>
            
            <div class="p-6 rounded-xl bg-blue-50 border-2 border-blue-100">
              <h4 class="font-bold text-blue-800 mb-4">What's the difference?</h4>
              <div class="text-gray-700 explanation-text">
                {@html results.explanation.replace(/\n/g, '<br>').replace(/\*\*([^*]+)\*\*/g, '<strong class="text-blue-700">$1</strong>')}
              </div>
            </div>
          </div>
        </div>
      {/if}
    {/if}

    <!-- About Section -->
    <div class="bg-indigo-800 text-white rounded-2xl shadow-xl p-8">
      <h2 class="text-2xl font-bold mb-4">About ReFrame</h2>
      <div class="space-y-4 text-lg">
        <p>ReFrame is part of a research project at the University of Amsterdam exploring how language shapes our perception of road safety.</p>
        <p class="pt-4"><a href="/experiment" class="inline-block px-6 py-3 bg-white text-indigo-800 font-bold rounded-lg hover:bg-indigo-100 transition-colors">Participate in our experiment</a></p>
      </div>
    </div>
  </div>
</div>

<style>
  /* Custom styles for the assessment and explanation text */
  :global(.assessment-text strong), :global(.explanation-text strong) {
    font-weight: 600;
  }
  
  /* Add subtle hover effect for buttons */
  button {
    transition: all 0.2s ease;
  }
  
  /* Custom scaling on hover */
  .hover\:scale-102:hover {
    transform: scale(1.02);
  }
</style>