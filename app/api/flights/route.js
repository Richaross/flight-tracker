import { NextResponse } from 'next/server';
import { flightService } from '../../../lib/services/flightService';

/**
 * GET /api/flights?query=AA123
 * Controller for handling flight search requests.
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  if (!query) {
    return NextResponse.json([]);
  }

  try {
    const flights = await flightService.searchFlight(query);
    return NextResponse.json(flights);
  } catch (error) {
    console.error('[API] GET /flights Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
