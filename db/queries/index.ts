const SQL_QUERIES = {
    seedData: {
        createRecipesTable: `
            CREATE TABLE IF NOT EXISTS recipes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,                                              -- Уникальный идентификатор рецепта
                title TEXT NOT NULL,                                                               -- Название рецепта
                description TEXT NOT NULL,                                                         -- Описание рецепта
                instructions TEXT NOT NULL,                                                        -- Инструкции по приготовлению рецепта
                meal CHECK(meal IN ('breakfast', 'brunch', 'lunch', 'snack', 'supper')),           -- Тип блюда (например, завтрак, ужин)
                difficulty TEXT CHECK(difficulty IN ('easy', 'medium', 'hard')),                   -- Сложность приготовления
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
            INSERT INTO recipes (title, description, instructions, meal, difficulty, cook_time, servings, image_url, tags)
            VALUES 
                ('Lazy Oatmeal', 'A simple and quick breakfast option.', 'Add oats to a pot and boil it for 10 minutes.; Pour milk, add peanut butter and greek yoghurt.; Let sit overnight.; Add crushed peanuts and chia seeds (optionally)', 'breakfast', 'easy', 5, 1, 'oatmeal.jpg', 'vegetarian'),
                ('Kefir with Marshmallows', 'A light snack for afternoon time.', 'Pour kefir into a glass.; Add one marshmallow.', 'snack', 'easy', 2, 1, 'kefir.jpg', 'vegetarian'),
                ('Buckwheat with Carrots, Onions, Garlic, Ground Chicken Meat, and Tomato Paste', 'A nutritious lunch option with buckwheat and vegetables.', 'Boil buckwheat.; Sauté carrots, onions, and garlic.; Add ground chicken meat and tomato paste, add salt, pepper.; Combine with buckwheat.', 'lunch', 'medium', 30, 2, 'buckwheat.jpg', 'gluten free'),
                ('Mujaddara (Rice with Lentils)', 'A healthy dinner option with rice and lentils.', 'Boil rice and lentils.; Fry onions.; Combine with rice and lentils.', 'supper', 'medium', 40, 2, 'mujaddara.jpg', 'vegan');
        `,
        insertIngredients: `
            INSERT INTO ingredients (original, name, unit, unit_short, unit_long, possible_units, estimated_cost_value, estimated_cost_unit, consistency, shopping_list_units, aisle, image_url)
            VALUES 
                ('oats', 'oats', 'g', 'g', 'grams', '["g", "cup"]', 100, 'US Cents', 'solid', '["g"]', 'Grocery', 'oats.jpg'),
                ('milk', 'milk', 'ml', 'ml', 'milliliters', '["ml", "cup"]', 50, 'US Cents', 'liquid', '["ml"]', 'Dairy', 'kefir.jpg'),
                ('kefir', 'kefir', 'ml', 'ml', 'milliliters', '["ml", "cup"]', 50, 'US Cents', 'liquid', '["ml"]', 'Dairy', 'kefir.jpg'),
                ('marshmallows', 'marshmallows', 'g', 'g', 'grams', '["g", "piece"]', 80, 'US Cents', 'solid', '["g"]', 'Sweets', 'marshmallows.jpg'),
                ('buckwheat', 'buckwheat', 'g', 'g', 'grams', '["g", "cup"]', 150, 'US Cents', 'solid', '["g"]', 'Grocery', 'buckwheat.jpg'),
                ('carrot', 'carrot', 'g', 'g', 'grams', '["g"]', 40, 'US Cents', 'solid', '["g"]', 'Produce', 'carrot.jpg'),
                ('onion', 'onion', 'g', 'g', 'grams', '["g"]', 30, 'US Cents', 'solid', '["g"]', 'Produce', 'onion.jpg'),
                ('garlic', 'garlic', 'g', 'g', 'grams', '["g"]', 10, 'US Cents', 'solid', '["g"]', 'Produce', 'garlic.jpg'),
                ('minced_meat', 'minced meat', 'g', 'g', 'grams', '["g"]', 250, 'US Cents', 'solid', '["g"]', 'Meat', 'minced_meat.jpg'),
                ('tomato_paste', 'tomato paste', 'g', 'g', 'grams', '["g"]', 40, 'US Cents', 'solid', '["g"]', 'Grocery', 'tomato_paste.jpg'),
                ('rice', 'rice', 'g', 'g', 'grams', '["g", "cup"]', 100, 'US Cents', 'solid', '["g"]', 'Grocery', 'rice.jpg'),
                ('lentils', 'lentils', 'g', 'g', 'grams', '["g", "cup"]', 150, 'US Cents', 'solid', '["g"]', 'Grocery', 'lentils.jpg'),
                ('peanut_butter', 'peanut butter', 'g', 'g', 'grams', '["g"]', 150, 'US Cents', 'solid', '["g"]', 'Grocery', 'peanut_butter.jpg'),
                ('greek_yogurt', 'greek yogurt', 'g', 'g', 'grams', '["g"]', 120, 'US Cents', 'solid', '["g"]', 'Dairy', 'greek_yogurt.jpg'),
                ('crushed_peanuts', 'crushed peanuts', 'g', 'g', 'grams', '["g"]', 200, 'US Cents', 'solid', '["g"]', 'Grocery', 'crushed_peanuts.jpg'),
                ('chia_seeds', 'chia seeds', 'g', 'g', 'grams', '["g"]', 250, 'US Cents', 'solid', '["g"]', 'Grocery', 'chia_seeds.jpg');
            `,
        insertRecipesIngredients: `
            INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity)
            VALUES 
                (1, 1, 50),   -- Oats
                (1, 12, 30),  -- Peanut Butter
                (1, 13, 10),  -- Crushed Peanuts
                (1, 14, 5),   -- Chia Seeds
                (1, 2, 200),  -- Milk
                (1, 15, 50),  -- Greek Yogurt

                (2, 3, 200),  -- Kefir
                (2, 4, 50),   -- Marshmallows

                (3, 5, 180),  -- Buckwheat
                (3, 6, 330),  -- Carrot
                (3, 7, 120),  -- Onion
                (3, 8, 40),   -- Garlic
                (3, 9, 100),  -- Minced Meat
                (3, 10, 50),  -- Tomato Paste

                (4, 11, 100), -- Rice
                (4, 12, 100), -- Lentils
                (4, 7, 120);  -- Onion
        `,
    },
    selectRecipes: {
        all: `
            SELECT * FROM recipes;
        `,
        breakfasts: `
            SELECT * FROM recipes WHERE meal = 'breakfast';
        `,
        brunch: `
            SELECT * FROM recipes WHERE meal = 'brunch';
        `,
        lunchs: `
            SELECT * FROM recipes WHERE meal = 'lunch';
        `,
        snacks: `
            SELECT * FROM recipes WHERE meal = 'snack';
        `,
        suppers: `
            SELECT * FROM recipes WHERE meal = 'supper';
        `,
    },
    selectRecipeIngredients: `
        SELECT * FROM ingredients
        INNER JOIN recipe_ingredients
        ON ingredients.id = recipe_ingredients.ingredient_id
        WHERE recipe_ingredients.recipe_id = ?
    `,
}

export default SQL_QUERIES;