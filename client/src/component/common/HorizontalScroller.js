// src/components/common/HorizontalScroller.js
import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react'; // or use Unicode arrows if no icon lib

function HorizontalScroller({ children }) {
  const scrollRef = useRef();

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <button
        onClick={() => scroll('left')}
        style={{
          position: 'absolute',
          left: 0,
          top: '40%',
          transform: 'translateY(-50%)',
          background: 'rgba(0,0,0,0.4)',
          color: '#fff',
          border: 'none',
          borderRadius: '50%',
          width: '35px',
          height: '35px',
          cursor: 'pointer',
          zIndex: 1
        }}
      >
        <ChevronLeft size={20} />
      </button>
      <motion.div
        ref={scrollRef}
        style={{
          display: 'flex',
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          gap: '20px',
          padding: '10px'
        }}
        whileTap={{ cursor: "grabbing" }}
      >
        {React.Children.map(children, (child, index) => (
          <motion.div
            key={index}
            style={{ scrollSnapAlign: 'center', flex: '0 0 auto' }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            {child}
          </motion.div>
        ))}
      </motion.div>
      <button
        onClick={() => scroll('right')}
        style={{
          position: 'absolute',
          right: 0,
          top: '40%',
          transform: 'translateY(-50%)',
          background: 'rgba(0,0,0,0.4)',
          color: '#fff',
          border: 'none',
          borderRadius: '50%',
          width: '35px',
          height: '35px',
          cursor: 'pointer',
          zIndex: 1
        }}
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}

export default HorizontalScroller;
