// Scroll utility functions

/**
 * Smoothly scrolls to a target element using cubic easing
 */
export function smoothScrollToElement(
  element: HTMLElement,
  duration: number = 800,
  onComplete?: () => void
): void {
  const startPosition = window.pageYOffset || window.scrollY || document.documentElement.scrollTop;
  const elementRect = element.getBoundingClientRect();
  const targetPosition = startPosition + elementRect.top;
  const distance = targetPosition - startPosition;
  
  if (Math.abs(distance) < 1) {
    onComplete?.();
    return;
  }

  let animationFrameId: number | null = null;
  let isAnimating = true;
  const startTime = performance.now();

  const animate = (timestamp: number) => {
    if (!isAnimating) return;

    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    const easeInOutCubic = progress < 0.5
      ? 4 * progress * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 3) / 2;
    
    const currentPosition = startPosition + (distance * easeInOutCubic);
    window.scrollTo({
      top: currentPosition,
      behavior: 'auto'
    });

    if (progress < 1) {
      animationFrameId = requestAnimationFrame(animate);
    } else {
      window.scrollTo({
        top: targetPosition,
        behavior: 'auto'
      });
      isAnimating = false;
      animationFrameId = null;
      onComplete?.();
    }
  };

  animationFrameId = requestAnimationFrame(animate);
}

/**
 * Scrolls to top of page
 */
export function scrollToTop(): void {
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
}

