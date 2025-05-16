import { useAppDispatch, useAppSelector } from '@app/hooks';
import { CRoutes } from '@app/routes.const';
import { RootState } from '@app/store';
import { ETimeSlot } from '@domain/schedule.dto';
import { IUserToken } from '@domain/user.dto';
import { logoutUser } from '@features/user/userSlice';
import { Avatar, Menu, UnstyledButton } from '@mantine/core';
import { getIncrementedDateIndex } from '@utils/dateUtils';
import { Calendar, LogOut, NotebookPen, Plus, Settings, ShoppingBasket } from 'lucide-react';
import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { setCurrentSchedule } from './globalModal.slice';
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

  /** TODO - add additional modals for new recipe and new ingredient */
  function contextAwareNewItem() {
    console.log('contextually add something', location.pathname);
    switch (location.pathname.replace(/^\//, '')) {
      case CRoutes.schedule: case CRoutes.orders:
        newScheduleItem();
        break;
      default:
        newScheduleItem();
        break;
    }
  }

  const newScheduleItem = () => {
    dispatch(
      setCurrentSchedule({
        date: getIncrementedDateIndex(1),
        timeSlot: ETimeSlot.BREAKFAST,
        scheduleRecipes: [],
        notes: ''
      })
    );
  };

  const logUserOut = () => {
    dispatch(logoutUser('Logging out...'));
  };

  return (
    <>
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
