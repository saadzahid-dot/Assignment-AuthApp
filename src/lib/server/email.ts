import nodemailer from 'nodemailer';
import { env } from '$env/dynamic/private';

let transporterPromise: Promise<nodemailer.Transporter>;

function getTransporter(): Promise<nodemailer.Transporter> {
	if (transporterPromise) return transporterPromise;

	if (env.SMTP_USER && env.SMTP_PASS) {
		// Production: use real SMTP credentials
		console.log('Using real SMTP with user:', env.SMTP_USER);
		transporterPromise = Promise.resolve(
			nodemailer.createTransport({
				host: env.SMTP_HOST || 'smtp.gmail.com',
				port: Number(env.SMTP_PORT) || 587,
				secure: false,
				auth: {
					user: env.SMTP_USER,
					pass: env.SMTP_PASS
				}
			})
		);
	} else {
		// Development: use Ethereal test account (no real credentials needed)
		transporterPromise = nodemailer.createTestAccount().then((testAccount) => {
			console.log('Using Ethereal test email account:', testAccount.user);
			return nodemailer.createTransport({
				host: 'smtp.ethereal.email',
				port: 587,
				secure: false,
				auth: {
					user: testAccount.user,
					pass: testAccount.pass
				}
			});
		});
	}

	return transporterPromise;
}

export async function sendVerificationEmail(email: string, token: string, origin: string) {
	const verifyLink = `${origin}/verify-email?token=${token}&email=${encodeURIComponent(email)}`;
	const transporter = await getTransporter();

	const info = await transporter.sendMail({
		from: env.SMTP_FROM || 'AuthApp <noreply@authapp.com>',
		to: email,
		subject: 'Verify your email - AuthApp',
		html: `
			<div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
				<h2 style="color: #1f2937; text-align: center;">Verify your email address</h2>
				<p style="color: #6b7280; text-align: center;">Click the button below to verify your email address and activate your account.</p>
				<div style="text-align: center; margin: 32px 0;">
					<a href="${verifyLink}" style="background-color: #4f46e5; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">
						Verify Email
					</a>
				</div>
				<p style="color: #9ca3af; font-size: 13px; text-align: center;">This link expires in 24 hours. If you didn't create an account, you can ignore this email.</p>
			</div>
		`
	});

	const previewUrl = nodemailer.getTestMessageUrl(info);
	if (previewUrl) {
		console.log('Preview verification email:', previewUrl);
	}
}

export async function sendPasswordResetEmail(email: string, resetLink: string) {
	const transporter = await getTransporter();

	const info = await transporter.sendMail({
		from: env.SMTP_FROM || 'AuthApp <noreply@authapp.com>',
		to: email,
		subject: 'Reset your password - AuthApp',
		html: `
			<div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
				<h2 style="color: #1f2937; text-align: center;">Reset your password</h2>
				<p style="color: #6b7280; text-align: center;">Click the button below to reset your password.</p>
				<div style="text-align: center; margin: 32px 0;">
					<a href="${resetLink}" style="background-color: #4f46e5; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">
						Reset Password
					</a>
				</div>
				<p style="color: #9ca3af; font-size: 13px; text-align: center;">This link expires in 1 hour. If you didn't request this, you can ignore this email.</p>
			</div>
		`
	});

	const previewUrl = nodemailer.getTestMessageUrl(info);
	if (previewUrl) {
		console.log('Preview reset email:', previewUrl);
	}
}
