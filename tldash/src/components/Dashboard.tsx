"use client";


import { useState } from "react";
import { useSession} from "next-auth/react";
import LoginBanner from './LoginBanner'
import { Cog6ToothIcon } from  '@heroicons/react/24/solid';
import { HomeIcon } from  '@heroicons/react/24/solid';
import { InformationCircleIcon } from  '@heroicons/react/24/solid';
import UserSettings from './UserSettings'

export default function Dashboard() {

  const {data: session, status} = useSession();

  const [activeTab, setActiveTab] = useState("tldash");

   // Dummy data for shortened links history
  const fakeHistory = [
    {
      id: 1,
      originalUrl: "https://www.example.com/some-long-url",
      shortUrl: "https://bit.ly/short1",
      date: "2024-09-10",
      clicks: 12,
    },
    {
      id: 2,
      originalUrl: "https://another-example.com/this-is-a-longer-url",
      shortUrl: "https://bit.ly/short2",
      date: "2024-09-11",
      clicks: 28,
    },
    {
      id: 3,
      originalUrl: "https://yetanotherexample.com/super-long-url",
      shortUrl: "https://bit.ly/short3",
      date: "2024-09-12",
      clicks: 45,
    },
  ];

    // Calculate basic statistics
  const totalLinks = fakeHistory.length;
  const totalClicks = fakeHistory.reduce((sum, link) => sum + link.clicks, 0);
  const avgClicks = totalLinks > 0 ? (totalClicks / totalLinks).toFixed(2) : 0;
  const mostClickedLink = fakeHistory.reduce((max, link) => (link.clicks > max.clicks ? link : max), fakeHistory[0]);

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









  return(
    <>
        <main className="flex-grow flex flex-col ">

          <ul className="menu bg-base-200 lg:menu-horizontal rounded-box justify-center space-x-2">
            <li>
              <a onClick={() => setActiveTab("tldash")} className={` ${activeTab === "tldash" && "active"}`}>
                <HomeIcon className="size-5" />
                tldash
              </a>
            </li>
            <li>
              <a onClick={() => setActiveTab("history")} className={` ${activeTab === "history" && "active"}`}>
                <InformationCircleIcon className="size-5" />
                History
                <span className="badge badge-sm badge-success">hot</span>
              </a>
            </li>
            <li >
              <a onClick={() => setActiveTab("stats")} className={` ${activeTab === "stats" && "active"}`}>
                Stats
                <span className="badge badge-xs badge-info"></span>
              </a>
            </li>
            <li >
              <a onClick={() => setActiveTab("settings")} className={` ${activeTab === "settings" && "active"}`}>
                <Cog6ToothIcon className="size-5"/>
                Settings
              </a>
            </li>
          </ul>

          <div className="flex grow items-center justify-center ">

            {activeTab === "tldash" && ( 
              <div className="card w-96 bg-base-200/50 shadow-xl">
                <div className="card-body">
                  <h2 className="card-title text-3xl font-bold text-center mb-6">URLSnap</h2>

                  <div className="form-control mb-4">
                    <label className="label">
                      <span className="label-text">Enter your URL:</span>
                    </label>
                    <input
                      type="text"
                      placeholder="https://example.com"
                      className="input input-bordered w-full"
                    />
                  </div>

                  <div className="form-control">
                    <button className="btn btn-primary btn-block">
                      Shorten URL
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "history" && (
              <div className="card w-full bg-base-200/50 shadow-xl max-w-4xl">
                <div className="card-body">
                  <h2 className="card-title text-2xl font-bold bg-success px-2 py-1 rounded-md">Link History</h2>
                  <div className="overflow-x-auto">
                    <table className="table w-full">
                      <thead>
                        <tr>
                          <th>Original URL</th>
                          <th>Shortened URL</th>
                          <th>Date</th>
                          <th>Clicks</th>
                        </tr>
                      </thead>
                      <tbody>
                        {fakeHistory.map((link) => (
                          <tr key={link.id}>
                            <td>
                              <a href={link.originalUrl} target="_blank" className="link link-primary">
                                {link.originalUrl}
                              </a>
                            </td>
                            <td>
                              <a href={link.shortUrl} target="_blank" className="link link-secondary">
                                {link.shortUrl}
                              </a>
                            </td>
                            <td>{link.date}</td>
                            <td>{link.clicks}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}


            {activeTab === "stats" && (
            <div className="card w-full bg-base-200/50 shadow-xl max-w-4xl">
              <div className="card-body">
                <h2 className="card-title text-2xl font-bold bg-success px-2 py-1 rounded-md">Statistics</h2>


                <div className="stats shadow grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div className="stat">
                    <div className="stat-title">Links</div>
                    <div className="stat-value">{totalLinks}</div>
                    <div className="stat-desc">Total Links Shortened</div>
                  </div>
                  <div className="stat">
                    <div className="stat-title">Clicks</div>
                    <div className="stat-value">{totalClicks}</div>
                    <div className="stat-desc">Overall clicks achieved</div>

                  </div>
                  <div className="stat">
                    <div className="stat-title">Average Clicks per Link</div>
                    <div className="stat-value">{avgClicks}</div>
                    <div className="stat-desc">Avarage click per link</div>

                  </div>
                </div>

                <div className="card mt-8">
                  <div className="card-body">
                    <h2 className="card-title text-xl font-bold">Most Clicked Link</h2>
                      <p>
                        <a
                          href={mostClickedLink.originalUrl}
                          target="_blank"
                          className="link link-primary"
                        >
                          {mostClickedLink.originalUrl}
                        </a>{" "}
                        <span className="ml-2">({mostClickedLink.clicks} clicks)</span>
                      </p>
                      <p className="text-gray-500">Shortened: {mostClickedLink.shortUrl}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab ==="settings" && (
              
                <UserSettings />

              )}

          </div>


        </main>
    </>

  );
}
