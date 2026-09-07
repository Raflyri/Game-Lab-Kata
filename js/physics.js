/**
 * Physics & Canvas Rendering Engine: "Laboratorium Kata"
 * Mendukung responsivitas penuh (Desktop, Tablet, dan Layar HP Portrait/Landscape)
 */

class GlossyBubble {
    constructor(wordItem, x, y, radius = 55) {
        this.wordItem = wordItem; // { subject, correctTarget, ... }
        this.x = x;
        this.y = y;
        this.baseRadius = radius;
        this.radius = radius;
        
        // Parameter Fisika Jatuh Perlahan
        this.vy = 0.55; // Kecepatan jatuh dasar yang nyaman untuk anak SD
        this.swayAngle = Math.random() * Math.PI * 2;
        this.swaySpeed = 0.025;
        this.swayAmplitude = 1.1;

        // Efek Jelly / Deformasi saat disentuh & jatuh
        this.scaleX = 1.0;
        this.scaleY = 1.0;
        this.wobblePhase = 0;

        // Status Interaksi
        this.isDragging = false;
        this.isAlive = true;
        this.touchOffsetX = 0;
        this.touchOffsetY = 0;

        // Warna Gelembung Ceria Ramah Anak
        const palette = [
            { main: '#ff758c', light: '#ff7eb3', shadow: '#c43a5d' }, // Strawberry Pink
            { main: '#4facfe', light: '#00f2fe', shadow: '#0072ff' }, // Ocean Sky
            { main: '#43e97b', light: '#38f9d7', shadow: '#11998e' }, // Mint Magic
            { main: '#fa709a', light: '#fee140', shadow: '#d13b65' }, // Sunset Peach
            { main: '#a18cd1', light: '#fbc2eb', shadow: '#785bbf' }  // Purple Candy
        ];
        this.colorTheme = palette[Math.floor(Math.random() * palette.length)];
    }

    update(width, height) {
        if (!this.isAlive) return;

        if (this.isDragging) {
            this.scaleX = 1.05 + Math.sin(this.wobblePhase) * 0.05;
            this.scaleY = 0.95 - Math.sin(this.wobblePhase) * 0.05;
            this.wobblePhase += 0.15;
            return;
        }

        // Efek ayunan santai melayang di udara
        this.swayAngle += this.swaySpeed;
        this.x += Math.sin(this.swayAngle) * this.swayAmplitude;
        this.y += this.vy;

        // Restorasi bentuk jelly
        this.scaleX += (1.0 - this.scaleX) * 0.1;
        this.scaleY += (1.0 - this.scaleY) * 0.1;

        // Batas tepi layar
        if (this.x < this.radius) {
            this.x = this.radius;
        } else if (this.x > width - this.radius) {
            this.x = width - this.radius;
        }
    }

