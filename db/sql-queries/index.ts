const SQL_QUERIES = {
    createRecipesTable: `
        CREATE TABLE IF NOT EXISTS recipes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,                                              -- Уникальный идентификатор рецепта
            title TEXT NOT NULL,                                                               -- Название рецепта
            description TEXT NOT NULL,                                                         -- Описание рецепта
            instructions TEXT NOT NULL,                                                        -- Инструкции по приготовлению рецепта
            meal_type CHECK(meal_type IN ('breakfast', 'brunch', 'lunch', 'snack', 'dinner')), -- Тип блюда (например, завтрак, ужин)
            cook_time INTEGER,                                                                 -- Время на приготовление (в минутах)
            servings INTEGER DEFAULT 1,                                                        -- Количество порций, по умолчанию 1
            iamge_url TEXT,                                                                    -- Ссылка на изображение (опечатка в "iamge_url" на "image_url")
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
    createRecipeIngredientsTable: `
        CREATE TABLE IF NOT EXISTS recipe_ingredients (
            recipe_id INTEGER,                                                       -- ID рецепта (ссылается на таблицу recipes)
            ingredient_id INTEGER,                                                   -- ID ингредиента (ссылается на таблицу ingredients)
            quantity TEXT,                                                           -- Количество ингредиента (например, "200g", "1 piece")
            PRIMARY KEY (recipe_id, ingredient_id),                                  -- Первичный ключ состоит из двух столбцов (recipe_id и ingredient_id)
            FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,        -- Внешний ключ, который ссылается на таблицу recipes
            FOREIGN KEY (ingredient_id) REFERENCES ingredients(id) ON DELETE CASCADE -- Внешний ключ, который ссылается на таблицу ingredients
        );
    `,
}

export default SQL_QUERIES;