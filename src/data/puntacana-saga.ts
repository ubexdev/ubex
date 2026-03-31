/**
 * Saga: Tesoros del Paraíso — Punta Cana
 * 12 niveles por las maravillas naturales de Punta Cana, Bávaro y La Altagracia.
 *
 * spawn_lat/lng  → punto de INICIO (spawn) en vía pública con cobertura Street View
 * target_lat/lng → ubicación de la RESPUESTA (zona de validación)
 *
 * Coordenadas verificadas en Google Maps. Spawn points en carreteras principales:
 * Boulevard Turístico del Este, Carretera Coral, Autopista del Este, vías locales.
 */

export interface SagaLevel {
  level_number: number;
  title: string;
  description: string;
  clue: string;
  answer: string;
  answer_type: "text" | "proximity";
  spawn_lat: number;
  spawn_lng: number;
  target_lat: number;
  target_lng: number;
  proximity_radius: number;
  points: number;
  time_limit: number | null;
  hints: string[];
}

export const puntacanaSaga = {
  title: "Tesoros del Paraíso",
  description:
    "Explora las maravillas naturales de Punta Cana y La Altagracia. 12 destinos paradisíacos te esperan.",
  city: "Punta Cana",
  country: "DO",
  difficulty: "medium" as const,
  estimated_duration: 45,
  levels: [
    // ── Level 1 ── Playa Bávaro (Easy) ────────────────────────────
    {
      level_number: 1,
      title: "Arena de Cristal",
      description:
        "La playa más famosa de Punta Cana, reconocida mundialmente por su arena blanca y aguas turquesa.",
      clue: "Donde las palmeras besan el mar y la arena brilla como polvo de estrellas, miles de viajeros plantan su sombrilla cada día. Es la postal más célebre del este dominicano.",
      answer: "Playa Bávaro",
      answer_type: "proximity",
      // Spawn: Boulevard Turístico del Este, cerca del acceso a la playa
      spawn_lat: 18.6862,
      spawn_lng: -68.4100,
      // Target: Playa Bávaro, zona central de la playa
      target_lat: 18.6895,
      target_lng: -68.4050,
      proximity_radius: 200,
      points: 100,
      time_limit: null,
      hints: [
        "Está en el corazón de la zona hotelera más grande del Caribe dominicano.",
        "Su nombre comparte raíz con el pueblo que la rodea, al norte de Punta Cana.",
        "Fue nombrada una de las mejores playas del mundo por la UNESCO.",
      ],
    },

    // ── Level 2 ── Basílica Nuestra Señora de la Altagracia (Easy) ─
    {
      level_number: 2,
      title: "La Fe de Higüey",
      description:
        "El santuario mariano más importante de la República Dominicana, en la capital de la provincia.",
      clue: "Un arco de concreto se eleva como manos en oración en la ciudad ganadera del este. Dentro guarda la imagen más venerada del país, patrona de toda la nación. El 21 de enero, miles peregrinan hasta aquí.",
      answer: "Basílica Nuestra Señora de la Altagracia",
      answer_type: "proximity",
      // Spawn: Calle Altagracia, centro de Higüey
      spawn_lat: 18.6135,
      spawn_lng: -68.7050,
      // Target: Basílica en Higüey
      target_lat: 18.6153,
      target_lng: -68.7079,
      proximity_radius: 150,
      points: 100,
      time_limit: null,
      hints: [
        "No está en la costa — búscala en la ciudad principal de la provincia La Altagracia.",
        "Su diseño modernista fue obra de los arquitectos franceses André Dunoyer de Segonzac y Pierre Dupré.",
        "Cada 21 de enero, día de la patrona dominicana, recibe la mayor peregrinación del país.",
      ],
    },

    // ── Level 3 ── Cap Cana Marina (Easy-Medium) ──────────────────
    {
      level_number: 3,
      title: "Puerto de Lujo",
      description:
        "La marina más exclusiva del Caribe dominicano, rodeada de restaurantes y yates.",
      clue: "Yates blancos descansan en aguas calmas, rodeados de palmeras y restaurantes elegantes. Este puerto deportivo pertenece al desarrollo turístico más lujoso al sur de Punta Cana.",
      answer: "Cap Cana Marina",
      answer_type: "proximity",
      // Spawn: Carretera de acceso a Cap Cana
      spawn_lat: 18.5225,
      spawn_lng: -68.3710,
      // Target: Marina de Cap Cana
      target_lat: 18.5178,
      target_lng: -68.3681,
      proximity_radius: 200,
      points: 150,
      time_limit: null,
      hints: [
        "Está dentro de un complejo turístico privado al sur del aeropuerto de Punta Cana.",
        "El nombre del desarrollo significa 'cabo' seguido del nombre del río que limita al sur.",
        "Fue diseñada por la firma de Trump Organization antes de cambiar de manos.",
      ],
    },

    // ── Level 4 ── Playa Macao (Medium) ───────────────────────────
    {
      level_number: 4,
      title: "La Playa Virgen",
      description:
        "Una playa sin desarrollo hotelero masivo, popular entre surfistas y aventureros.",
      clue: "Al norte de los resorts, donde las olas rompen con fuerza y los buggies levantan arena, se extiende una playa sin cadenas hoteleras. Los surfistas la prefieren por su oleaje constante.",
      answer: "Playa Macao",
      answer_type: "proximity",
      // Spawn: Carretera a Playa Macao desde la vía principal
      spawn_lat: 18.7095,
      spawn_lng: -68.4525,
      // Target: Playa Macao
      target_lat: 18.7168,
      target_lng: -68.4470,
      proximity_radius: 250,
      points: 200,
      time_limit: null,
      hints: [
        "Es la playa más al norte de la zona turística de Bávaro-Punta Cana.",
        "Su nombre coincide con una región administrativa especial de China.",
        "Las excursiones en buggies y quad desde los hoteles terminan aquí.",
      ],
    },

    // ── Level 5 ── Hoyo Azul (Medium) ─────────────────────────────
    {
      level_number: 5,
      title: "El Ojo del Cenote",
      description:
        "Un cenote natural de aguas turquesa escondido al pie de un acantilado de piedra caliza.",
      clue: "Al fondo de un acantilado cubierto de enredaderas, un ojo de agua azul turquesa espera a los valientes que descienden por la escalera. Su agua dulce contrasta con el mar cercano.",
      answer: "Hoyo Azul",
      answer_type: "proximity",
      // Spawn: Vía de acceso al Scape Park, Cap Cana
      spawn_lat: 18.5108,
      spawn_lng: -68.3730,
      // Target: Hoyo Azul dentro de Scape Park
      target_lat: 18.5062,
      target_lng: -68.3748,
      proximity_radius: 150,
      points: 200,
      time_limit: null,
      hints: [
        "Se encuentra dentro de un parque de aventuras en Cap Cana.",
        "Su nombre describe literalmente lo que ves: una cavidad con agua color cielo.",
        "Está dentro de Scape Park, el parque de ecoaventuras más visitado de la zona.",
      ],
    },

    // ── Level 6 ── Altos de Chavón (Medium) ───────────────────────
    {
      level_number: 6,
      title: "La Aldea del Artista",
      description:
        "Una réplica de aldea mediterránea del siglo XVI con anfiteatro y vistas al río Chavón.",
      clue: "Sobre un acantilado, una aldea de piedra parece trasplantada del Mediterráneo. Su anfiteatro ha recibido a Frank Sinatra y Sting. Mira hacia abajo: el río serpentea entre la vegetación tropical.",
      answer: "Altos de Chavón",
      answer_type: "proximity",
      // Spawn: Carretera de acceso a Altos de Chavón desde La Romana
      spawn_lat: 18.4240,
      spawn_lng: -68.9520,
      // Target: Altos de Chavón, la aldea/anfiteatro
      target_lat: 18.4270,
      target_lng: -68.9490,
      proximity_radius: 200,
      points: 250,
      time_limit: null,
      hints: [
        "No está en Punta Cana — búscala cerca de La Romana, al lado del río.",
        "Fue construida en 1976 por el magnate del azúcar Charles Bluhdorn.",
        "Su anfiteatro griego tiene capacidad para 5,000 personas y fue inaugurado por Frank Sinatra.",
      ],
    },

    // ── Level 7 ── Playa Juanillo (Medium-Hard) ──────────────────
    {
      level_number: 7,
      title: "El Secreto de los Pescadores",
      description:
        "Una playa de postal con aguas cristalinas, antes un secreto de pescadores locales.",
      clue: "Dentro del complejo más exclusivo del este, se esconde una playa que solía pertenecer solo a los pescadores. Arena fina, aguas color esmeralda y un restaurante de paella frente al mar.",
      answer: "Playa Juanillo",
      answer_type: "proximity",
      // Spawn: Vía interior de Cap Cana hacia Juanillo
      spawn_lat: 18.5110,
      spawn_lng: -68.3620,
      // Target: Playa Juanillo
      target_lat: 18.5070,
      target_lng: -68.3590,
      proximity_radius: 200,
      points: 300,
      time_limit: null,
      hints: [
        "Está dentro de Cap Cana, pero más al este que la marina.",
        "Su nombre es un diminutivo de un nombre propio masculino muy común en español.",
        "Se ha convertido en escenario favorito para bodas de destino y sesiones fotográficas.",
      ],
    },

    // ── Level 8 ── Cueva de las Maravillas (Hard) ─────────────────
    {
      level_number: 8,
      title: "Ecos Taínos",
      description:
        "Una cueva subterránea con petroglifos y pictografías taínas de más de 500 años.",
      clue: "Bajo la carretera que une dos ciudades, un mundo subterráneo guarda el arte de los primeros habitantes. Rostros tallados en roca, estalactitas como cortinas y un silencio que habla de siglos.",
      answer: "Cueva de las Maravillas",
      answer_type: "proximity",
      // Spawn: Autopista del Este (Autovía del Este), cerca de la entrada
      spawn_lat: 18.4340,
      spawn_lng: -69.0670,
      // Target: Cueva de las Maravillas
      target_lat: 18.4316,
      target_lng: -69.0642,
      proximity_radius: 200,
      points: 300,
      time_limit: null,
      hints: [
        "Está entre San Pedro de Macorís y La Romana, justo al lado de la autopista.",
        "Su nombre sugiere asombro — y dentro encontrarás arte rupestre taíno de más de 500 años.",
        "Tiene un sistema de pasarelas iluminadas que recorren 240 metros bajo tierra.",
      ],
    },

    // ── Level 9 ── Indigenous Eyes Ecological Park (Hard) ─────────
    {
      level_number: 9,
      title: "Ojos en la Selva",
      description:
        "Un parque ecológico con lagunas de agua dulce escondidas entre la vegetación tropical.",
      clue: "Doce lagunas de agua dulce se ocultan entre árboles centenarios, como ojos que miran al cielo desde el bosque. Los taínos ya las conocían. Solo en algunas está permitido bañarse.",
      answer: "Indigenous Eyes Ecological Park",
      answer_type: "proximity",
      // Spawn: Carretera de acceso al parque desde Punta Cana Resort
      spawn_lat: 18.5235,
      spawn_lng: -68.3785,
      // Target: Parque Ecológico Ojos Indígenas
      target_lat: 18.5195,
      target_lng: -68.3725,
      proximity_radius: 250,
      points: 350,
      time_limit: null,
      hints: [
        "Está dentro de la propiedad del Puntacana Resort & Club, a pocos kilómetros del aeropuerto.",
        "Cada laguna tiene un nombre taíno y sus aguas son dulces, no saladas.",
        "Los taínos llamaban a estas lagunas 'los ojos' — ese nombre se mantiene hasta hoy.",
      ],
    },

    // ── Level 10 ── Bayahíbe / Parque Nacional del Este (Hard) ────
    {
      level_number: 10,
      title: "Puerta a la Isla",
      description:
        "El pueblo pesquero desde donde parten las lanchas hacia Isla Saona y el Parque Nacional.",
      clue: "Desde este pequeño pueblo de pescadores parten las lanchas hacia una isla paradisíaca donde las estrellas de mar tapizan el fondo. Es la puerta de entrada al parque nacional más visitado del país.",
      answer: "Bayahíbe",
      answer_type: "proximity",
      // Spawn: Carretera de acceso a Bayahíbe desde Dominicus
      spawn_lat: 18.3680,
      spawn_lng: -68.8400,
      // Target: Muelle de Bayahíbe
      target_lat: 18.3648,
      target_lng: -68.8370,
      proximity_radius: 200,
      points: 350,
      time_limit: null,
      hints: [
        "Está al suroeste de Punta Cana, en la provincia La Altagracia, junto al mar.",
        "Es el punto de partida para visitar Isla Saona y la Piscina Natural.",
        "El Parque Nacional Cotubanamá (antes del Este) protege esta zona costera.",
      ],
    },

    // ── Level 11 ── Faro de Cap Cana (Very Hard) ─────────────────
    {
      level_number: 11,
      title: "La Luz del Cabo",
      description:
        "Un faro en la punta sur de Cap Cana con vistas dramáticas al Paso de la Mona.",
      clue: "En la punta más meridional del complejo de lujo, una torre vigía marca el límite entre tierra y mar abierto. Desde aquí, en días claros, el horizonte revela el canal que separa esta isla de la vecina Borinquen.",
      answer: "Faro de Cap Cana",
      answer_type: "proximity",
      // Spawn: Vía costera de Cap Cana hacia el faro
      spawn_lat: 18.5025,
      spawn_lng: -68.3665,
      // Target: El Faro de Cap Cana
      target_lat: 18.4982,
      target_lng: -68.3638,
      proximity_radius: 200,
      points: 450,
      time_limit: null,
      hints: [
        "Está en Cap Cana, pero en su extremo más al sur, lejos de la marina.",
        "Su propósito original era guiar a los navegantes — es una estructura de señalización marítima.",
        "El Paso de la Mona, que se ve desde aquí, separa la isla de Puerto Rico.",
      ],
    },

    // ── Level 12 ── Boca de Yuma (Extreme) ────────────────────────
    {
      level_number: 12,
      title: "El Tesoro Escondido",
      description:
        "Un pueblo pesquero remoto en la desembocadura del río Yuma, con acantilados y cuevas.",
      clue: "Donde el río más largo del este besa el mar Caribe, un pueblo diminuto se aferra a los acantilados. Cuevas, farallones y una tranquilidad que el turismo aún no ha conquistado. Los pescadores salen al amanecer mientras las fragatas planean sobre los riscos.",
      answer: "Boca de Yuma",
      answer_type: "proximity",
      // Spawn: Carretera de acceso a Boca de Yuma
      spawn_lat: 18.3670,
      spawn_lng: -68.6230,
      // Target: Boca de Yuma, el pueblo costero
      target_lat: 18.3630,
      target_lng: -68.6190,
      proximity_radius: 250,
      points: 500,
      time_limit: null,
      hints: [
        "Está en la costa sur de La Altagracia, lejos de las zonas turísticas.",
        "Su nombre describe exactamente su geografía: la desembocadura de un río.",
        "Desde aquí también se accede al Parque Nacional Cotubanamá por su lado oriental.",
      ],
    },
  ] as SagaLevel[],
};
