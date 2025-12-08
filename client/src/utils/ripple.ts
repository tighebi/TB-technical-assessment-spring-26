// Ripple effect utility

export interface Ripple {
  x: number;
  y: number;
  id: number;
}

/**
 * Creates ripple effects at the specified coordinates
 * @param x - X coordinate (pageX)
 * @param y - Y coordinate (pageY)
 * @param count - Number of ripples to create (default: 1)
 * @param staggerMs - Delay between ripples in milliseconds (default: 250)
 * @param onRippleCreate - Callback when a ripple should be created
 * @param onRippleRemove - Callback when a ripple should be removed
 * @param durationMs - Duration of each ripple in milliseconds (default: 2000)
 */
export function createRipples(
  x: number,
  y: number,
  onRippleCreate: (ripple: Ripple) => void,
  onRippleRemove: (id: number) => void,
  count: number = 1,
  staggerMs: number = 250,
  durationMs: number = 2000
): void {
  const baseId = Date.now();
  
  for (let i = 0; i < count; i++) {
    const id = baseId + i;
    setTimeout(() => {
      onRippleCreate({ x, y, id });
      setTimeout(() => {
        onRippleRemove(id);
      }, durationMs);
    }, i * staggerMs);
  }
}

