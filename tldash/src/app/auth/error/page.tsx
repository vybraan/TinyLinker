'use client';

// Import `useRouter` from `next/navigation`
import { useRouter } from 'next/navigation';

// export default function ErrorPage() {
//   const router = useRouter();
//
//   return (
//     <div>
//       <h1>An error occurred</h1>
//       <p>Something went wrong during the authentication process.</p>
//       <button onClick={() => router.push('/')}>Go back to Home</button>
//     </div>
//   );
// }


//
//
export default function ErrorPage() {
  const router = useRouter();
  const { error } = router;

  return (
    <div>
      <h1>Authentication Error</h1>
      <p>{error ? error : "An unknown error occurred."}</p>
      <a href="/auth/signin">Try Again</a>
    </div>
  );
}
//
