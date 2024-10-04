import { useState, useEffect } from "react";
import { useSession} from "next-auth/react";
import axios from 'axios';


const formatDate = (dateString: string) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    return new Date(dateString).toLocaleString(undefined, options);
  };
  


const History = () => {
  const [history, setHistory] = useState();
  const {data: session, status} = useSession();


  const fetchHistoryData = async () => {
    try {
        
      // alert(originalUrl);
      const res = await axios.get('/api/shorten/ourl', {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          'Content-Type': 'application/json',
          'Accept': '*/*',
        },
      });

      // fireAlert(res.data., 'info', 3000, 'bottom-right');
      setHistory(res.data.data);
      console.error(res);

    } catch (err) {
    //   setError('Failed to fetch history data');
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
    fetchHistoryData();
  }, []);


    return (
        <>
            {history ? (
            <div className="card w-full bg-base-200/50 shadow-xl max-w-5xl my-3">
                <div className="card-body">
                  <h2 className="card-title text-2xl font-bold active px-2 py-1 rounded-md">Shortening History</h2>
                  <div className="overflow-x-auto">
                    <table className="table w-full">
                      <thead>
                        <tr>
                          <th>Original URL</th>
                          <th>Shortened URL</th>
                          <th>Created At</th>
                          <th>Expires At</th>
                        </tr>
                      </thead>
                      <tbody>
                        {history.map((link) => (
                          <tr key={link.id}>
                            <td className=" max-w-xs text-ellipsis  truncate text-wrap">
                              <a href={link.originalUrl} target="_blank" className="link link-primary">
                                {link.originalUrl}
                              </a>
                            </td>
                            <td>
                              <a href={'tl/' +link.shortCode} target="_blank" className="link link-secondary">
                                {link.shortCode}
                              </a>
                            </td>
                            <td>{formatDate(link.createdAt)}</td>
                            <td>{formatDate(link.expirationDate)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              ): (
                <div>No history data</div>
              )}
        </>
    );

}

export default History;
