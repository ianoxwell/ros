import { useAppDispatch, useAppSelector } from '@app/hooks';
import { CRoutes } from '@app/routes.const';
import { RootState } from '@app/store';
import { IUserToken } from '@domain/user.dto';
import { logoutUser } from '@features/user/userSlice';
import { Avatar, Menu, UnstyledButton } from '@mantine/core';
import { Calendar, LogOut, NotebookPen, Plus, Settings, ShoppingBasket } from 'lucide-react';
import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './GlobalNavigation.component.scss';

const links = [
  { title: 'Recipes', link: CRoutes.recipes, icon: 'home', id: 0 },
  { title: 'Orders', link: CRoutes.orders, icon: 'search', id: 1 },
  { title: 'Schedule', link: CRoutes.schedule, icon: 'bookmark', id: 2 },
  { title: 'Ingredients', link: CRoutes.ingredients, icon: 'user', id: 3 }
];

export const GlobalNavigation = () => {
  const [navigation] = useState(links);
  const fillColor = '#128758';
  const iconSize = 24;
  const iconPlusSize = 28;
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((store: RootState) => store.user.user) as IUserToken;

  function contextAwareNewItem() {
    console.log('contextually add something', location.pathname);
  }

  const logUserOut = () => {
    dispatch(logoutUser('Logging out...'));
  };

  return (
    <>
      {/* <div className="header-logo">
        <img src={vegetableBasket} className="header-logo__image" alt="React logo" height={'30px'} width={'30px'} />
        <h1 className="header-logo__title">Recipe Ordering Simplified</h1>
      </div> */}
      <div className="user-menu">
        <Menu shadow="md" width={200}>
          <Menu.Target>
            <UnstyledButton type="button" className="nav-fab" title={user.givenNames}>
              {(() => {
                if (user.photoUrl?.length) {
                  return <Avatar src={user.photoUrl[0]} radius="xl" size="lg" />;
                }

                if (user.givenNames && user.familyName) {
                  return (
                    <Avatar radius="xl" color="gray.7" variant="outline" size="lg">
                      {user.givenNames.at(0)}
                      {user.familyName.at(0)}
                    </Avatar>
                  );
                }

                return <Avatar radius="xl" variant="outline" size="lg" />;
              })()}
            </UnstyledButton>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Label>Application</Menu.Label>
            <Menu.Item leftSection={<Settings size={14} />}>Settings</Menu.Item>
            <Menu.Item leftSection={<LogOut size={14} />} component="button" type="button" onClick={logUserOut}>
              Logout
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </div>

      <nav className="bottom-nav">
        {navigation.map((nav) => (
          <NavLink to={nav.link} aria-label={nav.title} className="nav-item" key={nav.id}>
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
          <button type="button" onClick={contextAwareNewItem} title="New" className="nav-fab">
            <Plus size={iconPlusSize} />
          </button>
        </div>
      </nav>
    </>
  );
};
