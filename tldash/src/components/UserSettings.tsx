import React from 'react';
import ProfileSettings from './ProfileSettings'
import SecuritySettings from './SecuritySettings'
import PreferencesSettings from './PreferencesSettings'
import { UserIcon, AdjustmentsHorizontalIcon, ShieldCheckIcon} from  '@heroicons/react/24/solid';
import { useState } from "react";


const UserSettings = () => {

  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className='w-full flex flex-grow py-4'>

      <ul className="menu bg-base-200 rounded-box w-16 lg:w-56 space-y-2 flex-none">
        <li>
          <a onClick={() => setActiveTab("profile")} className={` ${activeTab === "profile" && "active"}`}>
            <UserIcon className="size-5" />
            <span className="hidden lg:block">
            Profile
            </span>
          </a>
        </li>
        <li>
          <a onClick={() => setActiveTab("preferences")} className={` ${activeTab === "preferences" && "active"}`}>
          <AdjustmentsHorizontalIcon className="size-5" />
            <span className="hidden lg:block">
            Preferences  
            </span>
          </a>
        </li>
        <li>
          <a onClick={() => setActiveTab("security")} className={` ${activeTab === "security" && "active"}`}>
          <ShieldCheckIcon className="size-5" />
            <span className="hidden lg:block">
            Security    
            </span>
          </a>
        </li>
      </ul>



      {activeTab === "profile" && ( 
        <ProfileSettings/>
      )}

      {activeTab === "preferences" && ( 
        <PreferencesSettings/>
      )}

      {activeTab === "security" && ( 
        <SecuritySettings/>
      )}

      {/* <span>hello</span> */}





    </div>
  );
};

export default UserSettings;



