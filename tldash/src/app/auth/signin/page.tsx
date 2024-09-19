'use client';

import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { getProviders, useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function SignIn() {
  const [providers, setProviders] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loginInProgress, setLoginInProgress] = useState(false);


  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    const fetchProviders = async () => {
      const result = await getProviders();
      setProviders(result);
    };
    fetchProviders();
  }, []);

  useEffect(() => {
    if (session) {
      // If the user is signed in, redirect to the home page
      router.push('/');
    }
  }, [session, router]);



  if (status === 'loading') {
    return <div>Loading...</div>; // Loading state while session is being checked
  }



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginInProgress(true);

    // Passing credentials to `signIn` method.
    const res = await signIn('authtl', {
      redirect: false,
      callbackUrl: "/",
      username,
      password,
    });

    setLoginInProgress(false);

    // Handle response here if needed (error handling, etc.)
    if (res.ok) {
      window.location.href = res.url; // Redirect manually
      console.error('Login success:', res);
    } else {
      setError("Login failed. Please check your username and password.");
      console.error('Login failed:', res.error);
    }
  };

return (

     <>

      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <Image
          width="10"
          height="10"
            alt="Your Company"
            src="/favicon.ico"
            className="mx-auto h-10 w-auto"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight ">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">

          { error ?(
            <span>{error}</span>) :(
              <></>
            )
          }



          <div className="flex w-full flex-col border-opacity-50">


            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="w-full form-control">
                <div className="label">
                  <span className="label-text">Username or Email</span>
                </div>
                  <input
                    name="username"
                    type="text"
                    placeholder="Your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    id="username"
                    required
                    autoComplete="username"
                    disabled={loginInProgress}
                    className="input input-bordered input-primary w-full input-sm"
                  />
              </div>

              <div className="form-control w-full">
                <div className="label">
                  <div htmlFor="password" className="label-text">
                    Password
                  </div>
                  <div className="label-text-alt">
                    <a href="#" className="font-semibold text-primary-600 hover:text-primary-500">
                      Forgot password?
                    </a>
                  </div>
                </div>
                <input
                  name="password"
                  type="password"
                  placeholder="Your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  id="password"
                  required
                  disabled={loginInProgress}
                  autoComplete="current-password"
                  className="input input-bordered input-primary w-full input-sm"
                />
              </div>

              <div>
                <button
                  type="submit"
                  className="flex btn btn-primary w-full btn-sm"
                   disabled={loginInProgress}
                >
                  Sign in
                </button>
              </div>
            </form>

            <div className="divider">OR continue with</div>

            {providers ? (

              <div className="flex flex-col items-center space-y-3">
                {Object.values(providers).map((provider) =>
                    provider.id !== 'authtl' ? (
                      <div key={provider.name}>
                        <button className="btn btn-wide btn-outline btn-sm" onClick={() => signIn(provider.id)}>
                          {provider.name}
                          <Image src={'https://'+provider.name +'.com/favicon.ico'} width="20" height="20" alt={provider.name + '\'s logo'} />
                         </button>
                      </div>
                    ) : null
                  )
                }
              </div>
              ) : (
              <p>No other authentication methods available.</p>
            )}

          </div>


          <p className="mt-10 text-center text-sm text-gray-500">
            Not a member?{' '}
            <a href="/auth/register" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
              Register
            </a>
          </p>

         


        </div>
      </div>
    </>

     );
}

