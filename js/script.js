const canvas = document.getElementById('bgc');
const ctx = canvas.getContext('2d');
const particles = [];
const N = 90;

function resize() { 
    canvas.width = window.innerWidth; 
    canvas.height = Math.max(document.body.scrollHeight, window.innerHeight);
}
resize(); 
window.addEventListener('resize', resize);

for (let i = 0; i < N; i++) { 
    particles.push({ 
        x: Math.random() * window.innerWidth, 
        y: Math.random() * 3000, 
        vx: (Math.random() - .5) * 0.28, 
        vy: (Math.random() - .5) * 0.28, 
        r: Math.random() * 1.4 + .3, 
        alpha: Math.random() * 0.45 + .1, 
        col: Math.random() > .5 ? '0,212,255' : '0,102,255', 
        phase: Math.random() * Math.PI * 2 
    });
}

let t = 0;
function draw() {
    resize(); 
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const g = ctx.createRadialGradient(canvas.width / 2, 0, 0, canvas.width / 2, canvas.height, canvas.height);
    g.addColorStop(0, '#020c1b'); 
    g.addColorStop(1, '#010812');
    ctx.fillStyle = g; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'rgba(0,212,255,0.02)'; 
    ctx.lineWidth = 1;
    const gs = 60;
    
    for (let x = 0; x < canvas.width; x += gs) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke(); }
    for (let y = 0; y < canvas.height; y += gs) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke(); }
    
    particles.forEach(p => {
        const a = p.alpha * (0.5 + 0.5 * Math.sin(t * 0.001 + p.phase));
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fillStyle = `rgba(${p.col}, ${a})`; ctx.fill();
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
    });
    t++; 
    requestAnimationFrame(draw);
}
draw();

// --- SISTEMA DE NAVEGACIÓN DE PÁGINAS DEL LIBRO ---
function turnPage(currentPageId, nextPageId) {
    const current = document.getElementById(`page-${currentPageId}`);
    const next = document.getElementById(`page-${nextPageId}`);
    const bgAudio = document.getElementById('bgAudio');

    // Activar audio en el primer cambio de página
    if (currentPageId === 1 && nextPageId === 2) {
        if(bgAudio && bgAudio.paused) {
            bgAudio.volume = 0.4;
            bgAudio.play().catch(e => console.log("Audio bloqueado temporalmente:", e));
        }
    }

    if (current && next) {
        current.classList.remove('active-page');
        current.classList.add('flip-out');

        setTimeout(() => {
            current.style.display = 'none';
            current.classList.remove('flip-out');
            
            next.style.display = 'flex';
            setTimeout(() => {
                next.style.display = ''; 
                next.classList.add('active-page');
                window.scrollTo({ top: 0, behavior: 'smooth' }); // Centra la vista arriba en cada hoja
            }, 20);
        }, 500);
    }
}

// --- MODAL DE REGISTRO ---
function openModal() { document.getElementById('regModal').classList.add('active'); }
// Se asegura de que se pueda cerrar correctamente
function closeModal() { document.getElementById('regModal').classList.remove('active'); }

function submitForm(e) {
    e.preventDefault();
    const nombre = document.getElementById('nombre').value;
    const codigo = document.getElementById('codigo').value;
    const semestre = document.getElementById('semestre').value;
    const scriptURL = 'https://script.google.com/macros/s/AKfycbzGmay5RKHzyWx1Q7Zj1CtSy8BKySLoBuZ5Fo8PFGQprWRNFot9wmVQa1EtF6aM1YXi/exec';

    const btnSubmit = document.querySelector('#regForm button[type="submit"]');
    const textoOriginal = btnSubmit.innerHTML;
    btnSubmit.innerHTML = 'GUARDANDO...';
    btnSubmit.disabled = true;

    fetch(scriptURL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ nombre, codigo, semestre })
    })
    .then(response => response.json())
    .then(data => {
        alert(`¡Asistencia guardada con éxito!\nNombre: ${nombre}\nCódigo: ${codigo}\nSemestre: ${semestre}`);
        document.getElementById('regForm').reset();
        closeModal();
    })
    .catch(error => {
        console.error('Error!', error.message);
        alert('Hubo un error al guardar la asistencia. Intenta nuevamente.');
    })
    .finally(() => {
        btnSubmit.innerHTML = textoOriginal;
        btnSubmit.disabled = false;
    });
}
// --- SISTEMA DE NAVEGACIÓN Y AUDIO ---
const bgAudio = document.getElementById('bgAudio');
const btnMusica = document.getElementById('btnMusica');

