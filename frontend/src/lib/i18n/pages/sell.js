import { addMessages } from '../translate.js';

/**
 * Sales screens: Today, accounts, contacts, leads, pipeline, goals, team.
 * English is the key. Spanish is neutral Latin American `tú`. Portuguese is Brazilian `você`.
 *
 * @type {Record<string, { es: string, pt: string }>}
 */
export const messages = {
  ', you': { es: ', tú', pt: ', você' },
  '. Type, probability, source, owner, notes': {
    es: '. Tipo, probabilidad, origen, responsable, notas',
    pt: '. Tipo, probabilidade, origem, responsável, notas'
  },
  '“{name}” has been updated.': {
    es: 'Se actualizó “{name}”.',
    pt: '“{name}” foi atualizado.'
  },
  '{done} of {target}': { es: '{done} de {target}', pt: '{done} de {target}' },
  '{invoice} is past due, {amount}.': {
    es: '{invoice} está vencida, {amount}.',
    pt: '{invoice} está vencida, {amount}.'
  },
  '{label} is required.': { es: '{label} es obligatorio.', pt: '{label} é obrigatório.' },
  '{n} deal': { es: '{n} negocio', pt: '{n} negócio' },
  '{n} deal won': { es: '{n} negocio ganado', pt: '{n} negócio ganho' },
  '{n} deals': { es: '{n} negocios', pt: '{n} negócios' },
  '{n} deals won': { es: '{n} negocios ganados', pt: '{n} negócios ganhos' },
  '{n} deals worth {amount} have gone quiet.': {
    es: '{n} negocios por {amount} se han quedado en silencio.',
    pt: '{n} negócios no valor de {amount} ficaram em silêncio.'
  },
  '{n} fields still need you': {
    es: '{n} campos todavía te necesitan',
    pt: '{n} campos ainda precisam de você'
  },
  '{n} open': { es: '{n} abiertos', pt: '{n} abertos' },
  '{n} open deal': { es: '{n} negocio abierto', pt: '{n} negócio aberto' },
  '{n} open deals': { es: '{n} negocios abiertos', pt: '{n} negócios abertos' },
  '{n} other account link': {
    es: '{n} otro vínculo de cuenta',
    pt: '{n} outro vínculo de conta'
  },
  '{n} other account links': {
    es: '{n} otros vínculos de cuenta',
    pt: '{n} outros vínculos de conta'
  },
  '{n} overdue': { es: '{n} vencidas', pt: '{n} vencidas' },
  '{n} owners': { es: '{n} responsables', pt: '{n} responsáveis' },
  '{n} people are on this account. This select shows the first; changing it replaces all of them, and leaving it alone keeps them.':
    {
      es: 'Hay {n} personas en esta cuenta. Este selector muestra la primera; si lo cambias, reemplaza a todas, y si lo dejas igual, se quedan.',
      pt: 'Há {n} pessoas nesta conta. Este seletor mostra a primeira; se você mudar, substitui todas, e se deixar como está, elas continuam.'
    },
  '{n} people are on this contact. This select shows the first; changing it replaces all of them, and leaving it alone keeps them.':
    {
      es: 'Hay {n} personas en este contacto. Este selector muestra la primera; si lo cambias, reemplaza a todas, y si lo dejas igual, se quedan.',
      pt: 'Há {n} pessoas neste contato. Este seletor mostra a primeira; se você mudar, substitui todas, e se deixar como está, elas continuam.'
    },
  '{n} staff': { es: '{n} empleados', pt: '{n} funcionários' },
  '{n} tag': { es: '{n} etiqueta', pt: '{n} etiqueta' },
  '{n} tags': { es: '{n} etiquetas', pt: '{n} etiquetas' },
  '{n} tasks naming {name} are past due.': {
    es: '{n} tareas que nombran a {name} están vencidas.',
    pt: '{n} tarefas que citam {name} estão vencidas.'
  },
  '{n} team': { es: '{n} equipo', pt: '{n} equipe' },
  '{n} teams': { es: '{n} equipos', pt: '{n} equipes' },
  '{n} things want you today.': {
    es: 'Hoy te necesitan {n} cosas.',
    pt: '{n} coisas precisam de você hoje.'
  },
  '{n} ticket': { es: '{n} ticket', pt: '{n} chamado' },
  '{name} · {priority}': { es: '{name} · {priority}', pt: '{name} · {priority}' },
  '{name} board': { es: 'Tablero de {name}', pt: 'Quadro de {name}' },
  '{name} by pipeline stage': {
    es: '{name} por etapa del embudo',
    pt: '{name} por etapa do funil'
  },
  '{name} has not moved in {days} days.': {
    es: '{name} no se mueve desde hace {days} días.',
    pt: '{name} não se move há {days} dias.'
  },
  '{name} is marked inactive at {account}. Find out who replaced them before the next conversation.':
    {
      es: '{name} figura como inactivo en {account}. Averigua quién lo reemplazó antes de la próxima conversación.',
      pt: '{name} está marcado como inativo em {account}. Descubra quem substituiu essa pessoa antes da próxima conversa.'
    },
  '{name} is marked inactive. Find out who replaced them before the next conversation.': {
    es: '{name} figura como inactivo. Averigua quién lo reemplazó antes de la próxima conversación.',
    pt: '{name} está marcado como inativo. Descubra quem substituiu essa pessoa antes da próxima conversa.'
  },
  '{name} is on {deal} worth {amount}, and nobody owns this record.': {
    es: '{name} está en {deal}, por {amount}, y nadie es responsable de este registro.',
    pt: '{name} está em {deal}, no valor de {amount}, e ninguém é responsável por este registro.'
  },
  '{name} is on {n} open deals worth {amount}, and nobody owns this record.': {
    es: '{name} está en {n} negocios abiertos por {amount}, y nadie es responsable de este registro.',
    pt: '{name} está em {n} negócios abertos no valor de {amount}, e ninguém é responsável por este registro.'
  },
  '{name} is on 1 open deal worth {amount}, and nobody owns this record.': {
    es: '{name} está en 1 negocio abierto por {amount}, y nadie es responsable de este registro.',
    pt: '{name} está em 1 negócio aberto no valor de {amount}, e ninguém é responsável por este registro.'
  },
  '{name} is stalled and {invoice} is past due, same account, two problems.': {
    es: '{name} está estancado y {invoice} está vencida: la misma cuenta, dos problemas.',
    pt: '{name} está parado e {invoice} está vencida: a mesma conta, dois problemas.'
  },
  '1 deal worth {amount} has gone quiet.': {
    es: '1 negocio por {amount} se ha quedado en silencio.',
    pt: '1 negócio no valor de {amount} ficou em silêncio.'
  },
  '1 field still needs you': {
    es: '1 campo todavía te necesita',
    pt: '1 campo ainda precisa de você'
  },
  '1 thing wants you today.': {
    es: 'Hoy te necesita 1 cosa.',
    pt: '1 coisa precisa de você hoje.'
  },
  '7 to 25 characters: digits, spaces, brackets, dots, dashes. No extensions.': {
    es: 'De 7 a 25 caracteres: dígitos, espacios, paréntesis, puntos y guiones. Sin extensiones.',
    pt: 'De 7 a 25 caracteres: dígitos, espaços, parênteses, pontos e traços. Sem ramais.'
  },
  'A closed stage': { es: 'Una etapa cerrada', pt: 'Uma etapa fechada' },
  'A company you sell to. Everything else attaches to it later.': {
    es: 'Una empresa a la que le vendes. Todo lo demás se vincula a ella después.',
    pt: 'Uma empresa para a qual você vende. Todo o resto se vincula a ela depois.'
  },
  'A contact is a person at an account. Convert a lead, or add one directly and attach them to the account they work for.':
    {
      es: 'Un contacto es una persona de una cuenta. Convierte un prospecto, o añade uno directo y vincúlalo con la cuenta en la que trabaja.',
      pt: 'Um contato é uma pessoa de uma conta. Converta um lead, ou adicione um direto e vincule à conta em que trabalha.'
    },
  'A deal has to belong to an account.': {
    es: 'Un negocio tiene que pertenecer a una cuenta.',
    pt: 'Um negócio tem que pertencer a uma conta.'
  },
  'A goal is a target and a period. Once one exists, closed-won deals count towards it automatically. Nobody has to update a number.':
    {
      es: 'Un objetivo es una meta y un período. Cuando hay uno, los negocios ganados cuentan para él solos. Nadie tiene que actualizar un número.',
      pt: 'Uma meta é um alvo e um período. Quando existe uma, os negócios ganhos contam para ela automaticamente. Ninguém precisa atualizar um número.'
    },
  'A label for the window below. The dates are what actually scope it.': {
    es: 'Una etiqueta para la ventana de abajo. Lo que de verdad la delimita son las fechas.',
    pt: 'Um rótulo para a janela abaixo. O que realmente a delimita são as datas.'
  },
  'A lead is somebody who might buy, before you know enough to call it a deal. Import a list, or add the last person who emailed you.':
    {
      es: 'Un prospecto es alguien que podría comprar, antes de que sepas lo bastante para llamarlo un negocio. Importa una lista, o añade a la última persona que te escribió.',
      pt: 'Um lead é alguém que talvez compre, antes de você saber o bastante para chamar isso de negócio. Importe uma lista, ou adicione a última pessoa que lhe enviou um e-mail.'
    },
  'A lead needs a name to be findable. First or last will do.': {
    es: 'Un prospecto necesita un nombre para poder encontrarlo. Con el nombre o el apellido basta.',
    pt: 'Um lead precisa de um nome para ser encontrado. O nome ou o sobrenome bastam.'
  },
  'A LinkedIn URL starts with http:// or https://.': {
    es: 'Una URL de LinkedIn empieza con http:// o https://.',
    pt: 'Uma URL do LinkedIn começa com http:// ou https://.'
  },
  'A name and a company is enough to start. The rest can wait.': {
    es: 'Con un nombre y una empresa basta para empezar. El resto puede esperar.',
    pt: 'Um nome e uma empresa bastam para começar. O resto pode esperar.'
  },
  'A person at an account. Everything optional can wait until they exist.': {
    es: 'Una persona de una cuenta. Lo opcional puede esperar hasta que exista.',
    pt: 'Uma pessoa de uma conta. O que é opcional pode esperar até ela existir.'
  },
  'A person needs a first name.': {
    es: 'Una persona necesita un nombre.',
    pt: 'Uma pessoa precisa de um nome.'
  },
  'A person needs a last name.': {
    es: 'Una persona necesita un apellido.',
    pt: 'Uma pessoa precisa de um sobrenome.'
  },
  'A pipeline sorts {name} into stages you move them through. An admin can create one under lead pipelines in settings, or by applying an industry pack.':
    {
      es: 'Un embudo organiza {name} en etapas por las que los vas moviendo. Un administrador puede crear uno en embudos de prospectos, dentro de Configuración, o al aplicar un paquete del sector.',
      pt: 'Um funil organiza {name} em etapas pelas quais você os move. Um administrador pode criar um em funis de leads, dentro de Configurações, ou ao aplicar um pacote do setor.'
    },
  'A task naming {name} is past due.': {
    es: 'Una tarea que nombra a {name} está vencida.',
    pt: 'Uma tarefa que cita {name} está vencida.'
  },
  'A won deal has to record what it was worth.': {
    es: 'Un negocio ganado tiene que dejar registrado cuánto valía.',
    pt: 'Um negócio ganho tem que registrar quanto valia.'
  },
  About: { es: 'Acerca de', pt: 'Sobre' },
  'Account name': { es: 'Nombre de la cuenta', pt: 'Nome da conta' },
  accounts: { es: 'cuentas', pt: 'contas' },
  'accounts.': { es: 'cuentas.', pt: 'contas.' },
  'active goals': { es: 'objetivos activos', pt: 'metas ativas' },
  'Active goals': { es: 'Objetivos activos', pt: 'Metas ativas' },
  'Active people': { es: 'Personas activas', pt: 'Pessoas ativas' },
  'Active revenue goals': {
    es: 'Objetivos de ingresos activos',
    pt: 'Metas de receita ativas'
  },
  'Active. Counts towards totals': {
    es: 'Activo. Cuenta para los totales',
    pt: 'Ativa. Conta para os totais'
  },
  'Add a note to save alongside the file.': {
    es: 'Añade una nota para guardarla junto al archivo.',
    pt: 'Adicione uma nota para salvar junto com o arquivo.'
  },
  'Add an email address first. The contact record is created from it.': {
    es: 'Primero añade un correo. El contacto se crea a partir de él.',
    pt: 'Adicione um e-mail primeiro. O registro do contato é criado a partir dele.'
  },
  'Add an email address to this lead first. The contact record is created from it.': {
    es: 'Primero añade un correo a este prospecto. El contacto se crea a partir de él.',
    pt: 'Adicione um e-mail a este lead primeiro. O registro do contato é criado a partir dele.'
  },
  'Add contact details': { es: 'Añadir datos de contacto', pt: 'Adicionar dados de contato' },
  'Add the person': { es: 'Añade a la persona', pt: 'Adicione a pessoa' },
  'add up': { es: 'suman', pt: 'somam' },
  'added {when}': { es: 'añadido {when}', pt: 'adicionado {when}' },
  admins: { es: 'administradores', pt: 'administradores' },
  Admins: { es: 'Administradores', pt: 'Administradores' },
  'All goals': { es: 'Todos los objetivos', pt: 'Todas as metas' },
  'All pipelines': { es: 'Todos los embudos', pt: 'Todos os funis' },
  'Already converted': { es: 'Ya convertido', pt: 'Já convertido' },
  "Also adds them to {name}'s people.": {
    es: 'También lo añade a las personas de {name}.',
    pt: 'Também o adiciona às pessoas de {name}.'
  },
  "Also adds this person to that account's people.": {
    es: 'También añade a esta persona a las personas de esa cuenta.',
    pt: 'Também adiciona esta pessoa às pessoas dessa conta.'
  },
  'Also at': { es: 'También en', pt: 'Também em' },
  'Also at {name}': { es: 'También en {name}', pt: 'Também em {name}' },
  'Amount cannot be negative.': {
    es: 'El importe no puede ser negativo.',
    pt: 'O valor não pode ser negativo.'
  },
  'Amount has to be a number greater than zero.': {
    es: 'El importe tiene que ser un número mayor que cero.',
    pt: 'O valor tem que ser um número maior que zero.'
  },
  'Amount has to be a number.': {
    es: 'El importe tiene que ser un número.',
    pt: 'O valor tem que ser um número.'
  },
  'An account is a company you sell to. One appears automatically the first time you convert a lead, or you can add one directly.':
    {
      es: 'Una cuenta es una empresa a la que le vendes. Se crea sola la primera vez que conviertes un prospecto, o puedes añadir una directamente.',
      pt: 'Uma conta é uma empresa para a qual você vende. Uma aparece sozinha na primeira vez que você converte um lead, ou você pode adicionar uma direto.'
    },
  "An Account, a Contact and an Opportunity, with this lead's comments and attachments moved across. The lead stays as a converted record, and this is the last time you can change its status. There is no endpoint that undoes any of it.":
    {
      es: 'Una cuenta, un contacto y un negocio, con los comentarios y adjuntos de este prospecto pasados a ellos. El prospecto queda como registro convertido, y esta es la última vez que puedes cambiar su estado. No hay un endpoint que deshaga nada de esto.',
      pt: 'Uma conta, um contato e um negócio, com os comentários e anexos deste lead transferidos. O lead fica como registro convertido, e esta é a última vez que você pode mudar o status. Não há um endpoint que desfaça nada disso.'
    },
  'Annual revenue': { es: 'Ingresos anuales', pt: 'Receita anual' },
  'Annual revenue cannot be negative.': {
    es: 'Los ingresos anuales no pueden ser negativos.',
    pt: 'A receita anual não pode ser negativa.'
  },
  'Annual revenue has to be a number.': {
    es: 'Los ingresos anuales tienen que ser un número.',
    pt: 'A receita anual tem que ser um número.'
  },
  'Another lead in this org already uses that address.': {
    es: 'Otro prospecto de esta organización ya usa esa dirección.',
    pt: 'Outro lead desta organização já usa esse endereço.'
  },
  'Any other change on this form, aside from custom fields, is dropped when it saves alongside a conversion. Reopen the lead afterwards to redo it.':
    {
      es: 'Cualquier otro cambio de este formulario, aparte de los campos personalizados, se descarta si se guarda junto con una conversión. Vuelve a abrir el prospecto después para rehacerlo.',
      pt: 'Qualquer outra alteração deste formulário, fora os campos personalizados, é descartada quando salva junto com uma conversão. Reabra o lead depois para refazer.'
    },
  'Any period': { es: 'Cualquier período', pt: 'Qualquer período' },
  'Ask an admin in your organisation to give you access, or head back to Today.': {
    es: 'Pídele a un administrador de tu organización que te dé acceso, o vuelve a Hoy.',
    pt: 'Peça a um administrador da sua organização para lhe dar acesso, ou volte para Hoje.'
  },
  'Assign owner': { es: 'Asignar responsable', pt: 'Atribuir responsável' },
  'Back to goals': { es: 'Volver a los objetivos', pt: 'Voltar às metas' },
  'Back to the account': { es: 'Volver a la cuenta', pt: 'Voltar à conta' },
  'Back to the contact': { es: 'Volver al contacto', pt: 'Voltar ao contato' },
  'Back to the deal': { es: 'Volver al negocio', pt: 'Voltar ao negócio' },
  'Back to the lead': { es: 'Volver al prospecto', pt: 'Voltar ao lead' },
  'Back to Today': { es: 'Volver a Hoy', pt: 'Voltar para Hoje' },
  Booked: { es: 'Logrado', pt: 'Realizado' },
  'Call {name}': { es: 'Llamar a {name}', pt: 'Ligar para {name}' },
  'Can be left empty and set later.': {
    es: 'Puede quedar vacío y definirse después.',
    pt: 'Pode ficar em branco e ser definido depois.'
  },
  'Can change roles and org settings': {
    es: 'Puede cambiar roles y la Configuración de la organización',
    pt: 'Pode mudar papéis e as Configurações da organização'
  },
  'Cannot reach': { es: 'Sin vía de contacto', pt: 'Sem como falar' },
  'Changes to “{name}” are on the record.': {
    es: 'Los cambios de “{name}” ya quedaron en el registro.',
    pt: 'As alterações de “{name}” já estão no registro.'
  },
  'Choose an account…': { es: 'Elige una cuenta…', pt: 'Escolha uma conta…' },
  "Clear this when somebody leaves. They stay on the account's history and drop out of the working list.":
    {
      es: 'Desmárcalo cuando alguien se va. Sigue en el historial de la cuenta y sale de la lista de trabajo.',
      pt: 'Desmarque quando alguém sair. A pessoa fica no histórico da conta e sai da lista de trabalho.'
    },
  'closed {date}': { es: 'cerrado el {date}', pt: 'fechado em {date}' },
  'Closed-won in period': { es: 'Ganados en el período', pt: 'Ganhos no período' },
  Closing: { es: 'Cierre', pt: 'Fechamento' },
  Committed: { es: 'Comprometido', pt: 'Comprometido' },
  'Company typed in': { es: 'Empresa escrita', pt: 'Empresa digitada' },
  Convert: { es: 'Convertir', pt: 'Converter' },
  'Convert lead': { es: 'Convertir prospecto', pt: 'Converter lead' },
  'Converted.': { es: 'Convertido.', pt: 'Convertido.' },
  'Converting creates a Contact, and a contact without an email cannot be reached.': {
    es: 'Convertir crea un contacto, y un contacto sin correo no se puede contactar.',
    pt: 'Converter cria um contato, e um contato sem e-mail não pode ser contatado.'
  },
  'Converting creates three records': {
    es: 'Convertir crea tres registros',
    pt: 'Converter cria três registros'
  },
  'Converting is a significant, largely irreversible step: it creates an Account, a Contact and an Opportunity that nothing undoes if the status changes back, and it requires an email address that nothing else here does. Set the status here to something else, and convert once the lead is real.':
    {
      es: 'Convertir es un paso importante y, en gran parte, irreversible: crea una cuenta, un contacto y un negocio que nada deshace si el estado vuelve atrás, y exige un correo que nada más aquí exige. Pon aquí otro estado, y convierte cuando el prospecto sea real.',
      pt: 'Converter é um passo importante e, em grande parte, irreversível: cria uma conta, um contato e um negócio que nada desfaz se o status voltar, e exige um e-mail que nada mais aqui exige. Defina outro status aqui e converta quando o lead for real.'
    },
  'Could not change that role.': {
    es: 'No se pudo cambiar ese rol.',
    pt: 'Não foi possível mudar esse papel.'
  },
  'Could not change that status.': {
    es: 'No se pudo cambiar ese estado.',
    pt: 'Não foi possível mudar esse status.'
  },
  'Could not convert this lead.': {
    es: 'No se pudo convertir este prospecto.',
    pt: 'Não foi possível converter este lead.'
  },
  'Could not create the deal.': {
    es: 'No se pudo crear el negocio.',
    pt: 'Não foi possível criar o negócio.'
  },
  'Could not create the lead.': {
    es: 'No se pudo crear el prospecto.',
    pt: 'Não foi possível criar o lead.'
  },
  'Could not create this account.': {
    es: 'No se pudo crear esta cuenta.',
    pt: 'Não foi possível criar esta conta.'
  },
  'Could not create this contact.': {
    es: 'No se pudo crear este contacto.',
    pt: 'Não foi possível criar este contato.'
  },
  'Could not create this goal.': {
    es: 'No se pudo crear este objetivo.',
    pt: 'Não foi possível criar esta meta.'
  },
  'Could not delete this account.': {
    es: 'No se pudo eliminar esta cuenta.',
    pt: 'Não foi possível excluir esta conta.'
  },
  'Could not delete this contact.': {
    es: 'No se pudo eliminar este contacto.',
    pt: 'Não foi possível excluir este contato.'
  },
  'Could not delete this deal.': {
    es: 'No se pudo eliminar este negocio.',
    pt: 'Não foi possível excluir este negócio.'
  },
  'Could not delete this goal.': {
    es: 'No se pudo eliminar este objetivo.',
    pt: 'Não foi possível excluir esta meta.'
  },
  'Could not delete this lead.': {
    es: 'No se pudo eliminar este prospecto.',
    pt: 'Não foi possível excluir este lead.'
  },
  'Could not move the deal, reverted.': {
    es: 'No se pudo mover el negocio; se revirtió.',
    pt: 'Não foi possível mover o negócio; foi revertido.'
  },
  'Could not move the deal.': {
    es: 'No se pudo mover el negocio.',
    pt: 'Não foi possível mover o negócio.'
  },
  'Could not move the lead, so it went back.': {
    es: 'No se pudo mover el prospecto, así que volvió.',
    pt: 'Não foi possível mover o lead, então ele voltou.'
  },
  'Could not move the lead.': {
    es: 'No se pudo mover el prospecto.',
    pt: 'Não foi possível mover o lead.'
  },
  'Could not raise an invoice from this deal.': {
    es: 'No se pudo emitir una factura desde este negocio.',
    pt: 'Não foi possível emitir uma fatura a partir deste negócio.'
  },
  'Could not save that note.': {
    es: 'No se pudo guardar esa nota.',
    pt: 'Não foi possível salvar essa nota.'
  },
  'Could not save the deal.': {
    es: 'No se pudo guardar el negocio.',
    pt: 'Não foi possível salvar o negócio.'
  },
  'Could not save this account.': {
    es: 'No se pudo guardar esta cuenta.',
    pt: 'Não foi possível salvar esta conta.'
  },
  'Could not save this contact.': {
    es: 'No se pudo guardar este contacto.',
    pt: 'Não foi possível salvar este contato.'
  },
  'Could not save this goal.': {
    es: 'No se pudo guardar este objetivo.',
    pt: 'Não foi possível salvar esta meta.'
  },
  'Could not save this lead.': {
    es: 'No se pudo guardar este prospecto.',
    pt: 'Não foi possível salvar este lead.'
  },
  'Could not send that invite.': {
    es: 'No se pudo enviar esa invitación.',
    pt: 'Não foi possível enviar esse convite.'
  },
  'Create account': { es: 'Crear cuenta', pt: 'Criar conta' },
  'Create contact': { es: 'Crear contacto', pt: 'Criar contato' },
  'Create deal': { es: 'Crear negocio', pt: 'Criar negócio' },
  'Create estimate': { es: 'Crear presupuesto', pt: 'Criar orçamento' },
  'Create goal': { es: 'Crear objetivo', pt: 'Criar meta' },
  'Create lead': { es: 'Crear prospecto', pt: 'Criar lead' },
  'created {when}': { es: 'creado {when}', pt: 'criado {when}' },
  'Created {when} and still never contacted. Reach out, or recycle it.': {
    es: 'Creado {when} y todavía nadie lo contactó. Escríbele, o recíclalo.',
    pt: 'Criado {when} e ainda ninguém fez contato. Fale com ele, ou recicle.'
  },
  'Creates an account, a contact and an opportunity from this lead': {
    es: 'Crea una cuenta, un contacto y un negocio a partir de este prospecto',
    pt: 'Cria uma conta, um contato e um negócio a partir deste lead'
  },
  'Creates an account, a contact and one deal worth {amount}. The lead stays linked, and there is no endpoint that undoes it.':
    {
      es: 'Crea una cuenta, un contacto y un negocio por {amount}. El prospecto sigue vinculado, y no hay un endpoint que lo deshaga.',
      pt: 'Cria uma conta, um contato e um negócio no valor de {amount}. O lead continua vinculado, e não há um endpoint que desfaça isso.'
    },
  'Creates an account, a contact and one deal. The lead stays linked, and there is no endpoint that undoes it.':
    {
      es: 'Crea una cuenta, un contacto y un negocio. El prospecto sigue vinculado, y no hay un endpoint que lo deshaga.',
      pt: 'Cria uma conta, um contato e um negócio. O lead continua vinculado, e não há um endpoint que desfaça isso.'
    },
  Currently: { es: 'Actualmente', pt: 'Atualmente' },
  'customer since {date}': { es: 'cliente desde {date}', pt: 'cliente desde {date}' },
  Deactivate: { es: 'Desactivar', pt: 'Desativar' },
  Deactivated: { es: 'Desactivado', pt: 'Desativado' },
  'Deal name': { es: 'Nombre del negocio', pt: 'Nome do negócio' },
  'deals ·': { es: 'negocios ·', pt: 'negócios ·' },
  'Deals they are named on': {
    es: 'Negocios en los que figura',
    pt: 'Negócios em que figura'
  },
  'Delete this goal': { es: 'Eliminar este objetivo', pt: 'Excluir esta meta' },
  'Deletes {name} permanently. This cannot be undone.': {
    es: 'Elimina {name} de forma permanente. Esto no se puede deshacer.',
    pt: 'Exclui {name} de forma permanente. Isto não pode ser desfeito.'
  },
  Department: { es: 'Departamento', pt: 'Departamento' },
  Details: { es: 'Detalles', pt: 'Detalhes' },
  'Digits and separators only. The API rejects letters, so "x123" extensions have to go in the notes.':
    {
      es: 'Solo dígitos y separadores. La API rechaza las letras, así que las extensiones como "x123" van en las notas.',
      pt: 'Apenas dígitos e separadores. A API rejeita letras, então ramais como "x123" vão nas notas.'
    },
  Discounts: { es: 'Descuentos', pt: 'Descontos' },
  'do not call': { es: 'no llamar', pt: 'não ligar' },
  'Do not call': { es: 'No llamar', pt: 'Não ligar' },
  done: { es: 'hecha', pt: 'feita' },
  'Drag a card, or use "Move to" on it, to change its stage. A lead in no stage joins this pipeline when you move it into one, and leaves it when you move it back to No stage.':
    {
      es: 'Arrastra una tarjeta, o usa "Mover a" en ella, para cambiar su etapa. Un prospecto sin etapa entra en este embudo cuando lo mueves a una, y sale cuando lo devuelves a Sin etapa.',
      pt: 'Arraste um cartão, ou use "Mover para" nele, para mudar a etapa. Um lead sem etapa entra neste funil quando você o move para uma, e sai quando você o devolve para Sem etapa.'
    },
  'due {date}': { es: 'vence el {date}', pt: 'vence em {date}' },
  'Edit goal': { es: 'Editar objetivo', pt: 'Editar meta' },
  'Edit this contact': { es: 'Editar este contacto', pt: 'Editar este contato' },
  'Email {name}': { es: 'Enviar correo a {name}', pt: 'Enviar e-mail para {name}' },
  'Enter an email address.': { es: 'Escribe un correo.', pt: 'Digite um e-mail.' },
  'Est. value': { es: 'Valor est.', pt: 'Valor est.' },
  'Estimated value': { es: 'Valor estimado', pt: 'Valor estimado' },
  'Estimated value cannot be negative.': {
    es: 'El valor estimado no puede ser negativo.',
    pt: 'O valor estimado não pode ser negativo.'
  },
  'Estimated value has to be a number.': {
    es: 'El valor estimado tiene que ser un número.',
    pt: 'O valor estimado tem que ser um número.'
  },
  'Every edit on this form was saved to the lead first, and the lead was then converted from it. Open what the conversion made below.':
    {
      es: 'Primero se guardó en el prospecto cada cambio de este formulario, y después el prospecto se convirtió a partir de eso. Abre abajo lo que armó la conversión.',
      pt: 'Cada alteração deste formulário foi salva primeiro no lead, e depois o lead foi convertido a partir disso. Abra abaixo o que a conversão criou.'
    },
  'Everyone has signed in': { es: 'Todos iniciaron sesión', pt: 'Todos já entraram' },
  'Everyone is on pace': { es: 'Todos van en ritmo', pt: 'Todos estão no ritmo' },
  'Everything else on this form is still editable. A converted lead is a record, not a read-only one.':
    {
      es: 'Lo demás de este formulario sigue pudiendo editarse. Un prospecto convertido es un registro, no uno de solo lectura.',
      pt: 'O restante deste formulário continua editável. Um lead convertido é um registro, não um somente leitura.'
    },
  'Expected close': { es: 'Cierre esperado', pt: 'Fechamento previsto' },
  'Filter by period': { es: 'Filtrar por período', pt: 'Filtrar por período' },
  'Filter by window': { es: 'Filtrar por ventana', pt: 'Filtrar por janela' },
  'First name': { es: 'Nombre', pt: 'Nome' },
  'Follow-up due': { es: 'Seguimiento vencido', pt: 'Acompanhamento vencido' },
  'Free text, kept for imported records. Where it disagrees with the linked account, the account is what the rest of the CRM uses.':
    {
      es: 'Texto libre, guardado para los registros importados. Si no coincide con la cuenta vinculada, el resto del CRM usa la cuenta.',
      pt: 'Texto livre, guardado para registros importados. Onde não bater com a conta vinculada, a conta é o que o resto do CRM usa.'
    },
  'From line items': { es: 'Según partidas', pt: 'Pelos itens' },
  'Give the account the name you would search for.': {
    es: 'Ponle a la cuenta el nombre por el que la buscarías.',
    pt: 'Dê à conta o nome pelo qual você a buscaria.'
  },
  'Give the deal a name you would recognise in a list.': {
    es: 'Ponle al negocio un nombre que reconocerías en una lista.',
    pt: 'Dê ao negócio um nome que você reconheceria numa lista.'
  },
  'Give the goal a name you would recognise in a list.': {
    es: 'Ponle al objetivo un nombre que reconocerías en una lista.',
    pt: 'Dê à meta um nome que você reconheceria numa lista.'
  },
  'Go to leads': { es: 'Ir a prospectos', pt: 'Ir para leads' },
  'Goal history': { es: 'Historial de objetivos', pt: 'Histórico de metas' },
  'Goal name': { es: 'Nombre del objetivo', pt: 'Nome da meta' },
  Headcount: { es: 'Plantilla', pt: 'Funcionários' },
  'Headcount cannot be negative.': {
    es: 'La plantilla no puede ser negativa.',
    pt: 'O número de funcionários não pode ser negativo.'
  },
  'Headcount is a whole number.': {
    es: 'La plantilla tiene que ser un número entero.',
    pt: 'O número de funcionários tem que ser um número inteiro.'
  },
  Health: { es: 'Salud', pt: 'Saúde' },
  'Hide inactive': { es: 'Ocultar inactivos', pt: 'Ocultar inativos' },
  'How much is it worth?': { es: '¿Cuánto vale?', pt: 'Quanto vale?' },
  'if something is wrong.': { es: 'si algo anda mal.', pt: 'se algo estiver errado.' },
  'in {name}': { es: 'en {name}', pt: 'em {name}' },
  'in no stage': { es: 'sin etapa', pt: 'sem etapa' },
  'In stage': { es: 'En etapa', pt: 'Na etapa' },
  'in this pipeline ·': { es: 'en este embudo ·', pt: 'neste funil ·' },
  'inactive hidden': { es: 'inactivos ocultos', pt: 'inativos ocultos' },
  'inactive not shown': { es: 'inactivos no mostrados', pt: 'inativos não exibidos' },
  'Inbox zero for today': { es: 'Nada en la bandeja hoy', pt: 'Caixa de entrada zerada hoje' },
  Invite: { es: 'Invitar', pt: 'Convidar' },
  'Invited, seat unclaimed': {
    es: 'Invitado, puesto sin reclamar',
    pt: 'Convidado, vaga não assumida'
  },
  'It may have been deleted, or it belongs to a team you are not part of.': {
    es: 'Puede que se haya eliminado, o pertenece a un equipo del que no formas parte.',
    pt: 'Pode ter sido excluído, ou pertence a uma equipe da qual você não faz parte.'
  },
  'Its account, contact and opportunity exist and carry the work now. The status stays where it is: reopening the lead would not remove any of them, and converting it again would build a second opportunity against the same account. The API refuses both.':
    {
      es: 'Su cuenta, su contacto y su negocio ya existen y llevan el trabajo ahora. El estado se queda donde está: reabrir el prospecto no quitaría ninguno, y convertirlo otra vez crearía un segundo negocio contra la misma cuenta. La API rechaza ambas cosas.',
      pt: 'A conta, o contato e o negócio dele já existem e carregam o trabalho agora. O status fica onde está: reabrir o lead não removeria nenhum deles, e converter de novo criaria um segundo negócio na mesma conta. A API recusa as duas coisas.'
    },
  'Job title': { es: 'Cargo', pt: 'Cargo' },
  'Last contacted': { es: 'Último contacto', pt: 'Último contato' },
  'last contacted {when}': { es: 'último contacto {when}', pt: 'último contato {when}' },
  'Last name': { es: 'Apellido', pt: 'Sobrenome' },
  'Last touch': { es: 'Último contacto', pt: 'Último contato' },
  'Later this week': { es: 'Más tarde esta semana', pt: 'Mais tarde nesta semana' },
  Lead: { es: 'Prospecto', pt: 'Lead' },
  'Lead pipelines': { es: 'Embudos de prospectos', pt: 'Funis de leads' },
  'Least recently touched first': {
    es: 'Menos contactados primero',
    pt: 'Menos contatados primeiro'
  },
  'Line items': { es: 'Partidas', pt: 'Itens' },
  LinkedIn: { es: 'LinkedIn', pt: 'LinkedIn' },
  'Log a call, a reply, what they said…': {
    es: 'Anota una llamada, una respuesta, lo que dijeron…',
    pt: 'Registre uma ligação, uma resposta, o que disseram…'
  },
  'Make admin': { es: 'Hacer administrador', pt: 'Tornar administrador' },
  'Make member': { es: 'Hacer miembro', pt: 'Tornar membro' },
  'Measured in': { es: 'Medido en', pt: 'Medida em' },
  Met: { es: 'Alcanzada', pt: 'Atingida' },
  'Missing lead or stage.': {
    es: 'Falta el prospecto o la etapa.',
    pt: 'Falta o lead ou a etapa.'
  },
  'more are waiting:': { es: 'más esperan:', pt: 'mais esperam:' },
  'more is waiting:': { es: 'más espera:', pt: 'mais espera:' },
  'Most recently added first': {
    es: 'Añadidos más recientes primero',
    pt: 'Adicionados mais recentes primeiro'
  },
  'Move {name} to stage': { es: 'Mover {name} a una etapa', pt: 'Mover {name} para uma etapa' },
  'name@company.com': { es: 'name@company.com', pt: 'name@company.com' },
  'Needs an owner': { es: 'Necesita un responsable', pt: 'Precisa de um responsável' },
  'Needs you': { es: 'Te necesita', pt: 'Precisa de você' },
  'never contacted': { es: 'nunca contactado', pt: 'nunca contatado' },
  'Never contacted': { es: 'Nunca contactado', pt: 'Nunca contatado' },
  'Never signed in': { es: 'Nunca iniciaron sesión', pt: 'Nunca entraram' },
  'New account': { es: 'Nueva cuenta', pt: 'Nova conta' },
  'New contact': { es: 'Nuevo contacto', pt: 'Novo contato' },
  'New goal': { es: 'Nuevo objetivo', pt: 'Nova meta' },
  'New lead': { es: 'Nuevo prospecto', pt: 'Novo lead' },
  'Next step': { es: 'Siguiente paso', pt: 'Próximo passo' },
  'No {name} yet': { es: 'Aún no hay {name}', pt: 'Ainda não há {name}' },
  'No accounts yet': { es: 'Aún no hay cuentas', pt: 'Ainda não há contas' },
  'No address': { es: 'Sin dirección', pt: 'Sem endereço' },
  'No contacts yet': { es: 'Aún no hay contactos', pt: 'Ainda não há contatos' },
  'No deals here': { es: 'Aquí no hay negocios', pt: 'Não há negócios aqui' },
  'No deals name this person. Add them to the deal they are actually involved in. The account having deals is a different fact.':
    {
      es: 'Ningún negocio nombra a esta persona. Añádela al negocio en el que de verdad participa. Que la cuenta tenga negocios es otra cosa.',
      pt: 'Nenhum negócio cita esta pessoa. Adicione-a ao negócio do qual ela realmente participa. A conta ter negócios é outro fato.'
    },
  'No deals won yet': { es: 'Aún no hay negocios ganados', pt: 'Ainda não há negócios ganhos' },
  'No deals yet. Create one when there is something real to sell.': {
    es: 'Aún no hay negocios. Crea uno cuando haya algo real que vender.',
    pt: 'Ainda não há negócios. Crie um quando houver algo real para vender.'
  },
  'No email': { es: 'Sin correo', pt: 'Sem e-mail' },
  'No email and no phone on this lead, so there is no way to contact {name}. Add one before you can work it.':
    {
      es: 'Este prospecto no tiene correo ni teléfono, así que no hay cómo contactar a {name}. Añade uno antes de poder trabajarlo.',
      pt: 'Este lead não tem e-mail nem telefone, então não há como contatar {name}. Adicione um antes de poder trabalhar nele.'
    },
  'No finished periods yet': {
    es: 'Aún no hay períodos cerrados',
    pt: 'Ainda não há períodos encerrados'
  },
  'No goals match this filter': {
    es: 'Ningún objetivo coincide con este filtro',
    pt: 'Nenhuma meta corresponde a este filtro'
  },
  'No goals set': { es: 'No hay objetivos', pt: 'Não há metas' },
  'No industry': { es: 'Sin industria', pt: 'Sem setor' },
  'No open deals': { es: 'Sin negocios abiertos', pt: 'Sem negócios abertos' },
  'No overdue tickets, invoices, quiet deals or tasks. Anything coming up is below.': {
    es: 'No hay tickets vencidos, facturas vencidas, negocios en silencio ni tareas. Lo que viene está más abajo.',
    pt: 'Não há chamados vencidos, faturas vencidas, negócios em silêncio nem tarefas. O que vem pela frente está abaixo.'
  },
  'No phone': { es: 'Sin teléfono', pt: 'Sem telefone' },
  'No pipelines yet': { es: 'Aún no hay embudos', pt: 'Ainda não há funis' },
  'No related records yet': {
    es: 'Aún no hay registros relacionados',
    pt: 'Ainda não há registros relacionados'
  },
  'No teams yet.': { es: 'Aún no hay equipos.', pt: 'Ainda não há equipes.' },
  'No tickets.': { es: 'No hay tickets.', pt: 'Não há chamados.' },
  'No title recorded': { es: 'Sin cargo registrado', pt: 'Sem cargo registrado' },
  'Nobody here yet.': { es: 'Aquí no hay nadie todavía.', pt: 'Ainda não há ninguém aqui.' },
  'Nobody owns this lead. Assign an owner so it does not sit unworked.': {
    es: 'Nadie es responsable de este prospecto. Asigna un responsable para que no se quede sin trabajar.',
    pt: 'Ninguém é responsável por este lead. Atribua um responsável para que ele não fique parado.'
  },
  'None open': { es: 'Ninguno abierto', pt: 'Nenhum aberto' },
  'Not contacted': { es: 'Sin contactar', pt: 'Não contatado' },
  'Not paused': { es: 'Sin pausa', pt: 'Sem pausa' },
  'Not recorded': { es: 'Sin registrar', pt: 'Não registrado' },
  'Not specified': { es: 'Sin especificar', pt: 'Não especificado' },
  'Nothing assigned to you': { es: 'Nada asignado a ti', pt: 'Nada atribuído a você' },
  'Nothing billed yet.': { es: 'Aún no hay nada facturado.', pt: 'Ainda não há nada faturado.' },
  'Nothing has been created.': { es: 'No se ha creado nada.', pt: 'Nada foi criado.' },
  'Nothing has been saved.': { es: 'No se ha guardado nada.', pt: 'Nada foi salvo.' },
  'Nothing here matches the search and period you picked. Clearing the filter shows everything you can see.':
    {
      es: 'Nada de aquí coincide con la búsqueda y el período que elegiste. Si quitas el filtro, ves todo lo que puedes ver.',
      pt: 'Nada aqui corresponde à busca e ao período que você escolheu. Limpar o filtro mostra tudo o que você pode ver.'
    },
  'Nothing in this stage.': { es: 'Nada en esta etapa.', pt: 'Nada nesta etapa.' },
  'Nothing is assigned to you or your teams. An administrator sets these, and closed-won deals count towards them automatically once one exists.':
    {
      es: 'No hay nada asignado a ti ni a tus equipos. Un administrador los configura, y los negocios ganados cuentan para ellos automáticamente en cuanto existe uno.',
      pt: 'Nada está atribuído a você nem às suas equipes. Um administrador define isso, e os negócios ganhos contam para elas automaticamente assim que uma existe.'
    },
  'Nothing logged yet. The first note you add shows up here.': {
    es: 'Aún no hay nada anotado. La primera nota que añadas aparece aquí.',
    pt: 'Ainda não há nada registrado. A primeira nota que você adicionar aparece aqui.'
  },
  'Nothing matches this view. Start a deal from an account you are already talking to, convert a lead that is ready, or clear a filter to see more.':
    {
      es: 'Nada coincide con esta vista. Empieza un negocio desde una cuenta con la que ya hablas, convierte un prospecto que esté listo, o quita un filtro para ver más.',
      pt: 'Nada corresponde a esta visão. Comece um negócio a partir de uma conta com a qual você já fala, converta um lead que esteja pronto ou limpe um filtro para ver mais.'
    },
  'Nothing needs you right now: you’re all clear for today.': {
    es: 'Ahora nada te necesita: hoy lo tienes todo al día.',
    pt: 'Nada precisa de você agora: hoje você está em dia.'
  },
  'Nothing outstanding that names this person.': {
    es: 'No hay nada pendiente que nombre a esta persona.',
    pt: 'Não há nada em aberto que cite esta pessoa.'
  },
  'Nothing past due': { es: 'Nada vencido', pt: 'Nada vencido' },
  'Nothing won yet': { es: 'Nada ganado aún', pt: 'Nada ganho ainda' },
  "Once a goal's period ends it moves here with what it attained. Goals still running are on the goals page.":
    {
      es: 'Cuando termina el período de un objetivo, pasa aquí con lo que alcanzó. Los que siguen en curso están en la página de objetivos.',
      pt: 'Quando o período de uma meta termina, ela vem para cá com o que atingiu. As que ainda estão em andamento ficam na página de metas.'
    },
  'One lead per address per org, ignoring case. The database enforces it, so a duplicate comes back as a rejected save rather than a second record.':
    {
      es: 'Un prospecto por dirección en cada organización, sin distinguir mayúsculas. La base de datos lo impone, así que un duplicado regresa como un guardado rechazado y no como un segundo registro.',
      pt: 'Um lead por endereço em cada organização, sem diferenciar maiúsculas. O banco de dados impõe isso, então uma duplicata volta como um salvamento recusado, e não como um segundo registro.'
    },
  'Only an admin can change goals.': {
    es: 'Solo un administrador puede cambiar los objetivos.',
    pt: 'Só um administrador pode alterar as metas.'
  },
  'Only an admin can change who is active.': {
    es: 'Solo un administrador puede cambiar quién está activo.',
    pt: 'Só um administrador pode mudar quem está ativo.'
  },
  'Only an admin can create goals.': {
    es: 'Solo un administrador puede crear objetivos.',
    pt: 'Só um administrador pode criar metas.'
  },
  'Only an admin can delete goals.': {
    es: 'Solo un administrador puede eliminar objetivos.',
    pt: 'Só um administrador pode excluir metas.'
  },
  'Only an admin can invite people.': {
    es: 'Solo un administrador puede invitar a personas.',
    pt: 'Só um administrador pode convidar pessoas.'
  },
  'Only needed when there is no account to link, an imported record, or a company nobody has created yet.':
    {
      es: 'Solo hace falta cuando no hay cuenta que vincular, es un registro importado, o una empresa que nadie ha creado todavía.',
      pt: 'Só é necessário quando não há conta para vincular, um registro importado, ou uma empresa que ninguém criou ainda.'
    },
  'open ·': { es: 'abiertos ·', pt: 'abertos ·' },
  'Open pipeline': { es: 'Embudo abierto', pt: 'Funil aberto' },
  'Open stages only. Drag a card to change its stage': {
    es: 'Solo etapas abiertas. Arrastra una tarjeta para cambiar su etapa',
    pt: 'Somente etapas abertas. Arraste um cartão para mudar a etapa'
  },
  'Open the deal': { es: 'Abrir el negocio', pt: 'Abrir o negócio' },
  'Open tickets': { es: 'Tickets abiertos', pt: 'Chamados abertos' },
  'Out of date': { es: 'Desactualizado', pt: 'Desatualizado' },
  'owned by {name}': { es: 'a cargo de {name}', pt: 'responsável {name}' },
  'Paused, kept, but not counted': {
    es: 'En pausa, se conserva, pero no se cuenta',
    pt: 'Pausada, mantida, mas não é contada'
  },
  people: { es: 'personas', pt: 'pessoas' },
  'people ·': { es: 'personas ·', pt: 'pessoas ·' },
  Period: { es: 'Período', pt: 'Período' },
  'Period end': { es: 'Fin del período', pt: 'Fim do período' },
  'Period start': { es: 'Inicio del período', pt: 'Início do período' },
  'Pick a valid role.': { es: 'Elige un rol válido.', pt: 'Escolha um papel válido.' },
  'Pick the account this deal belongs to.': {
    es: 'Elige la cuenta a la que pertenece este negocio.',
    pt: 'Escolha a conta à qual este negócio pertence.'
  },
  'Platform renewal': { es: 'Renovación de la plataforma', pt: 'Renovação da plataforma' },
  Postcode: { es: 'Código postal', pt: 'CEP' },
  Probability: { es: 'Probabilidad', pt: 'Probabilidade' },
  'Probability is a percentage between 0 and 100.': {
    es: 'La probabilidad es un porcentaje entre 0 y 100.',
    pt: 'A probabilidade é uma porcentagem entre 0 e 100.'
  },
  Product: { es: 'Producto', pt: 'Produto' },
  'Q3 revenue. Priya': { es: 'Ingresos del T3. Priya', pt: 'Receita do T3. Priya' },
  'Raise one': { es: 'Crea uno', pt: 'Crie um' },
  Reach: { es: 'Contactar', pt: 'Falar' },
  'Reachable on': { es: 'Contactable por', pt: 'Contato por' },
  Reactivate: { es: 'Reactivar', pt: 'Reativar' },
  required: { es: 'obligatorio', pt: 'obrigatório' },
  'required to convert': { es: 'obligatorio para convertir', pt: 'obrigatório para converter' },
  'Revenue won': { es: 'Ingresos ganados', pt: 'Receita ganha' },
  'reversible, nothing is created': {
    es: 'reversible, no se crea nada',
    pt: 'reversível, nada é criado'
  },
  'Running today': { es: 'En curso hoy', pt: 'Em andamento hoje' },
  'Save goal': { es: 'Guardar objetivo', pt: 'Salvar meta' },
  'Search goals by name': { es: 'Buscar objetivos por nombre', pt: 'Buscar metas por nome' },
  'Send invite': { es: 'Enviar invitación', pt: 'Enviar convite' },
  Settled: { es: 'Fijado', pt: 'Definido' },
  'Show inactive': { es: 'Mostrar inactivos', pt: 'Mostrar inativos' },
  'Showing all': { es: 'Mostrando todas', pt: 'Mostrando todas' },
  'Showing the first {n}.': {
    es: 'Mostrando los primeros {n}.',
    pt: 'Mostrando os primeiros {n}.'
  },
  'Slower than the calendar': {
    es: 'Más lento que el calendario',
    pt: 'Mais lento que o calendário'
  },
  'Some deal types count at an adjusted value': {
    es: 'Algunos tipos de negocio cuentan con un valor ajustado',
    pt: 'Alguns tipos de negócio contam com um valor ajustado'
  },
  'Sorted by revenue won': {
    es: 'Ordenado por ingresos ganados',
    pt: 'Ordenado por receita ganha'
  },
  'Sorted by value': { es: 'Ordenado por valor', pt: 'Ordenado por valor' },
  'Stage since': { es: 'En la etapa desde', pt: 'Na etapa desde' },
  stalled: { es: 'estancados', pt: 'parados' },
  'Still works here': { es: 'Sigue trabajando aquí', pt: 'Ainda trabalha aqui' },
  Target: { es: 'Meta', pt: 'Alvo' },
  'Target has to be a number greater than zero.': {
    es: 'La meta tiene que ser un número mayor que cero.',
    pt: 'O alvo tem que ser um número maior que zero.'
  },
  Team: { es: 'Equipo', pt: 'Equipe' },
  'That date has passed. Pick the date you now expect.': {
    es: 'Esa fecha ya pasó. Elige la que ahora esperas.',
    pt: 'Essa data já passou. Escolha a data que você espera agora.'
  },
  'That did not load': { es: 'Eso no cargó', pt: 'Isso não carregou' },
  'That does not look like an email address.': {
    es: 'Eso no parece un correo.',
    pt: 'Isso não parece um e-mail.'
  },
  'That goal does not exist, or you cannot see it.': {
    es: 'Ese objetivo no existe, o no puedes verlo.',
    pt: 'Essa meta não existe, ou você não pode vê-la.'
  },
  'That is not yours to change.': {
    es: 'Eso no te toca cambiarlo.',
    pt: 'Isso não cabe a você mudar.'
  },
  'That lead is not one you can move.': {
    es: 'Ese no es un prospecto que puedas mover.',
    pt: 'Esse não é um lead que você possa mover.'
  },
  'That record is not here': { es: 'Ese registro no está aquí', pt: 'Esse registro não está aqui' },
  'That’s everything due today.': {
    es: 'Eso es todo lo que vence hoy.',
    pt: 'É tudo o que vence hoje.'
  },
  'The account, contact and deal are ready.': {
    es: 'La cuenta, el contacto y el negocio están listos.',
    pt: 'A conta, o contato e o negócio estão prontos.'
  },
  'The account, contact and deal this lead became carry the work now. Converting again would build a second deal against the same account, and the API refuses it.':
    {
      es: 'La cuenta, el contacto y el negocio en los que se convirtió este prospecto llevan ahora el trabajo. Convertirlo otra vez armaría un segundo negocio contra la misma cuenta, y la API lo rechaza.',
      pt: 'A conta, o contato e o negócio em que este lead se tornou carregam o trabalho agora. Converter de novo criaria um segundo negócio na mesma conta, e a API recusa.'
    },
  'The date it actually closed, not the date you are recording it.': {
    es: 'La fecha en que de verdad cerró, no la fecha en que lo estás anotando.',
    pt: 'A data em que realmente fechou, não a data em que você está registrando.'
  },
  'The end has to be after the start.': {
    es: 'El final tiene que ser posterior al inicio.',
    pt: 'O fim tem que ser depois do início.'
  },
  'The org must keep at least one active admin': {
    es: 'La organización tiene que conservar al menos un administrador activo',
    pt: 'A organização tem que manter pelo menos um administrador ativo'
  },
  'The org must keep at least one admin': {
    es: 'La organización tiene que conservar al menos un administrador',
    pt: 'A organização tem que manter pelo menos um administrador'
  },
  'The server did not answer. Nothing you did caused this, and nothing was saved or lost.': {
    es: 'El servidor no respondió. Nada de lo que hiciste provocó esto, y no se guardó ni se perdió nada.',
    pt: 'O servidor não respondeu. Nada do que você fez causou isto, e nada foi salvo nem perdido.'
  },
  'The server refused this': { es: 'El servidor rechazó esto', pt: 'O servidor recusou isto' },
  'The server refused this contact': {
    es: 'El servidor rechazó este contacto',
    pt: 'O servidor recusou este contato'
  },
  'The server refused this deal': {
    es: 'El servidor rechazó este negocio',
    pt: 'O servidor recusou este negócio'
  },
  'The server refused this goal': {
    es: 'El servidor rechazó este objetivo',
    pt: 'O servidor recusou esta meta'
  },
  'The server refused this lead': {
    es: 'El servidor rechazó este prospecto',
    pt: 'O servidor recusou este lead'
  },
  'There is no way to reach {name} on this record: no email and no phone.': {
    es: 'No hay forma de llegar a {name} en este registro: sin correo y sin teléfono.',
    pt: 'Não há como falar com {name} neste registro: sem e-mail e sem telefone.'
  },
  'There is no way to reach {name} on this record: no email, and they asked not to be called.': {
    es: 'No hay forma de llegar a {name} en este registro: no hay correo y pidió que no lo llamen.',
    pt: 'Não há como falar com {name} neste registro: não há e-mail, e a pessoa pediu para não ligarem.'
  },
  'They asked not to be phoned. The number stays on the record.': {
    es: 'Pidió que no lo llamen. El número se queda en el registro.',
    pt: 'Pediu para não receber ligações. O número continua no registro.'
  },
  'this account': { es: 'esta cuenta', pt: 'esta conta' },
  'This form does not touch the {list} on this contact. They are edited where they live.': {
    es: 'Este formulario no toca {list} de este contacto. Se editan donde están.',
    pt: 'Este formulário não mexe em {list} deste contato. Eles são editados onde estão.'
  },
  'This form does not touch the {relations} on this account. They are edited where they live.': {
    es: 'Este formulario no toca {relations} de esta cuenta. Se editan donde están.',
    pt: 'Este formulário não mexe em {relations} desta conta. Eles são editados onde estão.'
  },
  'this lead': { es: 'este prospecto', pt: 'este lead' },
  'This lead has already been converted': {
    es: 'Este prospecto ya se convirtió',
    pt: 'Este lead já foi convertido'
  },
  'This period': { es: 'Este período', pt: 'Este período' },
  'This person asked not to be called': {
    es: 'Esta persona pidió que no la llamen',
    pt: 'Esta pessoa pediu para não ser chamada'
  },
  'This pipeline has no stages yet, so there is nowhere to move a lead.': {
    es: 'Este embudo aún no tiene etapas, así que no hay adónde mover un prospecto.',
    pt: 'Este funil ainda não tem etapas, então não há para onde mover um lead.'
  },
  'through the period': { es: 'transcurrido del período', pt: 'decorrido do período' },
  'Tick if they have already asked not to be phoned.': {
    es: 'Márcalo si ya pidió que no lo llamen.',
    pt: 'Marque se a pessoa já pediu para não receber ligações.'
  },
  Timeline: { es: 'Cronología', pt: 'Linha do tempo' },
  'token belongs': { es: 'token pertenece', pt: 'token pertence' },
  Tokens: { es: 'Tokens', pt: 'Tokens' },
  'tokens belong': { es: 'tokens pertenecen', pt: 'tokens pertencem' },
  'Try again': { es: 'Inténtalo de nuevo', pt: 'Tente de novo' },
  'Typed in, not linked to an account': {
    es: 'Escrita, no vinculada a una cuenta',
    pt: 'Digitada, não vinculada a uma conta'
  },
  'unworked for more than a week': {
    es: 'sin trabajar hace más de una semana',
    pt: 'sem trabalho há mais de uma semana'
  },
  'View account': { es: 'Ver cuenta', pt: 'Ver conta' },
  'View contact': { es: 'Ver contacto', pt: 'Ver contato' },
  'View deal': { es: 'Ver negocio', pt: 'Ver negócio' },
  'weighted ·': { es: 'ponderado ·', pt: 'ponderado ·' },
  'What is the target?': { es: '¿Cuál es la meta?', pt: 'Qual é o alvo?' },
  'What the deal would be worth if it lands.': {
    es: 'Lo que valdría el negocio si se cierra.',
    pt: 'Quanto o negócio valeria se fechar.'
  },
  'What this company turns over. Not what you have sold them. That is Revenue won, and it is counted from the deals.':
    {
      es: 'Lo que factura esta empresa. No lo que les has vendido. Eso es Ingresos ganados, y se cuenta desde los negocios.',
      pt: 'O quanto esta empresa fatura. Não o que você vendeu a ela. Isso é Receita ganha, e é contado a partir dos negócios.'
    },
  'When do you expect this to close?': {
    es: '¿Cuándo esperas que cierre?',
    pt: 'Quando você espera que feche?'
  },
  'When does the period end?': {
    es: '¿Cuándo termina el período?',
    pt: 'Quando o período termina?'
  },
  'When does the period start?': {
    es: '¿Cuándo empieza el período?',
    pt: 'Quando o período começa?'
  },
  'Where you stand': { es: 'Cómo vas', pt: 'Como você vai' },
  'Which person, and active or not?': {
    es: '¿Qué persona, y si está activa o no?',
    pt: 'Qual pessoa, e se está ativa ou não?'
  },
  'Which person, and to what role?': {
    es: '¿Qué persona, y a qué rol?',
    pt: 'Qual pessoa, e para qual papel?'
  },
  'Whole org': { es: 'Toda la organización', pt: 'Toda a organização' },
  'Whose goal': { es: 'De quién es el objetivo', pt: 'De quem é a meta' },
  'with a deal won': { es: 'con un negocio ganado', pt: 'com um negócio ganho' },
  Won: { es: 'Ganado', pt: 'Ganho' },
  'Worth {amount} and nobody owns it. Assign an owner before it goes cold.': {
    es: 'Vale {amount} y nadie es responsable. Asigna uno antes de que se enfríe.',
    pt: 'Vale {amount} e ninguém é responsável. Atribua um antes que esfrie.'
  },
  'Write a note or attach a file before you save.': {
    es: 'Escribe una nota o adjunta un archivo antes de guardar.',
    pt: 'Escreva uma nota ou anexe um arquivo antes de salvar.'
  },
  'Write something before you save the note.': {
    es: 'Escribe algo antes de guardar la nota.',
    pt: 'Escreva algo antes de salvar a nota.'
  },
  'Yesterday you cleared': { es: 'Ayer resolviste', pt: 'Ontem você resolveu' },
  'you actually talk to.': {
    es: 'con quien de verdad hablas.',
    pt: 'com quem você realmente fala.'
  },
  'You do not have access to this': {
    es: 'No tienes acceso a esto',
    pt: 'Você não tem acesso a isto'
  }
};

addMessages(messages);
