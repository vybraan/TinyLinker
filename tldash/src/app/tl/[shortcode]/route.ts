import { NextResponse } from 'next/server';
import axios from 'axios';
import redisClient from '@/lib/redisClient';

const CACHE_EXPIRATION = 60 * 60 * 24; // 24 hours

export async function GET(request: Request, { params }: { params: { shortcode: string } }) {
  const { shortcode } = params;

  let cachedUrl;
  
  try {
    if(!redisClient.isOpen){
      await redisClient.connect();
    }
    console.error(redisClient.isOpen);

    if (redisClient.isOpen) {
      console.log('Connected to Redis try');
      
        try {
          
          cachedUrl = await redisClient.get(shortcode);
      
          if (cachedUrl) {
            console.log('Cache hit -- shortcode: ', shortcode);
            try {
              const response = axios.post(`${process.env.SHORTIFY_BASE_URL}/tl/router/click`, {
                originalUrl: shortcode,
              },{
                headers: {
                  'Content-Type': 'application/json',
                  'Accept': '*/*',
                },
              });
              console.log("clicking")
              
            } catch (error) {
              console.error(error);
            }
            return NextResponse.redirect(cachedUrl, 302); 
          }

          
        } catch (error) {
          console.error('Redis lookup error:', error);
        }
    }
  } catch (error) {
    console.error('Failed to connect to Redis:', error);
  }
  console.log('Cache missed -- shortcode: ', shortcode);
  console.log('Switch to API -- shortcode');

  
  try {

    const response = await axios.get(`${process.env.SHORTIFY_BASE_URL}/tl/router/${shortcode}`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*',
      },
    });

    if (response.data) {

      try {
        if (redisClient.isOpen) {
          console.log('Cache save -- shortcode: ', shortcode);
          redisClient.setEx(shortcode, CACHE_EXPIRATION, response.data.url);
        }else{
          console.log('Cache save failed -- shortcode: ', shortcode);
        }

      } catch (cacheError) {
        console.error('Failed to cache URL in Redis:', cacheError);
      }

      return NextResponse.redirect(response.data.url, 302);
    } else {
      return NextResponse.json({ message: 'Shortcode not found' }, { status: 404 });
    }
  } catch (error) {
    // await redisClient.setEx(shortcode, CACHE_EXPIRATION, response.data);
    return NextResponse.json({ message: 'Error fetching shortcode' }, { status: 500 });
  }
}