// INTENTO DE AUTOPLAY AL CARGAR LA PÁGINA
window.addEventListener('DOMContentLoaded', () => {
    if (btnMusica) btnMusica.style.display = 'flex'; // Mostrar botón desde el inicio
    
    if (bgAudio) {
        bgAudio.volume = 0.4;
        let playPromise = bgAudio.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                // ¡Éxito! El navegador permitió el autoplay
                btnMusica.innerHTML = '🔊';
                btnMusica.classList.remove('apagado');
            }).catch(e => {
                // El navegador bloqueó el autoplay (comportamiento normal)
                btnMusica.innerHTML = '🔇';
                btnMusica.classList.add('apagado');
                console.log("Autoplay bloqueado por el navegador. El usuario debe hacer clic.");
            });
        }
    }
});

function toggleMusica() {
    if (bgAudio.paused) {
        bgAudio.play();
        btnMusica.innerHTML = '🔊';
        btnMusica.classList.remove('apagado');
    } else {
        bgAudio.pause();
        btnMusica.innerHTML = '🔇';
        btnMusica.classList.add('apagado');
    }
}

function turnPage(currentPageId, nextPageId) {
    const current = document.getElementById(`page-${currentPageId}`);
    const next = document.getElementById(`page-${nextPageId}`);

    // Si pasamos de la portada a la hoja 2 y la música sigue pausada, intentamos reproducirla con este clic
    if (currentPageId === 1 && nextPageId === 2) {
        if(bgAudio && bgAudio.paused) {
            bgAudio.volume = 0.4;
            bgAudio.play().then(() => {
                btnMusica.innerHTML = '🔊';
                btnMusica.classList.remove('apagado');
            }).catch(e => console.log("Audio bloqueado:", e));
        }
    }

    if (current && next) {
        current.classList.remove('active-page');
        current.classList.add('flip-out');

        setTimeout(() => {
            current.style.display = 'none';
            current.classList.remove('flip-out');
            
            next.style.display = 'flex';
            setTimeout(() => {
                next.style.display = ''; 
                next.classList.add('active-page');
                window.scrollTo({ top: 0, behavior: 'smooth' }); // Centra la vista
            }, 20);
        }, 500);
    }
}

// --- MODAL DE REGISTRO ---
function openModal() { document.getElementById('regModal').classList.add('active'); }
function closeModal() { document.getElementById('regModal').classList.remove('active'); }

function submitForm(e) {
    e.preventDefault();
    const nombre = document.getElementById('nombre').value;
    const codigo = document.getElementById('codigo').value;
    const semestre = document.getElementById('semestre').value;
    const scriptURL = 'https://script.google.com/macros/s/AKfycbzGmay5RKHzyWx1Q7Zj1CtSy8BKySLoBuZ5Fo8PFGQprWRNFot9wmVQa1EtF6aM1YXi/exec';

    const btnSubmit = document.querySelector('#regForm button[type="submit"]');
    const textoOriginal = btnSubmit.innerHTML;
    btnSubmit.innerHTML = 'GUARDANDO...';
    btnSubmit.disabled = true;

    fetch(scriptURL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ nombre, codigo, semestre })
    })
    .then(response => response.json())
    .then(data => {
        alert(`¡Asistencia guardada con éxito!\nNombre: ${nombre}\nCódigo: ${codigo}\nSemestre: ${semestre}`);
        document.getElementById('regForm').reset();
        closeModal();
    })
    .catch(error => {
        console.error('Error!', error.message);
        alert('Hubo un error al guardar la asistencia. Intenta nuevamente.');
    })
    .finally(() => {
        btnSubmit.innerHTML = textoOriginal;
        btnSubmit.disabled = false;
    });
}