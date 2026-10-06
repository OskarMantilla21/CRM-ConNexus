import { addMessages } from '../translate.js';

/** Settings screens that were still hardcoded in English. */
export const messages = {
  // Shared on these screens
  '{name} (no longer active)': {
    es: '{name} (ya no está activo)',
    pt: '{name} (não está mais ativo)'
  },
  '{n}h': { es: '{n}h', pt: '{n}h' },
  '{n}h default': { es: '{n}h predeterminado', pt: '{n}h padrão' },
  '{n} (default)': { es: '{n} (predeterminado)', pt: '{n} (padrão)' },
  'Add a choice': { es: 'Añadir una opción', pt: 'Adicionar uma opção' },
  'Add a condition': { es: 'Añadir una condición', pt: 'Adicionar uma condição' },
  'Add a field': { es: 'Añadir un campo', pt: 'Adicionar um campo' },
  'Add address': { es: 'Añadir dirección', pt: 'Adicionar endereço' },
  'Add field': { es: 'Añadir campo', pt: 'Adicionar campo' },
  'Add holiday': { es: 'Añadir feriado', pt: 'Adicionar feriado' },
  'Add macro': { es: 'Añadir macro', pt: 'Adicionar macro' },
  'Add policy': { es: 'Añadir política', pt: 'Adicionar política' },
  'Add rule': { es: 'Añadir regla', pt: 'Adicionar regra' },
  'Add stage': { es: 'Añadir etapa', pt: 'Adicionar etapa' },
  ' (none defined)': { es: ' (ninguno definido)', pt: ' (nenhum definido)' },
  'A lead': { es: 'Un prospecto', pt: 'Um lead' },
  'A ticket': { es: 'Un ticket', pt: 'Um chamado' },
  'Choose a field': { es: 'Elige un campo', pt: 'Escolha um campo' },
  'Choose a team': { es: 'Elige un equipo', pt: 'Escolha uma equipe' },
  'Choose one…': { es: 'Elige uno…', pt: 'Escolha um…' },
  Closed: { es: 'Cerrado', pt: 'Fechado' },
  'Company name': { es: 'Nombre de la empresa', pt: 'Nome da empresa' },
  'Copied': { es: 'Copiado', pt: 'Copiado' },
  'Copy': { es: 'Copiar', pt: 'Copiar' },
  'Create pipeline': { es: 'Crear embudo', pt: 'Criar funil' },
  'Custom field': { es: 'Campo personalizado', pt: 'Campo personalizado' },
  'Custom field: {key}': { es: 'Campo personalizado: {key}', pt: 'Campo personalizado: {key}' },
  default: { es: 'predeterminado', pt: 'padrão' },
  Default: { es: 'Predeterminado', pt: 'Padrão' },
  'Delete permanently': { es: 'Eliminar para siempre', pt: 'Excluir de vez' },
  'Delete pipeline': { es: 'Eliminar embudo', pt: 'Excluir funil' },
  'Delete stage': { es: 'Eliminar etapa', pt: 'Excluir etapa' },
  'Delete this form': { es: 'Eliminar este formulario', pt: 'Excluir este formulário' },
  'Edit {priority} policy': { es: 'Editar la política {priority}', pt: 'Editar a política {priority}' },
  'fields across': { es: 'campos en', pt: 'campos em' },
  Fields: { es: 'Campos', pt: 'Campos' },
  'First name': { es: 'Nombre', pt: 'Nome' },
  'First response action': { es: 'Acción de primera respuesta', pt: 'Ação da primeira resposta' },
  'First response target': { es: 'Destino de la primera respuesta', pt: 'Destino da primeira resposta' },
  'First response target (hours)': {
    es: 'Meta de primera respuesta (horas)',
    pt: 'Meta da primeira resposta (horas)'
  },
  Form: { es: 'Formulario', pt: 'Formulário' },
  Friday: { es: 'Viernes', pt: 'Sexta-feira' },
  'Give the pipeline a name.': { es: 'Ponle un nombre al embudo.', pt: 'Dê um nome ao funil.' },
  'Give the stage a name.': { es: 'Ponle un nombre a la etapa.', pt: 'Dê um nome à etapa.' },
  Holidays: { es: 'Feriados', pt: 'Feriados' },
  'hours a week': { es: 'horas por semana', pt: 'horas por semana' },
  'in the last 30 days': { es: 'en los últimos 30 días', pt: 'nos últimos 30 dias' },
  'in the last 30 days, none of them acted on': {
    es: 'en los últimos 30 días, y no se actuó sobre ninguno',
    pt: 'nos últimos 30 dias, e nenhum teve ação'
  },
  'Job title': { es: 'Cargo', pt: 'Cargo' },
  Kind: { es: 'Tipo', pt: 'Tipo' },
  Label: { es: 'Etiqueta', pt: 'Rótulo' },
  Lead: { es: 'Prospecto', pt: 'Lead' },
  Placeholder: { es: 'Texto de ejemplo', pt: 'Texto de exemplo' },
  'Last name': { es: 'Apellido', pt: 'Sobrenome' },
  'Lead field': { es: 'Campo de prospecto', pt: 'Campo de lead' },
  leads: { es: 'prospectos', pt: 'leads' },
  Lost: { es: 'Perdido', pt: 'Perdido' },
  Message: { es: 'Mensaje', pt: 'Mensagem' },
  Monday: { es: 'Lunes', pt: 'Segunda-feira' },
  'Move {name} down': { es: 'Bajar {name}', pt: 'Descer {name}' },
  'Move {name} up': { es: 'Subir {name}', pt: 'Subir {name}' },
  'New address': { es: 'Nueva dirección', pt: 'Novo endereço' },
  'New custom field': { es: 'Nuevo campo personalizado', pt: 'Novo campo personalizado' },
  'New field': { es: 'Nuevo campo', pt: 'Novo campo' },
  'New form': { es: 'Nuevo formulario', pt: 'Novo formulário' },
  'New macro': { es: 'Nuevo macro', pt: 'Novo macro' },
  'New pipeline': { es: 'Nuevo embudo', pt: 'Novo funil' },
  'New policy': { es: 'Nueva política', pt: 'Nova política' },
  'New rule': { es: 'Nueva regla', pt: 'Nova regra' },
  'New stage': { es: 'Nueva etapa', pt: 'Nova etapa' },
  'Next response target (hours)': {
    es: 'Meta de siguiente respuesta (horas)',
    pt: 'Meta da próxima resposta (horas)'
  },
  'No change': { es: 'Sin cambio', pt: 'Sem alteração' },
  'No team': { es: 'Sin equipo', pt: 'Sem equipe' },
  'No teams in this org yet.': {
    es: 'Todavía no hay equipos en esta organización.',
    pt: 'Ainda não há equipes nesta organização.'
  },
  'No type': { es: 'Sin tipo', pt: 'Sem tipo' },
  None: { es: 'Ninguno', pt: 'Nenhum' },
  Nobody: { es: 'Nadie', pt: 'Ninguém' },
  'of deal stages': { es: 'de etapas de negocio', pt: 'de etapas de negócio' },
  'On {records}': { es: 'En {records}', pt: 'Em {records}' },
  'on the lead board': { es: 'en el tablero de prospectos', pt: 'no quadro de leads' },
  Open: { es: 'Abierto', pt: 'Aberto' },
  'Open hours': { es: 'Horario de atención', pt: 'Horário de atendimento' },
  'Open the board': { es: 'Abrir el tablero', pt: 'Abrir o quadro' },
  Order: { es: 'Orden', pt: 'Ordem' },
  'Pipeline name': { es: 'Nombre del embudo', pt: 'Nome do funil' },
  pipeline: { es: 'embudo', pt: 'funil' },
  pipelines: { es: 'embudos', pt: 'funis' },
  'Postal code': { es: 'Código postal', pt: 'CEP' },
  Publish: { es: 'Publicar', pt: 'Publicar' },
  'record types': { es: 'tipos de registro', pt: 'tipos de registro' },
  Required: { es: 'Obligatorio', pt: 'Obrigatório' },
  'Resolution action': { es: 'Acción de resolución', pt: 'Ação de resolução' },
  'Resolution target': { es: 'Destino de la resolución', pt: 'Destino da resolução' },
  'Resolution target (hours)': {
    es: 'Meta de resolución (horas)',
    pt: 'Meta de resolução (horas)'
  },
  Rots: { es: 'Se estanca', pt: 'Fica parado' },
  Salutation: { es: 'Tratamiento', pt: 'Saudação' },
  Saturday: { es: 'Sábado', pt: 'Sábado' },
  'Save address': { es: 'Guardar dirección', pt: 'Salvar endereço' },
  'Save field': { es: 'Guardar campo', pt: 'Salvar campo' },
  'Save hours': { es: 'Guardar horario', pt: 'Salvar horário' },
  'Save macro': { es: 'Guardar macro', pt: 'Salvar macro' },
  'Save policy': { es: 'Guardar política', pt: 'Salvar política' },
  'Save rule': { es: 'Guardar regla', pt: 'Salvar regra' },
  'Save stage': { es: 'Guardar etapa', pt: 'Salvar etapa' },
  'Service analytics': { es: 'Analítica del servicio', pt: 'Análise do atendimento' },
  'Sets status': { es: 'Define el estado', pt: 'Define o status' },
  Subject: { es: 'Asunto', pt: 'Assunto' },
  Sunday: { es: 'Domingo', pt: 'Domingo' },
  Team: { es: 'Equipo', pt: 'Equipe' },
  'That form no longer exists.': {
    es: 'Ese formulario ya no existe.',
    pt: 'Esse formulário não existe mais.'
  },
  'That pipeline could not be identified.': {
    es: 'No se pudo identificar ese embudo.',
    pt: 'Não foi possível identificar esse funil.'
  },
  'That stage could not be identified.': {
    es: 'No se pudo identificar esa etapa.',
    pt: 'Não foi possível identificar essa etapa.'
  },
  'That stage could not be moved.': {
    es: 'No se pudo mover esa etapa.',
    pt: 'Não foi possível mover essa etapa.'
  },
  'this field': { es: 'este campo', pt: 'este campo' },
  Thursday: { es: 'Jueves', pt: 'Quinta-feira' },
  'Ticket field': { es: 'Campo de ticket', pt: 'Campo de chamado' },
  tickets: { es: 'tickets', pt: 'chamados' },
  times: { es: 'veces', pt: 'vezes' },
  to: { es: 'a', pt: 'às' },
  Tuesday: { es: 'Martes', pt: 'Terça-feira' },
  'Turn off': { es: 'Apagar', pt: 'Desligar' },
  'Turn on': { es: 'Activar', pt: 'Ativar' },
  Unnamed: { es: 'Sin nombre', pt: 'Sem nome' },
  Unpublish: { es: 'Retirar publicación', pt: 'Despublicar' },
  'Unpublish it': { es: 'Retirar la publicación', pt: 'Despublicar' },
  used: { es: 'usado', pt: 'usado' },
  Wednesday: { es: 'Miércoles', pt: 'Quarta-feira' },
  'Win %': { es: '% de ganancia', pt: '% de ganho' },
  Won: { es: 'Ganado', pt: 'Ganho' },

  // Business hours
  'Business hours': { es: 'Horario laboral', pt: 'Horário comercial' },
  'no day open, so targets run around the clock': {
    es: 'ningún día abierto, así que las metas corren todo el día',
    pt: 'nenhum dia aberto, então as metas correm o tempo todo'
  },
  'Edit hours': { es: 'Editar horario', pt: 'Editar horário' },
  'Edit business hours': { es: 'Editar el horario laboral', pt: 'Editar o horário comercial' },
  Timezone: { es: 'Zona horaria', pt: 'Fuso horário' },
  'IANA timezone name.': {
    es: 'Nombre de zona horaria IANA.',
    pt: 'Nome do fuso horário IANA.'
  },
  'Every day is closed, and the clock still runs': {
    es: 'Todos los días están cerrados, y el reloj sigue corriendo',
    pt: 'Todos os dias estão fechados, e o relógio continua correndo'
  },
  'A four-hour target expires four hours after the ticket arrives, weekend or not. The engine drops a calendar that never opens rather than treating it as permanently shut, so open at least one day to make this calendar count.':
    {
      es: 'Una meta de cuatro horas vence cuatro horas después de que llega el ticket, haya fin de semana o no. El motor descarta un calendario que nunca abre en lugar de tratarlo como cerrado para siempre, así que abre al menos un día para que este calendario cuente.',
      pt: 'Uma meta de quatro horas vence quatro horas depois que o chamado chega, fim de semana ou não. O motor descarta um calendário que nunca abre em vez de tratá-lo como fechado para sempre, então abra pelo menos um dia para este calendário valer.'
    },
  'This is the default calendar, so it applies to every ticket that does not have a more specific one.':
    {
      es: 'Este es el calendario predeterminado, así que aplica a cada ticket que no tenga uno más específico.',
      pt: 'Este é o calendário padrão, então vale para cada chamado que não tiver um mais específico.'
    },
  Christmas: { es: 'Navidad', pt: 'Natal' },
  'That date was already a holiday, called': {
    es: 'Esa fecha ya era un feriado, llamado',
    pt: 'Essa data já era um feriado, chamado'
  },
  'The name you typed was not saved: remove it and add it again to rename it.': {
    es: 'El nombre que escribiste no se guardó: quítalo y agrégalo de nuevo para renombrarlo.',
    pt: 'O nome que você digitou não foi salvo: remova e adicione de novo para renomear.'
  },
  'Deletes it. The day counts as working time again.': {
    es: 'Lo elimina. El día vuelve a contar como tiempo de trabajo.',
    pt: 'Exclui. O dia volta a contar como tempo de trabalho.'
  },
  'No holidays set. Targets will keep running on public holidays.': {
    es: 'No hay feriados. Las metas seguirán corriendo en los días festivos.',
    pt: 'Nenhum feriado definido. As metas continuam correndo nos feriados.'
  },
  'What this changes': { es: 'Qué cambia esto', pt: 'O que isso muda' },
  'With no day open, targets do not count anything out: they run on the wall clock, through evenings, weekends and the holidays below.':
    {
      es: 'Sin ningún día abierto, las metas no descuentan nada: corren por el reloj de pared, de noche, en fines de semana y en los feriados de abajo.',
      pt: 'Sem nenhum dia aberto, as metas não descontam nada: correm pelo relógio de parede, à noite, nos fins de semana e nos feriados abaixo.'
    },
  'Response and resolution targets count only the time inside these hours. A ticket opened at 17:20 on Friday':
    {
      es: 'Las metas de respuesta y de resolución cuentan solo el tiempo dentro de este horario. Un ticket abierto a las 17:20 del viernes',
      pt: 'As metas de resposta e de resolução contam só o tempo dentro deste horário. Um chamado aberto às 17:20 de sexta'
    },
  'starts its clock at': { es: 'empieza a contar a las', pt: 'começa a contar às' },
  'on Monday,': { es: 'el lunes,', pt: 'na segunda,' },
  'starts its clock whenever the week next opens,': {
    es: 'empieza a contar cuando la semana vuelva a abrir,',
    pt: 'começa a contar quando a semana abrir de novo,'
  },
  'so the weekend does not spend a four-hour target.': {
    es: 'así el fin de semana no gasta una meta de cuatro horas.',
    pt: 'assim o fim de semana não gasta uma meta de quatro horas.'
  },
  'is measured on this calendar.': {
    es: 'se mide con este calendario.',
    pt: 'é medida com este calendário.'
  },

  // Custom fields
  'Custom fields': { es: 'Campos personalizados', pt: 'Campos personalizados' },
  'Active fields': { es: 'Campos activos', pt: 'Campos ativos' },
  'Record types extended': { es: 'Tipos de registro ampliados', pt: 'Tipos de registro ampliados' },
  'Required with gaps': { es: 'Obligatorios con huecos', pt: 'Obrigatórios com lacunas' },
  'Records that predate the rule': {
    es: 'Registros anteriores a la regla',
    pt: 'Registros anteriores à regra'
  },
  'Turned off': { es: 'Apagados', pt: 'Desligados' },
  Key: { es: 'Clave', pt: 'Chave' },
  severity: { es: 'gravedad', pt: 'gravidade' },
  'Lowercase letters, numbers and underscores, starting with a letter. No hyphens. Cannot be changed later.':
    {
      es: 'Letras minúsculas, números y guiones bajos, empezando por una letra. Sin guiones. No se puede cambiar después.',
      pt: 'Letras minúsculas, números e sublinhados, começando com uma letra. Sem hífens. Não dá para mudar depois.'
    },
  'Fixed after creation. Every value already stored is filed under this key, and changing it would leave them all behind.':
    {
      es: 'Fijo después de crearlo. Cada valor ya guardado está archivado bajo esta clave, y cambiarla los dejaría atrás.',
      pt: 'Fixo depois de criar. Cada valor já salvo está arquivado sob esta chave, e mudá-la deixaria todos para trás.'
    },
  'On record type': { es: 'En el tipo de registro', pt: 'No tipo de registro' },
  'Fixed after creation.': { es: 'Fijo después de crearlo.', pt: 'Fixo depois de criar.' },
  'Fixed after creation. Values already stored were written and checked against this type.': {
    es: 'Fijo después de crearlo. Los valores ya guardados se escribieron y se validaron con este tipo.',
    pt: 'Fixo depois de criar. Os valores já salvos foram escritos e conferidos com este tipo.'
  },
  Choices: { es: 'Opciones', pt: 'Opções' },
  'Renaming a choice keeps the values already stored against it. Removing one leaves the records that hold it showing a value the list no longer offers.':
    {
      es: 'Renombrar una opción conserva los valores ya guardados. Quitar una deja los registros que la tienen mostrando un valor que la lista ya no ofrece.',
      pt: 'Renomear uma opção mantém os valores já salvos. Remover uma deixa os registros que a têm mostrando um valor que a lista não oferece mais.'
    },
  Filterable: { es: 'Filtrable', pt: 'Filtrável' },
  'Binds new writes only. Records saved before this keep their gap.': {
    es: 'Solo obliga las escrituras nuevas. Los registros guardados antes conservan el hueco.',
    pt: 'Só obriga gravações novas. Registros salvos antes disso mantêm a lacuna.'
  },
  'Can be used to narrow a list, not just read on the record.': {
    es: 'Se puede usar para acotar una lista, no solo para leerlo en el registro.',
    pt: 'Pode ser usado para filtrar uma lista, não só para ler no registro.'
  },
  'Required does not mean every record has one': {
    es: 'Obligatorio no significa que cada registro tenga uno',
    pt: 'Obrigatório não significa que cada registro tenha um'
  },
  '{label} is missing on {n} {records}': {
    es: 'A {label} le falta valor en {n} {records}',
    pt: '{label} está sem valor em {n} {records}'
  },
  'Marking a field required binds new writes only, nothing goes back and fills in what was saved before.':
    {
      es: 'Marcar un campo como obligatorio solo obliga las escrituras nuevas; nada vuelve atrás a completar lo que se guardó antes.',
      pt: 'Marcar um campo como obrigatório só obriga gravações novas; nada volta atrás para preencher o que foi salvo antes.'
    },
  'without a value': { es: 'sin valor', pt: 'sem valor' },
  'Stops being collected. Stored values stay.': {
    es: 'Deja de recogerse. Los valores guardados se quedan.',
    pt: 'Para de ser coletado. Os valores salvos ficam.'
  },
  'A field marked with the filter icon can be used to narrow a list; the rest are readable only on the record itself. Turning a field off stops it being collected and hides it, and leaves the values already stored on each record untouched.':
    {
      es: 'Un campo marcado con el icono de filtro se puede usar para acotar una lista; el resto solo se lee en el registro. Apagar un campo deja de recogerlo y lo oculta, y no toca los valores ya guardados en cada registro.',
      pt: 'Um campo marcado com o ícone de filtro pode ser usado para filtrar uma lista; o resto só se lê no registro. Desligar um campo para de coletá-lo e o oculta, e não mexe nos valores já salvos em cada registro.'
    },
  'Only an admin can add custom fields.': {
    es: 'Solo un administrador puede añadir campos personalizados.',
    pt: 'Só um administrador pode adicionar campos personalizados.'
  },
  'Could not add the field.': {
    es: 'No se pudo añadir el campo.',
    pt: 'Não foi possível adicionar o campo.'
  },
  'Only an admin can change custom fields.': {
    es: 'Solo un administrador puede cambiar campos personalizados.',
    pt: 'Só um administrador pode alterar campos personalizados.'
  },
  'Could not save the field.': {
    es: 'No se pudo guardar el campo.',
    pt: 'Não foi possível salvar o campo.'
  },
  'Only an admin can turn custom fields off.': {
    es: 'Solo un administrador puede apagar campos personalizados.',
    pt: 'Só um administrador pode desligar campos personalizados.'
  },
  'Could not turn the field off.': {
    es: 'No se pudo apagar el campo.',
    pt: 'Não foi possível desligar o campo.'
  },
  'Only an admin can turn custom fields on.': {
    es: 'Solo un administrador puede activar campos personalizados.',
    pt: 'Só um administrador pode ativar campos personalizados.'
  },
  'Could not turn the field on.': {
    es: 'No se pudo activar el campo.',
    pt: 'Não foi possível ativar o campo.'
  },

  // Deal pipelines
  'Deal pipelines': { es: 'Embudos de negocios', pt: 'Funis de negócios' },
  'Starts with six stages (four open, then Closed Won and Closed Lost) that you can rename, reorder or delete.':
    {
      es: 'Empieza con seis etapas (cuatro abiertas, luego Cerrado ganado y Cerrado perdido) que puedes renombrar, reordenar o eliminar.',
      pt: 'Começa com seis etapas (quatro abertas, depois Fechado ganho e Fechado perdido) que você pode renomear, reordenar ou excluir.'
    },
  Pipelines: { es: 'Embudos', pt: 'Funis' },
  'Closed, does not age': { es: 'Cerrada, no envejece', pt: 'Fechada, não envelhece' },
  'After {days}d, warns at {warn}d': {
    es: 'Después de {days} d, avisa a los {warn} d',
    pt: 'Depois de {days} d, avisa em {warn} d'
  },
  'After {days}d': { es: 'Después de {days} d', pt: 'Depois de {days} d' },
  stages: { es: 'etapas', pt: 'etapas' },
  'It leaves the board and the deal forms. Refused while any deal is still in it.': {
    es: 'Sale del tablero y de los formularios de negocio. Se rechaza mientras quede algún negocio en él.',
    pt: 'Sai do quadro e dos formulários de negócio. É recusado enquanto houver algum negócio nele.'
  },
  'The default pipeline is where a deal lands when nothing names another one, so it cannot be deleted.':
    {
      es: 'El embudo predeterminado es donde cae un negocio cuando nada nombra otro, así que no se puede eliminar.',
      pt: 'O funil padrão é onde um negócio cai quando nada indica outro, então não pode ser excluído.'
    },
  'Won and lost close a deal. Reports and goals count by kind, not by name.': {
    es: 'Ganado y perdido cierran un negocio. Los informes y los objetivos cuentan por tipo, no por nombre.',
    pt: 'Ganho e perdido fecham um negócio. Relatórios e metas contam pelo tipo, não pelo nome.'
  },
  'Rotting after (days)': { es: 'Se estanca después de (días)', pt: 'Fica parado depois de (dias)' },
  'A deal past this many days in the stage reads Past expected, and Stalled at one and a half times it. Blank: it never rots here.':
    {
      es: 'Un negocio que supera estos días en la etapa se lee como Fuera de plazo, y como Estancado al llegar a una vez y media. En blanco: aquí nunca se estanca.',
      pt: 'Um negócio que passa desses dias na etapa aparece como Além do esperado, e como Parado ao chegar a uma vez e meia. Em branco: aqui ele nunca fica parado.'
    },
  'Warn after (days)': { es: 'Avisar después de (días)', pt: 'Avisar depois de (dias)' },
  'Optional. An earlier Past expected, before the rotting day.': {
    es: 'Opcional. Un Fuera de plazo más temprano, antes del día en que se estanca.',
    pt: 'Opcional. Um Além do esperado mais cedo, antes do dia em que fica parado.'
  },
  'Stages, in board order': { es: 'Etapas, en el orden del tablero', pt: 'Etapas, na ordem do quadro' },
  'The column leaves the board. Refused while deals are in it, and for the pipeline\'s last open, won or lost stage.':
    {
      es: 'La columna sale del tablero. Se rechaza mientras haya negocios en ella, y para la última etapa abierta, ganada o perdida del embudo.',
      pt: 'A coluna sai do quadro. É recusado enquanto houver negócios nela, e para a última etapa aberta, ganha ou perdida do funil.'
    },
  'Only an admin can change deal pipelines.': {
    es: 'Solo un administrador puede cambiar los embudos de negocios.',
    pt: 'Só um administrador pode alterar os funis de negócios.'
  },
  'Pick open, won or lost.': {
    es: 'Elige abierto, ganado o perdido.',
    pt: 'Escolha aberto, ganho ou perdido.'
  },
  'Days are a whole number from 1 to 3650, or blank.': {
    es: 'Los días son un número entero del 1 al 3650, o se dejan en blanco.',
    pt: 'Os dias são um número inteiro de 1 a 3650, ou em branco.'
  },
  'Could not create the pipeline.': {
    es: 'No se pudo crear el embudo.',
    pt: 'Não foi possível criar o funil.'
  },
  'Could not rename the pipeline.': {
    es: 'No se pudo renombrar el embudo.',
    pt: 'Não foi possível renomear o funil.'
  },
  'Could not delete the pipeline.': {
    es: 'No se pudo eliminar el embudo.',
    pt: 'Não foi possível excluir o funil.'
  },
  'Could not add the stage.': {
    es: 'No se pudo añadir la etapa.',
    pt: 'Não foi possível adicionar a etapa.'
  },
  'Could not save the stage.': {
    es: 'No se pudo guardar la etapa.',
    pt: 'Não foi possível salvar a etapa.'
  },
  'Could not delete the stage.': {
    es: 'No se pudo eliminar la etapa.',
    pt: 'Não foi possível excluir a etapa.'
  },
  'Could not reorder the stages.': {
    es: 'No se pudieron reordenar las etapas.',
    pt: 'Não foi possível reordenar as etapas.'
  },

  // Lead pipelines
  'Lead pipelines': { es: 'Embudos de prospectos', pt: 'Funis de leads' },
  'Starts with six stages (New, Contacted, Qualified, Proposal, Won, Lost) that you can rename, reorder or delete.':
    {
      es: 'Empieza con seis etapas (Nuevo, Contactado, Calificado, Propuesta, Ganado, Perdido) que puedes renombrar, reordenar o eliminar.',
      pt: 'Começa com seis etapas (Novo, Contatado, Qualificado, Proposta, Ganho, Perdido) que você pode renomear, reordenar ou excluir.'
    },
  'No lead pipelines yet': { es: 'Todavía no hay embudos de prospectos', pt: 'Ainda não há funis de leads' },
  'A pipeline gives the lead board its columns. Create one to start moving leads through stages.': {
    es: 'Un embudo le da las columnas al tablero de prospectos. Crea uno para empezar a mover prospectos por las etapas.',
    pt: 'Um funil dá as colunas ao quadro de leads. Crie um para começar a mover leads pelas etapas.'
  },
  'A pipeline gives the lead board its columns. An admin can create one here.': {
    es: 'Un embudo le da las columnas al tablero de prospectos. Un administrador puede crear uno aquí.',
    pt: 'Um funil dá as colunas ao quadro de leads. Um administrador pode criar um aqui.'
  },
  'in them': { es: 'en ellas', pt: 'nelas' },
  'It leaves the board and this list. Refused while a lead on the board is still in one of its stages.':
    {
      es: 'Sale del tablero y de esta lista. Se rechaza mientras un prospecto del tablero siga en una de sus etapas.',
      pt: 'Sai do quadro e desta lista. É recusado enquanto um lead do quadro ainda estiver em uma das etapas.'
    },
  'Sets lead status to': { es: 'Pone el estado del prospecto en', pt: 'Define o status do lead como' },
  'Leave it as it is': { es: 'Déjalo como está', pt: 'Deixe como está' },
  'Applied when a lead is moved into this stage.': {
    es: 'Se aplica cuando un prospecto se mueve a esta etapa.',
    pt: 'É aplicado quando um lead é movido para esta etapa.'
  },
  'Win probability (%)': { es: 'Probabilidad de ganar (%)', pt: 'Probabilidade de ganho (%)' },
  'Given to a lead moved here that has no probability yet.': {
    es: 'Se asigna a un prospecto movido aquí que todavía no tiene probabilidad.',
    pt: 'É dada a um lead movido para cá que ainda não tem probabilidade.'
  },
  'Refused while leads are in it. Move them to another stage first.': {
    es: 'Se rechaza mientras haya prospectos en ella. Muévelos a otra etapa primero.',
    pt: 'É recusado enquanto houver leads nela. Mova-os para outra etapa primeiro.'
  },
  'The column leaves the board.': {
    es: 'La columna sale del tablero.',
    pt: 'A coluna sai do quadro.'
  },
  'No stages yet, so the board has nowhere to put a lead.': {
    es: 'Todavía no hay etapas, así que el tablero no tiene dónde poner un prospecto.',
    pt: 'Ainda não há etapas, então o quadro não tem onde colocar um lead.'
  },
  'Lead counts are the leads you can see. A converted lead never blocks deleting a stage; it just loses the stage.':
    {
      es: 'Los conteos son los prospectos que puedes ver. Un prospecto convertido nunca impide eliminar una etapa; solo pierde la etapa.',
      pt: 'As contagens são os leads que você pode ver. Um lead convertido nunca impede excluir uma etapa; ele só perde a etapa.'
    },
  'Only an admin can change lead pipelines.': {
    es: 'Solo un administrador puede cambiar los embudos de prospectos.',
    pt: 'Só um administrador pode alterar os funis de leads.'
  },

  // Escalation
  Escalation: { es: 'Escalamiento', pt: 'Escalonamento' },
  'One policy per priority · all four are configured': {
    es: 'Una política por prioridad · las cuatro están configuradas',
    pt: 'Uma política por prioridade · as quatro estão configuradas'
  },
  'One policy per priority ·': {
    es: 'Una política por prioridad ·',
    pt: 'Uma política por prioridade ·'
  },
  configured: { es: 'configuradas', pt: 'configuradas' },
  'Fixed after creation. One policy per priority.': {
    es: 'Fija después de crearla. Una política por prioridad.',
    pt: 'Fixa depois de criar. Uma política por prioridade.'
  },
  'How long a ticket at this priority may wait for its first reply, counted in business hours. Leave blank to use the built-in {n}.':
    {
      es: 'Cuánto puede esperar un ticket de esta prioridad por su primera respuesta, contado en horas laborales. Déjalo en blanco para usar el valor integrado {n}.',
      pt: 'Quanto um chamado desta prioridade pode esperar pela primeira resposta, contado em horas úteis. Deixe em branco para usar o valor interno {n}.'
    },
  'How long a customer who writes back after the first reply may wait for the next one, counted around the clock. Leave blank to use the built-in {n}. Service analytics scores replies against it; missing it escalates nothing.':
    {
      es: 'Cuánto puede esperar un cliente que escribe de nuevo, después de la primera respuesta, por la siguiente, contado las 24 horas. Déjalo en blanco para usar el valor integrado {n}. La analítica del servicio puntúa las respuestas contra eso; no cumplirlo no escala nada.',
      pt: 'Quanto um cliente que escreve de novo, depois da primeira resposta, pode esperar pela seguinte, contado o tempo todo. Deixe em branco para usar o valor interno {n}. A análise do atendimento pontua as respostas contra isso; perder essa meta não escala nada.'
    },
  'Applies to tickets opened from now on, and to any ticket moved to this priority. Tickets already open keep the target they were given.':
    {
      es: 'Aplica a los tickets abiertos de ahora en adelante y a cualquier ticket que se mueva a esta prioridad. Los tickets que ya están abiertos conservan la meta que se les dio.',
      pt: 'Vale para chamados abertos daqui em diante e para qualquer chamado movido para esta prioridade. Chamados que já estão abertos mantêm a meta que receberam.'
    },
  'This target\'s account is no longer active. It stays set until you change it, and a breach sent there waits for someone who cannot sign in.':
    {
      es: 'La cuenta de este destino ya no está activa. Sigue asignada hasta que la cambies, y un incumplimiento enviado allí espera a alguien que no puede entrar.',
      pt: 'A conta deste destino não está mais ativa. Continua definida até você mudar, e um estouro enviado para lá espera alguém que não consegue entrar.'
    },
  'Nothing happens on this half until a target is picked. A team on its own is not notified.': {
    es: 'No pasa nada en esta mitad hasta que elijas un destino. Un equipo solo no recibe aviso.',
    pt: 'Nada acontece nesta metade até você escolher um destino. Uma equipe sozinha não é avisada.'
  },
  'Reassigns the ticket. No email is sent, to them or to the team.': {
    es: 'Reasigna el ticket. No se envía correo, ni a esa persona ni al equipo.',
    pt: 'Reatribui o chamado. Nenhum e-mail é enviado, nem para essa pessoa nem para a equipe.'
  },
  'Notify team': { es: 'Avisar al equipo', pt: 'Avisar a equipe' },
  'The people and teams list did not load.': {
    es: 'No se cargó la lista de personas y equipos.',
    pt: 'A lista de pessoas e equipes não carregou.'
  },
  'Reload the page to pick targets or a team.': {
    es: 'Recarga la página para elegir destinos o un equipo.',
    pt: 'Recarregue a página para escolher destinos ou uma equipe.'
  },
  'Saving keeps the current targets and team; reload the page to change them.': {
    es: 'Guardar conserva los destinos y el equipo actuales; recarga la página para cambiarlos.',
    pt: 'Salvar mantém os destinos e a equipe atuais; recarregue a página para mudá-los.'
  },
  'Starts escalating breaches at this priority as soon as it is saved.': {
    es: 'Empieza a escalar los incumplimientos de esta prioridad en cuanto se guarda.',
    pt: 'Começa a escalar os estouros desta prioridade assim que for salva.'
  },
  'No escalation policies yet': {
    es: 'Todavía no hay políticas de escalamiento',
    pt: 'Ainda não há políticas de escalonamento'
  },
  'An escalation policy decides what happens when a ticket misses its first-response or resolution target. One per priority. None are set for this organisation, so a breach currently escalates to nobody.':
    {
      es: 'Una política de escalamiento decide qué pasa cuando un ticket no cumple su meta de primera respuesta o de resolución. Una por prioridad. No hay ninguna para esta organización, así que un incumplimiento hoy no escala a nadie.',
      pt: 'Uma política de escalonamento decide o que acontece quando um chamado perde a meta de primeira resposta ou de resolução. Uma por prioridade. Nenhuma está definida para esta organização, então um estouro hoje não escala para ninguém.'
    },
  '{n} breaches in the last 30 days told nobody': {
    es: '{n} incumplimientos en los últimos 30 días no avisaron a nadie',
    pt: '{n} estouros nos últimos 30 dias não avisaram ninguém'
  },
  'Some halves of these policies resolve to no recipient.': {
    es: 'Algunas mitades de estas políticas no tienen destinatario.',
    pt: 'Algumas metades destas políticas não têm destinatário.'
  },
  '{dead} of {total} policies do nothing at all when a ticket breaches.': {
    es: '{dead} de {total} políticas no hacen nada cuando un ticket incumple.',
    pt: '{dead} de {total} políticas não fazem nada quando um chamado estoura.'
  },
  'A policy that exists is not the same as a policy that fires.': {
    es: 'Que exista una política no es lo mismo que una política que se dispare.',
    pt: 'Uma política que existe não é o mesmo que uma política que dispara.'
  },
  'Stops escalating breaches at this priority. It stays in the list, off, until turned back on.': {
    es: 'Deja de escalar los incumplimientos de esta prioridad. Se queda en la lista, apagada, hasta que la vuelvas a activar.',
    pt: 'Para de escalar os estouros desta prioridade. Fica na lista, desligada, até você ativar de novo.'
  },
  'Deleted permanently. Breaches at this priority will escalate to nobody.': {
    es: 'Eliminada para siempre. Los incumplimientos de esta prioridad no van a escalar a nadie.',
    pt: 'Excluída para sempre. Os estouros desta prioridade não vão escalar para ninguém.'
  },
  'Missed first response': { es: 'Primera respuesta incumplida', pt: 'Primeira resposta perdida' },
  'Missed resolution': { es: 'Resolución incumplida', pt: 'Resolução perdida' },
  '{hours} reply': { es: '{hours} de respuesta', pt: '{hours} de resposta' },
  '{hours} next reply': { es: '{hours} de siguiente respuesta', pt: '{hours} da próxima resposta' },
  '{hours} resolve': { es: '{hours} de resolución', pt: '{hours} de resolução' },
  '{priorities} have no policy, so breaches at those priorities escalate to nobody and are not counted above.':
    {
      es: '{priorities} no tienen política, así que los incumplimientos de esas prioridades no escalan a nadie y no se cuentan arriba.',
      pt: '{priorities} não têm política, então os estouros dessas prioridades não escalam para ninguém e não são contados acima.'
    },
  '{priority} has no policy, so breaches at that priority escalate to nobody and are not counted above.':
    {
      es: '{priority} no tiene política, así que los incumplimientos de esa prioridad no escalan a nadie y no se cuentan arriba.',
      pt: '{priority} não tem política, então os estouros dessa prioridade não escalam para ninguém e não são contados acima.'
    },
  'First response and resolution targets are measured on': {
    es: 'Las metas de primera respuesta y de resolución se miden en',
    pt: 'As metas de primeira resposta e de resolução são medidas no'
  },
  'business hours': { es: 'horario laboral', pt: 'horário comercial' },
  ', so a breach counts working time only, and time spent waiting on the customer does not count at all. Editing a policy sets both the target and who hears about a breach. The next reply target escalates nothing: it is counted around the clock and reported on':
    {
      es: ', así que un incumplimiento cuenta solo el tiempo de trabajo, y el tiempo esperando al cliente no cuenta. Editar una política define la meta y quién se entera de un incumplimiento. La meta de la siguiente respuesta no escala nada: se cuenta las 24 horas y se informa en',
      pt: ', então um estouro conta só o tempo de trabalho, e o tempo esperando o cliente não conta. Editar uma política define a meta e quem fica sabendo de um estouro. A meta da próxima resposta não escala nada: é contada o tempo todo e aparece em'
    },
  'Only an admin can change escalation policies.': {
    es: 'Solo un administrador puede cambiar las políticas de escalamiento.',
    pt: 'Só um administrador pode alterar as políticas de escalonamento.'
  },
  'Could not add the policy.': {
    es: 'No se pudo añadir la política.',
    pt: 'Não foi possível adicionar a política.'
  },
  'Could not save the policy.': {
    es: 'No se pudo guardar la política.',
    pt: 'Não foi possível salvar a política.'
  },
  'Could not turn the policy off.': {
    es: 'No se pudo apagar la política.',
    pt: 'Não foi possível desligar a política.'
  },
  'Could not turn the policy on.': {
    es: 'No se pudo activar la política.',
    pt: 'Não foi possível ativar a política.'
  },
  'Could not delete the policy.': {
    es: 'No se pudo eliminar la política.',
    pt: 'Não foi possível excluir a política.'
  },

  // Inbound email
  'Inbound email': { es: 'Correo entrante', pt: 'E-mail de entrada' },
  'addresses creating tickets ·': {
    es: 'direcciones creando tickets ·',
    pt: 'endereços criando chamados ·'
  },
  'Mail to the old address stops becoming tickets.': {
    es: 'El correo a la dirección anterior deja de volverse tickets.',
    pt: 'O e-mail para o endereço antigo deixa de virar chamados.'
  },
  Provider: { es: 'Proveedor', pt: 'Provedor' },
  'Only AWS SES is implemented. The other three are stored and accepted, and mail sent to an address using one becomes nothing until that integration exists.':
    {
      es: 'Solo AWS SES está implementado. Los otros tres se guardan y se aceptan, y el correo enviado a una dirección que use uno no se convierte en nada hasta que exista esa integración.',
      pt: 'Só o AWS SES está implementado. Os outros três são salvos e aceitos, e o e-mail enviado a um endereço que use um não vira nada até essa integração existir.'
    },
  'SNS Topic ARN': { es: 'ARN del tema SNS', pt: 'ARN do tópico SNS' },
  'Mail is accepted only from this exact topic. Left blank, it is set by the first subscription AWS confirms from an AWS account this server allows. Clearing it stops mail until it is set again.':
    {
      es: 'El correo solo se acepta de este tema exacto. Si lo dejas en blanco, lo define la primera suscripción que AWS confirme desde una cuenta de AWS que este servidor permite. Borrarlo detiene el correo hasta que se vuelva a definir.',
      pt: 'O e-mail só é aceito deste tópico exato. Se ficar em branco, é definido pela primeira assinatura que a AWS confirmar de uma conta AWS que este servidor permite. Limpar interrompe o e-mail até ser definido de novo.'
    },
  'Opens as priority': { es: 'Se abre con prioridad', pt: 'Abre com prioridade' },
  'Opens as type': { es: 'Se abre con tipo', pt: 'Abre com tipo' },
  'Default assignee': { es: 'Asignado predeterminado', pt: 'Responsável padrão' },
  'Deactivated users are not assigned. New tickets from this address go to routing until you choose someone else.':
    {
      es: 'Los usuarios desactivados no se asignan. Los tickets nuevos de esta dirección pasan al enrutamiento hasta que elijas a alguien más.',
      pt: 'Usuários desativados não são atribuídos. Chamados novos deste endereço vão para o roteamento até você escolher outra pessoa.'
    },
  'Starts creating tickets from mail to this address as soon as it is saved.': {
    es: 'Empieza a crear tickets con el correo a esta dirección en cuanto se guarda.',
    pt: 'Começa a criar chamados com o e-mail para este endereço assim que for salvo.'
  },
  'is switched on and creates nothing': {
    es: 'está encendida y no crea nada',
    pt: 'está ligada e não cria nada'
  },
  'are switched on and create nothing': {
    es: 'están encendidas y no crean nada',
    pt: 'estão ligadas e não criam nada'
  },
  'Mail keeps arriving and nothing bounces, so anyone writing there gets no ticket and no error, just silence. Each address says below what is stopping it.':
    {
      es: 'El correo sigue llegando y nada rebota, así que quien escribe allí no recibe ticket ni error, solo silencio. Cada dirección dice abajo qué la detiene.',
      pt: 'O e-mail continua chegando e nada volta, então quem escreve ali não recebe chamado nem erro, só silêncio. Cada endereço diz abaixo o que o está impedindo.'
    },
  Addresses: { es: 'Direcciones', pt: 'Endereços' },
  'tickets in 30 days · last mail': {
    es: 'tickets en 30 días · último correo',
    pt: 'chamados em 30 dias · último e-mail'
  },
  'no tickets in 30 days · last mail': {
    es: 'sin tickets en 30 días · último correo',
    pt: 'sem chamados em 30 dias · último e-mail'
  },
  'Opens as': { es: 'Se abre como', pt: 'Abre como' },
  'assigned to {name}': { es: 'asignado a {name}', pt: 'atribuído a {name}' },
  'then routed': { es: 'después se enruta', pt: 'depois é roteado' },
  'Stops opening tickets from this address. It stays in the list, off, until turned back on.': {
    es: 'Deja de abrir tickets desde esta dirección. Se queda en la lista, apagada, hasta que la vuelvas a activar.',
    pt: 'Para de abrir chamados deste endereço. Fica na lista, desligada, até você ativar de novo.'
  },
  'Deleted permanently. Mail to this address stops becoming tickets, and its topic pin goes with it.':
    {
      es: 'Eliminada para siempre. El correo a esta dirección deja de volverse tickets, y el pin del tema se va con ella.',
      pt: 'Excluída para sempre. O e-mail para este endereço deixa de virar chamados, e o pin do tópico vai junto.'
    },
  'How a delivery is proved genuine': {
    es: 'Cómo se prueba que una entrega es auténtica',
    pt: 'Como uma entrega se prova genuína'
  },
  'Two checks, and mail has to clear both: AWS signs each notification, and the address has to be pinned to the exact SNS topic it was subscribed to. The signature alone proves only that some AWS account sent it, so without the pin anyone who learned an address\'s id could have AWS sign forged mail into this organisation. An admin can enter the pin as the address\'s Topic ARN. Left blank, it is set by the first subscription AWS confirms from an AWS account this server allows; a subscription from any other account is refused. Only admins can see the ARN, because it carries the AWS account id.':
    {
      es: 'Dos controles, y el correo tiene que pasar ambos: AWS firma cada notificación, y la dirección tiene que quedar fijada al tema SNS exacto al que se suscribió. La firma sola solo prueba que alguna cuenta de AWS lo envió, así que sin el pin cualquiera que sepa el id de una dirección podría hacer que AWS firme correo falso hacia esta organización. Un administrador puede escribir el pin como el Topic ARN de la dirección. Si se deja en blanco, lo define la primera suscripción que AWS confirme desde una cuenta de AWS que este servidor permite; una suscripción de cualquier otra cuenta se rechaza. Solo los administradores pueden ver el ARN, porque lleva el id de la cuenta de AWS.',
      pt: 'Duas checagens, e o e-mail tem que passar nas duas: a AWS assina cada notificação, e o endereço tem que ficar preso ao tópico SNS exato em que foi inscrito. A assinatura sozinha só prova que alguma conta AWS enviou, então sem o pin qualquer pessoa que soubesse o id de um endereço poderia fazer a AWS assinar e-mail falso para esta organização. Um administrador pode informar o pin como o Topic ARN do endereço. Se ficar em branco, é definido pela primeira assinatura que a AWS confirmar de uma conta AWS que este servidor permite; uma assinatura de qualquer outra conta é recusada. Só administradores veem o ARN, porque ele traz o id da conta AWS.'
    },
  'There is also a signing-secret field on each address, reserved for providers that sign deliveries that way. None of those are implemented, so nothing compares it today. It can be set through the API and is never readable back, here or anywhere.':
    {
      es: 'También hay un campo de secreto de firma en cada dirección, reservado para proveedores que firman las entregas así. Ninguno de esos está implementado, así que hoy nada lo compara. Se puede definir por la API y nunca se puede volver a leer, ni aquí ni en ningún lado.',
      pt: 'Também há um campo de segredo de assinatura em cada endereço, reservado para provedores que assinam as entregas assim. Nenhum deles está implementado, então hoje nada compara esse valor. Dá para definir pela API e ele nunca pode ser lido de volta, nem aqui nem em lugar nenhum.'
    },
  'Where a new ticket goes after it is created is decided by': {
    es: 'A dónde va un ticket nuevo después de crearse lo decide',
    pt: 'Para onde um chamado novo vai depois de criado é decidido por'
  },
  'ticket routing': { es: 'enrutamiento de tickets', pt: 'roteamento de chamados' },
  ', not by these defaults.': { es: ', no por estos valores predeterminados.', pt: ', não por estes padrões.' },
  'Only an admin can change inbound mailboxes.': {
    es: 'Solo un administrador puede cambiar los buzones de entrada.',
    pt: 'Só um administrador pode alterar as caixas de entrada.'
  },
  'Could not add the address.': {
    es: 'No se pudo añadir la dirección.',
    pt: 'Não foi possível adicionar o endereço.'
  },
  'Could not save the address.': {
    es: 'No se pudo guardar la dirección.',
    pt: 'Não foi possível salvar o endereço.'
  },
  'Could not turn the address off.': {
    es: 'No se pudo apagar la dirección.',
    pt: 'Não foi possível desligar o endereço.'
  },
  'Could not turn the address on.': {
    es: 'No se pudo activar la dirección.',
    pt: 'Não foi possível ativar o endereço.'
  },
  'Could not delete the address.': {
    es: 'No se pudo eliminar la dirección.',
    pt: 'Não foi possível excluir o endereço.'
  },

  // Macros
  Macros: { es: 'Macros', pt: 'Macros' },
  'shared ·': { es: 'compartidos ·', pt: 'compartilhados ·' },
  yours: { es: 'tuyos', pt: 'seus' },
  'Shared with everyone': { es: 'Compartidos con todos', pt: 'Compartilhados com todos' },
  'Only yours': { es: 'Solo tuyos', pt: 'Só seus' },
  'Broken placeholders': { es: 'Marcadores rotos', pt: 'Marcadores quebrados' },
  'Sent to customers as typed': {
    es: 'Se envían al cliente tal como se escribieron',
    pt: 'São enviados ao cliente como foram digitados'
  },
  'Who sees it': { es: 'Quién lo ve', pt: 'Quem vê' },
  'Just me': { es: 'Solo yo', pt: 'Só eu' },
  'Everyone in the org': { es: 'Todos en la organización', pt: 'Todos na organização' },
  'Only an admin can share a macro with everyone.': {
    es: 'Solo un administrador puede compartir un macro con todos.',
    pt: 'Só um administrador pode compartilhar um macro com todos.'
  },
  Body: { es: 'Cuerpo', pt: 'Corpo' },
  'Placeholders like %customer_name% are substituted when the macro is sent. The seven supported tokens are listed to the right; anything else goes to the customer exactly as typed. Leave it empty for a macro that only changes the ticket.':
    {
      es: 'Los marcadores como %customer_name% se sustituyen cuando se envía el macro. Los siete tokens admitidos están a la derecha; cualquier otro le llega al cliente tal como se escribió. Déjalo vacío si el macro solo cambia el ticket.',
      pt: 'Marcadores como %customer_name% são substituídos quando o macro é enviado. Os sete tokens aceitos estão à direita; qualquer outro chega ao cliente exatamente como foi digitado. Deixe vazio se o macro só muda o chamado.'
    },
  'Set status': { es: 'Definir estado', pt: 'Definir status' },
  'Set priority': { es: 'Definir prioridad', pt: 'Definir prioridade' },
  'Assign to': { es: 'Asignar a', pt: 'Atribuir a' },
  'Replaces whoever the ticket is assigned to.': {
    es: 'Reemplaza a quien tenga asignado el ticket.',
    pt: 'Substitui quem está atribuído ao chamado.'
  },
  'Add tags': { es: 'Añadir etiquetas', pt: 'Adicionar etiquetas' },
  'Added to the ticket\'s own tags.': {
    es: 'Se añaden a las etiquetas del ticket.',
    pt: 'São adicionadas às etiquetas do chamado.'
  },
  'Personal macros are visible only to you. Nobody else in the organisation, admins included, sees this list.':
    {
      es: 'Los macros personales solo los ves tú. Nadie más en la organización, ni los administradores, ve esta lista.',
      pt: 'Macros pessoais só você vê. Ninguém mais na organização, nem os administradores, vê esta lista.'
    },
  'Placeholders that work': { es: 'Marcadores que funcionan', pt: 'Marcadores que funcionam' },
  'These seven are the whole set. Anything else between percent signs is left exactly as written and goes out that way. The server does not guess, on purpose, so a typo is visible in the composer rather than a blank in the customer\'s inbox.':
    {
      es: 'Estos siete son todo el conjunto. Cualquier otra cosa entre signos de porcentaje se deja tal cual y sale así. El servidor no adivina, a propósito, para que un error de tipeo se vea en el redactor y no como un blanco en la bandeja del cliente.',
      pt: 'Estes sete são o conjunto inteiro. Qualquer outra coisa entre sinais de porcentagem fica exatamente como foi escrita e sai assim. O servidor não adivinha, de propósito, para um erro de digitação aparecer no editor e não como um vazio na caixa do cliente.'
    },
  'Broken placeholder': { es: 'Marcador roto', pt: 'Marcador quebrado' },
  '{tokens} is not a placeholder, it goes to the customer exactly as written.': {
    es: '{tokens} no es un marcador, y le llega al cliente exactamente como está escrito.',
    pt: '{tokens} não é um marcador, e chega ao cliente exatamente como está escrito.'
  },
  '{tokens} are not placeholders, they go to the customer exactly as written.': {
    es: '{tokens} no son marcadores, y le llegan al cliente exactamente como están escritos.',
    pt: '{tokens} não são marcadores, e chegam ao cliente exatamente como estão escritos.'
  },
  'This macro has been sent': { es: 'Este macro se ha enviado', pt: 'Este macro foi enviado' },
  'On send:': { es: 'Al enviar:', pt: 'Ao enviar:' },
  'Turns it off for everyone. It stops appearing in the picker.': {
    es: 'Lo apaga para todos. Deja de aparecer en el selector.',
    pt: 'Desliga para todos. Ele para de aparecer no seletor.'
  },
  'Deletes it permanently.': { es: 'Lo elimina para siempre.', pt: 'Exclui para sempre.' },
  'Only an admin can create a macro shared with everyone.': {
    es: 'Solo un administrador puede crear un macro compartido con todos.',
    pt: 'Só um administrador pode criar um macro compartilhado com todos.'
  },
  'Could not add the macro.': {
    es: 'No se pudo añadir el macro.',
    pt: 'Não foi possível adicionar o macro.'
  },
  'Only an admin can change a macro shared with everyone.': {
    es: 'Solo un administrador puede cambiar un macro compartido con todos.',
    pt: 'Só um administrador pode alterar um macro compartilhado com todos.'
  },
  'That macro is not yours to change.': {
    es: 'Ese macro no es tuyo para cambiarlo.',
    pt: 'Esse macro não é seu para alterar.'
  },
  'Could not save the macro.': {
    es: 'No se pudo guardar el macro.',
    pt: 'Não foi possível salvar o macro.'
  },
  'Only an admin can remove a macro shared with everyone.': {
    es: 'Solo un administrador puede quitar un macro compartido con todos.',
    pt: 'Só um administrador pode remover um macro compartilhado com todos.'
  },
  'That macro is not yours to remove.': {
    es: 'Ese macro no es tuyo para quitarlo.',
    pt: 'Esse macro não é seu para remover.'
  },
  'Could not remove the macro.': {
    es: 'No se pudo quitar el macro.',
    pt: 'Não foi possível remover o macro.'
  },
  'Only an admin can turn on a macro shared with everyone.': {
    es: 'Solo un administrador puede activar un macro compartido con todos.',
    pt: 'Só um administrador pode ativar um macro compartilhado com todos.'
  },
  'That macro is not yours to turn on.': {
    es: 'Ese macro no es tuyo para activarlo.',
    pt: 'Esse macro não é seu para ativar.'
  },
  'Could not turn the macro on.': {
    es: 'No se pudo activar el macro.',
    pt: 'Não foi possível ativar o macro.'
  },

  // Organization edit
  'Editing organization details is limited to admins. Ask an admin on your team if a company detail, currency, or survey setting needs changing.':
    {
      es: 'Editar los datos de la organización está limitado a los administradores. Pídele a un administrador de tu equipo si hay que cambiar un dato de la empresa, la moneda o las encuestas.',
      pt: 'Editar os dados da organização é limitado a administradores. Peça a um administrador da sua equipe se um dado da empresa, a moeda ou as pesquisas precisam mudar.'
    },
  'Edit organization': { es: 'Editar organización', pt: 'Editar organização' },
  Organization: { es: 'Organización', pt: 'Organização' },
  'One field to check': { es: 'Un campo por revisar', pt: 'Um campo para conferir' },
  'Two fields to check': { es: 'Dos campos por revisar', pt: 'Dois campos para conferir' },
  'Nothing has been saved yet.': { es: 'Todavía no se ha guardado nada.', pt: 'Nada foi salvo ainda.' },
  'What customers see': { es: 'Lo que ven los clientes', pt: 'O que os clientes veem' },
  'Printed on every invoice and estimate. Changes apply from now on; documents already sent keep what they were sent with.':
    {
      es: 'Se imprime en cada factura y presupuesto. Los cambios aplican de ahora en adelante; los documentos ya enviados conservan lo que llevaban.',
      pt: 'É impresso em cada fatura e orçamento. As mudanças valem daqui em diante; documentos já enviados mantêm o que foi enviado.'
    },
  'Legal name': { es: 'Razón social', pt: 'Razão social' },
  'The registered company name, as it should appear on a document.': {
    es: 'El nombre registrado de la empresa, como debe aparecer en un documento.',
    pt: 'O nome registrado da empresa, como deve aparecer em um documento.'
  },
  'Trading name': { es: 'Nombre comercial', pt: 'Nome fantasia' },
  'What this organisation is called across the app.': {
    es: 'Cómo se llama esta organización en toda la app.',
    pt: 'Como esta organização é chamada em todo o app.'
  },
  'Tax ID': { es: 'Identificación fiscal', pt: 'CNPJ/CPF' },
  'That does not look like an email address.': {
    es: 'Eso no parece una dirección de correo.',
    pt: 'Isso não parece um endereço de e-mail.'
  },
  'Include the full address, starting with http:// or https://.': {
    es: 'Incluye la dirección completa, empezando por http:// o https://.',
    pt: 'Inclua o endereço completo, começando com http:// ou https://.'
  },
  Postcode: { es: 'Código postal', pt: 'CEP' },
  'Not recorded': { es: 'Sin registrar', pt: 'Não registrado' },
  Defaults: { es: 'Valores predeterminados', pt: 'Padrões' },
  'Applied to new invoices and estimates. Existing ones keep theirs.': {
    es: 'Se aplica a facturas y presupuestos nuevos. Los que ya existen conservan el suyo.',
    pt: 'Vale para faturas e orçamentos novos. Os que já existem mantêm o deles.'
  },
  'Country default': { es: 'País predeterminado', pt: 'País padrão' },
  'Pre-filled on new addresses.': {
    es: 'Se rellena solo en las direcciones nuevas.',
    pt: 'Vem preenchido em endereços novos.'
  },
  'When a day starts for this organisation. Changing it moves what counts as due today and overdue, for everyone here.':
    {
      es: 'Cuándo empieza el día para esta organización. Cambiarlo mueve lo que cuenta como vence hoy y como vencido, para todos aquí.',
      pt: 'Quando o dia começa para esta organização. Mudar isso altera o que conta como vence hoje e como vencido, para todo mundo aqui.'
    },
  Behaviour: { es: 'Comportamiento', pt: 'Comportamento' },
  'Satisfaction surveys': { es: 'Encuestas de satisfacción', pt: 'Pesquisas de satisfação' },
  'Sending. A survey goes out after a ticket closes': {
    es: 'Enviando. Sale una encuesta cuando se cierra un ticket',
    pt: 'Enviando. Uma pesquisa sai quando um chamado é fechado'
  },
  'Off, no surveys, org-wide': {
    es: 'Apagado, sin encuestas, en toda la organización',
    pt: 'Desligado, sem pesquisas, em toda a organização'
  },
  'Off stops every survey org-wide. There is no per-team exception and no notice on the ticket.': {
    es: 'Apagado detiene todas las encuestas de la organización. No hay excepción por equipo ni aviso en el ticket.',
    pt: 'Desligado para todas as pesquisas da organização. Não há exceção por equipe nem aviso no chamado.'
  },
  'Close child tickets with the parent': {
    es: 'Cerrar los tickets hijos con el padre',
    pt: 'Fechar os chamados filhos junto com o pai'
  },
  'Offer it on. The close prompt starts ticked': {
    es: 'Ofrecerlo activado. El aviso de cierre empieza marcado',
    pt: 'Oferecer ligado. O aviso de fechar começa marcado'
  },
  'Offer it off. The close prompt starts unticked': {
    es: 'Ofrecerlo apagado. El aviso de cierre empieza sin marcar',
    pt: 'Oferecer desligado. O aviso de fechar começa desmarcado'
  },
  'Only sets how the prompt starts, and only on the mobile app, which is where closing a parent offers to close its open children. The person still confirms. Closing a parent on the web leaves its children open, with no prompt.':
    {
      es: 'Solo define cómo empieza el aviso, y solo en la app móvil, que es donde cerrar un padre ofrece cerrar sus hijos abiertos. La persona igual confirma. Cerrar un padre en la web deja a sus hijos abiertos, sin aviso.',
      pt: 'Só define como o aviso começa, e só no app móvel, que é onde fechar um pai oferece fechar os filhos abertos. A pessoa ainda confirma. Fechar um pai na web deixa os filhos abertos, sem aviso.'
    },
  'USD - Dollar': { es: 'USD - Dólar', pt: 'USD - Dólar' },
  'EUR - Euro': { es: 'EUR - Euro', pt: 'EUR - Euro' },
  'GBP - Pound': { es: 'GBP - Libra', pt: 'GBP - Libra' },
  'INR - Rupee': { es: 'INR - Rupia', pt: 'INR - Rúpia' },
  'CAD - Dollar': { es: 'CAD - Dólar', pt: 'CAD - Dólar' },
  'AUD - Dollar': { es: 'AUD - Dólar', pt: 'AUD - Dólar' },
  'JPY - Yen': { es: 'JPY - Yen', pt: 'JPY - Iene' },
  'CNY - Yuan': { es: 'CNY - Yuan', pt: 'CNY - Yuan' },
  'CHF - Franc': { es: 'CHF - Franco', pt: 'CHF - Franco' },
  'SGD - Dollar': { es: 'SGD - Dólar', pt: 'SGD - Dólar' },
  'AED - Dirham': { es: 'AED - Dírham', pt: 'AED - Dirham' },
  'BRL - Real': { es: 'BRL - Real', pt: 'BRL - Real' },
  'MXN - Peso': { es: 'MXN - Peso', pt: 'MXN - Peso' },
  'ZAR - Rand': { es: 'ZAR - Rand', pt: 'ZAR - Rand' },

  // Routing
  'Ticket routing': { es: 'Enrutamiento de tickets', pt: 'Roteamento de chamados' },
  'active rules, run in this order until one matches': {
    es: 'reglas activas, se ejecutan en este orden hasta que una coincida',
    pt: 'regras ativas, rodam nesta ordem até uma corresponder'
  },
  'Active rules': { es: 'Reglas activas', pt: 'Regras ativas' },
  'Rules off': { es: 'Reglas apagadas', pt: 'Regras desligadas' },
  'Unrouted, 30 days': { es: 'Sin enrutar, 30 días', pt: 'Sem roteamento, 30 dias' },
  'No rule matched, so nobody was assigned': {
    es: 'Ninguna regla coincidió, así que no se asignó a nadie',
    pt: 'Nenhuma regra correspondeu, então ninguém foi atribuído'
  },
  'The engine runs rules low number first and takes the first match.': {
    es: 'El motor ejecuta las reglas de menor número primero y se queda con la primera que coincida.',
    pt: 'O motor executa as regras de menor número primeiro e fica com a primeira que corresponder.'
  },
  Then: { es: 'Entonces', pt: 'Então' },
  Who: { es: 'Quién', pt: 'Quem' },
  'Direct uses only the first person selected here; the rest are ignored unless the strategy changes.':
    {
      es: 'Directo usa solo a la primera persona seleccionada aquí; el resto se ignora a menos que cambie la estrategia.',
      pt: 'Direto usa só a primeira pessoa selecionada aqui; o resto é ignorado a menos que a estratégia mude.'
    },
  'Round robin and least busy cycle through everyone listed here.': {
    es: 'Por turnos y menos ocupado recorren a todas las personas de esta lista.',
    pt: 'Rodízio e menos ocupado percorrem todo mundo desta lista.'
  },
  '{names} is deactivated and still in the rotation. Deselect to take them out.': {
    es: '{names} está desactivado y sigue en la rotación. Quítale la selección para sacarlo.',
    pt: '{names} está desativado e ainda está na rotação. Desmarque para tirá-lo.'
  },
  '{names} are deactivated and still in the rotation. Deselect to take them out.': {
    es: '{names} están desactivados y siguen en la rotación. Quítales la selección para sacarlos.',
    pt: '{names} estão desativados e ainda estão na rotação. Desmarque para tirá-los.'
  },
  'Stop processing': { es: 'Detener el proceso', pt: 'Parar o processamento' },
  'A matching rule with this on stops the engine, so later rules never see the ticket.': {
    es: 'Una regla que coincide con esto activado detiene el motor, así que las reglas de después nunca ven el ticket.',
    pt: 'Uma regra que corresponde com isto ligado para o motor, então as regras seguintes nunca veem o chamado.'
  },
  'Starts matching tickets as soon as it is saved.': {
    es: 'Empieza a coincidir con tickets en cuanto se guarda.',
    pt: 'Começa a corresponder a chamados assim que for salva.'
  },
  Conditions: { es: 'Condiciones', pt: 'Condições' },
  'Comma separated. Matches if any one of these values matches.': {
    es: 'Separados por comas. Coincide si cualquiera de estos valores coincide.',
    pt: 'Separados por vírgula. Corresponde se qualquer um destes valores corresponder.'
  },
  'With no conditions this rule matches every ticket.': {
    es: 'Sin condiciones, esta regla coincide con todos los tickets.',
    pt: 'Sem condições, esta regra corresponde a todos os chamados.'
  },
  'In evaluation order': { es: 'En orden de evaluación', pt: 'Na ordem de avaliação' },
  'Never runs': { es: 'Nunca se ejecuta', pt: 'Nunca executa' },
  'Any ticket': { es: 'Cualquier ticket', pt: 'Qualquer chamado' },
  'Next in the rotation: {name}': {
    es: 'Siguiente en la rotación: {name}',
    pt: 'Próximo na rotação: {name}'
  },
  '{names} is deactivated and still in the rotation, tickets routed there wait for someone who cannot sign in.':
    {
      es: '{names} está desactivado y sigue en la rotación; los tickets que caen ahí esperan a alguien que no puede entrar.',
      pt: '{names} está desativado e ainda está na rotação; os chamados enviados para lá esperam alguém que não consegue entrar.'
    },
  '{names} are deactivated and still in the rotation, tickets routed there wait for someone who cannot sign in.':
    {
      es: '{names} están desactivados y siguen en la rotación; los tickets que caen ahí esperan a alguien que no puede entrar.',
      pt: '{names} estão desativados e ainda estão na rotação; os chamados enviados para lá esperam alguém que não consegue entrar.'
    },
  'Rule {n} above matches every ticket and stops, so this one is never reached. Move it higher, or let that rule fall through.':
    {
      es: 'La regla {n} de arriba coincide con todos los tickets y se detiene, así que esta nunca se alcanza. Súbela, o deja que esa regla continúe.',
      pt: 'A regra {n} acima corresponde a todos os chamados e para, então esta nunca é alcançada. Suba ela, ou deixe aquela regra continuar.'
    },
  'matched, 30d': { es: 'coincidencias, 30 d', pt: 'correspondências, 30 d' },
  'falls through': { es: 'continúa', pt: 'continua' },
  'Stops matching new tickets. It stays in the list, off, until turned back on.': {
    es: 'Deja de coincidir con tickets nuevos. Se queda en la lista, apagada, hasta que la vuelvas a activar.',
    pt: 'Para de corresponder a chamados novos. Fica na lista, desligada, até você ativar de novo.'
  },
  'Deleted permanently. Tickets already routed by it stay where they are.': {
    es: 'Eliminada para siempre. Los tickets que ya enrutó se quedan donde están.',
    pt: 'Excluída para sempre. Os chamados que ela já roteou ficam onde estão.'
  },
  'A ticket takes the first rule that matches. Rules marked “falls through” keep going down the list after they run, so a ticket can be touched by more than one.':
    {
      es: 'Un ticket toma la primera regla que coincide. Las reglas marcadas como “continúa” siguen bajando por la lista después de ejecutarse, así que más de una puede tocar un ticket.',
      pt: 'Um chamado fica com a primeira regra que corresponde. Regras marcadas como “continua” seguem descendo a lista depois de rodar, então mais de uma pode mexer em um chamado.'
    },
  'Only an admin can add routing rules.': {
    es: 'Solo un administrador puede añadir reglas de enrutamiento.',
    pt: 'Só um administrador pode adicionar regras de roteamento.'
  },
  'Could not add the rule.': { es: 'No se pudo añadir la regla.', pt: 'Não foi possível adicionar a regra.' },
  'Only an admin can change routing rules.': {
    es: 'Solo un administrador puede cambiar las reglas de enrutamiento.',
    pt: 'Só um administrador pode alterar as regras de roteamento.'
  },
  'Could not save the rule.': {
    es: 'No se pudo guardar la regla.',
    pt: 'Não foi possível salvar a regra.'
  },
  'Only an admin can turn routing rules off.': {
    es: 'Solo un administrador puede apagar reglas de enrutamiento.',
    pt: 'Só um administrador pode desligar regras de roteamento.'
  },
  'Could not turn the rule off.': {
    es: 'No se pudo apagar la regla.',
    pt: 'Não foi possível desligar a regra.'
  },
  'Only an admin can turn routing rules on.': {
    es: 'Solo un administrador puede activar reglas de enrutamiento.',
    pt: 'Só um administrador pode ativar regras de roteamento.'
  },
  'Could not turn the rule on.': {
    es: 'No se pudo activar la regla.',
    pt: 'Não foi possível ativar a regra.'
  },
  'Only an admin can delete routing rules.': {
    es: 'Solo un administrador puede eliminar reglas de enrutamiento.',
    pt: 'Só um administrador pode excluir regras de roteamento.'
  },
  'Could not delete the rule.': {
    es: 'No se pudo eliminar la regla.',
    pt: 'Não foi possível excluir a regra.'
  },

  // Web forms list
  'Web forms': { es: 'Formularios web', pt: 'Formulários web' },
  'published of': { es: 'publicados de', pt: 'publicados de' },
  'Collecting nothing yet': { es: 'Todavía no recogen nada', pt: 'Ainda não coletam nada' },
  'Accepted, 30 days': { es: 'Aceptados, 30 días', pt: 'Aceitos, 30 dias' },
  'Spam blocked, 30 days': { es: 'Spam bloqueado, 30 días', pt: 'Spam bloqueado, 30 dias' },
  'Never reached a lead or ticket': {
    es: 'Nunca llegó a un prospecto ni a un ticket',
    pt: 'Nunca chegou a um lead nem a um chamado'
  },
  'What is this form for?': { es: '¿Para qué es este formulario?', pt: 'Para que serve este formulário?' },
  'e.g. Contact us': { es: 'p. ej. Contáctanos', pt: 'ex.: Fale conosco' },
  'Each submission creates': { es: 'Cada envío crea', pt: 'Cada envio cria' },
  'Create and add fields': { es: 'Crear y añadir campos', pt: 'Criar e adicionar campos' },
  'No web forms yet': { es: 'Todavía no hay formularios web', pt: 'Ainda não há formulários web' },
  'A web form is a page you embed on your own site. What people fill in becomes a lead or a ticket here, with no login and no copy-pasting.':
    {
      es: 'Un formulario web es una página que incrustas en tu propio sitio. Lo que la gente completa se vuelve un prospecto o un ticket aquí, sin iniciar sesión ni copiar y pegar.',
      pt: 'Um formulário web é uma página que você incorpora no seu próprio site. O que as pessoas preenchem vira um lead ou um chamado aqui, sem login e sem copiar e colar.'
    },
  'Nobody has built a web form for this organisation yet. An admin can create one.': {
    es: 'Nadie ha creado un formulario web para esta organización todavía. Un administrador puede crear uno.',
    pt: 'Ninguém criou um formulário web para esta organização ainda. Um administrador pode criar um.'
  },
  field: { es: 'campo', pt: 'campo' },
  fields: { es: 'campos', pt: 'campos' },
  'live but silent': { es: 'en vivo pero en silencio', pt: 'no ar, mas em silêncio' },
  Submissions: { es: 'Envíos', pt: 'Envios' },
  'Stops accepting submissions. The embed stays on the site and starts refusing people.': {
    es: 'Deja de aceptar envíos. El incrustado sigue en el sitio y empieza a rechazar a la gente.',
    pt: 'Para de aceitar envios. O embed continua no site e começa a recusar as pessoas.'
  },
  'Removes the form and its submission history. Leads and tickets already created stay.': {
    es: 'Quita el formulario y su historial de envíos. Los prospectos y tickets ya creados se quedan.',
    pt: 'Remove o formulário e o histórico de envios. Leads e chamados já criados ficam.'
  },
  'Showing the {n} most recent of': {
    es: 'Mostrando los {n} más recientes de',
    pt: 'Mostrando os {n} mais recentes de'
  },
  'The rest are reachable through the API.': {
    es: 'El resto se alcanza por la API.',
    pt: 'O resto é acessível pela API.'
  },
  'A published form accepts posts from anyone': {
    es: 'Un formulario publicado acepta envíos de cualquiera',
    pt: 'Um formulário publicado aceita envios de qualquer pessoa'
  },
  'It has to: the whole point is that a stranger can fill it in without an account. A honeypot field, per-form and per-address rate limits, and disposable-address rejection are always on, and each form can add a Cloudflare Turnstile challenge of its own. Publish only the forms you are embedding, and unpublish one the moment you take its snippet off your site.':
    {
      es: 'Tiene que hacerlo: el punto es que un desconocido pueda completarlo sin una cuenta. Un campo trampa, límites por formulario y por dirección, y el rechazo de correos desechables están siempre activos, y cada formulario puede añadir su propio desafío de Cloudflare Turnstile. Publica solo los formularios que estés incrustando, y retira la publicación en cuanto quites el fragmento de tu sitio.',
      pt: 'Precisa: a ideia é que um desconhecido possa preencher sem uma conta. Um campo isca, limites por formulário e por endereço, e a rejeição de e-mails descartáveis ficam sempre ligados, e cada formulário pode adicionar o próprio desafio Cloudflare Turnstile. Publique só os formulários que você está incorporando, e despublique no momento em que tirar o trecho do seu site.'
    },
  'Only an admin can create a web form. A form accepts submissions from anyone on the internet, so making one is an admin action.':
    {
      es: 'Solo un administrador puede crear un formulario web. Un formulario acepta envíos de cualquiera en internet, así que crearlo es una acción de administrador.',
      pt: 'Só um administrador pode criar um formulário web. Um formulário aceita envios de qualquer pessoa na internet, então criar um é uma ação de administrador.'
    },
  'Could not create the form.': {
    es: 'No se pudo crear el formulario.',
    pt: 'Não foi possível criar o formulário.'
  },
  'Only an admin can publish a web form.': {
    es: 'Solo un administrador puede publicar un formulario web.',
    pt: 'Só um administrador pode publicar um formulário web.'
  },
  'Could not publish the form.': {
    es: 'No se pudo publicar el formulario.',
    pt: 'Não foi possível publicar o formulário.'
  },
  'Only an admin can unpublish a web form.': {
    es: 'Solo un administrador puede retirar la publicación de un formulario web.',
    pt: 'Só um administrador pode despublicar um formulário web.'
  },
  'Could not unpublish the form.': {
    es: 'No se pudo retirar la publicación del formulario.',
    pt: 'Não foi possível despublicar o formulário.'
  },
  'Only an admin can remove a web form.': {
    es: 'Solo un administrador puede quitar un formulario web.',
    pt: 'Só um administrador pode remover um formulário web.'
  },
  'Could not remove the form.': {
    es: 'No se pudo quitar el formulario.',
    pt: 'Não foi possível remover o formulário.'
  },

  // Web form editor
  'That web form does not exist.': {
    es: 'Ese formulario web no existe.',
    pt: 'Esse formulário web não existe.'
  },
  'Only an admin can change a web form.': {
    es: 'Solo un administrador puede cambiar un formulario web.',
    pt: 'Só um administrador pode alterar um formulário web.'
  },
  'Could not save the form.': {
    es: 'No se pudo guardar el formulario.',
    pt: 'Não foi possível salvar o formulário.'
  },
  'Creates tickets.': { es: 'Crea tickets.', pt: 'Cria chamados.' },
  'Creates leads.': { es: 'Crea prospectos.', pt: 'Cria leads.' },
  'Accepting submissions from anyone with the embed.': {
    es: 'Acepta envíos de cualquiera que tenga el incrustado.',
    pt: 'Aceitando envios de qualquer pessoa com o embed.'
  },
  'Collecting nothing until it is published.': {
    es: 'No recoge nada hasta que se publique.',
    pt: 'Não coleta nada até ser publicado.'
  },
  'The embed stays on the site and starts refusing people.': {
    es: 'El incrustado sigue en el sitio y empieza a rechazar a la gente.',
    pt: 'O embed continua no site e começa a recusar as pessoas.'
  },
  'Before you can publish': { es: 'Antes de poder publicar', pt: 'Antes de poder publicar' },
  'Add at least one field first.': {
    es: 'Añade al menos un campo primero.',
    pt: 'Adicione pelo menos um campo primeiro.'
  },
  'Add an email field before publishing. It is how each ticket finds its contact, or creates one.': {
    es: 'Añade un campo de correo antes de publicar. Es como cada ticket encuentra a su contacto, o crea uno.',
    pt: 'Adicione um campo de e-mail antes de publicar. É como cada chamado encontra o contato, ou cria um.'
  },
  'Add an email field before publishing. It is what lets a repeat submission update the existing lead instead of failing.':
    {
      es: 'Añade un campo de correo antes de publicar. Es lo que permite que un envío repetido actualice el prospecto existente en lugar de fallar.',
      pt: 'Adicione um campo de e-mail antes de publicar. É o que permite que um envio repetido atualize o lead existente em vez de falhar.'
    },
  'Every field needs a label and something to write into.': {
    es: 'Cada campo necesita una etiqueta y algo en qué escribir.',
    pt: 'Cada campo precisa de um rótulo e de algo em que escrever.'
  },
  'This form redirects on success but has no redirect URL set.': {
    es: 'Este formulario redirige al tener éxito, pero no tiene una URL de redirección.',
    pt: 'Este formulário redireciona no sucesso, mas não tem uma URL de redirecionamento.'
  },
  'What a visitor is asked, in the order they are asked it. An email field is required before the form can be published.':
    {
      es: 'Lo que se le pide a quien visita, en el orden en que se le pide. Hace falta un campo de correo antes de poder publicar el formulario.',
      pt: 'O que se pede a quem visita, na ordem em que se pede. Um campo de e-mail é necessário antes de publicar o formulário.'
    },
  'No fields yet. A form with no fields collects nothing.': {
    es: 'Todavía no hay campos. Un formulario sin campos no recoge nada.',
    pt: 'Ainda não há campos. Um formulário sem campos não coleta nada.'
  },
  'Field type': { es: 'Tipo de campo', pt: 'Tipo de campo' },
  'Label the visitor sees': { es: 'Etiqueta que ve quien visita', pt: 'Rótulo que quem visita vê' },
  'Placeholder (optional)': { es: 'Texto de ejemplo (opcional)', pt: 'Texto de exemplo (opcional)' },
  'What the visitor sees after they submit, and where the ticket lands.': {
    es: 'Lo que ve quien envía, y dónde queda el ticket.',
    pt: 'O que quem envia vê, e onde o chamado fica.'
  },
  'What the visitor sees after they submit, and where the lead lands.': {
    es: 'Lo que ve quien envía, y dónde queda el prospecto.',
    pt: 'O que quem envia vê, e onde o lead fica.'
  },
  'Internal only. The visitor never sees it.': {
    es: 'Solo interno. Quien visita nunca lo ve.',
    pt: 'Só interno. Quem visita nunca vê.'
  },
  'Submit button': { es: 'Botón de envío', pt: 'Botão de envio' },
  'After a successful submission': { es: 'Después de un envío correcto', pt: 'Depois de um envio bem-sucedido' },
  'Show a message': { es: 'Mostrar un mensaje', pt: 'Mostrar uma mensagem' },
  'Redirect to a URL': { es: 'Redirigir a una URL', pt: 'Redirecionar para uma URL' },
  'Redirect URL': { es: 'URL de redirección', pt: 'URL de redirecionamento' },
  'http or https only. The embed navigates the visitor\'s browser here, so any other scheme would be a script running on your own site.':
    {
      es: 'Solo http o https. El incrustado lleva el navegador de quien visita hasta aquí, así que cualquier otro esquema sería un script corriendo en tu propio sitio.',
      pt: 'Só http ou https. O embed leva o navegador de quem visita até aqui, então qualquer outro esquema seria um script rodando no seu próprio site.'
    },
  'Success message': { es: 'Mensaje de éxito', pt: 'Mensagem de sucesso' },
  'Assign new leads': { es: 'Asignar prospectos nuevos', pt: 'Atribuir leads novos' },
  'To one person': { es: 'A una persona', pt: 'A uma pessoa' },
  'Rotate between members': { es: 'Rotar entre miembros', pt: 'Alternar entre membros' },
  'A repeat submission from the same email updates the existing lead and keeps its owner.': {
    es: 'Un envío repetido del mismo correo actualiza el prospecto existente y conserva a su responsable.',
    pt: 'Um envio repetido do mesmo e-mail atualiza o lead existente e mantém o responsável.'
  },
  'Assign new tickets to': { es: 'Asignar tickets nuevos a', pt: 'Atribuir chamados novos a' },
  'Assign new leads to': { es: 'Asignar prospectos nuevos a', pt: 'Atribuir leads novos a' },
  'Deactivated users are not assigned.': {
    es: 'Los usuarios desactivados no se asignan.',
    pt: 'Usuários desativados não são atribuídos.'
  },
  'New tickets from this form are left to your routing rules': {
    es: 'Los tickets nuevos de este formulario quedan para tus reglas de enrutamiento',
    pt: 'Chamados novos deste formulário ficam para as suas regras de roteamento'
  },
  'New leads from this form stay unassigned': {
    es: 'Los prospectos nuevos de este formulario quedan sin asignar',
    pt: 'Leads novos deste formulário ficam sem atribuição'
  },
  'until you choose someone else.': {
    es: 'hasta que elijas a alguien más.',
    pt: 'até você escolher outra pessoa.'
  },
  'Rotate between': { es: 'Rotar entre', pt: 'Alternar entre' },
  'Each new lead goes to the next member in turn. Deactivated members are skipped.': {
    es: 'Cada prospecto nuevo va al siguiente miembro, por turnos. Los miembros desactivados se saltan.',
    pt: 'Cada lead novo vai para o próximo membro, em turnos. Membros desativados são pulados.'
  },
  'Last assigned: {name}.': { es: 'Último asignado: {name}.', pt: 'Último atribuído: {name}.' },
  'nobody yet': { es: 'nadie todavía', pt: 'ninguém ainda' },
  'Most open leads per member': {
    es: 'Máximo de prospectos abiertos por miembro',
    pt: 'Máximo de leads abertos por membro'
  },
  'No limit': { es: 'Sin límite', pt: 'Sem limite' },
  'Optional. A member holding this many open leads is passed over until one is converted or closed. When everyone is passed over, the lead stays unassigned.':
    {
      es: 'Opcional. Un miembro que tenga esta cantidad de prospectos abiertos se salta hasta que uno se convierta o se cierre. Cuando todos se saltan, el prospecto queda sin asignar.',
      pt: 'Opcional. Um membro com esta quantidade de leads abertos é pulado até um ser convertido ou fechado. Quando todo mundo é pulado, o lead fica sem atribuição.'
    },
  'Ticket priority': { es: 'Prioridad del ticket', pt: 'Prioridade do chamado' },
  'Set by the form, never by the visitor.': {
    es: 'La define el formulario, nunca quien visita.',
    pt: 'É definida pelo formulário, nunca por quem visita.'
  },
  'Ticket type': { es: 'Tipo de ticket', pt: 'Tipo de chamado' },
  'Record the source as': { es: 'Registrar el origen como', pt: 'Registrar a origem como' },
  'Which form a lead came from is recorded separately, so this can stay broad.': {
    es: 'De qué formulario vino un prospecto se registra aparte, así que esto puede quedarse amplio.',
    pt: 'De qual formulário um lead veio é registrado à parte, então isto pode ficar amplo.'
  },
  'Email these people on each ticket': {
    es: 'Enviar correo a estas personas por cada ticket',
    pt: 'Enviar e-mail a estas pessoas em cada chamado'
  },
  'Email these people on each lead': {
    es: 'Enviar correo a estas personas por cada prospecto',
    pt: 'Enviar e-mail a estas pessoas em cada lead'
  },
  'The assignee above is emailed as well.': {
    es: 'A la persona asignada de arriba también se le envía correo.',
    pt: 'A pessoa atribuída acima também recebe e-mail.'
  },
  'Whoever each lead is assigned to is emailed as well.': {
    es: 'A quien se asigne cada prospecto también se le envía correo.',
    pt: 'Quem receber cada lead também recebe e-mail.'
  },
  'Tag every ticket with': { es: 'Etiquetar cada ticket con', pt: 'Etiquetar cada chamado com' },
  'Tag every lead with': { es: 'Etiquetar cada prospecto con', pt: 'Etiquetar cada lead com' },
  Spam: { es: 'Spam', pt: 'Spam' },
  'A hidden honeypot field, a per-address rate limit and a per-form one are always on and are not configurable. These are the parts you choose.':
    {
      es: 'Un campo trampa oculto, un límite por dirección y otro por formulario están siempre activos y no se configuran. Estas son las partes que eliges.',
      pt: 'Um campo isca oculto, um limite por endereço e outro por formulário ficam sempre ligados e não são configuráveis. Estas são as partes que você escolhe.'
    },
  'Allowed origins': { es: 'Orígenes permitidos', pt: 'Origens permitidas' },
  'One per line, scheme and host only, no path. Leave empty and the iframe embed works anywhere. The script embed needs the site\'s origin listed here: the browser refuses a cross-origin POST that we have not permitted, and a form with no listed origins permits none.':
    {
      es: 'Uno por línea, solo esquema y host, sin ruta. Si lo dejas vacío, el incrustado iframe funciona en cualquier lado. El incrustado script necesita el origen del sitio en esta lista: el navegador rechaza un POST de otro origen que no hayamos permitido, y un formulario sin orígenes listados no permite ninguno.',
      pt: 'Um por linha, só esquema e host, sem caminho. Se ficar vazio, o embed iframe funciona em qualquer lugar. O embed script precisa da origem do site nesta lista: o navegador recusa um POST de outra origem que não permitimos, e um formulário sem origens listadas não permite nenhuma.'
    },
  'Reject throwaway email addresses': {
    es: 'Rechazar direcciones de correo desechables',
    pt: 'Rejeitar endereços de e-mail descartáveis'
  },
  Challenge: { es: 'Desafío', pt: 'Desafio' },
  'Cloudflare Turnstile': { es: 'Cloudflare Turnstile', pt: 'Cloudflare Turnstile' },
  'Turnstile site key': { es: 'Clave de sitio de Turnstile', pt: 'Chave de site do Turnstile' },
  'Turnstile secret': { es: 'Secreto de Turnstile', pt: 'Segredo do Turnstile' },
  'Stored. Leave blank to keep it.': {
    es: 'Guardado. Déjalo en blanco para conservarlo.',
    pt: 'Salvo. Deixe em branco para manter.'
  },
  'Paste the secret from Cloudflare': {
    es: 'Pega el secreto de Cloudflare',
    pt: 'Cole o segredo da Cloudflare'
  },
  'Never shown again once saved; we only send it to Cloudflare. Leaving this blank keeps whatever is stored rather than clearing it.':
    {
      es: 'No se vuelve a mostrar una vez guardado; solo se lo enviamos a Cloudflare. Dejarlo en blanco conserva lo guardado en lugar de borrarlo.',
      pt: 'Não é mostrado de novo depois de salvo; só enviamos para a Cloudflare. Deixar em branco mantém o que está salvo em vez de apagar.'
    },
  'No secret is stored yet. Verification fails closed, so publishing with Turnstile on and no secret would refuse every submission.':
    {
      es: 'Todavía no hay un secreto guardado. La verificación falla cerrada, así que publicar con Turnstile activo y sin secreto rechazaría todos los envíos.',
      pt: 'Nenhum segredo está salvo ainda. A verificação falha fechada, então publicar com o Turnstile ligado e sem segredo recusaria todos os envios.'
    },
  Embed: { es: 'Incrustar', pt: 'Incorporar' },
  'Paste one of these into your own site. Both are built by the server, because they need this API\'s address and a browser only knows your site\'s.':
    {
      es: 'Pega uno de estos en tu propio sitio. Los dos los arma el servidor, porque necesitan la dirección de esta API y un navegador solo conoce la de tu sitio.',
      pt: 'Cole um destes no seu próprio site. Os dois são montados pelo servidor, porque precisam do endereço desta API e um navegador só conhece o do seu site.'
    },
  'Works anywhere, no origin list needed.': {
    es: 'Funciona en cualquier lado, sin lista de orígenes.',
    pt: 'Funciona em qualquer lugar, sem lista de origens.'
  },
  'Inherits your site\'s styling.': {
    es: 'Hereda el estilo de tu sitio.',
    pt: 'Herda o estilo do seu site.'
  },
  'This one will not work yet. Add the site\'s origin under Spam first: the browser blocks a cross-origin POST unless we permit that origin, and this form permits none.':
    {
      es: 'Este todavía no va a funcionar. Añade primero el origen del sitio en Spam: el navegador bloquea un POST de otro origen a menos que permitamos ese origen, y este formulario no permite ninguno.',
      pt: 'Este ainda não vai funcionar. Adicione primeiro a origem do site em Spam: o navegador bloqueia um POST de outra origem a menos que a gente permita essa origem, e este formulário não permite nenhuma.'
    },
  'The last 30 days. A view is counted when the embed loads, whether or not anyone fills it in.': {
    es: 'Los últimos 30 días. Una vista se cuenta cuando carga el incrustado, lo complete alguien o no.',
    pt: 'Os últimos 30 dias. Uma visualização é contada quando o embed carrega, alguém preenchendo ou não.'
  },
  Conversion: { es: 'Conversión', pt: 'Conversão' },
  'No views yet': { es: 'Todavía no hay vistas', pt: 'Ainda não há visualizações' },
  'Spam blocked': { es: 'Spam bloqueado', pt: 'Spam bloqueado' },
  'Never reached a ticket': { es: 'Nunca llegó a un ticket', pt: 'Nunca chegou a um chamado' },
  'Never reached a lead': { es: 'Nunca llegó a un prospecto', pt: 'Nunca chegou a um lead' },
  'Nothing submitted yet. Rejected attempts would be listed here too, so an empty list means nobody has reached the form at all.':
    {
      es: 'Todavía no hay envíos. Los intentos rechazados también aparecerían aquí, así que una lista vacía significa que nadie ha llegado al formulario.',
      pt: 'Nada enviado ainda. Tentativas rejeitadas também apareceriam aqui, então uma lista vazia significa que ninguém chegou ao formulário.'
    },
  Submitted: { es: 'Enviado', pt: 'Enviado' },
  Outcome: { es: 'Resultado', pt: 'Resultado' },
  From: { es: 'Desde', pt: 'De' },
  'Ticket opened': { es: 'Ticket abierto', pt: 'Chamado aberto' },
  'Lead created': { es: 'Prospecto creado', pt: 'Lead criado' },
  'Merged into an existing lead': {
    es: 'Fusionado con un prospecto existente',
    pt: 'Unido a um lead existente'
  },
  'Rejected as spam': { es: 'Rechazado como spam', pt: 'Rejeitado como spam' },
  'Rejected, invalid': { es: 'Rechazado, no válido', pt: 'Rejeitado, inválido' },
  'Rejected, captcha': { es: 'Rechazado, captcha', pt: 'Rejeitado, captcha' },
  'No ticket': { es: 'Sin ticket', pt: 'Sem chamado' },
  'No lead': { es: 'Sin prospecto', pt: 'Sem lead' },
  'Showing the {shown} most recent of': {
    es: 'Mostrando los {shown} más recientes de',
    pt: 'Mostrando os {shown} mais recentes de'
  },
  'Removes the form and its submission history. The tickets it already created stay where they are. Any embed still on your site will stop working.':
    {
      es: 'Quita el formulario y su historial de envíos. Los tickets que ya creó se quedan donde están. Cualquier incrustado que siga en tu sitio va a dejar de funcionar.',
      pt: 'Remove o formulário e o histórico de envios. Os chamados que ele já criou ficam onde estão. Qualquer embed que ainda esteja no seu site vai parar de funcionar.'
    },
  'Removes the form and its submission history. The leads it already created stay where they are. Any embed still on your site will stop working.':
    {
      es: 'Quita el formulario y su historial de envíos. Los prospectos que ya creó se quedan donde están. Cualquier incrustado que siga en tu sitio va a dejar de funcionar.',
      pt: 'Remove o formulário e o histórico de envios. Os leads que ele já criou ficam onde estão. Qualquer embed que ainda esteja no seu site vai parar de funcionar.'
    },
  'This cannot be undone.': { es: 'Esto no se puede deshacer.', pt: 'Isto não pode ser desfeito.' }
};

addMessages(messages);
