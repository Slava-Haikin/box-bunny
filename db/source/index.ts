import { DatabaseConnector } from "./db-connector";

const db = new DatabaseConnector('mealprep');

export { 
    DatabaseConnector,
    db,
 };