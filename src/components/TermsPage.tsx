import React from 'react';
import { useNavigate } from 'react-router-dom';
import './TermsPage.css';

const TermsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="terms-page">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-left">
          <button 
            className="back-button-nav" 
            onClick={() => navigate('/')}
            aria-label="Go back to home"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 4L6 10L12 16" />
            </svg>
          </button>
          <div className="nav-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
              <line x1="9" y1="9" x2="9.01" y2="9"/>
              <line x1="15" y1="9" x2="15.01" y2="9"/>
            </svg>
          </div>
          <div className="nav-brand">
            <span className="brand-name">APItome</span>
            <span className="brand-preview">[Preview]</span>
          </div>
        </div>
        <div className="navbar-right">
          <a href="https://github.com/yourusername/api-docs-chatbot/issues" target="_blank" rel="noopener noreferrer" className="nav-link">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 0C4.477 0 0 4.477 0 10c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0110 4.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C17.137 18.165 20 14.418 20 10c0-5.523-4.477-10-10-10z" clipRule="evenodd"/>
            </svg>
            Report an issue
          </a>
        </div>
      </nav>

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

      {/* Footer */}
      <footer className="terms-footer">
        <p>Made with <span className="heart">♥</span> by <a href="https://github.com/vsvis" target="_blank" rel="noopener noreferrer" className="footer-link">vsvis</a></p>
      </footer>
    </div>
  );
};

export default TermsPage;
