import {useState} from 'react'
import { useNavigate } from 'react-router-dom';
import './customizeIDPage.css'
import Navbar from '../../components/navbar/Navbar.jsx'



const customizeIDPage = () => {
  const navigate = useNavigate();

  const stepData = [
    {
      number: 1,
      title: "Upload your image",
      description: "Select a high-quality image of your furniture with a clear background for best results.",
      details: "Supported formats: JPEG, PNG, WEBP, JPG • Maximum file size: 5MB • Recommended: Well-lit photos with minimal background clutter"
    },
    {
      number: 2,
      title: "Create Object Mask",
      description: "Create a precise mask to isolate your furniture from the background using automatic AI detection or manual editing tools.",
      details: "Manual editing gives you complete control over the selection."
    },
    {
      number: 3,
      title: "Customize with Prompts",
      description: "Describe your desired background or setting to generate the perfect environment for your furniture.",
      details: "Use descriptive prompts like 'modern living room', 'cozy bedroom', 'minimalist office' for best results."
    }
  ];
    return (
      <div className="container">
        <Navbar page={"inspire"}/>
        <div className="wrapper">
          <div className="content-1">
              <h1 className="title-1">
                Furniture Background Customizer
              </h1>
              <p className="small-description">
                Transform your furniture photos with AI-powered background replacement. 
                Perfect for e-commerce, interior design, and product showcases.
              </p>
          </div>
          <div className="content-2">
            <h2 className="title-2">
              How it works
            </h2>
            <div className="stepdata">
              {stepData.map((step, index) => (
                <div key={index} className="step-wrapper"> 
                  <div className="step-nr">
                    {step.number}
                  </div>
                  <div className="right-wrapper">
                    <h3 className="step-title">
                      {step.title}
                    </h3>
                    <p className="step-description">
                      {step.description}
                    </p>
                    <p className="step-details">
                      {step.details}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="button-wrapper">
              <button
                className="button"
                onClick={() => navigate('/customize-steps')}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 25px rgba(72, 92, 17, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 6px 20px rgba(72, 92, 17, 0 , 0.3)';
                }}
              > 
                Get Started
              </button>
          </div>
        </div>
      </div>
    );

}

export default customizeIDPage
