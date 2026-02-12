import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import MainPage from './pages/MainPage';

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <MainPage />
      <Toaster />
    </ThemeProvider>
  );
}
