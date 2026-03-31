/**
 * Datos de la saga demo: Zona Colonial, Santo Domingo.
 * 12 niveles con coordenadas reales de Google Street View.
 *
 * lat/lng       → punto de INICIO (spawn) del jugador
 * targetLat/Lng → ubicación de la RESPUESTA (zona de validación en modo Explorador)
 */

export interface DemoLevel {
  id: string;
  number: number;
  title: string;
  clue: {
    text: string;
    hint?: string;
    difficulty: "easy" | "medium" | "hard" | "extreme";
  };
  /** Starting position (spawn) */
  lat: number;
  lng: number;
  heading: number;
  pitch: number;
  /** Answer location (proximity target) */
  targetLat: number;
  targetLng: number;
  correctAnswers: string[];
  explanation: string;
}

export const DEMO_SAGA = {
  id: "saga-colon-2026",
  title: "Saga de Colón",
  subtitle: "Zona Colonial · Santo Domingo",
  description:
    "Recorre la ciudad más antigua del Nuevo Mundo. 12 acertijos te esperan entre calles empedradas, fortalezas centenarias y secretos coloniales. Solo uno ganará el tesoro.",
  city: "Santo Domingo",
  country: "República Dominicana",
  prizeAmountUSD: 1000,
  maxParticipants: 5000,
  coverEmoji: "🏰",
};

