export const revalidate = 0;

export async function GET() {
  try {
    const category = 'inspirational';
    const apiKey = process.env.QUOTE_API;
    if (!apiKey) {
      throw new Error('QUOTE_API key is not defined');
    }

    const response = await fetch(`https://api.api-ninjas.com/v1/quotes?category=${category}`, {
      method: 'GET',
      headers: {
        'X-Api-Key': apiKey,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch quote');
    }

    const data = await response.json();
    if (!data || !data[0]) {
      throw new Error('No quote data available');
    }
    
    const { quote, author } = data[0];

    return new Response(
      JSON.stringify({ quote, author }),
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching quote:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
