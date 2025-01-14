import React from 'react';

const PulseLoader: React.FC = () => {
  return (
    <div className="pulse-loader">
      <span />
      <span />
      <span />
      <style>
        {`
          .pulse-loader {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 8px;
          }

          .pulse-loader span {
            width: 10px;
            height: 10px;
            background-color: #4c86f9;
            border-radius: 50%;
            animation: pulse 1.5s infinite ease-in-out;
          }

          .pulse-loader span:nth-child(2) {
            animation-delay: 0.3s;
          }

          .pulse-loader span:nth-child(3) {
            animation-delay: 0.6s;
          }

          @keyframes pulse {
            0%, 80%, 100% {
              transform: scale(0);
              opacity: 0.3;
            }
            40% {
              transform: scale(1);
              opacity: 1;
            }
          }
        `}
      </style>
    </div>
  );
};

export default PulseLoader;
