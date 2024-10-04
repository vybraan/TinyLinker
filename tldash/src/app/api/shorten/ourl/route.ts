import { getSession } from 'next-auth/react';
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: NextRequest) {
  try {

    const { originalUrl } = await req.json();

    const authorizationHeader = req.headers.get('Authorization');

    if (!authorizationHeader) {
      return NextResponse.json({ message: 'Authorization header missing' }, { status: 401 });
    }

    const response = await axios.post(`${process.env.SHORTIFY_BASE_URL}/api/shorten/ourl`, {
      originalUrl,
    }, {
      headers: {
        Authorization: authorizationHeader,
        'Content-Type': 'application/json',
        'Accept': '*/*',
      },
    });

    return NextResponse.json({ data: response.data }, { status: 200 });
  } catch (error) {
    console.error('Error fetching user data:', error.response);
    return NextResponse.json({ message: error.response.data.message || 'Failed to fetch user data' }, { status: error.status });
  }
}

export async function GET(req: NextRequest) {
  try {

    const authorizationHeader = req.headers.get('Authorization');

    if (!authorizationHeader) {
      return NextResponse.json({ message: 'Authorization header missing' }, { status: 401 });
    }

    const response = await axios.get(`${process.env.SHORTIFY_BASE_URL}/api/shorten/urls`, {
      headers: {
        Authorization: authorizationHeader,
      },
    });

    return NextResponse.json({ data: response.data }, { status: 200 });
  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json({ message: error.message || 'Failed to fetch history data' }, { status: error.status });
  }
}





// export async function PUT(req: NextRequest) {
//   try {

    
//     const authorizationHeader = req.headers.get('Authorization');

//     const {phoneNumber, firstName, lastName } = await req.json();

//     // if ( !email || !firstName || !lastName) {
//     //   return NextResponse.json({ message: 'Invalid input data' }, { status: 400 });
//     // }

//     const response = await axios.put(
//       `${process.env.AUTH_TL_BASE_URL}/api/Account/profile`,
//       { phoneNumber, firstName, lastName },
//       {
//         headers: {
//           Authorization: authorizationHeader,
//         },
//       }
//     );

//     return NextResponse.json({ message: 'Profile updated successfully', data: response.data }, { status: 200 });
//   } catch (error) {
//     console.error('Error updating user data:', error);
//     return NextResponse.json({ message: 'Failed to update profile' }, { status: 300 });
//   }
// }
