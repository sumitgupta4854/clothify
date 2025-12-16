import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST(request) {
  try {
    const data = await request.formData();
    const file = data.get('file');

    if (!file) {
      return Response.json({ error: 'No file received' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const filename = `${Date.now()}-${file.name}`;
    const path = join(process.cwd(), 'public', 'images', filename);

    await writeFile(path, buffer);

    // Return the public URL
    const imageUrl = `/images/${filename}`;

    return Response.json({ url: imageUrl });
  } catch (error) {
    console.error('Upload error:', error);
    return Response.json({ error: 'Upload failed' }, { status: 500 });
  }
}