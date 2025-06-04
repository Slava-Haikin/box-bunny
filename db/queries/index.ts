const SQL_QUERIES = {
    seedData: {
        createRecipesTable: `
            CREATE TABLE IF NOT EXISTS recipes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,                                              -- Уникальный идентификатор рецепта
                title TEXT NOT NULL,                                                               -- Название рецепта
                description TEXT NOT NULL,                                                         -- Описание рецепта
                instructions TEXT NOT NULL,                                                        -- Инструкции по приготовлению рецепта
                meal_type CHECK(meal_type IN ('breakfast', 'brunch', 'lunch', 'snack', 'dinner')), -- Тип блюда (например, завтрак, ужин)
                cook_time INTEGER,                                                                 -- Время на приготовление (в минутах)
                servings INTEGER DEFAULT 1,                                                        -- Количество порций, по умолчанию 1
                image_url TEXT,                                                                    -- Ссылка на изображение (опечатка в "iamge_url" на "image_url")
                tags TEXT CHECK(tags IN ('gluten free', 'vegetarian', 'vegan')),                   -- Теги для рецепта (например, "gluten free", "vegetarian")
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,                                     -- Дата создания рецепта
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP                                      -- Дата последнего обновления рецепта
            );
        `,
        createIngredientsTable: `
            CREATE TABLE IF NOT EXISTS ingredients (
                id INTEGER PRIMARY KEY AUTOINCREMENT,          -- Уникальный идентификатор
                original TEXT NOT NULL,                        -- Оригинальное имя (например, "pineapples")
                name TEXT NOT NULL,                            -- Название ингредиента
                amount REAL,                                   -- Количество
                unit TEXT,                                     -- Единица измерения
                unit_short TEXT,                               -- Краткая единица измерения
                unit_long TEXT,                                -- Полная единица измерения
                possible_units TEXT,                           -- Множество возможных единиц измерения (можно хранить как строку JSON)
                estimated_cost_value REAL,                     -- Оценочная стоимость в единицах (например, в центрах)
                estimated_cost_unit TEXT,                      -- Единица измерения стоимости (например, "US Cents")
                consistency TEXT,                              -- Консистенция (например, "solid")
                shopping_list_units TEXT,                      -- Единицы измерения для списка покупок (можно хранить как строку JSON)
                aisle TEXT,                                    -- Коридор в магазине (например, "Produce")
                image_url TEXT,                                -- Ссылка на изображение
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP, -- Дата создания рецепта
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP  -- Дата последнего обновления рецепта
            );
        `,
        createRecipesIngredientsTable: `
            CREATE TABLE IF NOT EXISTS recipe_ingredients (
                recipe_id INTEGER,                                                       -- ID рецепта (ссылается на таблицу recipes)
                ingredient_id INTEGER,                                                   -- ID ингредиента (ссылается на таблицу ingredients)
                quantity INTEGER,                                                        -- Количество ингредиента (например, "200g", "1 piece")
                PRIMARY KEY (recipe_id, ingredient_id),                                  -- Первичный ключ состоит из двух столбцов (recipe_id и ingredient_id)
                FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,        -- Внешний ключ, который ссылается на таблицу recipes
                FOREIGN KEY (ingredient_id) REFERENCES ingredients(id) ON DELETE CASCADE -- Внешний ключ, который ссылается на таблицу ingredients
            );
        `,
        insertRecipes: `
            INSERT INTO recipes (title, description, instructions, meal_type, cook_time, servings, image_url, tags)
            VALUES 
                ('Lazy Oatmeal', 'A simple and quick breakfast option.', '1. Add oats to a bowl. 2. Pour milk. 3. Let sit overnight.', 'breakfast', 5, 1, 'oatmeal.jpg', 'vegetarian'),
                ('Kefir with Marshmallows', 'A light snack for afternoon time.', '1. Pour kefir into a glass. 2. Add marshmallows.', 'brunch', 2, 1, 'kefir.jpg', 'vegetarian'),
                ('Buckwheat with Carrots, Onions, Garlic, Ground Chicken Meat, and Tomato Paste', 'A nutritious lunch option with buckwheat and vegetables.', '1. Boil buckwheat. 2. Sauté carrots, onions, and garlic. 3. Add ground chicken meat and tomato paste. 4. Combine with buckwheat.', 'lunch', 30, 2, 'buckwheat.jpg', 'gluten free'),
                ('Mujaddara (Rice with Lentils)', 'A healthy dinner option with rice and lentils.', '1. Boil rice and lentils. 2. Fry onions. 3. Combine with rice and lentils.', 'dinner', 40, 2, 'mujaddara.jpg', 'vegan');
        `,
        insertIngredients: `
            INSERT INTO ingredients (original, name, amount, unit, unit_short, unit_long, possible_units, estimated_cost_value, estimated_cost_unit, consistency, shopping_list_units, aisle, image_url)
            VALUES 
                ('oats', 'oats', 50, 'g', 'g', 'grams', '["g", "cup"]', 100, 'US Cents', 'solid', '["g"]', 'Grocery', 'oats.jpg'),
                ('kefir', 'kefir', 200, 'ml', 'ml', 'milliliters', '["ml", "cup"]', 50, 'US Cents', 'liquid', '["ml"]', 'Dairy', 'kefir.jpg'),
                ('marshmallows', 'marshmallows', 30, 'g', 'g', 'grams', '["g", "piece"]', 80, 'US Cents', 'solid', '["g"]', 'Sweets', 'marshmallows.jpg'),
                ('buckwheat', 'buckwheat', 100, 'g', 'g', 'grams', '["g", "cup"]', 150, 'US Cents', 'solid', '["g"]', 'Grocery', 'buckwheat.jpg'),
                ('carrot', 'carrot', 1, 'g', 'g', 'grams', '["g"]', 40, 'US Cents', 'solid', '["g"]', 'Produce', 'carrot.jpg'),
                ('onion', 'onion', 1, 'g', 'g', 'grams', '["g"]', 30, 'US Cents', 'solid', '["g"]', 'Produce', 'onion.jpg'),
                ('garlic', 'garlic', 2, 'g', 'g', 'grams', '["g"]', 10, 'US Cents', 'solid', '["g"]', 'Produce', 'garlic.jpg'),
                ('minced_meat', 'minced meat', 100, 'g', 'g', 'grams', '["g"]', 250, 'US Cents', 'solid', '["g"]', 'Meat', 'minced_meat.jpg'),
                ('tomato_paste', 'tomato paste', 50, 'g', 'g', 'grams', '["g"]', 40, 'US Cents', 'solid', '["g"]', 'Grocery', 'tomato_paste.jpg'),
                ('rice', 'rice', 100, 'g', 'g', 'grams', '["g", "cup"]', 100, 'US Cents', 'solid', '["g"]', 'Grocery', 'rice.jpg'),
                ('lentils', 'lentils', 100, 'g', 'g', 'grams', '["g", "cup"]', 150, 'US Cents', 'solid', '["g"]', 'Grocery', 'lentils.jpg');
        `,
        insertRecipesIngredients: `
            INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity)
            VALUES 
                (1, 1, '50g'), 
                (2, 2, '200ml'),
                (2, 3, '30g'),
                (3, 4, '100g'),
                (3, 5, '1g'),
                (3, 6, '1g'),
                (3, 7, '2g'),
                (3, 8, '100g'),
                (3, 9, '50g'),
                (4, 10, '100g'),
                (4, 11, '100g');
        `,
    }
}

export default SQL_QUERIES;