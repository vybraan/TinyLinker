import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';


const SecuritySettings = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const { data: session } = useSession();


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('/api/account/security', {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        });

        setUserData(response.data.data);
      } catch (err) {
        setError('Failed to fetch user data');
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const toggleTwoFactorAuth = () => {
    userData.twoFactorEnabled = !userData.twoFactorEnabled; 
    setIsEditing(false);
  }

  if (loading) return <div className='absolute inset-0 flex justify-center items-center'>
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>;
  if (error) return <p>{error}</p>;

  return (
    <div className='w-full flex-grow px-2'>
      {isEditing ? (
        <h1 className='font-bold text-3xl'>Editing Preferences</h1>
      ) : (
        <h1 className='font-bold text-3xl'>Security</h1>
      )}

      <div className="divider"></div>

      {userData && (
        <div>

          {/* E-mail Confirmation Status */}
          {!userData.emailConfirmed ? (
              <div role="alert" className="alert alert-warning flex items-center bg-yellow-100 text-yellow-800 p-4 rounded-lg mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span className="font-medium">Your email is not confirmed!</span>
                <button disabled className="ml-auto btn btn-sm btn-outline btn-warning">
                  Resend Email
                </button>
              </div>
            ) : (
              <div role="alert" className="alert alert-success flex items-center bg-green-100 text-green-800 p-4 rounded-lg mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-medium">Email confirmed!</span>
              </div>
            )}

            {/* Two-Factor Authentication Toggle */}
            <div className="flex max-w-xs gap-3 py-3 items-center mb-6">
              <span className="font-medium label-text">2 Factor Authentication</span>
              <label className="switch flex justify-center">
                <input
                  disabled
                  type="checkbox"
                  checked={userData.twoFactorEnabled}
                  className="toggle toggle-sm toggle-primary"
                  onChange={toggleTwoFactorAuth}
                />
              </label>
            </div>

            {/* Data Sharing Permission Section */}
            <div className="mb-6">
              <h3 className=" label-text font-medium">Data Sharing</h3>
              <p className="text-sm text-gray-600 mb-2">
                Allow or disallow the sharing of your data for personalized services and offers.
              </p>
              <label className="flex items-center space-x-3">
                <input type="checkbox" disabled checked={userData.dataSharingAllowed} className="checkbox checkbox-sm checkbox-primary"
                  //onChange={toggleDataSharing} // Function to toggle data sharing
                />
                <span className="font-medium label-text">Allow data sharing</span>
              </label>
            </div>

            {/* Save Security Settings Button */}
            <div className="flex justify-start">
              <button disabled className="btn btn-sm btn-primary w-full max-w-xs" > {/*onClick={saveSecuritySettings}*/}
                Save Changes
              </button>
            </div>



          {/* // {userData.emailConfirmed} */}
          {/* /{ userData.dataSharingEnabled && ("True" : "False");} */}
        </div>
      )}
    </div>
  );
};

export default SecuritySettings;
