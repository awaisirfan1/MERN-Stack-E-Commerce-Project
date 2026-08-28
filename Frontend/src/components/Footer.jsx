import React from "react";
import { BsInstagram, BsTwitter, BsYoutube } from "react-icons/bs";
import { FaFacebook } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="w-full mt-8">
      <hr className="border border-gray-300 dark:border-gray-700" />
      <div className="container mx-auto px-6 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 flex-col md:flex-row justify-between items-center">
            <h1 className="text-xl font-bold">QuickCart</h1>
            <p className="text-sm">
              Yout one stop shop for everything you neeed.
            </p>
          </div>
          <div className="flex flex-wrap justify-center md:justify-end gap-4">
            <a href="" className="text-sm hover:text-underline">
              About Us
            </a>
            <a href="" className="text-sm hover:text-underline">
              Contact
            </a>
            <a href="" className="text-sm hover:text-underline">
              Privacy Policy
            </a>
            <a href="" className="text-sm hover:text-underline">
              Term & Condition
            </a>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm">Follow us:</p>
          <div className="flex justify-center gap-4 mt-2">
            <a href="" className="hover:opacity-75">
              <FaFacebook />
            </a>
            <a href="" className="hover:opacity-75">
              <BsTwitter />
            </a>
            <a href="" className="hover:opacity-75">
              <BsInstagram />
            </a>
            <a href="" className="hover:opacity-75">
              <BsYoutube />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
