// Menu principal. Achado 04: cada item com submenu abre a sua página de
// seção e "Home" leva à página inicial; nenhum item usa href="#".
export default [
  { titulo: 'Home', url: '' },
  { titulo: 'Quem Somos', url: 'quem-somos/', itens: [
    { titulo: 'A Entidade', url: 'estrutura/' },
    { titulo: 'A Diretoria', url: 'diretoria/' },
    { titulo: 'Conselhos', url: 'conselho/' },
    { titulo: 'Política de Qualidade', url: 'politica-de-qualidade/' },
    { titulo: 'Parceiros', url: 'parceiros/' },
    { titulo: 'Revista APAE Limeira 50 anos', url: 'revista-apae-limeira-50-anos/' }
  ] },
  { titulo: 'Programas', url: 'programas/', itens: [
    { titulo: 'Centro de Ações Preventivas', url: 'cap/' },
    { titulo: 'Centro de Apoio Diagnóstico', url: 'cad/' },
    { titulo: 'Centro de Atenção Terapêutica', url: 'cat/' },
    { titulo: 'Escola de Educação Especial “João Ometto”', url: 'escola-de-educacao-especial-joao-ometto/' },
    { titulo: 'Centro Profissionalizante e de Convivência', url: 'cpc/' },
    { titulo: 'Inclusão no mercado de trabalho', url: 'inclusao-no-trabalho/' }
  ] },
  { titulo: 'Projetos', url: 'projetos/', itens: [
    { titulo: 'EquoterAPAE', url: 'equoterapia/' },
    { titulo: 'APAE Esporte', url: 'apae-esporte/' },
    { titulo: 'APAE Cultural', url: 'apae-cultural/' },
    { titulo: 'Conexão Teen', url: 'conexao-teen/' }
  ] },
  { titulo: 'Serviços', url: 'servicos/', itens: [
    { titulo: 'Teste do Pezinho', url: 'teste-do-pezinho/' },
    { titulo: 'Bazar e Estacionamento', url: 'bazar-e-estacionamento/' },
    { titulo: 'Organização de Eventos', url: 'organizacao-de-eventos/' },
    { titulo: 'Fábrica de Paletes', url: 'fabrica-de-paletes/' }
  ] },
  { titulo: 'Eventos', url: 'eventos/', itens: [
    { titulo: 'Da Prevenção à Inclusão: vencendo desafios', url: 'da-prevencao-a-inclusao/' },
    { titulo: 'APAE Motor Rock', url: 'apae-motor-rock/' },
    { titulo: 'APAE Running', url: 'apae-running-limeira/' },
    { titulo: 'APAE Beach Tennis', url: 'apae-beach-tennis/' },
    { titulo: 'Selo Empresa Cidadã', url: 'selo-empresa-cidada-2026/' }
  ] },
  { titulo: 'Transparência', url: 'transparencia/' },
  { titulo: 'Contato/Ouvidoria', url: 'contato/' }
];
