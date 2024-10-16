'use client';

import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { getProviders, useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import axios from 'axios';


export default function Register() {
  const [providers, setProviders] = useState(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [registerProgress, setRegisterProgress] = useState(false);
  const [showToast, setShowToast] = useState(false);



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
    return (
        <div className='absolute inset-0 flex justify-center items-center'>
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterProgress(true);
  
    try {
      const res = await axios.post('/api/register', {
        username: username,
        email: email,
        password: password,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': '*/*',
        },
      });
  
      const data = res.data;
      
      setRegisterProgress(false); // Stop loading state
  
      if (res.status === 201) {
        setShowToast(true); // Show toast on success
        setTimeout(() => setShowToast(false), 2000);

        setTimeout(() => window.location.href = '/auth/signin',3000);

      } else {
        const errorMessage = data.message || "Registration failed. Please check your inputs.";
        // alert(errorMessage);
        setError(errorMessage);
      }
    } catch (error: unknown) {
      setRegisterProgress(false); // Stop loading state
  
      const errorMessage = error.response?.data?.message || error.message || 'An error occurred during registration.';
      // alert(errorMessage);
      setError(errorMessage);
      console.error('Registration error:', error.toString());
    }
  };
  



return (

     <>

      {showToast && (
        <div className="toast toast-top toast-end">

          <div role="alert" className="alert">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="stroke-info h-6 w-6 shrink-0">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>Account created successfully.</span>
          </div>

        </div>
      )}

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
            Create  new account
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
                  <span className="label-text">Username</span>
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
                    disabled={registerProgress}
                    className="input input-bordered input-primary w-full input-sm"
                  />
              </div>

              <div className="w-full form-control">
                <div className="label">
                  <span className="label-text">Email</span>
                </div>
                  <input
                    name="email"
                    type="text"
                    placeholder="Your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    id="email"
                    required
                    autoComplete="email"
                    disabled={registerProgress}
                    className="input input-bordered input-primary w-full input-sm"
                  />
              </div>

              <div className="form-control w-full">
                <div className="label">
                  <div htmlFor="password" className="label-text">
                    Password
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
                  disabled={registerProgress}
                  autoComplete="current-password"
                  className="input input-bordered input-primary w-full input-sm"
                />
              </div>

              <div>
                <button
                  type="submit"
                  className="flex btn btn-primary w-full btn-sm"
                   disabled={registerProgress}
                >
                  Register
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
            Already a member?{' '}
            <a href="/auth/signin" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
              Login
            </a>
          </p>

         


        </div>
      </div>
    </>

     );
}

