/* eslint-disable camelcase */
import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { createUser, updateUser, deleteUser } from '@/lib/actions/user.action';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
	// You can find this in the Clerk Dashboard -> Webhooks -> choose the webhook
	const WEBHOOK_SECRET = process.env.NEXT_CLERK_WEBHOOK_SECRET;

	if (!WEBHOOK_SECRET) {
		throw new Error(
			'Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local'
		);
	}

	// Get the headers
	const headerPayload = headers();
	const svixId = headerPayload.get('svix-id');
	const svixTimestamp = headerPayload.get('svix-timestamp');
	const svixSignature = headerPayload.get('svix-signature');

	// If there are no headers, error out
	if (!svixId || !svixTimestamp || !svixSignature) {
		return new Response('Error occured -- no svix headers', {
			status: 400,
		});
	}

	// Get the body
	const payload = await req.json();
	const body = JSON.stringify(payload);

	// Create a new SVIX instance with your secret.
	const wh = new Webhook(WEBHOOK_SECRET);

	let evt: WebhookEvent;

	// Verify the payload with the headers
	try {
		evt = wh.verify(body, {
			'svix-id': svixId,
			'svix-timestamp': svixTimestamp,
			'svix-signature': svixSignature,
		}) as WebhookEvent;
	} catch (err) {
		console.error('Error verifying webhook:', err);
		return new Response('Error occured', {
			status: 400,
		});
	}

	const eventType = evt.type;


	if (eventType === 'user.created') {
		const { id, email_addresses, image_url, username, first_name, last_name } =
			evt.data;
		// Create user a new database
		const mongoUser = await createUser({
			clerkId: id,
			email: email_addresses[0].email_address,
			username: username || '',
			name: `${first_name}${last_name ? ` ${last_name}` : ''}`,
			picture: image_url,
		});
		return NextResponse.json({ message: 'OK', user: mongoUser });
	}
	if (eventType === 'user.updated') {
		const { id, email_addresses, image_url, username, first_name, last_name } =
			evt.data;
		const mongoUser = await updateUser({
			clerkId: id,
			updateData: {
				email: email_addresses[0].email_address,
				username: username || '',
				name: `${first_name}${last_name ? ` ${last_name}` : ''}`,
				picture: image_url,
			},
			path: '/profile/' + id,
		});
		return NextResponse.json({ message: 'OK', user: mongoUser });
	}
	if (eventType === 'user.deleted') {
		const { id } = evt.data;
		const deletedUser = await deleteUser({ clerkId: id! });
		return NextResponse.json({ message: 'OK', user: deletedUser });
	}

	return new Response('', { status: 201 });
}
