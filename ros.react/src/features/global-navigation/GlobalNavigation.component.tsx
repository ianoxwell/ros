import { Menu } from '@mantine/core';
import { Calendar, NotebookPen, Plus, Settings, ShoppingBasket, User } from 'lucide-react';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './GlobalNavigation.component.scss';

const links = [
  { title: 'Recipes', link: '/', icon: 'home', id: 0 },
  { title: 'Orders', link: '/orders', icon: 'search', id: 1 },
  { title: 'Schedule', link: '/schedule', icon: 'bookmark', id: 2 },
  { title: 'Ingredients', link: '/ingredients', icon: 'user', id: 3 }
];

export const GlobalNavigation = () => {
  const [navigation] = useState(links);
  const fillColor = '#128758';
  const iconSize = 24;
  const iconPlusSize = 28;
  function doSomething() {
    console.log('it did something');
  }

  return (
    <header className="header">
      {/* <div className="header-logo">
        <img src={vegetableBasket} className="header-logo__image" alt="React logo" height={'30px'} width={'30px'} />
        <h1 className="header-logo__title">Recipe Ordering Simplified</h1>
      </div> */}
      <nav className="bottom-nav">
        {navigation.map((nav) => (
          <NavLink to={nav.link} className="nav-item" key={nav.id}>
            {({ isActive }) => {
              // Note that dynamic icon for lucide-react bloats the build size as it includes all icons - lacks tree shaking
              switch (nav.icon) {
                case 'search':
                  return <ShoppingBasket fill={isActive ? fillColor : 'white'} size={iconSize} />;
                case 'bookmark':
                  return <Calendar fill={isActive ? fillColor : 'white'} size={iconSize} />;
                case 'user':
                  return <NotebookPen fill={isActive ? fillColor : 'white'} size={iconSize} />;
                default:
                  return <NotebookPen fill={isActive ? fillColor : 'white'} size={iconSize} />;
              }
            }}
          </NavLink>
        ))}

        <div className="nav-fab-container">
          <button type="button" onClick={doSomething} className="nav-fab">
            <Plus size={iconPlusSize} />
          </button>
        </div>
      </nav>
      <div className="user-menu">
        <Menu shadow="md" width={200}>
          <Menu.Target>
            <button type="button" className="nav-fab">
              <User size={iconSize} />
            </button>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Label>Application</Menu.Label>
            <Menu.Item leftSection={<Settings size={14} />}>Settings</Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </div>
    </header>
  );
};
