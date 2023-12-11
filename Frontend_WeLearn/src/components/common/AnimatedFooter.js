import React, { useEffect, useRef } from 'react';
import { useSpring, animated } from 'react-spring';
import styles from './AnimatedFooter.css';

const AnimatedFooter = () => {
  const props = useSpring({
    from: { opacity: 1, transform: 'translateY(0)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    config: { duration: 1000 },
  });

  const gooeyAnimationsRef = useRef(null);

  useEffect(() => {
    function generateBalls() {
      const gooeyAnimationsNode = gooeyAnimationsRef.current;

      for (let i = 0; i < Math.floor(window.innerWidth / 20); i++) {
        const ball = document.createElement('div');
        ball.className = 'ball';

        const colors = ['#B0B2CE', ' #262A7F'];

        ball.style.bottom = '0px';
        ball.style.left = Math.random() * window.innerWidth - 100 + 'px';
        ball.style.animationDelay = Math.random() * 5 + 's';
        ball.style.transform = 'translateY(' + Math.random() * 10 + 'px)';
        ball.style.backgroundColor = colors[i % 2];

        gooeyAnimationsNode.appendChild(ball);
      }
    }

    generateBalls();

    const handleResize = () => {
      const gooeyAnimationsNode = gooeyAnimationsRef.current;
      while (gooeyAnimationsNode.firstChild) {
        gooeyAnimationsNode.removeChild(gooeyAnimationsNode.firstChild);
      }

      generateBalls();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <animated.div className={`${styles.footer} footer`} style={props}>
      <div className={`${styles.gooeyAnimations} gooey-animations`} ref={gooeyAnimationsRef}></div>
      <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="15" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 15 -7" result="goo" />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>
      <svg viewBox="0 0 1440 328" width="100vw">
        <defs>
          <clipPath id="wave" clipPathUnits="objectBoundingBox" transform="scale(0.00069444444, 0.00304878048)">
            <path d="M504.452 27.7002C163.193 -72.9551 25.9595 18.071 0 67.4161V328H1440V27.7002C1270.34 57.14 845.711 128.3556 504.452 27.7002Z"/>
          </clipPath>
        </defs>
      </svg>
    </animated.div>
  );
};

export default AnimatedFooter;