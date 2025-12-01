// controllers/contactController.js

export const sendMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    // 👉 You can store this message in DB OR send email using Nodemailer.

    console.log("New Contact Message Received:");
    console.log("Name:", name);
    console.log("Email:", email);
    console.log("Message:", message);

    return res.status(200).json({
      success: true,
      message: "Message sent successfully!"
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message
    });
  }
};
