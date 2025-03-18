import './Loader.component.scss';

const Loader = () => {
  return (
    <div className="loader--wrapper">
      <div className="loader"></div>
      <div className="loader--text">Loading...</div>
    </div>
  );
};

export default Loader;
