/**
 * English source string → Spanish and Brazilian Portuguese.
 *
 * The English sentence is the key, so a missing entry still reads as English
 * rather than as a key name. `en` is not stored: `tx` returns the source.
 *
 * @type {Record<string, { es: string, pt: string }>}
 */
export const messages = {
  // Navigation
  Sell: { es: 'Vender', pt: 'Vender' },
  Today: { es: 'Hoy', pt: 'Hoje' },
  Pipeline: { es: 'Pipeline', pt: 'Pipeline' },
  Leads: { es: 'Leads', pt: 'Leads' },
  CRM: { es: 'CRM', pt: 'CRM' },
  Accounts: { es: 'Cuentas', pt: 'Contas' },
  Contacts: { es: 'Contactos', pt: 'Contatos' },
  Goals: { es: 'Objetivos', pt: 'Metas' },
  Serve: { es: 'Atender', pt: 'Atender' },
  Tasks: { es: 'Tareas', pt: 'Tarefas' },
  Tickets: { es: 'Tickets', pt: 'Chamados' },
  'Knowledge base': { es: 'Base de conocimiento', pt: 'Base de conhecimento' },
  Documents: { es: 'Documentos', pt: 'Documentos' },
  Bill: { es: 'Cobrar', pt: 'Faturar' },
  Invoices: { es: 'Facturas', pt: 'Faturas' },
  Timesheet: { es: 'Parte de horas', pt: 'Apontamento de horas' },
  Run: { es: 'Administrar', pt: 'Administrar' },
  'Team and access': { es: 'Equipo y acceso', pt: 'Equipe e acesso' },
  Settings: { es: 'Ajustes', pt: 'Ajustes' },
  Search: { es: 'Buscar', pt: 'Buscar' },
  Notifications: { es: 'Notificaciones', pt: 'Notificações' },
  'Your profile': { es: 'Mi perfil', pt: 'Meu perfil' },
  Help: { es: 'Ayuda', pt: 'Ajuda' },
  'Download app': { es: 'Descargar la app', pt: 'Baixar o app' },
  'Sign out': { es: 'Salir', pt: 'Sair' },
  'Switch organisation': { es: 'Cambiar de empresa', pt: 'Trocar de empresa' },
  'Invoice templates': { es: 'Plantillas de factura', pt: 'Modelos de fatura' },
  Main: { es: 'Principal', pt: 'Principal' },
  Sections: { es: 'Secciones', pt: 'Seções' },
  'Open menu': { es: 'Abrir menú', pt: 'Abrir menu' },
  Navigation: { es: 'Navegación', pt: 'Navegação' },
  'New deal': { es: 'Nuevo negocio', pt: 'Novo negócio' },
  Language: { es: 'Idioma', pt: 'Idioma' },
  'Choose the language for this browser.': {
    es: 'Elige el idioma de este navegador.',
    pt: 'Escolha o idioma deste navegador.'
  },

  // Command palette
  Actions: { es: 'Acciones', pt: 'Ações' },
  'Go to Today': { es: 'Ir a Hoy', pt: 'Ir para Hoje' },
  'Go to Tasks': { es: 'Ir a Tareas', pt: 'Ir para Tarefas' },
  'Go to Invoices': { es: 'Ir a Facturas', pt: 'Ir para Faturas' },
  'Search deals, accounts, people, tickets, invoices…': {
    es: 'Busca negocios, cuentas, personas, tickets, facturas…',
    pt: 'Busque negócios, contas, pessoas, chamados, faturas…'
  },
  Results: { es: 'Resultados', pt: 'Resultados' },
  'Nothing matches “{query}”. Try an account name, a deal, or an invoice number.': {
    es: 'Nada coincide con “{query}”. Prueba con una cuenta, un negocio o un número de factura.',
    pt: 'Nada corresponde a “{query}”. Tente o nome de uma conta, um negócio ou o número de uma fatura.'
  },
  move: { es: 'mover', pt: 'mover' },
  open: { es: 'abrir', pt: 'abrir' },
  close: { es: 'cerrar', pt: 'fechar' },
  '{n} found': { es: '{n} encontrados', pt: '{n} encontrados' },
  Deals: { es: 'Negocios', pt: 'Negócios' },

  // Shared actions
  Save: { es: 'Guardar', pt: 'Salvar' },
  Cancel: { es: 'Cancelar', pt: 'Cancelar' },
  Edit: { es: 'Editar', pt: 'Editar' },
  'Edit details': { es: 'Editar datos', pt: 'Editar dados' },
  Delete: { es: 'Eliminar', pt: 'Excluir' },
  Close: { es: 'Cerrar', pt: 'Fechar' },
  Create: { es: 'Crear', pt: 'Criar' },
  Add: { es: 'Añadir', pt: 'Adicionar' },
  Apply: { es: 'Aplicar', pt: 'Aplicar' },
  'Clear all': { es: 'Quitar todo', pt: 'Limpar tudo' },
  Filter: { es: 'Filtrar', pt: 'Filtrar' },
  Any: { es: 'Cualquiera', pt: 'Qualquer' },
  Yes: { es: 'Sí', pt: 'Sim' },
  No: { es: 'No', pt: 'Não' },
  Min: { es: 'Mín.', pt: 'Mín.' },
  Max: { es: 'Máx.', pt: 'Máx.' },
  Back: { es: 'Volver', pt: 'Voltar' },
  Next: { es: 'Siguiente', pt: 'Próximo' },
  Previous: { es: 'Anterior', pt: 'Anterior' },
  Loading: { es: 'Cargando', pt: 'Carregando' },
  'Loading…': { es: 'Cargando…', pt: 'Carregando…' },
  Remove: { es: 'Quitar', pt: 'Remover' },
  'Remove the {label} filter': {
    es: 'Quitar el filtro {label}',
    pt: 'Remover o filtro {label}'
  },
  '{n} selected. Remove the chip to choose again.': {
    es: '{n} seleccionados. Quita el filtro para elegir de nuevo.',
    pt: '{n} selecionados. Remova o filtro para escolher de novo.'
  },
  All: { es: 'Todos', pt: 'Todos' },

  // Filters and presets
  'Open, newest first': { es: 'Abiertos, más recientes', pt: 'Abertos, mais recentes' },
  Mine: { es: 'Míos', pt: 'Meus' },
  'Breaching SLA': { es: 'Incumplen el SLA', pt: 'Estouraram o SLA' },
  Everything: { es: 'Todo', pt: 'Tudo' },
  Owner: { es: 'Responsable', pt: 'Responsável' },
  Status: { es: 'Estado', pt: 'Status' },
  Priority: { es: 'Prioridad', pt: 'Prioridade' },
  Type: { es: 'Tipo', pt: 'Tipo' },
  Tag: { es: 'Etiqueta', pt: 'Etiqueta' },
  Tags: { es: 'Etiquetas', pt: 'Etiquetas' },
  'Open leads': { es: 'Prospectos abiertos', pt: 'Leads abertos' },
  Source: { es: 'Origen', pt: 'Origem' },
  'Including inactive': { es: 'Incluir inactivos', pt: 'Incluir inativos' },
  'Active contacts': { es: 'Contactos activos', pt: 'Contatos ativos' },
  City: { es: 'Ciudad', pt: 'Cidade' },
  'Open deals': { es: 'Negocios abiertos', pt: 'Negócios abertos' },
  Stalled: { es: 'Estancados', pt: 'Parados' },
  'All deals': { es: 'Todos los negocios', pt: 'Todos os negócios' },
  Stage: { es: 'Etapa', pt: 'Etapa' },
  Value: { es: 'Valor', pt: 'Valor' },
  'Open tasks': { es: 'Tareas abiertas', pt: 'Tarefas abertas' },
  'My tasks': { es: 'Mis tareas', pt: 'Minhas tarefas' },
  'All tasks': { es: 'Todas las tareas', pt: 'Todas as tarefas' },
  'Due date': { es: 'Fecha de vencimiento', pt: 'Data de vencimento' },
  'All accounts': { es: 'Todas las cuentas', pt: 'Todas as contas' },
  Industry: { es: 'Industria', pt: 'Setor' },
  Overdue: { es: 'Vencido', pt: 'Vencido' },
  'All invoices': { es: 'Todas las facturas', pt: 'Todas as faturas' },
  Account: { es: 'Cuenta', pt: 'Conta' },
  Accepted: { es: 'Aceptado', pt: 'Aceito' },
  'All estimates': { es: 'Todos los presupuestos', pt: 'Todos os orçamentos' },
  Published: { es: 'Publicado', pt: 'Publicado' },
  Drafts: { es: 'Borradores', pt: 'Rascunhos' },
  'All articles, last edited first': {
    es: 'Todos los artículos, editados recientemente primero',
    pt: 'Todos os artigos, editados por último primeiro'
  },
  'Active documents': { es: 'Documentos activos', pt: 'Documentos ativos' },
  'Including archived': { es: 'Incluir archivados', pt: 'Incluir arquivados' },
  'Active schedules': { es: 'Programaciones activas', pt: 'Agendamentos ativos' },
  'All schedules': { es: 'Todas las programaciones', pt: 'Todos os agendamentos' },
  Active: { es: 'Activo', pt: 'Ativo' },
  active: { es: 'Activo', pt: 'Ativo' },
  inactive: { es: 'Inactivo', pt: 'Inativo' },
  'over {from}': { es: 'más de {from}', pt: 'acima de {from}' },
  'under {to}': { es: 'menos de {to}', pt: 'abaixo de {to}' },
  '{from} to {to}': { es: '{from} a {to}', pt: '{from} a {to}' },
  'from {from}': { es: 'desde {from}', pt: 'de {from}' },
  'up to {to}': { es: 'hasta {to}', pt: 'até {to}' },

  // Relative time
  today: { es: 'hoy', pt: 'hoje' },
  yesterday: { es: 'ayer', pt: 'ontem' },
  tomorrow: { es: 'mañana', pt: 'amanhã' },
  '{n} days ago': { es: 'hace {n} días', pt: 'há {n} dias' },
  'in {n} days': { es: 'dentro de {n} días', pt: 'em {n} dias' },
  'just now': { es: 'ahora mismo', pt: 'agora mesmo' },
  '1 minute ago': { es: 'hace 1 minuto', pt: 'há 1 minuto' },
  '{n} minutes ago': { es: 'hace {n} minutos', pt: 'há {n} minutos' },
  '1 hour ago': { es: 'hace 1 hora', pt: 'há 1 hora' },
  '{n} hours ago': { es: 'hace {n} horas', pt: 'há {n} horas' },

  // Lead status and source. Stored values stay English; these are the labels.
  Assigned: { es: 'Asignado', pt: 'Atribuído' },
  'In process': { es: 'En proceso', pt: 'Em processo' },
  Converted: { es: 'Convertido', pt: 'Convertido' },
  Recycled: { es: 'Reciclado', pt: 'Reciclado' },
  Closed: { es: 'Cerrado', pt: 'Fechado' },
  Call: { es: 'Llamada', pt: 'Ligação' },
  Email: { es: 'Correo', pt: 'E-mail' },
  'Existing customer': { es: 'Cliente actual', pt: 'Cliente atual' },
  Partner: { es: 'Socio', pt: 'Parceiro' },
  'Public relations': { es: 'Relaciones públicas', pt: 'Relações públicas' },
  Campaign: { es: 'Campaña', pt: 'Campanha' },
  Other: { es: 'Otro', pt: 'Outro' },

  // Deal type, aging, goals
  'New Business': { es: 'Nuevo negocio', pt: 'Novo negócio' },
  'Existing Business': { es: 'Negocio existente', pt: 'Negócio existente' },
  Renewal: { es: 'Renovación', pt: 'Renovação' },
  Upsell: { es: 'Venta adicional', pt: 'Upsell' },
  'Cross-sell': { es: 'Venta cruzada', pt: 'Cross-sell' },
  'New business': { es: 'Nuevo negocio', pt: 'Novo negócio' },
  'Existing business': { es: 'Negocio existente', pt: 'Negócio existente' },
  'On pace': { es: 'En ritmo', pt: 'No ritmo' },
  'Past expected': { es: 'Fuera de plazo', pt: 'Além do esperado' },
  Revenue: { es: 'Ingresos', pt: 'Receita' },
  'Deals closed': { es: 'Negocios cerrados', pt: 'Negócios fechados' },
  Activities: { es: 'Actividades', pt: 'Atividades' },
  Monthly: { es: 'Mensual', pt: 'Mensal' },
  Quarterly: { es: 'Trimestral', pt: 'Trimestral' },
  Yearly: { es: 'Anual', pt: 'Anual' },
  Custom: { es: 'Personalizado', pt: 'Personalizado' },
  'Target met': { es: 'Meta cumplida', pt: 'Meta atingida' },
  Slipping: { es: 'Retrasándose', pt: 'Atrasando' },
  'Behind pace': { es: 'Por detrás', pt: 'Atrás do ritmo' },
  Missed: { es: 'No alcanzada', pt: 'Não atingida' },

  // Tickets, tasks, invoices
  New: { es: 'Nuevo', pt: 'Novo' },
  Pending: { es: 'Pendiente', pt: 'Pendente' },
  Rejected: { es: 'Rechazado', pt: 'Recusado' },
  Duplicate: { es: 'Duplicado', pt: 'Duplicado' },
  Low: { es: 'Baja', pt: 'Baixa' },
  Normal: { es: 'Normal', pt: 'Normal' },
  High: { es: 'Alta', pt: 'Alta' },
  Urgent: { es: 'Urgente', pt: 'Urgente' },
  Medium: { es: 'Media', pt: 'Média' },
  Question: { es: 'Pregunta', pt: 'Pergunta' },
  Incident: { es: 'Incidente', pt: 'Incidente' },
  Problem: { es: 'Problema', pt: 'Problema' },
  'In Progress': { es: 'En progreso', pt: 'Em andamento' },
  Completed: { es: 'Completado', pt: 'Concluído' },
  'A ticket you cannot open': {
    es: 'Un ticket que no puedes abrir',
    pt: 'Um chamado que você não pode abrir'
  },
  'Past due': { es: 'Vencido', pt: 'Vencido' },
  Draft: { es: 'Borrador', pt: 'Rascunho' },
  Sent: { es: 'Enviado', pt: 'Enviado' },
  Viewed: { es: 'Visto', pt: 'Visualizado' },
  Paid: { es: 'Pagado', pt: 'Pago' },
  'Partially Paid': { es: 'Parcialmente pagado', pt: 'Parcialmente pago' },
  Cancelled: { es: 'Cancelado', pt: 'Cancelado' },
  Declined: { es: 'Rechazado', pt: 'Recusado' },
  Expired: { es: 'Vencido', pt: 'Expirado' },
  Waiting: { es: 'En espera', pt: 'Aguardando' },
  Approved: { es: 'Aprobado', pt: 'Aprovado' },
  Withdrawn: { es: 'Retirado', pt: 'Retirado' },
  Reviewed: { es: 'Revisado', pt: 'Revisado' },
  Weekly: { es: 'Semanal', pt: 'Semanal' },
  'Every 2 weeks': { es: 'Cada 2 semanas', pt: 'A cada 2 semanas' },
  'Every 6 months': { es: 'Cada 6 meses', pt: 'A cada 6 meses' },
  'Due on receipt': { es: 'Al recibir', pt: 'No recebimento' },
  'Net 15': { es: '15 días', pt: '15 dias' },
  'Net 30': { es: '30 días', pt: '30 dias' },
  'Net 45': { es: '45 días', pt: '45 dias' },
  'Net 60': { es: '60 días', pt: '60 dias' },

  // People and roles
  Admin: { es: 'Administrador', pt: 'Administrador' },
  Member: { es: 'Miembro', pt: 'Membro' },
  Employee: { es: 'Empleado', pt: 'Funcionário' },
  Manager: { es: 'Gerente', pt: 'Gerente' },
  Owner: { es: 'Propietario', pt: 'Proprietário' },
  'an admin': { es: 'administrador', pt: 'administrador' },
  'a member': { es: 'miembro', pt: 'membro' },
  Everyone: { es: 'Todos', pt: 'Todos' },
  'Just you': { es: 'Solo tú', pt: 'Só você' },
  Current: { es: 'Actual', pt: 'Atual' },

  // Routing, escalation, custom fields
  'Always to': { es: 'Siempre a', pt: 'Sempre para' },
  'Round-robin between': { es: 'Por turnos entre', pt: 'Em rodízio entre' },
  'Whoever has fewest open, of': {
    es: 'Quien tenga menos abiertos, de',
    pt: 'Quem tiver menos abertos, de'
  },
  'Anyone on': { es: 'Cualquiera de', pt: 'Qualquer um de' },
  Direct: { es: 'Directo', pt: 'Direto' },
  'Round robin': { es: 'Por turnos', pt: 'Rodízio' },
  'Least busy': { es: 'Menos ocupado', pt: 'Menos ocupado' },
  'By team': { es: 'Por equipo', pt: 'Por equipe' },
  'Sender domain': { es: 'Dominio del remitente', pt: 'Domínio do remetente' },
  Mailbox: { es: 'Buzón', pt: 'Caixa de entrada' },
  is: { es: 'es', pt: 'é' },
  'is one of': { es: 'es uno de', pt: 'é um de' },
  includes: { es: 'incluye', pt: 'inclui' },
  matches: { es: 'coincide con', pt: 'corresponde a' },
  Notify: { es: 'Avisar', pt: 'Avisar' },
  'Reassign to': { es: 'Reasignar a', pt: 'Reatribuir para' },
  'Notify and reassign to': { es: 'Avisar y reasignar a', pt: 'Avisar e reatribuir para' },
  Text: { es: 'Texto', pt: 'Texto' },
  'Long text': { es: 'Texto largo', pt: 'Texto longo' },
  Number: { es: 'Número', pt: 'Número' },
  Dropdown: { es: 'Lista', pt: 'Lista' },
  Date: { es: 'Fecha', pt: 'Data' },
  Checkbox: { es: 'Casilla', pt: 'Caixa de seleção' },
  Estimates: { es: 'Presupuestos', pt: 'Orçamentos' },
  'Recurring invoices': { es: 'Facturas recurrentes', pt: 'Faturas recorrentes' },

  // Tokens
  Revoked: { es: 'Revocado', pt: 'Revogado' },
  Live: { es: 'Activo', pt: 'Ativo' },
  'unused for {days} days': {
    es: 'sin uso desde hace {days} días',
    pt: 'sem uso há {days} dias'
  },
  'never used, issued {days} days ago': {
    es: 'nunca se usó, emitido hace {days} días',
    pt: 'nunca usado, emitido há {days} dias'
  },
  'Everything {name} can': { es: 'Todo lo que {name} puede', pt: 'Tudo o que {name} pode' },
  'Everything its owner can': {
    es: 'Todo lo que su dueño puede',
    pt: 'Tudo o que o dono pode'
  },
  'Read only': { es: 'Solo lectura', pt: 'Somente leitura' },
  'In 90 days': { es: 'En 90 días', pt: 'Em 90 dias' },
  'In 30 days': { es: 'En 30 días', pt: 'Em 30 dias' },
  'In 1 year': { es: 'En 1 año', pt: 'Em 1 ano' },
  Never: { es: 'Nunca', pt: 'Nunca' },

  // Sign-in
  'Sign in': { es: 'Iniciar sesión', pt: 'Entrar' },
  'Sign in to your workspace': { es: 'Entra a tu espacio', pt: 'Entre no seu espaço' },
  'Work email': { es: 'Correo de trabajo', pt: 'E-mail de trabalho' },
  'Send link': { es: 'Enviar enlace', pt: 'Enviar link' },
  'Google is unavailable': { es: 'Google · No disponible', pt: 'Google · Indisponível' },
  'Sign in · ConNexus-CRM': { es: 'Iniciar sesión · ConNexus-CRM', pt: 'Entrar · ConNexus-CRM' },
  'Sign in to ConNexus-CRM to manage your contacts, deals, and grow your business.': {
    es: 'Entra en ConNexus-CRM para gestionar contactos, negocios y hacer crecer tu empresa.',
    pt: 'Entre no ConNexus-CRM para gerenciar contatos, negócios e fazer a empresa crescer.'
  },
  'Welcome back. Choose how you\'d like to continue.': {
    es: 'Hola de nuevo. Elige cómo quieres continuar.',
    pt: 'Que bom te ver. Escolha como quer continuar.'
  },
  'Redirecting…': { es: 'Redirigiendo…', pt: 'Redirecionando…' },
  'Continue with Google': { es: 'Continuar con Google', pt: 'Continuar com o Google' },
  or: { es: 'o', pt: 'ou' },
  'Check your email.': { es: 'Revisa tu correo.', pt: 'Confira seu e-mail.' },
  'We sent a sign-in link. It expires in 10 minutes.': {
    es: 'Enviamos un enlace para entrar. Caduca en 10 minutos.',
    pt: 'Enviamos um link de acesso. Ele expira em 10 minutos.'
  },
  'Email address': { es: 'Correo electrónico', pt: 'E-mail' },
  'Sending…': { es: 'Enviando…', pt: 'Enviando…' },
  'Continue with email': { es: 'Continuar con el correo', pt: 'Continuar com o e-mail' },
  'New here? Enter your email above to get started.': {
    es: '¿Primera vez? Escribe tu correo arriba para empezar.',
    pt: 'Primeira vez? Digite seu e-mail acima para começar.'
  },
  Privacy: { es: 'Privacidad', pt: 'Privacidade' },
  Terms: { es: 'Términos', pt: 'Termos' },
  'Something went wrong. Please try again.': {
    es: 'Algo salió mal. Inténtalo de nuevo.',
    pt: 'Algo deu errado. Tente de novo.'
  },
  'Email is required': { es: 'El correo es obligatorio', pt: 'O e-mail é obrigatório' },
  'Missing verification token.': {
    es: 'Falta el código de verificación.',
    pt: 'Falta o código de verificação.'
  },
  'Verification failed': { es: 'No se pudo verificar', pt: 'Não foi possível verificar' },
  'Invalid or expired link': {
    es: 'El enlace no es válido o ya caducó',
    pt: 'O link é inválido ou já expirou'
  },

  // Profile fragments used before the page pass
  'Full name': { es: 'Nombre completo', pt: 'Nome completo' },
  Phone: { es: 'Teléfono', pt: 'Telefone' },
  'Digits and separators only. Leave blank to remove it.': {
    es: 'Solo dígitos y separadores. Déjalo en blanco para quitarlo.',
    pt: 'Apenas dígitos e separadores. Deixe em branco para remover.'
  },
  Teams: { es: 'Equipos', pt: 'Equipes' },
  Joined: { es: 'Ingreso', pt: 'Entrou em' },
  'Last signed in': { es: 'Último acceso', pt: 'Último acesso' },
  Organisations: { es: 'Organizaciones', pt: 'Organizações' },
  'You are {role} here': { es: 'Aquí eres {role}', pt: 'Aqui você é {role}' },
  Switch: { es: 'Cambiar', pt: 'Trocar' },
  Access: { es: 'Acceso', pt: 'Acesso' },
  Role: { es: 'Rol', pt: 'Papel' },
  'Set by an admin. You cannot change your own role.': {
    es: 'Lo define un administrador. No puedes cambiar tu propio rol.',
    pt: 'Definido por um administrador. Você não pode mudar o próprio papel.'
  },
  'API tokens': { es: 'Tokens de API', pt: 'Tokens de API' },
  'Each one signs in as you, with your role.': {
    es: 'Cada uno entra como tú, con tu rol.',
    pt: 'Cada um entra como você, com o seu papel.'
  },
  'Calendar feed': { es: 'Calendario', pt: 'Calendário' },
  'Your open tasks in Google Calendar, Outlook or Apple Calendar.': {
    es: 'Tus tareas abiertas en Google Calendar, Outlook o el calendario de Apple.',
    pt: 'Suas tarefas abertas no Google Calendar, Outlook ou Calendário da Apple.'
  },
  'Sign-in method': { es: 'Forma de acceso', pt: 'Forma de acesso' },
  You: { es: 'Tú', pt: 'Você' },
  'joined {date}': { es: 'desde {date}', pt: 'desde {date}' },

  // Industries. `industryLabel` title-cases the stored value and that string is the key.
  Advertising: { es: 'Publicidad', pt: 'Publicidade' },
  Agriculture: { es: 'Agricultura', pt: 'Agricultura' },
  'Apparel & accessories': { es: 'Ropa y accesorios', pt: 'Vestuário e acessórios' },
  Automotive: { es: 'Automotriz', pt: 'Automotivo' },
  Banking: { es: 'Banca', pt: 'Bancos' },
  Biotechnology: { es: 'Biotecnología', pt: 'Biotecnologia' },
  'Building materials & equipment': {
    es: 'Materiales y equipo de construcción',
    pt: 'Materiais e equipamentos de construção'
  },
  Chemical: { es: 'Química', pt: 'Química' },
  Computer: { es: 'Informática', pt: 'Informática' },
  Education: { es: 'Educación', pt: 'Educação' },
  Electronics: { es: 'Electrónica', pt: 'Eletrônicos' },
  Energy: { es: 'Energía', pt: 'Energia' },
  'Entertainment & leisure': { es: 'Entretenimiento y ocio', pt: 'Entretenimento e lazer' },
  Finance: { es: 'Finanzas', pt: 'Finanças' },
  'Food & beverage': { es: 'Alimentos y bebidas', pt: 'Alimentos e bebidas' },
  Grocery: { es: 'Abarrotes', pt: 'Mercearia' },
  Healthcare: { es: 'Salud', pt: 'Saúde' },
  Insurance: { es: 'Seguros', pt: 'Seguros' },
  Legal: { es: 'Legal', pt: 'Jurídico' },
  Manufacturing: { es: 'Manufactura', pt: 'Manufatura' },
  Publishing: { es: 'Editorial', pt: 'Editorial' },
  'Real estate': { es: 'Bienes raíces', pt: 'Imóveis' },
  Service: { es: 'Servicios', pt: 'Serviços' },
  Software: { es: 'Software', pt: 'Software' },
  Sports: { es: 'Deportes', pt: 'Esportes' },
  Technology: { es: 'Tecnología', pt: 'Tecnologia' },
  Telecommunications: { es: 'Telecomunicaciones', pt: 'Telecomunicações' },
  Television: { es: 'Televisión', pt: 'Televisão' },
  Transportation: { es: 'Transporte', pt: 'Transporte' },
  'Venture capital': { es: 'Capital de riesgo', pt: 'Capital de risco' }
};
