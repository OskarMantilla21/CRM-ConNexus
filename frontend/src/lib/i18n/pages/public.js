import { addMessages } from '../translate.js';

/**
 * Copy for signed-out screens, the customer portal, and shared components.
 * English is the key. Spanish is neutral `tú`. Portuguese is Brazilian `você`.
 *
 * @type {Record<string, { es: string, pt: string }>}
 */
export const messages = {
  // Signed-out chrome
  'Signing you in · ConNexus-CRM': {
    es: 'Entrando · ConNexus-CRM',
    pt: 'Entrando · ConNexus-CRM'
  },
  'Signing you in…': { es: 'Entrando…', pt: 'Entrando…' },
  'Sign in with your username and password.': {
    es: 'Entra con tu usuario y tu contraseña.',
    pt: 'Entre com seu usuário e sua senha.'
  },
  Username: { es: 'Usuario', pt: 'Usuário' },
  Password: { es: 'Contraseña', pt: 'Senha' },
  'Username and password are required': {
    es: 'El usuario y la contraseña son obligatorios.',
    pt: 'O usuário e a senha são obrigatórios.'
  },
  'Invalid username or password': {
    es: 'Usuario o contraseña incorrectos.',
    pt: 'Usuário ou senha incorretos.'
  },
  'Too many sign-in attempts. Wait a few minutes and try again.': {
    es: 'Demasiados intentos. Espera unos minutos e inténtalo de nuevo.',
    pt: 'Muitas tentativas. Espere alguns minutos e tente de novo.'
  },
  'User account is disabled': {
    es: 'Esta cuenta está desactivada.',
    pt: 'Esta conta está desativada.'
  },
  'Choose organisation · ConNexus-CRM': {
    es: 'Elegir organización · ConNexus-CRM',
    pt: 'Escolher organização · ConNexus-CRM'
  },
  'Choose an organisation': { es: 'Elige una organización', pt: 'Escolha uma organização' },
  "Pick the workspace you'd like to open.": {
    es: 'Elige el espacio de trabajo que quieres abrir.',
    pt: 'Escolha o espaço de trabalho que quer abrir.'
  },
  'Create your first workspace to get started.': {
    es: 'Crea tu primer espacio de trabajo para empezar.',
    pt: 'Crie seu primeiro espaço de trabalho para começar.'
  },
  'Create new organisation': { es: 'Crear nueva organización', pt: 'Criar nova organização' },
  'No organisations yet': { es: 'Aún no hay organizaciones', pt: 'Ainda não há organizações' },
  'Create your first workspace to start using ConNexus-CRM.': {
    es: 'Crea tu primer espacio de trabajo para empezar a usar ConNexus-CRM.',
    pt: 'Crie seu primeiro espaço de trabalho para começar a usar o ConNexus-CRM.'
  },
  'Create organisation': { es: 'Crear organización', pt: 'Criar organização' },
  'Create organisation · ConNexus-CRM': {
    es: 'Crear organización · ConNexus-CRM',
    pt: 'Criar organização · ConNexus-CRM'
  },
  'Set up a new workspace for your team.': {
    es: 'Configura un espacio de trabajo nuevo para tu equipo.',
    pt: 'Configure um espaço de trabalho novo para a sua equipe.'
  },
  'Organisation name': { es: 'Nombre de la organización', pt: 'Nome da organização' },
  'e.g. Acme Inc.': { es: 'p. ej. Acme Inc.', pt: 'p. ex. Acme Inc.' },
  'This becomes your workspace name in ConNexus-CRM.': {
    es: 'Este será el nombre de tu espacio de trabajo en ConNexus-CRM.',
    pt: 'Este será o nome do seu espaço de trabalho no ConNexus-CRM.'
  },
  'Time zone': { es: 'Zona horaria', pt: 'Fuso horário' },
  'Sets when a day starts here, so "due today" and "overdue" mean what your team expects. You can change it later in Settings.':
    {
      es: 'Define cuándo empieza el día aquí, para que "vence hoy" y "vencido" signifiquen lo que tu equipo espera. Puedes cambiarlo después en Configuración.',
      pt: 'Define quando o dia começa aqui, para que "vence hoje" e "vencido" signifiquem o que a equipe espera. Você pode mudar isso depois em Configurações.'
    },
  'What kind of business is this?': {
    es: '¿Qué tipo de negocio es?',
    pt: 'Que tipo de negócio é este?'
  },
  'Sets up a starter pipeline, tags and fields for your industry. You can change everything later.':
    {
      es: 'Prepara un embudo, etiquetas y campos iniciales para tu sector. Puedes cambiarlo todo después.',
      pt: 'Prepara um funil, etiquetas e campos iniciais para o seu setor. Você pode mudar tudo depois.'
    },
  'Skip for now': { es: 'Omitir por ahora', pt: 'Pular por agora' },
  'Start with a blank workspace.': {
    es: 'Empieza con un espacio de trabajo en blanco.',
    pt: 'Comece com um espaço de trabalho em branco.'
  },
  "Couldn't create organisation": {
    es: 'No se pudo crear la organización',
    pt: 'Não foi possível criar a organização'
  },
  'Please try again.': { es: 'Inténtalo de nuevo.', pt: 'Tente de novo.' },
  'Organisation created': { es: 'Organización creada', pt: 'Organização criada' },
  'Taking you to your workspaces…': {
    es: 'Te llevamos a tus espacios de trabajo…',
    pt: 'Levando você aos seus espaços de trabalho…'
  },
  'Creating…': { es: 'Creando…', pt: 'Criando…' },
  Created: { es: 'Creada', pt: 'Criada' },
  'Back to organisations': { es: 'Volver a las organizaciones', pt: 'Voltar às organizações' },
  'You must be logged in to create an organization': {
    es: 'Debes iniciar sesión para crear una organización',
    pt: 'Você precisa entrar para criar uma organização'
  },
  'Organization name is required': {
    es: 'El nombre de la organización es obligatorio',
    pt: 'O nome da organização é obrigatório'
  },
  'Authentication required': { es: 'Hace falta autenticación', pt: 'Autenticação necessária' },
  'Organization with this name may already exist': {
    es: 'Puede que ya exista una organización con este nombre',
    pt: 'Já pode existir uma organização com este nome'
  },
  'An unexpected error occurred while creating the organization.': {
    es: 'Ocurrió un error inesperado al crear la organización.',
    pt: 'Ocorreu um erro inesperado ao criar a organização.'
  },
  'Invalid Organization ID': {
    es: 'El identificador de la organización no es válido',
    pt: 'O identificador da organização é inválido'
  },
  'Failed to switch organization': {
    es: 'No se pudo cambiar de organización',
    pt: 'Não foi possível trocar de organização'
  },
  ADMIN: { es: 'Administrador', pt: 'Administrador' },
  USER: { es: 'Usuario', pt: 'Usuário' },
  member: { es: 'miembro', pt: 'membro' },

  // Magic-link confirm
  'Link expired or invalid': {
    es: 'El enlace caducó o no es válido',
    pt: 'O link expirou ou é inválido'
  },
  'Back to sign in': { es: 'Volver a iniciar sesión', pt: 'Voltar para entrar' },
  'Sign in to ConNexus-CRM': { es: 'Entra en ConNexus-CRM', pt: 'Entre no ConNexus-CRM' },
  'Press the button to finish signing in.': {
    es: 'Pulsa el botón para terminar de entrar.',
    pt: 'Aperte o botão para concluir o acesso.'
  },
  'Signing in…': { es: 'Entrando…', pt: 'Entrando…' },
  'Continue to ConNexus-CRM': { es: 'Continuar a ConNexus-CRM', pt: 'Continuar para o ConNexus-CRM' },

  // Platform directory (the screen was written in Spanish; English is the source)
  'User directory · ConNexus-CRM': {
    es: 'Directorio de usuarios · ConNexus-CRM',
    pt: 'Diretório de usuários · ConNexus-CRM'
  },
  'User directory': { es: 'Directorio de usuarios', pt: 'Diretório de usuários' },
  'This role sees who has an account and which company they belong to. It does not open customers, invoices, or payments.':
    {
      es: 'Este rol ve quién tiene cuenta y en qué empresa está. No abre clientes, facturas ni pagos.',
      pt: 'Este papel vê quem tem conta e em qual empresa está. Não abre clientes, faturas nem pagamentos.'
    },
  'No users.': { es: 'No hay usuarios.', pt: 'Não há usuários.' },
  Inactive: { es: 'Inactivo', pt: 'Inativo' },
  'platform admin': { es: 'super rol', pt: 'superpapel' },
  'No organisation': { es: 'Sin empresa', pt: 'Sem empresa' },
  'Could not load the user directory.': {
    es: 'No se pudo cargar el directorio de usuarios.',
    pt: 'Não foi possível carregar o diretório de usuários.'
  },

  // Help center
  'Help center': { es: 'Centro de ayuda', pt: 'Central de ajuda' },
  'How can we help?': { es: '¿Cómo podemos ayudarte?', pt: 'Como podemos ajudar?' },
  'Search help articles': { es: 'Buscar artículos de ayuda', pt: 'Buscar artigos de ajuda' },
  'Search for an answer': { es: 'Busca una respuesta', pt: 'Busque uma resposta' },
  '1 article matches "{query}".': {
    es: '1 artículo coincide con "{query}".',
    pt: '1 artigo corresponde a "{query}".'
  },
  '{n} articles match "{query}".': {
    es: '{n} artículos coinciden con "{query}".',
    pt: '{n} artigos correspondem a "{query}".'
  },
  '1 article matches': { es: '1 artículo coincide con', pt: '1 artigo corresponde a' },
  '{n} articles match': { es: '{n} artículos coinciden con', pt: '{n} artigos correspondem a' },
  'Show all': { es: 'Ver todos', pt: 'Ver todos' },
  'Nothing matches that. Try a different word.': {
    es: 'Nada coincide. Prueba con otra palabra.',
    pt: 'Nada corresponde. Tente outra palavra.'
  },
  'There are no help articles here yet.': {
    es: 'Todavía no hay artículos de ayuda aquí.',
    pt: 'Ainda não há artigos de ajuda aqui.'
  },
  Pages: { es: 'Páginas', pt: 'Páginas' },
  'Page {page} of {pages}': { es: 'Página {page} de {pages}', pt: 'Página {page} de {pages}' },
  'All help articles': { es: 'Todos los artículos de ayuda', pt: 'Todos os artigos de ajuda' },
  'Updated {date}': { es: 'Actualizado el {date}', pt: 'Atualizado em {date}' },
  Updated: { es: 'Actualizado', pt: 'Atualizado' },
  'Related articles': { es: 'Artículos relacionados', pt: 'Artigos relacionados' },
  'Search: {query} | {name} help center': {
    es: 'Búsqueda: {query} | Centro de ayuda de {name}',
    pt: 'Busca: {query} | Central de ajuda de {name}'
  },
  '{name} help center': {
    es: 'Centro de ayuda de {name}',
    pt: 'Central de ajuda de {name}'
  },
  'Answers and guides from {name}.': {
    es: 'Respuestas y guías de {name}.',
    pt: 'Respostas e guias de {name}.'
  },
  '{title} | {name} help center': {
    es: '{title} | Centro de ayuda de {name}',
    pt: '{title} | Central de ajuda de {name}'
  },

  // Customer portal
  'Sign in to support': { es: 'Entrar a soporte', pt: 'Entrar no suporte' },
  'Your support requests': { es: 'Tus solicitudes de soporte', pt: 'Suas solicitações de suporte' },
  'If {email} is on file, we have sent it a six digit code. It expires in 10 minutes.': {
    es: 'Si {email} está registrado, le enviamos un código de seis dígitos. Caduca en 10 minutos.',
    pt: 'Se {email} estiver cadastrado, enviamos um código de seis dígitos. Ele expira em 10 minutos.'
  },
  Code: { es: 'Código', pt: 'Código' },
  'Send a new code': { es: 'Enviar un código nuevo', pt: 'Enviar um código novo' },
  'Enter the email address you use with this company and we will send you a sign-in code.': {
    es: 'Escribe el correo que usas con esta empresa y te enviaremos un código para entrar.',
    pt: 'Digite o e-mail que você usa com esta empresa e enviaremos um código de acesso.'
  },
  'Email me a code': { es: 'Envíame un código', pt: 'Envie-me um código' },
  'Enter your email address.': { es: 'Escribe tu correo.', pt: 'Digite seu e-mail.' },
  'Enter the code from your email.': {
    es: 'Escribe el código de tu correo.',
    pt: 'Digite o código do seu e-mail.'
  },
  'That code is not valid. Request a new one.': {
    es: 'Ese código no es válido. Pide uno nuevo.',
    pt: 'Esse código não é válido. Peça um novo.'
  },
  'Your requests': { es: 'Tus solicitudes', pt: 'Suas solicitações' },
  'New request': { es: 'Nueva solicitud', pt: 'Nova solicitação' },
  'What do you need help with?': {
    es: '¿Con qué necesitas ayuda?',
    pt: 'Com o que você precisa de ajuda?'
  },
  'Short summary': { es: 'Resumen breve', pt: 'Resumo curto' },
  'These might already answer it': {
    es: 'Esto podría responderlo',
    pt: 'Isto pode já responder'
  },
  'Any detail that would help': {
    es: 'Cualquier detalle que ayude',
    pt: 'Qualquer detalhe que ajude'
  },
  'How urgent is it?': { es: '¿Qué tan urgente es?', pt: 'Qual é a urgência?' },
  'Send request': { es: 'Enviar solicitud', pt: 'Enviar solicitação' },
  'You have no {status} requests.': {
    es: 'No tienes solicitudes {status}.',
    pt: 'Você não tem solicitações {status}.'
  },
  new: { es: 'nuevas', pt: 'novas' },
  pending: { es: 'pendientes', pt: 'pendentes' },
  closed: { es: 'cerradas', pt: 'fechadas' },
  'You have not sent us any requests yet.': {
    es: 'Todavía no nos has enviado ninguna solicitud.',
    pt: 'Você ainda não nos enviou nenhuma solicitação.'
  },
  'Give your request a short summary.': {
    es: 'Ponle un resumen breve a tu solicitud.',
    pt: 'Dê um resumo curto à sua solicitação.'
  },
  'Could not send that request.': {
    es: 'No se pudo enviar esa solicitud.',
    pt: 'Não foi possível enviar essa solicitação.'
  },
  'Back to your requests': { es: 'Volver a tus solicitudes', pt: 'Voltar às suas solicitações' },
  'No replies yet. We will email you when support responds.': {
    es: 'Aún no hay respuestas. Te escribiremos cuando soporte responda.',
    pt: 'Ainda não há respostas. Enviaremos um e-mail quando o suporte responder.'
  },
  'Add a reply': { es: 'Añadir una respuesta', pt: 'Adicionar uma resposta' },
  'Type your message': { es: 'Escribe tu mensaje', pt: 'Digite sua mensagem' },
  'Send reply': { es: 'Enviar respuesta', pt: 'Enviar resposta' },
  'Request not found': { es: 'Solicitud no encontrada', pt: 'Solicitação não encontrada' },
  'Write a message before sending.': {
    es: 'Escribe un mensaje antes de enviar.',
    pt: 'Escreva uma mensagem antes de enviar.'
  },
  'Could not send that reply.': {
    es: 'No se pudo enviar esa respuesta.',
    pt: 'Não foi possível enviar essa resposta.'
  },
  'Help articles': { es: 'Artículos de ayuda', pt: 'Artigos de ajuda' },
  'Nothing matches "{query}". Try a different word, or send us a request.': {
    es: 'Nada coincide con "{query}". Prueba con otra palabra o envíanos una solicitud.',
    pt: 'Nada corresponde a "{query}". Tente outra palavra ou envie uma solicitação.'
  },
  'There are no help articles yet.': {
    es: 'Todavía no hay artículos de ayuda.',
    pt: 'Ainda não há artigos de ajuda.'
  },
  'Back to help articles': {
    es: 'Volver a los artículos de ayuda',
    pt: 'Voltar aos artigos de ajuda'
  },
  'Still stuck?': { es: '¿Sigues atascado?', pt: 'Ainda travou?' },
  'Send us a request': { es: 'Envíanos una solicitud', pt: 'Envie uma solicitação' },
  'Article not found': { es: 'Artículo no encontrado', pt: 'Artigo não encontrado' },

  // Invoice and estimate
  Invoice: { es: 'Factura', pt: 'Fatura' },
  '{number} from {name}': { es: '{number} de {name}', pt: '{number} de {name}' },
  'Invoice {number} · issued {date}': {
    es: 'Factura {number} · emitida el {date}',
    pt: 'Fatura {number} · emitida em {date}'
  },
  'Download this invoice as a PDF': {
    es: 'Descargar esta factura en PDF',
    pt: 'Baixar esta fatura em PDF'
  },
  'Paid in full': { es: 'Pagada por completo', pt: 'Paga integralmente' },
  'Nothing is outstanding on this invoice. It is here for your records.': {
    es: 'No queda nada pendiente en esta factura. Está aquí para tus registros.',
    pt: 'Não há nada em aberto nesta fatura. Ela fica aqui para os seus registros.'
  },
  'Amount due': { es: 'Importe a pagar', pt: 'Valor a pagar' },
  'Due {date}, {when}': { es: 'Vence el {date}, {when}', pt: 'Vence em {date}, {when}' },
  'on receipt': { es: 'al recibir', pt: 'no recebimento' },
  'in 1 day': { es: 'dentro de 1 día', pt: 'em 1 dia' },
  '1 day ago': { es: 'hace 1 día', pt: 'há 1 dia' },
  '· {paid} of {total} already received': {
    es: '· {paid} de {total} ya recibido',
    pt: '· {paid} de {total} já recebido'
  },
  'How to pay': { es: 'Cómo pagar', pt: 'Como pagar' },
  Reference: { es: 'Referencia', pt: 'Referência' },
  Amount: { es: 'Importe', pt: 'Valor' },
  'Billed to': { es: 'Facturado a', pt: 'Faturado para' },
  'What this covers': { es: 'Qué incluye', pt: 'O que isto cobre' },
  'Payments received': { es: 'Pagos recibidos', pt: 'Pagamentos recebidos' },
  remaining: { es: 'restante', pt: 'restante' },
  Notes: { es: 'Notas', pt: 'Notas' },
  'Questions about this invoice? Reply to the email it arrived with.': {
    es: '¿Dudas sobre esta factura? Responde al correo con el que llegó.',
    pt: 'Dúvidas sobre esta fatura? Responda ao e-mail em que ela chegou.'
  },
  'Invoice token is required': {
    es: 'Hace falta el token de la factura',
    pt: 'O token da fatura é obrigatório'
  },
  'Invoice not found or link has expired': {
    es: 'Factura no encontrada o el enlace caducó',
    pt: 'Fatura não encontrada ou o link expirou'
  },
  'Failed to load invoice': {
    es: 'No se pudo cargar la factura',
    pt: 'Não foi possível carregar a fatura'
  },
  'Estimate {number} · issued {date}': {
    es: 'Presupuesto {number} · emitido el {date}',
    pt: 'Orçamento {number} · emitido em {date}'
  },
  Estimate: { es: 'Presupuesto', pt: 'Orçamento' },
  'Download this estimate as a PDF': {
    es: 'Descargar este presupuesto en PDF',
    pt: 'Baixar este orçamento em PDF'
  },
  'Total if accepted': { es: 'Total si se acepta', pt: 'Total se aceito' },
  'Expired {date}': { es: 'Venció el {date}', pt: 'Expirou em {date}' },
  'Valid until end of today': { es: 'Válido hasta el final de hoy', pt: 'Válido até o fim de hoje' },
  'Valid until {date} · {n} {unit} left': {
    es: 'Válido hasta el {date} · quedan {n} {unit}',
    pt: 'Válido até {date} · restam {n} {unit}'
  },
  day: { es: 'día', pt: 'dia' },
  days: { es: 'días', pt: 'dias' },
  'No expiry date set': { es: 'Sin fecha de vencimiento', pt: 'Sem data de validade' },
  'This estimate has expired': {
    es: 'Este presupuesto ha vencido',
    pt: 'Este orçamento expirou'
  },
  'Prices were held until {date}. Reply to the email this link came from and {org} can send a current quote.':
    {
      es: 'Los precios se mantuvieron hasta el {date}. Responde al correo del que salió este enlace y {org} puede enviarte un presupuesto actualizado.',
      pt: 'Os preços valeram até {date}. Responda ao e-mail de onde saiu este link e {org} pode enviar um orçamento atual.'
    },
  'Ready to go ahead?': { es: '¿Seguimos adelante?', pt: 'Vamos em frente?' },
  'Accepting authorises {org} to invoice you for the amounts above.': {
    es: 'Aceptar autoriza a {org} a facturarte los importes de arriba.',
    pt: 'Aceitar autoriza {org} a faturar os valores acima.'
  },
  'Accept this estimate': { es: 'Aceptar este presupuesto', pt: 'Aceitar este orçamento' },
  Decline: { es: 'Rechazar', pt: 'Recusar' },
  'Confirm acceptance of {total}': {
    es: 'Confirmar la aceptación de {total}',
    pt: 'Confirmar a aceitação de {total}'
  },
  'This tells {org} to raise an invoice. It cannot be undone from this page.': {
    es: 'Esto le dice a {org} que emita una factura. No se puede deshacer desde esta página.',
    pt: 'Isto diz a {org} para emitir uma fatura. Não dá para desfazer nesta página.'
  },
  'Your name': { es: 'Tu nombre', pt: 'Seu nome' },
  'Who is accepting': { es: 'Quién acepta', pt: 'Quem está aceitando' },
  'Your email': { es: 'Tu correo', pt: 'Seu e-mail' },
  'Recorded with your acceptance: {org} keeps this as the record of who authorised the invoice.': {
    es: 'Queda registrado con tu aceptación: {org} lo guarda como constancia de quién autorizó la factura.',
    pt: 'Fica registrado com a sua aceitação: {org} guarda isto como o registro de quem autorizou a fatura.'
  },
  'Accepting…': { es: 'Aceptando…', pt: 'Aceitando…' },
  'Yes, accept': { es: 'Sí, aceptar', pt: 'Sim, aceitar' },
  'Go back': { es: 'Volver', pt: 'Voltar' },
  'Prepared for': { es: 'Preparado para', pt: 'Preparado para' },
  'What is included': { es: 'Qué está incluido', pt: 'O que está incluído' },
  'Questions? Reply to the email this estimate arrived with.': {
    es: '¿Dudas? Responde al correo con el que llegó este presupuesto.',
    pt: 'Dúvidas? Responda ao e-mail em que este orçamento chegou.'
  },
  '{org} has been notified and will raise an invoice for {total}. A copy has been sent to {email}.':
    {
      es: 'Avisamos a {org} y emitirá una factura por {total}. Enviamos una copia a {email}.',
      pt: '{org} foi avisada e vai emitir uma fatura de {total}. Uma cópia foi enviada para {email}.'
    },
  '{org} has been notified. If you declined by mistake, reply to the email this link came from. This page cannot undo it.':
    {
      es: 'Avisamos a {org}. Si rechazaste por error, responde al correo del que salió este enlace. Esta página no puede deshacerlo.',
      pt: '{org} foi avisada. Se você recusou por engano, responda ao e-mail de onde saiu este link. Esta página não pode desfazer.'
    },
  'Estimate token is required': {
    es: 'Hace falta el token del presupuesto',
    pt: 'O token do orçamento é obrigatório'
  },
  'Estimate not found or link has expired': {
    es: 'Presupuesto no encontrado o el enlace caducó',
    pt: 'Orçamento não encontrado ou o link expirou'
  },
  'Failed to load estimate': {
    es: 'No se pudo cargar el presupuesto',
    pt: 'Não foi possível carregar o orçamento'
  },
  'Please enter your name and email to accept this estimate.': {
    es: 'Escribe tu nombre y tu correo para aceptar este presupuesto.',
    pt: 'Digite seu nome e e-mail para aceitar este orçamento.'
  },
  'Failed to accept estimate': {
    es: 'No se pudo aceptar el presupuesto',
    pt: 'Não foi possível aceitar o orçamento'
  },
  'Failed to decline estimate': {
    es: 'No se pudo rechazar el presupuesto',
    pt: 'Não foi possível recusar o orçamento'
  },
  Item: { es: 'Concepto', pt: 'Item' },
  Qty: { es: 'Cant.', pt: 'Qtd.' },
  'Unit price': { es: 'Precio unitario', pt: 'Preço unitário' },
  Subtotal: { es: 'Subtotal', pt: 'Subtotal' },
  'Discount ({percent}%)': { es: 'Descuento ({percent}%)', pt: 'Desconto ({percent}%)' },
  Discount: { es: 'Descuento', pt: 'Desconto' },
  'Tax ({rate}%)': { es: 'Impuesto ({rate}%)', pt: 'Imposto ({rate}%)' },
  Shipping: { es: 'Envío', pt: 'Frete' },
  Total: { es: 'Total', pt: 'Total' },

  // CSAT
  'How did we do?, {org}': { es: '¿Qué tal lo hicimos?, {org}', pt: 'Como foi?, {org}' },
  Feedback: { es: 'Comentarios', pt: 'Feedback' },
  'This survey has closed': { es: 'Esta encuesta se cerró', pt: 'Esta pesquisa foi encerrada' },
  'Survey links stay open for a limited time after a ticket is closed. If there is still something you want the team to know, reply to the email this link came from and it will reach them.':
    {
      es: 'Los enlaces de la encuesta siguen abiertos un tiempo limitado después de cerrar un ticket. Si aún quieres contarle algo al equipo, responde al correo del que salió este enlace y les llegará.',
      pt: 'Os links da pesquisa ficam abertos por um tempo limitado depois que um chamado é fechado. Se ainda quiser contar algo à equipe, responda ao e-mail de onde saiu este link.'
    },
  "This link isn't valid": { es: 'Este enlace no es válido', pt: 'Este link não é válido' },
  "We couldn't verify this link. Please use the most recent one from your email.": {
    es: 'No pudimos verificar este enlace. Usa el más reciente de tu correo.',
    pt: 'Não conseguimos verificar este link. Use o mais recente do seu e-mail.'
  },
  'Something went wrong': { es: 'Algo salió mal', pt: 'Algo deu errado' },
  'Thank you': { es: 'Gracias', pt: 'Obrigado' },
  'Your rating of {rating} of 5 went straight to {who} and their team lead. You can change it for the next 24 hours by reopening this link.':
    {
      es: 'Tu valoración de {rating} de 5 fue directa a {who} y a quien lidera su equipo. Puedes cambiarla durante las próximas 24 horas reabriendo este enlace.',
      pt: 'Sua nota de {rating} de 5 foi direto para {who} e para a liderança da equipe. Você pode mudá-la nas próximas 24 horas reabrindo este link.'
    },
  'the team': { es: 'el equipo', pt: 'a equipe' },
  'How did we do?': { es: '¿Qué tal lo hicimos?', pt: 'Como foi?' },
  '{name} closed your request {when},': {
    es: '{name} cerró tu solicitud {when},',
    pt: '{name} fechou sua solicitação {when},'
  },
  '{name} handled your request,': {
    es: '{name} atendió tu solicitud,',
    pt: '{name} atendeu sua solicitação,'
  },
  'You rated this {rating} of 5 {when}. You can change it until {until}.': {
    es: 'Valoraste esto con {rating} de 5 {when}. Puedes cambiarlo hasta el {until}.',
    pt: 'Você avaliou isto com {rating} de 5 {when}. Pode mudar até {until}.'
  },
  'Rate from 1 to 5': { es: 'Valora de 1 a 5', pt: 'Avalie de 1 a 5' },
  '{n}. {label}': { es: '{n}. {label}', pt: '{n}. {label}' },
  'Not good': { es: 'Nada bien', pt: 'Ruim' },
  Great: { es: 'Genial', pt: 'Ótimo' },
  'Anything you want to add?': { es: '¿Quieres añadir algo?', pt: 'Quer acrescentar algo?' },
  Optional: { es: 'Opcional', pt: 'Opcional' },
  'What went wrong? This goes to the team lead, not just the agent.': {
    es: '¿Qué salió mal? Esto llega a quien lidera el equipo, no solo al agente.',
    pt: 'O que deu errado? Isto vai para a liderança da equipe, não só para o agente.'
  },
  'What worked well?': { es: '¿Qué funcionó bien?', pt: 'O que funcionou bem?' },
  'Update my rating': { es: 'Actualizar mi valoración', pt: 'Atualizar minha nota' },
  Send: { es: 'Enviar', pt: 'Enviar' },
  "Your answer goes to {org}'s support team. It is not published anywhere.": {
    es: 'Tu respuesta llega al equipo de soporte de {org}. No se publica en ningún sitio.',
    pt: 'Sua resposta vai para a equipe de suporte de {org}. Ela não é publicada em lugar nenhum.'
  },
  'Server returned {status}': {
    es: 'El servidor respondió {status}',
    pt: 'O servidor retornou {status}'
  },
  'Please pick a rating between 1 and 5.': {
    es: 'Elige una valoración entre 1 y 5.',
    pt: 'Escolha uma nota entre 1 e 5.'
  },
  'This survey link has expired.': {
    es: 'Este enlace de la encuesta caducó.',
    pt: 'Este link da pesquisa expirou.'
  },
  'This survey is locked. The edit window has closed.': {
    es: 'Esta encuesta está bloqueada. El plazo para editarla se cerró.',
    pt: 'Esta pesquisa está bloqueada. O prazo para editar já fechou.'
  },

  // Errors
  'Not Found': { es: 'No encontrado', pt: 'Não encontrado' },
  Error: { es: 'Error', pt: 'Erro' },
  'Page not found': { es: 'Página no encontrada', pt: 'Página não encontrada' },
  "You don't have access to this page": {
    es: 'No tienes acceso a esta página',
    pt: 'Você não tem acesso a esta página'
  },
  'Please sign in to continue': {
    es: 'Inicia sesión para continuar',
    pt: 'Entre para continuar'
  },
  'Unable to open this page': {
    es: 'No se puede abrir esta página',
    pt: 'Não foi possível abrir esta página'
  },
  "The page you're looking for doesn't exist or may have been moved.": {
    es: 'La página que buscas no existe o puede haberse movido.',
    pt: 'A página que você procura não existe ou pode ter sido movida.'
  },
  'Your account does not have permission to view this resource.': {
    es: 'Tu cuenta no tiene permiso para ver este recurso.',
    pt: 'Sua conta não tem permissão para ver este recurso.'
  },
  'Your session may have expired. Sign in again to continue.': {
    es: 'Puede que tu sesión haya caducado. Vuelve a entrar para continuar.',
    pt: 'Sua sessão pode ter expirado. Entre de novo para continuar.'
  },
  "An unexpected error occurred on our end. We've been notified. Please try again in a moment.": {
    es: 'Ocurrió un error inesperado de nuestro lado. Ya nos avisaron. Inténtalo de nuevo en un momento.',
    pt: 'Ocorreu um erro inesperado do nosso lado. Já fomos avisados. Tente de novo em instantes.'
  },
  'Please check the URL or try going back to where you came from.': {
    es: 'Revisa la URL o vuelve a donde estabas.',
    pt: 'Confira a URL ou volte para onde você estava.'
  },
  'Go to dashboard': { es: 'Ir al panel', pt: 'Ir para o painel' },
  Dashboard: { es: 'Panel', pt: 'Painel' },
  'Try one of these': { es: 'Prueba una de estas', pt: 'Tente uma destas' },

  // Shared v2 components
  'Next action': { es: 'Siguiente acción', pt: 'Próxima ação' },
  Confirm: { es: 'Confirmar', pt: 'Confirmar' },
  'Weight by deal type': { es: 'Ponderar por tipo de negocio', pt: 'Ponderar por tipo de negócio' },
  '{n} adjusted': { es: '{n} ajustados', pt: '{n} ajustados' },
  Hide: { es: 'Ocultar', pt: 'Ocultar' },
  Show: { es: 'Mostrar', pt: 'Mostrar' },
  'A multiplier on each closed-won deal of that type. Leave a box empty to count that type in full. At 0.5 a 20,000 renewal counts as 10,000; at 0 it does not count at all.':
    {
      es: 'Un multiplicador por cada negocio ganado de ese tipo. Deja una casilla vacía para contar ese tipo completo. Con 0,5 una renovación de 20.000 cuenta como 10.000; con 0 no cuenta.',
      pt: 'Um multiplicador em cada negócio ganho desse tipo. Deixe uma caixa vazia para contar esse tipo por inteiro. Em 0,5 uma renovação de 20.000 conta como 10.000; em 0 não conta.'
    },
  'Possible duplicate': { es: 'Posible duplicado', pt: 'Possível duplicata' },
  'Possible duplicates': { es: 'Posibles duplicados', pt: 'Possíveis duplicatas' },
  '· same {field}': { es: '· mismo {field}', pt: '· mesmo {field}' },
  ' · same {field}': { es: ' · mismo {field}', pt: ' · mesmo {field}' },
  'You can still save. If it is the same one, open it instead, or merge the two afterwards.': {
    es: 'Aún puedes guardar. Si es el mismo, ábrelo, o fusiona los dos después.',
    pt: 'Você ainda pode salvar. Se for o mesmo, abra-o, ou una os dois depois.'
  },
  Compare: { es: 'Comparar', pt: 'Comparar' },
  'Only an admin or whoever created one of them can merge these.': {
    es: 'Solo un administrador o quien creó uno de ellos puede fusionarlos.',
    pt: 'Só um administrador ou quem criou um deles pode unir estes.'
  },
  Currency: { es: 'Moneda', pt: 'Moeda' },
  'Each currency on its own; there are no exchange rates to combine them.': {
    es: 'Cada moneda por separado; no hay tipos de cambio para combinarlas.',
    pt: 'Cada moeda por conta própria; não há câmbio para combiná-las.'
  },
  'Stage: {name}': { es: 'Etapa: {name}', pt: 'Etapa: {name}' },
  Section: { es: 'Sección', pt: 'Seção' },
  Queue: { es: 'Cola', pt: 'Fila' },
  Approvals: { es: 'Aprobaciones', pt: 'Aprovações' },
  Analytics: { es: 'Analítica', pt: 'Análises' },
  'Task list': { es: 'Lista de tareas', pt: 'Lista de tarefas' },
  Boards: { es: 'Tableros', pt: 'Quadros' },
  Calendar: { es: 'Calendario', pt: 'Calendário' },
  Recurring: { es: 'Recurrentes', pt: 'Recorrentes' },
  Products: { es: 'Productos', pt: 'Produtos' },
  Reports: { es: 'Informes', pt: 'Relatórios' },
  Templates: { es: 'Plantillas', pt: 'Modelos' },
  'Saved views': { es: 'Vistas guardadas', pt: 'Visões salvas' },
  'No saved views yet. Filter the list, then save it here.': {
    es: 'Aún no hay vistas guardadas. Filtra la lista y guárdala aquí.',
    pt: 'Ainda não há visões salvas. Filtre a lista e salve aqui.'
  },
  'New name for {name}': { es: 'Nuevo nombre para {name}', pt: 'Novo nome para {name}' },
  Rename: { es: 'Renombrar', pt: 'Renomear' },
  'Rename {name}': { es: 'Renombrar {name}', pt: 'Renomear {name}' },
  '1 filter value this page cannot apply': {
    es: '1 valor de filtro que esta página no puede aplicar',
    pt: '1 valor de filtro que esta página não pode aplicar'
  },
  '{n} filter values this page cannot apply': {
    es: '{n} valores de filtro que esta página no puede aplicar',
    pt: '{n} valores de filtro que esta página não pode aplicar'
  },
  'Delete view': { es: 'Eliminar vista', pt: 'Excluir visão' },
  'This list keeps at most {n} saved views. Delete one to save another.': {
    es: 'Esta lista guarda como máximo {n} vistas. Elimina una para guardar otra.',
    pt: 'Esta lista guarda no máximo {n} visões. Exclua uma para salvar outra.'
  },
  'Save the current filters as': {
    es: 'Guardar los filtros actuales como',
    pt: 'Salvar os filtros atuais como'
  },
  'View name': { es: 'Nombre de la vista', pt: 'Nome da visão' },
  'Save view': { es: 'Guardar vista', pt: 'Salvar visão' },
  Lines: { es: 'Líneas', pt: 'Linhas' },
  'Add a line from the catalogue': {
    es: 'Añadir una línea del catálogo',
    pt: 'Adicionar uma linha do catálogo'
  },
  'Add from catalogue…': { es: 'Añadir del catálogo…', pt: 'Adicionar do catálogo…' },
  Description: { es: 'Descripción', pt: 'Descrição' },
  'Line description': { es: 'Descripción de la línea', pt: 'Descrição da linha' },
  'Detail the customer sees under the name (optional)': {
    es: 'Detalle que el cliente ve bajo el nombre (opcional)',
    pt: 'Detalhe que o cliente vê abaixo do nome (opcional)'
  },
  'Line detail': { es: 'Detalle de la línea', pt: 'Detalhe da linha' },
  'less {amount}': { es: 'menos {amount}', pt: 'menos {amount}' },
  'Remove this line': { es: 'Quitar esta línea', pt: 'Remover esta linha' },
  'Add a line': { es: 'Añadir una línea', pt: 'Adicionar uma linha' },
  'A discount cannot be negative.': {
    es: 'Un descuento no puede ser negativo.',
    pt: 'Um desconto não pode ser negativo.'
  },
  'A percentage discount cannot exceed 100.': {
    es: 'Un descuento porcentual no puede pasar de 100.',
    pt: 'Um desconto percentual não pode passar de 100.'
  },
  'A discount cannot exceed the subtotal.': {
    es: 'Un descuento no puede superar el subtotal.',
    pt: 'Um desconto não pode ultrapassar o subtotal.'
  },
  "A discount cannot exceed the line's amount.": {
    es: 'Un descuento no puede superar el importe de la línea.',
    pt: 'Um desconto não pode ultrapassar o valor da linha.'
  },
  'Tax rate cannot be negative.': {
    es: 'La tasa de impuesto no puede ser negativa.',
    pt: 'A alíquota não pode ser negativa.'
  },
  'Tax rate cannot exceed 100.': {
    es: 'La tasa de impuesto no puede pasar de 100.',
    pt: 'A alíquota não pode passar de 100.'
  },
  'Shipping cannot be negative.': {
    es: 'El envío no puede ser negativo.',
    pt: 'O frete não pode ser negativo.'
  },
  'Bulk actions': { es: 'Acciones en lote', pt: 'Ações em lote' },
  '{n} selected': { es: '{n} seleccionados', pt: '{n} selecionados' },
  Clear: { es: 'Quitar', pt: 'Limpar' },
  'Choose a bulk action': { es: 'Elige una acción en lote', pt: 'Escolha uma ação em lote' },
  Reassign: { es: 'Reasignar', pt: 'Reatribuir' },
  'Set priority': { es: 'Fijar prioridad', pt: 'Definir prioridade' },
  'Set status': { es: 'Fijar estado', pt: 'Definir status' },
  'Set type': { es: 'Fijar tipo', pt: 'Definir tipo' },
  'Add tags': { es: 'Añadir etiquetas', pt: 'Adicionar etiquetas' },
  'Delete {n}': { es: 'Eliminar {n}', pt: 'Excluir {n}' },
  'Choose a person': { es: 'Elige a una persona', pt: 'Escolha uma pessoa' },
  'Choose a priority': { es: 'Elige una prioridad', pt: 'Escolha uma prioridade' },
  'Choose a type': { es: 'Elige un tipo', pt: 'Escolha um tipo' },
  'Choose a status': { es: 'Elige un estado', pt: 'Escolha um status' },
  'Closed on (optional)': { es: 'Cerrado el (opcional)', pt: 'Fechado em (opcional)' },
  'Empty: dated today in the org timezone.': {
    es: 'Vacío: se fecha hoy en la zona horaria de la organización.',
    pt: 'Vazio: datado hoje no fuso da organização.'
  },
  'Merge {kind}s': { es: 'Fusionar {kind}s', pt: 'Unir {kind}s' },
  Merge: { es: 'Fusionar', pt: 'Unir' },
  'Pick the one to keep. The other is deleted once everything linked to it has moved over.': {
    es: 'Elige cuál conservar. El otro se elimina cuando todo lo vinculado a él se haya movido.',
    pt: 'Escolha qual manter. O outro é excluído quando tudo ligado a ele tiver sido movido.'
  },
  'Nothing was merged': { es: 'No se fusionó nada', pt: 'Nada foi unido' },
  'Which {kind} to keep': { es: 'Qué {kind} conservar', pt: 'Qual {kind} manter' },
  'Keep {name}': { es: 'Conservar {name}', pt: 'Manter {name}' },
  'Keeping this one would delete the other, which only an admin or its creator may do.': {
    es: 'Conservar este eliminaría el otro, y solo un administrador o quien lo creó puede hacerlo.',
    pt: 'Manter este excluiria o outro, e só um administrador ou quem o criou pode fazer isso.'
  },
  'After the merge': { es: 'Después de la fusión', pt: 'Depois da união' },
  '(from {name})': { es: '(de {name})', pt: '(de {name})' },
  "Notes, files, activity and every link to {dropped} move to {kept}. Tags are combined; owners stay {kept}'s unless it has none.":
    {
      es: 'Las notas, los archivos, la actividad y cada vínculo con {dropped} pasan a {kept}. Las etiquetas se combinan; los responsables siguen siendo los de {kept}, salvo que no tenga.',
      pt: 'Notas, arquivos, atividade e cada vínculo com {dropped} passam para {kept}. As etiquetas se combinam; os responsáveis continuam os de {kept}, a menos que não tenha.'
    },
  'Delete {name} for good once it is merged. This cannot be undone.': {
    es: 'Eliminar {name} para siempre cuando se fusione. Esto no se puede deshacer.',
    pt: 'Excluir {name} de vez quando for unido. Isto não pode ser desfeito.'
  },
  'Merge into {name}': { es: 'Fusionar en {name}', pt: 'Unir em {name}' },
  'You cannot merge these two: keeping either would delete the other, and only an admin or the person who created a {kind} may delete it.':
    {
      es: 'No puedes fusionar estos dos: conservar cualquiera eliminaría el otro, y solo un administrador o quien creó un {kind} puede eliminarlo.',
      pt: 'Você não pode unir estes dois: manter qualquer um excluiria o outro, e só um administrador ou quem criou um {kind} pode excluí-lo.'
    },
  'this record': { es: 'este registro', pt: 'este registro' },
  'the other record': { es: 'el otro registro', pt: 'o outro registro' },
  'No next step': { es: 'Sin siguiente paso', pt: 'Sem próximo passo' },
  'no date': { es: 'sin fecha', pt: 'sem data' },
  '{title} · {due}': { es: '{title} · {due}', pt: '{title} · {due}' },
  '{name} (no longer active)': {
    es: '{name} (ya no está activo)',
    pt: '{name} (não está mais ativo)'
  },
  Unnamed: { es: 'Sin nombre', pt: 'Sem nome' },
  'No user': { es: 'Sin usuario', pt: 'Sem usuário' },
  record: { es: 'registro', pt: 'registro' },
  'Merged {entity} "{merged}"{mergedTag} into "{kept}"{keptTag}.': {
    es: 'Se fusionó {entity} "{merged}"{mergedTag} en "{kept}"{keptTag}.',
    pt: '{entity} "{merged}"{mergedTag} foi unido a "{kept}"{keptTag}.'
  },
  'scopes {list}': { es: 'alcances {list}', pt: 'escopos {list}' },
  'full access': { es: 'acceso completo', pt: 'acesso completo' },
  ', owned by {name}': { es: ', de {name}', pt: ', de {name}' },
  'Token "{name}" ({prefix}), {scopes}{owner}.': {
    es: 'Token "{name}" ({prefix}), {scopes}{owner}.',
    pt: 'Token "{name}" ({prefix}), {scopes}{owner}.'
  },
  'Turned back on, and now answers for the webhook.': {
    es: 'Se volvió a activar y ahora responde por el webhook.',
    pt: 'Religado, e agora responde pelo webhook.'
  },
  'Changed {fields}, and now answers for the webhook.': {
    es: 'Cambió {fields} y ahora responde por el webhook.',
    pt: 'Alterou {fields} e agora responde pelo webhook.'
  },
  '{action} on {resource}': { es: '{action} en {resource}', pt: '{action} em {resource}' },
  '{n} sample leads removed': {
    es: '{n} prospectos de ejemplo eliminados',
    pt: '{n} leads de exemplo removidos'
  },

  // Legacy app chrome
  Home: { es: 'Inicio', pt: 'Início' },
  'All tickets': { es: 'Todos los tickets', pt: 'Todos os chamados' },
  'All Invoices': { es: 'Todas las facturas', pt: 'Todas as faturas' },
  'Help desk': { es: 'Mesa de ayuda', pt: 'Central de ajuda' },
  Workspace: { es: 'Espacio de trabajo', pt: 'Espaço de trabalho' },
  Records: { es: 'Registros', pt: 'Registros' },
  Work: { es: 'Trabajo', pt: 'Trabalho' },
  Support: { es: 'Soporte', pt: 'Suporte' },
  'My Account': { es: 'Mi cuenta', pt: 'Minha conta' },
  Profile: { es: 'Perfil', pt: 'Perfil' },
  'Users & Teams': { es: 'Usuarios y equipos', pt: 'Usuários e equipes' },
  Organizations: { es: 'Organizaciones', pt: 'Organizações' },
  'Reopen Policy': { es: 'Política de reapertura', pt: 'Política de reabertura' },
  'Custom Fields': { es: 'Campos personalizados', pt: 'Campos personalizados' },
  'Auto-Routing': { es: 'Enrutado automático', pt: 'Roteamento automático' },
  Escalation: { es: 'Escalado', pt: 'Escalonamento' },
  'Approval Rules': { es: 'Reglas de aprobación', pt: 'Regras de aprovação' },
  'Inbound Email': { es: 'Correo entrante', pt: 'E-mail de entrada' },
  'Business Hours': { es: 'Horario laboral', pt: 'Horário comercial' },
  Macros: { es: 'Macros', pt: 'Macros' },
  'API Tokens': { es: 'Tokens de API', pt: 'Tokens de API' },
  Theme: { es: 'Tema', pt: 'Tema' },
  Light: { es: 'Claro', pt: 'Claro' },
  Dark: { es: 'Oscuro', pt: 'Escuro' },
  System: { es: 'Sistema', pt: 'Sistema' },
  'User avatar': { es: 'Avatar del usuario', pt: 'Avatar do usuário' },
  'Download mobile app': { es: 'Descargar la app móvil', pt: 'Baixar o app móvel' },
  'Expand sidebar': { es: 'Expandir la barra lateral', pt: 'Expandir a barra lateral' },
  'Collapse sidebar': { es: 'Contraer la barra lateral', pt: 'Recolher a barra lateral' },
  Collapse: { es: 'Contraer', pt: 'Recolher' },
  "You're all caught up.": { es: 'Estás al día.', pt: 'Você está em dia.' },
  'Mark all read': { es: 'Marcar todo como leído', pt: 'Marcar tudo como lido' },
  unread: { es: 'no leída', pt: 'não lida' },
  'Delete notification': { es: 'Eliminar notificación', pt: 'Excluir notificação' },
  'mentioned you': { es: 'te mencionó', pt: 'mencionou você' },
  'assigned you': { es: 'te asignó', pt: 'atribuiu a você' },
  commented: { es: 'comentó', pt: 'comentou' },
  'SLA breached': { es: 'SLA incumplido', pt: 'SLA estourado' },
  escalated: { es: 'escaló', pt: 'escalonou' },
  reopened: { es: 'reabrió', pt: 'reabriu' },
  'received an email': { es: 'recibió un correo', pt: 'recebeu um e-mail' },
  'replied to': { es: 'respondió a', pt: 'respondeu a' },
  updated: { es: 'actualizó', pt: 'atualizou' },
  'ConNexus-CRM Support': { es: 'Soporte de ConNexus-CRM', pt: 'Suporte do ConNexus-CRM' },
  Unknown: { es: 'Desconocido', pt: 'Desconhecido' },
  Comments: { es: 'Comentarios', pt: 'Comentários' },
  'Write a comment… type @ to mention': {
    es: 'Escribe un comentario… usa @ para mencionar',
    pt: 'Escreva um comentário… use @ para mencionar'
  },
  'Write a comment...': { es: 'Escribe un comentario...', pt: 'Escreva um comentário...' },
  'Press Ctrl+Enter to send': {
    es: 'Pulsa Ctrl+Enter para enviar',
    pt: 'Pressione Ctrl+Enter para enviar'
  },
  'No comments yet': { es: 'Aún no hay comentarios', pt: 'Ainda não há comentários' },
  'Be the first to comment': {
    es: 'Sé el primero en comentar',
    pt: 'Seja o primeiro a comentar'
  },
  'Delete comment': { es: 'Eliminar comentario', pt: 'Excluir comentário' },
  'Show less': { es: 'Ver menos', pt: 'Ver menos' },
  'View all {n} comments': { es: 'Ver los {n} comentarios', pt: 'Ver os {n} comentários' },
  'Are you sure you want to delete this comment? This action cannot be undone.': {
    es: '¿Seguro que quieres eliminar este comentario? Esta acción no se puede deshacer.',
    pt: 'Tem certeza de que quer excluir este comentário? Esta ação não pode ser desfeita.'
  },
  'Comment added': { es: 'Comentario añadido', pt: 'Comentário adicionado' },
  'Failed to add comment': {
    es: 'No se pudo añadir el comentario',
    pt: 'Não foi possível adicionar o comentário'
  },
  'Comment deleted': { es: 'Comentario eliminado', pt: 'Comentário excluído' },
  'Failed to delete comment': {
    es: 'No se pudo eliminar el comentario',
    pt: 'Não foi possível excluir o comentário'
  },
  'Showing {range} of {total} results': {
    es: 'Mostrando {range} de {total} resultados',
    pt: 'Mostrando {range} de {total} resultados'
  },
  Rows: { es: 'Filas', pt: 'Linhas' },
  'Previous page': { es: 'Página anterior', pt: 'Página anterior' },
  'Next page': { es: 'Página siguiente', pt: 'Próxima página' },
  Sidebar: { es: 'Barra lateral', pt: 'Barra lateral' },
  'Displays the mobile sidebar.': {
    es: 'Muestra la barra lateral en el móvil.',
    pt: 'Exibe a barra lateral no celular.'
  },
  'Toggle Sidebar': { es: 'Mostrar u ocultar la barra lateral', pt: 'Alternar a barra lateral' },
  'Clear selection': { es: 'Quitar la selección', pt: 'Limpar a seleção' },
  'No items found': { es: 'No se encontraron elementos', pt: 'Nenhum item encontrado' },
  'Select all rows': { es: 'Seleccionar todas las filas', pt: 'Selecionar todas as linhas' },
  'Select row': { es: 'Seleccionar fila', pt: 'Selecionar linha' },
  'Open full page': { es: 'Abrir la página completa', pt: 'Abrir a página inteira' },
  '{label} title': { es: 'Título de {label}', pt: 'Título de {label}' },
  'No row selected': { es: 'Ninguna fila seleccionada', pt: 'Nenhuma linha selecionada' },
  'Click a row to peek.': { es: 'Haz clic en una fila para verla.', pt: 'Clique numa linha para espiar.' },
  'Show side panel': { es: 'Mostrar el panel lateral', pt: 'Mostrar o painel lateral' },
  'Hide side panel': { es: 'Ocultar el panel lateral', pt: 'Ocultar o painel lateral' },
  'View mode toggle': { es: 'Cambiar el modo de vista', pt: 'Alternar o modo de visualização' },
  'Table view': { es: 'Vista de tabla', pt: 'Visualização em tabela' },
  'Kanban view': { es: 'Vista kanban', pt: 'Visualização kanban' },
  Table: { es: 'Tabla', pt: 'Tabela' },
  Kanban: { es: 'Kanban', pt: 'Kanban' },
  'Stage progress': { es: 'Progreso de la etapa', pt: 'Progresso da etapa' },
  'Remove {name}': { es: 'Quitar {name}', pt: 'Remover {name}' },
  'Search…': { es: 'Buscar…', pt: 'Buscar…' },
  'Search options': { es: 'Buscar opciones', pt: 'Buscar opções' },
  Views: { es: 'Vistas', pt: 'Visões' },
  Breadcrumb: { es: 'Ruta', pt: 'Trilha' },
  Filters: { es: 'Filtros', pt: 'Filtros' },
  'Clear Filters': { es: 'Quitar filtros', pt: 'Limpar filtros' },
  'Clear filter': { es: 'Quitar filtro', pt: 'Limpar filtro' },
  'Clear search': { es: 'Borrar la búsqueda', pt: 'Limpar a busca' },
  'No tags available': { es: 'No hay etiquetas', pt: 'Não há etiquetas' },
  'Create tags to organize your leads': {
    es: 'Crea etiquetas para organizar tus prospectos',
    pt: 'Crie etiquetas para organizar seus leads'
  },
  'Quick select': { es: 'Selección rápida', pt: 'Seleção rápida' },
  'Last 7 days': { es: 'Últimos 7 días', pt: 'Últimos 7 dias' },
  'Last 30 days': { es: 'Últimos 30 días', pt: 'Últimos 30 dias' },
  'This month': { es: 'Este mes', pt: 'Este mês' },
  'Last month': { es: 'El mes pasado', pt: 'Mês passado' },
  'Last 90 days': { es: 'Últimos 90 días', pt: 'Últimos 90 dias' },
  'Start date': { es: 'Fecha de inicio', pt: 'Data inicial' },
  'End date': { es: 'Fecha de fin', pt: 'Data final' },
  'Select end': { es: 'Elegir fin', pt: 'Escolher fim' },
  'Click to select end date': {
    es: 'Haz clic para elegir la fecha final',
    pt: 'Clique para escolher a data final'
  },
  'Select start date': {
    es: 'Elige la fecha de inicio',
    pt: 'Escolha a data inicial'
  },
  'My Tasks': { es: 'Mis tareas', pt: 'Minhas tarefas' },
  'View all': { es: 'Ver todo', pt: 'Ver tudo' },
  Week: { es: 'Semana', pt: 'Semana' },
  'No tasks found': { es: 'No se encontraron tareas', pt: 'Nenhuma tarefa encontrada' },
  'All caught up!': { es: '¡Estás al día!', pt: 'Tudo em dia!' },
  Yesterday: { es: 'Ayer', pt: 'Ontem' },
  '{n}d ago': { es: 'hace {n} d', pt: 'há {n} d' },
  'This Week': { es: 'Esta semana', pt: 'Esta semana' },
  Earlier: { es: 'Antes', pt: 'Antes' },
  'No recent activity': { es: 'Sin actividad reciente', pt: 'Sem atividade recente' },
  'Actions will appear here': { es: 'Las acciones aparecerán aquí', pt: 'As ações vão aparecer aqui' },
  'Hot Leads': { es: 'Prospectos calientes', pt: 'Leads quentes' },
  'No hot leads': { es: 'No hay prospectos calientes', pt: 'Não há leads quentes' },
  'Mark leads as "Hot" to see them here': {
    es: 'Marca prospectos como "Hot" para verlos aquí',
    pt: 'Marque leads como "Hot" para vê-los aqui'
  },
  'No company': { es: 'Sin empresa', pt: 'Sem empresa' },
  HOT: { es: 'Caliente', pt: 'Quente' },
  Manage: { es: 'Gestionar', pt: 'Gerenciar' },
  'Edit Team': { es: 'Editar equipo', pt: 'Editar equipe' },
  'Create Team': { es: 'Crear equipo', pt: 'Criar equipe' },
  'Update team details and member assignments.': {
    es: 'Actualiza los datos del equipo y quiénes son miembros.',
    pt: 'Atualize os dados da equipe e quem são os membros.'
  },
  'Create a new team to group users for assignments.': {
    es: 'Crea un equipo nuevo para agrupar usuarios en las asignaciones.',
    pt: 'Crie uma equipe nova para agrupar usuários nas atribuições.'
  },
  'Team Name *': { es: 'Nombre del equipo *', pt: 'Nome da equipe *' },
  'e.g., Sales Team': { es: 'p. ej., Equipo de ventas', pt: 'ex.: Equipe de vendas' },
  'Assign Members': { es: 'Asignar miembros', pt: 'Atribuir membros' },
  "Describe the team's purpose...": {
    es: 'Describe el propósito del equipo...',
    pt: 'Descreva o propósito da equipe...'
  },
  'Select team members...': { es: 'Elige miembros del equipo...', pt: 'Selecione membros da equipe...' },
  'No members assigned': { es: 'Sin miembros asignados', pt: 'Nenhum membro atribuído' },
  'Team members will be able to access records assigned to this team.': {
    es: 'Los miembros podrán acceder a los registros asignados a este equipo.',
    pt: 'Os membros poderão acessar os registros atribuídos a esta equipe.'
  },
  'Delete Team': { es: 'Eliminar equipo', pt: 'Excluir equipe' },
  'Are you sure you want to delete {name}? This will remove the team from all assigned records. This action cannot be undone.':
    {
      es: '¿Seguro que quieres eliminar {name}? Esto quitará el equipo de todos los registros asignados. Esta acción no se puede deshacer.',
      pt: 'Tem certeza de que quer excluir {name}? Isto remove a equipe de todos os registros atribuídos. Esta ação não pode ser desfeita.'
    },
  'Drop a CSV file here, or click to choose': {
    es: 'Suelta un archivo CSV aquí o haz clic para elegir',
    pt: 'Solte um arquivo CSV aqui ou clique para escolher'
  },
  'CSV format': { es: 'Formato CSV', pt: 'Formato CSV' },
  'Required headers:': { es: 'Encabezados obligatorios:', pt: 'Cabeçalhos obrigatórios:' },
  'Optional:': { es: 'Opcionales:', pt: 'Opcionais:' },
  'Duplicates: rows with a previously-used email or phone (in your org or earlier in the file) are flagged. Two people with the same name are allowed only if at least one has an email or phone to tell them apart.':
    {
      es: 'Duplicados: se marcan las filas con un correo o teléfono ya usado (en tu organización o antes en el archivo). Dos personas con el mismo nombre se permiten solo si al menos una tiene correo o teléfono para distinguirlas.',
      pt: 'Duplicatas: linhas com um e-mail ou telefone já usado (na sua organização ou antes no arquivo) são sinalizadas. Duas pessoas com o mesmo nome só são permitidas se pelo menos uma tiver e-mail ou telefone para diferenciá-las.'
    },
  'Download CSV template': { es: 'Descargar plantilla CSV', pt: 'Baixar modelo CSV' },
  'Valid: {n}': { es: 'Válidas: {n}', pt: 'Válidas: {n}' },
  'Invalid: {n}': { es: 'No válidas: {n}', pt: 'Inválidas: {n}' },
  'Download errors': { es: 'Descargar errores', pt: 'Baixar erros' },
  Row: { es: 'Fila', pt: 'Linha' },
  Field: { es: 'Campo', pt: 'Campo' },
  Company: { es: 'Empresa', pt: 'Empresa' },
  'The contacts list has been refreshed.': {
    es: 'La lista de contactos se actualizó.',
    pt: 'A lista de contatos foi atualizada.'
  },
  'The list has been refreshed.': { es: 'La lista se actualizó.', pt: 'A lista foi atualizada.' },
  'The tickets list has been refreshed.': {
    es: 'La lista de tickets se actualizó.',
    pt: 'A lista de chamados foi atualizada.'
  },
  'This file is too large to upload. Split it into smaller files.': {
    es: 'Este archivo es demasiado grande. Divídelo en archivos más pequeños.',
    pt: 'Este arquivo é grande demais para enviar. Divida em arquivos menores.'
  },
  'Preview failed': { es: 'No se pudo previsualizar', pt: 'Não foi possível pré-visualizar' },
  'Unexpected response from server': {
    es: 'Respuesta inesperada del servidor',
    pt: 'Resposta inesperada do servidor'
  },
  'Import failed': { es: 'No se pudo importar', pt: 'Não foi possível importar' },
  'each row needs at least one of the two.': {
    es: 'cada fila necesita al menos uno de los dos.',
    pt: 'cada linha precisa de pelo menos um dos dois.'
  },
  'Choice columns such as status and source accept the value or its label. An email already used by a {kind} in your org, or earlier in the file, is flagged.':
    {
      es: 'Las columnas de opción, como estado y origen, aceptan el valor o su etiqueta. Un correo ya usado por un {kind} en tu organización, o antes en el archivo, se marca.',
      pt: 'Colunas de escolha, como status e origem, aceitam o valor ou o rótulo. Um e-mail já usado por um {kind} na sua organização, ou antes no arquivo, é sinalizado.'
    },
  lead: { es: 'prospecto', pt: 'lead' },
  'Will import {n} {kind}.': {
    es: 'Se importarán {n} {kind}.',
    pt: 'Serão importados {n} {kind}.'
  },
  'Imported {n} {kind}.': { es: 'Se importaron {n} {kind}.', pt: '{n} {kind} importados.' },

  // Shared across sales, support, and billing screens.
  '{n} tickets': { es: '{n} tickets', pt: '{n} chamados' },
  '{n}d': { es: '{n} d', pt: '{n} d' },
  '{n}d late': { es: '{n} d de retraso', pt: '{n} d de atraso' },
  '{name} team': { es: 'equipo {name}', pt: 'equipe {name}' },
  '{priority} priority': { es: 'prioridad {priority}', pt: 'prioridade {priority}' },
  Activity: { es: 'Actividad', pt: 'Atividade' },
  'Add note': { es: 'Añadir nota', pt: 'Adicionar nota' },
  Added: { es: 'Añadido', pt: 'Adicionado' },
  'Adding…': { es: 'Añadiendo…', pt: 'Adicionando…' },
  Address: { es: 'Dirección', pt: 'Endereço' },
  'Admins only': { es: 'Solo administradores', pt: 'Somente administradores' },
  Age: { es: 'Antigüedad', pt: 'Antiguidade' },
  and: { es: 'y', pt: 'e' },
  'Attach file': { es: 'Adjuntar archivo', pt: 'Anexar arquivo' },
  Attached: { es: 'Adjunto', pt: 'Anexo' },
  'Back to the list': { es: 'Volver a la lista', pt: 'Voltar à lista' },
  Board: { es: 'Tablero', pt: 'Quadro' },
  Category: { es: 'Categoría', pt: 'Categoria' },
  'Closed on': { es: 'Cerrado el', pt: 'Fechado em' },
  Contact: { es: 'Contacto', pt: 'Contato' },
  Country: { es: 'País', pt: 'País' },
  Deal: { es: 'Negocio', pt: 'Negócio' },
  'Delete for good': { es: 'Eliminar para siempre', pt: 'Excluir de vez' },
  Due: { es: 'Vence', pt: 'Vence' },
  'Edit {name}': { es: 'Editar {name}', pt: 'Editar {name}' },
  Export: { es: 'Exportar', pt: 'Exportar' },
  Files: { es: 'Archivos', pt: 'Arquivos' },
  'Filter activity': { es: 'Filtrar actividad', pt: 'Filtrar atividade' },
  'Has to be unique in this organisation, ignoring capitals.': {
    es: 'Tiene que ser único en esta organización, sin distinguir mayúsculas.',
    pt: 'Precisa ser único nesta organização, sem diferenciar maiúsculas.'
  },
  History: { es: 'Historial', pt: 'Histórico' },
  Import: { es: 'Importar', pt: 'Importar' },
  Invoiced: { es: 'Facturado', pt: 'Faturado' },
  'Keep it': { es: 'Conservarlo', pt: 'Manter' },
  Last: { es: 'Último', pt: 'Último' },
  List: { es: 'Lista', pt: 'Lista' },
  'Loose end': { es: 'Pendiente', pt: 'Pendente' },
  'Merge {name}': { es: 'Fusionar {name}', pt: 'Unir {name}' },
  'Missing card or column.': { es: 'Falta la tarjeta o la columna.', pt: 'Falta o cartão ou a coluna.' },
  'Move to…': { es: 'Mover a…', pt: 'Mover para…' },
  Name: { es: 'Nombre', pt: 'Nome' },
  never: { es: 'nunca', pt: 'nunca' },
  'No account': { es: 'Sin cuenta', pt: 'Sem conta' },
  'no due date': { es: 'sin fecha de vencimiento', pt: 'sem data de vencimento' },
  nobody: { es: 'nadie', pt: 'ninguém' },
  Nobody: { es: 'Nadie', pt: 'Ninguém' },
  'Not linked': { es: 'Sin vincular', pt: 'Sem vínculo' },
  'Not set': { es: 'Sin definir', pt: 'Não definido' },
  of: { es: 'de', pt: 'de' },
  Off: { es: 'Apagado', pt: 'Desligado' },
  People: { es: 'Personas', pt: 'Pessoas' },
  Person: { es: 'Persona', pt: 'Pessoa' },
  'Remove file': { es: 'Quitar archivo', pt: 'Remover arquivo' },
  'required fields done': { es: 'campos obligatorios listos', pt: 'campos obrigatórios prontos' },
  'Save changes': { es: 'Guardar cambios', pt: 'Salvar alterações' },
  'Saved.': { es: 'Guardado.', pt: 'Salvo.' },
  'Saving…': { es: 'Guardando…', pt: 'Salvando…' },
  Showing: { es: 'Mostrando', pt: 'Mostrando' },
  State: { es: 'Estado', pt: 'Estado' },
  'That did not work': { es: 'Eso no funcionó', pt: 'Isso não funcionou' },
  'The server refused this change': {
    es: 'El servidor rechazó este cambio',
    pt: 'O servidor recusou esta alteração'
  },
  'These numbers describe the filtered list.': {
    es: 'Estas cifras describen la lista filtrada.',
    pt: 'Estes números descrevem a lista filtrada.'
  },
  Title: { es: 'Título', pt: 'Título' },
  Unassigned: { es: 'Sin asignar', pt: 'Não atribuído' },
  'updated {when}': { es: 'actualizado {when}', pt: 'atualizado {when}' },
  Visibility: { es: 'Visibilidad', pt: 'Visibilidade' },
  Website: { es: 'Sitio web', pt: 'Site' },
  When: { es: 'Cuándo', pt: 'Quando' },
  'Yes, delete': { es: 'Sí, eliminar', pt: 'Sim, excluir' },

  unread: { es: 'sin leer', pt: 'não lidas' },
  'Nothing unread': { es: 'Nada sin leer', pt: 'Nada não lido' },
  'Show read too': { es: 'Ver también las leídas', pt: 'Ver também as lidas' },
  'Unread only': { es: 'Solo sin leer', pt: 'Somente não lidas' },
  'Mark all read': { es: 'Marcar todas como leídas', pt: 'Marcar todas como lidas' },
  'No notifications': { es: 'No hay notificaciones', pt: 'Não há notificações' },
  'Everything here has been read. Notifications arrive for CRM ticket activity and updates from ConNexus-CRM Support.':
    {
      es: 'Todo lo de aquí ya se leyó. Las notificaciones llegan por la actividad de tickets del CRM y por avisos de ConNexus-CRM Support.',
      pt: 'Tudo aqui já foi lido. As notificações chegam pela atividade de chamados do CRM e por avisos do ConNexus-CRM Support.'
    },
  'Notifications arrive for CRM ticket activity and updates from ConNexus-CRM Support.': {
    es: 'Las notificaciones llegan por la actividad de tickets del CRM y por avisos de ConNexus-CRM Support.',
    pt: 'As notificações chegam pela atividade de chamados do CRM e por avisos do ConNexus-CRM Support.'
  },
  'Go to tickets': { es: 'Ir a tickets', pt: 'Ir para chamados' },
  'Get help': { es: 'Pedir ayuda', pt: 'Pedir ajuda' },
  'mentioned you on': { es: 'te mencionó en', pt: 'mencionou você em' },
  'commented on': { es: 'comentó en', pt: 'comentou em' },
  'replied to': { es: 'respondió a', pt: 'respondeu a' },
  updated: { es: 'actualizó', pt: 'atualizou' },
  'The system': { es: 'El sistema', pt: 'O sistema' },
  'a ticket that no longer has a name': {
    es: 'un ticket que ya no tiene nombre',
    pt: 'um chamado que não tem mais nome'
  },
  'has no producer': { es: 'no tiene productor', pt: 'não tem produtor' },
  'Mark read': { es: 'Marcar como leída', pt: 'Marcar como lida' },
  'of these were written before the producer was fixed and still carry a': {
    es: 'de estas se escribieron antes de corregir el productor y todavía llevan un enlace',
    pt: 'destas foram escritas antes de corrigir o produtor e ainda levam um link'
  },
  'link, which no client serves. They open as': {
    es: 'que ningún cliente atiende. Se abren como',
    pt: 'que nenhum cliente atende. Elas abrem como'
  },
  'here. New ones are written correctly at source by': {
    es: 'aquí. Las nuevas se escriben bien en el origen, en',
    pt: 'aqui. As novas são gravadas corretamente na origem, em'
  },

  // Timesheet. Loaded globally so the week view does not depend on another page.
  'Previous week': { es: 'Semana anterior', pt: 'Semana anterior' },
  'This week': { es: 'Esta semana', pt: 'Esta semana' },
  'Next week': { es: 'Semana siguiente', pt: 'Próxima semana' },
  Report: { es: 'Informe', pt: 'Relatório' },
  'Logged this week': { es: 'Registrado esta semana', pt: 'Apontado nesta semana' },
  Billable: { es: 'Facturable', pt: 'Faturável' },
  '{n}% of logged time': { es: '{n}% del tiempo registrado', pt: '{n}% do tempo apontado' },
  'Billable value': { es: 'Valor facturable', pt: 'Valor faturável' },
  'At the rate saved on each entry': {
    es: 'A la tarifa guardada en cada registro',
    pt: 'Na taxa salva em cada registro'
  },
  'Not yet invoiced': { es: 'Aún sin facturar', pt: 'Ainda sem faturar' },
  'Billable entries with no invoice': {
    es: 'Registros facturables sin factura',
    pt: 'Registros faturáveis sem fatura'
  },
  'Everything billable is billed': {
    es: 'Todo lo facturable ya está facturado',
    pt: 'Tudo que é faturável já foi faturado'
  },
  'Timer running': { es: 'Temporizador en marcha', pt: 'Timer em andamento' },
  '{n} timers running': { es: '{n} temporizadores en marcha', pt: '{n} timers em andamento' },
  on: { es: 'en', pt: 'em' },
  'Stop timer': { es: 'Detener temporizador', pt: 'Parar timer' },
  Mon: { es: 'Lun', pt: 'Seg' },
  Tue: { es: 'Mar', pt: 'Ter' },
  Wed: { es: 'Mié', pt: 'Qua' },
  Thu: { es: 'Jue', pt: 'Qui' },
  Fri: { es: 'Vie', pt: 'Sex' },
  Sat: { es: 'Sáb', pt: 'Sáb' },
  Sun: { es: 'Dom', pt: 'Dom' },
  running: { es: 'en marcha', pt: 'em andamento' },
  internal: { es: 'interno', pt: 'interno' },
  'Billed on {number}': { es: 'Facturado en {number}', pt: 'Faturado em {number}' },
  billed: { es: 'facturado', pt: 'faturado' },
  'Nothing logged': { es: 'Nada registrado', pt: 'Nada apontado' },
  'Time is logged against a ticket, so every hour here is attached to something a customer can be shown. Rates are saved on each entry when it is logged. Changing your rate does not rewrite what past weeks were worth.':
    {
      es: 'El tiempo se registra contra un ticket, así que cada hora de aquí está unida a algo que se le puede mostrar a un cliente. Las tarifas se guardan en cada registro cuando se anota. Cambiar tu tarifa no reescribe lo que valían las semanas pasadas.',
      pt: 'O tempo é apontado em um chamado, então cada hora daqui está ligada a algo que pode ser mostrado a um cliente. As taxas são salvas em cada registro no momento do apontamento. Mudar a sua taxa não reescreve o que as semanas passadas valiam.'
    },
  'Could not stop the timer.': {
    es: 'No se pudo detener el temporizador.',
    pt: 'Não foi possível parar o timer.'
  },
  'Time report': { es: 'Informe de tiempo', pt: 'Relatório de tempo' },
  'by {group}': { es: 'por {group}', pt: 'por {group}' },
  'Export CSV': { es: 'Exportar CSV', pt: 'Exportar CSV' },
  From: { es: 'Desde', pt: 'De' },
  To: { es: 'Hasta', pt: 'Até' },
  'Group by': { es: 'Agrupar por', pt: 'Agrupar por' },
  Show: { es: 'Mostrar', pt: 'Mostrar' },
  'All time': { es: 'Todo el tiempo', pt: 'Todo o tempo' },
  'Billable only': { es: 'Solo facturable', pt: 'Somente faturável' },
  'Non-billable only': { es: 'Solo no facturable', pt: 'Somente não faturável' },
  Logged: { es: 'Registrado', pt: 'Apontado' },
  Entries: { es: 'Registros', pt: 'Registros' },
  'Mixed currencies: {list}': { es: 'Monedas mixtas: {list}', pt: 'Moedas mistas: {list}' },
  'No time logged in this window. Widen the dates, or clear the billable filter.': {
    es: 'No hay tiempo registrado en este periodo. Amplía las fechas o quita el filtro de facturable.',
    pt: 'Não há tempo apontado neste período. Amplie as datas ou limpe o filtro de faturável.'
  },
  Agent: { es: 'Agente', pt: 'Agente' },
  Ticket: { es: 'Ticket', pt: 'Chamado' },
  entries: { es: 'registros', pt: 'registros' },
  billable: { es: 'facturable', pt: 'faturável' },
  worth: { es: 'valor', pt: 'valor' },
  CEO: { es: 'CEO', pt: 'CEO' },
  Employee: { es: 'Empleado', pt: 'Funcionário' },
  'Daily work': { es: 'Trabajo del día', pt: 'Trabalho do dia' },
  Permissions: { es: 'Permisos', pt: 'Permissões' },
  'The CEO chooses what this administrator can open.': {
    es: 'El CEO elige qué puede abrir este administrador.',
    pt: 'O CEO escolhe o que este administrador pode abrir.'
  },
  'Save role': { es: 'Guardar rol', pt: 'Salvar papel' },
  'The CEO has every permission. An administrator has the ones the CEO saved.': {
    es: 'El CEO tiene todos los permisos. Un administrador tiene los que el CEO guardó.',
    pt: 'O CEO tem todas as permissões. Um administrador tem as que o CEO salvou.'
  },
  'Roles are CEO, administrator, member and employee. The CEO can do everything and chooses what each administrator can open. An employee can only record the work done today. Nobody can change their own role, and the organization keeps at least one person who can do everything.':
    {
      es: 'Los roles son CEO, administrador, miembro y empleado. El CEO puede hacer todo y elige qué puede abrir cada administrador. Un empleado solo puede registrar el trabajo de hoy. Nadie puede cambiar su propio rol, y la organización conserva al menos una persona que puede hacer todo.',
      pt: 'Os papéis são CEO, administrador, membro e funcionário. O CEO pode fazer tudo e escolhe o que cada administrador pode abrir. Um funcionário só pode registrar o trabalho de hoje. Ninguém pode mudar o próprio papel, e a organização mantém pelo menos uma pessoa que pode fazer tudo.'
    },
  "Log today's work": { es: 'Registrar el trabajo de hoy', pt: 'Registrar o trabalho de hoje' },
  'Choose a job, describe what was done today, and how many minutes it took.': {
    es: 'Elige un trabajo, describe lo que se hizo hoy y cuántos minutos tomó.',
    pt: 'Escolha um trabalho, descreva o que foi feito hoje e quantos minutos levou.'
  },
  'Which job?': { es: '¿Qué trabajo?', pt: 'Qual trabalho?' },
  'Choose a job': { es: 'Elige un trabajo', pt: 'Escolha um trabalho' },
  Minutes: { es: 'Minutos', pt: 'Minutos' },
  'What was done': { es: 'Qué se hizo', pt: 'O que foi feito' },
  'Choose a job, describe the work, and give the minutes.': {
    es: 'Elige un trabajo, describe el trabajo y escribe los minutos.',
    pt: 'Escolha um trabalho, descreva o trabalho e informe os minutos.'
  },
  'Could not log that work.': {
    es: 'No se pudo registrar ese trabajo.',
    pt: 'Não foi possível registrar esse trabalho.'
  },
  'Work logged.': { es: 'Trabajo registrado.', pt: 'Trabalho registrado.' },
  'No jobs yet. An administrator has to open one before work can be recorded against it.': {
    es: 'Aún no hay trabajos. Un administrador tiene que abrir uno antes de que se pueda registrar trabajo en él.',
    pt: 'Ainda não há trabalhos. Um administrador precisa abrir um antes que o trabalho possa ser registrado nele.'
  }
};

addMessages(messages);
