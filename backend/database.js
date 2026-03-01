import sqlite3 from "sqlite3";

import { open } from "sqlite";

export async function connectDB() {
   const db= await open({
    filename:"./tasks.db",
    driver:sqlite3.Database,
   });



    await  db.exec(`
        CREATE TABLE IF NOT EXISTS tasks(
        id   INTEGER PRIMARY KEY AUTOINCREMENT,
        title   TEXT NOT NULL,
        description TEXT,
        category TEXT CHECK( category IN ('work', 'personal','study')),
        priority    TEXT CHECK (priority IN ('high','medium','low')),
        due_date    TEXT,
        is_done     INTEGER DEFAULT 0,
        created_at  TEXT DEFAULT CURRENT_TIMESTAMP
        )
        `) ;

        console.log("Database Ready");
        return db;


    
}
