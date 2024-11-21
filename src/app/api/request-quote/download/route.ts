import axios from 'axios';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const file = searchParams.get('file');  // Get the file from query params
  const fileName = searchParams.get('filename') || 'RequestQuote.pdf';  // Optional filename, default to 'CustomQuote.pdf'

  const cloudinaryUrl = `${process.env.NEXT_PUBLIC_CLOUDINARY_PDF_ASSETS_ACCESS_URL}/${file}`;

  try {
    // Fetch the file from Cloudinary
    const response = await axios({
      url: cloudinaryUrl,
      method: 'GET',
      responseType: 'stream',  // We want the file as a stream
    });

    // Set headers for file download
    return new NextResponse(response.data, {
      headers: {
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Content-Type': 'application/pdf',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Error fetching the file:', error);
    return new NextResponse('Failed to download file', { status: 500 });
  }
}
