<script>
  import { onMount } from 'svelte';
  import { Chart } from 'chart.js/auto';
  import annotationPlugin from 'chartjs-plugin-annotation';
  Chart.register(annotationPlugin);
  import { getRandomArticle } from '$lib/data/articles';

  let article = null; // Declare the article variable
  let surveyStats = null;
  let chartInstances = [];
  let loading = false;
  let errorMessage = null;
  let isDev = false; // Development mode flag

  onMount(async () => {
    try {
      // Check if user has already completed survey
      const savedResponses = localStorage.getItem('surveyResponses');
      const savedArticle = localStorage.getItem('surveyArticle');
      
      if (savedResponses && savedArticle) {
        // User has already completed survey - load their previous responses and results
        article = JSON.parse(savedArticle);
        surveyQuestions = JSON.parse(savedResponses);
        submitted = true;
        await fetchResults();
      } else {
        // New user - get random article
        article = await getRandomArticle();
      }

      // Check if in development mode (you can modify this condition as needed)
      isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    } catch (error) {
      console.error('Error loading article:', error);
      errorMessage = 'Failed to load article. Please try refreshing the page.';
    }
  });

  // Likert scale options
  const likertOptions = [
    "Strongly disagree",
    "Disagree",
    "Neutral",
    "Agree",
    "Strongly agree"
  ];

  // Survey questions
  const questions = [
    {
      id: 1,
      text: "Traffic crashes are a major source of human suffering.",
      answer: null
    },
    {
      id: 2,
      text: "Traffic crashes are freak accidents and roads are generally safe.",
      answer: null
    },
    {
      id: 3,
      text: "Traffic crashes could often be best avoided by the victim taking greater measures to protect themselves (e.g. wearing a helmet, high visibility).",
      answer: null
    },
    {
      id: 4,
      text: "Risks are a natural part of road use, and anyone on the road has to accept they could be seriously injured.",
      answer: null
    },
    {
      id: 5,
      text: "Motor vehicles are the most practical mode of transport, and roads should prioritize their movement.",
      answer: null
    }
  ];

  let surveyQuestions = JSON.parse(JSON.stringify(questions)); // Deep copy
  let submitted = false;

  function updateAnswer(questionId, value) {
    const questionIndex = surveyQuestions.findIndex(q => q.id === questionId);
    if (questionIndex !== -1) {
      surveyQuestions[questionIndex].answer = value;
    }
  }

  async function submitSurvey() {
    // Check if all questions are answered
    const unansweredQuestions = surveyQuestions.filter(q => q.answer === null);
    
    if (unansweredQuestions.length > 0) {
      const questionNumbers = unansweredQuestions.map(q => q.id).join(', ');
      errorMessage = `Please answer ${unansweredQuestions.length === 1 ? 'question' : 'questions'} ${questionNumbers} before submitting.`;
      return;
    }
    
    // Create unique session ID
    const sessionId = crypto.randomUUID();

    // Prepare data for API
    const surveyData = {
      sessionId,
      articleId: Number(article.id),
      articleTitle: article.title,
      articleContent: article.content,
      articleDate: article.date,
      articleWordCount: Number(article.wordCount),
      isRewritten: typeof article.isRewritten === 'boolean' ? article.isRewritten : false,
      timestamp: new Date().toISOString(),
      responses: surveyQuestions.map(q => ({
        questionId: q.id,
        questionText: q.text,
        answer: q.answer
      }))
    };

    loading = true;
    errorMessage = null;
    
    try {
      // Debug output
      console.log('Article data:', article);
      console.log('Article isRewritten:', typeof article.isRewritten, article.isRewritten);
      console.log('Survey isRewritten:', typeof surveyData.isRewritten, surveyData.isRewritten);
      console.log('Submitting survey data:', surveyData);
      // Submit data to server API endpoint
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(surveyData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit survey');
      }
      
      // Store responses and article in localStorage
      localStorage.setItem('surveyResponses', JSON.stringify(surveyQuestions));
      localStorage.setItem('surveyArticle', JSON.stringify(article));
      
      // Fetch and process results from server
      await fetchResults();
      submitted = true;
    } catch (error) {
      console.error("Error submitting survey:", error);
      errorMessage = error.message || "There was an error submitting your response. Please try again.";
    } finally {
      loading = false;
    }
  }

  async function fetchResults() {
    try {
      // Get aggregated results from server API
      const response = await fetch('/api/summary');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch results');
      }
      
      // Parse the response
      surveyStats = await response.json();
      
      // Create charts after data is ready and component rendered
      setTimeout(createCharts, 100);
      
    } catch (error) {
      console.error("Error fetching results:", error);
      errorMessage = error.message || "There was an error fetching the results. Please try again.";
    }
  }
  
  function createCharts() {
    // Destroy any existing charts
    chartInstances.forEach(chart => chart.destroy());
    chartInstances = [];
    
    if (!surveyStats) return;
    
    // Create a chart for each question
    surveyStats.questionStats.forEach(stat => {
      const canvas = document.getElementById(`chart-q${stat.questionId}`);
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      
      // Find user's answer for this question
      const userAnswer = surveyQuestions.find(q => q.id === stat.questionId)?.answer;

      // Create chart
      const chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Original Text', 'Rewritten Text'],
          datasets: likertOptions.map((option, index) => ({
            label: option,
            data: [
              stat.originalDistribution[index],
              stat.rewrittenDistribution[index]
            ],
            backgroundColor: `rgba(0, 0, 0, ${0.2 + (index * 0.2)})`,
            borderColor: '#000000',
            borderWidth: 1
          }))
        },
        options: {
          indexAxis: 'y', // This makes the bars horizontal
          maintainAspectRatio: false,
          scales: {
            x: {
              stacked: true,
              grid: {
                color: 'rgba(0, 0, 0, 0.1)',
              },
              ticks: {
                precision: 0
              }
            },
            y: {
              stacked: true,
              grid: {
                display: false
              }
            }
          },
          responsive: true,
          plugins: {
            title: {
              display: false
            },
            tooltip: {
              callbacks: {
                title: function(context) {
                  return context[0].dataset.label;
                },
                label: function(context) {
                  const label = context.chart.data.labels[context.dataIndex];
                  return `${label}: ${context.raw} responses`;
                }
              }
            },
            legend: {
              position: 'bottom',
              labels: {
                padding: 20,
                font: {
                  size: 12
                }
              }
            },
            annotation: userAnswer !== null ? {
              annotations: {
                point: {
                  type: 'point',
                  xValue: article.isRewritten ? 
                    stat.rewrittenDistribution.slice(0, userAnswer).reduce((a, b) => a + b, 0) + 
                    stat.rewrittenDistribution[userAnswer] / 2 :
                    stat.originalDistribution.slice(0, userAnswer).reduce((a, b) => a + b, 0) + 
                    stat.originalDistribution[userAnswer] / 2,
                  yValue: article.isRewritten ? 1 : 0,
                  backgroundColor: 'rgba(255, 215, 0, 0.8)',
                  borderColor: 'gold',
                  borderWidth: 2,
                  radius: 6,
                  label: {
                    content: 'Your answer',
                    enabled: true,
                    position: 'top'
                  }
                }
              }
            } : {}
          }
        }
      });
      
      chartInstances.push(chart);
    });
  }

  function goToHeadlineRewriter() {
    // Add navigation logic here
    window.location.href = "/";
  }

  function clearSurveyData() {
    localStorage.removeItem('surveyResponses');
    localStorage.removeItem('surveyArticle');
    window.location.reload();
  }
