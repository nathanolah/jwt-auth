import React from 'react';
import { 
  BrowserRouter,
  Routes,
  Route,
  Link 
} from 'react-router-dom';
import { Header } from './Header';
import { Bye } from './pages/Bye';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';

//import { gql, useQuery } from '@apollo/client';
//import { useHelloQuery } from './generated/graphql';

function AppRoutes() {

  return (
    <BrowserRouter>
      <>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/bye" element={<Bye />} />
        </Routes>
      </>
    </BrowserRouter>
  );

  // const { loading, error, data } = useQuery(gql`
  //   {
  //     hello
  //   }
  // `);

  // Graphql codegen will allow us to see the type for 'data'
  // For example data.hello is a string
  // const { loading, data } = useHelloQuery();

  // if (loading || !data) {
  //   return <div>loading...</div>
  // }

  // return (
  //   <>
  //     <p>{data.hello}</p>
  //   </>
  // );
}

export default AppRoutes;