export const DEMO_LEVELS: DemoLevel[] = [
  {
    id: "level-1",
    number: 1,
    title: "El Descubridor",
    clue: {
      text: "En el corazón de la Zona Colonial, un explorador de bronce señala al horizonte desde su pedestal. ¿A quién representa esta estatua?",
      hint: "Llegó a estas tierras en 1492 con tres carabelas.",
      difficulty: "easy",
    },
    // Spawn: Calle El Conde ~200m west of the park
    lat: 18.47310,
    lng: -69.88620,
    heading: 90,
    pitch: 0,
    // Target: Parque Colón — Columbus statue (verified)
    targetLat: 18.47348,
    targetLng: -69.88399,
    correctAnswers: [
      "colon",
      "cristobal colon",
      "cristóbal colón",
      "christopher columbus",
      "columbus",
    ],
    explanation:
      "La estatua de Cristóbal Colón preside el Parque Colón, centro histórico de la Zona Colonial desde 1887.",
  },
  {
    id: "level-2",
    number: 2,
    title: "La Primera Calle",
    clue: {
      text: "Caminas sobre piedras que llevan más de 500 años. Esta calle fue la primera pavimentada del Nuevo Mundo. ¿Cuál es su nombre?",
      hint: "Su nombre rinde homenaje a las mujeres de la corte virreinal.",
      difficulty: "easy",
    },
    // Spawn: north of Parque Colón, on Arzobispo Meriño heading east
    lat: 18.47420,
    lng: -69.88380,
    heading: 90,
    pitch: 0,
    // Target: Calle Las Damas (verified — near Museo Casas Reales)
    targetLat: 18.47580,
    targetLng: -69.88220,
    correctAnswers: [
      "las damas",
      "calle las damas",
      "calle de las damas",
    ],
    explanation:
      "La Calle Las Damas, construida en 1502, es la primera calle pavimentada de América. Debe su nombre a las damas de la corte de María de Toledo.",
  },
  {
    id: "level-3",
    number: 3,
    title: "El Palacio del Virrey",
    clue: {
      text: "Frente a la Plaza España se alza el palacio que construyó el hijo del Almirante. ¿Cuántos arcos tiene su fachada principal en el nivel superior?",
      hint: "Mira con atención la loggia del segundo piso.",
      difficulty: "easy",
    },
    // Spawn: Calle Las Damas heading north toward Plaza España
    lat: 18.47550,
    lng: -69.88260,
    heading: 0,
    pitch: 0,
    // Target: Alcázar de Colón (verified Wikipedia)
    targetLat: 18.47750,
    targetLng: -69.88280,
    correctAnswers: ["5", "cinco", "five"],
    explanation:
      "El Alcázar de Colón, construido por Diego Colón en 1510, tiene 5 arcos en su loggia superior. Fue sede del gobierno colonial.",
  },
  {
    id: "level-4",
    number: 4,
    title: "La Primada de América",
    clue: {
      text: "La catedral más antigua de América guarda secretos en su piedra. En su fachada principal, ¿qué estilo arquitectónico predomina: gótico, barroco o plateresco?",
      hint: "Observa las columnas y ornamentos de la entrada — recuerdan al trabajo de los plateros.",
      difficulty: "medium",
    },
    // Spawn: Plaza España area, heading south-west toward Catedral
    lat: 18.47690,
    lng: -69.88320,
    heading: 225,
    pitch: 0,
    // Target: Catedral Primada de América (verified Wikipedia)
    targetLat: 18.47303,
    targetLng: -69.88394,
    correctAnswers: ["plateresco", "plateresque"],
    explanation:
      "La Catedral Primada de América (1512-1540) combina elementos góticos con una fachada predominantemente plateresca, estilo español del Renacimiento.",
  },
  {
    id: "level-5",
    number: 5,
    title: "La Fortaleza",
    clue: {
      text: "La fortaleza más antigua de América vigila la desembocadura del río Ozama. ¿Cómo se llama su torre principal, que también es la estructura militar más antigua del continente?",
      hint: "La torre lleva el nombre de un acto de sumisión feudal.",
      difficulty: "medium",
    },
    // Spawn: Panteón Nacional area, heading south-east toward Fortaleza
    lat: 18.47513,
    lng: -69.88316,
    heading: 135,
    pitch: 0,
    // Target: Fortaleza Ozama (verified Wikipedia)
    targetLat: 18.47320,
    targetLng: -69.88170,
    correctAnswers: [
      "torre del homenaje",
      "homenaje",
      "torre homenaje",
    ],
    explanation:
      "La Torre del Homenaje (1503-1507) es la estructura militar más antigua de América, construida dentro de la Fortaleza Ozama por Nicolás de Ovando.",
  },
  {
    id: "level-6",
    number: 6,
    title: "El Panteón",
    clue: {
      text: "En el antiguo templo de los jesuitas, convertido en santuario de los héroes nacionales, un objeto peculiar cuelga del centro de la nave. ¿Qué es?",
      hint: "Es un obsequio del gobierno de España, y nunca deja de arder.",
      difficulty: "medium",
    },
    // Spawn: near Fortaleza Ozama, heading north-west toward Panteón
    lat: 18.47350,
    lng: -69.88200,
    heading: 315,
    pitch: 0,
    // Target: Panteón Nacional (verified Wikipedia)
    targetLat: 18.47513,
    targetLng: -69.88316,
    correctAnswers: [
      "lampara",
      "lámpara",
      "llama eterna",
      "llama",
      "lampara eterna",
      "lámpara eterna",
    ],
    explanation:
      "En el centro del Panteón Nacional cuelga una lámpara/llama eterna, donada por el gobierno español, como símbolo de los héroes dominicanos.",
  },
  {
    id: "level-7",
    number: 7,
    title: "El Paseo Peatonal",
    clue: {
      text: "La arteria comercial más famosa de la Zona Colonial es hoy un paseo peatonal vibrante. Comienza en la Puerta del Conde y termina en el Parque Colón. ¿Cómo se llama?",
      hint: "Su nombre evoca a un título nobiliario.",
      difficulty: "medium",
    },
    // Spawn: Panteón area, heading south toward Calle El Conde
    lat: 18.47500,
    lng: -69.88350,
    heading: 225,
    pitch: 0,
    // Target: Calle El Conde, middle section
    targetLat: 18.47280,
    targetLng: -69.88650,
    correctAnswers: [
      "el conde",
      "calle el conde",
      "conde",
      "calle conde",
    ],
    explanation:
      "La Calle El Conde, peatonal desde 1975, conecta la Puerta del Conde con el Parque Colón. Es el corazón comercial de la zona histórica.",
  },
  {
    id: "level-8",
    number: 8,
    title: "Las Casas del Rey",
    clue: {
      text: "Este edificio albergaba la Real Audiencia y la Capitanía General. Hoy es un museo. En su patio hay un instrumento astronómico que marcaba las horas con la sombra del sol. ¿Qué tipo de instrumento es?",
      hint: "Los romanos ya los usaban. No tiene engranajes ni agujas.",
      difficulty: "hard",
    },
    // Spawn: on Calle El Conde heading east toward Casas Reales
    lat: 18.47300,
    lng: -69.88600,
    heading: 45,
    pitch: 0,
    // Target: Museo de las Casas Reales (verified Wikipedia)
    targetLat: 18.47580,
    targetLng: -69.88316,
    correctAnswers: [
      "reloj de sol",
      "reloj solar",
      "sundial",
      "gnomon",
    ],
    explanation:
      "El Museo de las Casas Reales conserva un reloj de sol en su patio central, herencia de la administración colonial española.",
  },
  {
    id: "level-9",
    number: 9,
    title: "Las Ruinas Sagradas",
    clue: {
      text: "Las ruinas de un monasterio se alzan como esqueleto de piedra. Fue el primer monasterio de su orden religiosa en el Nuevo Mundo. ¿De qué orden se trata?",
      hint: "Su fundador llevaba el nombre de la ciudad italiana de Asís.",
      difficulty: "hard",
    },
    // Spawn: near Museo Casas Reales, heading north-west toward Monasterio
    lat: 18.47550,
    lng: -69.88350,
    heading: 315,
    pitch: 0,
    // Target: Monasterio de San Francisco (verified Wikipedia)
    targetLat: 18.47694,
    targetLng: -69.88567,
    correctAnswers: [
      "franciscana",
      "franciscanos",
      "san francisco",
      "orden franciscana",
      "franciscan",
    ],
    explanation:
      "El Monasterio de San Francisco (1508) fue el primero de la Orden Franciscana en América. Hoy solo quedan sus ruinas.",
  },
  {
    id: "level-10",
    number: 10,
    title: "La Puerta de la Independencia",
    clue: {
      text: "Frente a esta puerta de la antigua muralla se proclamó la independencia dominicana. ¿En qué año exacto ocurrió este evento histórico?",
      hint: "Fue en la primera mitad del siglo XIX, en el mes de febrero.",
      difficulty: "hard",
    },
    // Spawn: on Calle El Conde, west section, heading west toward Puerta
    lat: 18.47280,
    lng: -69.88750,
    heading: 250,
    pitch: 0,
    // Target: Puerta del Conde (verified Wikipedia)
    targetLat: 18.47140,
    targetLng: -69.89170,
    correctAnswers: ["1844"],
    explanation:
      "El 27 de febrero de 1844, frente a la Puerta del Conde, se proclamó la independencia de la República Dominicana por Juan Pablo Duarte y los Trinitarios.",
  },
  {
    id: "level-11",
    number: 11,
    title: "La Plaza del Almirante",
    clue: {
      text: "En la plaza frente al Alcázar, un ancla gigante reposa como reliquia marina. ¿De qué material está hecha esta ancla monumental?",
      hint: "Es un metal que se oxida con el tiempo y adquiere un tono rojizo.",
      difficulty: "extreme",
    },
    // Spawn: Panteón Nacional area, heading north-east toward Plaza España
    lat: 18.47513,
    lng: -69.88400,
    heading: 45,
    pitch: 0,
    // Target: Plaza España (verified Wikipedia)
    targetLat: 18.47690,
    targetLng: -69.88320,
    correctAnswers: [
      "hierro",
      "hierro forjado",
      "iron",
      "metal",
      "acero",
    ],
    explanation:
      "La Plaza España exhibe un ancla de hierro forjado como homenaje a la tradición naval de la era colonial.",
  },
  {
    id: "level-12",
    number: 12,
    title: "El Tesoro Final",
    clue: {
      text: "Has recorrido la ciudad más antigua del Nuevo Mundo. Para reclamar el tesoro, responde: ¿en qué año fue fundada la ciudad de Santo Domingo por Bartolomé Colón?",
      hint: "Fue antes de 1500, durante el segundo viaje de los Colón.",
      difficulty: "extreme",
    },
    // Spawn: Plaza España, heading south toward Parque Colón (full circle)
    lat: 18.47690,
    lng: -69.88320,
    heading: 200,
    pitch: 0,
    // Target: Parque Colón — Columbus statue (verified, full circle)
    targetLat: 18.47348,
    targetLng: -69.88399,
    correctAnswers: ["1498", "1496"],
    explanation:
      "Santo Domingo fue fundada en 1498 (algunos historiadores dicen 1496) por Bartolomé Colón, convirtiéndola en el primer asentamiento europeo permanente de América.",
  },
];
