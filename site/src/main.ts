import vistars from 'vistars';
import type { AvatarVariant } from 'vistars';
import { exampleNames } from './example-names.js';
import { avatarVariants, getThemeName, resolveAvatarVariant } from './playground.js';

const defaultPalette = ['#3b82f6', '#06b6d4', '#8b5cf6', '#f59e0b', '#ec4899'];

let state = {
  variant: 'bar' as AvatarVariant | 'random',
  colors: [...defaultPalette],
  size: 80,
  square: false,
  light: true,
};

const variantSelector = document.getElementById('variant-selector') as HTMLElement;
const sizeSelector = document.getElementById('size-selector') as HTMLElement;
const colorsSection = document.getElementById('colors-section') as HTMLElement;
const randomPaletteBtn = document.getElementById('random-palette') as HTMLButtonElement;
const toggleSquareBtn = document.getElementById('toggle-square') as HTMLButtonElement;
const toggleLightBtn = document.getElementById('toggle-light') as HTMLButtonElement;
const avatarsGrid = document.getElementById('avatars-grid') as HTMLElement;
let faviconIntervalId: number | undefined;

const palettes: string[][] = [
  ['#3b82f6', '#06b6d4', '#8b5cf6', '#f59e0b', '#ec4899'],
  ['#264653', '#2A9D8F', '#E9C46A', '#F4A261', '#E76F51'],
  ['#606C38', '#283618', '#FEFAE0', '#DDA15E', '#BC6C25'],
  ['#8ECAE6', '#219EBC', '#023047', '#FFB703', '#FB8500'],
  ['#000000', '#14213D', '#FCA311', '#E5E5E5', '#FFFFFF'],
  ['#D8E2DC', '#FFE5D9', '#FFCAD4', '#F4ACB7', '#9D8189'],
  ['#E63946', '#F1FAEE', '#A8DADC', '#457B9D', '#1D3557'],
  ['#F72585', '#7209B7', '#3A0CA3', '#4361EE', '#4CC9F0'],
  ['#FFBE0B', '#FB5607', '#FF006E', '#8338EC', '#3A86FF'],
  ['#F94144', '#F3722C', '#F8961E', '#F9C74F', '#90BE6D'],
];

function randomItem<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function getRandomPalette(): string[] {
  return randomItem(palettes);
}

function getFaviconLink(): HTMLLinkElement {
  const existing = document.querySelector('link[rel~="icon"]');
  if (existing instanceof HTMLLinkElement) return existing;

  const link = document.createElement('link');
  link.rel = 'icon';
  link.type = 'image/svg+xml';
  document.head.appendChild(link);
  return link;
}

function updateRandomFavicon() {
  const name = randomItem(exampleNames);
  const variant = randomItem(avatarVariants);
  const svg = vistars({
    name,
    variant,
    colors: getRandomPalette(),
    size: 64,
    square: true,
    light: state.light,
  });

  getFaviconLink().href = `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

function startFaviconRefresh() {
  if (faviconIntervalId !== undefined) return;
  updateRandomFavicon();
  faviconIntervalId = window.setInterval(updateRandomFavicon, 10_000);
}

function updateUI() {
  document.documentElement.dataset.theme = getThemeName(state.light);

  variantSelector.querySelectorAll('.segment').forEach((btn) => {
    btn.classList.toggle('selected', btn.getAttribute('data-variant') === state.variant);
  });

  sizeSelector.querySelectorAll('.segment').forEach((btn) => {
    btn.classList.toggle('selected', parseInt(btn.getAttribute('data-size')!) === state.size);
  });

  colorsSection.querySelectorAll('.color-input').forEach((input, index) => {
    (input as HTMLInputElement).value = state.colors[index];
  });

  toggleSquareBtn.textContent = state.square ? 'Round' : 'Square';
  toggleLightBtn.textContent = state.light ? 'Dark' : 'Light';
}

function renderAvatars() {
  avatarsGrid.innerHTML = '';

  exampleNames.forEach((name, index) => {
    const container = document.createElement('div');
    container.className = 'avatar-container';

    const avatarSection = document.createElement('div');
    avatarSection.className = 'avatar-section';
    const variant = resolveAvatarVariant(state.variant, name, index);

    const svg = vistars({
      name,
      variant,
      colors: state.colors,
      size: state.size,
      square: state.square,
      light: state.light,
    });

    avatarSection.innerHTML = svg;

    const input = document.createElement('input');
    input.className = 'avatar-input';
    input.value = name;
    input.addEventListener('change', (e) => {
      const newName = (e.target as HTMLInputElement).value;
      const newVariant = resolveAvatarVariant(state.variant, newName, index);
      const newSvg = vistars({
        name: newName,
        variant: newVariant,
        colors: state.colors,
        size: state.size,
        square: state.square,
        light: state.light,
      });
      avatarSection.innerHTML = newSvg;
    });
    input.addEventListener('focus', (e) => {
      (e.target as HTMLInputElement).select();
    });

    container.appendChild(avatarSection);
    container.appendChild(input);
    avatarsGrid.appendChild(container);
  });
}

variantSelector.querySelectorAll('.segment').forEach((btn) => {
  btn.addEventListener('click', () => {
    state.variant = btn.getAttribute('data-variant') as AvatarVariant | 'random';
    updateUI();
    renderAvatars();
  });
});

sizeSelector.querySelectorAll('.segment').forEach((btn) => {
  btn.addEventListener('click', () => {
    state.size = parseInt(btn.getAttribute('data-size')!);
    updateUI();
    renderAvatars();
  });
});

colorsSection.querySelectorAll('.color-input').forEach((input) => {
  input.addEventListener('input', (e) => {
    const index = parseInt((e.target as HTMLElement).getAttribute('data-index')!);
    state.colors[index] = (e.target as HTMLInputElement).value;
    renderAvatars();
  });
});

randomPaletteBtn.addEventListener('click', () => {
  state.colors = getRandomPalette();
  updateUI();
  renderAvatars();
  startFaviconRefresh();
});

toggleSquareBtn.addEventListener('click', () => {
  state.square = !state.square;
  updateUI();
  renderAvatars();
});

toggleLightBtn.addEventListener('click', () => {
  state.light = !state.light;
  updateUI();
  renderAvatars();
});

updateUI();
renderAvatars();
