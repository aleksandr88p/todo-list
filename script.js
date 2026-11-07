"use strict";

// UI strings only. User task titles are never translated.
const translations = {
  en: {
    pageTitle: "My tasks — To-Do List",
    description: "A simple to-do list saved in your browser.",
    brand: "Little Tasks",
    languageGroup: "Interface language", english: "English", russian: "Russian",
    themeGroup: "Color theme", light: "Light", dark: "Dark",
    eyebrow: "SMALL STEPS. BIG RESULTS.", heading: "My To-Do List",
    subtitleFirst: "Stay organized, focus on what matters,", subtitleSecond: "and make steady progress every day.",
    progressHeading: "Progress", progress: "{completed} of {total} completed",
    progressHint: "Every checkmark is a little win.",
    taskSection: "To-do list", inputLabel: "New task", placeholder: "What do you want to do?", add: "Add Task",
    listHeading: "Tasks", filterGroup: "Task filter", all: "All", active: "Active", completed: "Completed", tasks: "Tasks",
    emptyTitle: "No tasks yet", emptyHint: "Add your first task. Start small.",
    noCompletedTitle: "No completed tasks", noCompletedHint: "Your completed tasks will appear here.",
    noActiveTitle: "No active tasks", noActiveHint: "All done. Take a little breather!",
    footer: "Your tasks are saved in this browser.", deleteTask: "Delete task: {title}", required: "Enter a task.",
    loadError: "Couldn't load your tasks. The list is empty. Storage may be unavailable or the saved data may be damaged.",
    saveError: "Couldn't save your tasks. Changes will last until you reload the page. Check your browser settings and available storage.",
    themeSaveError: "Couldn't save the theme. Your choice will last until you reload the page.",
    languageLoadError: "Couldn't load your language preference. English is being used.",
    languageSaveError: "Couldn't save the language. Your choice will last until you reload the page.",
    allTasks: "All Tasks", sidebarLabel: "Your progress", summaryHeading: "Your progress",
    motivationHeading: "Keep going!", motivationEmpty: "Your next small win starts here.",
    motivationLeft: "Tasks left: {active}. One small step at a time.",
    addHeading: "Add a New Task", priorityLabel: "Task priority",
    high: "High", medium: "Medium", low: "Low", priorityValue: "Priority: {priority}"
  },
  ru: {
    pageTitle: "Мои задачи — To-Do List",
    description: "Простой список задач с сохранением в браузере.",
    brand: "Маленькие дела",
    languageGroup: "Язык интерфейса", english: "Английский язык", russian: "Русский язык",
    themeGroup: "Цветовая тема", light: "Светлая", dark: "Тёмная",
    eyebrow: "МАЛЕНЬКИЕ ШАГИ. БОЛЬШИЕ РЕЗУЛЬТАТЫ.", heading: "Мой список дел",
    subtitleFirst: "Порядок в делах, внимание — главному.", subtitleSecond: "Двигайтесь вперёд в своём темпе.",
    progressHeading: "Прогресс", progress: "{completed} из {total} выполнено",
    progressHint: "Каждая галочка — маленькая победа.",
    taskSection: "Список задач", inputLabel: "Новая задача", placeholder: "Что хотите сделать?", add: "Добавить",
    listHeading: "Задачи", filterGroup: "Фильтр задач", all: "Все", active: "Активные", completed: "Завершённые", tasks: "Задачи",
    emptyTitle: "Здесь пока нет задач", emptyHint: "Добавьте первую — начните с малого.",
    noCompletedTitle: "Нет завершённых задач", noCompletedHint: "Выполненные задачи появятся здесь.",
    noActiveTitle: "Нет активных задач", noActiveHint: "Всё выполнено. Можно немного выдохнуть!",
    footer: "Ваши задачи сохраняются в этом браузере.", deleteTask: "Удалить задачу: {title}", required: "Введите текст задачи.",
    loadError: "Не удалось загрузить задачи. Список открыт пустым. Хранилище может быть недоступно, либо данные повреждены.",
    saveError: "Не удалось сохранить задачи. Изменения доступны только до обновления страницы. Проверьте настройки и свободное место в браузере.",
    themeSaveError: "Не удалось сохранить тему. Выбор действует до обновления страницы.",
    languageLoadError: "Не удалось загрузить выбранный язык. Используется английский.",
    languageSaveError: "Не удалось сохранить язык. Выбор действует до обновления страницы.",
    allTasks: "Всего задач", sidebarLabel: "Ваш прогресс", summaryHeading: "Ваш прогресс",
    motivationHeading: "Так держать!", motivationEmpty: "Следующая маленькая победа начинается здесь.",
    motivationLeft: "Осталось задач: {active}. Шаг за шагом — к результату.",
    addHeading: "Добавить новую задачу", priorityLabel: "Приоритет задачи",
    high: "Высокий", medium: "Средний", low: "Низкий", priorityValue: "Приоритет: {priority}"
  }
};
const LANGUAGE_KEY = "todo-list.language.v1";

