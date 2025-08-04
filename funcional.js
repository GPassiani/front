// Bloco I: Animação de Carregamento em Canvas
(() => {
    const canvas = document.getElementById('circuit-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const pins = []; let lines = [];
    class CircuitLine { constructor(x, y, d) { this.startX = x; this.startY = y; this.direction = d; this.reset(); } reset() { const [l1, l2, l3] = [50+Math.random()*50, 80+Math.random()*60, 100+Math.random()*80]; const dH = Math.random() > 0.5 ? 1 : -1; const dV = Math.random() > 0.5 ? 1 : -1; let s; switch (this.direction) { case 'up': s = [{dx:0,dy:-1,length:l1},{dx:dH,dy:0,length:l2},{dx:0,dy:-1,length:l3}]; break; case 'down': s = [{dx:0,dy:1,length:l1},{dx:dH,dy:0,length:l2},{dx:0,dy:1,length:l3}]; break; case 'left': s = [{dx:-1,dy:0,length:l1},{dx:0,dy:dV,length:l2},{dx:-1,dy:0,length:l3}]; break; default: s = [{dx:1,dy:0,length:l1},{dx:0,dy:dV,length:l2},{dx:1,dy:0,length:l3}]; break; } this.segments = s; this.progress = 0; this.speed = 1.5 + Math.random()*2; this.length = s.reduce((sum, seg) => sum + seg.length, 0); } update() { this.progress += this.speed; if (this.progress > this.length) this.reset(); } draw(ctx) { ctx.save(); ctx.lineCap = 'round'; ctx.strokeStyle = '#f00'; ctx.lineWidth = 2; ctx.shadowColor = '#f00'; ctx.shadowBlur = 8; ctx.beginPath(); let x = this.startX, y = this.startY, dist = this.progress; ctx.moveTo(x, y); for (const seg of this.segments) { const mD = Math.min(dist, seg.length); x += seg.dx*mD; y += seg.dy*mD; ctx.lineTo(x, y); dist -= mD; if (dist <= 0) break; } ctx.stroke(); ctx.fillStyle = '#f00'; ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2); ctx.fill(); ctx.restore(); } }
    const logo = new Image(); logo.src = 'https://dwglogo.com/wp-content/uploads/2017/05/mcafee-logo-001.svg';
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; pins.length = 0; const pC = Math.max(3, Math.floor(window.innerWidth / 300)); const m = 50; for (let i=0; i<pC; i++) { const x = m + i * ((canvas.width - 2 * m) / (pC-1)); pins.push({x, y:m, direction:'down'}); pins.push({x, y:canvas.height-m, direction:'up'}); } for (let i=0; i<pC; i++) { const y = m + i * ((canvas.height-2*m)/(pC-1)); pins.push({x:m, y, direction:'right'}); pins.push({x:canvas.width-m, y, direction:'left'}); } lines = pins.flatMap(p => [new CircuitLine(p.x, p.y, p.direction), new CircuitLine(p.x, p.y, p.direction)]); };
    let animId; const animDur = 3000, startT = performance.now();
    const animate = () => { if (performance.now() - startT < animDur) { ctx.clearRect(0, 0, canvas.width, canvas.height); lines.forEach(l => { l.draw(ctx); l.update(); }); if (logo.complete && logo.naturalWidth > 0) { const cX = canvas.width/2, cY = canvas.height/2; const lW = Math.min(250, canvas.width*0.4); const lH = lW * (logo.naturalHeight/logo.naturalWidth); ctx.drawImage(logo, cX-lW/2, cY-lH/2, lW, lH); } animId = requestAnimationFrame(animate); } else { cancelAnimationFrame(animId); canvas.style.opacity='0'; setTimeout(()=>canvas.classList.add('hidden'), 500); const main = document.getElementById('main-content'); if (main) { main.classList.remove('hidden'); setTimeout(()=>main.classList.add('visible'), 50); } document.body.style.overflow='auto'; } };
    window.addEventListener('resize', resize); resize(); animate();
})();

