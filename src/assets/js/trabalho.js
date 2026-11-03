/*
 * Inclusão no mercado de trabalho (achado 21): formulário para empresas.
 *
 * Cada campo é validado ao sair dele. Sem servidor nesta cópia, o formulário
 * não é enviado: depois de conferido, ele monta um e-mail para a APAE com os
 * dados preenchidos e oferece o link para abri-lo (ver PENDENCIAS.md).
 */
(function () {
  'use strict';

  var form = document.getElementById('form-empresa');
  if (!form) return;
  var resultado = form.querySelector('.trilha__resultado');
  var DESTINO = 'apae@apaelimeira.org.br';

  var REGRAS = {
    'rh-nome': function (v) { return v ? '' : 'Preencha o seu nome.'; },
    'rh-empresa': function (v) { return v ? '' : 'Preencha o nome da empresa.'; },
    'rh-email': function (v) {
      if (!v) return 'Preencha o e-mail.';
      return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v) ? '' : 'Confira o e-mail: falta uma parte. Exemplo: nome@empresa.com.br';
    },
    'rh-telefone': function (v) {
      if (!v) return 'Preencha o telefone.';
      var n = v.replace(/\D/g, '').length;
      return n === 10 || n === 11 ? '' : 'Informe o telefone com DDD, por exemplo (19) 99999-9999.';
    }
  };
  var campos = Array.prototype.slice.call(form.querySelectorAll('[required]'));

  function validar(campo) {
    var msg = REGRAS[campo.id](campo.value.trim());
    var erro = document.getElementById(campo.id + '-erro');
    erro.textContent = msg;
    erro.hidden = !msg;
    if (msg) campo.setAttribute('aria-invalid', 'true'); else campo.removeAttribute('aria-invalid');
    return !msg;
  }

  campos.forEach(function (campo) {
    var mexeu = false;
    campo.addEventListener('input', function () {
      mexeu = true;
      if (campo.getAttribute('aria-invalid') === 'true') validar(campo);
    });
    campo.addEventListener('blur', function () { if (mexeu || campo.value) validar(campo); });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var invalidos = campos.filter(function (c) { return !validar(c); });
    if (invalidos.length) { invalidos[0].focus(); resultado.hidden = true; return; }
    var v = function (id) { return document.getElementById(id).value.trim(); };
    var assunto = 'Contratação com apoio da APAE – ' + v('rh-empresa');
    var corpo = 'Nome: ' + v('rh-nome') + '\nEmpresa: ' + v('rh-empresa') + '\nE-mail: ' + v('rh-email') +
      '\nTelefone: ' + v('rh-telefone') + '\n\nGostaria de conversar sobre a contratação de pessoas com deficiência com o apoio da APAE.';
    var link = 'mailto:' + DESTINO + '?subject=' + encodeURIComponent(assunto) + '&body=' + encodeURIComponent(corpo);
    resultado.hidden = false;
    resultado.innerHTML = '<strong>Dados conferidos.</strong> Este protótipo ainda não envia o formulário. ' +
      '<a href="' + link + '">Abra o e-mail para a APAE com os dados preenchidos</a> ou ligue para ' +
      '<a href="tel:+551934041569">(19) 3404-1569</a>. ' +
      '<span class="a-confirmar">[a confirmar com a entidade: canal do setor de inclusão no trabalho]</span>';
  });
})();
