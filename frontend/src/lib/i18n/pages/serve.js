import { addMessages } from '../translate.js';

/**
 * Support screens: tasks, tickets, solutions, documents, help.
 * English is the key. Spanish is neutral Latin American `tú`. Portuguese is Brazilian `você`.
 *
 * @type {Record<string, { es: string, pt: string }>}
 */
export const messages = {
  ' Also, ': { es: ' Además, ', pt: ' Além disso, ' },
  ' and ': { es: ' y ', pt: ' e ' },
  ' or ': { es: ' o ', pt: ' ou ' },
  ' There may be more further down than are listed here, and those close too.': {
    es: ' Puede haber otros más abajo que no aparecen aquí, y esos también se cierran.',
    pt: ' Pode haver mais abaixo dos que estão listados aqui, e esses também são fechados.'
  },
  ', which cannot be changed after the ticket is raised.': {
    es: ', que no se puede cambiar después de abrir el ticket.',
    pt: ', que não pode ser alterado depois que o chamado é aberto.'
  },
  '"{name}" will be marked Duplicate and its comments, attachments, and emails will move into "{into}". You can undo this from the target ticket.':
    {
      es: '"{name}" se marcará como Duplicado y sus comentarios, adjuntos y correos pasarán a "{into}". Puedes deshacerlo desde el ticket de destino.',
      pt: '"{name}" será marcado como Duplicado e os comentários, anexos e e-mails vão para "{into}". Você pode desfazer isso no chamado de destino.'
    },
  '"{name}" will be restored and its comments, attachments, and emails moved back out of this ticket.':
    {
      es: '"{name}" se restaurará y sus comentarios, adjuntos y correos volverán a salir de este ticket.',
      pt: '"{name}" será restaurado e os comentários, anexos e e-mails sairão de volta deste chamado.'
    },
  '"{name}" will sit under "{parent}", instead of its current parent. A tree is at most three levels deep.':
    {
      es: '"{name}" quedará bajo "{parent}", en lugar de su padre actual. Un árbol tiene como máximo tres niveles.',
      pt: '"{name}" ficará sob "{parent}", em vez do pai atual. Uma árvore tem no máximo três níveis.'
    },
  '"{name}" will sit under "{parent}". A tree is at most three levels deep.': {
    es: '"{name}" quedará bajo "{parent}". Un árbol tiene como máximo tres niveles.',
    pt: '"{name}" ficará sob "{parent}". Uma árvore tem no máximo três níveis.'
  },
  '(unnamed lead)': { es: '(prospecto sin nombre)', pt: '(lead sem nome)' },
  '{age} ago': { es: 'hace {age}', pt: 'há {age}' },
  '{age} old': { es: '{age} de antigüedad', pt: '{age} de idade' },
  '{count} linked ticket is still open and will be closed with it.': {
    es: '{count} ticket vinculado sigue abierto y se cerrará con este.',
    pt: '{count} chamado vinculado ainda está aberto e será fechado junto com este.'
  },
  '{count} linked ticket under this one. The tree could not be loaded.': {
    es: '{count} ticket vinculado bajo este. No se pudo cargar el árbol.',
    pt: '{count} chamado vinculado abaixo deste. Não foi possível carregar a árvore.'
  },
  '{count} linked tickets are still open and will be closed with it.': {
    es: '{count} tickets vinculados siguen abiertos y se cerrarán con este.',
    pt: '{count} chamados vinculados ainda estão abertos e serão fechados junto com este.'
  },
  '{count} linked tickets under this one. The tree could not be loaded.': {
    es: '{count} tickets vinculados bajo este. No se pudo cargar el árbol.',
    pt: '{count} chamados vinculados abaixo deste. Não foi possível carregar a árvore.'
  },
  '{count} people on this ticket': {
    es: '{count} personas en este ticket',
    pt: '{count} pessoas neste chamado'
  },
  '{date}, {opened} opened, {closed} closed': {
    es: '{date}, {opened} abiertos, {closed} cerrados',
    pt: '{date}, {opened} abertos, {closed} fechados'
  },
  '{n} day late': { es: '{n} día de retraso', pt: '{n} dia de atraso' },
  '{n} days late': { es: '{n} días de retraso', pt: '{n} dias de atraso' },
  '{n} deleted': { es: '{n} eliminados', pt: '{n} excluídos' },
  '{n} invalid': { es: '{n} no válidos', pt: '{n} inválidos' },
  '{n} merged (unmerge first)': {
    es: '{n} fusionados (deshaz la fusión primero)',
    pt: '{n} mesclados (desfaça a mesclagem primeiro)'
  },
  '{n} need approval': { es: '{n} necesitan aprobación', pt: '{n} precisam de aprovação' },
  '{n} other ticket uses this article and is not yours to open.': {
    es: '{n} ticket más usa este artículo y no puedes abrirlo.',
    pt: '{n} outro chamado usa este artigo e você não pode abri-lo.'
  },
  '{n} other tickets use this article and are not yours to open.': {
    es: '{n} tickets más usan este artículo y no puedes abrirlos.',
    pt: '{n} outros chamados usam este artigo e você não pode abri-los.'
  },
  '{n} out of 5': { es: '{n} de 5', pt: '{n} de 5' },
  '{n} over the limit of {limit}': {
    es: '{n} por encima del límite de {limit}',
    pt: '{n} acima do limite de {limit}'
  },
  '{n} questions in this window': {
    es: '{n} preguntas en esta ventana',
    pt: '{n} perguntas nesta janela'
  },
  '{n} skipped (no access)': { es: '{n} omitidos (sin acceso)', pt: '{n} ignorados (sem acesso)' },
  '{n} updated': { es: '{n} actualizados', pt: '{n} atualizados' },
  '{n} waiting': { es: '{n} en espera', pt: '{n} aguardando' },
  '{names} and {n} more': { es: '{names} y {n} más', pt: '{names} e mais {n}' },
  '{state} · {age} ago': { es: '{state} · hace {age}', pt: '{state} · há {age}' },
  '{state} by {name} · {age} ago': {
    es: '{state} por {name} · hace {age}',
    pt: '{state} por {name} · há {age}'
  },
  '{state} by {name} · {when}': { es: '{state} por {name} · {when}', pt: '{state} por {name} · {when}' },
  '{time} left': { es: '{time} restantes', pt: '{time} restantes' },
  '{time} over': { es: '{time} de más', pt: '{time} a mais' },
  '{who} · {age} ago': { es: '{who} · hace {age}', pt: '{who} · há {age}' },
  '/hr': { es: '/h', pt: '/h' },
  '+{n} more': { es: '+{n} más', pt: '+{n} mais' },
  'A board needs a name.': { es: 'Un tablero necesita un nombre.', pt: 'Um quadro precisa de um nome.' },
  'A board organises work into columns you drag cards between. It starts with To Do, In Progress and Done, and you can rename them later.':
    {
      es: 'Un tablero organiza el trabajo en columnas entre las que arrastras tarjetas. Empieza con Por hacer, En progreso y Hecho, y puedes cambiarles el nombre después.',
      pt: 'Um quadro organiza o trabalho em colunas entre as quais você arrasta cartões. Ele começa com A fazer, Em andamento e Concluído, e você pode renomeá-las depois.'
    },
  'A card here does not appear there, and completing one does not complete the other.': {
    es: 'Una tarjeta aquí no aparece allí, y completar una no completa la otra.',
    pt: 'Um cartão aqui não aparece lá, e concluir um não conclui o outro.'
  },
  'A card needs a title.': { es: 'Una tarjeta necesita un título.', pt: 'Um cartão precisa de um título.' },
  'A case cannot close until this clears': {
    es: 'Un ticket no se puede cerrar hasta que esto se autorice',
    pt: 'Um chamado não pode ser fechado até que isto seja liberado'
  },
  'A column needs a name.': { es: 'Una columna necesita un nombre.', pt: 'Uma coluna precisa de um nome.' },
  'A document needs a title.': {
    es: 'Un documento necesita un título.',
    pt: 'Um documento precisa de um título.'
  },
  'A few more words: this is the text an agent will paste to a customer.': {
    es: 'Unas palabras más: este es el texto que un agente pegará a un cliente.',
    pt: 'Mais algumas palavras: este é o texto que um agente vai colar para um cliente.'
  },
  'A note stays inside the team and does not stop the first-reply clock.': {
    es: 'Una nota se queda dentro del equipo y no detiene el reloj de la primera respuesta.',
    pt: 'Uma nota fica dentro da equipe e não para o relógio da primeira resposta.'
  },
  'A published article cannot move back down the workflow. Unpublish it first.': {
    es: 'Un artículo publicado no puede volver atrás en el flujo. Despublícalo primero.',
    pt: 'Um artigo publicado não pode voltar no fluxo. Despublique-o primeiro.'
  },
  'A rejection needs a reason.': {
    es: 'Un rechazo necesita un motivo.',
    pt: 'Uma recusa precisa de um motivo.'
  },
  'A reply is emailed to the contacts on this ticket and shown in their portal.': {
    es: 'Una respuesta se envía por correo a los contactos de este ticket y se muestra en su portal.',
    pt: 'Uma resposta é enviada por e-mail aos contatos deste chamado e aparece no portal deles.'
  },
  'A reply still overdue on an open ticket counts as late.': {
    es: 'Una respuesta que sigue vencida en un ticket abierto cuenta como tarde.',
    pt: 'Uma resposta ainda atrasada em um chamado aberto conta como fora do prazo.'
  },
  'A short summary of the problem': {
    es: 'Un resumen breve del problema',
    pt: 'Um resumo curto do problema'
  },
  'A task with no due date never becomes overdue and never appears in "due this week". It is a real choice, not a blank you forgot.':
    {
      es: 'Una tarea sin fecha de vencimiento nunca pasa a vencida y nunca aparece en "vence esta semana". Es una decisión real, no un vacío que olvidaste.',
      pt: 'Uma tarefa sem data de vencimento nunca fica atrasada e nunca aparece em "vence esta semana". É uma escolha de verdade, não um vazio que você esqueceu.'
    },
  'The day this task should be done. Leave it empty and it never counts as late, and it never appears in this week. That is a real choice, not a blank you forgot.':
    {
      es: 'El día en que se tiene que realizar. Si lo dejas vacío, no cuenta como tarde y no aparece entre las de esta semana. Es una decisión real, no un vacío que olvidaste.',
      pt: 'O dia em que esta tarefa deve ser feita. Se ficar vazio, não conta como atrasada e não aparece entre as desta semana. É uma escolha de verdade, não um vazio que você esqueceu.'
    },
  'When it should be done': {
    es: 'Cuándo se tiene que realizar',
    pt: 'Quando deve ser feita'
  },
  'A ticket needs a subject.': {
    es: 'Un ticket necesita un asunto.',
    pt: 'Um chamado precisa de um assunto.'
  },
  'Active, appears in the list': {
    es: 'Activo, aparece en la lista',
    pt: 'Ativo, aparece na lista'
  },
  'Add a comment': { es: 'Añadir un comentario', pt: 'Adicionar um comentário' },
  'Add a file, then choose who can open it. Nobody sees it until you share it.': {
    es: 'Añade un archivo y luego elige quién puede abrirlo. Nadie lo ve hasta que lo compartes.',
    pt: 'Adicione um arquivo e depois escolha quem pode abri-lo. Ninguém vê até você compartilhar.'
  },
  'Add a subject, choose a category, and describe what you need help with.': {
    es: 'Añade un asunto, elige una categoría y describe en qué necesitas ayuda.',
    pt: 'Adicione um assunto, escolha uma categoria e descreva com o que você precisa de ajuda.'
  },
  'Add any details that will help us investigate.': {
    es: 'Añade cualquier dato que nos ayude a investigar.',
    pt: 'Adicione qualquer detalhe que nos ajude a investigar.'
  },
  'Add card': { es: 'Añadir tarjeta', pt: 'Adicionar cartão' },
  'Add column': { es: 'Añadir columna', pt: 'Adicionar coluna' },
  Agent: { es: 'Agente', pt: 'Agente' },
  'Also on send': { es: 'También al enviar', pt: 'Também ao enviar' },
  'Also open here': { es: 'También abierto aquí', pt: 'Também aberto aqui' },
  'Also shared with {n} people no longer active. Saving keeps those shares.': {
    es: 'También compartido con {n} personas que ya no están activas. Al guardar se conservan esos accesos.',
    pt: 'Também compartilhado com {n} pessoas que não estão mais ativas. Salvar mantém esses acessos.'
  },
  'Also shared with one person no longer active. Saving keeps that share.': {
    es: 'También compartido con una persona que ya no está activa. Al guardar se conserva ese acceso.',
    pt: 'Também compartilhado com uma pessoa que não está mais ativa. Salvar mantém esse acesso.'
  },
  Answer: { es: 'Respuesta', pt: 'Resposta' },
  'Answered, but nobody owns it. Assign someone so it does not stall between people.': {
    es: 'Respondido, pero nadie es el responsable. Asigna a alguien para que no se quede entre personas.',
    pt: 'Respondido, mas ninguém é o responsável. Atribua alguém para que não fique parado entre pessoas.'
  },
  'any {role}': { es: 'cualquier {role}', pt: 'qualquer {role}' },
  'Applies now: {actions}': { es: 'Se aplica ahora: {actions}', pt: 'Aplica agora: {actions}' },
  Approval: { es: 'Aprobación', pt: 'Aprovação' },
  'Approvals land here when someone tries to close a case that a rule gates. No pending requests means no case is being held up.':
    {
      es: 'Las aprobaciones llegan aquí cuando alguien intenta cerrar un ticket que una regla frena. Si no hay solicitudes pendientes, ningún ticket está detenido.',
      pt: 'As aprovações chegam aqui quando alguém tenta fechar um chamado que uma regra bloqueia. Sem solicitações pendentes, nenhum chamado está parado.'
    },
  Approve: { es: 'Aprobar', pt: 'Aprovar' },
  'Approved, but not suggested on tickets yet. An admin has to publish it.': {
    es: 'Aprobado, pero todavía no se sugiere en los tickets. Un administrador tiene que publicarlo.',
    pt: 'Aprovado, mas ainda não sugerido nos chamados. Um administrador precisa publicá-lo.'
  },
  'Approved, but not suggested on tickets yet. Publishing is the last step.': {
    es: 'Aprobado, pero todavía no se sugiere en los tickets. Publicar es el último paso.',
    pt: 'Aprovado, mas ainda não sugerido nos chamados. Publicar é o último passo.'
  },
  'Approved, not published': { es: 'Aprobado, no publicado', pt: 'Aprovado, não publicado' },
  'Approving does not publish it. That is a separate button on the article.': {
    es: 'Aprobar no lo publica. Ese es un botón aparte en el artículo.',
    pt: 'Aprovar não publica. Esse é um botão separado no artigo.'
  },
  'Approving is an admin\'s call. It is what lets an article be published.': {
    es: 'Aprobar es decisión de un administrador. Es lo que permite publicar un artículo.',
    pt: 'Aprovar é decisão de um administrador. É o que permite publicar um artigo.'
  },
  archived: { es: 'archivados', pt: 'arquivados' },
  Archived: { es: 'Archivado', pt: 'Arquivado' },
  'Archived, kept, hidden from the default view': {
    es: 'Archivado, conservado, oculto de la vista predeterminada',
    pt: 'Arquivado, mantido, oculto da visão padrão'
  },
  'Archiving keeps the document and its history; delete removes it for everyone who could open it. Delete only when it was uploaded by mistake.':
    {
      es: 'Archivar conserva el documento y su historial; eliminar lo quita para todos los que podían abrirlo. Elimina solo si se subió por error.',
      pt: 'Arquivar mantém o documento e o histórico; excluir remove para todos que podiam abri-lo. Exclua só se foi enviado por engano.'
    },
  'are kept as they are.': { es: 'se mantienen como están.', pt: 'permanecem como estão.' },
  article: { es: 'artículo', pt: 'artigo' },
  Article: { es: 'Artículo', pt: 'Artigo' },
  articles: { es: 'artículos', pt: 'artigos' },
  Articles: { es: 'Artículos', pt: 'Artigos' },
  'Assign to': { es: 'Asignar a', pt: 'Atribuir a' },
  'Assigned to': { es: 'Asignado a', pt: 'Atribuído a' },
  Assignee: { es: 'Asignado', pt: 'Atribuído' },
  Attach: { es: 'Adjuntar', pt: 'Anexar' },
  'Attach a file': { es: 'Adjuntar un archivo', pt: 'Anexar um arquivo' },
  'Attached to': { es: 'Vinculado a', pt: 'Vinculado a' },
  'Attachment (optional)': { es: 'Adjunto (opcional)', pt: 'Anexo (opcional)' },
  'Attachment not found': { es: 'No se encontró el adjunto', pt: 'Anexo não encontrado' },
  Attachments: { es: 'Adjuntos', pt: 'Anexos' },
  Author: { es: 'Autor', pt: 'Autor' },
  'auto-stopped': { es: 'se detuvo solo', pt: 'parou sozinho' },
  'average from': { es: 'promedio de', pt: 'média de' },
  'Back to help': { es: 'Volver a la ayuda', pt: 'Voltar para a ajuda' },
  Backlog: { es: 'Pendientes', pt: 'Fila' },
  billable: { es: 'facturable', pt: 'faturável' },
  Billable: { es: 'Facturable', pt: 'Faturável' },
  Billing: { es: 'Facturación', pt: 'Faturamento' },
  'Board columns': { es: 'Columnas del tablero', pt: 'Colunas do quadro' },
  'Board name': { es: 'Nombre del tablero', pt: 'Nome do quadro' },
  Browser: { es: 'Navegador', pt: 'Navegador' },
  'By status': { es: 'Por estado', pt: 'Por status' },
  'Cannot be changed later. The API makes it read-only after creation.': {
    es: 'No se puede cambiar después. La API lo deja de solo lectura una vez creado.',
    pt: 'Não pode ser alterado depois. A API deixa somente leitura após a criação.'
  },
  'Card title': { es: 'Título de la tarjeta', pt: 'Título do cartão' },
  'Cards on a board are separate records from the': {
    es: 'Las tarjetas de un tablero son registros distintos de la',
    pt: 'Os cartões de um quadro são registros separados da'
  },
  'Change parent': { es: 'Cambiar el padre', pt: 'Mudar o pai' },
  'Change the calendar': { es: 'Cambiar el calendario', pt: 'Mudar o calendário' },
  'Changing a document is limited to the person who uploaded it and admins. You can open a document shared with you, but not edit it.':
    {
      es: 'Cambiar un documento está limitado a quien lo subió y a los administradores. Puedes abrir un documento compartido contigo, pero no editarlo.',
      pt: 'Alterar um documento fica limitado a quem enviou e aos administradores. Você pode abrir um documento compartilhado com você, mas não editá-lo.'
    },
  'Checked, but no customer can read it yet. Publishing is what releases it.': {
    es: 'Revisado, pero ningún cliente puede leerlo todavía. Publicar es lo que lo libera.',
    pt: 'Revisado, mas nenhum cliente pode ler ainda. Publicar é o que libera.'
  },
  'Choose a category': { es: 'Elige una categoría', pt: 'Escolha uma categoria' },
  'Choose a file to upload.': { es: 'Elige un archivo para subir.', pt: 'Escolha um arquivo para enviar.' },
  'Choose one…': { es: 'Elige uno…', pt: 'Escolha um…' },
  'Choose…': { es: 'Elige…', pt: 'Escolha…' },
  'clear filters': { es: 'quitar filtros', pt: 'limpar filtros' },
  'Clear filters': { es: 'Quitar filtros', pt: 'Limpar filtros' },
  'cleared by': { es: 'autorizada por', pt: 'liberada por' },
  'Close {name}': { es: 'Cerrar {name}', pt: 'Fechar {name}' },
  'Close all of them': { es: 'Cerrarlos todos', pt: 'Fechar todos' },
  'Close these as well': { es: 'Cerrar estos también', pt: 'Fechar estes também' },
  'Close this ticket': { es: 'Cerrar este ticket', pt: 'Fechar este chamado' },
  'Closed this week': { es: 'Cerrados esta semana', pt: 'Fechados esta semana' },
  'Closing this ticket needs approval under': {
    es: 'Cerrar este ticket requiere aprobación de',
    pt: 'Fechar este chamado exige aprovação de'
  },
  'Column colour': { es: 'Color de la columna', pt: 'Cor da coluna' },
  'Column name': { es: 'Nombre de la columna', pt: 'Nome da coluna' },
  'Columns over limit': { es: 'Columnas por encima del límite', pt: 'Colunas acima do limite' },
  Comment: { es: 'Comentario', pt: 'Comentário' },
  'Context anyone picking this up would need.': {
    es: 'El contexto que necesitaría quien retome esto.',
    pt: 'O contexto de que quem assumir isto precisaria.'
  },
  'Contracts, runbooks, price sheets. The things you send people often enough to stop hunting for. Share each one with the people or the team who need it; an unshared upload is visible only to you and to admins.':
    {
      es: 'Contratos, guías operativas, listas de precios. Lo que envías con tanta frecuencia que ya no quieres buscarlo. Comparte cada uno con las personas o el equipo que lo necesitan; un archivo sin compartir solo lo ves tú y los administradores.',
      pt: 'Contratos, roteiros de operação, tabelas de preço. O que você envia com tanta frequência que já não quer procurar. Compartilhe cada um com as pessoas ou a equipe que precisam; um envio sem compartilhar fica visível só para você e para os administradores.'
    },
  Conversation: { es: 'Conversación', pt: 'Conversa' },
  'Could not add the card.': { es: 'No se pudo añadir la tarjeta.', pt: 'Não foi possível adicionar o cartão.' },
  'Could not add the column.': {
    es: 'No se pudo añadir la columna.',
    pt: 'Não foi possível adicionar a coluna.'
  },
  'Could not apply this macro.': {
    es: 'No se pudo aplicar esta macro.',
    pt: 'Não foi possível aplicar esta macro.'
  },
  'Could not approve this request.': {
    es: 'No se pudo aprobar esta solicitud.',
    pt: 'Não foi possível aprovar esta solicitação.'
  },
  'Could not change the status.': {
    es: 'No se pudo cambiar el estado.',
    pt: 'Não foi possível mudar o status.'
  },
  'Could not change this entry.': {
    es: 'No se pudo cambiar este registro.',
    pt: 'Não foi possível alterar este lançamento.'
  },
  'Could not close this ticket.': {
    es: 'No se pudo cerrar este ticket.',
    pt: 'Não foi possível fechar este chamado.'
  },
  'Could not create the board.': {
    es: 'No se pudo crear el tablero.',
    pt: 'Não foi possível criar o quadro.'
  },
  'Could not delete this article.': {
    es: 'No se pudo eliminar este artículo.',
    pt: 'Não foi possível excluir este artigo.'
  },
  'Could not delete this document.': {
    es: 'No se pudo eliminar este documento.',
    pt: 'Não foi possível excluir este documento.'
  },
  'Could not delete this entry.': {
    es: 'No se pudo eliminar este registro.',
    pt: 'Não foi possível excluir este lançamento.'
  },
  'Could not delete this task.': {
    es: 'No se pudo eliminar esta tarea.',
    pt: 'Não foi possível excluir esta tarefa.'
  },
  'Could not detach this ticket.': {
    es: 'No se pudo separar este ticket.',
    pt: 'Não foi possível separar este chamado.'
  },
  'Could not download this attachment': {
    es: 'No se pudo descargar este adjunto',
    pt: 'Não foi possível baixar este anexo'
  },
  'Could not insert this saved reply.': {
    es: 'No se pudo insertar esta respuesta guardada.',
    pt: 'Não foi possível inserir esta resposta salva.'
  },
  'Could not link this article.': {
    es: 'No se pudo vincular este artículo.',
    pt: 'Não foi possível vincular este artigo.'
  },
  'Could not link this ticket.': {
    es: 'No se pudo vincular este ticket.',
    pt: 'Não foi possível vincular este chamado.'
  },
  'Could not load the tickets to link under.': {
    es: 'No se pudieron cargar los tickets para vincular debajo.',
    pt: 'Não foi possível carregar os chamados para vincular abaixo.'
  },
  'Could not load the tickets to merge into.': {
    es: 'No se pudieron cargar los tickets para fusionar.',
    pt: 'Não foi possível carregar os chamados para mesclar.'
  },
  'Could not log this time.': {
    es: 'No se pudo registrar este tiempo.',
    pt: 'Não foi possível lançar este tempo.'
  },
  'Could not merge this ticket.': {
    es: 'No se pudo fusionar este ticket.',
    pt: 'Não foi possível mesclar este chamado.'
  },
  'Could not move the card, reverted.': {
    es: 'No se pudo mover la tarjeta; se revirtió.',
    pt: 'Não foi possível mover o cartão; foi revertido.'
  },
  'Could not move the card; reverted.': {
    es: 'No se pudo mover la tarjeta; se revirtió.',
    pt: 'Não foi possível mover o cartão; foi revertido.'
  },
  'Could not move the card.': {
    es: 'No se pudo mover la tarjeta.',
    pt: 'Não foi possível mover o cartão.'
  },
  'Could not move the ticket, so it went back.': {
    es: 'No se pudo mover el ticket, así que volvió.',
    pt: 'Não foi possível mover o chamado, então ele voltou.'
  },
  'Could not move the ticket.': {
    es: 'No se pudo mover el ticket.',
    pt: 'Não foi possível mover o chamado.'
  },
  'Could not open this support ticket.': {
    es: 'No se pudo abrir este ticket de soporte.',
    pt: 'Não foi possível abrir este chamado de suporte.'
  },
  'Could not post that comment.': {
    es: 'No se pudo publicar ese comentario.',
    pt: 'Não foi possível publicar esse comentário.'
  },
  'Could not post this reply.': {
    es: 'No se pudo publicar esta respuesta.',
    pt: 'Não foi possível publicar esta resposta.'
  },
  'Could not publish this article.': {
    es: 'No se pudo publicar este artículo.',
    pt: 'Não foi possível publicar este artigo.'
  },
  'Could not raise this ticket.': {
    es: 'No se pudo abrir este ticket.',
    pt: 'Não foi possível abrir este chamado.'
  },
  'Could not reassign this task.': {
    es: 'No se pudo reasignar esta tarea.',
    pt: 'Não foi possível reatribuir esta tarefa.'
  },
  'Could not reject this request.': {
    es: 'No se pudo rechazar esta solicitud.',
    pt: 'Não foi possível recusar esta solicitação.'
  },
  'Could not request approval.': {
    es: 'No se pudo solicitar la aprobación.',
    pt: 'Não foi possível solicitar a aprovação.'
  },
  'Could not save this article.': {
    es: 'No se pudo guardar este artículo.',
    pt: 'Não foi possível salvar este artigo.'
  },
  'Could not save this document.': {
    es: 'No se pudo guardar este documento.',
    pt: 'Não foi possível salvar este documento.'
  },
  'Could not save this task.': {
    es: 'No se pudo guardar esta tarea.',
    pt: 'Não foi possível salvar esta tarefa.'
  },
  'Could not save this ticket.': {
    es: 'No se pudo guardar este ticket.',
    pt: 'Não foi possível salvar este chamado.'
  },
  'Could not send this reply.': {
    es: 'No se pudo enviar esta respuesta.',
    pt: 'Não foi possível enviar esta resposta.'
  },
  'Could not start the timer.': {
    es: 'No se pudo iniciar el cronómetro.',
    pt: 'Não foi possível iniciar o cronômetro.'
  },
  'Could not stop the timer.': {
    es: 'No se pudo detener el cronómetro.',
    pt: 'Não foi possível parar o cronômetro.'
  },
  'Could not stop watching this ticket.': {
    es: 'No se pudo dejar de seguir este ticket.',
    pt: 'Não foi possível deixar de acompanhar este chamado.'
  },
  'Could not unlink this article.': {
    es: 'No se pudo desvincular este artículo.',
    pt: 'Não foi possível desvincular este artigo.'
  },
  'Could not unmerge this ticket.': {
    es: 'No se pudo deshacer la fusión de este ticket.',
    pt: 'Não foi possível desfazer a mesclagem deste chamado.'
  },
  'Could not unpublish this article.': {
    es: 'No se pudo despublicar este artículo.',
    pt: 'Não foi possível despublicar este artigo.'
  },
  'Could not upload this document.': {
    es: 'No se pudo subir este documento.',
    pt: 'Não foi possível enviar este documento.'
  },
  'Could not use this saved reply.': {
    es: 'No se pudo usar esta respuesta guardada.',
    pt: 'Não foi possível usar esta resposta salva.'
  },
  'Could not watch this ticket.': {
    es: 'No se pudo seguir este ticket.',
    pt: 'Não foi possível acompanhar este chamado.'
  },
  'Could not withdraw this request.': {
    es: 'No se pudo retirar esta solicitud.',
    pt: 'Não foi possível retirar esta solicitação.'
  },
  'Counted back from now. To record a session from an earlier day, start and stop the timer on it.': {
    es: 'Se cuenta hacia atrás desde ahora. Para registrar una sesión de un día anterior, inicia y detén el cronómetro en ese momento.',
    pt: 'Contado para trás a partir de agora. Para registrar uma sessão de um dia anterior, inicie e pare o cronômetro nela.'
  },
  'Create board': { es: 'Crear tablero', pt: 'Criar quadro' },
  'Create task': { es: 'Crear tarea', pt: 'Criar tarefa' },
  'Customer satisfaction': { es: 'Satisfacción del cliente', pt: 'Satisfação do cliente' },
  'Customer visibility': { es: 'Visibilidad para el cliente', pt: 'Visibilidade para o cliente' },
  'Customers never see these names, but articles sharing one are shown to each other in the portal.': {
    es: 'Los clientes nunca ven estos nombres, pero los artículos que comparten uno se muestran entre sí en el portal.',
    pt: 'Os clientes nunca veem esses nomes, mas artigos que compartilham um são mostrados uns aos outros no portal.'
  },
  'Decided this week': { es: 'Decididos esta semana', pt: 'Decididos esta semana' },
  'Delete “{title}” for good?': {
    es: '¿Eliminar “{title}” para siempre?',
    pt: 'Excluir “{title}” de vez?'
  },
  'Delete this document': { es: 'Eliminar este documento', pt: 'Excluir este documento' },
  'Delete this entry': { es: 'Eliminar este registro', pt: 'Excluir este lançamento' },
  'Deletes {title} permanently. This cannot be undone.': {
    es: 'Elimina {title} de forma permanente. Esto no se puede deshacer.',
    pt: 'Exclui {title} permanentemente. Isto não pode ser desfeito.'
  },
  'Description (optional)': { es: 'Descripción (opcional)', pt: 'Descrição (opcional)' },
  Detach: { es: 'Separar', pt: 'Separar' },
  'Detached from its parent ticket.': {
    es: 'Separado de su ticket padre.',
    pt: 'Separado do chamado pai.'
  },
  'Do not apply {label}': { es: 'No aplicar {label}', pt: 'Não aplicar {label}' },
  'Do not apply this': { es: 'No aplicar esto', pt: 'Não aplicar isto' },
  'Do these before anything else': {
    es: 'Haz esto antes que nada',
    pt: 'Faça isto antes de qualquer coisa'
  },
  Document: { es: 'Documento', pt: 'Documento' },
  Done: { es: 'Hecho', pt: 'Concluído' },
  'done {date}': { es: 'hecha el {date}', pt: 'concluída em {date}' },
  'Drag a card, or use "Move to" on it, to change its {what}. Moving a ticket to Closed closes it, so an approval rule can refuse it.':
    {
      es: 'Arrastra una tarjeta, o usa "Mover a" en ella, para cambiar su {what}. Mover un ticket a Cerrado lo cierra, así que una regla de aprobación puede rechazarlo.',
      pt: 'Arraste um cartão, ou use "Mover para" nele, para mudar {what}. Mover um chamado para Fechado o fecha, então uma regra de aprovação pode recusar.'
    },
  'Drop a card here': { es: 'Suelta una tarjeta aquí', pt: 'Solte um cartão aqui' },
  'due {when}': { es: 'vence {when}', pt: 'vence {when}' },
  'Due this week': { es: 'Vence esta semana', pt: 'Vence esta semana' },
  'Each one gets a note saying it was closed with this ticket. Leave it unticked to close only this one.':
    {
      es: 'Cada uno recibe una nota que dice que se cerró con este ticket. Déjalo sin marcar para cerrar solo este.',
      pt: 'Cada um recebe uma nota dizendo que foi fechado com este chamado. Deixe desmarcado para fechar só este.'
    },
  'Each priority carries its own target from the escalation policy, so each one is scored against its own promise.':
    {
      es: 'Cada prioridad tiene su propio objetivo en la política de escalamiento, así que cada una se mide contra su propia promesa.',
      pt: 'Cada prioridade tem o próprio alvo na política de escalonamento, então cada uma é medida contra a própria promessa.'
    },
  'Edit article': { es: 'Editar artículo', pt: 'Editar artigo' },
  'Edit task': { es: 'Editar tarea', pt: 'Editar tarefa' },
  'Edit ticket': { es: 'Editar ticket', pt: 'Editar chamado' },
  Edited: { es: 'Editado', pt: 'Editado' },
  'edited {when}': { es: 'editado {when}', pt: 'editado {when}' },
  'Elapsed time is counted around the clock. No business-hours calendar is set, so evenings and weekends count against a target.':
    {
      es: 'El tiempo transcurrido se cuenta de corrido. No hay un calendario de horario laboral, así que las noches y los fines de semana cuentan contra el objetivo.',
      pt: 'O tempo decorrido é contado o tempo todo. Não há um calendário de horário comercial, então noites e fins de semana contam contra o objetivo.'
    },
  email: { es: 'correo', pt: 'e-mail' },
  'escalated {n}×': { es: 'escalado {n}×', pt: 'escalado {n}×' },
  'Every case': { es: 'Todos los tickets', pt: 'Todos os chamados' },
  'Everyone selected here is on the task. Deselecting a name takes them off it.': {
    es: 'Todas las personas elegidas aquí están en la tarea. Quitar un nombre lo saca de ella.',
    pt: 'Todas as pessoas escolhidas aqui estão na tarefa. Desmarcar um nome tira a pessoa dela.'
  },
  'Everything is dated': { es: 'Todo tiene fecha', pt: 'Tudo tem data' },
  'Everything on your list is done. Show completed to see what you finished.': {
    es: 'Todo lo de tu lista está hecho. Muestra las completadas para ver lo que terminaste.',
    pt: 'Tudo na sua lista está feito. Mostre as concluídas para ver o que você terminou.'
  },
  File: { es: 'Archivo', pt: 'Arquivo' },
  'Filed against': { es: 'Usado en', pt: 'Usado em' },
  'filed on {n} ticket': { es: 'usado en {n} ticket', pt: 'usado em {n} chamado' },
  'filed on {n} tickets': { es: 'usado en {n} tickets', pt: 'usado em {n} chamados' },
  'Find an article to link': { es: 'Busca un artículo para vincular', pt: 'Busque um artigo para vincular' },
  'First reply': { es: 'Primera respuesta', pt: 'Primeira resposta' },
  'first reply {when}': { es: 'primera respuesta {when}', pt: 'primeira resposta {when}' },
  'First reply overdue': { es: 'Primera respuesta vencida', pt: 'Primeira resposta atrasada' },
  'First response, against target': {
    es: 'Primera respuesta, contra el objetivo',
    pt: 'Primeira resposta, contra o alvo'
  },
  'First-reply targets come from each ticket\'s SLA hours': {
    es: 'Los objetivos de primera respuesta salen de las horas de SLA de cada ticket',
    pt: 'Os alvos de primeira resposta vêm das horas de SLA de cada chamado'
  },
  'Fix it yourself, or reach someone who can': {
    es: 'Resuélvelo tú, o contacta a alguien que pueda',
    pt: 'Resolva você mesmo, ou fale com alguém que possa'
  },
  'Fixing an SSO login loop after an identity provider change': {
    es: 'Corregir un bucle de inicio de sesión SSO tras un cambio de proveedor de identidad',
    pt: 'Corrigir um loop de login SSO após uma mudança de provedor de identidade'
  },
  'Four things turn a two-day exchange into one message. The first two are already known.': {
    es: 'Cuatro datos convierten un intercambio de dos días en un mensaje. Los dos primeros ya se conocen.',
    pt: 'Quatro dados transformam uma troca de dois dias em uma mensagem. Os dois primeiros já são conhecidos.'
  },
  'Give the document a title you would recognise in a list.': {
    es: 'Ponle al documento un título que reconocerías en una lista.',
    pt: 'Dê ao documento um título que você reconheceria numa lista.'
  },
  'Give the document a title.': { es: 'Ponle un título al documento.', pt: 'Dê um título ao documento.' },
  'Given to nobody': { es: 'Para nadie', pt: 'Para ninguém' },
  'Go to tickets': { es: 'Ir a tickets', pt: 'Ir para chamados' },
  'Grew by {n} over the window': { es: 'Creció {n} en la ventana', pt: 'Cresceu {n} na janela' },
  'Hold ⌘ or Ctrl to pick more than one. Clearing the list leaves the task with nobody on it.': {
    es: 'Mantén ⌘ o Ctrl para elegir más de uno. Vaciar la lista deja la tarea sin nadie.',
    pt: 'Segure ⌘ ou Ctrl para escolher mais de um. Limpar a lista deixa a tarefa sem ninguém.'
  },
  'Hold ctrl or cmd to pick more than one.': {
    es: 'Mantén ctrl o cmd para elegir más de uno.',
    pt: 'Segure ctrl ou cmd para escolher mais de um.'
  },
  'How this gets used': { es: 'Cómo se usa', pt: 'Como isto é usado' },
  'If that did not do it': { es: 'Si eso no bastó', pt: 'Se isso não resolveu' },
  'In Done, never marked complete, still counted as open': {
    es: 'En Hecho, nunca marcada como completa y aún cuenta como abierta',
    pt: 'Em Concluído, nunca marcada como concluída e ainda contada como aberta'
  },
  'in this pipeline': { es: 'en este embudo', pt: 'neste funil' },
  'in time': { es: 'a tiempo', pt: 'no prazo' },
  'Incidents and problems are work; questions are usually a gap in the knowledge base.': {
    es: 'Los incidentes y los problemas son trabajo; las preguntas suelen ser un hueco en la base de conocimiento.',
    pt: 'Incidentes e problemas são trabalho; perguntas em geral são uma lacuna na base de conhecimento.'
  },
  'include closed': { es: 'incluir cerrados', pt: 'incluir fechados' },
  'include completed': { es: 'incluir completadas', pt: 'incluir concluídas' },
  'Include what you tried, what you expected, and the exact error you saw.': {
    es: 'Incluye lo que intentaste, lo que esperabas y el error exacto que viste.',
    pt: 'Inclua o que você tentou, o que esperava e o erro exato que viu.'
  },
  Insert: { es: 'Insertar', pt: 'Inserir' },
  Internal: { es: 'Interno', pt: 'Interno' },
  'Internal filing. Customers never see these names, but articles sharing one are shown to each other in the portal.':
    {
      es: 'Clasificación interna. Los clientes nunca ven estos nombres, pero los artículos que comparten uno se muestran entre sí en el portal.',
      pt: 'Classificação interna. Os clientes nunca veem esses nomes, mas artigos que compartilham um são mostrados uns aos outros no portal.'
    },
  'internal note': { es: 'nota interna', pt: 'nota interna' },
  'Internal note': { es: 'Nota interna', pt: 'Nota interna' },
  'Internal only': { es: 'Solo interno', pt: 'Somente interno' },
  'Internal only. Agents can still search for it and attach it to a ticket.': {
    es: 'Solo interno. Los agentes aún pueden buscarlo y adjuntarlo a un ticket.',
    pt: 'Somente interno. Os agentes ainda podem buscar e anexar a um chamado.'
  },
  'its parent': { es: 'su ticket padre', pt: 'seu chamado pai' },
  Keep: { es: 'Conservar', pt: 'Manter' },
  late: { es: 'con retraso', pt: 'atrasados' },
  'Leave this empty to keep the current file. Choosing one replaces it, and the title and shares stay as they are.':
    {
      es: 'Déjalo vacío para conservar el archivo actual. Si eliges uno, lo reemplaza, y el título y los accesos se quedan como están.',
      pt: 'Deixe vazio para manter o arquivo atual. Escolher um substitui, e o título e os acessos continuam como estão.'
    },
  'Left empty, the saved date is kept.': {
    es: 'Si se deja vacío, se conserva la fecha guardada.',
    pt: 'Se ficar vazio, a data salva é mantida.'
  },
  'Level over the window': { es: 'Igual en la ventana', pt: 'Estável na janela' },
  Link: { es: 'Vincular', pt: 'Vincular' },
  'Link {name} under a parent': { es: 'Vincular {name} bajo un padre', pt: 'Vincular {name} sob um pai' },
  'Link {title}': { es: 'Vincular {title}', pt: 'Vincular {title}' },
  'Link parent…': { es: 'Vincular padre…', pt: 'Vincular pai…' },
  'Linked tickets': { es: 'Tickets vinculados', pt: 'Chamados vinculados' },
  'Linked to': { es: 'Vinculado a', pt: 'Vinculado a' },
  'Live for customers to read, and suggested on tickets.': {
    es: 'Visible para que los clientes lo lean, y sugerido en los tickets.',
    pt: 'Visível para os clientes lerem, e sugerido nos chamados.'
  },
  'live to customers': { es: 'visible para clientes', pt: 'visível para clientes' },
  'Live to customers': { es: 'Visible para clientes', pt: 'Visível para clientes' },
  'Log time': { es: 'Registrar tiempo', pt: 'Lançar tempo' },
  logged: { es: 'registrado', pt: 'lançado' },
  Logged: { es: 'Registrado', pt: 'Lançado' },
  'Manage document': { es: 'Gestionar documento', pt: 'Gerenciar documento' },
  'Manage this document': { es: 'Gestionar este documento', pt: 'Gerenciar este documento' },
  'Mark {title} done': { es: 'Marcar {title} como hecha', pt: 'Marcar {title} como concluída' },
  'Mark as billable': { es: 'Marcar como facturable', pt: 'Marcar como faturável' },
  'Mark as non-billable': { es: 'Marcar como no facturable', pt: 'Marcar como não faturável' },
  'Mark done': { es: 'Marcar hecha', pt: 'Marcar concluída' },
  'Mark task done': { es: 'Marcar tarea hecha', pt: 'Marcar tarefa concluída' },
  'Master services agreement (2026 template)': {
    es: 'Contrato marco de servicios (plantilla 2026)',
    pt: 'Contrato mestre de serviços (modelo 2026)'
  },
  'Matching published articles': {
    es: 'Artículos publicados que coinciden',
    pt: 'Artigos publicados correspondentes'
  },
  'median {time}': { es: 'mediana {time}', pt: 'mediana {time}' },
  'Median first response': { es: 'Mediana de la primera respuesta', pt: 'Mediana da primeira resposta' },
  'Median resolution': { es: 'Mediana de resolución', pt: 'Mediana de resolução' },
  'Median, not mean. One three-week ticket should not move it': {
    es: 'Mediana, no promedio. Un ticket de tres semanas no debería moverla',
    pt: 'Mediana, não média. Um chamado de três semanas não deveria movê-la'
  },
  'Merge {name} into another ticket': {
    es: 'Fusionar {name} en otro ticket',
    pt: 'Mesclar {name} em outro chamado'
  },
  'Merge into…': { es: 'Fusionar en…', pt: 'Mesclar em…' },
  'merged {when}': { es: 'fusionado {when}', pt: 'mesclado {when}' },
  'Merged from': { es: 'Fusionado desde', pt: 'Mesclado de' },
  Messages: { es: 'Mensajes', pt: 'Mensagens' },
  'Met in {time}': { es: 'Cumplido en {time}', pt: 'Cumprido em {time}' },
  Minutes: { es: 'Minutos', pt: 'Minutos' },
  'Missed target': { es: 'Objetivo no cumplido', pt: 'Alvo não cumprido' },
  'Missing ticket or column.': { es: 'Falta el ticket o la columna.', pt: 'Falta o chamado ou a coluna.' },
  'More cards than the column allows': {
    es: 'Más tarjetas de las que permite la columna',
    pt: 'Mais cartões do que a coluna permite'
  },
  'More tickets further down are not shown.': {
    es: 'Hay más tickets más abajo que no se muestran.',
    pt: 'Há mais chamados abaixo que não são mostrados.'
  },
  'Move {name} to': { es: 'Mover {name} a', pt: 'Mover {name} para' },
  'Needs a first reply': { es: 'Necesita una primera respuesta', pt: 'Precisa de uma primeira resposta' },
  'New article': { es: 'Nuevo artículo', pt: 'Novo artigo' },
  'New support ticket': { es: 'Nuevo ticket de soporte', pt: 'Novo chamado de suporte' },
  'New task': { es: 'Nueva tarea', pt: 'Nova tarefa' },
  'New ticket': { es: 'Nuevo ticket', pt: 'Novo chamado' },
  'Newest first': { es: 'Más recientes primero', pt: 'Mais recentes primeiro' },
  'Next month': { es: 'Mes siguiente', pt: 'Mês seguinte' },
  'next reply target': {
    es: 'objetivo de la siguiente respuesta de cada prioridad',
    pt: 'alvo da próxima resposta de cada prioridade'
  },
  'Next response, against target': {
    es: 'Siguiente respuesta, contra el objetivo',
    pt: 'Próxima resposta, contra o alvo'
  },
  'No approval requested yet.': {
    es: 'Todavía no se ha solicitado aprobación.',
    pt: 'Ainda não foi solicitada aprovação.'
  },
  'No article is linked to this ticket.': {
    es: 'Ningún artículo está vinculado a este ticket.',
    pt: 'Nenhum artigo está vinculado a este chamado.'
  },
  'No article to publish.': { es: 'No hay artículo para publicar.', pt: 'Não há artigo para publicar.' },
  'No articles match that': { es: 'Ningún artículo coincide', pt: 'Nenhum artigo corresponde' },
  'No articles yet': { es: 'Aún no hay artículos', pt: 'Ainda não há artigos' },
  'No boards yet': { es: 'Aún no hay tableros', pt: 'Ainda não há quadros' },
  'No description': { es: 'Sin descripción', pt: 'Sem descrição' },
  'No documents yet': { es: 'Aún no hay documentos', pt: 'Ainda não há documentos' },
  'No due date': { es: 'Sin fecha de vencimiento', pt: 'Sem data de vencimento' },
  'No merged ticket was chosen.': {
    es: 'No se eligió un ticket fusionado.',
    pt: 'Nenhum chamado mesclado foi escolhido.'
  },
  'No note on this task. The title is all anyone else has to go on.': {
    es: 'No hay nota en esta tarea. El título es lo único que tienen los demás.',
    pt: 'Não há nota nesta tarefa. O título é tudo o que as outras pessoas têm.'
  },
  'No owner': { es: 'Sin responsable', pt: 'Sem responsável' },
  'No published article matches that.': {
    es: 'Ningún artículo publicado coincide.',
    pt: 'Nenhum artigo publicado corresponde.'
  },
  'No ratings came back in this window. A survey goes to the ticket\'s contact when it closes, if surveys are switched on in':
    {
      es: 'No llegaron valoraciones en esta ventana. La encuesta se envía al contacto del ticket cuando se cierra, si las encuestas están activadas en la',
      pt: 'Não voltaram avaliações nesta janela. A pesquisa vai para o contato do chamado quando ele fecha, se as pesquisas estiverem ligadas nas'
    },
  'No status to set.': { es: 'No hay estado que asignar.', pt: 'Não há status para definir.' },
  'No status was chosen.': { es: 'No se eligió un estado.', pt: 'Nenhum status foi escolhido.' },
  'No support tickets': { es: 'No hay tickets de soporte', pt: 'Não há chamados de suporte' },
  'No target': { es: 'Sin objetivo', pt: 'Sem alvo' },
  'No tasks fall due in {month}.': {
    es: 'Ninguna tarea vence en {month}.',
    pt: 'Nenhuma tarefa vence em {month}.'
  },
  'No tasks yet': { es: 'Aún no hay tareas', pt: 'Ainda não há tarefas' },
  'No teammates or teams to share with yet. The document will be visible to you and admins.': {
    es: 'Todavía no hay compañeros ni equipos con quienes compartir. El documento será visible para ti y para los administradores.',
    pt: 'Ainda não há colegas nem equipes com quem compartilhar. O documento ficará visível para você e para os administradores.'
  },
  'No ticket you could link this under matches that search.': {
    es: 'Ningún ticket bajo el que pudieras vincular este coincide con esa búsqueda.',
    pt: 'Nenhum chamado sob o qual você poderia vincular este corresponde a essa busca.'
  },
  'No ticket you could merge this into matches that search.': {
    es: 'Ningún ticket en el que pudieras fusionar este coincide con esa búsqueda.',
    pt: 'Nenhum chamado no qual você poderia mesclar este corresponde a essa busca.'
  },
  'No tickets here yet': { es: 'Aún no hay tickets aquí', pt: 'Ainda não há chamados aqui' },
  'No time logged yet.': { es: 'Aún no hay tiempo registrado.', pt: 'Ainda não há tempo lançado.' },
  'No time logged yet. Start the timer, or log a session you have already worked.': {
    es: 'Aún no hay tiempo registrado. Inicia el cronómetro, o registra una sesión que ya trabajaste.',
    pt: 'Ainda não há tempo lançado. Inicie o cronômetro, ou lance uma sessão que você já trabalhou.'
  },
  'nobody assigned': { es: 'nadie asignado', pt: 'ninguém atribuído' },
  'Nobody else can clear these': {
    es: 'Nadie más puede autorizar estas',
    pt: 'Ninguém mais pode liberar estas'
  },
  'Nobody has attached this to a ticket. Either the question has stopped being asked, or the article is hard to find while somebody is typing a reply.':
    {
      es: 'Nadie ha adjuntado esto a un ticket. O la pregunta ya no se hace, o el artículo es difícil de encontrar mientras alguien escribe una respuesta.',
      pt: 'Ninguém anexou isto a um chamado. Ou a pergunta deixou de ser feita, ou o artigo é difícil de achar enquanto alguém escreve uma resposta.'
    },
  'Nobody has replied yet. A reply below is the first response. It is what stops the first-reply clock.':
    {
      es: 'Nadie ha respondido todavía. Una respuesta abajo es la primera. Es lo que detiene el reloj de la primera respuesta.',
      pt: 'Ninguém respondeu ainda. Uma resposta abaixo é a primeira. É o que para o relógio da primeira resposta.'
    },
  'Nobody named on this ticket': { es: 'Nadie nombrado en este ticket', pt: 'Ninguém nomeado neste chamado' },
  'Nobody yet': { es: 'Nadie todavía', pt: 'Ninguém ainda' },
  'none late': { es: 'ninguno con retraso', pt: 'nenhum atrasado' },
  'not attached to a record': { es: 'no vinculado a un registro', pt: 'não vinculado a um registro' },
  'Not billable': { es: 'No facturable', pt: 'Não faturável' },
  'not linked to a ticket yet': {
    es: 'aún no vinculado a un ticket',
    pt: 'ainda não vinculado a um chamado'
  },
  'Not linked to an account, and that cannot be changed after the ticket is raised.': {
    es: 'No vinculado a una cuenta, y eso no se puede cambiar después de abrir el ticket.',
    pt: 'Não vinculado a uma conta, e isso não pode ser alterado depois que o chamado é aberto.'
  },
  'Not linked to another ticket yet.': {
    es: 'Todavía no vinculado a otro ticket.',
    pt: 'Ainda não vinculado a outro chamado.'
  },
  'Not published': { es: 'No publicado', pt: 'Não publicado' },
  'not set': { es: 'sin definir', pt: 'não definido' },
  'Not used yet': { es: 'Aún no se ha usado', pt: 'Ainda não usado' },
  'Not visible yet': { es: 'Aún no visible', pt: 'Ainda não visível' },
  Note: { es: 'Nota', pt: 'Nota' },
  'Note for the approver (optional)': {
    es: 'Nota para quien aprueba (opcional)',
    pt: 'Nota para quem aprova (opcional)'
  },
  'Note for the team…': { es: 'Nota para el equipo…', pt: 'Nota para a equipe…' },
  nothing: { es: 'nada', pt: 'nada' },
  'Nothing has been raised in this workspace. Tickets arrive here from email, the portal, and anyone who replies to a closed one.':
    {
      es: 'No se ha abierto nada en este espacio. Los tickets llegan aquí desde el correo, el portal y quien responde a uno cerrado.',
      pt: 'Nada foi aberto neste espaço. Os chamados chegam aqui pelo e-mail, pelo portal e por quem responde a um fechado.'
    },
  'Nothing has been said on this ticket yet. A reply below is the first response. It is what stops the first-reply clock.':
    {
      es: 'Todavía no se ha dicho nada en este ticket. Una respuesta abajo es la primera. Es lo que detiene el reloj de la primera respuesta.',
      pt: 'Ainda não foi dito nada neste chamado. Uma resposta abaixo é a primeira. É o que para o relógio da primeira resposta.'
    },
  'Nothing here.': { es: 'Nada aquí.', pt: 'Nada aqui.' },
  'Nothing in the knowledge base matches those filters. Clearing them shows everything.': {
    es: 'Nada en la base de conocimiento coincide con esos filtros. Quitarlos muestra todo.',
    pt: 'Nada na base de conhecimento corresponde a esses filtros. Limpá-los mostra tudo.'
  },
  'Nothing is waiting on your team right now. Closed and rejected tickets are still here. They are just not in the way.':
    {
      es: 'Nada está esperando a tu equipo ahora. Los tickets cerrados y rechazados siguen aquí. Solo que no estorban.',
      pt: 'Nada está esperando a sua equipe agora. Chamados fechados e recusados continuam aqui. Só não estão no caminho.'
    },
  'Nothing late': { es: 'Nada con retraso', pt: 'Nada atrasado' },
  'Nothing linked to this ticket is still open, so closing it changes nothing else.': {
    es: 'Nada vinculado a este ticket sigue abierto, así que cerrarlo no cambia nada más.',
    pt: 'Nada vinculado a este chamado continua aberto, então fechá-lo não muda mais nada.'
  },
  'Nothing logged yet': { es: 'Nada registrado todavía', pt: 'Nada lançado ainda' },
  'Nothing logged yet. The first comment you add shows up here.': {
    es: 'Nada registrado todavía. El primer comentario que añadas aparece aquí.',
    pt: 'Nada lançado ainda. O primeiro comentário que você adicionar aparece aqui.'
  },
  'Nothing on your list': { es: 'Nada en tu lista', pt: 'Nada na sua lista' },
  'Nothing scheduled': { es: 'Nada programado', pt: 'Nada agendado' },
  'Nothing to pick. Either there are none, or that list did not load.': {
    es: 'Nada que elegir. O no hay ninguno, o esa lista no cargó.',
    pt: 'Nada para escolher. Ou não há nenhum, ou essa lista não carregou.'
  },
  'Nothing waiting': { es: 'Nada en espera', pt: 'Nada aguardando' },
  'Nothing will bring this back to your attention. Give it a date, or close it if it is not really a task.':
    {
      es: 'Nada va a volver a llamarte la atención. Ponle una fecha, o ciérrala si en realidad no es una tarea.',
      pt: 'Nada vai trazer isto de volta à sua atenção. Dê uma data, ou feche se na verdade não for uma tarefa.'
    },
  'Oldest waiting': { es: 'El que más espera', pt: 'O que espera há mais tempo' },
  'on {name}': { es: 'en {name}', pt: 'em {name}' },
  'One active rule is cleared by managers, but this org has only admins and members. Nobody can clear it. Name approvers on the rule, or set it to admin.':
    {
      es: 'Una regla activa la autorizan los gerentes, pero esta organización solo tiene administradores y miembros. Nadie puede autorizarla. Nombra aprobadores en la regla, o ponla en administrador.',
      pt: 'Uma regra ativa é liberada por gerentes, mas esta organização só tem administradores e membros. Ninguém pode liberá-la. Indique aprovadores na regra, ou defina como administrador.'
    },
  'Only {who} can clear this rule.': {
    es: 'Solo {who} puede autorizar esta regla.',
    pt: 'Só {who} pode liberar esta regra.'
  },
  'Only an admin or whoever created this task can delete it.': {
    es: 'Solo un administrador o quien creó esta tarea puede eliminarla.',
    pt: 'Só um administrador ou quem criou esta tarefa pode excluí-la.'
  },
  'Only the owner and admins.': {
    es: 'Solo el responsable y los administradores.',
    pt: 'Só o responsável e os administradores.'
  },
  'Only the owner or an admin can change this document.': {
    es: 'Solo el responsable o un administrador puede cambiar este documento.',
    pt: 'Só o responsável ou um administrador pode alterar este documento.'
  },
  'Only the owner or an admin can delete this document.': {
    es: 'Solo el responsable o un administrador puede eliminar este documento.',
    pt: 'Só o responsável ou um administrador pode excluir este documento.'
  },
  'Only the uploader and admins': {
    es: 'Solo quien lo subió y los administradores',
    pt: 'Só quem enviou e os administradores'
  },
  'Only you and admins, until you share it.': {
    es: 'Solo tú y los administradores, hasta que lo compartas.',
    pt: 'Só você e os administradores, até você compartilhar.'
  },
  Open: { es: 'Abiertas', pt: 'Abertas' },
  'Open a ticket': { es: 'Abrir un ticket', pt: 'Abrir um chamado' },
  'Open cards': { es: 'Tarjetas abiertas', pt: 'Cartões abertos' },
  'Open now': { es: 'Abiertos ahora', pt: 'Abertos agora' },
  'open only': { es: 'solo abiertos', pt: 'só abertos' },
  'Open that ticket': { es: 'Abrir ese ticket', pt: 'Abrir esse chamado' },
  'Open ticket': { es: 'Ticket abierto', pt: 'Chamado aberto' },
  opened: { es: 'abiertos', pt: 'abertos' },
  Opened: { es: 'Abiertos', pt: 'Abertos' },
  'Opened {age} ago': { es: 'Abierto hace {age}', pt: 'Aberto há {age}' },
  'opened {when}': { es: 'abierto {when}', pt: 'aberto {when}' },
  'Opened and closed volume, response attainment, customer satisfaction and the queue breakdown are whole-organisation figures, so they are limited to admins. Your own tickets are on the':
    {
      es: 'El volumen de abiertos y cerrados, el cumplimiento de las respuestas, la satisfacción del cliente y el desglose de la cola son cifras de toda la organización, así que se limitan a los administradores. Tus propios tickets están en la pestaña',
      pt: 'O volume de abertos e fechados, o cumprimento das respostas, a satisfação do cliente e a divisão da fila são números de toda a organização, então ficam limitados aos administradores. Seus próprios chamados estão na aba'
    },
  'Opened and closed, per day': { es: 'Abiertos y cerrados, por día', pt: 'Abertos e fechados, por dia' },
  'Opening…': { es: 'Abriendo…', pt: 'Abrindo…' },
  'Optional, and more than one is allowed. Leave it empty and the task is yours to pick up.': {
    es: 'Opcional, y se permite más de uno. Déjalo vacío y la tarea queda para que la tomes tú.',
    pt: 'Opcional, e mais de um é permitido. Deixe vazio e a tarefa fica para você assumir.'
  },
  'Optional. Hold ctrl or cmd to pick more than one.': {
    es: 'Opcional. Mantén ctrl o cmd para elegir más de uno.',
    pt: 'Opcional. Segure ctrl ou cmd para escolher mais de um.'
  },
  'Optional. Left empty, a close is dated today in your organization\'s timezone.': {
    es: 'Opcional. Si se deja vacío, el cierre se fecha hoy en la zona horaria de tu organización.',
    pt: 'Opcional. Se ficar vazio, o fechamento fica datado hoje no fuso horário da sua organização.'
  },
  'organisation settings': {
    es: 'configuración de la organización',
    pt: 'configurações da organização'
  },
  overdue: { es: 'vencida', pt: 'vencida' },
  'Owner or admin only': {
    es: 'Solo el responsable o un administrador',
    pt: 'Só o responsável ou um administrador'
  },
  Parent: { es: 'Padre', pt: 'Pai' },
  'Past due and not marked done': {
    es: 'Vencida y no marcada como hecha',
    pt: 'Vencida e não marcada como concluída'
  },
  'Past its first-reply target and still unanswered. A reply below is the first response. It stops the clock.':
    {
      es: 'Pasó el objetivo de primera respuesta y sigue sin respuesta. Una respuesta abajo es la primera. Detiene el reloj.',
      pt: 'Passou do alvo de primeira resposta e continua sem resposta. Uma resposta abaixo é a primeira. Ela para o relógio.'
    },
  'Paused while pending': { es: 'En pausa mientras está pendiente', pt: 'Em pausa enquanto pendente' },
  'PDFs, sheets, docs. Whatever you send people often.': {
    es: 'PDF, hojas, documentos. Lo que sueles enviar.',
    pt: 'PDFs, planilhas, documentos. O que você costuma enviar.'
  },
  'pending across the org': {
    es: 'pendientes en la organización',
    pt: 'pendentes na organização'
  },
  'Pending in the org': { es: 'Pendientes en la organización', pt: 'Pendentes na organização' },
  'People affected': { es: 'Personas afectadas', pt: 'Pessoas afetadas' },
  'people and teams': { es: 'personas y equipos', pt: 'pessoas e equipes' },
  'people are on this ticket. Changing this replaces all of them.': {
    es: 'personas están en este ticket. Cambiar esto reemplaza a todas.',
    pt: 'pessoas estão neste chamado. Mudar isto substitui todas.'
  },
  'person or team': { es: 'persona o equipo', pt: 'pessoa ou equipe' },
  'Pick a saved reply first.': {
    es: 'Elige primero una respuesta guardada.',
    pt: 'Escolha primeiro uma resposta salva.'
  },
  'Pick a ticket to link this one under.': {
    es: 'Elige un ticket bajo el cual vincular este.',
    pt: 'Escolha um chamado sob o qual vincular este.'
  },
  'Pick a ticket to merge into.': {
    es: 'Elige un ticket en el cual fusionar.',
    pt: 'Escolha um chamado no qual mesclar.'
  },
  'Pick which record this is attached to, or set "Attached to" back to Nothing.': {
    es: 'Elige a qué registro está vinculado, o vuelve a poner "Vinculado a" en Nada.',
    pt: 'Escolha a qual registro isto está vinculado, ou volte "Vinculado a" para Nada.'
  },
  'Please do not paste screenshots containing an invoice link, an API token or a survey URL. Each of those is a working credential for whoever ends up holding it.':
    {
      es: 'No pegues capturas que contengan un enlace de factura, un token de API o una URL de encuesta. Cada uno es una credencial válida para quien termine teniéndola.',
      pt: 'Não cole capturas que contenham um link de fatura, um token de API ou uma URL de pesquisa. Cada um é uma credencial válida para quem acabar com ela.'
    },
  'plus admins.': { es: 'más los administradores.', pt: 'mais os administradores.' },
  'Previous month': { es: 'Mes anterior', pt: 'Mês anterior' },
  Publish: { es: 'Publicar', pt: 'Publicar' },
  'Published articles are offered on the ticket screen while somebody is typing a reply. An article nobody has linked to a ticket is usually one that answers a question nobody asked.':
    {
      es: 'Los artículos publicados se ofrecen en la pantalla del ticket mientras alguien escribe una respuesta. Un artículo que nadie ha vinculado a un ticket suele responder una pregunta que nadie hizo.',
      pt: 'Artigos publicados são oferecidos na tela do chamado enquanto alguém escreve uma resposta. Um artigo que ninguém vinculou a um chamado em geral responde uma pergunta que ninguém fez.'
    },
  'Published means customers can read it. Approving it is a separate step': {
    es: 'Publicado significa que los clientes pueden leerlo. Aprobarlo es un paso aparte',
    pt: 'Publicado significa que os clientes podem ler. Aprovar é um passo separado'
  },
  'Raise ticket': { es: 'Abrir ticket', pt: 'Abrir chamado' },
  'Rate per hour': { es: 'Tarifa por hora', pt: 'Taxa por hora' },
  rating: { es: 'valoración', pt: 'avaliação' },
  ratings: { es: 'valoraciones', pt: 'avaliações' },
  Reaches: { es: 'Llega a', pt: 'Alcança' },
  'Ready to go live': { es: 'Listo para publicarse', pt: 'Pronto para publicar' },
  Reason: { es: 'Motivo', pt: 'Motivo' },
  'Reason (required)': { es: 'Motivo (obligatorio)', pt: 'Motivo (obrigatório)' },
  'Reason:': { es: 'Motivo:', pt: 'Motivo:' },
  'Recently decided': { es: 'Decididos hace poco', pt: 'Decididos há pouco' },
  'Recorded against every ticket closed with this one': {
    es: 'Queda registrado en cada ticket cerrado con este',
    pt: 'Fica registrado em cada chamado fechado com este'
  },
  Reject: { es: 'Rechazar', pt: 'Recusar' },
  'Reject request': { es: 'Rechazar solicitud', pt: 'Recusar solicitação' },
  Reopen: { es: 'Reabrir', pt: 'Reabrir' },
  'Reopen {title}': { es: 'Reabrir {title}', pt: 'Reabrir {title}' },
  'Reopen task': { es: 'Reabrir tarea', pt: 'Reabrir tarefa' },
  'Replacing with: {name}': { es: 'Se reemplaza por: {name}', pt: 'Substituindo por: {name}' },
  Reply: { es: 'Respuesta', pt: 'Resposta' },
  'Reply posted, but {detail}': { es: 'Respuesta enviada, pero {detail}', pt: 'Resposta enviada, mas {detail}' },
  'Reported by {name}': { es: 'Reportado por {name}', pt: 'Relatado por {name}' },
  'Request again': { es: 'Solicitar de nuevo', pt: 'Solicitar de novo' },
  'Request approval': { es: 'Solicitar aprobación', pt: 'Solicitar aprovação' },
  'requested by {name}': { es: 'solicitado por {name}', pt: 'solicitado por {name}' },
  'Requested by {name} · {age} ago': {
    es: 'Solicitado por {name} · hace {age}',
    pt: 'Solicitado por {name} · há {age}'
  },
  'Resolve by': { es: 'Resolver antes de', pt: 'Resolver até' },
  Resolved: { es: 'Resuelto', pt: 'Resolvido' },
  'Review and visibility': { es: 'Revisión y visibilidad', pt: 'Revisão e visibilidade' },
  'Review status': { es: 'Estado de revisión', pt: 'Status da revisão' },
  'Rule: {name}': { es: 'Regla: {name}', pt: 'Regra: {name}' },
  'Rules that gate a close': { es: 'Reglas que frenan un cierre', pt: 'Regras que bloqueiam um fechamento' },
  Running: { es: 'En curso', pt: 'Em andamento' },
  'Save article': { es: 'Guardar artículo', pt: 'Salvar artigo' },
  'Save ticket': { es: 'Guardar ticket', pt: 'Salvar chamado' },
  'Saved reply': { es: 'Respuesta guardada', pt: 'Resposta salva' },
  'Say the symptom the way a customer would report it, not the fix.': {
    es: 'Di el síntoma como lo reportaría un cliente, no la corrección.',
    pt: 'Diga o sintoma como um cliente relataria, não a correção.'
  },
  scheduled: { es: 'programadas', pt: 'agendadas' },
  'Search by subject': { es: 'Buscar por asunto', pt: 'Buscar por assunto' },
  'Search tickets to link under': {
    es: 'Buscar tickets para vincular debajo',
    pt: 'Buscar chamados para vincular abaixo'
  },
  'Search tickets to merge into': {
    es: 'Buscar tickets para fusionar',
    pt: 'Buscar chamados para mesclar'
  },
  'see the task list': { es: 'mira la lista de tareas', pt: 'veja a lista de tarefas' },
  'Select all loaded': { es: 'Seleccionar todos los cargados', pt: 'Selecionar todos os carregados' },
  'Select at least one ticket.': {
    es: 'Selecciona al menos un ticket.',
    pt: 'Selecione pelo menos um chamado.'
  },
  'Select ticket': { es: 'Seleccionar ticket', pt: 'Selecionar chamado' },
  'Selected: {name}': { es: 'Seleccionado: {name}', pt: 'Selecionado: {name}' },
  'Send for review': { es: 'Enviar a revisión', pt: 'Enviar para revisão' },
  'Send the security addendum to Northwind': {
    es: 'Enviar el anexo de seguridad a Northwind',
    pt: 'Enviar o adendo de segurança para a Northwind'
  },
  'Service analytics': { es: 'Analítica de servicio', pt: 'Análise de atendimento' },
  'Service health': { es: 'Salud del servicio', pt: 'Saúde do atendimento' },
  'Set to pending': { es: 'Pasar a pendiente', pt: 'Definir como pendente' },
  'Set up a calendar': { es: 'Configurar un calendario', pt: 'Configurar um calendário' },
  'Sets the first-reply target.': {
    es: 'Define el objetivo de la primera respuesta.',
    pt: 'Define o alvo da primeira resposta.'
  },
  'Show closed too': { es: 'Mostrar también cerrados', pt: 'Mostrar fechados também' },
  'Show completed': { es: 'Mostrar completadas', pt: 'Mostrar concluídas' },
  'Showing the first': { es: 'Mostrando los primeros', pt: 'Mostrando os primeiros' },
  'Shrank by {n} over the window': { es: 'Bajó {n} en la ventana', pt: 'Caiu {n} na janela' },
  'Sign in to download this attachment': {
    es: 'Inicia sesión para descargar este adjunto',
    pt: 'Entre para baixar este anexo'
  },
  Size: { es: 'Tamaño', pt: 'Tamanho' },
  SLA: { es: 'SLA', pt: 'SLA' },
  'SLA at risk': { es: 'SLA en riesgo', pt: 'SLA em risco' },
  someone: { es: 'alguien', pt: 'alguém' },
  Someone: { es: 'Alguien', pt: 'Alguém' },
  'Someone has read this. Approving it is what lets it be published.': {
    es: 'Alguien ya leyó esto. Aprobarlo es lo que permite publicarlo.',
    pt: 'Alguém já leu isto. Aprovar é o que permite publicar.'
  },
  stage: { es: 'etapa', pt: 'etapa' },
  'Start here': { es: 'Empieza aquí', pt: 'Comece aqui' },
  'Start timer': { es: 'Iniciar cronómetro', pt: 'Iniciar cronômetro' },
  status: { es: 'estado', pt: 'status' },
  'Status on send': { es: 'Estado al enviar', pt: 'Status ao enviar' },
  'Status set by the macro': { es: 'Estado que define la macro', pt: 'Status definido pela macro' },
  Stop: { es: 'Detener', pt: 'Parar' },
  'Stop {time}': { es: 'Detener {time}', pt: 'Parar {time}' },
  'Stopped automatically after running overnight': {
    es: 'Se detuvo solo después de quedar en marcha toda la noche',
    pt: 'Parou sozinho depois de ficar rodando a noite toda'
  },
  Subject: { es: 'Asunto', pt: 'Assunto' },
  'Subjects are capped at 64 characters (this is {n}).': {
    es: 'Los asuntos tienen un máximo de 64 caracteres (este tiene {n}).',
    pt: 'Os assuntos têm no máximo 64 caracteres (este tem {n}).'
  },
  'Suggested for this ticket': { es: 'Sugerido para este ticket', pt: 'Sugerido para este chamado' },
  'Support agent assigned': { es: 'Agente de soporte asignado', pt: 'Agente de suporte atribuído' },
  'tab.': { es: '.', pt: '.' },
  tag: { es: 'etiqueta', pt: 'etiqueta' },
  tags: { es: 'etiquetas', pt: 'etiquetas' },
  'target {time}': { es: 'objetivo {time}', pt: 'alvo {time}' },
  Task: { es: 'Tarea', pt: 'Tarefa' },
  'task list': { es: 'lista de tareas', pt: 'lista de tarefas' },
  tasks: { es: 'tareas', pt: 'tarefas' },
  'Tasks show up here when you add one, or when a deal, ticket or lead needs a follow-up scheduled.': {
    es: 'Las tareas aparecen aquí cuando añades una, o cuando un negocio, un ticket o un prospecto necesita un seguimiento programado.',
    pt: 'As tarefas aparecem aqui quando você adiciona uma, ou quando um negócio, um chamado ou um lead precisa de um acompanhamento agendado.'
  },
  'Tasks without a due date don\'t appear here,': {
    es: 'Las tareas sin fecha de vencimiento no aparecen aquí,',
    pt: 'As tarefas sem data de vencimento não aparecem aqui,'
  },
  team: { es: 'equipo', pt: 'equipe' },
  teams: { es: 'equipos', pt: 'equipes' },
  'Tell us what happened and what you expected instead': {
    es: 'Cuéntanos qué pasó y qué esperabas en su lugar',
    pt: 'Conte o que aconteceu e o que você esperava no lugar'
  },
  'That did not save. Try again.': {
    es: 'Eso no se guardó. Inténtalo de nuevo.',
    pt: 'Isso não foi salvo. Tente de novo.'
  },
  'That document does not exist, or it belongs to another org.': {
    es: 'Ese documento no existe, o pertenece a otra organización.',
    pt: 'Esse documento não existe, ou pertence a outra organização.'
  },
  'That task is not yours to change.': {
    es: 'Esa tarea no te corresponde cambiarla.',
    pt: 'Essa tarefa não é sua para alterar.'
  },
  'The approval requests could not be loaded. Nothing else on this ticket is affected.': {
    es: 'No se pudieron cargar las solicitudes de aprobación. Nada más de este ticket se ve afectado.',
    pt: 'Não foi possível carregar as solicitações de aprovação. Nada mais neste chamado é afetado.'
  },
  'The articles could not be loaded.': {
    es: 'No se pudieron cargar los artículos.',
    pt: 'Não foi possível carregar os artigos.'
  },
  'The exact wording of any error. "It didn\'t work" and "Something went wrong" are the same message to us.':
    {
      es: 'El texto exacto de cualquier error. "No funcionó" y "Algo salió mal" son el mismo mensaje para nosotros.',
      pt: 'O texto exato de qualquer erro. "Não funcionou" e "Algo deu errado" são a mesma mensagem para nós.'
    },
  'the macro\'s actions were not applied: {reason}': {
    es: 'no se aplicaron las acciones de la macro: {reason}',
    pt: 'as ações da macro não foram aplicadas: {reason}'
  },
  'The ones that repeat belong in the knowledge base.': {
    es: 'Las que se repiten pertenecen a la base de conocimiento.',
    pt: 'As que se repetem pertencem à base de conhecimento.'
  },
  'The people and teams list did not load, so sharing cannot be changed right now. Saving keeps everyone this document is shared with.':
    {
      es: 'La lista de personas y equipos no cargó, así que ahora no se puede cambiar con quién se comparte. Al guardar se conserva con quién está compartido este documento.',
      pt: 'A lista de pessoas e equipes não carregou, então o compartilhamento não pode ser alterado agora. Salvar mantém com quem este documento está compartilhado.'
    },
  'The queue is clear': { es: 'La cola está limpia', pt: 'A fila está limpa' },
  'the server gave no reason.': {
    es: 'el servidor no dio un motivo.',
    pt: 'o servidor não deu um motivo.'
  },
  'The server refused this ticket': {
    es: 'El servidor rechazó este ticket',
    pt: 'O servidor recusou este chamado'
  },
  'The server refused this upload': {
    es: 'El servidor rechazó esta subida',
    pt: 'O servidor recusou este envio'
  },
  'the status stayed put: {reason}': {
    es: 'el estado no cambió: {reason}',
    pt: 'o status não mudou: {reason}'
  },
  'The thing you were trying to do, in one sentence.': {
    es: 'Lo que intentabas hacer, en una frase.',
    pt: 'O que você estava tentando fazer, em uma frase.'
  },
  'The time entries could not be loaded. Nothing else on this ticket is affected.': {
    es: 'No se pudieron cargar los registros de tiempo. Nada más de este ticket se ve afectado.',
    pt: 'Não foi possível carregar os lançamentos de tempo. Nada mais neste chamado é afetado.'
  },
  'The wait after a customer writes back, once the first reply has gone. Counted around the clock, against each priority\'s':
    {
      es: 'La espera después de que el cliente vuelve a escribir, una vez enviada la primera respuesta. Se cuenta de corrido, según el',
      pt: 'A espera depois que o cliente escreve de novo, uma vez enviada a primeira resposta. Contada o tempo todo, contra o'
    },
  'There is no ticket you could link this under.': {
    es: 'No hay ningún ticket bajo el cual pudieras vincular este.',
    pt: 'Não há nenhum chamado sob o qual você poderia vincular este.'
  },
  'There is no ticket you could merge this into.': {
    es: 'No hay ningún ticket en el cual pudieras fusionar este.',
    pt: 'Não há nenhum chamado no qual você poderia mesclar este.'
  },
  'There is nowhere on it to move a ticket. An admin can add stages to the pipeline, or you can go back to the board by status.':
    {
      es: 'No hay a dónde mover un ticket. Un administrador puede añadir etapas al embudo, o puedes volver al tablero por estado.',
      pt: 'Não há para onde mover um chamado. Um administrador pode adicionar etapas ao funil, ou você pode voltar ao quadro por status.'
    },
  'These are two separate facts about the article and this form keeps them separate.': {
    es: 'Son dos datos distintos del artículo y este formulario los mantiene separados.',
    pt: 'São dois fatos distintos sobre o artigo e este formulário os mantém separados.'
  },
  'These figures count elapsed time around the clock, evenings and weekends included. Each ticket\'s own SLA deadline is counted inside {name}, so a reply on time there can show as late here.':
    {
      es: 'Estas cifras cuentan el tiempo de corrido, noches y fines de semana incluidos. El plazo de SLA de cada ticket se cuenta dentro de {name}, así que una respuesta a tiempo allí puede verse tarde aquí.',
      pt: 'Estes números contam o tempo corrido, noites e fins de semana incluídos. O prazo de SLA de cada chamado é contado dentro de {name}, então uma resposta no prazo lá pode aparecer atrasada aqui.'
    },
  'These never come up on their own': {
    es: 'Estas nunca aparecen solas',
    pt: 'Estas nunca aparecem sozinhas'
  },
  'These numbers cover every article, not just the ones shown.': {
    es: 'Estos números cubren todos los artículos, no solo los que se muestran.',
    pt: 'Estes números cobrem todos os artigos, não só os que aparecem.'
  },
  'These numbers describe the filtered queue.': {
    es: 'Estos números describen la cola filtrada.',
    pt: 'Estes números descrevem a fila filtrada.'
  },
  'This article is published, so anything saved here is what customers read in the portal and what agents are offered on tickets.':
    {
      es: 'Este artículo está publicado, así que lo que guardes aquí es lo que leen los clientes en el portal y lo que se ofrece a los agentes en los tickets.',
      pt: 'Este artigo está publicado, então o que você salvar aqui é o que os clientes leem no portal e o que é oferecido aos agentes nos chamados.'
    },
  'This dashboard is for administrators.': {
    es: 'Este panel es para administradores.',
    pt: 'Este painel é para administradores.'
  },
  'This deployment has no ConNexus-CRM support queue. The help page lists the ways to reach us.': {
    es: 'Esta instalación no tiene una cola de soporte de ConNexus-CRM. La página de ayuda lista las formas de contactarnos.',
    pt: 'Esta instalação não tem uma fila de suporte do ConNexus-CRM. A página de ajuda lista as formas de falar conosco.'
  },
  'This is a draft. Send it for review when the answer is right: somebody other than you has to approve it before it can be published.':
    {
      es: 'Esto es un borrador. Envíalo a revisión cuando la respuesta esté bien: alguien que no seas tú tiene que aprobarlo antes de que se pueda publicar.',
      pt: 'Isto é um rascunho. Envie para revisão quando a resposta estiver certa: alguém que não seja você precisa aprovar antes que possa ser publicado.'
    },
  'This is pasted into replies as-is, so write it to be read by the person with the problem.': {
    es: 'Esto se pega en las respuestas tal cual, así que escríbelo para quien tiene el problema.',
    pt: 'Isto é colado nas respostas como está, então escreva para a pessoa que tem o problema.'
  },
  'This is pasted into replies as-is.': {
    es: 'Esto se pega en las respuestas tal cual.',
    pt: 'Isto é colado nas respostas como está.'
  },
  'This month has more scheduled tasks than fit on the calendar; the list shows them all.': {
    es: 'Este mes tiene más tareas programadas de las que caben en el calendario; la lista las muestra todas.',
    pt: 'Este mês tem mais tarefas agendadas do que cabem no calendário; a lista mostra todas.'
  },
  'This pipeline has no stages yet': {
    es: 'Este embudo todavía no tiene etapas',
    pt: 'Este funil ainda não tem etapas'
  },
  'This rule is cleared by {role}s, and you are not one.': {
    es: 'Esta regla la autoriza el rol {role}, y tú no lo tienes.',
    pt: 'Esta regra é liberada pelo papel {role}, e você não tem esse papel.'
  },
  'This ticket is closed. Open a new ticket if you still need help.': {
    es: 'Este ticket está cerrado. Abre uno nuevo si todavía necesitas ayuda.',
    pt: 'Este chamado está fechado. Abra um novo se você ainda precisar de ajuda.'
  },
  'This ticket will no longer sit under {parent}. Neither ticket is otherwise changed.': {
    es: 'Este ticket ya no quedará bajo {parent}. Ninguno de los dos tickets cambia en nada más.',
    pt: 'Este chamado não ficará mais sob {parent}. Nenhum dos dois chamados muda em mais nada.'
  },
  'This was due {date}. Finish it or move the date. Leaving it late does neither.': {
    es: 'Esto vencía el {date}. Termínala o mueve la fecha. Dejarla tarde no hace ninguna de las dos.',
    pt: 'Isto vencia em {date}. Termine ou mude a data. Deixar atrasada não faz nenhum dos dois.'
  },
  'This will be refused: an article has to be approved before it can be published. Set the status to Approved, or leave it internal for now.':
    {
      es: 'Esto se va a rechazar: un artículo tiene que estar aprobado antes de publicarse. Pon el estado en Aprobado, o déjalo interno por ahora.',
      pt: 'Isto será recusado: um artigo precisa estar aprovado antes de ser publicado. Defina o status como Aprovado, ou deixe interno por agora.'
    },
  Ticket: { es: 'Ticket', pt: 'Chamado' },
  'Ticket closed, and {n} linked ticket with it.': {
    es: 'Ticket cerrado, y {n} ticket vinculado con él.',
    pt: 'Chamado fechado, e {n} chamado vinculado junto.'
  },
  'Ticket closed, and {n} linked tickets with it.': {
    es: 'Ticket cerrado, y {n} tickets vinculados con él.',
    pt: 'Chamado fechado, e {n} chamados vinculados junto.'
  },
  'Ticket closed.': { es: 'Ticket cerrado.', pt: 'Chamado fechado.' },
  'Ticket closed. Nothing linked was open, so nothing else changed.': {
    es: 'Ticket cerrado. Nada vinculado estaba abierto, así que no cambió nada más.',
    pt: 'Chamado fechado. Nada vinculado estava aberto, então nada mais mudou.'
  },
  'Ticket tree': { es: 'Árbol de tickets', pt: 'Árvore de chamados' },
  tickets: { es: 'tickets', pt: 'chamados' },
  'Tickets board': { es: 'Tablero de tickets', pt: 'Quadro de chamados' },
  'tickets by status': { es: 'tickets por estado', pt: 'chamados por status' },
  'Tickets solved': { es: 'Tickets resueltos', pt: 'Chamados resolvidos' },
  Time: { es: 'Tiempo', pt: 'Tempo' },
  'Traced the failed import to the CSV encoding': {
    es: 'La importación fallida se debió a la codificación del CSV',
    pt: 'A importação que falhou foi pela codificação do CSV'
  },
  'Unassigned tickets still count against the clock.': {
    es: 'Los tickets sin asignar siguen contando en el reloj.',
    pt: 'Chamados sem responsável ainda contam no relógio.'
  },
  Unchanged: { es: 'Sin cambios', pt: 'Sem alteração' },
  'Unknown author': { es: 'Autor desconocido', pt: 'Autor desconhecido' },
  'Unknown browser': { es: 'Navegador desconocido', pt: 'Navegador desconhecido' },
  Unlink: { es: 'Desvincular', pt: 'Desvincular' },
  'Unlink {title}': { es: 'Desvincular {title}', pt: 'Desvincular {title}' },
  Unmerge: { es: 'Deshacer fusión', pt: 'Desfazer mesclagem' },
  'Unmerged "{name}".': { es: 'Se deshizo la fusión de "{name}".', pt: 'Mesclagem de "{name}" desfeita.' },
  'Unmerged.': { es: 'Fusión deshecha.', pt: 'Mesclagem desfeita.' },
  Unpublish: { es: 'Despublicar', pt: 'Despublicar' },
  Unwatch: { es: 'Dejar de seguir', pt: 'Deixar de acompanhar' },
  'Up to 25 MB. Remove secrets and personal data before uploading.': {
    es: 'Hasta 25 MB. Quita secretos y datos personales antes de subir.',
    pt: 'Até 25 MB. Remova segredos e dados pessoais antes de enviar.'
  },
  Upload: { es: 'Subir', pt: 'Enviar' },
  'Upload a document': { es: 'Subir un documento', pt: 'Enviar um documento' },
  'Uploaded by': { es: 'Subido por', pt: 'Enviado por' },
  urgent: { es: 'urgentes', pt: 'urgentes' },
  'used on': { es: 'usado en', pt: 'usado em' },
  'Used on': { es: 'Usado en', pt: 'Usado em' },
  waiting: { es: 'en espera', pt: 'aguardando' },
  'Waiting for assignment': { es: 'Esperando asignación', pt: 'Aguardando atribuição' },
  'Waiting on an admin': { es: 'Esperando a un administrador', pt: 'Aguardando um administrador' },
  'Waiting on an admin to approve it. Until then it stays internal.': {
    es: 'Esperando a que un administrador lo apruebe. Hasta entonces sigue interno.',
    pt: 'Aguardando um administrador aprovar. Até lá continua interno.'
  },
  'Waiting on the customer: the first-reply clock is paused while it sits in Pending.': {
    es: 'Esperando al cliente: el reloj de la primera respuesta está en pausa mientras está en Pendiente.',
    pt: 'Aguardando o cliente: o relógio da primeira resposta fica em pausa enquanto está em Pendente.'
  },
  'waiting on you': { es: 'esperándote', pt: 'aguardando você' },
  'Waiting on you': { es: 'Esperándote', pt: 'Aguardando você' },
  Watch: { es: 'Seguir', pt: 'Acompanhar' },
  'What customers answered in the survey sent when their ticket closed, on a scale of 1 to 5.': {
    es: 'Lo que respondieron los clientes en la encuesta enviada al cerrar su ticket, en una escala del 1 al 5.',
    pt: 'O que os clientes responderam na pesquisa enviada quando o chamado fechou, numa escala de 1 a 5.'
  },
  'What happened': { es: 'Qué pasó', pt: 'O que aconteceu' },
  'What happened instead': { es: 'Qué pasó en su lugar', pt: 'O que aconteceu no lugar' },
  'What happened, how urgent it is, and who it is for.': {
    es: 'Qué pasó, qué tan urgente es y para quién es.',
    pt: 'O que aconteceu, o quanto é urgente e para quem é.'
  },
  'What happened? Anyone on this task will see it.': {
    es: '¿Qué pasó? Quien esté en esta tarea lo verá.',
    pt: 'O que aconteceu? Quem estiver nesta tarefa vai ver.'
  },
  'What is happening, why, and the steps that resolve it.': {
    es: 'Qué está pasando, por qué y los pasos que lo resuelven.',
    pt: 'O que está acontecendo, por quê e os passos que resolvem.'
  },
  'What the queue is made of': { es: 'De qué está hecha la cola', pt: 'Do que a fila é feita' },
  'What to include when you write': { es: 'Qué incluir cuando escribas', pt: 'O que incluir quando escrever' },
  'What was done': { es: 'Qué se hizo', pt: 'O que foi feito' },
  'What was reported': { es: 'Qué se reportó', pt: 'O que foi relatado' },
  'What you expected': { es: 'Qué esperabas', pt: 'O que você esperava' },
  'What you would call it out loud. It has to be unique here.': {
    es: 'Cómo lo dirías en voz alta. Tiene que ser único aquí.',
    pt: 'Como você diria em voz alta. Precisa ser único aqui.'
  },
  'When you need help with ConNexus-CRM, open a ticket here. Replies and status changes stay attached to it.':
    {
      es: 'Cuando necesites ayuda con ConNexus-CRM, abre un ticket aquí. Las respuestas y los cambios de estado quedan en él.',
      pt: 'Quando você precisar de ajuda com o ConNexus-CRM, abra um chamado aqui. As respostas e as mudanças de status ficam nele.'
    },
  'Which approval? None was given.': {
    es: '¿Qué aprobación? No se indicó ninguna.',
    pt: 'Qual aprovação? Nenhuma foi indicada.'
  },
  'Which article? None was given.': {
    es: '¿Qué artículo? No se indicó ninguno.',
    pt: 'Qual artigo? Nenhum foi indicado.'
  },
  'Which board?': { es: '¿Qué tablero?', pt: 'Qual quadro?' },
  'Which column?': { es: '¿Qué columna?', pt: 'Qual coluna?' },
  'Which one': { es: 'Cuál', pt: 'Qual' },
  'Which task?': { es: '¿Qué tarea?', pt: 'Qual tarefa?' },
  Who: { es: 'Quién', pt: 'Quem' },
  'Who can open it': { es: 'Quién puede abrirlo', pt: 'Quem pode abrir' },
  'Who is carrying it': { es: 'Quién lo lleva', pt: 'Quem está com ele' },
  'Why (optional)': { es: 'Por qué (opcional)', pt: 'Por quê (opcional)' },
  'Window size': { es: 'Tamaño de la ventana', pt: 'Tamanho da janela' },
  'with no reply yet': { es: 'sin respuesta aún', pt: 'sem resposta ainda' },
  Withdraw: { es: 'Retirar', pt: 'Retirar' },
  'Withdraw request': { es: 'Retirar solicitud', pt: 'Retirar solicitação' },
  'Withdrawn by {name}': { es: 'Retirada por {name}', pt: 'Retirada por {name}' },
  'Write a comment or attach a file first.': {
    es: 'Escribe un comentario o adjunta un archivo primero.',
    pt: 'Escreva um comentário ou anexe um arquivo primeiro.'
  },
  'Write a reply or attach a file before sending.': {
    es: 'Escribe una respuesta o adjunta un archivo antes de enviar.',
    pt: 'Escreva uma resposta ou anexe um arquivo antes de enviar.'
  },
  'Write a reply…': { es: 'Escribe una respuesta…', pt: 'Escreva uma resposta…' },
  'Write something or attach a file before sending.': {
    es: 'Escribe algo o adjunta un archivo antes de enviar.',
    pt: 'Escreva algo ou anexe um arquivo antes de enviar.'
  },
  'Write the answer once, attach it to every ticket that asks': {
    es: 'Escribe la respuesta una vez y adjúntala a cada ticket que pregunte',
    pt: 'Escreva a resposta uma vez e anexe a cada chamado que perguntar'
  },
  'Write the answer once, link it from the tickets that ask for it, and stop retyping it. The first one usually comes straight out of a ticket you just resolved.':
    {
      es: 'Escribe la respuesta una vez, vincúlala desde los tickets que la piden y deja de reescribirla. La primera suele salir directo de un ticket que acabas de resolver.',
      pt: 'Escreva a resposta uma vez, vincule a partir dos chamados que pedem por ela e pare de redigitar. A primeira em geral sai direto de um chamado que você acabou de resolver.'
    },
  Written: { es: 'Escrito', pt: 'Escrito' },
  'You asked for this, so another approver must decide it.': {
    es: 'Tú pediste esto, así que otro aprobador tiene que decidirlo.',
    pt: 'Você pediu isto, então outro aprovador precisa decidir.'
  },
  'You can read this ticket but not reply to it. Ask an admin, or whoever it is assigned to.': {
    es: 'Puedes leer este ticket, pero no responder. Pídeselo a un administrador o a quien esté asignado.',
    pt: 'Você pode ler este chamado, mas não responder. Peça a um administrador ou a quem estiver atribuído.'
  },
  'You do not have permission to upload here.': {
    es: 'No tienes permiso para subir aquí.',
    pt: 'Você não tem permissão para enviar aqui.'
  },
  'You raised this request, so you cannot decide it yourself. Another approver must. Withdraw it if it is no longer needed.':
    {
      es: 'Tú abriste esta solicitud, así que no puedes decidirla. Tiene que hacerlo otro aprobador. Retírala si ya no hace falta.',
      pt: 'Você abriu esta solicitação, então não pode decidir. Outro aprovador precisa decidir. Retire se não for mais necessária.'
    },
  'Your reply was sent.': { es: 'Tu respuesta se envió.', pt: 'Sua resposta foi enviada.' },
  'Your support tickets': { es: 'Tus tickets de soporte', pt: 'Seus chamados de suporte' }
};

addMessages(messages);
