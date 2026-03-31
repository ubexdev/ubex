-- Cleanup duplicate Saga de Colón + Seed Punta Cana saga
-- Run in Supabase SQL Editor

DO $$
DECLARE
  admin_id UUID;
  keep_saga_id UUID;
  pc_saga_id UUID;
BEGIN
  SELECT id INTO admin_id FROM profiles WHERE role = 'admin' LIMIT 1;

  IF admin_id IS NULL THEN
    RAISE EXCEPTION 'No admin user found.';
  END IF;

  -- ═══════════════════════════════════════════════════
  -- 1. CLEANUP: Keep only the newest Saga de Colón
  -- ═══════════════════════════════════════════════════
  SELECT id INTO keep_saga_id
    FROM sagas
    WHERE title = 'Saga de Colón'
    ORDER BY created_at DESC
    LIMIT 1;

  IF keep_saga_id IS NOT NULL THEN
    DELETE FROM sagas
      WHERE title = 'Saga de Colón'
        AND id != keep_saga_id;
    RAISE NOTICE 'Kept Saga de Colón: %, deleted duplicates', keep_saga_id;
  END IF;

  -- ═══════════════════════════════════════════════════
  -- 2. SEED: Tesoros del Paraíso — Punta Cana (12 levels)
  -- ═══════════════════════════════════════════════════
  DELETE FROM sagas WHERE title = 'Tesoros del Paraíso';

  INSERT INTO sagas (id, title, description, city, country, difficulty, is_active, is_featured, total_levels, estimated_duration, status, created_by)
  VALUES (
    gen_random_uuid(),
    'Tesoros del Paraíso',
    'Explora las maravillas naturales de Punta Cana y La Altagracia. 12 destinos paradisíacos te esperan.',
    'Punta Cana',
    'DO',
    'medium',
    true,
    true,
    12,
    45,
    'active',
    admin_id
  )
  RETURNING id INTO pc_saga_id;

  INSERT INTO levels (saga_id, number, title, clue_text, hint, difficulty, spawn_lat, spawn_lng, spawn_heading, spawn_pitch, target_lat, target_lng, correct_answers, proximity_radius_m) VALUES
  (pc_saga_id, 1, 'Arena de Cristal',
   'Donde las palmeras besan el mar y la arena brilla como polvo de estrellas, miles de viajeros plantan su sombrilla cada día. Es la postal más célebre del este dominicano.',
   'Está en el corazón de la zona hotelera más grande del Caribe dominicano.',
   'easy', 18.6862, -68.4100, 0, 0, 18.6895, -68.4050,
   '["Playa Bávaro", "playa bavaro", "bavaro"]', 200),

  (pc_saga_id, 2, 'La Fe de Higüey',
   'Un arco de concreto se eleva como manos en oración en la ciudad ganadera del este. Dentro guarda la imagen más venerada del país, patrona de toda la nación. El 21 de enero, miles peregrinan hasta aquí.',
   'No está en la costa — búscala en la ciudad principal de la provincia La Altagracia.',
   'easy', 18.6135, -68.7050, 0, 0, 18.6153, -68.7079,
   '["Basílica Nuestra Señora de la Altagracia", "basilica altagracia", "basilica de higuey", "basilica"]', 150),

  (pc_saga_id, 3, 'Puerto de Lujo',
   'Yates blancos descansan en aguas calmas, rodeados de palmeras y restaurantes elegantes. Este puerto deportivo pertenece al desarrollo turístico más lujoso al sur de Punta Cana.',
   'Está dentro de un complejo turístico privado al sur del aeropuerto de Punta Cana.',
   'medium', 18.5225, -68.3710, 0, 0, 18.5178, -68.3681,
   '["Cap Cana Marina", "marina cap cana", "cap cana"]', 200),

  (pc_saga_id, 4, 'La Playa Virgen',
   'Al norte de los resorts, donde las olas rompen con fuerza y los buggies levantan arena, se extiende una playa sin cadenas hoteleras. Los surfistas la prefieren por su oleaje constante.',
   'Es la playa más al norte de la zona turística de Bávaro-Punta Cana.',
   'medium', 18.7095, -68.4525, 0, 0, 18.7168, -68.4470,
   '["Playa Macao", "playa macao", "macao"]', 250),

  (pc_saga_id, 5, 'El Ojo del Cenote',
   'Al fondo de un acantilado cubierto de enredaderas, un ojo de agua azul turquesa espera a los valientes que descienden por la escalera. Su agua dulce contrasta con el mar cercano.',
   'Se encuentra dentro de un parque de aventuras en Cap Cana.',
   'medium', 18.5108, -68.3730, 0, 0, 18.5062, -68.3748,
   '["Hoyo Azul", "hoyo azul"]', 150),

  (pc_saga_id, 6, 'La Aldea del Artista',
   'Sobre un acantilado, una aldea de piedra parece trasplantada del Mediterráneo. Su anfiteatro ha recibido a Frank Sinatra y Sting. Mira hacia abajo: el río serpentea entre la vegetación tropical.',
   'No está en Punta Cana — búscala cerca de La Romana, al lado del río.',
   'medium', 18.4240, -68.9520, 0, 0, 18.4270, -68.9490,
   '["Altos de Chavón", "altos de chavon", "chavon"]', 200),

  (pc_saga_id, 7, 'El Secreto de los Pescadores',
   'Dentro del complejo más exclusivo del este, se esconde una playa que solía pertenecer solo a los pescadores. Arena fina, aguas color esmeralda y un restaurante de paella frente al mar.',
   'Está dentro de Cap Cana, pero más al este que la marina.',
   'hard', 18.5110, -68.3620, 0, 0, 18.5070, -68.3590,
   '["Playa Juanillo", "playa juanillo", "juanillo"]', 200),

  (pc_saga_id, 8, 'Ecos Taínos',
   'Bajo la carretera que une dos ciudades, un mundo subterráneo guarda el arte de los primeros habitantes. Rostros tallados en roca, estalactitas como cortinas y un silencio que habla de siglos.',
   'Está entre San Pedro de Macorís y La Romana, justo al lado de la autopista.',
   'hard', 18.4340, -69.0670, 0, 0, 18.4316, -69.0642,
   '["Cueva de las Maravillas", "cueva de las maravillas", "cueva maravillas"]', 200),

  (pc_saga_id, 9, 'Ojos en la Selva',
   'Doce lagunas de agua dulce se ocultan entre árboles centenarios, como ojos que miran al cielo desde el bosque. Los taínos ya las conocían. Solo en algunas está permitido bañarse.',
   'Está dentro de la propiedad del Puntacana Resort & Club, a pocos kilómetros del aeropuerto.',
   'hard', 18.5235, -68.3785, 0, 0, 18.5195, -68.3725,
   '["Indigenous Eyes Ecological Park", "ojos indigenas", "indigenous eyes", "parque ojos indigenas"]', 250),

  (pc_saga_id, 10, 'Puerta a la Isla',
   'Desde este pequeño pueblo de pescadores parten las lanchas hacia una isla paradisíaca donde las estrellas de mar tapizan el fondo. Es la puerta de entrada al parque nacional más visitado del país.',
   'Está al suroeste de Punta Cana, en la provincia La Altagracia, junto al mar.',
   'hard', 18.3680, -68.8400, 0, 0, 18.3648, -68.8370,
   '["Bayahíbe", "bayahibe"]', 200),

  (pc_saga_id, 11, 'La Luz del Cabo',
   'En la punta más meridional del complejo de lujo, una torre vigía marca el límite entre tierra y mar abierto. Desde aquí, en días claros, el horizonte revela el canal que separa esta isla de la vecina Borinquen.',
   'Está en Cap Cana, pero en su extremo más al sur, lejos de la marina.',
   'extreme', 18.5025, -68.3665, 0, 0, 18.4982, -68.3638,
   '["Faro de Cap Cana", "faro cap cana", "faro de cap cana"]', 200),

  (pc_saga_id, 12, 'El Tesoro Escondido',
   'Donde el río más largo del este besa el mar Caribe, un pueblo diminuto se aferra a los acantilados. Cuevas, farallones y una tranquilidad que el turismo aún no ha conquistado.',
   'Está en la costa sur de La Altagracia, lejos de las zonas turísticas.',
   'extreme', 18.3670, -68.6230, 0, 0, 18.3630, -68.6190,
   '["Boca de Yuma", "boca de yuma"]', 250);

  RAISE NOTICE 'Punta Cana saga created with ID: %', pc_saga_id;
END $$;
