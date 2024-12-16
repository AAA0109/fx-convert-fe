import { render, screen } from '@testing-library/react';
import TypographyLoader from 'components/shared/TypographyLoader';
describe('TypographyLoader', () => {
  const testText = 'Test content';

  it('renders Typography with children when not loading', () => {
    render(<TypographyLoader isLoading={false}>{testText}</TypographyLoader>);
    expect(screen.getByText(testText)).toBeInTheDocument();
    expect(screen.queryByTestId('typography-skeleton')).not.toBeInTheDocument();
  });

  it('renders a Skeleton instead of Typography when loading', () => {
    render(<TypographyLoader isLoading>{testText}</TypographyLoader>);
    expect(screen.getByTestId('typography-skeleton')).toBeInTheDocument();
    expect(screen.queryByText(testText)).not.toBeInTheDocument();
  });

  it('passes skeletonProps to the Skeleton component', () => {
    const skeletonTestProps = { width: '60%', height: '10px' };
    render(
      <TypographyLoader isLoading skeletonProps={skeletonTestProps}>
        {testText}
      </TypographyLoader>,
    );
    const skeleton = screen.getByTestId('typography-skeleton');
    expect(skeleton).toHaveStyle(`width: ${skeletonTestProps.width}`);
    expect(skeleton).toHaveStyle(`height: ${skeletonTestProps.height}`);
  });

  it('renders a Skeleton with default props when loading and skeletonProps are not provided', () => {
    render(<TypographyLoader isLoading>{testText}</TypographyLoader>);
    const skeleton = screen.getByTestId('typography-skeleton');
    expect(skeleton).toBeInTheDocument();
  });
});
