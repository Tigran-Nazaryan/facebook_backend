import { FriendService } from '../../service/friend/index.js';
import {checkUserAccess, validateUser} from "../../helper/index.js";

const friendService = new FriendService();

export const sendFriendRequest = async (req, res) => {
    try {
        const { receiverId } = req.body;
        const senderId = req.user?.id;

        if (!senderId) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        if (!receiverId) {
            return res.status(400).json({ success: false, message: 'Receiver ID is required' });
        }

        const friendRequest = await friendService.sendFriendRequest(senderId, receiverId);

        return res.status(201).json({
            success: true,
            message: 'Friend request sent successfully',
            data: friendRequest,
        });
    } catch (error) {
        if (
            error.message.includes('already') ||
            error.message.includes('cannot') ||
            error.message.includes('not found')
        ) {
            return res.status(400).json({ success: false, message: error.message });
        }

        return res.status(500).json({ success: false, message: 'Failed to send friend request' });
    }
};

export const getReceivedRequests = async (req, res) => {
    try {
        const { userId } = req.params;
        checkUserAccess(req.user?.id, userId);

        const requests = await friendService.getReceivedRequests(parseInt(userId));

        return res.status(200).json({ success: true, data: requests });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Failed to get received requests',
        });
    }
};

export const getSentRequests = async (req, res) => {
    try {
        const { userId } = req.params;
        checkUserAccess(req.user?.id, userId);

        const requests = await friendService.getSentRequests(parseInt(userId));

        return res.status(200).json({ success: true, data: requests });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Failed to get sent requests',
        });
    }
};

export const acceptFriendRequest = async (req, res) => {
    try {
        const userId = validateUser(req, req.user?.id);
        const requestId = req.params.id;

        const result = await friendService.acceptFriendRequest(parseInt(requestId), userId);
        return res.status(200).json({ success: true, message: 'Friend request accepted', data: result });
    } catch (error) {
        if (error.message.includes('not found') || error.message.includes('already')) {
            return res.status(400).json({ success: false, message: error.message });
        }
        return res.status(500).json({ success: false, message: 'Failed to accept friend request' });
    }
};

export const deleteFriendRequest = async (req, res) => {
    try {
        const userId = validateUser(req, req.user?.id);
        const requestId = req.params.id;

        await friendService.deleteFriendRequest(parseInt(requestId), userId);
        return res.status(200).json({ success: true, message: 'Friend request deleted successfully' });
    } catch (error) {
        if (error.message.includes('not found')) return res.status(400).json({ success: false, message: error.message });
        return res.status(500).json({ success: false, message: 'Failed to delete friend request' });
    }
};

export const removeFriend = async (req, res) => {
    try {
        const { friendId } = req.params;
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        if (!friendId || isNaN(parseInt(friendId))) {
            return res.status(400).json({ success: false, message: 'Invalid friend ID' });
        }

        await friendService.removeFriend(userId, parseInt(friendId));

        return res.status(200).json({
            success: true,
            message: 'Friend removed successfully',
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to remove friend' });
    }
};
