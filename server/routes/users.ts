
import express from 'express';
import { User } from '../models/User';

const router = express.Router();

// Add this new endpoint
router.put('/setAdmin', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOneAndUpdate(
      { email }, 
      { $set: { isAdmin: true }},
      { new: true }
    );
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ message: 'User updated successfully', user });
  } catch (error) {
    res.status(500).json({ error: 'Error updating user' });
  }
});

export default router;
