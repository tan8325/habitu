import { createClerkClient } from '@clerk/nextjs/server';

const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

export async function GET() {
  try {
    const userList = await clerkClient.users.getUserList();
    return new Response(JSON.stringify(userList.data), {
      status: 200,
      headers: {
        'Cache-Control': 'no-store', // Disable caching
      },
    });
  } catch (error) {
    console.error('Error fetching user list:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

