import { getProviders, signIn } from "next-auth/react";

export default function SignIn({ providers }: any) {
  return (
    <div>
      <h1>Sign in</h1>
      {/* Render the sign-in form for your custom provider */}
      <form method="post" action="/api/auth/callback/credentials">
        <input name="username" type="text" placeholder="Your username" />
        <input name="password" type="password" placeholder="Your password" />
        <button type="submit">Sign in with AuthTL</button>
      </form>

      {/* Alternatively, show buttons for OAuth providers like Google/GitHub */}
      {Object.values(providers).map((provider: any) =>
        provider.id !== "authtl" ? (
          <div key={provider.name}>
            <button onClick={() => signIn(provider.id)}>Sign in with {provider.name}</button>
          </div>
        ) : null
      )}
    </div>
  );
}

SignIn.getInitialProps = async () => {
  const providers = await getProviders();
  return { providers };
};

