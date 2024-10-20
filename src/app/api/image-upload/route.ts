import { NextResponse, NextRequest } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';


// Configuration
cloudinary.config({ 
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface CloudinaryUploadResult {
    public_id: string;
    [key: string]: any;
}

export async function POST(request: NextRequest) {
    try {

        if(!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
            return NextResponse.json({ error: 'Missing Cloudinary Credentials' }, { status: 500 })
        }

        const formData = await request.formData();
        const file = formData.get('file') as File;
        const location = formData.get('location') as string;
        const problem = formData.get('problem') as string;
        const solution = formData.get('solution') as string;

        if(!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        console.log(file, location, problem, solution);



        return NextResponse.json({ message: 'File uploaded successfully' }, { status: 200 })
    } catch (error) {
        
    }
}