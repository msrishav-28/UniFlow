import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { PDFStackView } from './PremiumPDFViewer';

// PremiumPDFViewer.test.tsx

// Mock dependencies
vi.mock('framer-motion', () => ({
  motion: {
    div: (props: any) => <div {...props} />,
    button: (props: any) => <button {...props} />,
  },
  AnimatePresence: (props: any) => <>{props.children}</>,
  useMotionValue: () => 0,
  useTransform: () => 1,
}));
vi.mock('lucide-react', () => ({
  FileText: () => <span data-testid="icon-filetext" />,
  ChevronLeft: () => <span data-testid="icon-chevronleft" />,
  ChevronRight: () => <span data-testid="icon-chevronright" />,
  X: () => <span data-testid="icon-x" />,
  Download: () => <span data-testid="icon-download" />,
  Share2: () => <span data-testid="icon-share2" />,
  ZoomIn: () => <span data-testid="icon-zoomin" />,
  ZoomOut: () => <span data-testid="icon-zoomout" />,
  Maximize2: () => <span data-testid="icon-maximize2" />,
  Grid: () => <span data-testid="icon-grid" />,
}));
vi.mock('react-pdf', () => ({
  Document: ({ children }: any) => <div data-testid="pdf-document">{children}</div>,
  Page: ({ pageNumber }: any) => <div data-testid={`pdf-page-${pageNumber}`}>Page {pageNumber}</div>,
  pdfjs: { GlobalWorkerOptions: { workerSrc: '' }, version: '3.11.174' },
}));
vi.mock('../../utils/hapticFeedback', () => ({
  haptics: { tap: vi.fn() },
}));

describe('PDFStackView', () => {
  const baseProps = {
    pdfUrl: '/test.pdf',
    title: 'Test PDF',
    pageCount: 5,
    coverImage: undefined,
    isActive: true,
    onEngagement: vi.fn(),
  };

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  it('renders stack preview with title and page count', () => {
    render(<PDFStackView {...baseProps} />);
    expect(screen.getByText('Test PDF')).toBeInTheDocument();
    expect(screen.getByText('5 pages')).toBeInTheDocument();
    expect(screen.getByText('Tap to read')).toBeInTheDocument();
  });

  it('expands to show PDF viewer on click', () => {
    render(<PDFStackView {...baseProps} />);
    fireEvent.click(screen.getByText('Tap to read'));
    expect(screen.getByText('Test PDF')).toBeInTheDocument();
    expect(screen.getByText('1 of 5')).toBeInTheDocument();
    expect(screen.getByTestId('icon-x')).toBeInTheDocument();
    expect(screen.getByTestId('icon-chevronleft')).toBeInTheDocument();
    expect(screen.getByTestId('icon-chevronright')).toBeInTheDocument();
    expect(screen.getByTestId('icon-zoomin')).toBeInTheDocument();
    expect(screen.getByTestId('icon-zoomout')).toBeInTheDocument();
    expect(screen.getByTestId('icon-grid')).toBeInTheDocument();
  });

  it('navigates pages with next/prev buttons', () => {
    render(<PDFStackView {...baseProps} />);
    fireEvent.click(screen.getByText('Tap to read'));
    const nextBtn = screen.getByTestId('icon-chevronright').closest('button')!;
    const prevBtn = screen.getByTestId('icon-chevronleft').closest('button')!;
    // Go to next page
    fireEvent.click(nextBtn);
    expect(screen.getByText('2')).toBeInTheDocument();
    // Go to previous page
    fireEvent.click(prevBtn);
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('zooms in and out', () => {
    render(<PDFStackView {...baseProps} />);
    fireEvent.click(screen.getByText('Tap to read'));
    const zoomInBtn = screen.getByTestId('icon-zoomin').closest('button')!;
    const zoomOutBtn = screen.getByTestId('icon-zoomout').closest('button')!;
    // Zoom in
    fireEvent.click(zoomInBtn);
    expect(screen.getByText('125%')).toBeInTheDocument();
    // Zoom out
    fireEvent.click(zoomOutBtn);
    expect(screen.getByText('100%')).toBeInTheDocument();
  });

  it('shows thumbnail grid and navigates to page on thumbnail click', () => {
    render(<PDFStackView {...baseProps} />);
    fireEvent.click(screen.getByText('Tap to read'));
    const gridBtn = screen.getByTestId('icon-grid').closest('button')!;
    fireEvent.click(gridBtn);
    // Should render 5 thumbnails
    for (let i = 1; i <= 5; i++) {
      expect(screen.getByText(String(i))).toBeInTheDocument();
      expect(screen.getByTestId(`pdf-page-${i}`)).toBeInTheDocument();
    }
    // Click thumbnail for page 3
    fireEvent.click(screen.getAllByText('3')[0]);
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('calls onEngagement with time spent when closed', () => {
    const onEngagement = vi.fn();
    render(<PDFStackView {...baseProps} onEngagement={onEngagement} />);
    fireEvent.click(screen.getByText('Tap to read'));
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    fireEvent.click(screen.getByTestId('icon-x').closest('button')!);
    expect(onEngagement).toHaveBeenCalled();
    const timeSpent = onEngagement.mock.calls[0][0];
    expect(timeSpent).toBeGreaterThanOrEqual(2);
  });

  it('renders correct page when input is changed', () => {
    render(<PDFStackView {...baseProps} />);
    fireEvent.click(screen.getByText('Tap to read'));
    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, { target: { value: '4' } });
    expect(screen.getByText('4')).toBeInTheDocument();
  });
});