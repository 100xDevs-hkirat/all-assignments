import React from 'react';

const NoMatch = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <div className="m-auto bg-white rounded-lg p-8 shadow-md">
        <h2 className="text-xl font-semibold mb-4">404 - Page Not Found</h2>
        <p className="text-gray-600">
          The requested page could not be found. Please check the URL or navigate back to the homepage.
        </p>
        <button
          className="mt-4 bg-blue-500 text-white rounded-lg py-2 px-4 font-medium hover:bg-blue-600"
          onClick={() => window.history.back()}
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default NoMatch;
