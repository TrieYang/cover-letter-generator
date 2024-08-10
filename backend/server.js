require('dotenv').config();

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const currentDate = new Date().toLocaleDateString();

const axios = require('axios');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const puppeteer = require('puppeteer');

const authRoutes = require('./routes/auth');
const infoRoutes = require('./routes/info');
const authMiddleware = require('./middleware/authMiddleware');

const { convert } = require('html-to-text');

const defaultFormat = `

Opening Paragraph:
- Who are you? (Professionally speaking).
- Why are you writing this letter? (What job are you applying to?)
- What do you know about the organization and/or role and why do you want to work there?
- Why are you a good fit for this role?

Body Paragraph #1:
- Pick a qualification/requirement from the job description.
  - How do you satisfy this qualification/requirement?
  - Can you provide an example to support your claim?
  - How does the example provided translate to the organization/job you are applying for?
    - How will this help you succeed in the role you are applying for?
    - How will this help you contribute and add value to their organization and/or research?

Body Paragraph #2:
- Pick a qualification/requirement from the job description.
  - How do you satisfy this qualification/requirement?
  - Can you provide an example to support your claim?
  - How does the example provided translate to the organization/job you are applying for?
    - How will this help you succeed in the role you are applying for?
    - How will this help you contribute and add value to their organization and/or research?

Conclusion Paragraph:
- Thank the individual for reviewing your application.
- Reiterate your interests.
- Summarize briefly why you are a good fit for the role and how you can add value.
- Add a call to action! Tell the employer how they can reach you for an interview by providing the Science Co-op program’s contact information.
- Sign off
`;




app.use(bodyParser.json({ limit: '10mb' }));

// Enable CORS
app.use(cors({
  origin: 'chrome-extension://badpgnalpjhhijdcegejdccacjkofkba' // Replace with your extension's ID
}));

const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT;
const dbName = process.env.DB_NAME;


const mongoURI = `mongodb://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}?authSource=cover-letter-generator`;
console.log('MongoDB connection URL:', mongoURI);
mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.error('MongoDB connection error:', err));


app.use('/api/auth', authRoutes);
app.use('/api/info', infoRoutes);

// Protect the /main route with the authMiddleware
app.get('/main', authMiddleware, (req, res) => {
  res.json({ msg: 'Welcome to the main page!' });
});

app.post('/api/generate-cover-letter', async (req, res) => {
  const { html, info } = req.body;

  const decodedHTML = decodeURIComponent(html);

    // Convert HTML to plain text
    let text = convert(decodedHTML, {
      wordwrap: 130,
      selectors: [
        { selector: 'style', format: 'skip' },
        { selector: 'script', format: 'skip' },
        { selector: 'head', format: 'skip' },
        { selector: 'title', format: 'skip' },
        { selector: 'meta', format: 'skip' },
        { selector: 'link', format: 'skip' },
        { selector: 'img', format: 'skip' },
        { selector: 'a', options: { ignoreHref: true } },
      ],
      ignoreImage: true,
      uppercaseHeadings: false,
      preserveNewlines: true,
    });

      // Replace multiple newlines with a single newline
    text = text.replace(/\n\s*\n/g, '\n').replace(/\n{2,}/g, '\n');

    // Summarize text if it's too long
    const maxLength = 4000; // Adjust based on your needs
    const summarizedText = text.length > maxLength ? text.substring(0, maxLength) + '...' : text;

  // Replace the following with your actual OpenAI API key
  const openaiApiKey = 'sk-JceXbQKQAoqdh-mLaBuq7ThkwkNEF1mJ6t_7F2nIeaT3BlbkFJCrVF4qU9lHMQ9THyn0gelmwihJZyloxUVrZ-78crAA';
  

  
  try {
  //Make a request to the OpenAI API
    
    const requestBody = {
      model: "gpt-3.5-turbo", // Specify the model
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that generates one-page cover letters in html format that will be directly used to make a pdf so no extra words besides the cover letter needed."
        },
        {
          role: "user",
          content: `Generate a cover letter using the following info:
          \n\nJOB POST HTML:\n${summarizedText}
          \n\nPERSONAL Info:\n${info}
          \n\nTemplate:\n${defaultFormat}
          \n\nDate:${currentDate}
          \n\nFormat: <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <title>Cover Letter</title>
            <style>
              body {
                font-family: 'Times New Roman', Times, serif;
                margin: 80px; /* Margins on the sides */
                line-height: 1.6;
              }
              .header {
                margin-bottom: 40px;
              }
              .header p {
                margin: 0;
              }
              .header .date {
                text-align: left; /* Align date to the left */
              }
              .content {
                margin-top: 40px;
              }
              .content p {
                margin: 20px 0; /* Indent paragraphs */
                text-indent: 30px;
              }
              .signature {
                margin-top: 80px;
                text-align: right; /* Align sign-off to the right */
              }
              .re-section {
                text-decoration: underline; /* Underline Re: section */
              }
            </style>
          </head>
          <body>
            <div class="header">
              <p class="date">date</p>
              <P></P>
              <p>Hiring Manager Name/Hiring Manager</p>
              <p>Company Name</p>
              <p>Company Address</p>
              <p></p>
              <p class="re-section">Re: Position Title</p>
            </div>
            <div class="content">
              <p>Dear Hiring Manager,</p>
              <p><!-- Content generated by OpenAI with no empty lines bewteen paragraphs--></p>
            </div>
            <div class="signature">
              <p>Sincerely,</p>
              <p>Your Name</p>
            </div>
          </body>
          </html>
            \n`,
        }
      ],
      max_tokens: 120, // Adjust the number of tokens as needed
      temperature: 0.7
    };
    
    console.log('Sending request to OpenAI:', requestBody);

        // Send the request to the correct endpoint (Modification)
        const openaiResponse = await axios.post(
          'https://api.openai.com/v1/chat/completions',
          requestBody,
          {
            headers: {
              'Authorization': `Bearer ${openaiApiKey}`,
              'Content-Type': 'application/json'
            }
          }
        );
    

    const coverLetter = openaiResponse.data.choices[0].message.content;
   

    // Generate PDF using puppeteer
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    console.log(coverLetter);
    await page.setContent(coverLetter);
    const pdfBuffer = await page.pdf();

    await browser.close();

        // Send the PDF buffer back to the client
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=Cover_Letter.pdf');
        res.send(pdfBuffer);

    
  } catch (error) {
    console.error("Error generating cover letter:", error);
    res.status(500).json({ error: "Error generating cover letter", details: error.message });
  }
});

// Serve the PDFs
app.use('/pdfs', express.static('pdfs'));

const PORT = process.env.PORT || 5001; // Change the port number here if needed
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



