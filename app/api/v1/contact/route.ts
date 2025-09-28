import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/connection';
import Contact from '@/lib/models/Contact';
import { sendContactEmail } from '@/lib/services/email';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
  phone: z.string().optional(),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(1, 'Message is required'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = contactSchema.parse(body);
    
    // Type assertion since Zod validation ensures required fields exist
    const contactData = validatedData as {
      name: string;
      email: string;
      subject: string;
      message: string;
      phone?: string;
    };

    await connectToDatabase();
    
    // Save to database
    const contact = new Contact(contactData);
    await contact.save();

    // Send email notification
    await sendContactEmail(contactData);

    return NextResponse.json({ 
      message: 'Contact form submitted successfully',
      whatsappUrl: `https://wa.me/919445799389?text=${encodeURIComponent(
        `Hello, I'm ${contactData.name}. ${contactData.message}`
      )}`
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    
    console.error('Contact form error:', error);
    return NextResponse.json({ error: 'Failed to submit contact form' }, { status: 500 });
  }
}