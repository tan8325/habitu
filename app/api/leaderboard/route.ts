import { createClerkClient } from '@clerk/backend';

const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

export async function GET() {
  try {
    // Fetch the user list using Clerk backend
    const userList = await clerkClient.users.getUserList();
    
    // Return the list as JSON response
    return new Response(JSON.stringify(userList), { status: 200 });
  } catch (error) {
    console.error('Error fetching user list:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