function t(key, values = {}) {
  return translations[currentLanguage][key].replace(/\{(\w+)\}/g, (_, name) => values[name]);
}

function loadLanguage() {
  try {
    const saved = localStorage.getItem(LANGUAGE_KEY);
    return saved === "ru" ? "ru" : "en";
  } catch {
    languageError = "languageLoadError";
    return "en";
  }
}

function renderMessages() {
  status.textContent = taskError ? t(taskError) : "";
  themeStatus.textContent = themeError ? t(themeError) : "";
  languageStatus.textContent = languageError ? t(languageError) : "";
}

function updateDeleteLabel(button, title) {
  const label = t("deleteTask", { title });
  button.setAttribute("aria-label", label);
  button.title = label;
}

function applyLanguage() {
  document.documentElement.lang = currentLanguage;
  document.title = t("pageTitle");
  document.querySelector('meta[name="description"]').content = t("description");
  for (const element of document.querySelectorAll("[data-i18n]")) {
    element.textContent = t(element.dataset.i18n);
  }
  for (const element of document.querySelectorAll("[data-i18n-label]")) {
    element.setAttribute("aria-label", t(element.dataset.i18nLabel));
  }
  input.placeholder = t("placeholder");
  input.setCustomValidity(inputError ? t("required") : "");
  for (const button of languageButtons) {
    button.setAttribute("aria-pressed", String(button.dataset.language === currentLanguage));
  }
  // Keep cards and the input in place so language changes preserve draft text and focus.
  for (const button of list.querySelectorAll(".delete-button")) {
    const task = tasks.find((entry) => entry.id === button.dataset.taskId);
    updateDeleteLabel(button, task.title);
  }
  for (const badge of list.querySelectorAll(".priority-badge")) {
    updatePriorityLabel(badge);
  }
  renderMessages();
  updateProgress();
  updateEmptyState();
}

function updateEmptyState() {
  const keys = tasks.length === 0 ? ["emptyTitle", "emptyHint"]
    : currentFilter === "completed" ? ["noCompletedTitle", "noCompletedHint"]
      : ["noActiveTitle", "noActiveHint"];
  emptyTitle.textContent = t(keys[0]);
  emptyHint.textContent = t(keys[1]);
}


const STORAGE_KEY = "todo-list.tasks.v1";
const form = document.querySelector("#task-form");
const input = document.querySelector("#task-input");
const list = document.querySelector("#task-list");
const emptyState = document.querySelector("#empty-state");
const status = document.querySelector("#status");
const emptyTitle = document.querySelector("#empty-title");
const emptyHint = document.querySelector("#empty-hint");
const progressText = document.querySelector("#progress-text");
const progressBar = document.querySelector("#task-progress");
const priorityInput = document.querySelector("#task-priority");
const summaryBar = document.querySelector("#summary-progress");
const progressPercent = document.querySelector("#progress-percent");
const summaryPercent = document.querySelector("#summary-percent");
const totalCount = document.querySelector("#stat-total");
const completedCount = document.querySelector("#stat-completed");
const activeCount = document.querySelector("#stat-active");
const listCount = document.querySelector("#list-count");
const motivationText = document.querySelector("#motivation-text");
const filterButtons = document.querySelectorAll("[data-filter]");
const themeButtons = document.querySelectorAll("[data-theme-choice]");
const themeStatus = document.querySelector("#theme-status");
const languageButtons = document.querySelectorAll("[data-language]");
const languageStatus = document.querySelector("#language-status");
const THEME_KEY = "todo-list.theme.v1";
let taskError = "";
let themeError = "";
let languageError = "";
let inputError = false;
let currentLanguage = loadLanguage();
let currentFilter = "all";
let tasks = loadTasks();
priorityInput.value = "medium";

// Old records are kept intact; absent or unknown priorities display as Medium.
function normalizePriority(priority) {
  return ["high", "medium", "low"].includes(priority) ? priority : "medium";
}

function updatePriorityLabel(badge) {
  badge.textContent = t(badge.dataset.priority);
  badge.setAttribute("aria-label", t("priorityValue", { priority: badge.textContent }));
}

function createIcon(name) {
  const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  icon.setAttribute("class", "icon");
  icon.setAttribute("viewBox", "0 0 24 24");
  icon.setAttribute("aria-hidden", "true");
  const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
  use.setAttribute("href", `#icon-${name}`);
  icon.append(use);
  return icon;
}

function updateThemeControls() {
  for (const button of themeButtons) {
    button.setAttribute("aria-pressed", String(button.dataset.themeChoice === document.documentElement.dataset.theme));
  }
}

for (const button of themeButtons) {
  button.addEventListener("click", () => {
    const theme = button.dataset.themeChoice;
    document.documentElement.dataset.theme = theme;
    updateThemeControls();
    try {
      localStorage.setItem(THEME_KEY, theme);
      themeError = "";
    } catch {
      themeError = "themeSaveError";
    }
    renderMessages();
  });
}
updateThemeControls();

