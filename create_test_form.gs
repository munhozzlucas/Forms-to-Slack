
/**
 * Creates a new Google Form with various question types to test the Forms-to-Slack integration.
 */
function createTestForm() {
  // Create a new form with a title and description.
  var form = FormApp.create('Teste Completo para o Script Forms-to-Slack');
  form.setDescription('Este formulário foi gerado para testar todas as funcionalidades do script de integração com o Slack, incluindo grades.');

  // 1. Text Question
  form.addTextItem()
    .setTitle('Qual é o nome do projeto?');

  // 2. Multiple Choice Question
  form.addMultipleChoiceItem()
    .setTitle('Qual é a prioridade?')
    .setChoiceValues(['Baixa', 'Média', 'Alta', 'Urgente']);

  // 3. Checkbox Question
  form.addCheckboxItem()
    .setTitle('Quais equipes devem ser notificadas?')
    .setChoiceValues(['Engenharia', 'Produto', 'Suporte', 'Marketing']);

  // 4. File Upload Question
  // Note: This might only work for users within a Google Workspace domain.
  try {
    form.addFileUploadItem()
      .setTitle('Anexe o documento de especificação (opcional)')
      .setRequired(false);
  } catch (e) {
    Logger.log('Não foi possível adicionar o item de upload de arquivo. Isso é esperado para contas pessoais do Gmail. Erro: ' + e.message);
    form.addParagraphTextItem()
      .setTitle('Nota sobre Upload de Arquivo')
      .setHelpText('O item de upload de arquivo não pôde ser criado. Isso geralmente acontece em contas pessoais do Gmail e não é um problema no script.');
  }

  // 5. Multiple Choice Grid Question (The one that was causing issues)
  var mcGrid = form.addGridItem();
  mcGrid.setTitle('Avalie a complexidade de cada área (Múltipla Escolha)')
    .setRows(['Interface (UI)', 'Lógica de Negócio (Backend)', 'Banco de Dados'])
    .setColumns(['Simples', 'Moderada', 'Complexa']);

  // 6. Checkbox Grid Question (The other one that was causing issues)
  var cbGrid = form.addCheckboxGridItem();
  cbGrid.setTitle('Selecione as tecnologias aplicáveis por plataforma (Caixa de Seleção)')
    .setRows(['Web', 'Mobile (Android)', 'Mobile (iOS)'])
    .setColumns(['React', 'Node.js', 'Swift', 'Kotlin', 'SQL']);

  // Log the URLs to access the new form.
  Logger.log('Formulário de teste criado com sucesso!');
  Logger.log('Link para preencher: ' + form.getPublishedUrl());
  Logger.log('Link para editar: ' + form.getEditUrl());
}
