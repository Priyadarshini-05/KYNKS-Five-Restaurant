import Event from "../models/eventModel.js";

export const createEventBooking = async (req, res) => {
  try {
    const { id } = req.user;
    const { eventName, eventType, guestCount, date, time, specialRequests } = req.body;

    if (!eventName || !eventType || !guestCount || !date || !time) {
      return res.status(400).json({
        message: "All fields except special requests are required",
        success: false,
      });
    }

    const event = await Event.create({
      user: id,
      eventName,
      eventType,
      guestCount,
      date,
      time,
      specialRequests,
    });

    res.status(201).json({
      success: true,
      message: "Event booked successfully",
      event,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};

export const getUserEvents = async (req, res) => {
  try {
    const { id } = req.user;
    const events = await Event.find({ user: id }).sort({ createdAt: -1 });
    res.status(200).json({ events, success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};

export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().populate("user", "name email");
    res.status(200).json({ events, success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};

export const updateEventStatus = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { status } = req.body;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event booking not found", success: false });
    }

    event.status = status;
    await event.save();

    res.status(200).json({
      success: true,
      message: "Event status updated",
      event,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};
