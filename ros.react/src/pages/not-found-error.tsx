import { Link } from 'react-router-dom';
import img from '../assets/images/FrogNotFound.png';
import './not-found-error.scss';

const NotFoundErrorPage = () => {
  return (
    <main className="not-found-error">
      <img src={img} alt="not found" />
      <section className='not-found-title'>
        <h1>Ohh! Page Not Found</h1>
        <p>We can't seem to find the page you're looking for</p>
        <Link to="/">back home</Link>
      </section>
    </main>
  );
};

export default NotFoundErrorPage;
