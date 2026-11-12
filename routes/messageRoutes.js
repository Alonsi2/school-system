const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// إرسال رسالة جديدة
router.post('/send', async (req, res) => {
  try {
    const { senderId, receiverId, subject, body } = req.body;

    const newMessage = new Message({
      senderId,
      receiverId: receiverId || null, // موجهة للإدارة أو لمستخدم محدد
      subject,
      body
    });

    await newMessage.save();
    res.status(201).json({ message: 'تم إرسال الرسالة بنجاح', data: newMessage });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// جلب رسائل صندوق الوارد للمستخدم أو الإدارة
router.get('/inbox/:userId', async (req, res) => {
  try {
    const messages = await Message.find({ 
      $or: [{ receiverId: req.params.userId }, { receiverId: null }] 
    }).populate('senderId', 'name role').sort({ createdAt: -1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
