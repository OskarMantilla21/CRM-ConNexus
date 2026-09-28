/* Datos de demostración de la interfaz. No son los registros del SuiteCRM instalado. */
(function () {
  const people = ["Ana Ríos", "Luis Herrera", "Marta Solís"];

  const typeAccount = [
    { value: "Cliente", tone: "good" },
    { value: "Prospecto", tone: "info" },
    { value: "Socio", tone: "muted" },
  ];
  const stages = [
    { value: "Prospección", tone: "info" },
    { value: "Calificación", tone: "info" },
    { value: "Propuesta", tone: "warn" },
    { value: "Negociación", tone: "warn" },
    { value: "Cerrada ganada", tone: "good" },
    { value: "Cerrada perdida", tone: "bad" },
  ];
  const leadStatus = [
    { value: "Nuevo", tone: "info" },
    { value: "Asignado", tone: "info" },
    { value: "En proceso", tone: "warn" },
    { value: "Convertido", tone: "good" },
    { value: "Reciclado", tone: "muted" },
  ];
  const caseStatus = [
    { value: "Nuevo", tone: "info" },
    { value: "En curso", tone: "warn" },
    { value: "Pendiente", tone: "warn" },
    { value: "Resuelto", tone: "good" },
  ];
  const priority = [
    { value: "Baja", tone: "muted" },
    { value: "Media", tone: "info" },
    { value: "Alta", tone: "bad" },
  ];
  const taskStatus = [
    { value: "No iniciada", tone: "muted" },
    { value: "En curso", tone: "warn" },
    { value: "Completada", tone: "good" },
  ];
  const activityStatus = [
    { value: "Planificada", tone: "info" },
    { value: "Celebrada", tone: "good" },
    { value: "Cancelada", tone: "muted" },
  ];
  const campaignStatus = [
    { value: "Planificada", tone: "info" },
    { value: "Activa", tone: "good" },
    { value: "En pausa", tone: "warn" },
    { value: "Completa", tone: "muted" },
  ];

  const groups = [
    { id: "sales", label: "Ventas", modules: ["accounts", "contacts", "opportunities", "leads", "contracts", "quotes"] },
    { id: "marketing", label: "Marketing", modules: ["accounts", "contacts", "leads", "campaigns", "prospects", "prospectLists"] },
    { id: "support", label: "Soporte", modules: ["accounts", "contacts", "cases", "bugs"] },
    { id: "activities", label: "Actividades", modules: ["calendar", "calls", "meetings", "emails", "tasks", "notes"] },
    { id: "collaboration", label: "Colaboración", modules: ["emails", "documents", "projects"] },
    {
      id: "all",
      label: "Todos",
      modules: [
        "accounts", "contacts", "opportunities", "leads", "contracts", "quotes",
        "campaigns", "prospects", "prospectLists", "cases", "bugs", "calendar",
        "calls", "meetings", "emails", "tasks", "notes", "documents", "projects",
        "invoices", "products", "reports", "employees",
      ],
    },
  ];

  const modules = {
    accounts: {
      label: "Cuentas", singular: "cuenta", prefix: "acc", group: "sales", icon: "accounts",
      statusKey: "type",
      fields: [
        { key: "name", label: "Nombre", type: "text", required: true, list: true },
        { key: "type", label: "Tipo", type: "select", options: typeAccount, list: true },
        { key: "industry", label: "Sector", type: "select", options: ["Transporte", "Salud", "Alimentos", "Medios", "Manufactura", "Educación", "Hotelería"], list: true },
        { key: "phone", label: "Teléfono", type: "tel", list: true, compact: true },
        { key: "email", label: "Correo", type: "email" },
        { key: "website", label: "Sitio web", type: "url" },
        { key: "city", label: "Ciudad", type: "text", list: true, compact: true },
        { key: "billing", label: "Dirección de facturación", type: "text" },
        { key: "shipping", label: "Dirección de envío", type: "text" },
        { key: "assigned", label: "Asignado a", type: "select", options: people, list: true, compact: true },
        { key: "description", label: "Descripción", type: "textarea" },
      ],
      subpanels: [
        { module: "contacts", foreignKey: "accountId", label: "Contactos" },
        { module: "opportunities", foreignKey: "accountId", label: "Oportunidades" },
        { module: "cases", foreignKey: "accountId", label: "Casos" },
        { module: "meetings", foreignKey: "accountId", label: "Reuniones" },
      ],
    },
    contacts: {
      label: "Contactos", singular: "contacto", prefix: "con", group: "sales", icon: "contacts",
      fields: [
        { key: "name", label: "Nombre", type: "text", required: true, list: true },
        { key: "title", label: "Cargo", type: "text", list: true },
        { key: "accountId", label: "Cuenta", type: "lookup", module: "accounts", list: true },
        { key: "email", label: "Correo", type: "email", list: true, compact: true },
        { key: "phone", label: "Teléfono", type: "tel" },
        { key: "mobile", label: "Móvil", type: "tel", list: true, compact: true },
        { key: "city", label: "Ciudad", type: "text" },
        { key: "assigned", label: "Asignado a", type: "select", options: people, list: true, compact: true },
        { key: "description", label: "Descripción", type: "textarea" },
      ],
      subpanels: [
        { module: "opportunities", foreignKey: "contactId", label: "Oportunidades" },
        { module: "meetings", foreignKey: "contactId", label: "Reuniones" },
        { module: "calls", foreignKey: "contactId", label: "Llamadas" },
        { module: "tasks", foreignKey: "contactId", label: "Tareas" },
      ],
    },
    opportunities: {
      label: "Oportunidades", singular: "oportunidad", prefix: "opp", group: "sales", icon: "opportunities",
      statusKey: "stage",
      fields: [
        { key: "name", label: "Nombre", type: "text", required: true, list: true },
        { key: "accountId", label: "Cuenta", type: "lookup", module: "accounts", required: true, list: true },
        { key: "contactId", label: "Contacto", type: "lookup", module: "contacts" },
        { key: "stage", label: "Etapa", type: "select", options: stages, required: true, list: true },
        { key: "amount", label: "Importe", type: "currency", min: 0, list: true },
        { key: "probability", label: "Probabilidad (%)", type: "number", min: 0, max: 100 },
        { key: "closeDate", label: "Cierre previsto", type: "date", list: true, compact: true },
        { key: "assigned", label: "Asignado a", type: "select", options: people, list: true, compact: true },
        { key: "description", label: "Descripción", type: "textarea" },
      ],
      subpanels: [
        { module: "quotes", foreignKey: "opportunityId", label: "Cotizaciones" },
        { module: "meetings", foreignKey: "accountId", label: "Reuniones de la cuenta", match: "accountId" },
      ],
    },
    leads: {
      label: "Clientes potenciales", singular: "cliente potencial", prefix: "lead", group: "sales", icon: "leads",
      statusKey: "status",
      fields: [
        { key: "name", label: "Nombre", type: "text", required: true, list: true },
        { key: "company", label: "Empresa", type: "text", list: true },
        { key: "status", label: "Estado", type: "select", options: leadStatus, list: true },
        { key: "source", label: "Origen", type: "select", options: ["Web", "Referido", "Feria", "Llamada", "Correo"], list: true, compact: true },
        { key: "email", label: "Correo", type: "email" },
        { key: "phone", label: "Teléfono", type: "tel" },
        { key: "city", label: "Ciudad", type: "text", list: true, compact: true },
        { key: "assigned", label: "Asignado a", type: "select", options: people, list: true, compact: true },
        { key: "description", label: "Descripción", type: "textarea" },
      ],
    },
    contracts: {
      label: "Contratos", singular: "contrato", prefix: "ctr", group: "sales", icon: "contracts",
      statusKey: "status",
      fields: [
        { key: "name", label: "Nombre", type: "text", required: true, list: true },
        { key: "accountId", label: "Cuenta", type: "lookup", module: "accounts", required: true, list: true },
        { key: "status", label: "Estado", type: "select", options: [
          { value: "Borrador", tone: "muted" },
          { value: "Activo", tone: "good" },
          { value: "En renovación", tone: "warn" },
          { value: "Vencido", tone: "bad" },
        ], list: true },
        { key: "start", label: "Inicio", type: "date", list: true, compact: true },
        { key: "end", label: "Fin", type: "date", list: true, compact: true },
        { key: "value", label: "Valor", type: "currency", min: 0 },
        { key: "assigned", label: "Asignado a", type: "select", options: people },
        { key: "description", label: "Descripción", type: "textarea" },
      ],
    },
    quotes: {
      label: "Cotizaciones", singular: "cotización", prefix: "quo", group: "sales", icon: "quotes",
      statusKey: "status",
      fields: [
        { key: "name", label: "Asunto", type: "text", required: true, list: true },
        { key: "number", label: "Número", type: "text", list: true },
        { key: "accountId", label: "Cuenta", type: "lookup", module: "accounts", required: true, list: true },
        { key: "opportunityId", label: "Oportunidad", type: "lookup", module: "opportunities" },
        { key: "status", label: "Estado", type: "select", options: [
          { value: "Borrador", tone: "muted" },
          { value: "Enviada", tone: "info" },
          { value: "Aceptada", tone: "good" },
          { value: "Rechazada", tone: "bad" },
        ], list: true },
        { key: "amount", label: "Total", type: "currency", min: 0, list: true, compact: true },
        { key: "validUntil", label: "Válida hasta", type: "date", compact: true },
        { key: "assigned", label: "Asignado a", type: "select", options: people },
      ],
    },
    campaigns: {
      label: "Campañas", singular: "campaña", prefix: "cmp", group: "marketing", icon: "campaigns",
      statusKey: "status",
      fields: [
        { key: "name", label: "Nombre", type: "text", required: true, list: true },
        { key: "type", label: "Tipo", type: "select", options: ["Boletín", "Correo", "No correo"], list: true },
        { key: "status", label: "Estado", type: "select", options: campaignStatus, list: true },
        { key: "budget", label: "Presupuesto", type: "currency", min: 0, list: true, compact: true },
        { key: "start", label: "Inicio", type: "date", list: true, compact: true },
        { key: "end", label: "Fin", type: "date" },
        { key: "assigned", label: "Asignado a", type: "select", options: people },
        { key: "description", label: "Descripción", type: "textarea" },
      ],
    },
    prospects: {
      label: "Públicos objetivo", singular: "público objetivo", prefix: "pros", group: "marketing", icon: "prospects",
      fields: [
        { key: "name", label: "Nombre", type: "text", required: true, list: true },
        { key: "company", label: "Empresa", type: "text", list: true },
        { key: "listId", label: "Lista", type: "lookup", module: "prospectLists", list: true },
        { key: "email", label: "Correo", type: "email", list: true, compact: true },
        { key: "phone", label: "Teléfono", type: "tel" },
        { key: "city", label: "Ciudad", type: "text", compact: true },
        { key: "assigned", label: "Asignado a", type: "select", options: people },
      ],
    },
    prospectLists: {
      label: "Listas de público", singular: "lista de público", prefix: "plist", group: "marketing", icon: "lists",
      statusKey: "status",
      fields: [
        { key: "name", label: "Nombre", type: "text", required: true, list: true },
        { key: "type", label: "Tipo", type: "select", options: ["Clientes", "Prospectos", "Mixta"], list: true },
        { key: "status", label: "Estado", type: "select", options: [
          { value: "Activa", tone: "good" },
          { value: "Borrador", tone: "muted" },
        ], list: true },
        { key: "description", label: "Descripción", type: "textarea" },
      ],
      subpanels: [
        { module: "prospects", foreignKey: "listId", label: "Personas" },
      ],
    },
    cases: {
      label: "Casos", singular: "caso", prefix: "cas", group: "support", icon: "cases",
      statusKey: "status",
      fields: [
        { key: "name", label: "Asunto", type: "text", required: true, list: true },
        { key: "accountId", label: "Cuenta", type: "lookup", module: "accounts", required: true, list: true },
        { key: "contactId", label: "Contacto", type: "lookup", module: "contacts" },
        { key: "status", label: "Estado", type: "select", options: caseStatus, list: true },
        { key: "priority", label: "Prioridad", type: "select", options: priority, list: true },
        { key: "origin", label: "Origen", type: "select", options: ["Correo", "Teléfono", "Portal", "Interno"], compact: true },
        { key: "assigned", label: "Asignado a", type: "select", options: people, list: true, compact: true },
        { key: "description", label: "Descripción", type: "textarea" },
      ],
      subpanels: [
        { module: "notes", foreignKey: "caseId", label: "Notas" },
      ],
    },
    bugs: {
      label: "Incidencias", singular: "incidencia", prefix: "bug", group: "support", icon: "bugs",
      statusKey: "status",
      fields: [
        { key: "name", label: "Asunto", type: "text", required: true, list: true },
        { key: "status", label: "Estado", type: "select", options: [
          { value: "Abierto", tone: "bad" },
          { value: "En revisión", tone: "warn" },
          { value: "Corregido", tone: "good" },
        ], list: true },
        { key: "priority", label: "Prioridad", type: "select", options: priority, list: true },
        { key: "version", label: "Versión", type: "text", list: true, compact: true },
        { key: "assigned", label: "Asignado a", type: "select", options: people, compact: true },
        { key: "description", label: "Descripción", type: "textarea" },
      ],
    },
    calendar: {
      label: "Calendario", singular: "calendario", prefix: "calview", group: "activities", icon: "calendar",
      view: "calendar",
      fields: [],
    },
    calls: {
      label: "Llamadas", singular: "llamada", prefix: "call", group: "activities", icon: "calls",
      statusKey: "status",
      fields: [
        { key: "name", label: "Asunto", type: "text", required: true, list: true },
        { key: "direction", label: "Dirección", type: "select", options: ["Entrante", "Saliente"], list: true },
        { key: "status", label: "Estado", type: "select", options: [
          { value: "Planificada", tone: "info" },
          { value: "Completada", tone: "good" },
          { value: "No contestada", tone: "warn" },
        ], list: true },
        { key: "date", label: "Fecha", type: "date", required: true, list: true },
        { key: "time", label: "Hora", type: "text", list: true, compact: true },
        { key: "accountId", label: "Cuenta", type: "lookup", module: "accounts", compact: true },
        { key: "contactId", label: "Contacto", type: "lookup", module: "contacts" },
        { key: "assigned", label: "Asignado a", type: "select", options: people },
        { key: "description", label: "Descripción", type: "textarea" },
      ],
    },
    meetings: {
      label: "Reuniones", singular: "reunión", prefix: "mee", group: "activities", icon: "meetings",
      statusKey: "status",
      fields: [
        { key: "name", label: "Asunto", type: "text", required: true, list: true },
        { key: "status", label: "Estado", type: "select", options: activityStatus, list: true },
        { key: "date", label: "Fecha", type: "date", required: true, list: true },
        { key: "time", label: "Hora", type: "text", list: true },
        { key: "location", label: "Lugar", type: "text", list: true, compact: true },
        { key: "accountId", label: "Cuenta", type: "lookup", module: "accounts", compact: true },
        { key: "contactId", label: "Contacto", type: "lookup", module: "contacts" },
        { key: "assigned", label: "Asignado a", type: "select", options: people },
        { key: "description", label: "Descripción", type: "textarea" },
      ],
    },
    emails: {
      label: "Correos", singular: "correo", prefix: "ema", group: "activities", icon: "emails",
      statusKey: "status",
      fields: [
        { key: "name", label: "Asunto", type: "text", required: true, list: true },
        { key: "from", label: "De", type: "email", list: true },
        { key: "to", label: "Para", type: "email", list: true, compact: true },
        { key: "status", label: "Estado", type: "select", options: [
          { value: "Recibido", tone: "info" },
          { value: "Borrador", tone: "muted" },
          { value: "Enviado", tone: "good" },
        ], list: true },
        { key: "date", label: "Fecha", type: "date", list: true, compact: true },
        { key: "accountId", label: "Cuenta", type: "lookup", module: "accounts" },
        { key: "body", label: "Mensaje", type: "textarea" },
      ],
    },
    tasks: {
      label: "Tareas", singular: "tarea", prefix: "tas", group: "activities", icon: "tasks",
      statusKey: "status",
      fields: [
        { key: "name", label: "Asunto", type: "text", required: true, list: true },
        { key: "status", label: "Estado", type: "select", options: taskStatus, list: true },
        { key: "priority", label: "Prioridad", type: "select", options: priority, list: true },
        { key: "due", label: "Fecha límite", type: "date", required: true, list: true },
        { key: "accountId", label: "Cuenta", type: "lookup", module: "accounts", list: true, compact: true },
        { key: "contactId", label: "Contacto", type: "lookup", module: "contacts" },
        { key: "assigned", label: "Asignado a", type: "select", options: people, compact: true },
        { key: "description", label: "Descripción", type: "textarea" },
      ],
    },
    notes: {
      label: "Notas", singular: "nota", prefix: "not", group: "activities", icon: "notes",
      fields: [
        { key: "name", label: "Asunto", type: "text", required: true, list: true },
        { key: "date", label: "Fecha", type: "date", list: true },
        { key: "accountId", label: "Cuenta", type: "lookup", module: "accounts", list: true },
        { key: "contactId", label: "Contacto", type: "lookup", module: "contacts", compact: true },
        { key: "caseId", label: "Caso", type: "lookup", module: "cases", list: true, compact: true },
        { key: "body", label: "Nota", type: "textarea" },
      ],
    },
    documents: {
      label: "Documentos", singular: "documento", prefix: "doc", group: "collaboration", icon: "documents",
      statusKey: "status",
      fields: [
        { key: "name", label: "Nombre", type: "text", required: true, list: true },
        { key: "status", label: "Estado", type: "select", options: [
          { value: "Borrador", tone: "muted" },
          { value: "Vigente", tone: "good" },
          { value: "Archivado", tone: "info" },
        ], list: true },
        { key: "category", label: "Categoría", type: "select", options: ["Contrato", "Propuesta", "Factura", "Otro"], list: true },
        { key: "accountId", label: "Cuenta", type: "lookup", module: "accounts", list: true, compact: true },
        { key: "date", label: "Fecha", type: "date", compact: true },
        { key: "assigned", label: "Asignado a", type: "select", options: people },
      ],
    },
    projects: {
      label: "Proyectos", singular: "proyecto", prefix: "prj", group: "collaboration", icon: "projects",
      statusKey: "status",
      fields: [
        { key: "name", label: "Nombre", type: "text", required: true, list: true },
        { key: "accountId", label: "Cuenta", type: "lookup", module: "accounts", list: true },
        { key: "status", label: "Estado", type: "select", options: [
          { value: "Planificado", tone: "info" },
          { value: "En curso", tone: "warn" },
          { value: "Cerrado", tone: "good" },
        ], list: true },
        { key: "progress", label: "Avance", type: "percent", min: 0, max: 100, list: true },
        { key: "start", label: "Inicio", type: "date", compact: true },
        { key: "end", label: "Fin", type: "date", compact: true },
        { key: "assigned", label: "Asignado a", type: "select", options: people },
        { key: "description", label: "Descripción", type: "textarea" },
      ],
    },
    invoices: {
      label: "Facturas", singular: "factura", prefix: "inv", group: "all", icon: "invoices",
      statusKey: "status",
      fields: [
        { key: "name", label: "Asunto", type: "text", required: true, list: true },
        { key: "number", label: "Número", type: "text", list: true },
        { key: "accountId", label: "Cuenta", type: "lookup", module: "accounts", required: true, list: true },
        { key: "status", label: "Estado", type: "select", options: [
          { value: "Borrador", tone: "muted" },
          { value: "Emitida", tone: "info" },
          { value: "Pagada", tone: "good" },
          { value: "Vencida", tone: "bad" },
        ], list: true },
        { key: "amount", label: "Total", type: "currency", min: 0, list: true, compact: true },
        { key: "due", label: "Vencimiento", type: "date", compact: true },
        { key: "assigned", label: "Asignado a", type: "select", options: people },
      ],
    },
    products: {
      label: "Productos", singular: "producto", prefix: "prod", group: "all", icon: "products",
      statusKey: "status",
      fields: [
        { key: "name", label: "Nombre", type: "text", required: true, list: true },
        { key: "category", label: "Categoría", type: "select", options: ["Servicio", "Licencia", "Producto"], list: true },
        { key: "price", label: "Precio", type: "currency", min: 0, list: true },
        { key: "status", label: "Estado", type: "select", options: [
          { value: "Activo", tone: "good" },
          { value: "Retirado", tone: "muted" },
        ], list: true },
        { key: "description", label: "Descripción", type: "textarea" },
      ],
    },
    reports: {
      label: "Informes", singular: "informe", prefix: "rep", group: "all", icon: "reports",
      fields: [
        { key: "name", label: "Nombre", type: "text", required: true, list: true },
        { key: "target", label: "Módulo", type: "text", list: true },
        { key: "chart", label: "Gráfico", type: "select", options: ["Barras", "Tarta"], list: true },
        { key: "assigned", label: "Asignado a", type: "select", options: people, list: true, compact: true },
        { key: "description", label: "Descripción", type: "textarea" },
      ],
    },
    employees: {
      label: "Empleados", singular: "empleado", prefix: "emp", group: "all", icon: "employees",
      fields: [
        { key: "name", label: "Nombre", type: "text", required: true, list: true },
        { key: "title", label: "Cargo", type: "text", list: true },
        { key: "department", label: "Área", type: "select", options: ["Comercial", "Soporte", "Marketing", "Operaciones"], list: true },
        { key: "email", label: "Correo", type: "email", list: true, compact: true },
        { key: "phone", label: "Teléfono", type: "tel", compact: true },
        { key: "city", label: "Ciudad", type: "text" },
      ],
    },
  };

  const seed = {
    accounts: [
      { id: "acc-1", favorite: true, name: "Andes Logística S.A.S.", type: "Cliente", industry: "Transporte", phone: "+57 601 555 0142", email: "hola@andeslogistica.example", website: "https://andeslogistica.example", city: "Bogotá", billing: "Cra 7 # 71-21, Bogotá", shipping: "Cra 7 # 71-21, Bogotá", assigned: "Ana Ríos", description: "Operador logístico del centro del país. Renueva la flota este trimestre." },
      { id: "acc-2", favorite: false, name: "Clínica Aurora", type: "Cliente", industry: "Salud", phone: "+57 604 555 2280", email: "sistemas@clinicaaurora.example", website: "https://clinicaaurora.example", city: "Medellín", billing: "Cll 10 # 43-12, Medellín", shipping: "Cll 10 # 43-12, Medellín", assigned: "Luis Herrera", description: "Clínica privada. Está evaluando el portal de pacientes." },
      { id: "acc-3", favorite: false, name: "Café del Páramo", type: "Cliente", industry: "Alimentos", phone: "+57 606 555 0194", email: "pedidos@cafedelparamo.example", website: "https://cafedelparamo.example", city: "Manizales", billing: "Km 3 vía al Magdalena", shipping: "Km 3 vía al Magdalena", assigned: "Marta Solís", description: "Exportador de café de origen. Compra suscripción para oficinas aliadas." },
      { id: "acc-4", favorite: false, name: "Editorial Lumen", type: "Prospecto", industry: "Medios", phone: "+57 601 555 7731", email: "editorial@lumen.example", website: "https://lumen.example", city: "Bogotá", billing: "Cll 45 # 19-08", shipping: "Cll 45 # 19-08", assigned: "Ana Ríos", description: "Editorial independiente. Pidió un catálogo ilustrado." },
      { id: "acc-5", favorite: true, name: "Taller Norte", type: "Socio", industry: "Manufactura", phone: "+57 602 555 4410", email: "taller@nortemetal.example", website: "https://nortemetal.example", city: "Cali", billing: "Cra 1 # 62-40", shipping: "Cra 1 # 62-40", assigned: "Luis Herrera", description: "Socio de mantenimiento. El contrato anual está vigente." },
    ],
    contacts: [
      { id: "con-1", favorite: true, name: "Laura Méndez", title: "Gerente de operaciones", accountId: "acc-1", email: "laura.mendez@andeslogistica.example", phone: "+57 601 555 0142", mobile: "+57 310 555 0188", city: "Bogotá", assigned: "Ana Ríos", description: "Decide la renovación de la flota." },
      { id: "con-2", favorite: false, name: "Julián Pardo", title: "Compras", accountId: "acc-1", email: "julian.pardo@andeslogistica.example", phone: "+57 601 555 0160", mobile: "+57 315 555 0102", city: "Bogotá", assigned: "Ana Ríos", description: "Emite la orden de compra." },
      { id: "con-3", favorite: false, name: "Diana Ospina", title: "Directora de sistemas", accountId: "acc-2", email: "diana.ospina@clinicaaurora.example", phone: "+57 604 555 2288", mobile: "+57 300 555 4411", city: "Medellín", assigned: "Luis Herrera", description: "Lidera el proyecto del portal." },
      { id: "con-4", favorite: false, name: "Camilo Restrepo", title: "Jefe de planta", accountId: "acc-3", email: "camilo.restrepo@cafedelparamo.example", phone: "+57 606 555 0194", mobile: "+57 312 555 9090", city: "Manizales", assigned: "Marta Solís", description: "Coordina la cata y los lotes." },
      { id: "con-5", favorite: false, name: "Sofía Arenas", title: "Editora", accountId: "acc-4", email: "sofia.arenas@lumen.example", phone: "+57 601 555 7731", mobile: "+57 301 555 1212", city: "Bogotá", assigned: "Ana Ríos", description: "Revisa el alcance del catálogo." },
      { id: "con-6", favorite: false, name: "Helena Cruz", title: "Producción", accountId: "acc-5", email: "helena.cruz@nortemetal.example", phone: "+57 602 555 4419", mobile: "+57 318 555 3030", city: "Cali", assigned: "Luis Herrera", description: "Contacto del contrato de mantenimiento." },
    ],
    opportunities: [
      { id: "opp-1", favorite: true, name: "Renovación de flota", accountId: "acc-1", contactId: "con-1", stage: "Negociación", amount: 85000000, probability: 70, closeDate: "2026-10-15", assigned: "Ana Ríos", description: "Doce vehículos de reparto y el plan de soporte." },
      { id: "opp-2", favorite: false, name: "Portal de pacientes", accountId: "acc-2", contactId: "con-3", stage: "Propuesta", amount: 42000000, probability: 50, closeDate: "2026-11-02", assigned: "Luis Herrera", description: "Fase 1: citas, resultados y mensajería." },
      { id: "opp-3", favorite: false, name: "Suscripción de café para oficinas", accountId: "acc-3", contactId: "con-4", stage: "Calificación", amount: 18000000, probability: 30, closeDate: "2026-10-28", assigned: "Marta Solís", description: "Programa trimestral para clientes corporativos del tostador." },
      { id: "opp-4", favorite: false, name: "Catálogo ilustrado", accountId: "acc-4", contactId: "con-5", stage: "Prospección", amount: 9600000, probability: 15, closeDate: "2026-12-01", assigned: "Ana Ríos", description: "Pieza impresa y versión digital." },
      { id: "opp-5", favorite: false, name: "Contrato de mantenimiento", accountId: "acc-5", contactId: "con-6", stage: "Cerrada ganada", amount: 24000000, probability: 100, closeDate: "2026-01-15", assigned: "Luis Herrera", description: "Cerrado en enero. El servicio ya está en curso." },
    ],
    leads: [
      { id: "lead-1", favorite: false, name: "Inés Barrera", company: "Hotel Bruma", status: "Nuevo", source: "Web", email: "ines.barrera@hotelbruma.example", phone: "+57 601 555 8801", city: "Villa de Leyva", assigned: "Marta Solís", description: "Dejó sus datos pidiendo amenities de café." },
      { id: "lead-2", favorite: true, name: "Tomás Gil", company: "FríoAndino", status: "Asignado", source: "Referido", email: "tomas.gil@frioandino.example", phone: "+57 607 555 2200", city: "Bucaramanga", assigned: "Ana Ríos", description: "Referido por Andes Logística. Busca transporte refrigerado." },
      { id: "lead-3", favorite: false, name: "Valeria Paz", company: "Colegio Arrayán", status: "En proceso", source: "Feria", email: "valeria.paz@arrayan.example", phone: "+57 602 555 1177", city: "Cali", assigned: "Luis Herrera", description: "La conocimos en la feria de educación. Quiere el portal." },
      { id: "lead-4", favorite: false, name: "Pedro León", company: "Rutas del Sol", status: "Reciclado", source: "Llamada", email: "pedro.leon@rutasdelsol.example", phone: "+57 605 555 0909", city: "Barranquilla", assigned: "Ana Ríos", description: "No tiene presupuesto este año. Volver a llamarlo en enero." },
    ],
    contracts: [
      { id: "ctr-1", favorite: false, name: "Mantenimiento anual", accountId: "acc-5", status: "Activo", start: "2026-01-01", end: "2026-12-31", value: 24000000, assigned: "Luis Herrera", description: "Visitas mensuales y repuestos de desgaste." },
      { id: "ctr-2", favorite: false, name: "Urgencias logísticas", accountId: "acc-1", status: "En renovación", start: "2025-10-01", end: "2026-09-30", value: 36000000, assigned: "Ana Ríos", description: "Cubre rutas nocturnas. La renovación está en negociación." },
    ],
    quotes: [
      { id: "quo-1", favorite: false, name: "Flota tercer trimestre", number: "COT-2026-014", accountId: "acc-1", opportunityId: "opp-1", status: "Enviada", amount: 62000000, validUntil: "2026-10-10", assigned: "Ana Ríos" },
      { id: "quo-2", favorite: false, name: "Portal clínico, fase 1", number: "COT-2026-021", accountId: "acc-2", opportunityId: "opp-2", status: "Borrador", amount: 42000000, validUntil: "2026-11-15", assigned: "Luis Herrera" },
    ],
    campaigns: [
      { id: "cmp-1", favorite: false, name: "Boletín de cosecha", type: "Boletín", status: "Activa", budget: 4500000, start: "2026-09-01", end: "2026-10-15", assigned: "Marta Solís", description: "Novedades de origen para la lista de cafeteros." },
      { id: "cmp-2", favorite: false, name: "Lanzamiento del portal", type: "Correo", status: "Planificada", budget: 8000000, start: "2026-10-20", end: "2026-11-20", assigned: "Luis Herrera", description: "Secuencia de tres correos para clínicas privadas." },
    ],
    prospects: [
      { id: "pros-1", favorite: false, name: "Nubia Cano", company: "Cooperativa Río Claro", listId: "plist-1", email: "nubia.cano@rioclaro.example", phone: "+57 606 555 3003", city: "Chinchiná", assigned: "Marta Solís" },
      { id: "pros-2", favorite: false, name: "Esteban Mora", company: "Librería Central", listId: "plist-2", email: "esteban.mora@libreriacentral.example", phone: "+57 601 555 4545", city: "Bogotá", assigned: "Ana Ríos" },
    ],
    prospectLists: [
      { id: "plist-1", favorite: false, name: "Cafeteros de la región andina", type: "Prospectos", status: "Activa", description: "Cooperativas y fincas para el boletín de cosecha." },
      { id: "plist-2", favorite: false, name: "Clínicas privadas", type: "Mixta", status: "Borrador", description: "Lista en armado para el lanzamiento del portal." },
    ],
    cases: [
      { id: "cas-1", favorite: true, name: "Retraso en la entrega del eje", accountId: "acc-1", contactId: "con-1", status: "En curso", priority: "Alta", origin: "Teléfono", assigned: "Ana Ríos", description: "El repuesto salió el viernes y no aparece en la guía." },
      { id: "cas-2", favorite: false, name: "Sin acceso al portal de pacientes", accountId: "acc-2", contactId: "con-3", status: "Nuevo", priority: "Alta", origin: "Correo", assigned: "Luis Herrera", description: "El perfil de dirección médica no entra desde el lunes." },
      { id: "cas-3", favorite: false, name: "Factura con IVA incorrecto", accountId: "acc-3", contactId: "con-4", status: "Pendiente", priority: "Media", origin: "Correo", assigned: "Marta Solís", description: "Piden nota crédito por la factura FAC-2026-136." },
      { id: "cas-4", favorite: false, name: "Consulta de disponibilidad", accountId: "acc-5", contactId: "con-6", status: "Resuelto", priority: "Baja", origin: "Portal", assigned: "Luis Herrera", description: "Se confirmó cupo para la visita del 2 de octubre." },
    ],
    bugs: [
      { id: "bug-1", favorite: false, name: "La dirección de envío no se guarda", status: "Abierto", priority: "Alta", version: "7.15.2", assigned: "Luis Herrera", description: "Al copiar facturación hacia envío, el segundo guardado vuelve a dejar el campo vacío." },
      { id: "bug-2", favorite: false, name: "El PDF de la cotización corta el total", status: "En revisión", priority: "Media", version: "7.15.2", assigned: "Ana Ríos", description: "El total se sale del margen cuando hay más de ocho líneas." },
    ],
    calls: [
      { id: "call-1", favorite: false, name: "Cierre del mantenimiento", direction: "Saliente", status: "Completada", date: "2026-09-28", time: "16:00", accountId: "acc-5", contactId: "con-6", assigned: "Luis Herrera", description: "Helena confirmó la visita de octubre." },
      { id: "call-2", favorite: false, name: "Descubrimiento con Editorial Lumen", direction: "Entrante", status: "Planificada", date: "2026-09-29", time: "11:00", accountId: "acc-4", contactId: "con-5", assigned: "Ana Ríos", description: "Sofía llama para acotar páginas y tiraje." },
      { id: "call-3", favorite: false, name: "Confirmación de acceso", direction: "Saliente", status: "Completada", date: "2026-09-24", time: "08:30", accountId: "acc-2", contactId: "con-3", assigned: "Luis Herrera", description: "Quedó registro del fallo. Se abrió el caso." },
    ],
    meetings: [
      { id: "mee-1", favorite: true, name: "Seguimiento de flota", status: "Planificada", date: "2026-09-28", time: "10:00", location: "Sala 2, Bogotá", accountId: "acc-1", contactId: "con-1", assigned: "Ana Ríos", description: "Revisar la cotización COT-2026-014 con operaciones y compras." },
      { id: "mee-2", favorite: false, name: "Revisión de la propuesta clínica", status: "Planificada", date: "2026-09-29", time: "15:30", location: "Virtual", accountId: "acc-2", contactId: "con-3", assigned: "Luis Herrera", description: "Diana quiere ver el alcance de la fase 1." },
      { id: "mee-3", favorite: false, name: "Cata del lote de septiembre", status: "Planificada", date: "2026-09-30", time: "09:00", location: "Planta, Manizales", accountId: "acc-3", contactId: "con-4", assigned: "Marta Solís", description: "Selección de perfil para la suscripción de oficinas." },
    ],
    emails: [
      { id: "ema-1", favorite: false, name: "Propuesta del portal de pacientes", from: "diana.ospina@clinicaaurora.example", to: "luis.herrera@connexus.example", status: "Recibido", date: "2026-09-27", accountId: "acc-2", body: "Luis, revisé el borrador. ¿Podemos ver mañana el alcance de citas y resultados antes de pasarlo a gerencia?" },
      { id: "ema-2", favorite: false, name: "Orden de compra parcial de la flota", from: "julian.pardo@andeslogistica.example", to: "ana.rios@connexus.example", status: "Recibido", date: "2026-09-26", accountId: "acc-1", body: "Ana, compras puede emitir la orden por ocho vehículos esta semana. Los otros cuatro quedan para octubre." },
      { id: "ema-3", favorite: false, name: "Confirmación de la cata", from: "marta.solis@connexus.example", to: "camilo.restrepo@cafedelparamo.example", status: "Enviado", date: "2026-09-25", accountId: "acc-3", body: "Camilo, quedamos el miércoles 30 a las 9:00 en planta. Llevo la ficha de la suscripción." },
    ],
    tasks: [
      { id: "tas-1", favorite: false, name: "Enviar la propuesta actualizada", status: "En curso", priority: "Alta", due: "2026-09-28", accountId: "acc-2", contactId: "con-3", assigned: "Luis Herrera", description: "Incluir el cronograma de la fase 1 antes de la reunión de mañana." },
      { id: "tas-2", favorite: true, name: "Pedir la orden de compra", status: "No iniciada", priority: "Alta", due: "2026-09-26", accountId: "acc-1", contactId: "con-2", assigned: "Ana Ríos", description: "Julián quedó de enviarla el viernes. Hace falta el PDF firmado." },
      { id: "tas-3", favorite: false, name: "Actualizar la base de conocimiento", status: "No iniciada", priority: "Media", due: "2026-10-01", accountId: "", contactId: "", assigned: "Luis Herrera", description: "Documentar el fallo de la dirección de envío." },
      { id: "tas-4", favorite: false, name: "Cerrar el caso de la factura", status: "En curso", priority: "Baja", due: "2026-09-28", accountId: "acc-3", contactId: "con-4", assigned: "Marta Solís", description: "Falta la nota crédito firmada por contabilidad." },
    ],
    notes: [
      { id: "not-1", favorite: false, name: "La guía no coincide con el despacho", date: "2026-09-27", accountId: "acc-1", contactId: "con-1", caseId: "cas-1", body: "Laura dice que el transportista muestra la guía en tránsito, pero bodega no tiene el eje." },
      { id: "not-2", favorite: false, name: "IVA calculado con la tarifa anterior", date: "2026-09-25", accountId: "acc-3", contactId: "con-4", caseId: "cas-3", body: "Contabilidad confirma que la factura tomó el 19% sobre una base que ya traía impuesto." },
    ],
    documents: [
      { id: "doc-1", favorite: false, name: "Cotización flota COT-2026-014", status: "Vigente", category: "Propuesta", accountId: "acc-1", date: "2026-09-20", assigned: "Ana Ríos" },
      { id: "doc-2", favorite: false, name: "Contrato de mantenimiento 2026", status: "Vigente", category: "Contrato", accountId: "acc-5", date: "2026-01-10", assigned: "Luis Herrera" },
    ],
    projects: [
      { id: "prj-1", favorite: false, name: "Portal de pacientes", accountId: "acc-2", status: "En curso", progress: 35, start: "2026-09-01", end: "2026-12-15", assigned: "Luis Herrera", description: "Descubrimiento y fase 1. El diagrama de Gantt queda para una entrega siguiente." },
      { id: "prj-2", favorite: false, name: "Renovación de flota", accountId: "acc-1", status: "Planificado", progress: 10, start: "2026-10-01", end: "2026-11-30", assigned: "Ana Ríos", description: "Arranca cuando esté la orden de compra." },
    ],
    invoices: [
      { id: "inv-1", favorite: false, name: "Mantenimiento de septiembre", number: "FAC-2026-118", accountId: "acc-5", status: "Pagada", amount: 2000000, due: "2026-09-15", assigned: "Luis Herrera" },
      { id: "inv-2", favorite: false, name: "Anticipo de urgencias logísticas", number: "FAC-2026-141", accountId: "acc-1", status: "Emitida", amount: 9000000, due: "2026-10-05", assigned: "Ana Ríos" },
    ],
    products: [
      { id: "prod-1", favorite: false, name: "Plan de soporte anual", category: "Servicio", price: 24000000, status: "Activo", description: "Visitas, repuestos de desgaste y línea de atención." },
      { id: "prod-2", favorite: false, name: "Licencia del portal", category: "Licencia", price: 18000000, status: "Activo", description: "Uso anual del portal de pacientes, hasta 200 usuarios." },
    ],
    reports: [
      {
        id: "rep-1", favorite: false, name: "Pipeline por etapa", target: "Oportunidades", chart: "Barras", assigned: "Ana Ríos",
        description: "Importe abierto por etapa de venta.", metricKind: "money",
        metrics: [
          { label: "Prospección", value: 9600000 },
          { label: "Calificación", value: 18000000 },
          { label: "Propuesta", value: 42000000 },
          { label: "Negociación", value: 85000000 },
        ],
      },
      {
        id: "rep-2", favorite: false, name: "Casos por prioridad", target: "Casos", chart: "Barras", assigned: "Luis Herrera",
        description: "Casos que todavía no están resueltos.", metricKind: "count",
        metrics: [
          { label: "Alta", value: 2 },
          { label: "Media", value: 1 },
          { label: "Baja", value: 0 },
        ],
      },
    ],
    employees: [
      { id: "emp-1", favorite: false, name: "Ana Ríos", title: "Ejecutiva comercial", department: "Comercial", email: "ana.rios@connexus.example", phone: "+57 601 555 1001", city: "Bogotá" },
      { id: "emp-2", favorite: false, name: "Luis Herrera", title: "Consultor de soporte", department: "Soporte", email: "luis.herrera@connexus.example", phone: "+57 604 555 1002", city: "Medellín" },
      { id: "emp-3", favorite: false, name: "Marta Solís", title: "Marketing", department: "Marketing", email: "marta.solis@connexus.example", phone: "+57 606 555 1003", city: "Manizales" },
    ],
  };

  window.CONNEXUS = {
    groups: groups,
    modules: modules,
    seed: seed,
    users: {
      ana: { password: "conexus", name: "Ana Ríos", role: "Comercial", email: "ana.rios@connexus.example" },
    },
    alerts: [
      { id: "a1", title: "Caso en prioridad alta", body: "Clínica Aurora sigue sin acceso al portal.", href: "#/cases/cas-2", time: "Hace 25 min" },
      { id: "a2", title: "Tarea vencida", body: "Pedir la orden de compra a Andes Logística.", href: "#/tasks/tas-2", time: "Ayer" },
      { id: "a3", title: "Reunión hoy", body: "Seguimiento de flota a las 10:00.", href: "#/meetings/mee-1", time: "Hoy, 10:00" },
    ],
    quickCreate: [
      { module: "accounts", label: "Cuenta" },
      { module: "contacts", label: "Contacto" },
      { module: "opportunities", label: "Oportunidad" },
      { module: "leads", label: "Cliente potencial" },
      { module: "cases", label: "Caso" },
      { module: "tasks", label: "Tarea" },
    ],
  };
})();
