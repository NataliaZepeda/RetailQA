-- ============================================================
-- RetailQA - Datos de ejemplo AMPLIADOS (catálogo con imágenes)
-- Ejecutar DESPUÉS de schema.sql, EN VEZ de un seed.sql anterior
-- (si es instalación nueva), o usar db/actualizar-catalogo.sql si
-- el sitio ya está desplegado y quieres agregar sin perder pedidos.
-- ============================================================

INSERT INTO retailqa_categorias (nombre) VALUES
  ('Electrónica'),
  ('Hogar'),
  ('Deportes'),
  ('Vestuario'),
  ('Belleza'),
  ('Mascotas');

INSERT INTO retailqa_productos (nombre, descripcion, precio, stock, categoria_id, imagen_url) VALUES
  -- Electrónica
  ('Audífonos Bluetooth', 'Audífonos inalámbricos con cancelación de ruido.', 24990, 35,
    (SELECT id FROM retailqa_categorias WHERE nombre = 'Electrónica'), 'https://commons.wikimedia.org/wiki/Special:FilePath/Havit_H600BT_Bluetooth_Foldable_Headphone.jpg?width=600'),
  ('Smartwatch Fit', 'Reloj inteligente con monitor de ritmo cardíaco.', 39990, 20,
    (SELECT id FROM retailqa_categorias WHERE nombre = 'Electrónica'), 'https://commons.wikimedia.org/wiki/Special:FilePath/Fitness_Tracking_Smartwatch.jpg?width=600'),
  ('Parlante Portátil Bluetooth', 'Sonido 360° resistente al agua, 12 horas de batería.', 29990, 22,
    (SELECT id FROM retailqa_categorias WHERE nombre = 'Electrónica'), 'https://commons.wikimedia.org/wiki/Special:FilePath/JBL_Flip_3_bluetooth_speaker_%28DSCF2653%29.jpg?width=600'),
  ('Cargador Rápido USB-C 65W', 'Carga tu notebook y celular al mismo tiempo.', 15990, 4,
    (SELECT id FROM retailqa_categorias WHERE nombre = 'Electrónica'), 'https://commons.wikimedia.org/wiki/Special:FilePath/USB_wall_charger.JPG?width=600'),

  -- Hogar
  ('Set de Ollas Antiadherentes', 'Juego de 5 piezas para cocina.', 32990, 15,
    (SELECT id FROM retailqa_categorias WHERE nombre = 'Hogar'), 'https://commons.wikimedia.org/wiki/Special:FilePath/Hoyang-Polaris_frying_pan.jpg?width=600'),
  ('Lámpara LED Escritorio', 'Lámpara regulable con puerto USB.', 12990, 40,
    (SELECT id FROM retailqa_categorias WHERE nombre = 'Hogar'), 'https://commons.wikimedia.org/wiki/Special:FilePath/Concise_bamboo_eye_protection_LED_desk_lamp.jpg?width=600'),
  ('Aromatizador Difusor Ultrasónico', 'Difusor de aceites esenciales con luz LED.', 18990, 30,
    (SELECT id FROM retailqa_categorias WHERE nombre = 'Hogar'), 'https://commons.wikimedia.org/wiki/Special:FilePath/Ultrasonic_humidifier.jpg?width=600'),
  ('Set de Toallas Premium', 'Juego de 4 toallas de algodón egipcio.', 21990, 3,
    (SELECT id FROM retailqa_categorias WHERE nombre = 'Hogar'), 'https://commons.wikimedia.org/wiki/Special:FilePath/Good_morning_towels.jpg?width=600'),

  -- Deportes
  ('Balón de Fútbol N°5', 'Balón oficial para uso en pasto sintético.', 14990, 25,
    (SELECT id FROM retailqa_categorias WHERE nombre = 'Deportes'), 'https://commons.wikimedia.org/wiki/Special:FilePath/Adidas_soccer_ball_on_a_grass_pitch_%28Unsplash%29.jpg?width=600'),
  ('Mancuernas Ajustables 10kg', 'Par de mancuernas con discos intercambiables.', 45990, 12,
    (SELECT id FROM retailqa_categorias WHERE nombre = 'Deportes'), 'https://commons.wikimedia.org/wiki/Special:FilePath/Pair_of_8kg_dumbbells_%28Unsplash%29.jpg?width=600'),
  ('Mat de Yoga Antideslizante', 'Grosor 6mm, incluye correa de transporte.', 16990, 28,
    (SELECT id FROM retailqa_categorias WHERE nombre = 'Deportes'), 'https://commons.wikimedia.org/wiki/Special:FilePath/Yoga_mat.jpg?width=600'),
  ('Bicicleta Urbana Aro 26', 'Bicicleta liviana ideal para ciudad.', 189990, 6,
    (SELECT id FROM retailqa_categorias WHERE nombre = 'Deportes'), 'https://commons.wikimedia.org/wiki/Special:FilePath/Brosen_city_bicycle.jpg?width=600'),

  -- Vestuario
  ('Polerón Unisex', 'Polerón de algodón, tallas S a XL.', 17990, 50,
    (SELECT id FROM retailqa_categorias WHERE nombre = 'Vestuario'), 'https://commons.wikimedia.org/wiki/Special:FilePath/Bookstore_-_Hoodies_for_sale_-_Tulane_University_2008.jpg?width=600'),
  ('Zapatillas Running', 'Zapatillas livianas para running urbano.', 42990, 18,
    (SELECT id FROM retailqa_categorias WHERE nombre = 'Vestuario'), 'https://commons.wikimedia.org/wiki/Special:FilePath/On_Cloud_Running_Shoes.jpg?width=600'),
  ('Mochila Impermeable 25L', 'Ideal para notebook y uso diario.', 27990, 24,
    (SELECT id FROM retailqa_categorias WHERE nombre = 'Vestuario'), 'https://commons.wikimedia.org/wiki/Special:FilePath/School_bag_backpack.jpg?width=600'),
  ('Gorro de Lana', 'Gorro tejido, abrigo para invierno.', 8990, 45,
    (SELECT id FROM retailqa_categorias WHERE nombre = 'Vestuario'), 'https://commons.wikimedia.org/wiki/Special:FilePath/Blue_knit-cap_beanie_by_RobertLender.jpeg?width=600'),

  -- Belleza
  ('Set de Brochas de Maquillaje', 'Kit de 12 brochas profesionales.', 19990, 33,
    (SELECT id FROM retailqa_categorias WHERE nombre = 'Belleza'), 'https://commons.wikimedia.org/wiki/Special:FilePath/Blush_-_A_selection_of_makeup_brushes.jpg?width=600'),
  ('Secador de Pelo Profesional', 'Motor iónico, 3 niveles de temperatura.', 34990, 5,
    (SELECT id FROM retailqa_categorias WHERE nombre = 'Belleza'), 'https://commons.wikimedia.org/wiki/Special:FilePath/Hair_dryer.jpg?width=600'),

  -- Mascotas
  ('Cama para Mascota Ortopédica', 'Espuma viscoelástica, funda lavable.', 25990, 16,
    (SELECT id FROM retailqa_categorias WHERE nombre = 'Mascotas'), 'https://commons.wikimedia.org/wiki/Special:FilePath/Sleeping_black_dog.jpg?width=600'),
  ('Fuente de Agua Automática', 'Filtro de carbón activado, 2 litros.', 22990, 19,
    (SELECT id FROM retailqa_categorias WHERE nombre = 'Mascotas'), 'https://placehold.co/600x450/C4841F/FAF7F1?font=roboto&text=Fuente+de+Agua+Autom%C3%A1tica');
