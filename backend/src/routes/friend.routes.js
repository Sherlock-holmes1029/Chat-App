import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import {
  getUserFriends,
  sendFriendRequest,
  acceptFriendRequest,
  declineFriendRequest,
  cancelFriendRequest,
  removeFriend
} from '../controllers/friend.controller.js';

const router = express.Router();

router.get('/:id', protectRoute, getUserFriends);
router.post('/request', protectRoute, sendFriendRequest);
router.post('/accept/:id', protectRoute, acceptFriendRequest);
router.post('/decline/:id', protectRoute, declineFriendRequest);
router.post('/cancel/:id', protectRoute, cancelFriendRequest);
router.delete('/remove/:id', protectRoute, removeFriend);

export default router;