<script>
  import { onMount } from 'svelte';

  // Single article - AI-generated version
  const articles = [
    {
      id: 1,
      title: "Multi-Vehicle Accident Causes Major Delays on Interstate 95",
      content: "A chain-reaction crash involving five vehicles brought traffic to a standstill on Interstate 95 this morning. The incident occurred during rush hour near the downtown exit. Three people were transported to Regional Hospital with non-life-threatening injuries. Officials report that heavy fog and reduced visibility likely contributed to the collision. Motorists are advised to seek alternate routes until cleanup operations are complete.",
      isAIGenerated: true
    },
    {
      id: 2,
      title: "A man was killed in a car crash",
      content: "A man was killed in a car crash on Interstate 95 this morning. The incident occurred during rush hour near the downtown exit. The victim was a 30-year-old man who was driving a sedan. The cause of the crash is still under investigation.",
      isAIGenerated: false
    },
    {
      id: 3,
      title: "Cyclist killed in collision with car",
      content: "A cyclist was killed in a collision with a car on Interstate 95 this morning. The incident occurred during rush hour near the downtown exit. The victim was a 30-year-old cyclist who was riding a bike. The cause of the crash is still under investigation.",
      isAIGenerated: true
    },
    {
      id: 4,
      title: "Pedestrian crashes into car",
      content: "A pedestrian crashed into a car on Interstate 95 this morning. The incident occurred during rush hour near the downtown exit. The victim was a 30-year-old pedestrian who was crossing the road. The cause of the crash is still under investigation.",
      isAIGenerated: false
    }
  ]

  let article; // Declare the article variable

  onMount(() => {
    const randomIndex = Math.floor(Math.random() * articles.length);
    article = articles[randomIndex];
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

  function submitSurvey() {
    // Check if all questions are answered
    const allAnswered = true;
    //const allAnswered = surveyQuestions.every(q => q.answer !== null);
    
    if (!allAnswered) {
      alert("Please answer all questions before submitting.");
      return;
    }
    
    // In a real app, you would send this data to your backend
    const surveyData = {
      articleId: article.id,
      isAIGenerated: article.isAIGenerated,
      responses: surveyQuestions.map(q => ({ questionId: q.id, answer: q.answer }))
    };
    
    console.log("Survey submitted:", surveyData);
    submitted = true;
  }

  function goToHeadlineRewriter() {
    // Add navigation logic here
    window.location.href = "/";
  }
</script>

<div class="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
  <div class="max-w-5xl mx-auto">
    <!-- Header -->
    {#if !submitted}
      {#if article}
        <!-- Article Card -->
        <div class="bg-white rounded-2xl shadow-xl overflow-hidden mb-12">
          <div class="bg-indigo-700 px-8 py-6">
            <h2 class="text-4xl font-bold text-white leading-tight">{article.title}</h2>
          </div>
          <div class="p-8">
            <p class="text-xl leading-relaxed text-gray-700">{article.content}</p>
          </div>
        </div>

        <!-- Survey Section -->
        <div class="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <h3 class="text-2xl font-bold text-gray-800 mb-8">Your Perspective</h3>
          <p class="text-lg text-gray-600 mb-8">Please indicate how much you agree or disagree with each statement:</p>
          
          <div class="space-y-12">
            {#each surveyQuestions as question, i}
              <div class="border-b border-gray-200 pb-10 {i === surveyQuestions.length - 1 ? 'border-b-0' : ''}">
                <p class="text-xl font-medium text-gray-800 mb-6">{question.text}</p>
                <div class="grid grid-cols-5 gap-4">
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
                        <div class="w-full h-12 bg-gray-100 rounded-lg flex items-center justify-center peer-checked:bg-indigo-600 peer-checked:text-white peer-hover:bg-indigo-100 peer-checked:peer-hover:bg-indigo-700 transition-all">
                          <span class="text-sm font-medium">{option}</span>
                        </div>
                      </label>
                    </div>
                  {/each}
                </div>
              </div>
            {/each}
          </div>

          <div class="mt-12 flex justify-center">
            <button 
              on:click={submitSurvey} 
              class="px-8 py-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-xl font-semibold rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all"
            >
              Submit Responses
            </button>
          </div>
        </div>
      {:else}
        <div class="bg-white rounded-2xl shadow-xl p-16 flex justify-center items-center">
          <div class="flex flex-col items-center">
            <svg class="animate-spin h-12 w-12 text-indigo-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p class="text-xl text-indigo-800 font-medium">Loading your article...</p>
          </div>
        </div>
      {/if}
    {:else}
      <!-- Thank You Screen -->
      <div class="bg-white rounded-2xl shadow-xl p-8 mb-12">
        <div class="p-8 rounded-xl bg-green-50 border-2 border-green-200 mb-8">
          <h3 class="text-3xl font-bold text-green-800 mb-4">Thank you for participating!</h3>
          <div class="text-xl text-green-700">
            <p>Your responses have been recorded.</p>
          </div>
        </div>
        
        <div class="space-y-8 text-lg">
          <h3 class="text-3xl font-bold text-gray-800 mb-6">About This Experiment</h3>
          <p>This experiment is designed to measure how the language used in crash reporting affects our perception of road safety.</p>
          <p>We're testing whether editorial choices in headlines influence how readers assign responsibility and understand road danger.</p>
          
          <div class="mt-10 flex justify-center">
            <button 
              on:click={goToHeadlineRewriter} 
              class="px-8 py-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-xl font-semibold rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all"
            >
              Try the Headline Rewriter
            </button>
          </div>
        </div>
      </div>
    {/if}
  </div>
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
</style>