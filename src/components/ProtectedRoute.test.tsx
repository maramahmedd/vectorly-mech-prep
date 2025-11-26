import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { AuthContext } from '@/contexts/AuthContext';
import type { ReactNode } from 'react';

// Helper to render with all necessary providers
const renderWithProviders = (
  ui: ReactNode,
  authValue: any
) => {
  return render(
    <AuthContext.Provider value={authValue}>
      <MemoryRouter>
        {ui}
      </MemoryRouter>
    </AuthContext.Provider>
  );
};

describe('ProtectedRoute', () => {
  const mockAuthValue = {
    signup: vi.fn(),
    login: vi.fn(),
    logout: vi.fn(),
    updateUserProfile: vi.fn(),
    isAdmin: false,
  };

  it('shows loading state while authentication is being checked', () => {
    renderWithProviders(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>,
      {
        ...mockAuthValue,
        user: null,
        loading: true,
      }
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('renders children when user is authenticated', () => {
    renderWithProviders(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>,
      {
        ...mockAuthValue,
        user: { id: '1', name: 'Test User', email: 'test@example.com' },
        loading: false,
      }
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('does not render content when user is not authenticated', () => {
    renderWithProviders(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>,
      {
        ...mockAuthValue,
        user: null,
        loading: false,
      }
    );

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('shows loading spinner with correct styling', () => {
    const { container } = renderWithProviders(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>,
      {
        ...mockAuthValue,
        user: null,
        loading: true,
      }
    );

    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('accepts custom redirect path', () => {
    // Just verify component renders without error with redirectTo prop
    renderWithProviders(
      <ProtectedRoute redirectTo="/login">
        <div>Protected Content</div>
      </ProtectedRoute>,
      {
        ...mockAuthValue,
        user: null,
        loading: false,
      }
    );

    // Should not show protected content
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });
});
