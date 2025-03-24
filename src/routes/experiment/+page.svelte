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

<div class="container mx-auto p-4 max-w-4xl">
  {#if !submitted}
    {#if article}
      <div class="mb-8 p-6 border border-gray-300 rounded-lg shadow-sm">
        <h2 class="lg:text-6xl text-4xl font-bold mb-4">{article.title}</h2>
        <p class="mb-6 text-gray-700">{article.content}</p>
      </div>

      <div class="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-6">
        {#each surveyQuestions as question, i}
          <div class="mb-8">
            <p class="font-medium mb-8">{question.text}</p>
            <div class="grid grid-cols-5 gap-2 text-center text-sm">
              {#each likertOptions as option, index}
                <div>
                  <label class="flex flex-col items-center cursor-pointer">
                    <input 
                      type="radio" 
                      name={`question-${question.id}`} 
                      value={index} 
                      on:change={() => updateAnswer(question.id, index)}
                      class="mb-1 accent-gray-600"
                    />
                    <span>{option}</span>
                  </label>
                </div>
              {/each}
            </div>
          </div>
          {#if i !== surveyQuestions.length - 1}
            <hr class="mb-4 border-gray-300">
          {/if}
        {/each}

        <button 
          on:click={submitSurvey} 
          class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 mt-4"
        >
          Submit Responses
        </button>
      </div>
    {:else}
      <div class="flex justify-center items-center h-32">
        <p>Loading...</p>
      </div>
    {/if}
  {:else}
    <div class="bg-green-50 p-6 rounded-lg border border-green-200 mb-6">
      <h3 class="text-xl font-bold text-green-700 mb-3">Thank you for responding.</h3>
      <h3 class="text-3xl font-bold mb-3">What is this?</h3>
      <p class="mb-6">This experiment aims to measure how editorial choices in crash reporting affect the way we think about road danger.</p>
      <button 
        on:click={goToHeadlineRewriter} 
        class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
      >
        ReFrame (and about our experiment)
      </button>
    </div>
  {/if}
</div>