    draw(ctx) {
        if (!this.isAlive) return;

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.scale(this.scaleX, this.scaleY);

        const r = this.radius;

        // 1. Bayangan Gelembung
        ctx.beginPath();
        ctx.arc(3, 6, r * 0.9, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.07)';
        ctx.fill();

        // 2. Lingkaran Dasar Gelembung dengan Radial Gradient Spherical
        const grad = ctx.createRadialGradient(-r * 0.35, -r * 0.35, r * 0.15, 0, 0, r);
        grad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
        grad.addColorStop(0.2, this.colorTheme.light);
        grad.addColorStop(0.7, this.colorTheme.main);
        grad.addColorStop(1, this.colorTheme.shadow);

        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // 3. Rim Glow Kaca
        ctx.lineWidth = 3;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.stroke();

        // 4. Pantulan Cahaya Utama (Glossy Highlight Kiri Atas)
        ctx.save();
        ctx.beginPath();
        ctx.ellipse(-r * 0.35, -r * 0.38, r * 0.35, r * 0.18, -Math.PI / 4, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.fill();
        ctx.restore();

        // 5. Pantulan Cahaya Sekunder (Titik)
        ctx.beginPath();
        ctx.arc(-r * 0.52, -r * 0.1, r * 0.08, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fill();

        // 6. Pantulan Bawah (Crescent Rim)
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.88, Math.PI * 0.25, Math.PI * 0.75);
        ctx.lineWidth = 3.5;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.stroke();

        // 7. Teks Kata Subjek yang Ukurannya Proporsional dengan Radius
        const fontSize = Math.max(14, Math.round(r * 0.34));
        ctx.font = `bold ${fontSize}px "Fredoka", "Nunito", sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Outlined Text agar selalu kontras
        ctx.lineWidth = 4;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.strokeText(this.wordItem.subject, 0, 2);

        ctx.fillStyle = '#2d3748';
        ctx.fillText(this.wordItem.subject, 0, 2);

        ctx.restore();
    }

    containsPoint(px, py) {
        const dx = px - this.x;
        const dy = py - this.y;
        return (dx * dx + dy * dy) <= (this.radius * 1.35) * (this.radius * 1.35);
    }
}

/**
 * Tabung Lab Reaksi / Erlenmeyer Flask di Bagian Bawah Layar
 * Mendukung penyesuaian ukuran otomatis untuk layar ponsel dan tablet
 */
class FlaskTarget {
    constructor(index, label, x, y, width, height, colorTheme) {
        this.index = index;
        this.label = label;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.colorTheme = colorTheme || {
            liquidTop: '#00f2fe',
            liquidBottom: '#4facfe',
            tagBg: '#0072ff',
            tagText: '#ffffff'
        };

        this.waveTime = Math.random() * 10;
        this.isHighlighted = false;
        this.bubbles = [];
        this.initLiquidBubbles();
    }

    initLiquidBubbles() {
        for (let i = 0; i < 3; i++) {
            this.bubbles.push({
                x: (Math.random() - 0.5) * (this.width * 0.45),
                y: Math.random() * (this.height * 0.45),
                r: 2 + Math.random() * 2.5,
                speed: 0.5 + Math.random() * 0.7
            });
        }
    }

    update() {
        this.waveTime += 0.05;
        this.bubbles.forEach(b => {
            b.y -= b.speed;
            if (b.y < 5) {
                b.y = this.height * 0.5;
                b.x = (Math.random() - 0.5) * (this.width * 0.5);
            }
        });
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);

        const w = this.width;
        const h = this.height;
        const neckW = w * 0.32;
        const neckH = h * 0.28;
        const baseW = w;

        // 1. Highlight Lingkaran Bercahaya jika Gelembung didekatkan
        if (this.isHighlighted) {
            ctx.beginPath();
            ctx.ellipse(0, -h * 0.5, w * 0.75, h * 0.7, 0, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 235, 59, 0.28)';
            ctx.fill();
            ctx.strokeStyle = '#ffd700';
            ctx.lineWidth = 3.5;
            ctx.setLineDash([6, 6]);
            ctx.stroke();
            ctx.setLineDash([]);
        }

        // 2. Masking Bentuk Erlenmeyer & Menggambar Cairan Bergelombang
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(-neckW / 2, -h);
        ctx.lineTo(neckW / 2, -h);
        ctx.lineTo(neckW / 2, -h + neckH);
        ctx.lineTo(baseW / 2, 0);
        ctx.lineTo(-baseW / 2, 0);
        ctx.lineTo(-neckW / 2, -h + neckH);
        ctx.closePath();
        ctx.clip();

        const liquidLevel = -h * 0.54;
        const liqGrad = ctx.createLinearGradient(0, liquidLevel, 0, 0);
        liqGrad.addColorStop(0, this.colorTheme.liquidTop);
        liqGrad.addColorStop(1, this.colorTheme.liquidBottom);

        ctx.beginPath();
        ctx.moveTo(-baseW, 0);
        for (let lx = -baseW; lx <= baseW; lx += 4) {
            const waveY = liquidLevel + Math.sin(this.waveTime + lx * 0.06) * 4;
            ctx.lineTo(lx, waveY);
        }
        ctx.lineTo(baseW, 0);
        ctx.closePath();
        ctx.fillStyle = liqGrad;
        ctx.fill();

        // Buih cairan lab
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        this.bubbles.forEach(b => {
            ctx.beginPath();
            ctx.arc(b.x, -b.y, b.r, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.restore();

        // 3. Garis Kaca Tabung
        // Bibir tabung
        ctx.beginPath();
        ctx.rect(-neckW / 2 - 3, -h - 3, neckW + 6, 7);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.fill();
        ctx.strokeStyle = '#90caf9';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Dinding tabung
        ctx.beginPath();
        ctx.moveTo(-neckW / 2, -h);
        ctx.lineTo(-neckW / 2, -h + neckH);
        ctx.lineTo(-baseW / 2, 0);
        ctx.lineTo(baseW / 2, 0);
        ctx.lineTo(neckW / 2, -h + neckH);
        ctx.lineTo(neckW / 2, -h);
        ctx.strokeStyle = '#90caf9';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Pantulan kaca putih vertikal
        ctx.beginPath();
        ctx.moveTo(-neckW / 2 + 4, -h + 6);
        ctx.lineTo(-neckW / 2 + 4, -h + neckH);
        ctx.lineTo(-baseW / 2 + 10, -6);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // 4. Kapsul Tag Kata Predikat
        const tagW = Math.max(76, baseW * 1.05);
        const tagH = Math.max(30, Math.round(h * 0.28));
        const tagY = 6;

        ctx.beginPath();
        const rad = 12;
        ctx.roundRect(-tagW / 2, tagY, tagW, tagH, rad);
        ctx.fillStyle = this.colorTheme.tagBg;
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Teks Label Wadah
        const tagFontSize = Math.max(13, Math.min(18, Math.round(tagH * 0.5)));
        ctx.font = `bold ${tagFontSize}px "Fredoka", "Nunito", sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = this.colorTheme.tagText;
        ctx.fillText(this.label, 0, tagY + tagH / 2 + 1);

        ctx.restore();
    }

    isBubbleInside(bubble) {
        const dx = bubble.x - this.x;
        const dy = bubble.y - (this.y - this.height * 0.5);
        return Math.abs(dx) <= (this.width * 0.65) && Math.abs(dy) <= (this.height * 0.65);
    }
}

/**
 * Sistem Partikel Efek Ledakan & Teks Melayang
 */
class ParticleSystem {
    constructor() {
        this.particles = [];
        this.floatingTexts = [];
    }

