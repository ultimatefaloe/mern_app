import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';

// import Users from './User/Pages/users';
// import UserPlaces from './Place/Pages/UserPlaces';
// import NewPlace from './Place/Pages/NewPlace'
// import UpdatePlace from './Place/Pages/UpdatePlace';
// import Auth from './User/Pages/auth'; 
import MainNav from './shared/components/Navigation/MainNav';
import { AuthContext } from './shared/Context/auth-context';
import { useAuth } from './shared/components/hook/auth-hook';
import LoadingSpinner from './shared/components/UIElements/LoadingSpinner';

const Users = lazy(() => import('./User/Pages/users'));
const NewPlace = lazy(() => import('./Place/Pages/NewPlace'));
const UpdatePlace = lazy(() => import('./Place/Pages/UpdatePlace'));
const UserPlaces = lazy(() => import('./Place/Pages/UserPlaces'));
const Auth = lazy(() => import('./User/Pages/auth'));

const App = () => {
  const { token, login, logout, userId } = useAuth()

  let routes;

  if(token){
   routes = (
    <Switch>
      <Route path="/" exact>
        <Users />
      </Route>
      <Route path="/:userId/places" exact>
        <UserPlaces />
      </Route>
      <Route path="/place/new" exact>
        <NewPlace />
      </Route> 
      <Route path='/place/:placeId' exact>
        <UpdatePlace />
      </Route>
      <Redirect to='/' />
    </Switch>
   )
    
  } else {
   routes =(
    <Switch>
      <Route path="/" exact>
        <Users />
      </Route>
      <Route path="/:userId/places" exact>
        <UserPlaces />
      </Route>
      <Route path='/auth'>
        <Auth />
      </Route>
      <Redirect to='/auth' />
    </Switch>
   )
  }

  return (
    <AuthContext.Provider value={{
      isLoggedIn: token, 
      userId : userId, 
      token: token,
      login: login, 
      logout: logout
    }}>
      <Router>
        <MainNav />
        <main>
          <Suspense 
            fallback={
              <div className='center'>
                <LoadingSpinner overlay />
              </div>
            }
          >
          {routes}
         </Suspense>
        </main>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
