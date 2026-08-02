import React, { useState, useEffect, useRef } from 'react';
import { heroSlides } from '../data/products';
import Beams from './Beams';

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [prevSlide, setPrevSlide] = useState(null);
  const [direction, setDirection] = useState('next');
  const transitionTimerRef = useRef(null);

  const goToSlide = (nextIdx, dir = 'next') => {
    if (nextIdx === currentSlide) return;

    if (transitionTimerRef.current) {
      clearTimeout(transitionTimerRef.current);
    }

    setPrevSlide(currentSlide);
    setDirection(dir);
    setCurrentSlide(nextIdx);

    // Reset prevSlide state after transition completes (900ms)
    transitionTimerRef.current = setTimeout(() => {
      setPrevSlide(null);
    }, 900);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      goToSlide((currentSlide + 1) % heroSlides.length, 'next');
    }, 5000);
    return () => clearInterval(timer);
  }, [currentSlide]);

  useEffect(() => {
    return () => {
      if (transitionTimerRef.current) {
        clearTimeout(transitionTimerRef.current);
      }
    };
  }, []);

  const handlePrev = () => {
    const prevIdx = (currentSlide - 1 + heroSlides.length) % heroSlides.length;
    goToSlide(prevIdx, 'prev');
  };

  const handleNext = () => {
    const nextIdx = (currentSlide + 1) % heroSlides.length;
    goToSlide(nextIdx, 'next');
  };

  const handleDotClick = (targetIdx) => {
    if (targetIdx === currentSlide) return;
    const dir = targetIdx > currentSlide ? 'next' : 'prev';
    goToSlide(targetIdx, dir);
  };

  const activeTheme = heroSlides[currentSlide]?.textTheme || 'light';

  return (
    <section className={`hero-section hero-theme-${activeTheme}`} id="heroSection">
      {/* React Bits Beams WebGL Ambient Background Layer */}
      <div className="hero-beams-background">
        <Beams
          beamWidth={2.5}
          beamHeight={15}
          beamNumber={12}
          lightColor="#D4A088"
          speed={1.5}
          noiseIntensity={1.2}
          scale={0.25}
          rotation={15}
        />
      </div>

      <div className="hero-slider" id="heroSlider">
        {heroSlides.map((slide, idx) => {
          const isActive = idx === currentSlide;
          const isExiting = idx === prevSlide;

          let slideClasses = 'hero-slide';
          if (isActive) {
            slideClasses += ` active enter-${direction}`;
          } else if (isExiting) {
            slideClasses += ` exiting exit-${direction}`;
          } else {
            slideClasses += ` enter-${direction}`;
          }

          return (
            <div
              key={slide.id}
              className={slideClasses}
              data-slide={idx}
            >
              {slide.bgGradient ? (
                <div className="hero-bg hero-bg-gradient"></div>
              ) : (
                <div
                  className="hero-bg"
                  style={{
                    backgroundImage: `url(${slide.bg})`,
                    backgroundPosition: slide.bgPosition || 'center',
                    backgroundSize: slide.bgSize || 'cover',
                    backgroundColor: slide.bgColor || 'transparent',
                  }}
                ></div>
              )}
              <div className={`hero-overlay ${slide.overlayLight ? 'overlay-light' : ''}`}></div>
              <div className={`hero-content text-theme-${slide.textTheme || 'light'}`}>
                <div className="hero-badge">{slide.badge}</div>
                <h1 className="hero-title">
                  <span className="hero-title-script">{slide.titleScript}</span>
                  <span className="hero-title-sub">{slide.titleSub}</span>
                </h1>
                <p className="hero-desc">{slide.desc}</p>
                <a href="#collection" className="hero-cta">
                  {slide.cta}
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                  </svg>
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Controls */}
      <button className="slider-arrow slider-prev" onClick={handlePrev} aria-label="Previous slide">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
      </button>
      <button className="slider-arrow slider-next" onClick={handleNext} aria-label="Next slide">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </button>

      <div className="slider-dots">
        {heroSlides.map((_, idx) => (
          <span
            key={idx}
            className={`dot ${idx === currentSlide ? 'active' : ''}`}
            onClick={() => handleDotClick(idx)}
          ></span>
        ))}
      </div>
      <div className="slider-counter">
        <span>{currentSlide + 1}</span>/3
      </div>
    </section>
  );
};

export default HeroSlider;
