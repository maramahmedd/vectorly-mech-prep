import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Layout } from './Layout';
import { AuthContext } from '@/contexts/AuthContext';

// Mock the Navbar component
vi.mock('./ui/navbar', () => ({
  default: () => <div data-testid="navbar">Navbar</div>,
}));

const mockAuthValue = {
  user: null,
  loading: false,
  signup: vi.fn(),
  login: vi.fn(),
  logout: vi.fn(),
  updateUserProfile: vi.fn(),
  isAdmin: false,
};

const renderWithRouter = (ui: React.ReactElement, initialRoute = '/') => {
  return render(
    <AuthContext.Provider value={mockAuthValue}>
      <MemoryRouter initialEntries={[initialRoute]}>
        {ui}
      </MemoryRouter>
    </AuthContext.Provider>
  );
};

describe('Layout', () => {
  it('renders children', () => {
    renderWithRouter(
      <Layout>
        <div>Test Content</div>
      </Layout>,
      '/practice'
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('shows navbar on non-landing pages', () => {
    renderWithRouter(
      <Layout>
        <div>Page Content</div>
      </Layout>,
      '/practice'
    );

    expect(screen.getByTestId('navbar')).toBeInTheDocument();
  });

  it('hides navbar on landing page "/"', () => {
    renderWithRouter(
      <Layout>
        <div>Landing Content</div>
      </Layout>,
      '/'
    );

    expect(screen.queryByTestId('navbar')).not.toBeInTheDocument();
    expect(screen.getByText('Landing Content')).toBeInTheDocument();
  });

  it('hides navbar on "/home" route', () => {
    renderWithRouter(
      <Layout>
        <div>Home Content</div>
      </Layout>,
      '/home'
    );

    expect(screen.queryByTestId('navbar')).not.toBeInTheDocument();
    expect(screen.getByText('Home Content')).toBeInTheDocument();
  });

  it('shows navbar on dashboard page', () => {
    renderWithRouter(
      <Layout>
        <div>Dashboard Content</div>
      </Layout>,
      '/dashboard'
    );

    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByText('Dashboard Content')).toBeInTheDocument();
  });

  it('shows navbar on practice interface page', () => {
    renderWithRouter(
      <Layout>
        <div>Practice Interface</div>
      </Layout>,
      '/practice/interface'
    );

    expect(screen.getByTestId('navbar')).toBeInTheDocument();
  });

  it('wraps content in main element', () => {
    const { container } = renderWithRouter(
      <Layout>
        <div>Test</div>
      </Layout>,
      '/practice'
    );

    const main = container.querySelector('main');
    expect(main).toBeInTheDocument();
    expect(main).toHaveClass('flex-1');
  });

  it('applies min-height to layout container', () => {
    const { container } = renderWithRouter(
      <Layout>
        <div>Test</div>
      </Layout>,
      '/practice'
    );

    const layoutDiv = container.querySelector('.min-h-screen');
    expect(layoutDiv).toBeInTheDocument();
  });
});
