
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white py-6 mt-auto">
      <div className="container mx-auto text-center text-gray-600">
        © {new Date().getFullYear()} HKIS Prom. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
