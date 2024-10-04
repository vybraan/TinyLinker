import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';

const ProfileSettings = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [phoneNumber, setPhoneNumber] = useState();




  const { data: session, status } = useSession();

  const fetchUserData = async () => {
    try {
      const response = await axios.get('/api/account/profile', {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      });

      setUserData(response.data.data);
      setFirstName(response.data.data.firstName);
      setLastName(response.data.data.lastName);
      setPhoneNumber(response.data.data.phoneNumber);

    } catch (err) {
      setError('Failed to fetch user data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  
  
  const saveProfile = async () => {

    try{

      const res = await axios.put('/api/account/profile', {
        firstName,
        lastName,
        phoneNumber,
      }, {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          'Content-Type': 'application/json',
          'Accept': '*/*',
        },
      });

      console.error(res);
      // alert(firstName + " " +lastName +" "+ phoneNumber);
      setIsEditing(false);
      fetchUserData();

      

    }
    catch(error){
      alert(error);
      console.error(error);
    }

  }

  
  const handleFirstNameChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFirstName(event.target.value);
  };
  
  const handleLastNameChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setLastName(event.target.value);
  };
  
  const handlePhoneNumberChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setPhoneNumber(event.target.value);
  };




  if (loading) return (
    <div className='absolute inset-0 flex justify-center items-center'>
      <span className="loading loading-spinner loading-lg text-primary"></span>
    </div>);
    
    if (error) return <p>{error}</p>;

  return (
    <div className='w-full flex-grow px-2'>
      {isEditing ? (
        <h1 className='font-bold text-3xl'>Editing Profile</h1>
      ) : (
        <h1 className='font-bold text-3xl'>Profile</h1>
      )}

      <div className="divider"></div>


      {userData && (
        <div className=''>

        {/* avatar */}
        <div className="form-control w-full max-w-4xl"> 
          {isEditing ? (
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">Choose a profile picture</span>
              </div>
              <input type="file" className="file-input  file-input-bordered w-full max-w-xs" />  
            </label>

          ) : (
            <div className="avatar">
              <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img src={userData.profilePictureUrl || '/favicon.ico'} alt="Profile Picture" />
              </div>
            </div>
          )}
        </div>

         


          <label className="form-control w-full max-w-4xl">
            <div className="label">
              <span className="label-text">Email</span>
            </div>
            {isEditing ? (
              <>
                <input type="text" value={userData.email} placeholder="Type here" disabled className="input input-sm input-bordered w-full max-w-4xl" />
                <div className="label">
                  <span className="label-text-alt">This cannot be changed</span>
                </div>
              </>
              ) : (
                <p className="text-lg">{userData.email}</p>
              )}

          </label>

          <label className="form-control w-full max-w-4xl">
            <div className="label">
              <span className="label-text">Username</span>
            </div>
            {isEditing ? (
              <>
              <input type="text" value={userData.userName} placeholder="Type here" disabled className="input input-sm input-bordered w-full max-w-4xl" />
              <div className="label">
                <span className="label-text-alt">This cannot be changed</span>
              </div>
              </>
              ) : (
                <p className="text-lg">{userData.userName}</p>
              )}
            
          </label>



          <div className={isEditing ? 'flex flex-col lg:space-x-2 lg:flex-row' : ''}>

            <div className="form-control  w-full max-w-4xl">
              <label className="label">
                <span className="label-text">First Name</span>
              </label>
              {isEditing ? (
                <input type="text" disabled={!isEditing} onChange={handleFirstNameChange} value={firstName} name='firstName' placeholder="first name" className="input input-sm input-bordered w-full max-w-xs" />
              ) : (
                <p className="text-lg">{userData.firstName}</p>
              )}
            </div>


            <div className="form-control  w-full max-w-4xl">
              <label className="label">
                <span className="label-text">Last Name</span>
              </label>
              {isEditing ? (
                <input type="text" disabled={!isEditing} onChange={handleLastNameChange} value={lastName} name='lastName' placeholder="last name" className="input input-sm input-bordered w-full max-w-xs" />
              ) : (
                <p className="text-lg">{userData.lastName}</p>
              )}
            </div>

          </div>

          
          <div className="form-control  w-full max-w-4xl">
            <label className="label">
              <span className="label-text">Phone Number</span>
            </label>
            {isEditing ? (
              <input type="text" disabled={!isEditing} onChange={handlePhoneNumberChange} value={phoneNumber} name='phoneNumber'  placeholder="Type here" className="input input-sm input-bordered w-full max-w-4xl" />
            ) : (
              <p className="text-lg">{userData.phoneNumber}</p>
            )}
          </div>


            {!isEditing ? (
            <button className="btn btn-sm btn-primary w-full max-w-xs mt-4" onClick={() => setIsEditing(true)}>
              Edit Profile
            </button>
          ) : (
            <button className="btn btn-sm btn-primary w-full max-w-xs mt-4" onClick={saveProfile}>
              Save Profile
            </button>
          )}


        </div>
      )}
    </div>
  );
};

export default ProfileSettings;
