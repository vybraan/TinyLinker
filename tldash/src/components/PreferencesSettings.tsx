import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';

const PreferencesSettings = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [preferredTheme, setPreferredTheme] = useState('cupcake');
  const [preferredLanguage, setPreferredLanguage] = useState('en');
  const [shorteningMethod, setShorteningMethod] = useState('random');
  const [isEditing, setIsEditing] = useState(false);


  const { data: session, status } = useSession();

  const fetchUserData = async () => {
    try {
      const response = await axios.get('/api/account/preferences', {
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
  }

  useEffect(() => {
    
    fetchUserData();
  }, []);




  if (loading) return (
    <div className='absolute inset-0 flex justify-center items-center'>
      <span className="loading loading-spinner loading-lg text-primary"></span>
    </div>);
    if (error) return <p>{error}</p>;




  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setPreferredLanguage(event.target.value);
  };
  const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {

    setPreferredTheme(event.target.value);
  };
  const handleShorteningMehodChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setShorteningMethod(event.target.value);
  };


  
  


  const savePreferences = async () => {

    try{

      const res = await axios.put('/api/account/preferences', {
        preferredTheme,
        preferredLanguage,
        shorteningMethod,
      }, {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          'Content-Type': 'application/json',
          'Accept': '*/*',
        },
      });

      console.error(res);
      setIsEditing(false);
      fetchUserData();

      

    }
    catch(error){
      alert(error);
    }

  }


  return (
    <div className='w-full flex-grow px-2'>
      {isEditing ? (
        <h1 className='font-bold text-3xl'>Editing Preferences</h1>
      ) : (
        <h1 className='font-bold text-3xl'>Preferences</h1>
      )}

      <div className="divider"></div>

      {userData && (
        <div>



      <div className="grid grid-cols-1 gap-3">
        {/* Preferred Theme */}
        <div className="form-control w-full max-w-4xl">
          <label className="label">
            <span className="label-text">Preferred Theme</span>
          </label>

          {isEditing ? (
            <select  onChange={handleThemeChange} value={preferredTheme} className="select select-sm select-bordered">
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="cupcake">Cupcake</option>
              <option value="cyberpunk">Cyberpunk</option>
            </select>

          ) : (
            <p className="text-lg">{userData.preferredTheme}</p>
          )}
        </div>

        {/* Default Language */}
        <div className="form-control  w-full max-w-4xl">
          <label className="label">
            <span className="label-text">Default Language</span>
          </label>
          {isEditing ? (
            <select  onChange={handleLanguageChange} value={preferredLanguage} className="select select-sm select-bordered">
              <option value="en">English</option>
              <option value="pt">Portuguese</option>
              <option value="fr">French</option>
            </select>
          ) : (
            <p className="text-lg">{userData.preferredLanguage}</p>
          )}
        </div>

        {/* Shortening Method */}
        <div className="form-control  w-full max-w-4xl">
          <label className="label">
            <span className="label-text">Shortening Method</span>
          </label>
          {isEditing ? (
          <select onChange={handleShorteningMehodChange} value={shorteningMethod} className="select select-sm select-bordered">
            <option value="custom">Custom</option>
            <option value="random">Random</option>
          </select>

          ) : (
            <p className="text-lg">{userData.shorteningMethod}</p>
          )}
        </div>

        {/* Edit and Save Buttons */}
        <div className="form-control mt-4  w-full max-w-4xl">
          {isEditing ? (
            <div className='grid grid-cols-2 gap-2'>
              <button onClick={savePreferences} className="btn btn-sm btn-primary w-full max-w-xs">Save Preferences</button>
              <button className="btn btn-sm btn-primary w-full max-w-xs" onClick={() => setIsEditing(false)}>Cancel</button>
            </div>
          ) : (
            <button className="btn btn-sm btn-primary w-full max-w-xs" onClick={() => setIsEditing(true)}>
              Edit Preferences
            </button>
          )}
        </div>
      </div>


        </div>
      )}
    </div>
  );
};

export default PreferencesSettings;
