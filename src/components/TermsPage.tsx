import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import './TermsPage.css';

const TermsPage: React.FC = () => {
  return (
    <div className="terms-page">
      <Navbar showBackButton={true} />

      {/* Content */}
      <main className="terms-content">
        <div className="terms-container">
          <h1>Terms of Service</h1>
          
          <p className="terms-subtitle"><strong>APItome: preview — Terms of Service</strong></p>
          <p className="terms-date"><em>Last Updated: February 9, 2026</em></p>
          
          <p className="terms-intro">
            By accessing or using APItome: preview ("the Service"), you agree to be bound by these Terms of Service ("Terms"). 
            If you do not agree to these Terms, do not use the Service.
          </p>

          <hr className="terms-divider" />

          <section className="terms-section">
            <h2>1. Description of Service</h2>
            <p>
              APItome: preview is a tool that allows users to submit publicly accessible API documentation URLs. The Service crawls, 
              parses, indexes, and caches the content from these URLs to provide an AI-powered chatbot experience for querying 
              across multiple API documentations. The Service is provided "as is" and is intended for informational and educational 
              purposes only.
            </p>
          </section>

          <section className="terms-section">
            <h2>2. User Responsibilities</h2>
            <p>By using the Service, you represent and warrant that:</p>
            <ul>
              <li>
                You will only submit URLs to <strong>publicly accessible</strong> API documentation pages. You will not submit 
                URLs that require authentication, are behind paywalls, or are otherwise restricted.
              </li>
              <li>You have the right or permission to access and use the content at the URLs you submit.</li>
              <li>
                You will not submit URLs containing sensitive, confidential, proprietary, or personally identifiable information.
              </li>
              <li>
                You will not use the Service for any unlawful, harmful, or abusive purpose, including but not limited to 
                attempting to overload, disrupt, or reverse-engineer the Service.
              </li>
              <li>
                You are solely responsible for ensuring that your use of the submitted content complies with the terms of service, 
                licenses, and usage policies of the respective API documentation providers.
              </li>
            </ul>
          </section>

          <section className="terms-section">
            <h2>3. Content Indexing and Caching</h2>
            <ul>
              <li>
                The Service may temporarily index and cache content retrieved from submitted URLs for up to <strong>7 days</strong> to 
                improve performance and response quality.
              </li>
              <li>
                Cached content is used solely to facilitate chatbot responses and is not redistributed, sold, or made publicly available.
              </li>
              <li>The Service does not claim any ownership over the content retrieved from submitted URLs.</li>
              <li>
                If you are a content owner and believe your content has been indexed without authorization, please contact us 
                (see Section 11) and we will promptly remove it.
              </li>
            </ul>
          </section>

          <section className="terms-section">
            <h2>4. AI-Generated Responses</h2>
            <ul>
              <li>
                Responses provided by the chatbot are generated using AI (large language models) and are based on the indexed 
                documentation content.
              </li>
              <li>
                <strong>AI-generated responses may be inaccurate, incomplete, outdated, or misleading.</strong> The Service does not 
                guarantee the correctness, reliability, or completeness of any response.
              </li>
              <li>
                You should always verify AI-generated information against the official API documentation before using it in any 
                project, production system, or decision-making process.
              </li>
              <li>
                The Service is not a substitute for reading official documentation, and responses should not be treated as authoritative.
              </li>
            </ul>
          </section>

          <section className="terms-section">
            <h2>5. Intellectual Property</h2>
            <ul>
              <li>All content retrieved from submitted URLs remains the intellectual property of the respective owners.</li>
              <li>
                The Service processes and indexes this content solely for the purpose of generating chatbot responses. This use is 
                intended to be transformative and informational in nature.
              </li>
              <li>
                APItome: preview's own branding, interface, and codebase are the property of its creator(s). You may not copy, 
                modify, or redistribute the Service itself without permission.
              </li>
            </ul>
          </section>

          <section className="terms-section">
            <h2>6. No Warranty</h2>
            <p className="terms-caps">
              THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, 
              INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, ACCURACY, 
              OR NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, SECURE, OR FREE OF 
              HARMFUL COMPONENTS.
            </p>
          </section>

          <section className="terms-section">
            <h2>7. Limitation of Liability</h2>
            <p className="terms-caps">
              TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, THE CREATORS AND OPERATORS OF APIBRIDGE SHALL NOT BE LIABLE 
              FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF OR RELATED TO 
              YOUR USE OF OR INABILITY TO USE THE SERVICE, INCLUDING BUT NOT LIMITED TO:
            </p>
            <ul>
              <li>Errors or inaccuracies in AI-generated responses.</li>
              <li>Loss of data, revenue, or profits resulting from reliance on the Service.</li>
              <li>Unauthorized access to or alteration of your data or submissions.</li>
              <li>Any issues arising from third-party content accessed through submitted URLs.</li>
              <li>Service downtime, interruptions, or discontinuation.</li>
            </ul>
          </section>

          <section className="terms-section">
            <h2>8. Indemnification</h2>
            <p>
              You agree to indemnify, defend, and hold harmless the creators and operators of APItome: preview from and against 
              any claims, damages, losses, liabilities, costs, and expenses (including reasonable legal fees) arising out of or 
              related to your use of the Service, your violation of these Terms, or your violation of any third-party rights, 
              including intellectual property rights of API documentation providers.
            </p>
          </section>

          <section className="terms-section">
            <h2>9. Rate Limiting and Fair Use</h2>
            <ul>
              <li>The Service enforces per-user rate limits to ensure fair usage and availability.</li>
              <li>
                Excessive or automated usage that disrupts the Service may result in temporary or permanent restriction of access.
              </li>
              <li>We reserve the right to limit, suspend, or terminate access at our sole discretion.</li>
            </ul>
          </section>

          <section className="terms-section">
            <h2>10. Modifications to the Service and Terms</h2>
            <ul>
              <li>We reserve the right to modify, suspend, or discontinue the Service at any time without prior notice.</li>
              <li>
                We may update these Terms at any time. Continued use of the Service after changes are posted constitutes 
                acceptance of the revised Terms.
              </li>
              <li>It is your responsibility to review these Terms periodically.</li>
            </ul>
          </section>

          <section className="terms-section">
            <h2>11. Contact</h2>
            <p>
              If you have questions about these Terms, or if you are a content owner requesting removal of indexed content, 
              please contact us via Github.
            </p>
          </section>

          <section className="terms-section">
            <h2>12. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with applicable laws. Any disputes arising from 
              these Terms or your use of the Service shall be resolved in accordance with applicable law.
            </p>
          </section>

          <hr className="terms-divider" />

          <p className="terms-acceptance">
            <em>By using APItome: preview, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.</em>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TermsPage;
