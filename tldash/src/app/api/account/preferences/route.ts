import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(req: NextRequest) {
  try {

    const authorizationHeader = req.headers.get('Authorization');

    if (!authorizationHeader) {
      return NextResponse.json({ message: 'Authorization header missing' }, { status: 401 });
    }

    const response = await axios.get(`${process.env.AUTH_TL_BASE_URL}/api/Account/preferences`, {
      headers: {
        Authorization: authorizationHeader, //`Bearer ${session.accessToken}`,
      },
    });

    return NextResponse.json({ data: response.data }, { status: 200 });
  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json({ message: error.message || 'Failed to fetch preference data' }, { status: 500 });
  }
}


export async function PUT(req: NextRequest) {
  try {
    
    const authorizationHeader = req.headers.get('Authorization');

    const { preferredTheme, preferredLanguage, shorteningMethod } = await req.json();



    const response = await axios.put(`${process.env.AUTH_TL_BASE_URL}/api/Account/preferences`,
      { preferredTheme, preferredLanguage, shorteningMethod },
      {
        headers: {
          Authorization: authorizationHeader,
        },
      }
    );

    return NextResponse.json({ message: 'Preferences updated successfully', data: response.data }, { status: 200 });
  } catch (error) {
    console.error('Error updating preference data:', error);
    return NextResponse.json({ message: 'Failed to update preferences' }, { status: 300 });
  }
}
