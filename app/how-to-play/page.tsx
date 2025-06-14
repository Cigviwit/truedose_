'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function HowToPlayPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary flex flex-col items-center justify-center p-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="space-y-6 max-w-2xl mx-auto"
      >
        <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent-foreground mb-8">
          How to Play TrueDose
        </h1>
        <p className="text-lg text-foreground mb-4">
          <strong className="text-primary">Read the medical fact on the screen.</strong>
        </p>
        <p className="text-lg text-foreground mb-4">
          <strong className="text-primary">Tap TRUE or FALSE within 15 seconds.</strong>
        </p>
        <p className="text-lg text-foreground mb-4">
          If you're right – <strong className="text-green-500">your streak continues.</strong>
        </p>
        <p className="text-lg text-foreground mb-4">
          If you're wrong – <strong className="text-destructive">game over.</strong>
        </p>
        <p className="text-lg text-foreground mb-4">
          After each correct answer, you'll see a short explanation.
        </p>
        <p className="text-lg text-foreground mb-4">
          You get <strong className="text-primary">5 free explanations daily</strong> (unlimited if subscribed).
        </p>
        <p className="text-lg text-foreground mb-8">
          Tap <strong className="text-primary">Continue</strong> to move to the next fact.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push('/')}
          className="mt-8 px-8 py-4 bg-primary text-primary-foreground rounded-lg overflow-hidden group"
        >
          <span className="relative z-10 text-lg font-semibold">
            Back to Home
          </span>
        </motion.button>
      </motion.div>
    </div>
  );
} 