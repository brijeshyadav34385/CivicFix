import React from "react";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-5">
      <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">

        {/* Left Side */}
        <p className="text-gray-400">
          © 2026 CivicFix. All Rights Reserved.
        </p>

        {/* Right Side */}
        <div className="flex gap-6 text-2xl">
          <a
            href="https://github.com/brijeshyadav34385"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-400"
          >
            <FaGithub />
          </a>

          <a
            href="https://www.linkedin.com/in/brijesh-kumar-a9a7752a0"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-400"
          >
            <FaLinkedin />
          </a>

          <a href="mailto:by6080199@gmail.com" className="hover:text-blue-400">
            <FaEnvelope />
          </a>
        </div>

      </div>
    </footer>
  );
}

export default Footer;