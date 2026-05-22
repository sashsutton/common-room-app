import React from 'react';
import { render } from '@testing-library/react-native';
import { ReflectionCard } from '@/components/ReflectionCard';
import { CategoryBadge } from '@/components/CategoryBadge';

describe('ReflectionCard', () => {
  it('renders the reflection text', () => {
    const { getByText } = render(
      <ReflectionCard text="You carry more than you realise." index={0} />
    );
    expect(getByText('You carry more than you realise.')).toBeTruthy();
  });

  it('renders the correct label for index 0', () => {
    const { getByText } = render(
      <ReflectionCard text="Some reflection." index={0} />
    );
    expect(getByText('Reflection 1')).toBeTruthy();
  });

  it('renders the correct label for index 2', () => {
    const { getByText } = render(
      <ReflectionCard text="Another reflection." index={2} />
    );
    expect(getByText('Reflection 3')).toBeTruthy();
  });

  it('renders without crashing for any index', () => {
    expect(() =>
      render(<ReflectionCard text="Test" index={5} />)
    ).not.toThrow();
  });
});

describe('CategoryBadge', () => {
  it('renders the category label', () => {
    const { getByText } = render(
      <CategoryBadge category="Health and wellbeing" />
    );
    expect(getByText('Health and wellbeing')).toBeTruthy();
  });

  it('renders without crashing for unknown category (uses fallback colour)', () => {
    expect(() =>
      render(<CategoryBadge category="Unknown category" />)
    ).not.toThrow();
  });
});
