const THEME_CSS_VARS = [
  '--color-bg',
  '--color-bg-subtle',
  '--color-bg-muted',
  '--color-surface',
  '--color-surface-elevated',
  '--color-border',
  '--color-border-strong',
  '--color-text',
  '--color-text-muted',
  '--color-text-subtle',
  '--color-accent',
  '--color-accent-hover',
  '--color-accent-subtle',
  '--color-accent-text',
  '--color-success',
  '--color-error',
  '--shadow-sm',
  '--shadow-card',
  '--shadow-lg',
  '--shadow-glow',
  '--glass-bg',
  '--glass-border',
  '--gradient-hero',
  '--gradient-accent',
  '--header-bg',
  '--font-sans',
  '--font-mono',
  '--space-xs',
  '--space-sm',
  '--space-md',
  '--space-lg',
  '--space-xl',
  '--space-2xl',
  '--text-xs',
  '--text-sm',
  '--text-base',
  '--text-lg',
  '--text-xl',
  '--text-2xl',
  '--text-3xl',
  '--radius-sm',
  '--radius-md',
  '--radius-lg',
  '--radius-full',
];

export function buildResolvedThemeCss(theme: string): string {
  const liveStyles = getComputedStyle(document.documentElement);
  const resolvedVars = THEME_CSS_VARS.map((name) => {
    const value = liveStyles.getPropertyValue(name).trim();
    if (!value || containsUnsupportedColorFunction(value)) {
      return '';
    }
    return `${name}: ${value};`;
  })
    .filter(Boolean)
    .join('\n');

  return `
    :root, :root[data-theme="${theme}"] {
      ${resolvedVars}
    }
    *, *::before, *::after { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: var(--font-sans, Inter, system-ui, sans-serif);
      font-size: var(--text-base, 1rem);
      line-height: 1.6;
      color: var(--color-text, #0f172a);
      background: var(--color-bg, #ffffff);
    }
    h1, h2, h3, h4, h5, h6, p { margin: 0; }
    a { color: var(--color-accent); text-decoration: none; }
    img { max-width: 100%; display: block; }
  `;
}

export function inlineAllComputedStyles(sourceRoot: HTMLElement, cloneRoot: HTMLElement): void {
  const sourceNodes: Element[] = [sourceRoot, ...sourceRoot.querySelectorAll('*')];
  const cloneNodes: Element[] = [cloneRoot, ...cloneRoot.querySelectorAll('*')];
  const count = Math.min(sourceNodes.length, cloneNodes.length);

  for (let i = 0; i < count; i++) {
    const source = sourceNodes[i];
    const clone = cloneNodes[i];
    if (!(source instanceof HTMLElement) || !(clone instanceof HTMLElement)) {
      continue;
    }

    const computed = getComputedStyle(source);
    for (let j = 0; j < computed.length; j++) {
      const prop = computed.item(j);
      const value = computed.getPropertyValue(prop);
      if (!value || value === 'initial' || value === 'normal') {
        continue;
      }
      if (containsUnsupportedColorFunction(value)) {
        continue;
      }
      clone.style.setProperty(prop, value, computed.getPropertyPriority(prop));
    }
  }
}

export function sanitizeCloneForCapture(
  sourceRoot: HTMLElement,
  clonedDoc: Document,
  clonedRoot: HTMLElement,
): void {
  clonedDoc.querySelectorAll('link[rel="stylesheet"], style').forEach((node) => {
    node.remove();
  });

  const theme = document.documentElement.getAttribute('data-theme') ?? 'professional';
  clonedDoc.documentElement.setAttribute('data-theme', theme);

  const injected = clonedDoc.createElement('style');
  injected.textContent = buildResolvedThemeCss(theme);
  clonedDoc.head.appendChild(injected);

  inlineAllComputedStyles(sourceRoot, clonedRoot);
}

export function suspendGlobalStylesheets(): () => void {
  const links = Array.from(document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]'));
  for (const link of links) {
    link.dataset['pdfExportPrevDisabled'] = link.disabled ? '1' : '0';
    link.disabled = true;
  }
  return () => {
    for (const link of links) {
      link.disabled = link.dataset['pdfExportPrevDisabled'] === '1';
      delete link.dataset['pdfExportPrevDisabled'];
    }
  };
}

function containsUnsupportedColorFunction(value: string): boolean {
  return /\bcolor-mix\s*\(/i.test(value) || /\bcolor\s*\(/i.test(value);
}
