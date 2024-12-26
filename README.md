# Okwega

Okwega is a mentorship platform designed to connect mentors and mentees across various domains. The platform leverages AI to assist mentors in structuring lessons and providing tailored feedback. It also integrates video conferencing, real-time messaging, and secure payment solutions, making mentorship accessible and seamless for users worldwide.

## Features

- **AI-Powered Lesson Structuring**: Mentors can create well-organized lesson plans using AI tools.
- **Stream Video Integration**: Conduct real-time video sessions with features like screen sharing and recording.
- **Mentor-Mentee Matching**: Intelligent matching system based on preferences and expertise.
- **Payment Integration**: Supports **PesaPal** and **Stripe** for secure and versatile payment options.
- **Session Analytics**: Tracks session engagement, feedback, and progress.

## Tech Stack

- **Frontend**: Next.js
- **Backend**: Supabase (PostgreSQL, Realtime API)
- **AI Integration**: FastAPI and OpenAI GPT models
- **Video Conferencing**: Stream Video API
- **Payment Gateways**: PesaPal and Stripe

## Getting Started

### Prerequisites
- Node.js >= 18.x
- Supabase account
- API keys for OpenAI, Stream, PesaPal, and Stripe

### Installation
1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/okwega.git
    cd okwega
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Create a `.env.local` file with the following:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_KEY=your_supabase_key
    STREAM_API_KEY=your_stream_api_key
    PESAPAL_API_KEY=your_pesapal_api_key
    STRIPE_API_KEY=your_stripe_api_key
    OPENAI_API_KEY=your_openai_api_key
    ```

4. Start the development server:
    ```bash
    npm run dev
    ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Contributing

We welcome contributions to improve Okwega. Please follow these steps:
1. Fork the repository.
2. Create a feature branch:
    ```bash
    git checkout -b feature/your-feature-name
    ```
3. Commit changes and push:
    ```bash
    git commit -m "Add your feature"
    git push origin feature/your-feature-name
    ```
4. Create a Pull Request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