</script>

<div class="min-h-screen bg-white pt-6 md:pt-12 lg:pt-22 pb-12 px-4 sm:px-6 lg:px-8">
  <div class="max-w-5xl mx-auto">
    <!-- Header -->
    {#if !submitted}
      {#if article}
        <!-- Article Card -->
        <div class="bg-white border border-black overflow-hidden mb-12">
          <div class="bg-black px-8 py-6">
            <h2 class="text-4xl font-bold text-white leading-tight">{article.title}</h2>
            <div class="mt-2 flex items-center text-gray-200 text-sm">
              <span class="mr-4">📅 {new Date(article.date).toLocaleDateString()}</span>
              <span>📝 {article.wordCount} words</span>
            </div>
          </div>
          <div class="p-8">
            <p class="text-xl leading-relaxed text-gray-700 whitespace-pre-line">{article.content}</p>
          </div>
        </div>

        <!-- Survey Section -->
        <div class="bg-white border border-black p-8 mb-12">
          <h3 class="text-2xl font-bold text-gray-800 mb-8">How much do you agree with the following statements?</h3>
          
          <div class="space-y-12">
            {#each surveyQuestions as question, i}
              <div class="border-b border-gray-200 pb-10 {i === surveyQuestions.length - 1 ? 'border-b-0' : ''}">
                <p class="text-xl font-medium text-gray-800 mb-6">{i+1}. {question.text}</p>
                <div class="grid grid-cols-1 sm:grid-cols-5 gap-2 sm:gap-4">
                  {#each likertOptions as option, index}
                    <div class="relative">
                      <label class="flex flex-col items-center cursor-pointer group">
                        <input 
                          type="radio" 
                          name={`question-${question.id}`} 
                          value={index} 
                          on:change={() => updateAnswer(question.id, index)}
                          class="sr-only peer"
                        />
                        <div class="w-full h-12 bg-white border border-black flex items-center justify-center peer-checked:bg-black peer-checked:text-white peer-hover:bg-gray-50 peer-checked:peer-hover:bg-black transition-all px-4">
                          <span class="text-sm font-medium text-center">{option}</span>
                        </div>
                      </label>
                    </div>
                  {/each}
                </div>
              </div>
            {/each}
          </div>

          {#if errorMessage}
            <div class="mt-6 bg-red-50 border border-red-500 text-red-800 px-4 py-3">
              <p class="font-medium">{errorMessage}</p>
            </div>
          {/if}

          <div class="mt-12 flex justify-center">
            <button 
              on:click={submitSurvey} 
              class="px-8 py-4 bg-black text-white text-xl font-semibold border border-black hover:bg-white hover:text-black transition-all disabled:opacity-50"
              disabled={loading}
            >
              {#if loading}
                <span class="flex items-center">
                  <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              {:else}
                Submit Responses
              {/if}
            </button>
          </div>
        </div>
      {:else}
        <div class="bg-white border border-black p-16 flex justify-center items-center">
          <div class="flex flex-col items-center">
            <svg class="animate-spin h-12 w-12 text-black mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p class="text-xl text-gray-800 font-medium">Loading your article...</p>
          </div>
        </div>
      {/if}
    {:else}
      <!-- Results Visualization -->
      <div class="bg-white border border-black p-8 mb-12">
        <div class="p-8 bg-white border border-black mb-8">
          <h3 class="text-4xl font-bold text-black mb-6">Thank you for participating!</h3>
          
          <div class="space-y-8">
            <div class="space-y-4">              
              <p class="text-xl">
                {#if article.isRewritten}
                  The article you read was <span class="font-semibold">rewritten</span> by AI to address six key criteria for more accurate and human-centered crash reporting.
                {:else}
                  The article you read was the <span class="font-semibold">original</span> text. However, half of participants were shown a version rewritten to meet six key criteria.
                {/if}
              </p>

              <details class="cursor-pointer bg-white border border-black p-6">
                <summary class="text-lg font-semibold text-black">View the six key criteria for human-centered crash reporting</summary>
                <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="bg-white p-4 border border-gray-200">
                    <p class="font-medium text-black">1. Comprehensive Coverage</p>
                    <p class="text-gray-700 mt-1">Mentioning all involved parties in the crash</p>
                  </div>
                  <div class="bg-white p-4 border border-gray-200">
                    <p class="font-medium text-black">2. Human-First Language</p>
                    <p class="text-gray-700 mt-1">Referring to parties as humans rather than transportation modes</p>
                  </div>
                  <div class="bg-white p-4 border border-gray-200">
                    <p class="font-medium text-black">3. Human Agency</p>
                    <p class="text-gray-700 mt-1">Making a human the grammatical subject</p>
                  </div>
                  <div class="bg-white p-4 border border-gray-200">
                    <p class="font-medium text-black">4. Clear Attribution</p>
                    <p class="text-gray-700 mt-1">Using active voice that clearly shows who did what to whom</p>
                  </div>
                  <div class="bg-white p-4 border border-gray-200">
                    <p class="font-medium text-black">5. Impact Focus</p>
                    <p class="text-gray-700 mt-1">Including specific physical/psychological consequences</p>
                  </div>
                  <div class="bg-white p-4 border border-gray-200">
                    <p class="font-medium text-black">6. Broader Context</p>
                    <p class="text-gray-700 mt-1">Placing the crash in context of broader safety patterns</p>
                  </div>
                </div>
              </details>

              <p class="text-xl">
                The point of this experiment was to show how subtle changes to the text can affect how readers perceive road danger.  <br> <br>
              </p>
              <p class="text-xl">
                Read more about our project <a href="/about" class="text-black underline hover:no-underline">here</a>.
              </p>
            </div>
          </div>
        </div>
        
        <div class="space-y-8 text-lg">
          <h3 class="text-3xl font-bold text-gray-800 mb-6">Experiment Results</h3>
          
          {#if surveyStats}
            <div class="mb-10">
              <div class="bg-white p-6 border border-black">
                <p class="text-xl mb-2"><strong>Total responses:</strong> {surveyStats.totalResponses}</p>
                <p class="text-xl mb-2"><strong>Rewritten text group:</strong> {surveyStats.rewrittenCount} participants</p>
                <p class="text-xl"><strong>Original text group:</strong> {surveyStats.originalCount} participants</p>
              </div>
            </div>
            
            <p class="text-xl mb-2">The charts below show how responses differ between participants who saw <span class="font-semibold">rewritten text</span> versus those who saw <span class="font-semibold">original text</span>:</p>
            <p class="text-md mb-8">Your responses are highlighted with a gold dot.</p>
            <div class="grid gap-10">
              {#each surveyStats.questionStats as stat}
                <div class="bg-white border border-black p-6">
                  <h4 class="text-lg font-medium text-gray-800 mb-6 chart-title">
                    Q{stat.questionId}: {stat.questionText || questions.find(q => q.id === stat.questionId)?.text}
                  </h4>
                  <div class="chart-container">
                    <canvas id={`chart-q${stat.questionId}`} width="400" height="300"></canvas>
                  </div>
                </div>
              {/each}
            </div>
            
          {:else if errorMessage}
            <div class="bg-red-50 border border-red-500 text-red-800 px-6 py-4">
              <p class="font-medium">{errorMessage}</p>
            </div>
          {/if}
          
          <div class="mt-10 flex justify-center">
            <button 
              on:click={goToHeadlineRewriter}
              class="px-8 py-4 bg-black text-white text-xl font-semibold border border-black hover:bg-white hover:text-black transition-all"
            >
              Try the Headline Rewriter
            </button>
          </div>
        </div>
      </div>
    {/if}
  </div>

  {#if isDev}
    <div class="fixed bottom-4 right-4">
      <button 
        on:click={clearSurveyData}
        class="px-4 py-2 bg-white text-black text-sm font-semibold border border-black hover:bg-black hover:text-white transition-all"
      >
        Clear Survey Data (Dev Only)
      </button>
    </div>
  {/if}
</div>

<style>
  /* Custom hover effects */
  button {
    transition: all 0.2s ease;
  }
  
  /* Smoother transitions for interactive elements */
  input[type="radio"] + div,
  button {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  /* Chart title styles */
  .chart-title {
    line-height: 1.4;
    word-wrap: break-word;
    hyphens: auto;
  }

  /* Chart container styles */
  .chart-container {
    position: relative;
    height: 150px; /* Reduce height since we're using horizontal bars */
    width: 100%;
  }
  
  @media (max-width: 768px) {
    .chart-container {
      height: 200px; /* Slightly taller on mobile */
    }
    
    .chart-title {
      font-size: 1rem;
    }
  }

  canvas {
    width: 100% !important;
  }
</style>