const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

// @route   POST /api/password/forgot
// @desc    Send password reset email
router.post('/forgot', async(req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Please provide an email address' });
        }

        // Find user by email
        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            return res.status(404).json({ message: 'No account found with that email address' });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');

        // Hash token and set to resetPasswordToken field
        user.resetPasswordToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');

        // Set expire time (10 minutes)
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

        await user.save();

        // Create reset URL
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

        // Email content
        const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 12px 30px; background: white; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Password Reset Request</h1>
          </div>
          <div class="content">
            <p>Hi <strong>${user.name}</strong>,</p>
            
            <p>We received a request to reset your password for your SkillBridge account.</p>
            
            <p>Click the button below to reset your password:</p>
            
            <center>
              <a href="${resetUrl}" class="button" target="_self">Reset Password</a>
            </center>
            
            <p>Or copy and paste this link into your browser:</p>
            <p style="background: #eee; padding: 10px; word-break: break-all;">${resetUrl}</p>
            
            <div class="warning">
              <strong>⚠️ Important:</strong>
              <ul>
                <li>This link will expire in <strong>10 minutes</strong></li>
                <li>If you didn't request this, please ignore this email</li>
                <li>Your password won't change until you create a new one</li>
              </ul>
            </div>
            
            <p>If you're having trouble, please contact our support team.</p>
            
            <p>Best regards,<br><strong>The SkillBridge Team</strong></p>
          </div>
          <div class="footer">
            <p>© 2024 SkillBridge. All rights reserved.</p>
            <p>This is an automated email. Please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `;

        // Send email
        const emailResult = await sendEmail({
            email: user.email,
            subject: 'Password Reset Request - SkillBridge',
            html: html
        });

        if (!emailResult.success) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save();
            return res.status(500).json({ message: 'Email could not be sent. Please try again later.' });
        }

        res.status(200).json({
            success: true,
            message: 'Password reset email sent successfully. Please check your email.'
        });

    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});

// @route   POST /api/password/reset
// @desc    Reset password using token
router.post('/reset', async(req, res) => {
    try {
        const { token, password } = req.body;

        console.log('Reset password request received');
        console.log('Token:', token ? 'Present' : 'Missing');
        console.log('Password:', password ? 'Present' : 'Missing');

        if (!token || !password) {
            return res.status(400).json({ message: 'Please provide token and new password' });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }

        // Hash token from URL
        const resetPasswordToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

        console.log('Looking for user with hashed token...');

        // Find user with valid token and not expired
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        console.log('User found:', user ? 'Yes' : 'No');
        if (user) {
            console.log('Token expiry:', new Date(user.resetPasswordExpire));
            console.log('Current time:', new Date());
        }

        if (!user) {
            return res.status(400).json({
                message: 'Invalid or expired reset token. Please request a new password reset.'
            });
        }

        console.log('Hashing new password...');

        // Set new password (hashing will be handled by the User model's pre-save hook)
        user.password = password;

        // Clear reset token fields
        user.resetPasswordToken = null;
        user.resetPasswordExpire = null;

        console.log('Saving user...');
        await user.save();
        console.log('Password reset successful!');

        // Send confirmation email
        const confirmationHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .success { background: #d1fae5; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Password Reset Successful</h1>
          </div>
          <div class="content">
            <p>Hi <strong>${user.name}</strong>,</p>
            
            <div class="success">
              <strong>Your password has been successfully reset!</strong>
            </div>
            
            <p>You can now log in to your SkillBridge account using your new password.</p>
            
            <p><strong>Security Reminder:</strong></p>
            <ul>
              <li>Keep your password secure and don't share it with anyone</li>
              <li>Use a unique password for your SkillBridge account</li>
              <li>If you didn't make this change, contact us immediately</li>
            </ul>
            
            <p>Thank you for using SkillBridge!</p>
            
            <p>Best regards,<br><strong>The SkillBridge Team</strong></p>
          </div>
          <div class="footer">
            <p>© 2024 SkillBridge. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

        await sendEmail({
            email: user.email,
            subject: 'Password Reset Confirmation - SkillBridge',
            html: confirmationHtml
        });

        res.status(200).json({
            success: true,
            message: 'Password reset successful. You can now login with your new password.'
        });

    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});

module.exports = router;