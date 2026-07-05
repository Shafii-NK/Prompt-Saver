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
  });

  savePrompts(prompts);
  form.reset();
  titleInput.focus();
  renderPrompts();
});

promptList.addEventListener('click', (event) => {
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
