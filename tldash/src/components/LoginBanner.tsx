
export default function LoginBanner() {
  return (
    <div className="bg-base-200 rounded-lg py-4 px-6 text-center">
      <p className="text-lg font-semibold">
        You are not logged in. Please

        {' '}
        <a href="/auth/signin" className="text-primary hover:text-primary/75 underline" >log in</a>
        {' '}
        to continue.
      </p>
    </div>
  );
}

