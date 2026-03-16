import { sendTaskReminderEmail } from "./mailer.js";


const sentReminders = new Set();

export function startReminderScheduler(db) {
  console.log(" Reminder scheduler started");

  
  setInterval(async () => {
    try {
      await checkAndSendReminders(db);
    } catch (err) {
      console.error("Reminder scheduler error:", err);
    }
  }, 60 * 1000); 


  checkAndSendReminders(db);
}

async function checkAndSendReminders(db) {
  const now = new Date();


  const localDate = now.toLocaleDateString('en-CA'); 
  const localHours = now.getHours().toString().padStart(2, '0');
  const localMinutes = now.getMinutes().toString().padStart(2, '0');
  const currentTime = `${localHours}:${localMinutes}`; 


  const fiveMinLater = new Date(now.getTime() + 5 * 60 * 1000);
  const fiveMinDate = fiveMinLater.toLocaleDateString('en-CA');
  const fiveMinHours = fiveMinLater.getHours().toString().padStart(2, '0');
  const fiveMinMinutes = fiveMinLater.getMinutes().toString().padStart(2, '0');
  const fiveMinTime = `${fiveMinHours}:${fiveMinMinutes}`;


  const tasks = await db.all(`
    SELECT tasks.*, users.email, users.name as user_name
    FROM tasks
    JOIN users ON tasks.user_id = users.id
    WHERE tasks.is_done = 0
    AND tasks.due_time IS NOT NULL
    AND tasks.due_time != ''
    AND (
      (tasks.due_date = ? AND tasks.due_time = ?)
      OR
      (tasks.due_date = ? AND tasks.due_time = ?)
    )
  `, [localDate, currentTime, fiveMinDate, fiveMinTime]);

  for (const task of tasks) {
    const taskDateTime = `${task.due_date} ${task.due_time}`;

   
    const isExactTime = task.due_date === localDate && task.due_time === currentTime;
    const isFiveMinWarning = task.due_date === fiveMinDate && task.due_time === fiveMinTime;

    if (isExactTime) {
      const key = `${task.id}-0`;
      if (!sentReminders.has(key)) {
        sentReminders.add(key);
        console.log(` Sending ON-TIME reminder for task: "${task.title}" to ${task.email}`);
        await sendTaskReminderEmail(task.email, task, 0);
      }
    }

    if (isFiveMinWarning) {
      const key = `${task.id}-5`;
      if (!sentReminders.has(key)) {
        sentReminders.add(key);
        console.log(` Sending 5-MIN reminder for task: "${task.title}" to ${task.email}`);
        await sendTaskReminderEmail(task.email, task, 5);
      }
    }
  }
}


setInterval(() => {
  sentReminders.clear();
  console.log("🧹 Cleared reminder cache");
}, 60 * 60 * 1000);