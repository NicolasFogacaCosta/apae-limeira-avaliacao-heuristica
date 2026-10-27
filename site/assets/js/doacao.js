/*
 * Página Doações (achado 05): copiar a chave Pix e doar com cartão.
 *
 * A chave Pix e a plataforma de pagamento ainda dependem da entidade
 * (ver PENDENCIAS.md). Enquanto data-chave estiver vazio, o botão de copiar
 * avisa que a chave será confirmada; o botão de doar com cartão confere o
 * valor e informa que o pagamento ainda não está disponível, sem simular
 * uma doação concluída.
 */
(function () {
  'use strict';

  /* Copiar a chave Pix ----------------------------------------------------- */
  var copiar = document.querySelector('[data-copiar-chave]');
  var status = document.querySelector('[data-copiar-status]');
  if (copiar) {
    var chave = copiar.getAttribute('data-chave');
    if (!chave) copiar.setAttribute('aria-disabled', 'true');
    copiar.addEventListener('click', function () {
      if (!chave) {
        status.textContent = 'A chave Pix ainda será confirmada pela APAE. Enquanto isso, fale com a equipe pelo WhatsApp, no bloco "Falar com a equipe".';
        return;
      }
      navigator.clipboard.writeText(chave).then(function () {
        status.textContent = 'Chave Pix copiada. Agora cole no aplicativo do seu banco.';
      }, function () {
        status.textContent = 'Não foi possível copiar. Selecione a chave acima e copie manualmente.';
      });
    });
  }

  /* Doar com cartão ------------------------------------------------------ */
  var form = document.getElementById('doacao-cartao');
  if (!form) return;
  var campoOutro = form.querySelector('.doacao__outro');
  var inputOutro = document.getElementById('doacao-outro');
  var erroOutro = document.getElementById('doacao-outro-erro');
  var rotulo = form.querySelector('[data-doar-rotulo]');
  var resultado = form.querySelector('.doacao__resultado');

  function valorOutro() {
    var v = inputOutro.value.trim().replace(/\s|R\$/g, '').replace(/\./g, '').replace(',', '.');
    return /^\d+(\.\d{1,2})?$/.test(v) ? parseFloat(v) : NaN;
  }

  function validarOutro() {
    var v = valorOutro();
    var msg = '';
    if (!inputOutro.value.trim()) msg = 'Informe o valor que você quer doar.';
    else if (isNaN(v) || v <= 0) msg = 'Informe um valor em reais, por exemplo 25 ou 25,50.';
    erroOutro.textContent = msg;
    erroOutro.hidden = !msg;
    if (msg) inputOutro.setAttribute('aria-invalid', 'true'); else inputOutro.removeAttribute('aria-invalid');
    return !msg;
  }

  function formatar(v) {
    return 'R$ ' + (v % 1 ? v.toFixed(2).replace('.', ',') : String(v));
  }

  function atualizar() {
    var escolhido = form.valor.value;
    var outro = escolhido === 'outro';
    campoOutro.hidden = !outro;
    inputOutro.required = outro;
    var v = outro ? valorOutro() : parseFloat(escolhido);
    var texto = outro && (isNaN(v) || v <= 0) ? 'Doar' : 'Doar ' + formatar(v);
    rotulo.textContent = texto + (form.mensal.checked ? ' por mês' : '');
    resultado.hidden = true;
  }

  form.addEventListener('change', function (e) {
    atualizar();
    if (e.target.value === 'outro') inputOutro.focus();
  });
  inputOutro.addEventListener('input', function () {
    atualizar();
    if (inputOutro.getAttribute('aria-invalid') === 'true') validarOutro();
  });
  inputOutro.addEventListener('blur', function () { if (inputOutro.value) validarOutro(); });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (form.valor.value === 'outro' && !validarOutro()) { inputOutro.focus(); return; }
    resultado.hidden = false;
    resultado.innerHTML = '<strong>Pagamento com cartão ainda não disponível.</strong> Ele depende da plataforma de pagamento que a APAE vai adotar. Enquanto isso, fale com a equipe pelo WhatsApp. <span class="a-confirmar">[a confirmar com a entidade: plataforma de pagamento]</span>';
  });

  atualizar();
})();
