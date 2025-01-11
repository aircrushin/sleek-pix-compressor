import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full py-4 mt-auto border-t dark:border-gray-800">
      <div className="mx-auto text-center text-sm text-gray-600 dark:text-gray-400">
        <p>
          © {new Date().getFullYear()} SleekPix Compressor. Build with ❤️ by{' '}
          <a
            href="https://github.com/aircrushin"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            aircrushin
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
