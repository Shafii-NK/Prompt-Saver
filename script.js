const form = document.getElementById('promptForm');
const titleInput = document.getElementById('title');
const contentInput = document.getElementById('content');
const promptList = document.getElementById('promptList');
const storageKey = 'prompt-library-prompts';

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

renderPrompts();
