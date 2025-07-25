import { workflowClient } from "../config/upstash.js";
import Subscription from "../models/subscription.model.js";

export const createSubscription = async (req, res, next) => {
  try {
    const subcription = await Subscription.create({
      ...req.body,
      user: req.user._id,
    });

    await workflowClient.trigger(
      {
        url,
        body,
        headers,
        workflowRunId,
        retries,
      },
      {
        url: SERVER_URL,
        body: {
          subcriptionId: subcription.id,
        },
        headers: {
          "Content-Type": "application/json",
        },

        retries: 0,
      }
    );

    res.status(201).json({
      success: true,
      message: "Subscription created successfully",
      data: subcription,
    });
  } catch (err) {
    next(err);
  }
};

export const getUserSubscriptions = async (req, res, next) => {
  try {
    // Check if the user is the same as the one in the token
    if (req.user.id !== req.params.id) {
      const error = new Error("You are not the owner of this account");
      error.status = 401;
      throw error;
    }

    const subscriptions = await Subscription.find({ user: req.params.id });

    res.status(200).json({ success: true, data: subscriptions });
  } catch (e) {
    next(e);
  }
};
