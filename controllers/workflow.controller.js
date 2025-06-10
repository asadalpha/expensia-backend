import dayjs from "dayjs";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { serve } = require("@upstash/workflow/express");
import Subscription from "../models/subscription.model.js";

const REMINDERS = [7,5,2,1]



export const sendReminders = serve(async (context) => {
  const { subcriptionId } = context.requestPayload;
  console.log("Sending reminders for subscription:", subcriptionId);

  const subscription = await fethcSubscription(context, subcriptionId);

  if (!subscription || !subscription.status !== "active") {
    return;
  }
  const renewalDate = dayjs(subscription.renewalDate);
  if (renewalDate.isBefore(dayjs())) {
    console.log(
      `Subscription ${subcriptionId} has expired, stopping reminders.`
    );
    return;
  }

  for(const daysBefore of REMINDERS) {
    const reminderDate = renewalDate.subtract(daysBefore, "day");
    if(reminderDate.isAfter(dayjs())) {
        await sleepUntillReminder(context, `${daysBefore} days before`, reminderDate);
        await triggerReminder(context, `${daysBefore} days before`);
    }
  }
});

const fethcSubscription = async (context, subcriptionId) => {
  return await context.run("get subscription", () => {
    return Subscription.findById(subcriptionId).populate("user", "name email");
  });
};

const sleepUntillReminder = async (context,label,date) => {
 console.log(`Sleeping untill ${label} reminder at ${date}`);
 await context.sleepUntill(label,date.toDate());
}

const triggerReminder = async (context,label) =>{
    return await context.run(label,()=>{
        console.log(`Triggering ${label} reminder`);
        // send reminder logic here
    })
}