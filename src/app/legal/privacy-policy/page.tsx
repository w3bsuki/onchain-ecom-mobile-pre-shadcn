import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy | Onchain Commerce',
  description: 'Our commitment to protecting your privacy and data security',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <div className="mb-8">
        <h1 className="font-bold mb-2 text-3xl">Privacy Policy</h1>
        <p className="text-gray-500">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
      </div>
      
      <div className="prose prose-gray max-w-none">
        <p className="text-lg">
          At Onchain Commerce, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or make purchases through our platform.
        </p>
        
        <h2 className="font-semibold mt-8 mb-4 text-2xl">Information We Collect</h2>
        
        <h3 className="font-medium mt-6 mb-2 text-xl">Personal Information</h3>
        <p>We may collect personal information that you voluntarily provide to us when you:</p>
        <ul className="list-disc ml-6 mt-2 mb-4">
          <li>Register an account</li>
          <li>Make a purchase</li>
          <li>Sign up for our newsletter</li>
          <li>Contact our customer service</li>
          <li>Participate in promotions or surveys</li>
        </ul>
        <p>This information may include:</p>
        <ul className="list-disc ml-6 mt-2 mb-4">
          <li>Name</li>
          <li>Email address</li>
          <li>Shipping and billing address</li>
          <li>Payment information</li>
          <li>Phone number</li>
        </ul>
        
        <h3 className="font-medium mt-6 mb-2 text-xl">Blockchain and Wallet Information</h3>
        <p>
          As an onchain commerce platform, we may collect information related to your blockchain transactions and wallet addresses. This information is stored on public blockchains and is not controlled by us.
        </p>
        
        <h3 className="font-medium mt-6 mb-2 text-xl">Automatically Collected Information</h3>
        <p>
          When you access our website, we may automatically collect certain information about your device and browsing actions, including:
        </p>
        <ul className="list-disc ml-6 mt-2 mb-4">
          <li>IP address</li>
          <li>Browser type and version</li>
          <li>Operating system</li>
          <li>Referring website</li>
          <li>Pages viewed and time spent</li>
          <li>Time and date of your visit</li>
          <li>Other analytical data</li>
        </ul>
        
        <h2 className="font-semibold mt-8 mb-4 text-2xl">How We Use Your Information</h2>
        <p>We may use the information we collect for various purposes, including:</p>
        <ul className="list-disc ml-6 mt-2 mb-4">
          <li>Processing and fulfilling your orders</li>
          <li>Managing your account</li>
          <li>Providing customer support</li>
          <li>Sending transaction confirmations</li>
          <li>Sending administrative information</li>
          <li>Sending marketing communications (with your consent)</li>
          <li>Improving our website and product offerings</li>
          <li>Conducting research and analysis</li>
          <li>Preventing fraudulent transactions</li>
          <li>Complying with legal obligations</li>
        </ul>
        
        <h2 className="font-semibold mt-8 mb-4 text-2xl">Sharing Your Information</h2>
        <p>We may share your information with:</p>
        <ul className="list-disc ml-6 mt-2 mb-4">
          <li>Service providers who help us operate our business</li>
          <li>Payment processors to complete transactions</li>
          <li>Shipping companies to deliver your orders</li>
          <li>Marketing partners (with your consent)</li>
          <li>Legal authorities when required by law</li>
        </ul>
        
        <h2 className="font-semibold mt-8 mb-4 text-2xl">Cookies and Tracking Technologies</h2>
        <p>
          We use cookies and similar tracking technologies to track activity on our website and to hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
        </p>
        
        <h2 className="font-semibold mt-8 mb-4 text-2xl">Data Security</h2>
        <p>
          We implement appropriate technical and organizational measures to protect the security of your personal information. However, please note that no method of transmission over the Internet or electronic storage is 100% secure.
        </p>
        
        <h2 className="font-semibold mt-8 mb-4 text-2xl">Your Rights</h2>
        <p>Depending on your location, you may have certain rights regarding your personal information, including:</p>
        <ul className="list-disc ml-6 mt-2 mb-4">
          <li>The right to access your personal information</li>
          <li>The right to rectify inaccurate information</li>
          <li>The right to request deletion of your information</li>
          <li>The right to restrict or object to processing</li>
          <li>The right to data portability</li>
          <li>The right to withdraw consent</li>
        </ul>
        
        <h2 className="font-semibold mt-8 mb-4 text-2xl">Changes to This Privacy Policy</h2>
        <p>
          We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
        </p>
        
        <h2 className="font-semibold mt-8 mb-4 text-2xl">Contact Us</h2>
        <p>
          If you have any questions or concerns about our Privacy Policy, please contact us at:
        </p>
        <p className="mt-2">
          <strong>Email:</strong> privacy@onchaincommerce.example
          <br />
          <strong>Address:</strong> 123 Blockchain Way, Web3 City, 98765
        </p>
        
        <div className="mt-10 pt-6 border-t border-gray-200">
          <p>
            <Link href="/" className="text-blue-600 hover:underline">
              ← Back to home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 