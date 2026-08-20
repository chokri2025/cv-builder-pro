import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCV } from './useCV';

beforeEach(() => {
  localStorage.clear();
  vi.useFakeTimers();
});

describe('useCV', () => {
  it('adds and removes an experience entry', () => {
    const { result } = renderHook(() => useCV());

    act(() => {
      result.current.addExperience();
    });
    expect(result.current.cvData.experience).toHaveLength(1);

    const id = result.current.cvData.experience[0].id;
    act(() => {
      result.current.removeExperience(id);
    });
    expect(result.current.cvData.experience).toHaveLength(0);
  });

  it('clears all CV data and persisted storage', () => {
    const { result } = renderHook(() => useCV());

    act(() => {
      result.current.updateSummary('Some summary');
      result.current.addSkill('TypeScript');
    });
    expect(result.current.cvData.summary).toBe('Some summary');

    act(() => {
      result.current.clearCV();
    });
    expect(result.current.cvData.summary).toBe('');
    expect(result.current.cvData.skills).toHaveLength(0);
    expect(localStorage.getItem('cv-builder-data')).toBeNull();
  });

  it('autosaves to localStorage after the debounce delay', () => {
    const { result } = renderHook(() => useCV());

    act(() => {
      result.current.updateSummary('Debounced summary');
    });
    expect(localStorage.getItem('cv-builder-data')).toBeNull();

    act(() => {
      vi.advanceTimersByTime(1500);
    });

    const saved = JSON.parse(localStorage.getItem('cv-builder-data') ?? '{}');
    expect(saved.summary).toBe('Debounced summary');
  });
});
