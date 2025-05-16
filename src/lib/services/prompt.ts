// Single prompt for combined analysis and rewrite of crash headlines

const prompt = (headline: string, articleBody: string) => `
You are a journalism expert specializing in traffic crash reporting.

Your task is to:
1. Determine whether the article is about a traffic crash (e.g., car crash, pedestrian hit, bicycle accident).
2. Analyze the headline against three humanization criteria.
3. If it's a crash article, rewrite the headline to better meet all three criteria.

## Criteria Definitions:

    1. MENTION ALL PARTIES:
    This is Yes if:
    • ALL parties mentioned in the article body as being involved in the crash are referenced in the headline
    • A party can be mentioned either by referring to the person (e.g., "woman", "driver") or their vehicle (e.g., "car", "truck")
    • For single-party crashes (e.g., vehicle ran off road), Yes if that party is mentioned

    This is No if:
    • ANY key party involved in the crash is omitted from the headline

    2. USE HUMAN TERMS:
    This is Yes if ALL parties in the headline are described using:
    • Human terms (e.g., "woman," "man," "child," "person," "teenager")
    • Role-based terms (e.g., "driver," "pedestrian," "cyclist," "passenger")
    • Quantified human references (e.g., "one person", "two people," "three victims")

    This is No if ANY party in the headline is described as:
    • A transportation mode (e.g., "car," "bicycle," "truck," "vehicle") instead of the person operating it
    • Dehumanizing statistics without human context (e.g., "1 killed," "2 injured," "fatality")
    • Numbers alone to represent humans (e.g., "1 dead in crash")

    3. ACTIVE VOICE:
    This is Yes if:
    • The headline uses active voice to clearly show who/what performed the action

    This is No if:
    • The headline uses passive constructions that obscure agency (e.g., "was struck," "was hit," "killed in crash", "dies")
    • Outcome-only descriptions without clear agency (e.g., "Person killed in crash," "X injured")
    
For example:
Driver of truck strikes and kills man riding bicycle in East Vancouver crash
passes all criteria

while
Cyclist dead after East Vancouver crash
passes none

Taxi driver strikes man crossing street in Amsterdam, injuring him during morning rush hour
passes all criteria

while
Amsterdam taxi driver in custody after crash sends pedestrian to the hospital
passes 1 

What's the difference?
Mention all parties involved in the crash: The revised headline mentions both the driver and the cyclist, ensuring all parties involved are represented.
Refer to parties using human terms, not transportation modes: It replaces 'Cyclist dead' with 'man riding bicycle,' employing human terms rather than dehumanizing language.
Use active voice that clearly shows who did what to whom: The revised headline uses an active voice construction, clearly indicating the driver performed the action.

## Input:
Headline: "${headline}"

Article Body:
${articleBody}

## Instructions:
1. If the article is NOT about a traffic crash, return the following JSON:
{
  "analysis": {
    "isRelevant": false,
    "originalHeadline": "${headline}",
    "criteriaResults": [],
    "improvedHeadline": "",
    "changes": []
  }
}

2. If the article IS about a traffic crash, perform the following:
- Analyze each of the three criteria and provide:
  - criterionId (1 | 2 | 3)
  - passed (true | false)
  - explanation (brief justification)

  Next, please rewrite the headline to ensure it:
    1. Mentions all parties involved in the crash 
    2. Uses human terms instead of transportation modes to refer to all parties
    3. Uses active voice that clearly shows who did what to whom

    The rewritten headline should:
    - Be in similar style to the original headline
    - Be appropriate for a news article
    - Be concise and clear
    - Not assign blame to victims and beyond what is factually stated in the article
    - Avoid naming specific car models or brands and be respectful of the victims
    - Focus on human impact rather than traffic disruption

    The rewritten headline should be in the same language as the original headline (e.g. if the original headline is in English, the rewritten headline should also be in English, if the original headline is in Dutch, the rewritten headline should also be in Dutch).

    Here are an examples of how to rewrite a headline:

    Original Headline: "Teenage boy dies after being hit by truck on notorious road that has claimed other lives"
    Rewritten Headline: "Driver of truck strikes and kills teenage boy on notorious road known for accidents"

    Differences:
    - ⁠The original headline uses passive voice ("dies after being hit by truck") and the rewritten headline uses active voice ("driver of truck strikes and kills teenage boy")
    - ⁠The original headline does not mention all parties involved (the truck driver is not mentioned)

    Original Headline: "Man killed in car crash"
    Rewritten Headline: "Driver of car kills man in crash"

    Differences:
    - ⁠The original headline uses passive voice ("killed in car crash") and the rewritten headline uses active voice ("driver of car kills man in crash")
    - ⁠The original headline does not mention all parties involved (the driver is not mentioned)


## Output Format (as JSON):
{
  "analysis": {
    "isRelevant": true | false,
    "originalHeadline": "original headline here",
    "criteriaResults": [
      {
        "criterionId": 1,
        "passed": true | false,
        "explanation": "..."
      },
      {
        "criterionId": 2,
        "passed": true | false,
        "explanation": "..."
      },
      {
        "criterionId": 3,
        "passed": true | false,
        "explanation": "..."
      }
    ],
    "improvedHeadline": "rewritten headline here",
    "changes": [
      {
        "criterionId": 1 | 2 | 3,
        "explanation": "..."
      },
      {
        "criterionId": 2 | 3,
        "explanation": "..."
      },
      {
        "criterionId": 3,
        "explanation": "..."
        *not all criteria need to be mentioned if they were not changed/violated originally*
      }
    ]
  }
}`;

export default prompt;
