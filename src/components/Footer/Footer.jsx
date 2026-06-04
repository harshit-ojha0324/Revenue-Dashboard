import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white dark:bg-gray-900 px-6 py-4 border-t border-gray-200 dark:border-gray-800">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          © {currentYear} Sales Dashboard. All rights reserved.
        </div>
        <div className="mt-2 md:mt-0 flex space-x-4">
          <a
            href="#terms"
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
            onClick={(e) => e.preventDefault()}
          >
            Terms of Service
          </a>
          <a
            href="#privacy"
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
            onClick={(e) => e.preventDefault()}
          >
            Privacy Policy
          </a>
          <a
            href="#contact"
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
            onClick={(e) => e.preventDefault()}
          >
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;