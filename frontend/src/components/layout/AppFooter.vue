<template>
  <footer class="app-footer">
    <div class="container">
      <div class="footer-content">
        <!-- Company Info -->
        <div class="footer-section">
          <div class="company-info">
            <router-link to="/" class="footer-logo">
              <span class="logo-text">COMPHILITY</span>
            </router-link>
            <p class="company-description">
              In today's fast-paced world, convenience is a top priority for everyone, and the realm of online shopping has transformed the way we purchase goods and services. COMPHILITY, your go-to computer store online, is revolutionizing the way customers buy computer components such as motherboards, memory, solid-state drives, power supplies, PC cases, and processors. COMPHILITY also offers computer accessories such as keyboards, headset, monitors, speakers and many more. With a strong focus on making the buying experience fast, safe, and reliable, COMPHILITY has become the ultimate destination for tech enthusiasts and casual users alike.
            </p>
          </div>
        </div>

        <!-- Company Links -->
        <div class="footer-section">
          <h4 class="footer-title">COMPANY</h4>
          <ul class="footer-links">
            <li><a href="/about">About Us</a></li>
            <li><a href="/legal">Legal Information</a></li>
            <li><a href="/contact">Contact Us</a></li>
            <li><a href="/careers">Careers</a></li>
            <li><a href="/privacy">Privacy Policy</a></li>
            <li><a href="/terms">Terms of Service</a></li>
          </ul>
        </div>

        <!-- Help Center -->
        <div class="footer-section">
          <h4 class="footer-title">HELP CENTER</h4>
          <ul class="footer-links">
            <li><a href="/help/why-us">Why Us?</a></li>
            <li><a href="/help/faqs">FAQs</a></li>
            <li><a href="/help/shipping">Shipping Info</a></li>
            <li><a href="/help/returns">Returns & Exchanges</a></li>
            <li><a href="/help/warranty">Warranty</a></li>
            <li><a href="/help/support">Technical Support</a></li>
          </ul>
        </div>

        <!-- Contact Info -->
        <div class="footer-section">
          <h4 class="footer-title">CONTACT INFO</h4>
          <div class="contact-info">
            <div class="contact-item">
              <i class="fas fa-phone"></i>
              <span>Phone: 1234567890</span>
            </div>
            <div class="contact-item">
              <i class="fas fa-envelope"></i>
              <span>Email: comphility@gmail.com</span>
            </div>
            <div class="contact-item">
              <i class="fas fa-map-marker-alt"></i>
              <span>Location: example, example, example</span>
            </div>
          </div>
          
          <!-- Social Media -->
          <div class="social-media">
            <a href="#" class="social-link facebook" aria-label="Facebook">
              <i class="fab fa-facebook-f"></i>
            </a>
            <a href="#" class="social-link instagram" aria-label="Instagram">
              <i class="fab fa-instagram"></i>
            </a>
            <a href="#" class="social-link twitter" aria-label="Twitter">
              <i class="fab fa-twitter"></i>
            </a>
            <a href="#" class="social-link youtube" aria-label="YouTube">
              <i class="fab fa-youtube"></i>
            </a>
          </div>
        </div>
      </div>

      <!-- Copyright -->
      <div class="footer-bottom">
        <div class="copyright">
          <p>&copy; {{ currentYear }} | All rights reserved</p>
        </div>
        <div class="payment-methods">
          <span class="payment-label">We Accept:</span>
          <div class="payment-icons">
            <div class="payment-card cod-card" title="Cash on Delivery">
              <div class="payment-icon">
                <i class="fas fa-money-bill-wave"></i>
              </div>
              <div class="payment-text">
                <span class="payment-name">Cash on</span>
                <span class="payment-name">Delivery</span>
              </div>
            </div>
            <div class="payment-card gcash-card" title="GCash - Mobile Wallet">
              <div class="payment-icon gcash-bg">
                <span class="gcash-text">G</span>
              </div>
              <div class="payment-text">
                <span class="payment-name">GCash</span>
                <span class="payment-subtitle">Mobile Wallet</span>
              </div>
            </div>
            <div class="payment-card maya-card" title="Maya - Digital Payments">
              <div class="payment-icon maya-bg">
                <span class="maya-text">M</span>
              </div>
              <div class="payment-text">
                <span class="payment-name">Maya</span>
                <span class="payment-subtitle">Digital Pay</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'AppFooter',
  computed: {
    currentYear() {
      return new Date().getFullYear()
    }
  }
}
</script>

