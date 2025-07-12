import Navbar from '../../components/navbar/Navbar';
import './aboutPage.css';

const AboutPage = () => {
  return (
    <div className="about-page-wrapper">
      <Navbar page="about" />
      <div className="about-content">
        <section className="about-section">
          <h2>How does the AI module work?</h2>
          <ol className="about-steps">
            <li><strong>Upload or Select a Room Image:</strong> Start by uploading a photo of your room or choosing a sample image.</li>
            <li><strong>Choose Furniture Type:</strong> Select the type of furniture you want to visualize (e.g., sofa, chair, table).</li>
            <li><strong>Customize Style:</strong> Adjust color, material, and style preferences for the furniture.</li>
            <li><strong>AI Generation:</strong> The AI model processes your selections and generates a realistic visualization of the furniture in your room.</li>
            <li><strong>Review & Download:</strong> View the generated image, make further adjustments if needed, and download or save your design.</li>
          </ol>
        </section>
        <section className="about-section">
          <h2>How does the buying process work?</h2>
          <ol className="about-steps">
            <li><strong>Browse Products:</strong> Explore available furniture and use filters to find what you need.</li>
            <li><strong>Negotiate:</strong> If interested, you can make an offer to the seller. The seller can accept, reject, or negotiate further. <br/> <em>Note: If multiple offers are accepted, the buyer who places the first order will get the product.</em></li>
            <li><strong>Contact:</strong> Once an agreement is reached, both buyer and seller have access to each other's phone numbers to discuss payment and delivery details directly.</li>
            <li><strong>Payment & Delivery:</strong> Payment and delivery are arranged privately between buyer and seller. The platform does not process payments or handle shipping.</li>
          </ol>
        </section>
        <section className="about-section">
          <h2>Our Mission</h2>
          <p>
            We believe in the importance of reusing and repurposing second-hand furniture. By giving furniture a second life, we reduce waste, save resources, and promote a more sustainable lifestyle. Every purchase helps the environment and supports a circular economy.
          </p>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;
