
import React, { ComponentType } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './authProvider';
import { ROLE } from '../enums/roles.enum';


interface PrivateRouteProps {
    component: ComponentType<any>;
    roles: ROLE;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ component: Component, roles }) => {
  const { currentUser } = useAuth();
  //add here the page that says that user dont have an access to view that page
  return ( (currentUser && roles.includes(currentUser.user.role)) ? <Component /> : <Navigate to="/login" /> );
};

export default PrivateRoute;