    createExplosion(x, y, color = '#ffeb3b') {
        for (let i = 0; i < 14; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 2 + Math.random() * 4.5;
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 1.5,
                radius: 3.5 + Math.random() * 4.5,
                color: color,
                alpha: 1.0,
                decay: 0.02 + Math.random() * 0.02,
                isStar: Math.random() > 0.4
            });
        }
    }

    addFloatingText(text, x, y, color = '#2e7d32') {
        this.floatingTexts.push({
            text: text,
            x: x,
            y: y,
            vy: -1.6,
            alpha: 1.0,
            scale: 1.25,
            color: color
        });
    }

    update() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.12;
            p.alpha -= p.decay;
            if (p.alpha <= 0) {
                this.particles.splice(i, 1);
            }
        }

        for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
            const t = this.floatingTexts[i];
            t.y += t.vy;
            t.alpha -= 0.018;
            t.scale = Math.max(1.0, t.scale - 0.01);
            if (t.alpha <= 0) {
                this.floatingTexts.splice(i, 1);
            }
        }
    }

    draw(ctx) {
        this.particles.forEach(p => {
            ctx.save();
            ctx.globalAlpha = Math.max(0, p.alpha);
            ctx.fillStyle = p.color;

            if (p.isStar) {
                ctx.translate(p.x, p.y);
                ctx.beginPath();
                for (let j = 0; j < 4; j++) {
                    ctx.rotate(Math.PI / 2);
                    ctx.lineTo(p.radius, 0);
                    ctx.lineTo(p.radius * 0.35, p.radius * 0.35);
                }
                ctx.closePath();
                ctx.fill();
            } else {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
        });

        this.floatingTexts.forEach(t => {
            ctx.save();
            ctx.globalAlpha = Math.max(0, t.alpha);
            ctx.font = `bold ${Math.round(20 * t.scale)}px "Fredoka", "Nunito", sans-serif`;
            ctx.textAlign = 'center';
            ctx.fillStyle = t.color;
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 4;
            ctx.strokeText(t.text, t.x, t.y);
            ctx.fillText(t.text, t.x, t.y);
            ctx.restore();
        });
    }

    clear() {
        this.particles = [];
        this.floatingTexts = [];
    }
}

/**
 * Controller Input Terpadu (Mouse, Pen, & Multi-Touch)
 */
class InputController {
    constructor(canvas, onDragStart, onDragMove, onDragEnd) {
        this.canvas = canvas;
        this.onDragStart = onDragStart;
        this.onDragMove = onDragMove;
        this.onDragEnd = onDragEnd;
        this.pointerPos = { x: 0, y: 0 };
        this.isDown = false;
        this.activePointerId = null;

        this.attachEvents();
    }

    getCanvasPos(clientX, clientY) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;

        return {
            x: (clientX - rect.left) * scaleX,
            y: (clientY - rect.top) * scaleY
        };
    }

    attachEvents() {
        const handleDown = (e) => {
            if (this.isDown) return;
            e.preventDefault();
            this.isDown = true;
            this.activePointerId = e.pointerId;
            try { this.canvas.setPointerCapture(e.pointerId); } catch (err) {}

            this.pointerPos = this.getCanvasPos(e.clientX, e.clientY);
            if (this.onDragStart) this.onDragStart(this.pointerPos.x, this.pointerPos.y);
        };

        const handleMove = (e) => {
            if (!this.isDown || e.pointerId !== this.activePointerId) return;
            e.preventDefault();
            this.pointerPos = this.getCanvasPos(e.clientX, e.clientY);
            if (this.onDragMove) this.onDragMove(this.pointerPos.x, this.pointerPos.y);
        };

        const handleUp = (e) => {
            if (!this.isDown || e.pointerId !== this.activePointerId) return;
            e.preventDefault();
            this.isDown = false;
            this.activePointerId = null;
            try { this.canvas.releasePointerCapture(e.pointerId); } catch (err) {}

            this.pointerPos = this.getCanvasPos(e.clientX, e.clientY);
            if (this.onDragEnd) this.onDragEnd(this.pointerPos.x, this.pointerPos.y);
        };

        this.canvas.addEventListener('pointerdown', handleDown, { passive: false });
        this.canvas.addEventListener('pointermove', handleMove, { passive: false });
        this.canvas.addEventListener('pointerup', handleUp, { passive: false });
        this.canvas.addEventListener('pointercancel', handleUp, { passive: false });
    }
}
