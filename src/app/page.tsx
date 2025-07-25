import { SecureMailForm } from '@/components/secure-mail-form';
import { Mail } from 'lucide-react';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 md:p-12 lg:p-24 bg-background">
      <div className="w-full max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center bg-primary/10 text-primary p-3 rounded-full mb-4">
             <Mail className="h-8 w-8" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold font-headline text-foreground tracking-tight">
            SecureMail
          </h1>
          <p className="mt-3 text-lg text-muted-foreground max-w-xl mx-auto">
            Send your message securely. Long messages will be summarized by AI for a quick overview.
          </p>
        </div>
        <SecureMailForm />
      </div>
    </main>
  );
}
