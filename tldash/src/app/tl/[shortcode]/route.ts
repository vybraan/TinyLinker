import { NextResponse } from 'next/server';
import axios from 'axios';
import redisClient from '@/lib/redisClient';

const CACHE_EXPIRATION = 60 * 60 * 24; // 24 hours

export async function GET(request: Request, { params }: { params: { shortcode: string } }) {
  const { shortcode } = params;

  // const redisStatus = await redisClient.ping();
  let cachedUrl;

  // if(redisStatus !== 'PONG'){}

  try {
    const redisStatus = await redisClient.ping();
    if (redisStatus !== 'PONG') {
      throw new Error('Redis is not responding');
    }
  } catch (redisError) {
    console.error('Redis is not available:', redisError);
  }

  try {
    
    cachedUrl = await redisClient.get(shortcode);

    if (cachedUrl) {
      console.log('Cache hit: ', shortcode);
      return NextResponse.redirect(cachedUrl, 302); // Redirect to the cached URL
    }
    
  } catch (error) {
    console.error('Redis Client Error:', error);
  }
  
  try {

    const response = await axios.get(`${process.env.SHORTIFY_BASE_URL}/tl/router/${shortcode}`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*',
      },
    });

    if (response.data) {

      try {
        await redisClient.setEx(shortcode, CACHE_EXPIRATION, response.data);
      } catch (cacheError) {
        console.error('Failed to cache URL in Redis:', cacheError);
      }

      return NextResponse.redirect(response.data, 302);
    } else {
      return NextResponse.json({ message: 'Shortcode not found' }, { status: 404 });
    }
  } catch (error) {
    // await redisClient.setEx(shortcode, CACHE_EXPIRATION, response.data);
    return NextResponse.json({ message: 'Error fetching shortcode' }, { status: 500 });
  }
}
