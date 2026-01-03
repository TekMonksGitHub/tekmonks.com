<style>
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        line-height: 1.6;
        color: #333;
        background-color: #fff;
    }

    /* Hero Section */
    .hero {
        background: linear-gradient(135deg, #063e5a 0%, #667eea 100%);
        color: white;
        padding: 80px 20px;
        text-align: center;
        border-radius: 1em;
    }

    .hero h1 {
        font-size: 48px;
        margin-bottom: 20px;
        font-weight: 600;
    }

    .hero p {
        font-size: 20px;
        max-width: 800px;
        margin: 0 auto;
        opacity: 0.9;
    }

    /* Main Content */
    .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 60px 20px;
    }

    /* Info Section */
    .info-section {
        margin-bottom: 60px;
        background: #f8f9fa;
        padding: 40px;
        border-radius: 8px;
    }

    .info-section h2 {
        font-size: 32px;
        margin-bottom: 20px;
        color: #063e5a;
    }

    .info-section h3 {
        font-size: 24px;
        margin-top: 30px;
        margin-bottom: 15px;
        color: #764ba2;
    }

    .info-section p {
        font-size: 16px;
        line-height: 1.8;
        margin-bottom: 15px;
        color: #555;
    }

    .info-section ul {
        margin-left: 20px;
        margin-bottom: 15px;
    }

    .info-section li {
        margin-bottom: 10px;
        color: #555;
    }

    /* Patent Cards */
    .patents-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
        gap: 30px;
        margin-top: 40px;
    }

    .patent-card {
        background: white;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        transition: transform 0.3s, box-shadow 0.3s;
    }

    .patent-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 20px rgba(0,0,0,0.15);
    }

    .patent-icon {
        background: linear-gradient(135deg, #063e5a 0%, #667eea 100%);
        height: 150px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 48px;
    }

    .patent-content {
        padding: 30px;
    }

    .patent-status {
        display: inline-block;
        padding: 5px 15px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 600;
        margin-bottom: 15px;
        text-transform: uppercase;
    }

    .status-granted {
        background-color: #d4edda;
        color: #155724;
    }

    .status-pending {
        background-color: #fff3cd;
        color: #856404;
    }

    .status-provisional {
        background-color: #d1ecf1;
        color: #0c5460;
    }

    .patent-card h3 {
        font-size: 24px;
        margin-bottom: 10px;
        color: #333;
    }

    .patent-number {
        font-size: 14px;
        color: #666;
        margin-bottom: 15px;
        font-family: 'Courier New', monospace;
    }

    .patent-description {
        font-size: 15px;
        color: #555;
        line-height: 1.6;
        margin-bottom: 20px;
    }

    .patent-meta {
        font-size: 14px;
        color: #777;
        margin-bottom: 20px;
    }

    .patent-link {
        display: inline-block;
        padding: 10px 20px;
        background: linear-gradient(135deg, #063e5a 0%, #667eea 100%);
        color: white !important;
        text-decoration: none;
        border-radius: 5px;
        transition: opacity 0.3s;
    }

    .patent-link:hover {
        opacity: 0.9;
    }

    /* Section Headers */
    .section-header {
        margin: 60px 0 30px 0;
        padding-bottom: 15px;
        border-bottom: 3px solid #667eea;
    }

    .section-header h2 {
        font-size: 36px;
        color: #333;
    }

    /* Verification Section */
    .verification {
        background: #f8f9fa;
        padding: 40px;
        border-radius: 8px;
        margin-top: 60px;
        text-align: center;
    }

    .verification h3 {
        font-size: 24px;
        margin-bottom: 15px;
        color: #333;
    }

    .verification p {
        color: #555;
        margin-bottom: 20px;
    }

    .verification a {
        color: #063e5a;
        text-decoration: none;
        font-weight: 600;
    }

    .verification a:hover {
        text-decoration: underline;
    }

    @media (max-width: 768px) {
        .hero h1 {
            font-size: 32px;
        }

        .patents-grid {
            grid-template-columns: 1fr;
        }
    }
</style>

<section class="hero">
    <h1>Patent Portfolio</h1>
    <p>Innovation and Intellectual Property Protection</p>
</section>

<div class="container">
    <!-- Info Section -->
    <div class="info-section">
        <h2>Understanding the Patent Process</h2>
        <p>At Tekmonks, we are committed to innovation and protecting our intellectual property. Our patent portfolio represents years of research and development in artificial intelligence, enterprise software, cybersecurity, and advanced technology solutions.</p>

        <h3>The USPTO Patent Timeline</h3>
        <p><strong>Full Patent Grant Process:</strong> The United States Patent and Trademark Office (USPTO) patent examination process typically takes 5-6 years from filing to grant. This timeline is standard across the industry and reflects the thorough examination required to ensure patent validity and novelty.</p>

        <p><strong>Provisional Patent Status:</strong> Many of our innovations begin with provisional patent applications, which is a standard and strategic part of the patent process. A provisional patent application:</p>
        <ul>
            <li>Establishes an official patent pending status and priority date</li>
            <li>Provides time to refine the invention and assess commercial viability</li>
            <li>Allows us to publicly disclose and discuss the innovation while maintaining patent rights</li>
            <li>Serves as a foundation for the full non-provisional patent application</li>
        </ul>
        <p>This approach is widely used by innovative companies and is recognized as best practice in intellectual property management.</p>
    </div>

    <!-- Patents Granted -->
    <div class="section-header">
        <h2>Full Patents</h2>
    </div>

    <div class="patents-grid">
        <div class="patent-card">
            <div class="patent-icon">🔐</div>
            <div class="patent-content">
                <span class="patent-status status-pending">Full Patent</span>
                <h3>SECURED APPLICATION ACCESS WITH FREQUENTLY CHANGING PASSWORDS</h3>
                <div class="patent-number">Application No.: US 2016/0373436 A1</div>
                <div class="patent-description">
                    Comprehensive zero-trust based cybersecurity suite utilizing artificial intelligence for real-time threat detection and prevention. The system implements advanced authentication mechanisms and behavioral analytics to provide enterprise-grade security.
                </div>
                <div class="patent-meta">
                    <strong>Filed:</strong> December 22, 2016<br>
                    <strong>Status:</strong> Full Patent Application
                </div>
                <a href="articles/patents/patents.md/20160373436.pdf" class="patent-link" target="_blank">View on USPTO PAIR</a>
            </div>
        </div>

        <div class="patent-card">
            <div class="patent-icon">🤖</div>
            <div class="patent-content">
                <span class="patent-status status-pending">Full Patent</span>
                <h3>SYSTEM AND METHOD FOR A SINGLE FIELD BASED AUTHENTICATION</h3>
                <div class="patent-number">Application No.: US 2017/0237727 A1</div>
                <div class="patent-description">
                    LoginCat enables authentication through a single user-entered identity phrase.
                    The phrase is verified against a registered user database to confirm identity.
                    Upon a valid match tthe user is then authenticated and granted access to multi-user systems.
                </div>
                <div class="patent-meta">
                    <strong>Filed:</strong> August 17, 2017<br>
                    <strong>Status:</strong> Full Patent Application
                </div>
                <a href="articles/patents/patents.md/20170237727.pdf" class="patent-link" target="_blank">View on USPTO PAIR</a>
            </div>
        </div>
    </div>

    <!-- Provisional Patents -->
    <div class="section-header">
        <h2>Provisional Patents</h2>
    </div>

    <div class="patents-grid">
        <div class="patent-card">
            <div class="patent-icon">🌐</div>
            <div class="patent-content">
                <span class="patent-status status-provisional">Provisional Patent</span>
                <h3>Reflection Network</h3>
                <div class="patent-number">Provisional Application No.: 62724616</div>
                <div class="patent-description">
                    Revolutionary network architecture featuring "listenless servers" that are accessible via the network yet attack-proof through reflection-based communication. The system eliminates traditional server listening ports, making servers invisible to external attacks while maintaining full network accessibility through innovative reflection protocols.
                </div>
                <div class="patent-meta">
                    <strong>Filed:</strong> August 21, 2021<br>
                    <strong>Status:</strong> Patent Pending - Provisional<br>
                    <strong>Priority Date Established:</strong> August 21, 2021
                </div>
                <a href="articles/patents/patents.md/62724616.pdf" class="patent-link" target="_blank">View on USPTO PAIR</a>
            </div>
        </div>
    </div>

    <!-- Verification Section -->
    <div class="verification">
        <h3>Patent Verification</h3>
        <p>All patent information can be independently verified through the USPTO Public Patent Application Information Retrieval (Public PAIR) system.</p>
        <a href="https://portal.uspto.gov/pair/PublicPair" target="_blank">Visit USPTO Public PAIR →</a>
        <p style="margin-top: 20px;">For licensing inquiries or additional information about our patent portfolio, please contact: <a href="mailto:patents@tekmonks.com">patents@tekmonks.com</a></p>
    </div>
</div>

