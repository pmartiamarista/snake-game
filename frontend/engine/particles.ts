/**
 * Represents a single visual effect particle in the world.
 */
export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
}

/**
 * Manages the lifecycle and rendering of premium visual feedback particles.
 */
export class ParticleSystem {
  private particles: Particle[] = [];

  /**
   * Spawns a burst of particles at a specific coordinate.
   * @param count Number of particles to generate.
   */
  spawn(x: number, y: number, color: string, count: number = 8) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x, y,
        vx: (Math.random() - 0.5) * 5,
        vy: (Math.random() - 0.5) * 5,
        life: 1.0,
        color
      });
    }
  }

  /**
   * Updates particle positions and lifecycles.
   */
  update() {
    this.particles = this.particles.filter(p => p.life > 0);
    this.particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.05;
    });
  }

  /**
   * Renders the active particles to the canvas.
   */
  draw(ctx: CanvasRenderingContext2D) {
    this.particles.forEach(p => {
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1.0;
  }
}
