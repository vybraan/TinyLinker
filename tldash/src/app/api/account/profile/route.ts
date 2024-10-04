import { getSession } from 'next-auth/react';
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(req: NextRequest) {
  try {

    const authorizationHeader = req.headers.get('Authorization');

    if (!authorizationHeader) {
      return NextResponse.json({ message: 'Authorization header missing' }, { status: 401 });
    }

    const response = await axios.get(`${process.env.AUTH_TL_BASE_URL}/api/Account/profile`, {
      headers: {
        Authorization: authorizationHeader, //`Bearer ${session.accessToken}`,
      },
    });

    return NextResponse.json({ data: response.data }, { status: 200 });
  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json({ message: error.message || 'Failed to fetch user data' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {

    
    const authorizationHeader = req.headers.get('Authorization');

    const {phoneNumber, firstName, lastName } = await req.json();

    // if ( !email || !firstName || !lastName) {
    //   return NextResponse.json({ message: 'Invalid input data' }, { status: 400 });
    // }

    const response = await axios.put(
      `${process.env.AUTH_TL_BASE_URL}/api/Account/profile`,
      { phoneNumber, firstName, lastName },
      {
        headers: {
          Authorization: authorizationHeader,
        },
      }
    );

    return NextResponse.json({ message: 'Profile updated successfully', data: response.data }, { status: 200 });
  } catch (error) {
    console.error('Error updating user data:', error);
    return NextResponse.json({ message: 'Failed to update profile' }, { status: 300 });
  }
}
