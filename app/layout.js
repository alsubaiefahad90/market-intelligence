import { SpeedInsights } from '@vercel/speed-insights/next';

export const metadata = {
  title: 'Market Intelligence',
  description: 'AI-powered market intelligence platform',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
