import { csv } from 'd3-fetch';

// Cache for loaded articles
let articlesCache = null;

/**
 * Extract URLs from text and add line breaks after every 3 sentences
 */
function processText(text) {
  // Extract URLs
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const urls = text.match(urlRegex) || [];
  
  // Remove URLs from text
  const textWithoutUrls = text.replace(urlRegex, '');
  
  // Split into sentences while preserving existing line breaks
  const sentences = textWithoutUrls
    .split(/(?<=[.!?])\s+/)
    .filter(s => s.trim().length > 0);
  
  // Add line breaks after every 3 sentences
  const processedText = sentences.reduce((acc, sentence, i) => {
    const trimmedSentence = sentence.trim();
    if ((i + 1) % 3 === 0) {
      return acc + trimmedSentence + '\n\n';
    }
    return acc + trimmedSentence + ' ';
  }, '');

  return {
    text: processedText.trim(),
    urls
  };
}

/**
 * Load and parse articles from the CSV file
 */
async function loadArticles() {
  if (articlesCache) {
    return articlesCache;
  }

  try {
    const data = await csv('/data/data_for_website.csv');
    
    // Transform the data into the format we need
    articlesCache = data.map((row, index) => {
      const id = index + 1; // Ensure ID is a number
      return {
        id,
        original: {
          id,
          title: row.title,
          content: row.text,
          date: row.date,
          wordCount: parseInt(row.word_count, 10),
          isRewritten: false
        },
        rewritten: {
          id,
          title: row.rewritten_headline,
          content: row.rewritten_body,
          date: row.date,
          wordCount: parseInt(row.word_count, 10),
          isRewritten: true
        }
      };
    });
    console.log(articlesCache);
    return articlesCache;
  } catch (error) {
    console.error('Error loading articles:', error);
    throw new Error('Failed to load articles');
  }
}

/**
 * Get a random article pair (original and rewritten)
 * Returns either the original or rewritten version randomly
 */
export async function getRandomArticle() {
  const articles = await loadArticles();
  const randomIndex = Math.floor(Math.random() * articles.length);
  const articlePair = articles[randomIndex];
  
  // Randomly choose between original and rewritten
  const useRewritten = Math.random() < 0.5;
  console.log('Selected article version:', useRewritten ? 'rewritten' : 'original');
  
  // Process only the selected article
  const selectedArticle = useRewritten ? articlePair.rewritten : articlePair.original;
  const processed = processText(selectedArticle.content);
  
  // Create the final article object with explicit boolean isRewritten flag
  const finalArticle = {
    id: Number(selectedArticle.id),
    title: selectedArticle.title,
    content: processed.text,
    date: selectedArticle.date,
    wordCount: Number(selectedArticle.wordCount),
    isRewritten: useRewritten, // Will be true for rewritten, false for original
    urls: processed.urls
  };

  console.log('Final article object:', finalArticle);
  console.log('isRewritten type:', typeof finalArticle.isRewritten);
  console.log('isRewritten value:', finalArticle.isRewritten);
  return finalArticle;
}

/**
 * Get all articles (for admin/debugging purposes)
 */
export async function getAllArticles() {
  const articles = await loadArticles();
  // Process articles only when needed
  return articles.map(article => ({
    ...article,
    original: {
      ...article.original,
      ...processText(article.original.content)
    },
    rewritten: {
      ...article.rewritten,
      ...processText(article.rewritten.content)
    }
  }));
}