// Bloco II: Lógica principal do site
document.addEventListener('DOMContentLoaded', () => {
    // --- Seletores de Elementos ---
    const servicosBtn = document.getElementById('btn-produtos'); 
    const dropdownContent = document.querySelector('.dropdown-content');
    const navButtons = document.querySelectorAll('nav > button[data-target]');
    const mainContent = document.getElementById('main-content');

    // --- Funções Auxiliares ---
    const hideAllTabs = () => {
        mainContent.querySelectorAll('.aba, .aba-produto').forEach(tab => tab.classList.remove('ativa'));
        document.querySelectorAll('nav button').forEach(btn => btn.classList.remove('active'));
    };

    const activateTab = (button, targetId) => {
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            hideAllTabs();
            targetSection.classList.add('ativa');
            button.classList.add('active');
        }
    };
    
    // --- Lógica de Eventos ---
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            activateTab(button, button.dataset.target);
            dropdownContent?.classList.add('hidden');
        });
    });

    if (servicosBtn && dropdownContent) {
        servicosBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            dropdownContent.classList.toggle('hidden');
        });
        dropdownContent.querySelectorAll('.subproduto').forEach(subButton => {
            subButton.addEventListener('click', () => {
                const produtoId = subButton.dataset.produto;
                const produtoAba = document.getElementById(produtoId);
                
                hideAllTabs();
                
                document.getElementById('servicos')?.classList.add('ativa');
                servicosBtn.classList.add('active');
                
                if (produtoAba) {
                    produtoAba.classList.add('ativa');
                }
                
                dropdownContent.classList.add('hidden');
            });
        });
        document.addEventListener('click', (event) => {
            if (!servicosBtn.contains(event.target) && !dropdownContent.contains(event.target)) {
                dropdownContent.classList.add('hidden');
            }
        });
    }

    document.querySelectorAll('.plan-card button').forEach(button => {
        button.addEventListener('click', () => {
            const details = button.nextElementSibling;
            if (details?.classList.contains('details')) {
                const isOpen = details.classList.toggle('open');
                button.textContent = isOpen ? "Ocultar" : "Saber mais";
            }
        });
    });

    // --- LÓGICA DOS SIMULADORES ---
    const simuladoresConfig = {
        antivirus: { el: "🦠", steps: [{ t: "🚨 Ameaça detectada!", d: "Atividade suspeita identificada." },{ t: "🔍 Escaneando...", d: "Analisando arquivos e processos." },{ t: "🛡️ Bloqueando...", d: "Interrompendo a ação maliciosa." },{ t: "✅ Sistema protegido!", d: "A ameaça foi neutralizada." }] },
        vpn: { el: "👁️", steps: [{ t: "🔗 Conectando...", d: "Estabelecendo um canal seguro." },{ t: "🔒 Criptografando...", d: "Seu tráfego está sendo codificado." },{ t: "🎭 Mascarando IP...", d: "Sua localização real está oculta." },{ t: "✅ Conexão segura!", d: "Você está navegando com privacidade." }] },
        segurancaMovel: { el: "📲", steps: [{ t: "📱 App suspeito!", d: "Permissões abusivas detectadas." },{ t: "🔍 Verificando...", d: "Analisando o comportamento do app." },{ t: "🚫 Ameaça bloqueada!", d: "O app malicioso foi impedido de rodar." },{ t: "✅ Celular seguro!", d: "Seu dispositivo está protegido." }] },
        protecaoWeb: { el: "🎣", steps: [{ t: "🔗 Link suspeito!", d: "Analisando URL de phishing." },{ t: "📈 Verificando reputação...", d: "Consultando banco de dados de ameaças." },{ t: "🛑 Site bloqueado!", d: "Acesso à página maliciosa foi impedido." },{ t: "✅ Navegação segura!", d: "Você foi protegido contra fraude." }] },
        otimizadorPc: { el: "🚀", steps: [{ t: "🔍 Analisando sistema...", d: "Procurando arquivos inúteis e lentidão." },{ t: "🧹 Limpando arquivos...", d: "Removendo cache e arquivos temporários." },{ t: "⚙️ Otimizando registro...", d: "Corrigindo entradas inválidas do sistema." },{ t: "✅ PC otimizado!", d: "Seu computador está mais rápido." }] },
        remocaoVirus: { el: "💀", steps: [{ t: "🚨 Ameaça persistente!", d: "Rootkit detectado no sistema." },{ t: "🔄 Reiniciando em modo seguro...", d: "Acessando o sistema em modo de diagnóstico." },{ t: "🧹 Removendo arquivos...", d: "Excluindo o malware da raiz do sistema." },{ t: "✅ Sistema limpo!", d: "A ameaça foi completamente removida." }] },
        controleParental: { el: "🔞", steps: [{ t: "🚫 Tentativa de acesso!", d: "Criança tentou acessar conteúdo impróprio." },{ t: "📖 Verificando regras...", d: "Consultando as regras de filtro de conteúdo." },{ t: "🔒 Acesso bloqueado!", d: "O site foi bloqueado conforme as regras." },{ t: "👨‍👩‍👧‍👦 Criança protegida!", d: "O ambiente digital continua seguro." }] },
        segurancaEmpresarial: { el: "🚨", steps: [{ t: "⚠️ Alerta de segurança!", d: "Atividade suspeita em um notebook da rede." },{ t: "🔗 Isolando dispositivo...", d: "Isolando o dispositivo da rede para conter a ameaça." },{ t: "🔎 Investigando...", d: "Analisando o incidente via painel EDR." },{ t: "✅ Ameaça contida!", d: "O incidente foi isolado e resolvido." }] }
    };

    document.querySelectorAll('.botao-simular').forEach(button => {
        button.addEventListener('click', () => {
            const config = simuladoresConfig[button.dataset.simulador];
            if (!config) return;

            const container = button.closest('.simulador');
            const msgEl = container.querySelector('.simulador-mensagem');
            const iconEl = container.querySelector('.simulador-icone');
            const animEl = container.querySelector('.simulador-elemento-animado');
            const descEl = container.querySelector('.simulador-descricao');

            button.disabled = true;
            animEl.textContent = config.el;
            animEl.classList.remove('hidden');
            let step = 0;

            const runStep = () => {
                if (step >= config.steps.length) {
                    button.disabled = false;
                    msgEl.textContent = "Simulação concluída.";
                    descEl.textContent = "Clique para simular novamente.";
                    return;
                }
                const etapa = config.steps[step];
                msgEl.textContent = etapa.t;
                descEl.textContent = etapa.d;
                const emoji = etapa.t.match(/(\p{Emoji})/u);
                if (emoji) iconEl.textContent = emoji[0];
                iconEl.classList.remove('hidden');
                if (step >= 2) animEl.classList.add('hidden');
                step++;
                setTimeout(runStep, 2500);
            };
            runStep();
        });
    });
});