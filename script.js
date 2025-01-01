// 获取canvas元素
const canvas = document.getElementById('fireworksCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// 烟花对象
class Firework {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 120; // 爆炸范围的半径
        this.numRays = 50; // 放射线数量
        this.color = 'hsl(' + Math.random() * 360 + ', 100%, 70%)'; // 随机颜色
        this.lifetime = 20000; // 烟花持续时间（20秒）
        this.creationTime = Date.now();
        this.particles = []; // 粒子集合
        this.alpha = 1; // 初始透明度
        this.createParticles(); // 初始化粒子
    }

    // 创建粒子
    createParticles() {
        for (let i = 0; i < this.numRays; i++) {
            const angle = (Math.PI * 2) * (i / this.numRays); // 计算每个粒子的角度
            const speed = Math.random() * 2 + 1; // 粒子速度（调慢）
            this.particles.push(new Particle(this.x, this.y, angle, speed, this.color));
        }
    }

    // 更新烟花状态
    update() {
        const elapsedTime = Date.now() - this.creationTime;
        if (elapsedTime > this.lifetime) {
            this.alpha -= 0.005; // 逐渐消失，速度更慢
        }
        this.particles.forEach(particle => particle.update());
    }

    // 绘制烟花
    draw() {
        this.particles.forEach(particle => particle.draw());
    }

    // 判断是否该移除
    shouldRemove() {
        return this.alpha <= 0; // 透明度小于等于0时移除
    }
}

// 粒子对象
class Particle {
    constructor(x, y, angle, speed, color) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.speed = speed;
        this.color = color;
        this.size = Math.random() * 2 + 1; // 粒子的初始大小
        this.alpha = 1; // 初始透明度
        this.gravity = 0.01; // 模拟轻微重力（调轻）
    }

    // 更新粒子状态
    update() {
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed + this.gravity;
        this.alpha -= 0.002; // 粒子透明度缓慢减少
        this.size *= 0.995; // 粒子逐渐缩小
    }

    // 绘制粒子
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.alpha;
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}

// 存储所有烟花
let fireworks = [];

// 点击事件创建烟花
function createFirework(e) {
    fireworks.push(new Firework(e.x, e.y));
}

// 动画循环
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // 清除画布

    fireworks.forEach((firework, index) => {
        firework.update();
        firework.draw();
        if (firework.shouldRemove()) {
            fireworks.splice(index, 1); // 移除已消失的烟花
        }
    });

    requestAnimationFrame(animate); // 循环动画
}

// 监听点击事件
canvas.addEventListener('click', (e) => {
    createFirework(e); // 点击处创建烟花
});

// 启动动画
animate();
