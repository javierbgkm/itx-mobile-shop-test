import { describe, expect, it, vi } from 'vitest';

const createRootMock = vi.fn(() => ({ render: vi.fn() }));

vi.mock('react-dom/client', () => ({
  default: { createRoot: createRootMock },
  createRoot: createRootMock
}));

describe('main entry point', () => {
  it('monta la aplicación sobre el elemento root', async () => {
    vi.resetModules();
    document.body.innerHTML = '<div id="root"></div>';

    await import('./main');

    expect(createRootMock).toHaveBeenCalledTimes(1);
    const rootElement = document.getElementById('root');
    expect(createRootMock).toHaveBeenCalledWith(rootElement);
  });
});
