export const ease = [0.22, 1, 0.36, 1] as const;

export const cardSpring = { duration: 0.65, ease: [0.34, 1.56, 0.64, 1] as const };

export function reveal(delay = 0) {
  return {
    initial: { opacity: 0, y: 22 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" },
    transition: { duration: 0.6, ease, delay },
  };
}

export function revealDrop(delay = 0) {
  return {
    initial: { opacity: 0, y: -18 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" },
    transition: { duration: 0.55, ease, delay },
  };
}
