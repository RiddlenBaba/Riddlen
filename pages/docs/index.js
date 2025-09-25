import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function DocsIndex() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/docs/introduction');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="text-center">
        <div className="text-2xl font-bold text-yellow-400 mb-4">RIDDLEN DOCS</div>
        <div className="text-gray-400">Redirecting to introduction...</div>
      </div>
    </div>
  );
}