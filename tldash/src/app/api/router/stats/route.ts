import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(req: NextRequest) {
    try {
  
      const authorizationHeader = req.headers.get('Authorization');
  
      if (!authorizationHeader) {
        return NextResponse.json({ message: 'Authorization header missing' }, { status: 401 });
      }
  
      const response = await axios.get(`${process.env.SHORTIFY_BASE_URL}/tl/router/stats`, {
        headers: {
          Authorization: authorizationHeader,
        },
      });
  
      return NextResponse.json({ data: response.data }, { status: 200 });
    } catch (error) {
      console.error('Error fetching user data:', error);
      return NextResponse.json({ message: error.message || 'Failed to fetch stats data' }, { status: error.status });
    }
  }
  
  