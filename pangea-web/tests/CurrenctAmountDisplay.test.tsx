import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { axe, toHaveNoViolations } from 'jest-axe';
import { CurrencyAmountDisplay } from 'components/shared';
expect.extend(toHaveNoViolations);

describe('CurrencyAmountDisplay', () => {
  test('renders the formatted currency amount', () => {
    render(
      <CurrencyAmountDisplay amount={1234.56} rounding={2} currency='USD' />,
    );
    const displayedText = screen.getByText(/USD 1234.56/);
    expect(displayedText).toBeInTheDocument();
  });

  test('applies rounding correctly', () => {
    render(
      <CurrencyAmountDisplay amount={1234.567} rounding={2} currency='USD' />,
    );
    const displayedText = screen.getByText(/USD 1234.57/); // Note the rounding
    expect(displayedText).toBeInTheDocument();
  });

  test('renders without currency', () => {
    render(<CurrencyAmountDisplay amount={1234.56} rounding={2} />);
    const displayedText = screen.getByText(/1234.56/);
    expect(displayedText).toBeInTheDocument();
  });

  test('handles zero rounding', () => {
    render(
      <CurrencyAmountDisplay amount={1234.56} rounding={0} currency='EUR' />,
    );
    const displayedText = screen.getByText(/EUR 1235/); // Note rounding to nearest whole number
    expect(displayedText).toBeInTheDocument();
  });
  // Axe accessibility test
  test('should have no accessibility violations', async () => {
    const { container } = render(
      <CurrencyAmountDisplay amount={1234.56} rounding={2} currency='USD' />,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
