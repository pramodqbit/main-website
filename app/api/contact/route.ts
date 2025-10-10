import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message, companyName, phone, serviceType, budgetRange, projectInfo } = body;

    // Validate input - check for either the simple form (subject+message) or detailed form (serviceType+projectInfo)
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    // For detailed contact form
    const isDetailedForm = companyName !== undefined || serviceType !== undefined;
    const emailSubject = isDetailedForm
      ? `New Contact Request: ${serviceType || 'General Inquiry'}`
      : `New Contact Form: ${subject || 'No Subject'}`;
    const emailMessage = isDetailedForm
      ? projectInfo || 'No project information provided'
      : message || 'No message provided';

    // Send to Google Apps Script
    const scriptURL = 'https://script.google.com/macros/s/AKfycbxLmcYFd7ERer8KoV8xBhV05SAP8c_Ej0pDrmY1HhADicTXAzIP0tNJ9YbYMPsL_O4k/exec';

    const formData = new URLSearchParams();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('subject', subject);
    formData.append('message', message);

    const googleResponse = await fetch(scriptURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    });

    // Send via ZeptoMail
    const ZEPTO_API_URL = "https://api.zeptomail.in/v1.1/email";
    const ZEPTO_API_KEY = "PHtE6r0EEb+9imUu9UcI5/O7E5OhYdkmq7tlL1RG5NwUDPZSHU1Sr4grwWTi+hp7AKFFHKSanN9us+mftu6NcGnuM29FCmqyqK3sx/VYSPOZsbq6x00VuVgYf0HYV4DpddBj0CPRu93fNA==";
    const FROM_EMAIL = "arup@qbitlog.com";
    const TO_EMAIL = "arupdas872@gmail.com";

    // Build HTML body based on form type
    let htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">New Contact Form Submission</h2>
        <div style="background: #f5f5f5; padding: 20px; border-radius: 5px;">
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>`;

    if (isDetailedForm) {
      if (companyName) htmlBody += `<p><strong>Company:</strong> ${companyName}</p>`;
      if (phone) htmlBody += `<p><strong>Phone:</strong> ${phone}</p>`;
      if (serviceType) htmlBody += `<p><strong>Service Type:</strong> ${serviceType}</p>`;
      if (budgetRange) htmlBody += `<p><strong>Budget Range:</strong> ${budgetRange}</p>`;
      htmlBody += `
          <p><strong>Project Information:</strong></p>
          <div style="background: white; padding: 15px; border-radius: 3px; margin-top: 10px;">
            ${(projectInfo || 'Not provided').replace(/\n/g, '<br>')}
          </div>`;
    } else {
      if (subject) htmlBody += `<p><strong>Subject:</strong> ${subject}</p>`;
      htmlBody += `
          <p><strong>Message:</strong></p>
          <div style="background: white; padding: 15px; border-radius: 3px; margin-top: 10px;">
            ${(message || 'Not provided').replace(/\n/g, '<br>')}
          </div>`;
    }

    htmlBody += `
        </div>
      </div>`;

    const payload = {
      from: {
        address: FROM_EMAIL,
        name: "Qbitlog Contact Form"
      },
      to: [
        {
          email_address: {
            address: TO_EMAIL,
            name: "Qbitlog Team"
          }
        }
      ],
      subject: emailSubject,
      htmlbody: htmlBody
    };

    try {
      const zeptoResponse = await fetch(ZEPTO_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Zoho-enczapikey ${ZEPTO_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      if (!zeptoResponse.ok) {
        console.error('ZeptoMail error:', await zeptoResponse.text());
      }
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      // Don't fail the whole request if email fails
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Your message has been sent successfully!'
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to send message. Please try again.' },
      { status: 500 }
    );
  }
}
