import { createClerkClient } from '@clerk/nextjs/server';

const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

export const revalidate = 0; 

export async function GET() {
  try {
    const userList = await clerkClient.users.getUserList({
      limit: 500,
    });

    return new Response(JSON.stringify(userList.data), {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate', 
        'Pragma': 'no-cache',
        'Expires': '0', 
      },
    });
  } catch (error) {
    console.error('Error fetching user list:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
