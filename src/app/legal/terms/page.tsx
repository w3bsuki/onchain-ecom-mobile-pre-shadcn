import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service | Onchain Commerce',
  description: 'The terms and conditions governing your use of our platform',
};

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <div className="mb-8">
        <h1 className="font-bold mb-2 text-3xl">Terms of Service</h1>
        <p className="text-gray-500">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
      </div>
      
      <div className="prose prose-gray max-w-none">
        <p className="text-lg">
          Welcome to Onchain Commerce. These Terms of Service ("Terms") govern your use of our website and services. By accessing or using our platform, you agree to be bound by these Terms.
        </p>
        
        <h2 className="font-semibold mt-8 mb-4 text-2xl">1. Account Registration</h2>
        <p>
          To access certain features of our platform, you may need to register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.
        </p>
        <p className="mt-2">
          You are responsible for safeguarding your account and password. You agree not to disclose your password to any third party and to take sole responsibility for any activities or actions under your account.
        </p>
        
        <h2 className="font-semibold mt-8 mb-4 text-2xl">2. Products and Purchases</h2>
        <p>
          All product descriptions, pricing, and availability are subject to change without notice. We reserve the right to limit quantities of any products or services that we offer.
        </p>
        <p className="mt-2">
          When you place an order, you offer to purchase the product at the price and quantity indicated. Our acceptance of your order takes place when we send you an order confirmation email.
        </p>
        
        <h2 className="font-semibold mt-8 mb-4 text-2xl">3. Blockchain and Cryptocurrency Transactions</h2>
        <p>
          Our platform may utilize blockchain technology and allow for cryptocurrency payments. By using these features, you acknowledge and accept the inherent risks associated with blockchain transactions.
        </p>
        <p className="mt-2">
          Cryptocurrency transactions are irreversible. We are not responsible for any loss of cryptocurrency due to user error, such as sending to an incorrect wallet address or using an incompatible wallet.
        </p>
        
        <h2 className="font-semibold mt-8 mb-4 text-2xl">4. User Content</h2>
        <p>
          You retain all rights to any content you submit, post, or display on or through our platform. By submitting, posting, or displaying content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, adapt, publish, and display such content.
        </p>
        <p className="mt-2">
          You agree not to post content that is illegal, harmful, threatening, abusive, defamatory, or otherwise objectionable.
        </p>
        
        <h2 className="font-semibold mt-8 mb-4 text-2xl">5. Intellectual Property</h2>
        <p>
          Our platform and its original content, features, and functionality are owned by Onchain Commerce and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
        </p>
        
        <h2 className="font-semibold mt-8 mb-4 text-2xl">6. Shipping and Returns</h2>
        <p>
          Shipping times and methods vary based on the products ordered and your location. For detailed information about our shipping policies, please refer to our Shipping Information page.
        </p>
        <p className="mt-2">
          We accept returns within 30 days of delivery for most products. For detailed information about our return process, please refer to our Returns Policy.
        </p>
        
        <h2 className="font-semibold mt-8 mb-4 text-2xl">7. Limitation of Liability</h2>
        <p>
          To the maximum extent permitted by law, Onchain Commerce shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use our platform or services.
        </p>
        
        <h2 className="font-semibold mt-8 mb-4 text-2xl">8. Governing Law</h2>
        <p>
          These Terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction], without regard to its conflict of law principles.
        </p>
        
        <h2 className="font-semibold mt-8 mb-4 text-2xl">9. Changes to Terms</h2>
        <p>
          We reserve the right to modify these Terms at any time. If we make material changes, we will provide notice through our platform or by other means. Your continued use of our platform after such changes constitutes your acceptance of the new Terms.
        </p>
        
        <h2 className="font-semibold mt-8 mb-4 text-2xl">10. Termination</h2>
        <p>
          We may terminate or suspend your account and access to our platform immediately, without prior notice or liability, for any reason, including breach of these Terms.
        </p>
        
        <h2 className="font-semibold mt-8 mb-4 text-2xl">11. Contact Information</h2>
        <p>
          If you have any questions about these Terms, please contact us at:
        </p>
        <p className="mt-2">
          <strong>Email:</strong> terms@onchaincommerce.example
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