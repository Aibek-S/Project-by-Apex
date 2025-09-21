// Animation utilities and constants
export const ANIMATION_DURATION = {
  FAST: 200,
  MEDIUM: 300,
  SLOW: 400
};

export const EASING = {
  STANDARD: [0.4, 0, 0.2, 1],
  ACCELERATE: [0.4, 0, 1, 1],
  DECELERATE: [0, 0, 0.2, 1]
};

// Framer Motion variants for page transitions
export const pageVariants = {
  initial: {
    opacity: 0,
    y: 20
  },
  enter: {
    opacity: 1,
    y: 0,
    transition: {
      duration: ANIMATION_DURATION.MEDIUM / 1000,
      ease: EASING.STANDARD
    }
  },
  exit: {
    opacity: 0,
    y: 20,
    transition: {
      duration: ANIMATION_DURATION.MEDIUM / 1000,
      ease: EASING.STANDARD
    }
  }
};

// Framer Motion variants for modal transitions
export const modalVariants = {
  hidden: {
    opacity: 0,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: ANIMATION_DURATION.MEDIUM / 1000,
      ease: EASING.STANDARD
    }
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: ANIMATION_DURATION.MEDIUM / 1000,
      ease: EASING.STANDARD
    }
  }
};

// Framer Motion variants for slide transitions
export const slideVariants = {
  initial: (direction) => ({
    x: direction > 0 ? 100 : -100,
    opacity: 0
  }),
  animate: {
    x: 0,
    opacity: 1,
    transition: {
      duration: ANIMATION_DURATION.MEDIUM / 1000,
      ease: EASING.STANDARD
    }
  },
  exit: (direction) => ({
    x: direction > 0 ? -100 : 100,
    opacity: 0,
    transition: {
      duration: ANIMATION_DURATION.MEDIUM / 1000,
      ease: EASING.STANDARD
    }
  })
};

// CSS transition classes
export const cssTransitions = {
  fade: `transition-opacity duration-${ANIMATION_DURATION.MEDIUM} ease-in-out`,
  scale: `transition-transform duration-${ANIMATION_DURATION.FAST} ease-in-out`,
  slideUp: `transition-all duration-${ANIMATION_DURATION.MEDIUM} ease-in-out`,
  theme: `transition-colors duration-${ANIMATION_DURATION.MEDIUM} ease-in-out`
};