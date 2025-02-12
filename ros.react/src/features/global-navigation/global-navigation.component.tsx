
import { useState } from 'react';
import vegetableBasket from '../../assets/vegetables-hand-drawn-basket.svg';
import './global-navigation.component.scss';
import { NavLink } from 'react-router-dom';

const links = [
    { title: 'Recipes', link: '/', id: 0 },
    { title: 'Orders', link: '/orders', id: 1 },
    { title: 'Schedule', link: '/schedule', id: 2 },
    { title: 'Ingredients', link: '/ingredients', id: 3 },
]

export const GlobalNavigation = () => {
    const [navigation] = useState(links);
    function doSomething() {
        console.log('it did something');
    }


    return (
        <header className='header'>
            <div className="header-logo">
                <img src={vegetableBasket} className="header-logo__image" alt="React logo" height={'30px'} width={'30px'} />
                <h1 className="header-logo__title">Recipe Ordering Simplified</h1>
            </div>
            <nav>
                <ul>
                    {navigation.map((nav) => (
                        <li key={nav.id}>
                            <NavLink to={nav.link} className='header__link'>
                                {nav.title}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>
            <div>
                <button type='button' onClick={doSomething}>Add something</button>
            </div>
        </header >
    );
};
