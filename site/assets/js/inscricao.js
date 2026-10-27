/*
 * Inscrição em etapas da 2ª Meia-Maratona da Inclusão de Limeira (achado 02).
 *
 * Dados pessoais → categoria → pagamento, com indicador de etapa.
 * Cada campo é validado ao sair dele (blur), com a mensagem logo abaixo,
 * e o que foi digitado nunca é apagado. O envio e o pagamento dependem
 * de plataforma ainda não definida pela entidade (ver PENDENCIAS.md):
 * o formulário informa isso em vez de simular a confirmação.
 */
(function () {
  'use strict';

  var form = document.getElementById('inscricao');
  if (!form) return;

  var etapas = form.querySelectorAll('[data-etapa]');
  var indicadores = form.querySelectorAll('[data-etapa-indicador]');
  var atual = 1;

  /* Validações ------------------------------------------------------------ */
  function digitos(v) { return v.replace(/\D/g, ''); }

  function cpfValido(v) {
    var c = digitos(v);
    if (c.length !== 11 || /^(\d)\1{10}$/.test(c)) return false;
    for (var t = 9; t < 11; t++) {
      var soma = 0;
      for (var i = 0; i < t; i++) soma += parseInt(c.charAt(i), 10) * (t + 1 - i);
      var dv = (soma * 10) % 11 % 10;
      if (dv !== parseInt(c.charAt(t), 10)) return false;
    }
    return true;
  }

  function dataValida(v) {
    var m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(v);
    if (!m) return 'Informe a data no formato dia/mês/ano, por exemplo 25/03/1990.';
    var d = parseInt(m[1], 10), mes = parseInt(m[2], 10) - 1, a = parseInt(m[3], 10);
    var data = new Date(a, mes, d);
    if (data.getFullYear() !== a || data.getMonth() !== mes || data.getDate() !== d) {
      return 'Essa data não existe. Confira o dia e o mês.';
    }
    if (a < 1900 || data > new Date()) return 'Confira o ano de nascimento.';
    return '';
  }

  var REGRAS = {
    nome: function (v) {
      if (!v) return 'Preencha o seu nome completo.';
      if (v.split(/\s+/).filter(function (p) { return p.length > 1; }).length < 2) return 'Informe o nome e o sobrenome.';
      return '';
    },
    data: function (v) { return v ? dataValida(v) : 'Preencha a data de nascimento.'; },
    cpf: function (v) {
      if (!v) return 'Preencha o CPF.';
      if (digitos(v).length !== 11) return 'O CPF tem 11 números. Confira o que foi digitado.';
      return cpfValido(v) ? '' : 'Esse CPF não é válido. Confira os números.';
    },
    email: function (v) {
      if (!v) return 'Preencha o e-mail.';
      return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v) ? '' : 'Informe um e-mail válido, por exemplo nome@exemplo.com.br.';
    },
    telefone: function (v) {
      if (!v) return 'Preencha o telefone.';
      var n = digitos(v).length;
      return n === 10 || n === 11 ? '' : 'Informe o telefone com DDD, por exemplo (19) 99999-9999.';
    }
  };

  function mostrarErro(campo, erroEl, msg) {
    erroEl.textContent = msg;
    erroEl.hidden = !msg;
    if (campo) {
      if (msg) campo.setAttribute('aria-invalid', 'true'); else campo.removeAttribute('aria-invalid');
    }
    return !msg;
  }

  function validarCampo(campo) {
    var msg = REGRAS[campo.getAttribute('data-validar')](campo.value.trim());
    return mostrarErro(campo, document.getElementById(campo.id + '-erro'), msg);
  }

  function validarGrupo(fieldset) {
    var nome = fieldset.getAttribute('data-validar-grupo');
    var marcado = fieldset.querySelector('input:checked');
    var msg = marcado ? '' : (nome === 'categoria' ? 'Escolha uma categoria para continuar.' : 'Escolha a forma de pagamento.');
    var ok = mostrarErro(null, fieldset.querySelector('.campo__erro'), msg);
    fieldset.classList.toggle('opcoes--erro', !ok);
    return ok;
  }

  form.querySelectorAll('[data-validar]').forEach(function (campo) {
    var mexeu = false;
    campo.addEventListener('input', function () {
      mexeu = true;
      if (campo.getAttribute('data-validar') === 'data') {
        // Barras inseridas enquanto digita: 25031990 -> 25/03/1990
        var d = digitos(campo.value).slice(0, 8);
        var formatado = d.length > 4 ? d.slice(0, 2) + '/' + d.slice(2, 4) + '/' + d.slice(4)
          : d.length > 2 ? d.slice(0, 2) + '/' + d.slice(2) : d;
        if (formatado !== campo.value) campo.value = formatado;
      }
      // Se já existe um erro, ele some assim que o valor fica correto.
      if (campo.getAttribute('aria-invalid') === 'true') validarCampo(campo);
    });
    campo.addEventListener('blur', function () {
      if (mexeu || campo.value) validarCampo(campo);
    });
  });

  form.querySelectorAll('[data-validar-grupo]').forEach(function (fs) {
    fs.addEventListener('change', function () { validarGrupo(fs); });
  });

  function validarEtapa(n) {
    var secao = form.querySelector('[data-etapa="' + n + '"]');
    var primeiroInvalido = null;
    secao.querySelectorAll('[data-validar]').forEach(function (campo) {
      if (!validarCampo(campo) && !primeiroInvalido) primeiroInvalido = campo;
    });
    secao.querySelectorAll('[data-validar-grupo]').forEach(function (fs) {
      if (!validarGrupo(fs) && !primeiroInvalido) primeiroInvalido = fs.querySelector('input');
    });
    if (primeiroInvalido) primeiroInvalido.focus();
    return !primeiroInvalido;
  }

  /* Etapas ------------------------------------------------------------------ */
  function mostrar(n, focar) {
    atual = n;
    etapas.forEach(function (s) { s.hidden = parseInt(s.getAttribute('data-etapa'), 10) !== n; });
    indicadores.forEach(function (li) {
      var i = parseInt(li.getAttribute('data-etapa-indicador'), 10);
      li.classList.toggle('etapas__item--atual', i === n);
      li.classList.toggle('etapas__item--feita', i < n);
      if (i === n) li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current');
      li.querySelector('.etapas__numero').textContent = i < n ? '✓' : String(i);
    });
    if (n === 3) {
      form.querySelector('[data-resumo="nome"]').textContent = form.nome.value.trim();
      var cat = form.querySelector('input[name="categoria"]:checked');
      form.querySelector('[data-resumo="categoria"]').textContent = cat ? cat.value : '';
    }
    if (focar) form.querySelector('[data-etapa="' + n + '"] .inscricao__titulo-etapa').focus();
  }

  form.addEventListener('click', function (e) {
    var botao = e.target.closest('[data-ir]');
    if (!botao) return;
    var destino = parseInt(botao.getAttribute('data-ir'), 10);
    if (destino > atual && !validarEtapa(atual)) return;
    mostrar(destino, true);
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validarEtapa(3)) return;
    var resultado = form.querySelector('.inscricao__resultado');
    resultado.hidden = false;
    resultado.innerHTML = '<strong>Inscrição ainda não enviada.</strong> Seus dados foram conferidos, mas este protótipo ainda não está ligado à plataforma de inscrição e pagamento. <span class="a-confirmar">[a confirmar com a entidade: plataforma de inscrição e pagamento]</span>';
  });

  mostrar(1, false);
})();
