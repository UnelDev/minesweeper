import { useEffect, useRef, useState } from 'react';

class Particle {
	x: number;
	y: number;
	velocityX: number;
	velocityY: number;
	size: number;
	color: string;

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
		this.velocityX = (Math.random() - 0.5) * 20;
		this.velocityY = (Math.random() - 0.5) * 20;
		this.size = Math.random() * 5 + 15;
		this.color = this.getRandomColor();
	}

	private getRandomColor() {
		// 20% of black particles
		if (Math.random() > 0.2) {
			return '#E52222';
		} else {
			return '#181818';
		}
	}

	update() {
		this.x += this.velocityX;
		this.y += this.velocityY;
		this.size *= 0.95;
	}

	draw(ctx: CanvasRenderingContext2D) {
		ctx.beginPath();
		ctx.rect(this.x, this.y, this.size, this.size);
		ctx.fillStyle = this.color;
		ctx.fill();
	}
}

function ParticleExplosion({ e }: { e: { x: number; y: number } }) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const particlesRef = useRef<Array<Particle>>([]);
	const [content, setContent] = useState(<canvas className="ExplosionCanva" ref={canvasRef} />);

	useEffect(() => {
		const canvas = canvasRef.current;
		const ctx = canvas?.getContext('2d', { alpha: true });

		if (canvas && ctx) {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;

			const createParticles = () => {
				particlesRef.current = [];
				const y = e.y;
				const x = e.x;
				for (let i = 0; i < 50; i++) {
					particlesRef.current.push(new Particle(x, y));
				}
			};

			const animate = () => {
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				particlesRef.current.forEach(particle => {
					particle.update();
					particle.draw(ctx);
				});

				particlesRef.current = particlesRef.current.filter(p => p.size > 0.5);

				requestAnimationFrame(animate);
			};

			createParticles();

			animate();
			setTimeout(() => {
				setContent(<></>);
			}, 1000);
		}
	}, [e.x, e.y]);

	return content;
}

export default ParticleExplosion;
