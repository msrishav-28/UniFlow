import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { 
  FileText, ChevronLeft, ChevronRight, X, Download, 
  Share2, ZoomIn, ZoomOut, Maximize2, Grid
} from 'lucide-react';
import { haptics } from '../../utils/hapticFeedback';
import { Document, Page, pdfjs } from 'react-pdf';

// Set worker URL for PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface PDFStackViewProps {
  pdfUrl: string;
  title: string;
  pageCount: number;
  coverImage?: string;
  isActive: boolean;
  onEngagement?: (time: number) => void;
}

export const PDFStackView: React.FC<PDFStackViewProps> = ({
  pdfUrl,
  title,
  pageCount,
  coverImage,
  isActive,
  onEngagement
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showThumbnails, setShowThumbnails] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [numPages, setNumPages] = useState<number | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    if (isExpanded) {
      startTimeRef.current = Date.now();
    } else if (startTimeRef.current && onEngagement) {
      const timeSpent = (Date.now() - startTimeRef.current) / 1000;
      onEngagement(timeSpent);
    }
  }, [isExpanded, onEngagement]);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    if (currentPage > numPages) setCurrentPage(1);
  }

  const handleExpand = () => {
    haptics.tap();
    setIsExpanded(true);
  };

  const handleClose = () => {
    haptics.tap();
    setIsExpanded(false);
    setCurrentPage(1);
    setZoomLevel(1);
  };

  const goToPage = (page: number) => {
    haptics.tap();
    const maxPage = numPages || pageCount;
    setCurrentPage(Math.max(1, Math.min(page, maxPage)));
  };

  const handleZoom = (delta: number) => {
    haptics.tap();
    setZoomLevel(Math.max(0.5, Math.min(3, zoomLevel + delta)));
  };

  // Stack Preview Component
  const StackPreview = () => {
    const y = useMotionValue(0);
    const scale = useTransform(y, [-50, 0, 50], [0.95, 1, 0.95]);
    
    return (
      <motion.div
        className="relative w-full h-full cursor-pointer"
        onClick={handleExpand}
        whileTap={{ scale: 0.98 }}
      >
        {/* Background pages for stack effect */}
        <motion.div
          className="absolute inset-4 bg-surface-elevated rounded-2xl shadow-2xl"
          style={{
            transform: 'rotate(-2deg) translateY(8px)',
            opacity: 0.6
          }}
        />
        <motion.div
          className="absolute inset-3 bg-surface-elevated rounded-2xl shadow-2xl"
          style={{
            transform: 'rotate(1deg) translateY(4px)',
            opacity: 0.8
          }}
        />
        
        {/* Main cover */}
        <motion.div
          className="relative h-full mx-2 bg-surface-elevated rounded-2xl shadow-2xl overflow-hidden"
          style={{ scale }}
          drag="y"
          dragConstraints={{ top: -50, bottom: 50 }}
          dragElastic={0.2}
          onDrag={(_, info) => y.set(info.offset.y)}
          onDragEnd={() => y.set(0)}
        >
          {/* Cover Image */}
          <div className="absolute inset-0">
            {coverImage ? (
              <img
                src={coverImage}
                alt={title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center">
                <FileText size={120} className="text-white/20" />
              </div>
            )}
          </div>
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {/* PDF Badge */}
              <div className="inline-flex items-center glass-surface px-4 py-2 rounded-full mb-4">
                <FileText size={16} className="text-white mr-2" />
                <span className="text-white text-sm font-medium">PDF Document</span>
              </div>
              
              {/* Title */}
              <h2 className="text-3xl font-bold text-white mb-3">{title}</h2>
              
              {/* Page count */}
              <div className="flex items-center justify-between">
                <p className="text-white/80 text-lg">{pageCount} pages</p>
                <motion.div
                  className="flex items-center text-white"
                  animate={{ x: [0, 10, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <span className="text-sm mr-2">Tap to read</span>
                  <ChevronRight size={20} />
                </motion.div>
              </div>
            </motion.div>
          </div>
          
          {/* Page edges effect */}
          <div className="absolute right-0 top-8 bottom-8 w-8 bg-gradient-to-l from-black/20 to-transparent" />
          <div className="absolute right-1 top-8 bottom-8 w-px bg-white/10" />
          <div className="absolute right-2 top-8 bottom-8 w-px bg-white/5" />
        </motion.div>
      </motion.div>
    );
  };

  // Full PDF Viewer Component
  const PDFViewer = () => {
    const [touchStart, setTouchStart] = useState(0);

    const handleTouchStart = (e: React.TouchEvent) => {
      setTouchStart(e.touches[0].clientX);
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
      const touchEnd = e.changedTouches[0].clientX;
      const diff = touchStart - touchEnd;

      const maxPage = numPages || pageCount;
      if (Math.abs(diff) > 50) {
        if (diff > 0 && currentPage < maxPage) {
          goToPage(currentPage + 1);
        } else if (diff < 0 && currentPage > 1) {
          goToPage(currentPage - 1);
        }
      }
    };

    const totalPages = numPages || pageCount;

    return (
      <motion.div
        className="fixed inset-0 z-50 bg-surface-primary"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Header */}
        <motion.div
          className="absolute top-0 left-0 right-0 glass-surface-elevated z-10 safe-area-top"
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <div className="flex items-center justify-between p-4">
            <motion.button
              onClick={handleClose}
              className="p-2 rounded-xl hover:bg-white/10 transition-colors"
              whileTap={{ scale: 0.9 }}
            >
              <X size={24} className="text-primary" />
            </motion.button>
            
            <div className="flex-1 text-center mx-4">
              <h3 className="text-body font-semibold text-primary truncate">{title}</h3>
              <p className="text-caption text-secondary">
                {currentPage} of {pageCount}
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <motion.button
                onClick={() => setShowThumbnails(!showThumbnails)}
                className="p-2 rounded-xl hover:bg-white/10 transition-colors"
                whileTap={{ scale: 0.9 }}
              >
                <Grid size={20} className="text-primary" />
              </motion.button>
              
              <motion.button
                className="p-2 rounded-xl hover:bg-white/10 transition-colors"
                whileTap={{ scale: 0.9 }}
              >
                <Share2 size={20} className="text-primary" />
              </motion.button>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="h-1 bg-surface-tertiary">
            <motion.div
              className="h-full bg-gradient-to-r from-primary-500 to-primary-600"
              initial={{ width: 0 }}
              animate={{ width: `${(currentPage / pageCount) * 100}%` }}
              transition={{ type: 'spring', stiffness: 300 }}
            />
          </div>
        </motion.div>

        {/* Main Content Area */}
        <div className="h-full pt-20 pb-20">
          <AnimatePresence mode="wait">
            {!showThumbnails ? (
              /* Page View */
              <motion.div
                key={`page-${currentPage}`}
                className="h-full flex items-center justify-center p-4"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                <div 
                  className="relative max-w-3xl w-full h-full bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl overflow-hidden flex items-center justify-center"
                  style={{ transform: `scale(${zoomLevel})` }}
                >
                  {/* PDF Page content */}
                  <Document
                    file={pdfUrl}
                    onLoadSuccess={onDocumentLoadSuccess}
                    loading={<div className="text-center text-secondary">Loading PDF…</div>}
                  >
                    <Page
                      pageNumber={currentPage}
                      width={Math.min(window.innerWidth - 32, 800)}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                      loading={<div className="text-center text-secondary">Loading page…</div>}
                    />
                  </Document>
                  {/* Page number overlay */}
                  <div className="absolute bottom-4 right-4 glass-surface px-3 py-1 rounded-full">
                    <span className="text-caption text-white font-medium">
                      {currentPage}
                    </span>
                  </div>
                </div>
              </motion.div>
            ) : (
              /* Thumbnail Grid */
              <motion.div
                key="thumbnails"
                className="h-full overflow-y-auto p-4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <div className="grid grid-cols-3 gap-4 pb-4">
                  {Array.from({ length: totalPages }, (_, index) => (
                    <motion.button
                      key={index}
                      onClick={() => {
                        goToPage(index + 1);
                        setShowThumbnails(false);
                      }}
                      className={`relative aspect-[3/4] rounded-lg overflow-hidden border-2 transition-all ${
                        currentPage === index + 1
                          ? 'border-primary-500 shadow-lg'
                          : 'border-border-primary hover:border-primary-300'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Document
                        file={pdfUrl}
                        loading={null}
                        renderMode="svg"
                        className="w-full h-full"
                      >
                        <Page
                          pageNumber={index + 1}
                          width={120}
                          renderTextLayer={false}
                          renderAnnotationLayer={false}
                          loading={
                            <div className="w-full h-full bg-surface-tertiary flex items-center justify-center">
                              <FileText size={32} className="text-secondary" />
                            </div>
                          }
                        />
                      </Document>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                        <span className="text-white text-xs font-medium">
                          {index + 1}
                        </span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Controls */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 glass-surface-elevated safe-area-bottom"
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <div className="flex items-center justify-between p-4">
            {/* Page Navigation */}
            <div className="flex items-center space-x-4">
              <motion.button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-3 rounded-xl transition-all ${
                  currentPage === 1
                    ? 'opacity-30 cursor-not-allowed'
                    : 'hover:bg-white/10'
                }`}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronLeft size={24} className="text-primary" />
              </motion.button>
              
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  value={currentPage}
                  onChange={(e) => goToPage(parseInt(e.target.value) || 1)}
                  className="w-16 px-2 py-1 text-center bg-surface-tertiary rounded-lg text-primary"
                  min={1}
                  max={pageCount}
                />
                <span className="text-secondary">/</span>
                <span className="text-primary font-medium">{pageCount}</span>
              </div>
              
              <motion.button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === pageCount}
                className={`p-3 rounded-xl transition-all ${
                  currentPage === pageCount
                    ? 'opacity-30 cursor-not-allowed'
                    : 'hover:bg-white/10'
                }`}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronRight size={24} className="text-primary" />
              </motion.button>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center space-x-2">
              <motion.button
                onClick={() => handleZoom(-0.25)}
                className="p-2 rounded-xl hover:bg-white/10 transition-colors"
                whileTap={{ scale: 0.9 }}
              >
                <ZoomOut size={20} className="text-primary" />
              </motion.button>
              
              <span className="text-caption text-secondary w-12 text-center">
                {Math.round(zoomLevel * 100)}%
              </span>
              
              <motion.button
                onClick={() => handleZoom(0.25)}
                className="p-2 rounded-xl hover:bg-white/10 transition-colors"
                whileTap={{ scale: 0.9 }}
              >
                <ZoomIn size={20} className="text-primary" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <>
      {/* Stack Preview in Feed */}
      {!isExpanded && <StackPreview />}
      
      {/* Full PDF Viewer */}
      <AnimatePresence>
        {isExpanded && <PDFViewer />}
      </AnimatePresence>
    </>
  );
};