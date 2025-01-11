import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full py-4 mt-auto border-t">
      <div className="mx-auto text-center text-sm text-gray-600">
        <p>© {new Date().getFullYear()} SleekPix Compressor. Build with ❤️ by <a href="https://github.com/aircrushin" target="_blank" rel="noopener noreferrer">aircrushin</a>.</p>
      </div>
    </footer>
  );
};

export default Footer;
