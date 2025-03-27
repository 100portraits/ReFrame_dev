import { VITE_OPENROUTER_API_KEY } from '$env/static/private';
import { json } from '@sveltejs/kit';

export async function POST({ request }) {
  try {
    const { headline, article_text } = await request.json();
    
    // Construct prompt for the API
    const prompt = `You are a journalism expert specializing in traffic crash reporting. 

First, determine if the provided article is about a traffic crash (vehicle collision, pedestrian being hit, bicycle accident, etc.). 

If it IS about a traffic crash, you will rewrite the news headline to make it more human-centered by ensuring it meets all four criteria:
1. Mention all parties involved in the crash
2. Refer to parties using human terms, not transportation modes
3. Make a human the grammatical subject of the sentence
4. Use active voice that clearly shows who did what to whom

If it is NOT about a traffic crash, simply respond with the format shown in the "Not a Crash Article" section below.

## Article Information

Original Headline: ${headline}

Article Context: ${article_text}

## Output Format (FOR CRASH ARTICLES)

### Is Crash Article: Yes

### Original Headline:
[original headline]

### Original Headline Assessment:
1. **Mention all parties involved**: [Yes/No] - [brief explanation]
2. **Use human terms, not transportation modes**: [Yes/No] - [brief explanation]
3. **Human grammatical subject**: [Yes/No] - [brief explanation]
4. **Active voice**: [Yes/No] - [brief explanation]

### Criteria Met: [number of criteria met, from 0-4]

### Rewritten Headline:
[rewritten headline]

### Explanation:
1. **Mention all parties involved in the crash**: [explanation for criterion 1]
2. **Refer to parties using human terms, not transportation modes**: [explanation for criterion 2]
3. **Make a human the grammatical subject of the sentence**: [explanation for criterion 3]
4. **Use active voice that clearly shows who did what to whom**: [explanation for criterion 4]

## Output Format (FOR NON-CRASH ARTICLES)

### Is Crash Article: No

### Explanation:
[Brief explanation of why this article is not about a traffic crash]

### Suggestion:
This experiment is designed for traffic crash reports. Please submit an article about a traffic crash (involving vehicles, pedestrians, cyclists, etc.) to see how headlines can be rewritten with more human-centered language.`;

    // Make the API call to OpenRouter
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${VITE_OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://headline-rewriter.pages.dev",
        "X-Title": "ReFrame"
      },
      body: JSON.stringify({
        model: "mistralai/mistral-small-3.1-24b-instruct",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API error:', errorData);
      return json({ error: errorData.error?.message || 'Failed to get response from API' }, { status: response.status });
    }

    const data = await response.json();
    return json(data);
  } catch (error) {
    console.error('Server error:', error);
    return json({ error: 'Server error processing request' }, { status: 500 });
  }
} 