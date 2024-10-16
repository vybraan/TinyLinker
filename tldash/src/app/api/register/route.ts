import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: NextRequest) {
  try {
    const { username, password, email } = await req.json();

    // Basic validation for missing fields
    if (!username || !password || !email) {
      return NextResponse.json({ message: 'Missing username, password, or email' }, { status: 400 });
    }

    // Send request to external Auth service
    const res = await axios.post(`${process.env.AUTH_TL_BASE_URL}/api/Auth/register`, {
      username,
      email,
      password,
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*',
      },
    });

    const data = res.data;

    if (data.status === "Error") {
      return NextResponse.json({ message: data.message || 'Registration failed' }, { status: 400 });
    }

    // Success
    return NextResponse.json({ message: data.message }, { status: 201 });
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
    return NextResponse.json({ message: errorMessage }, { status: 400 });
  }
}