<style scoped>
.app-footer {
  background: var(--gray-700);
  color: var(--white);
  margin-top: auto;
}

.footer-content {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 3rem;
  padding: 3rem 0;
}

.footer-section {
  display: flex;
  flex-direction: column;
}

/* Company Info */
.footer-logo {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: var(--white);
  font-weight: 700;
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.logo-img {
  height: 2rem;
  margin-right: 0.5rem;
}

.logo-text {
  font-family: 'Inter', sans-serif;
  letter-spacing: -0.025em;
}

.company-description {
  color: var(--gray-300);
  line-height: 1.6;
  font-size: 0.875rem;
  margin: 0;
}

/* Footer Titles */
.footer-title {
  color: var(--primary-blue);
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  letter-spacing: 0.025em;
}

/* Footer Links */
.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li {
  margin-bottom: 0.75rem;
}

.footer-links a {
  color: var(--gray-300);
  text-decoration: none;
  font-size: 0.875rem;
  transition: color 0.2s ease;
}

.footer-links a:hover {
  color: var(--white);
}

/* Contact Info */
.contact-info {
  margin-bottom: 1.5rem;
}

.contact-item {
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
  color: var(--gray-300);
  font-size: 0.875rem;
}

.contact-item i {
  width: 1.25rem;
  margin-right: 0.75rem;
  color: var(--primary-blue);
}

/* Social Media */
.social-media {
  display: flex;
  gap: 1rem;
}

.social-link {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--white);
  text-decoration: none;
  transition: all 0.3s ease;
  font-size: 1rem;
}

.social-link.facebook {
  background: #1877F2;
}

.social-link.instagram {
  background: linear-gradient(45deg, #405DE6, #5851DB, #833AB4, #C13584, #E1306C, #FD1D1D);
}

.social-link.twitter {
  background: #1DA1F2;
}

.social-link.youtube {
  background: #FF0000;
}

.social-link:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

/* Footer Bottom */
.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 0;
  border-top: 1px solid var(--gray-600);
  margin-top: 1rem;
}

.copyright p {
  margin: 0;
  color: var(--gray-400);
  font-size: 0.875rem;
}

.payment-methods {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.payment-label {
  color: var(--gray-400);
  font-size: 0.875rem;
}

.payment-icons {
  display: flex;
  gap: 0.75rem;
}

.payment-card {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: var(--white);
  border-radius: 6px;
  border: 1px solid var(--gray-300);
  transition: all 0.2s ease;
  cursor: pointer;
  min-width: 80px;
}

.payment-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.payment-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 600;
}

.payment-text {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.payment-name {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--gray-800);
}

.payment-subtitle {
  font-size: 0.625rem;
  color: var(--gray-600);
  font-weight: 400;
}

/* COD Card Styling */
.cod-card .payment-icon {
  background: #f0f9ff;
  color: #059669;
}

.cod-card .payment-icon i {
  font-size: 0.875rem;
}

/* GCash Card Styling */
.gcash-bg {
  background: linear-gradient(135deg, #00b4d8, #0096c7);
  color: white;
  font-weight: 700;
}

.gcash-text {
  font-size: 0.875rem;
  font-weight: 800;
}

/* Maya Card Styling */
.maya-bg {
  background: linear-gradient(135deg, #00c853, #00a844);
  color: white;
  font-weight: 700;
}

.maya-text {
  font-size: 0.875rem;
  font-weight: 800;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .footer-content {
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }
}

@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: 2rem;
    padding: 2rem 0;
  }
  
  .footer-bottom {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .payment-methods {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .payment-icons {
    justify-content: center;
    gap: 0.5rem;
    flex-wrap: wrap;
  }
  
  .payment-card {
    padding: 0.375rem 0.5rem;
    min-width: 70px;
  }
  
  .payment-icon {
    width: 20px;
    height: 20px;
    font-size: 0.75rem;
  }
  
  .payment-name {
    font-size: 0.625rem;
  }
  
  .payment-subtitle {
    font-size: 0.5rem;
  }
  
  .gcash-text,
  .maya-text {
    font-size: 0.75rem;
  }
}

@media (max-width: 576px) {
  .social-media {
    justify-content: center;
  }
  
  .social-link {
    width: 2rem;
    height: 2rem;
    font-size: 0.875rem;
  }
}
</style>
