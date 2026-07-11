const enhancerForm = document.getElementById('enhancerForm');
const promptInput = document.getElementById('promptInput');
const optimizedPrompt = document.getElementById('optimizedPrompt');
const copyPromptBtn = document.getElementById('copyPromptBtn');
const templateChips = document.querySelectorAll('.template-chip');
const feedbackButtons = document.querySelectorAll('.feedback-btn');
const form = document.getElementById('promptForm');
const titleInput = document.getElementById('title');
const contentInput = document.getElementById('content');
const promptList = document.getElementById('promptList');
const storageKey = 'prompt-library-prompts';
const feedbackKey = 'prompt-enhancer-feedback';

function loadPrompts() {
  try {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function savePrompts(prompts) {
  localStorage.setItem(storageKey, JSON.stringify(prompts));
}

function createPromptId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function getPreview(text) {
  return text.trim().split(/\s+/).slice(0, 10).join(' ');
}

function inferRole(description) {
  if (description.includes('email')) return 'email copywriter';
  if (description.includes('blog')) return 'content strategist';
  if (description.includes('linkedin')) return 'professional social media writer';
  if (description.includes('caption')) return 'brand copywriter';
  if (description.includes('ad') || description.includes('advert')) return 'performance marketer';
  if (description.includes('resume') || description.includes('cv')) return 'career writing specialist';
  if (description.includes('summary')) return 'clear and concise editor';
  return 'expert prompt writer';
}

function buildOptimizedPrompt(rawInput) {
  const input = rawInput.trim();

  if (!input) {
    return 'Start typing a request to generate a stronger prompt.';
  }

  const role = inferRole(input.toLowerCase());
  const task = input.endsWith('.') ? input : `${input}.`;

  return [
    `You are an experienced ${role}.`,
    '',
    `Task: ${task}`,
    '',
    'Make the response practical, specific, and easy to act on.',
    'If key details are missing, ask up to 3 short clarifying questions first.',
    'Return the final answer in a clean format that is easy to copy and use.',
  ].join('\n');
}

function updateOptimizedPrompt() {
  const value = promptInput.value;
  optimizedPrompt.textContent = buildOptimizedPrompt(value);
}

function getFeedback() {
  try {
    const saved = localStorage.getItem(feedbackKey);
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
}

function saveFeedback(feedback) {
  localStorage.setItem(feedbackKey, JSON.stringify(feedback));
}

async function copyOptimizedPrompt() {
  const text = optimizedPrompt.textContent;

  try {
    await navigator.clipboard.writeText(text);
    copyPromptBtn.textContent = 'Copied';
    window.setTimeout(() => {
      copyPromptBtn.textContent = 'Copy prompt';
    }, 1200);
  } catch {
    copyPromptBtn.textContent = 'Copy failed';
    window.setTimeout(() => {
      copyPromptBtn.textContent = 'Copy prompt';
    }, 1200);
  }
}

function normalizeRating(prompt) {
  return Number.isInteger(prompt.rating) ? prompt.rating : 0;
}

function renderStarRating(prompt) {
  const rating = normalizeRating(prompt);

  return `
    <div class="rating-group" role="radiogroup" aria-label="Rate prompt effectiveness">
      <span class="rating-label">Rating</span>
      <div class="star-row">
        ${Array.from({ length: 5 }, (_, index) => {
          const starValue = index + 1;
          const isFilled = starValue <= rating;
          return `
            <button
              class="star-btn ${isFilled ? 'filled' : ''}"
              type="button"
              data-id="${prompt.id}"
              data-rating="${starValue}"
              aria-label="Set rating to ${starValue} star${starValue > 1 ? 's' : ''}"
              aria-pressed="${isFilled ? 'true' : 'false'}"
            >
              ★
            </button>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

function renderPrompts() {
  const prompts = loadPrompts();
  promptList.innerHTML = '';

  if (prompts.length === 0) {
    promptList.innerHTML = '<div class="empty-state">No saved prompts yet. Add one above to build your library.</div>';
    return;
  }

  prompts.forEach((prompt) => {
    const card = document.createElement('article');
    card.className = 'prompt-card';

    card.innerHTML = `
      <div>
        <h3>${escapeHtml(prompt.title)}</h3>
        <p class="prompt-preview">${escapeHtml(getPreview(prompt.content))}${prompt.content.trim().split(/\s+/).length > 10 ? '...' : ''}</p>
      </div>
      ${renderStarRating(prompt)}
      <div class="card-footer">
        <span class="meta">Local prompt</span>
        <button class="delete-btn" type="button" data-id="${prompt.id}">Delete</button>
      </div>
    `;

    promptList.appendChild(card);
  });
}

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

templateChips.forEach((chip) => {
  chip.addEventListener('click', () => {
    promptInput.value = chip.dataset.template || '';
    updateOptimizedPrompt();
    promptInput.focus();
  });
});

feedbackButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const feedback = getFeedback();
    const key = button.dataset.feedback;
    feedback[key] = (feedback[key] || 0) + 1;
    saveFeedback(feedback);
    button.textContent = 'Noted';
    window.setTimeout(() => {
      button.textContent = button.dataset.feedback === 'more-guidance'
        ? 'More guidance'
        : button.dataset.feedback === 'shorter-results'
          ? 'Shorter results'
          : 'Better examples';
    }, 1000);
  });
});

promptInput.addEventListener('input', updateOptimizedPrompt);

copyPromptBtn.addEventListener('click', copyOptimizedPrompt);

enhancerForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const optimized = buildOptimizedPrompt(promptInput.value);
  contentInput.value = optimized;
  titleInput.focus();
});

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const title = titleInput.value.trim();
  const content = contentInput.value.trim();

  if (!title || !content) {
    return;
  }

  const prompts = loadPrompts();
  prompts.unshift({
    id: createPromptId(),
    title,
    content,
    rating: 0,
  });

  savePrompts(prompts);
  form.reset();
  titleInput.focus();
  renderPrompts();
});

promptList.addEventListener('click', (event) => {
  const ratingButton = event.target.closest('.star-btn');
  if (ratingButton) {
    const promptId = ratingButton.dataset.id;
    const rating = Number(ratingButton.dataset.rating);
    const prompts = loadPrompts();
    const prompt = prompts.find((item) => item.id === promptId);

    if (!prompt) {
      return;
    }

    prompt.rating = rating;
    savePrompts(prompts);
    renderPrompts();
    return;
  }

  const deleteButton = event.target.closest('.delete-btn');
  if (!deleteButton) {
    return;
  }

  const promptId = deleteButton.dataset.id;
  const prompts = loadPrompts().filter((prompt) => prompt.id !== promptId);
  savePrompts(prompts);
  renderPrompts();
});

promptInput.value = 'I need help turning a simple idea into a prompt that gets a detailed and useful answer.';
updateOptimizedPrompt();
renderPrompts();
