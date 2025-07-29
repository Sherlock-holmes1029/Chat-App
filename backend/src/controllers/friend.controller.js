import Friendship from "../models/friendship.model.js";
import FriendRequest from "../models/friendRequests.model.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";

export const getUserFriends = async (req, res) => {
  const userId = req.params.id;
  try {
    const friendships = await Friendship.find({ users: userId });
    const friendIds = friendships.map((f) =>
      f.users.find((id) => id.toString() !== userId)
    );
    const friends = await User.find(
      { _id: { $in: friendIds } },
      "fullName email profilePic"
    );
    res.status(200).json(friends);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const sendFriendRequest = async (req, res) => {
  const from = req.user._id;
  const { to } = req.body;

  try {
    // Look up the user by email
    const toUser = await User.findOne({ email: to });
    if (!toUser) return res.status(404).json({ error: "Recipient not found" });

    if (from.equals(toUser._id)) {
      return res.status(400).json({ error: "Can't friend yourself" });
    }

    // Check if a request already exists
    const existing = await FriendRequest.findOne({
      from,
      to: toUser._id,
      status: "pending",
    });

    if (existing) {
      return res.status(400).json({ error: "Request already sent" });
    }

    // Create friend request
    await FriendRequest.create({ from, to: toUser._id });

    res.status(200).json({ message: "Friend request sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const acceptFriendRequest = async (req, res) => {
  const to = req.user._id;
  const requestId = req.params.id;
  console.log(`Accepting request ${requestId} for user ${to}`);

  try {
    const request = await FriendRequest.findById(requestId);
    if (!request || request.to.toString() !== to.toString()) {
      return res.status(404).json({ error: "Not found" });
    }

    request.status = "accepted";
    await request.save();

    const [user1,user2] = [request.from.toString(), request.to.toString()].sort();
    console.log("Creating friendship with users:", user1, user2);
    const existingFriendship = await Friendship.findOne({ user1, user2 });

    if (existingFriendship) {
      return res.status(400).json({ error: "Friendship already exists." });
    }
    const friendship = await Friendship.create({ user1, user2 });
    console.log("Friendship created:", friendship);

    res.status(200).json({ message: "Friend request accepted" });
  } catch (err) {
    console.error("Error accepting request:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const declineFriendRequest = async (req, res) => {
  const to = req.user._id;
  const requestId = req.params.id;
  try {
    const request = await FriendRequest.findById(requestId);
    if (!request || request.to.toString() !== to.toString())
      return res.status(404).json({ error: "Not found" });
    request.status = "declined";
    await request.save();
    res.status(200).json({ message: "Request declined" });
  } catch {
    res.status(500).json({ error: "Server error" });
  }
};

export const cancelFriendRequest = async (req, res) => {
  const from = req.user._id;
  const requestId = req.params.id;
  try {
    const request = await FriendRequest.findById(requestId);
    if (!request || request.from.toString() !== from.toString())
      return res.status(404).json({ error: "Not found" });
    request.status = "cancelled";
    await request.save();
    res.status(200).json({ message: "Request cancelled" });
  } catch {
    res.status(500).json({ error: "Server error" });
  }
};

export const removeFriend = async (req, res) => {
  const userId = req.user._id;
  const { friendId } = req.body;
  try {
    const users = [userId, friendId].sort();
    await Friendship.deleteOne({ users });
    res.status(200).json({ message: "Friend removed" });
  } catch {
    res.status(500).json({ error: "Server error" });
  }
};
