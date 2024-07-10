import React, { useState, useRef, useCallback } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';

// Define the API URL with the correct port
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3010';

const WerewolfSignInterpreter = () => {
  const [video, setVideo] = useState(null);
  const [interpretations, setInterpretations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef(null);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    setVideo(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.avi', '.mov', '.webm']
    },
    multiple: false
  });

  const handleInterpret = async () => {
    if (!video) {
      alert('Please upload a video first.');
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append('video', video);

    try {
      const apiUrl = `${API_URL}/api/interpret`;
      console.log('Calling API at:', apiUrl);

      const response = await axios.post(apiUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('API response:', response.data);
      setInterpretations(response.data.interpretations);
    } catch (error) {
      console.error('Error interpreting video:', error.response ? error.response.data : error.message);
      alert('An error occurred while interpreting the video. Check the console for more details.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <div className="container mx-auto p-4 max-w-2xl">
        <h1 className="text-3xl font-bold mb-6 text-center">Werewolf Sign Interpreter</h1>
        <div
            {...getRootProps()}
            className={`
          border-4 border-dashed rounded-lg p-8 mb-6 text-center cursor-pointer
          transition-all duration-300 ease-in-out
          ${isDragActive
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
            }
        `}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto mb-4 text-gray-400" size={48} />
          {isDragActive ? (
              <p className="text-lg font-semibold text-blue-500">Drop the video file here ...</p>
          ) : (
              <div>
                <p className="text-lg font-semibold mb-2">Drag and drop a video file here</p>
                <p className="text-gray-500">or click to select a file</p>
              </div>
          )}
        </div>
        {video && (
            <div className="mb-6">
              <p className="mb-2 font-semibold">Selected file: {video.name}</p>
              <video ref={videoRef} controls className="w-full rounded-lg shadow">
                <source src={URL.createObjectURL(video)} type={video.type} />
              </video>
            </div>
        )}
        <button
            onClick={handleInterpret}
            disabled={isLoading || !video}
            className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold
                   disabled:bg-gray-300 disabled:cursor-not-allowed
                   transition-colors duration-300 ease-in-out
                   hover:bg-blue-600"
        >
          {isLoading ? 'Interpreting...' : 'Interpret Signs'}
        </button>
        {interpretations.length > 0 && (
            <div className="mt-6">
              <h2 className="text-2xl font-semibold mb-3">Interpretation Results:</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300">
                  <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-4 border-b">Frame</th>
                    <th className="py-2 px-4 border-b">Sign</th>
                  </tr>
                  </thead>
                  <tbody>
                  {interpretations.map((sign, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                        <td className="py-2 px-4 border-b text-center">{index + 1}</td>
                        <td className="py-2 px-4 border-b text-center">{sign}</td>
                      </tr>
                  ))}
                  </tbody>
                </table>
              </div>
            </div>
        )}
      </div>
  );
};

export default WerewolfSignInterpreter;