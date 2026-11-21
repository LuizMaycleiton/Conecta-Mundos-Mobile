/* =====================================================
   config.js - tamanho da fonte + modo claro/escuro
   Coloque no <head> de TODAS as páginas (sem defer):
   assim o tema é aplicado antes da página aparecer.
   O HTML do painel fica escrito em cada página.
   ===================================================== */
(function () {
    var NIVEIS = [90, 100, 115, 130, 150]; // % do tamanho da fonte
    var raiz = document.documentElement;

    /* ----- localStorage com proteção ----- */
    function ler(chave) {
        try {
            return localStorage.getItem(chave);
        } catch (erro) {
            return null;
        }
    }

    function salvar(chave, valor) {
        try {
            localStorage.setItem(chave, valor);
        } catch (erro) {}
    }

    function apagar(chave) {
        try {
            localStorage.removeItem(chave);
        } catch (erro) {}
    }

    // tema com que o site abre na primeira visita
    var TEMA_PADRAO = 'claro';

    /* ----- valores salvos ----- */
    var nivel = parseInt(ler('cm-fonte'), 10);
    if (NIVEIS.indexOf(nivel) === -1) {
        nivel = 100;
    }

    var tema = ler('cm-tema');
    if (tema !== 'claro' && tema !== 'escuro') {
        tema = TEMA_PADRAO;
    }

    function aplicar() {
        raiz.style.fontSize = nivel + '%';
        raiz.setAttribute('data-tema', tema);
    }

    aplicar();

    /* ----- liga os botões do painel ----- */
    document.addEventListener('DOMContentLoaded', function () {
        var painel = document.getElementById('config-painel');
        var abrir = document.getElementById('config-abrir');

        if (!painel || !abrir) {
            return;
        }

        var menos = document.getElementById('fonte-menos');
        var mais = document.getElementById('fonte-mais');
        var valor = document.getElementById('fonte-valor');
        var claro = document.getElementById('tema-claro');
        var escuro = document.getElementById('tema-escuro');
        var restaurar = document.getElementById('config-restaurar');
        var caixa = abrir.parentNode;

        function atualizar() {
            var posicao = NIVEIS.indexOf(nivel);
            valor.textContent = nivel + '%';
            menos.disabled = posicao === 0;
            mais.disabled = posicao === NIVEIS.length - 1;
            claro.setAttribute('aria-pressed', tema === 'claro');
            escuro.setAttribute('aria-pressed', tema === 'escuro');
        }

        function mudarFonte(passo) {
            var nova = NIVEIS.indexOf(nivel) + passo;
            if (nova < 0 || nova >= NIVEIS.length) {
                return;
            }
            nivel = NIVEIS[nova];
            salvar('cm-fonte', nivel);
            aplicar();
            atualizar();
        }

        function mudarTema(novo) {
            tema = novo;
            salvar('cm-tema', tema);
            aplicar();
            atualizar();
        }

        function fechar() {
            painel.hidden = true;
            abrir.setAttribute('aria-expanded', 'false');
        }

        abrir.addEventListener('click', function () {
            painel.hidden = !painel.hidden;
            abrir.setAttribute('aria-expanded', String(!painel.hidden));
        });

        menos.addEventListener('click', function () { mudarFonte(-1); });
        mais.addEventListener('click', function () { mudarFonte(1); });
        claro.addEventListener('click', function () { mudarTema('claro'); });
        escuro.addEventListener('click', function () { mudarTema('escuro'); });

        restaurar.addEventListener('click', function () {
            apagar('cm-fonte');
            apagar('cm-tema');
            nivel = 100;
            tema = TEMA_PADRAO;
            aplicar();
            atualizar();
        });

        // fecha com ESC ou clicando fora
        document.addEventListener('keydown', function (evento) {
            if (evento.key === 'Escape') {
                fechar();
            }
        });

        document.addEventListener('click', function (evento) {
            if (!caixa.contains(evento.target)) {
                fechar();
            }
        });

        atualizar();
    });
})();