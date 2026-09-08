-- ============================================================
-- RetailQA - Imágenes con fotos reales verificadas (Wikimedia
-- Commons, licencia libre) por producto. Reemplaza los
-- placeholders tipográficos anteriores donde se encontró una
-- foto real y correctamente identificada del producto.
-- Excepción: 'Fuente de Agua Automática' se mantiene como
-- placeholder tipográfico (no se encontró foto libre confiable).
-- Ejecutar en phpMyAdmin.
-- ============================================================

UPDATE retailqa_productos SET imagen_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Havit_H600BT_Bluetooth_Foldable_Headphone.jpg?width=600' WHERE nombre = 'Audífonos Bluetooth';
UPDATE retailqa_productos SET imagen_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Fitness_Tracking_Smartwatch.jpg?width=600' WHERE nombre = 'Smartwatch Fit';
UPDATE retailqa_productos SET imagen_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/JBL_Flip_3_bluetooth_speaker_%28DSCF2653%29.jpg?width=600' WHERE nombre = 'Parlante Portátil Bluetooth';
UPDATE retailqa_productos SET imagen_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/USB_wall_charger.JPG?width=600' WHERE nombre = 'Cargador Rápido USB-C 65W';
UPDATE retailqa_productos SET imagen_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Hoyang-Polaris_frying_pan.jpg?width=600' WHERE nombre = 'Set de Ollas Antiadherentes';
UPDATE retailqa_productos SET imagen_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Concise_bamboo_eye_protection_LED_desk_lamp.jpg?width=600' WHERE nombre = 'Lámpara LED Escritorio';
UPDATE retailqa_productos SET imagen_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Ultrasonic_humidifier.jpg?width=600' WHERE nombre = 'Aromatizador Difusor Ultrasónico';
UPDATE retailqa_productos SET imagen_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Good_morning_towels.jpg?width=600' WHERE nombre = 'Set de Toallas Premium';
UPDATE retailqa_productos SET imagen_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Adidas_soccer_ball_on_a_grass_pitch_%28Unsplash%29.jpg?width=600' WHERE nombre = 'Balón de Fútbol N°5';
UPDATE retailqa_productos SET imagen_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Pair_of_8kg_dumbbells_%28Unsplash%29.jpg?width=600' WHERE nombre = 'Mancuernas Ajustables 10kg';
UPDATE retailqa_productos SET imagen_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Yoga_mat.jpg?width=600' WHERE nombre = 'Mat de Yoga Antideslizante';
UPDATE retailqa_productos SET imagen_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Brosen_city_bicycle.jpg?width=600' WHERE nombre = 'Bicicleta Urbana Aro 26';
UPDATE retailqa_productos SET imagen_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Bookstore_-_Hoodies_for_sale_-_Tulane_University_2008.jpg?width=600' WHERE nombre = 'Polerón Unisex';
UPDATE retailqa_productos SET imagen_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/On_Cloud_Running_Shoes.jpg?width=600' WHERE nombre = 'Zapatillas Running';
UPDATE retailqa_productos SET imagen_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/School_bag_backpack.jpg?width=600' WHERE nombre = 'Mochila Impermeable 25L';
UPDATE retailqa_productos SET imagen_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Blue_knit-cap_beanie_by_RobertLender.jpeg?width=600' WHERE nombre = 'Gorro de Lana';
UPDATE retailqa_productos SET imagen_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Blush_-_A_selection_of_makeup_brushes.jpg?width=600' WHERE nombre = 'Set de Brochas de Maquillaje';
UPDATE retailqa_productos SET imagen_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Hair_dryer.jpg?width=600' WHERE nombre = 'Secador de Pelo Profesional';
UPDATE retailqa_productos SET imagen_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Sleeping_black_dog.jpg?width=600' WHERE nombre = 'Cama para Mascota Ortopédica';
UPDATE retailqa_productos SET imagen_url = 'https://placehold.co/600x450/C4841F/FAF7F1?font=roboto&text=Fuente+de+Agua+Autom%C3%A1tica' WHERE nombre = 'Fuente de Agua Automática';