for (const button of languageButtons) {
  button.addEventListener("click", () => {
    currentLanguage = button.dataset.language;
    try {
      localStorage.setItem(LANGUAGE_KEY, currentLanguage);
      languageError = "";
    } catch {
      languageError = "languageSaveError";
    }
    applyLanguage();
  });
}

for (const button of filterButtons) {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;
    for (const filter of filterButtons) {
      filter.setAttribute("aria-pressed", String(filter === button));
    }
    renderTasks();
  });
}

function visibleTasks() {
  return tasks.filter((task) => currentFilter === "all"
    || (currentFilter === "completed" ? task.completed : !task.completed));
}

function updateProgress() {
  const completed = tasks.filter((task) => task.completed).length;
  progressText.textContent = t("progress", { completed, total: tasks.length });
  const active = tasks.length - completed;
  const percent = tasks.length ? Math.round(completed / tasks.length * 100) : 0;
  for (const bar of [progressBar, summaryBar]) {
    bar.max = tasks.length || 1;
    bar.value = completed;
  }
  progressPercent.textContent = `${percent}%`;
  summaryPercent.textContent = `${percent}%`;
  totalCount.textContent = tasks.length;
  completedCount.textContent = completed;
  activeCount.textContent = active;
  listCount.textContent = tasks.length;
  const counts = { all: tasks.length, active, completed };
  for (const count of document.querySelectorAll("[data-count]")) {
    count.textContent = `(${counts[count.dataset.count]})`;
  }
  motivationText.textContent = tasks.length ? t("motivationLeft", { active }) : t("motivationEmpty");
}

function focusAfterRemoval(index) {
  const checkboxes = list.querySelectorAll(".task-checkbox");
  const target = checkboxes[Math.min(index, checkboxes.length - 1)]
    || document.querySelector(`[data-filter="${currentFilter}"]`);
  target.focus();
}

function loadTasks() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === null) return [];

    const parsed = JSON.parse(stored);
    const ids = new Set();
    if (!Array.isArray(parsed) || !parsed.every((task) => {
      if (!task || typeof task.id !== "string" || !task.id || ids.has(task.id)
        || typeof task.title !== "string" || !task.title.trim()
        || typeof task.completed !== "boolean") return false;
      ids.add(task.id);
      return true;
    })) {
      throw new Error("Invalid saved tasks");
    }
    return parsed;
  } catch {
    taskError = "loadError";
    renderMessages();
    return [];
  }
}

function saveTasks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    taskError = "";
  } catch {
    taskError = "saveError";
  }
  renderMessages();
}

function renderTasks() {
  list.replaceChildren();
  const visible = visibleTasks();
  emptyState.hidden = visible.length > 0;
  updateEmptyState();
  updateProgress();

  for (const task of visible) {
    const item = document.createElement("li");
    item.className = "task-item";
    item.classList.toggle("is-completed", task.completed);

    const label = document.createElement("label");
    label.className = "task-label";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "task-checkbox";
    checkbox.checked = task.completed;
    const checkboxWrap = document.createElement("span");
    checkboxWrap.className = "checkbox-wrap";
    checkboxWrap.append(checkbox, createIcon("check"));
    const title = document.createElement("span");
    title.className = "task-title";
    title.textContent = task.title;
    label.append(checkboxWrap, title);

    const priority = normalizePriority(task.priority);
    const badge = document.createElement("span");
    badge.className = `priority-badge priority-${priority}`;
    badge.dataset.priority = priority;
    updatePriorityLabel(badge);

    checkbox.addEventListener("change", () => {
      task.completed = checkbox.checked;
      item.classList.toggle("is-completed", task.completed);
      saveTasks();
      updateProgress();
      if (currentFilter !== "all") {
        const visibleIndex = Array.from(list.children).indexOf(item);
        renderTasks();
        focusAfterRemoval(visibleIndex);
      }
    });

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-button";
    deleteButton.dataset.taskId = task.id;
    updateDeleteLabel(deleteButton, task.title);
    deleteButton.append(createIcon("trash"));
    deleteButton.addEventListener("click", () => {
      const visibleIndex = Array.from(list.children).indexOf(item);
      const index = tasks.findIndex((entry) => entry.id === task.id);
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
      focusAfterRemoval(visibleIndex);
    });

    item.append(label, badge, deleteButton);
    list.append(item);
  }
}

input.addEventListener("input", () => {
  inputError = false;
  input.setCustomValidity("");
});
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const title = input.value.trim();
  if (!title) {
    inputError = true;
    input.setCustomValidity(t("required"));
    input.reportValidity();
    return;
  }
  tasks.push({ id: crypto.randomUUID(), title, completed: false, priority: normalizePriority(priorityInput.value) });
  saveTasks();
  renderTasks();
  input.value = "";
  priorityInput.value = "medium";
  input.focus();
});

applyLanguage();
renderTasks();
