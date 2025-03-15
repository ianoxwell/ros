import { IUserToken } from '@domain/user.dto';
import { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { CRoutes } from '@app/routes.const';
import { RootState } from '@app/store';

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user }: { user: IUserToken | undefined } = useSelector((store: RootState) => store.user);

  if (!user) {
    return <Navigate to={CRoutes.login} />;
  }

  return children;
};

export default ProtectedRoute;
