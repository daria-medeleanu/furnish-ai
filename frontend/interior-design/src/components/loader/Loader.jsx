import './loader.css';

const LoadingSpinner = ({msg}) => (
  <div className="loading-container-loader">
    <div className="loading-spinner"></div>
    <p className="loading-text">{msg}</p>
  </div>
);

export default LoadingSpinner;