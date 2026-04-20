import React from 'react';
import useGlobalLoading from '../hooks/useGlobalLoading';

const GlobalLoading: React.FC = () => {
  const [loading] = useGlobalLoading();

  return (
    <>
      {loading ? (
        <div className="fixed top-0 left-0 z-9999999 w-screen h-screen flex items-center justify-center bg-gray-200 opacity-50">
          <span className="loading loading-spinner text-primary loading-lg"></span>
        </div>
      ) : null}
    </>
  );
};

export default GlobalLoading;
