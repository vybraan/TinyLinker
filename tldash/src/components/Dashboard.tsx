"use client";


import { useState } from "react";
import { useSession} from "next-auth/react";
import LoginBanner from './LoginBanner'
import { Cog6ToothIcon } from  '@heroicons/react/24/solid';
import { HomeIcon } from  '@heroicons/react/24/solid';
import { InformationCircleIcon } from  '@heroicons/react/24/solid';
import UserSettings from './UserSettings'
import axios from 'axios';
import History  from './History';
import Statistics  from './Statistics';



export default function Dashboard() {

  const {data: session, status} = useSession();

  const [activeTab, setActiveTab] = useState("tldash");
  const [originalUrl, setOriginalUrl] = useState();
  const [shortUrl, setShortUrl] = useState("");

  const [copySuccess, setCopySuccess] = useState(""); // State to handle copy success


  if (status === 'loading') {
    return (
      <div className="flex-grow flex items-center justify-center">
        <span className="loading loading-dots loading-lg"></span>
      </div>);
  }

  if (!session) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center">
        <LoginBanner/>
      </div>
    );
  }

  const copyToClipboard = () => {
    if (shortUrl) {
      navigator.clipboard.writeText(shortUrl)
        .then(() => {
          setCopySuccess("Copied to clipboard!");
          setTimeout(() => setCopySuccess(false), 2000);
        })
        .catch(() => {
          setCopySuccess("Failed to copy!");
          setTimeout(() => setCopySuccess(false), 2000);

        });
    }
  };
  
  const shorten = async () => {

    try{

      // alert(originalUrl);
      const res = await axios.post('/api/shorten/ourl', {
        originalUrl,
      }, {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          'Content-Type': 'application/json',
          'Accept': '*/*',
        },
      });

      const baseUrl = window.location.origin; // Get the base URL from the request host
      const shortCode = res.data.data.shortCode; // Assuming 'data' contains the shortcode
      const fullShortenedUrl = `${baseUrl}/tl/${shortCode}`;

      setShortUrl(fullShortenedUrl); // Keep shortcode separate if needed
      setOriginalUrl(""); // Clear original URL input

      document.getElementById('my_modal_2').showModal(); // Open the modal

      console.error(res.data.data);



      

    }
    catch(error){
      // alert(error);
      // console.error(error.status);


    }

  }









  return(
    <>
      
        <main className="flex-grow flex flex-col ">

          <ul className="menu bg-base-200 menu-horizontal rounded-box justify-center space-x-2"> {/*lg:menu-horizontal*/}
            <li>
              <a onClick={() => setActiveTab("tldash")} className={` ${activeTab === "tldash" && "active"}`}>
                <HomeIcon className="size-5" />
                <span className="hidden lg:block">
                  tldash
                </span>
              </a>
            </li>
            <li>
              <a onClick={() => setActiveTab("history")} className={` ${activeTab === "history" && "active"}`}>
                <InformationCircleIcon className="size-5" />
                <span className="hidden lg:block">
                  History
                  <span className="badge badge-sm badge-success">hot</span>
                </span>
              </a>
            </li>
            <li >
              <a onClick={() => setActiveTab("stats")} className={` ${activeTab === "stats" && "active"}`}>
                {/* <span className="hidden lg:block"> */}
                  Stats
                  <span className="badge badge-xs badge-info"></span>
                {/* </span> */}
              </a>
            </li>
            <li >
              <a onClick={() => setActiveTab("settings")} className={` ${activeTab === "settings" && "active"}`}>
                <Cog6ToothIcon className="size-5"/>
                <span className="hidden lg:block">
                Settings
                </span>
              </a>
            </li>
          </ul>

          <div className={`flex relative flex-col grow items-center justify-center ${activeTab === "tldash"  ? "bg-gradient-to-r from-purple-600 via-pink-500 to-red-500" : ""}`}>

          <div className="absolute pointer-events-none inset-0 overflow-hidden">
            <div className="absolute bg-gradient-radial from-white/20 to-transparent rounded-full w-72 h-72 animate-pulse-slow opacity-70 top-10 left-10"></div>
            <div className="absolute bg-gradient-radial from-white/20 to-transparent rounded-full w-52 h-52 animate-pulse-slow opacity-40 top-20 left-52"></div>
            <div className="absolute bg-gradient-radial from-white/20 to-transparent rounded-full w-96 h-96 animate-pulse-slow opacity-50 bottom-20 right-20"></div>
            <div className="absolute bg-gradient-radial from-white/20 to-transparent rounded-full w-80 h-80 animate-pulse-slow opacity-60 top-20 right-40"></div>
          </div>


            {activeTab === "tldash" && ( 
              <>



                <div className="relative z-10 text-center mb-5">
                  <h1 className="text-5xl text-white font-extrabold tracking-tight">
                    Seamlessly Shortening Your URLs
                  </h1>
                  <p className="mt-4 text-lg text-white opacity-90">
                    A Modern Powerful URL Shortening Service with Microservice Architecture.
                  </p>
                </div>




                <dialog id="my_modal_2" className="modal">
                  <div className="modal-box">
                    <div>

                    <h3 className="font-bold text-lg">Shortened URL</h3>
                    <div className="flex items-center justify-center p-2">
                      {copySuccess && <p className="text-success-500 mt-2">{copySuccess}</p>}

                    </div>
                    <p className="py-4">Your shortened URL is:</p>
                    <input 
                      type="text" 
                      value={shortUrl} 
                      readOnly 
                      className="input input-bordered w-full" 
                    />
                    <div className="flex gap-3 p-2 mt-2 items-center">
                      <button className="btn  btn-primary" onClick={copyToClipboard}>Copy</button>
                      <a href={shortUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">Open</a>

                    </div>



                    </div>
                  </div>
                  <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                  </form>
                </dialog>




                <div className="card w-96 bg-base-200/50 shadow-xl">
                  <div className="card-body">
                    <h2 className="card-title text-3xl font-bold text-center mb-6">Enter your URL:</h2>
                    <div className="form-control mb-4">
                      <label className="label">
                        {/* <span className="label-text">Enter your URL:</span> */}
                      </label>
                      <input
                        onChange={(e)=> {setOriginalUrl(e.target.value)}} value={originalUrl}
                        type="text"
                        placeholder="https://example.com"
                        className="input input-bordered w-full"
                      />
                    </div>

                    <div className="form-control">
                      <button onClick={shorten} className="btn btn-primary btn-block">
                        Shorten
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === "history" && (
              <History />
            )}


            {activeTab === "stats" && (
              <Statistics/>
  
              )}

              {activeTab ==="settings" && (
              
                <UserSettings />

              )}

          </div>


        </main>
    </>

  );
}
