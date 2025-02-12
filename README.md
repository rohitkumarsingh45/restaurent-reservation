
# Restaurant Reservation System

## Local Development

1. Clone the repository:
```bash
git clone <your-repo-url>
cd <your-repo-name>
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with the following variables:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:8080`

## Testing

Run the test suite:
```bash
npm test
```

Run tests in watch mode:
```bash
npm test:watch
```

View test coverage:
```bash
npm test:coverage
```

## Deployment

### Option 1: Using Lovable (Recommended)

1. Open your project in [Lovable](https://lovable.dev)
2. Click on "Share" in the top navigation
3. Click "Publish"
4. Your app will be deployed automatically with all environment variables configured

### Option 2: Manual Deployment (e.g., Vercel, Netlify)

#### Vercel

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Import your project in Vercel
3. Configure environment variables in Vercel's dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy!

#### Netlify

1. Push your code to a Git repository
2. Import your project in Netlify
3. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Add environment variables in Netlify's dashboard
5. Deploy!

## Build for Production

To create a production build:

```bash
npm run build
```

This will create a `dist` directory with your compiled assets.

## Error Handling

The application implements comprehensive error handling:

1. API Errors: All Supabase service calls are wrapped in try-catch blocks with appropriate error messages
2. Form Validation: Input validation is performed before submission
3. UI Feedback: Toast notifications inform users of success/failure
4. Error Boundaries: React error boundaries catch and handle rendering errors

## Project Structure

```
src/
├── components/        # React components
├── services/         # API and business logic
├── lib/              # Utilities and helpers
├── pages/            # Page components
└── __tests__/        # Test files
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Write/update tests
4. Submit a pull request

## License

MIT License - see LICENSE.md for details
