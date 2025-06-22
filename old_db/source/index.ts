import { DatabaseConnector } from "./connector";

const db = new DatabaseConnector('mealprep.db');

export { 
    DatabaseConnector,
    db,
 };