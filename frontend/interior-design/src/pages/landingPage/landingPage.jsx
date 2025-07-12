import './landing.css'
import { Link } from 'react-router-dom'
import Slider from '../../components/slider/slider.jsx'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

const sliderImages = [
  '/temp1.png',
  '/temp2.png',
  '/temp3.png',
  '/temp4.png',
]

const LandingPage = () => {
  return (
    <div className="container-landing">
      <div className="cover-background">
        <img src="/cover2.jpg" alt="cover" className="image-cover"/>
        <nav className="landing-navbar">
          <div className="navbar-center">
            {/* <Link to="/about" className="nav-link">About</Link> */}
            <a href="#about-section" className="nav-link">About</a>
            <Link to="/login" className="nav-link">Sign In</Link>
            <Link to="/signup" className="nav-link signup-btn">Register</Link>
          </div>
        </nav>
        <div className="cover-overlay-text">
          <div className="logo-wrapper">
            <img src="/logo-green.PNG" alt="logo" className="logo-landing"/> 
          </div>
          <span className="cover-slogan">
            Enhance your product's background with our tool for Personalized Staging <br/> in the Furniture Marketplace
          </span>
        </div>
      </div>
      <div className="landing-hero">
        <div className="hero-content">
          <div className="mission-section">
            <h2 className="mission-title crimson-text-regular">Join our fight against waste</h2>
            <p className="mission-text">
              Our mission is to combat waste of furniture and irrational tree cutting by encouraging second-hand use and furniture recycling through innovative AI technology.
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <ShoppingCartIcon sx={{color:'var(--dark-green)'}} fontSize="large" />
              </div>
              <h3>Smart Marketplace</h3>
              <p>
                AI-powered furniture marketplace for smoother sale processing.<br />
                Discover, buy, and sell unique furniture pieces with ease.<br />
                Our marketplace features an advanced AI module: when you add a product, you can generate a beautiful, personalized background for your item based on your own prompt.<br />
                This helps your listings stand out and inspires buyers with realistic, custom staging.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <AutoAwesomeIcon sx={{color:'var(--dark-green)'}} fontSize="large" />             
              </div>
              <h3>Get Inspired</h3>
              <p>
                Browse renovation ideas from our community.<br />
                Explore creative room transformations, discover trending styles, and see how others have used AI staging to reimagine their spaces.<br />
                Share your own projects and get feedback or inspiration for your next home improvement!
              </p>
            </div>
          </div>
          <div className="showcase-section">
            <h2 className="showcase-title">Showcase</h2>
            <p className="showcase-description">
              This is an example of how our product can be used to transform ordinary furniture photos into stunning, personalized scenes.<br />
              With just a prompt, our AI generates unique backgrounds that help your listings stand out and attract more buyers.<br />
              Get inspired by these creations and imagine the possibilities for your own products!
            </p>
          </div>
          <div className="slider-container">
            <Slider sliderImages={sliderImages} />
          </div>
          <div className="cta-section">        
            <Link to="/signup" className="cta-secondary">
              Register to get started!
            </Link>
          </div>
          <div className="about-section-landing">
            <h2>About</h2>
            <div className="about-landing-accordion">
              <Accordion className="about-accordion">
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="ai-module-content"
                  id="ai-module-header"
                >
                  <h3>How does the AI module work?</h3>
                </AccordionSummary>
                <AccordionDetails>
                  <ol>
                    <li>
                      <strong>Select Furniture Category</strong><br />
                      Choose the category that best matches your furniture piece. This helps our AI better understand and process your image.<br />
                      <em>Available categories include sofas, chairs, tables, desks, beds, lamps and armchairs.</em>
                    </li>
                    <li>
                      <strong>Upload your image</strong><br />
                      Select a high-quality image of your furniture with a clear background for best results.<br />
                      <em>Supported formats: JPEG, PNG, WEBP, JPG • Maximum file size: 5MB • Recommended: Well-lit photos with minimal background clutter</em>
                    </li>
                    <li>
                      <strong>Generate Object Mask</strong><br />
                      Create a precise mask to isolate your furniture from the background using automatic AI detection or manual editing tools.<br />
                      <em>Automatic detection works best with clear, well-defined objects. Manual editing gives you complete control over the selection.</em>
                    </li>
                    <li>
                      <strong>Customize with Prompts</strong><br />
                      Describe your desired background or setting to generate the perfect environment for your furniture.<br />
                      <em>Use descriptive prompts like 'modern living room', 'cozy bedroom', 'minimalist office' for best results.</em>
                    </li>
                  </ol>
                </AccordionDetails>
              </Accordion>

              <Accordion className="about-accordion">
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="buying-process-content"
                  id="buying-process-header"
                >
                  <h3>How does the buying process work?</h3>
                </AccordionSummary>
                <AccordionDetails>
                  <ol>
                    <li><strong>Browse Products:</strong> Explore available furniture and use filters to find what you need.</li>
                    <li><strong>Negotiate:</strong> Make an offer to the seller. The seller can accept, reject, or negotiate. <em>If multiple offers are accepted, the first buyer to order gets the product.</em></li>
                    <li><strong>Contact:</strong> After agreement, buyer and seller can contact each other directly to arrange payment and delivery.</li>
                    <li><strong>Payment & Delivery:</strong> Payment and delivery are arranged privately between buyer and seller.</li>
                  </ol>
                </AccordionDetails>
              </Accordion>

              <Accordion className="about-accordion">
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="mission-content"
                  id="mission-header"
                >
                  <h3>Our Mission</h3>
                </AccordionSummary>
                <AccordionDetails>
                  <p>
                    We believe in the importance of reusing and repurposing second-hand furniture. By giving furniture a second life, we reduce waste, save resources, and promote a more sustainable lifestyle.
                  </p>
                </AccordionDetails>
              </Accordion>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LandingPage
