import { sendMail } from "@/lib/mailer";
import { connectToDatabase } from "@/lib/mongoose";
import User from "@/models/User";
import crypto from "crypto";



const chatzalogo = `<img src="https://stitch.withgoogle.com/projects/3017655391081209671?node-id=b9672bc8-9deb-416c-b3b2-6ee48e658aed" alt="Chatza Logo"  />`;

export async function POST(req: Request) {



    try {
        const { identifier } = await req.json();

        if (!identifier) {
            return Response.json(
                { success: false, message: "Email or username required" },
                { status: 400 }
            );
        }

        await connectToDatabase();

        const user = await User.findOne({
            $or: [{ email: identifier }, { username: identifier }],
        });

        // ❌ USER NOT FOUND
        if (!user) {
            return Response.json({
                success: false,
                message: "No account found with this email or username",
            });
        }

        console.log("✅ FORGOT PASSWORD USER", user);

        // ✅ GENERATE RAW TOKEN
        // Generate raw token (for email)
        const resetToken = crypto.randomBytes(32).toString("hex");

        console.log("✅ FORGOT PASSWORD RESET TOKEN", resetToken);

        // Hash token (for database)
        const hashedToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        console.log("✅ FORGOT PASSWORD HASHED TOKEN", hashedToken);

        // ✅ STORE HASHED TOKEN
        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = new Date(Date.now() + 5 * 60 * 1000);

        console.log(" ✅ FORGOT PASSWORD USER AFTER UPDATED", user);
        await user.save();



        const resetLink = `${process.env.APP_URL}/forgotpassword/reset?token=${resetToken}`;

        await sendMail({
            to: user.email,
            subject: "Reset your Chatza password",
            html: `

        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f9f9f9; padding: 40px 0; width: 100%; margin: 0;">
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                <!-- Header -->
                <tr>
                    <td align="center" style="padding: 30px 0; background-color: #ffffff; border-bottom: 1px solid #f0f0f0;">
                    ${chatzalogo}
                    </td>
                </tr>
                
                <!-- Body -->
                <tr>
                    <td style="padding: 40px 30px;">
                        <h2 style="color: #1a202c; font-size: 22px; margin-top: 0; font-weight: 700;">Password Reset Request</h2>
                        <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                            We received a request to reset the password for your Chatza account. If you didn't make this request, you can ignore this email.
                        </p>
                        
                        <!-- CTA Button -->
                        <div align="center" style="margin: 35px 0;">
                            <a href="${resetLink}" style="background-color: #e53e3e; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; display: inline-block;">Reset Password</a>
                        </div>
                        
                        <div style="background-color: #fff5f5; border-left: 4px solid #e53e3e; padding: 15px; margin-bottom: 20px;">
                            <p style="color: #c53030; font-size: 14px; margin: 0;">
                                <strong>Security Note:</strong> This link will expire in <strong>15 minutes</strong>.
                            </p>
                        </div>
                    </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                    <td align="center" style="padding: 20px 30px 40px 30px; background-color: #f9f9f9; color: #a0aec0; font-size: 12px;">
                        <p style="margin: 0;">&copy; ${new Date().getFullYear()} Chatza. All rights reserved.</p>
                        <p style="margin: 5px 0 0 0;">Stay connected, stay secure.</p>
                    </td>
                </tr>
            </table>
        </div>
    `,
        });


        return Response.json({
            success: true,
            message: "Password reset link sent to your email",
        });
    } catch (error) {
        console.error(error);
        return Response.json(
            { success: false, message: "Something went wrong" },
            { status: 500 }
        );
    }
}
