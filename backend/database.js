import sqlite3 from "sqlite3";

import { open } from "sqlite";

export async function connectDB() {
   const db= await open({
    filename:"./taskflow.db",
    driver:sqlite3.Database,
   });


    await db.exec( `

        CREATE TABLE IF NOT EXISTS users(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
        );

        
    

        CREATE TABLE IF NOT EXISTS tasks(
        id   INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        title   TEXT NOT NULL,
        description TEXT,
        category TEXT CHECK( category IN ('work', 'personal','study')),
        priority    TEXT CHECK (priority IN ('high','medium','low')),
        due_date    TEXT,
        is_done     INTEGER DEFAULT 0,
        created_at  TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );

        `) ;

        console.log("Database Ready");
        return db;


    
}
