import { useState, useEffect } from "react";
import { useSession} from "next-auth/react";
import axios from 'axios';


const Statistics = () => {
  const [statistics, setStatistics] = useState<any>(null);
  const {data: session, status} = useSession();


  const fetchStatisticsData = async () => {
    try {
        
      const res = await axios.get('/api/router/stats', {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          'Content-Type': 'application/json',
          'Accept': '*/*',
        },
      });

    //   fireAlert(res.data., 'info', 3000, 'bottom-right');
      setStatistics(res.data.data);
      console.error(res);

    } catch (err) {
    //   setError('Failed to fetch statistics data');
    console.error(err);
    } finally {
    //   setLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className='absolute inset-0 flex justify-center items-center'>
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  
  useEffect(() => {
    fetchStatisticsData();
  }, []);


    return (
        <>
            {statistics ? (

          <div className="card w-full bg-base-200/50 shadow-xl max-w-4xl">
              <div className="card-body">
                <h2 className="card-title text-2xl font-bold bg-base-300 px-2 py-1 rounded-md">Statistics</h2>


                <div className="stats shadow grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div className="stat">
                    <div className="stat-title">Links</div>
                    <div className="stat-value">{statistics.totalLinks}</div>
                    <div className="stat-desc">Total Links Shortened</div>
                  </div>
                  <div className="stat">
                    <div className="stat-title">Clicks</div>
                    <div className="stat-value">{statistics.totalClicks}</div>
                    <div className="stat-desc">Overall clicks achieved</div>

                  </div>
                  <div className="stat">
                    <div className="stat-title">Average Clicks per Link</div>
                    <div className="stat-value">{statistics.averageClicksPerLink.toFixed(3)}</div>
                    <div className="stat-desc">Avarage click per link</div>

                  </div>
                </div>

                <div className="card mt-8">
                  <div className="card-body">
                    <h2 className="card-title text-xl font-bold">Most Clicked Link</h2>

                    
                    {statistics.mostClickedLink ? ( // Check if mostClickedLink exists
                        <>
                            <p>
                            <a href={statistics.mostClickedLink?.originalUrl} target="_blank" className="link link-primary">
                                {statistics.mostClickedLink?.originalUrl}
                            </a>
                            <span className="ml-2">({statistics.mostClickedLink?.clicks} clicks)</span>
                            </p>
                            <p className="text-gray-500">Shortened: {statistics.mostClickedLink?.shortenedUrl}</p>
                        </>
                        ) : (
                        <p>No most clicked link available.</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>


              ): (
                <div>No statistics data</div>
              )}
        </>
    );

}

export default Statistics;
