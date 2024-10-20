'use client';

import { useState } from 'react';

const UploadForm = () => {
  const [file, setFile] = useState<File | null>(null);
  const [location, setLocation] = useState<string>('');
  const [problem, setProblem] = useState<string>('');
  const [solution, setSolution] = useState<string>('');
  const [uploading, setUploading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!file) {
      setErrorMessage('Please select a file to upload');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('location', location);
    formData.append('problem', problem);
    formData.append('solution', solution);

    setUploading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const response = await fetch('/api/image-upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setSuccessMessage('File uploaded successfully');
        console.log('Upload result:', result);
      } else {
        setErrorMessage(result.error || 'Failed to upload file');
      }
    } catch (error) {
      setErrorMessage('An error occurred while uploading the file');
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 bg-white rounded-lg shadow">
      <div className="mb-4">
        <label htmlFor="file" className="block mb-2 font-medium text-gray-700">
          Choose a file to upload
        </label>
        <input
          type="file"
          id="file"
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer focus:outline-none"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="location" className="block mb-2 font-medium text-gray-700">
          Location
        </label>
        <input
          type="text"
          id="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="block w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-lg focus:outline-none"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="problem" className="block mb-2 font-medium text-gray-700">
          Problem
        </label>
        <textarea
          id="problem"
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
          className="block w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-lg focus:outline-none"
        ></textarea>
      </div>

      <div className="mb-4">
        <label htmlFor="solution" className="block mb-2 font-medium text-gray-700">
          Solution
        </label>
        <textarea
          id="solution"
          value={solution}
          onChange={(e) => setSolution(e.target.value)}
          className="block w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-lg focus:outline-none"
        ></textarea>
      </div>

      {errorMessage && <p className="text-red-600 mb-4">{errorMessage}</p>}
      {successMessage && <p className="text-green-600 mb-4">{successMessage}</p>}

      <button
        type="submit"
        disabled={uploading}
        className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none"
      >
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
    </form>
  );
};

export default UploadForm;
