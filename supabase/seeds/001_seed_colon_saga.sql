-- Seed: Saga de Colón — Zona Colonial, Santo Domingo
-- Run in Supabase SQL Editor

DO $$
DECLARE
  admin_id UUID;
  saga_id UUID;
BEGIN
  SELECT id INTO admin_id FROM profiles WHERE role = 'admin' LIMIT 1;
  
  IF admin_id IS NULL THEN
    RAISE EXCEPTION 'No admin user found. Register and set role to admin first.';
  END IF;

  INSERT INTO sagas (id, title, description, city, country, difficulty, is_active, is_featured, total_levels, estimated_duration, created_by)
  VALUES (
    gen_random_uuid(),
    'Saga de Colón',
    'Recorre la ciudad más antigua del Nuevo Mundo. 12 acertijos te esperan entre calles empedradas, fortalezas centenarias y secretos coloniales.',
    'Santo Domingo',
    'DO',
    'medium',
    true,
    true,
    12,
    40,
    admin_id
  )
  RETURNING id INTO saga_id;

  INSERT INTO levels (saga_id, level_number, title, description, clue, answer, answer_type, spawn_lat, spawn_lng, target_lat, target_lng, proximity_radius, points, hints) VALUES
  (saga_id, 1, 'El Descubridor',
   'Un explorador de bronce señala al horizonte desde el Parque Colón.',
   'En el corazón de la Zona Colonial, un explorador de bronce señala al horizonte desde su pedestal. ¿A quién representa esta estatua?',
   'cristobal colon', 'text',
   18.47310, -69.88620, 18.47348, -69.88399, 50, 100,
   '["Llegó a estas tierras en 1492 con tres carabelas.", "Busca el parque principal de la Zona Colonial.", "La estatua está en el Parque Colón."]'),

  (saga_id, 2, 'La Primera Calle',
   'La calle más antigua del Nuevo Mundo.',
   'Caminas sobre piedras que llevan más de 500 años. Esta calle fue la primera pavimentada del Nuevo Mundo. ¿Cuál es su nombre?',
   'calle las damas', 'text',
   18.47420, -69.88380, 18.47580, -69.88220, 50, 100,
   '["Su nombre rinde homenaje a las mujeres de la corte virreinal.", "Está cerca del Alcázar de Colón.", "Calle Las..."]'),

  (saga_id, 3, 'El Palacio del Virrey',
   'El hijo del Almirante construyó un palacio frente a la Plaza España.',
   'Frente a la Plaza España se alza el palacio que construyó el hijo del Almirante. ¿Cuántos arcos tiene su fachada principal en el nivel superior?',
   '5', 'text',
   18.47550, -69.88260, 18.47750, -69.88280, 50, 150,
   '["Mira con atención la loggia del segundo piso.", "El palacio es el Alcázar de Colón.", "Cuenta los arcos: son 5."]'),

  (saga_id, 4, 'La Primada de América',
   'La catedral más antigua de América.',
   'La catedral más antigua de América guarda secretos en su piedra. En su fachada principal, ¿qué estilo arquitectónico predomina: gótico, barroco o plateresco?',
   'plateresco', 'text',
   18.47690, -69.88320, 18.47303, -69.88394, 50, 200,
   '["Observa las columnas y ornamentos de la entrada.", "Recuerdan al trabajo de los plateros.", "El estilo plateresco es español del Renacimiento."]'),

  (saga_id, 5, 'La Fortaleza',
   'La fortaleza más antigua de América vigila el río Ozama.',
   'La fortaleza más antigua de América vigila la desembocadura del río Ozama. ¿Cómo se llama su torre principal?',
   'torre del homenaje', 'text',
   18.47513, -69.88316, 18.47320, -69.88170, 50, 200,
   '["La torre lleva el nombre de un acto de sumisión feudal.", "Está dentro de la Fortaleza Ozama.", "Torre del Homenaje."]'),

  (saga_id, 6, 'El Panteón',
   'Antiguo templo jesuita, hoy santuario de héroes nacionales.',
   'En el antiguo templo de los jesuitas, convertido en santuario de los héroes nacionales, un objeto peculiar cuelga del centro de la nave. ¿Qué es?',
   'llama eterna', 'text',
   18.47350, -69.88200, 18.47513, -69.88316, 50, 250,
   '["Es un obsequio del gobierno de España.", "Nunca deja de arder.", "Es una lámpara o llama eterna."]'),

  (saga_id, 7, 'El Paseo Peatonal',
   'La arteria comercial más famosa de la Zona Colonial.',
   'La arteria comercial más famosa de la Zona Colonial es hoy un paseo peatonal vibrante. Comienza en la Puerta del Conde y termina en el Parque Colón. ¿Cómo se llama?',
   'calle el conde', 'text',
   18.47500, -69.88350, 18.47280, -69.88650, 50, 250,
   '["Su nombre evoca a un título nobiliario.", "Es una calle peatonal.", "Calle El Conde."]'),

  (saga_id, 8, 'Las Casas del Rey',
   'Antiguo palacio de la Real Audiencia, hoy museo.',
   'Este edificio albergaba la Real Audiencia. En su patio hay un instrumento que marcaba las horas con la sombra del sol. ¿Qué tipo de instrumento es?',
   'reloj de sol', 'text',
   18.47300, -69.88600, 18.47580, -69.88316, 50, 300,
   '["Los romanos ya los usaban.", "No tiene engranajes ni agujas.", "Es un reloj de sol."]'),

  (saga_id, 9, 'Las Ruinas Sagradas',
   'Primer monasterio de su orden religiosa en América.',
   'Las ruinas de un monasterio se alzan como esqueleto de piedra. Fue el primer monasterio de su orden en el Nuevo Mundo. ¿De qué orden se trata?',
   'franciscana', 'text',
   18.47550, -69.88350, 18.47694, -69.88567, 50, 350,
   '["Su fundador llevaba el nombre de Asís.", "San Francisco de Asís.", "Orden Franciscana."]'),

  (saga_id, 10, 'La Puerta de la Independencia',
   'Frente a esta puerta se proclamó la independencia dominicana.',
   'Frente a esta puerta de la antigua muralla se proclamó la independencia dominicana. ¿En qué año exacto ocurrió?',
   '1844', 'text',
   18.47280, -69.88750, 18.47140, -69.89170, 50, 400,
   '["Fue en la primera mitad del siglo XIX.", "En el mes de febrero.", "27 de febrero de 1844."]'),

  (saga_id, 11, 'La Plaza del Almirante',
   'Un ancla gigante reposa en la plaza frente al Alcázar.',
   'En la plaza frente al Alcázar, un ancla gigante reposa como reliquia marina. ¿De qué material está hecha?',
   'hierro', 'text',
   18.47513, -69.88400, 18.47690, -69.88320, 50, 450,
   '["Es un metal que se oxida.", "Adquiere un tono rojizo.", "Hierro forjado."]'),

  (saga_id, 12, 'El Tesoro Final',
   'Has recorrido la ciudad más antigua del Nuevo Mundo.',
   'Para reclamar el tesoro: ¿en qué año fue fundada Santo Domingo por Bartolomé Colón?',
   '1498', 'text',
   18.47690, -69.88320, 18.47348, -69.88399, 50, 500,
   '["Fue antes de 1500.", "Durante el segundo viaje de los Colón.", "1498 (algunos dicen 1496)."]');

  RAISE NOTICE 'Saga de Colón created with ID: %', saga_id;
END $$;
