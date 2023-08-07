import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './routes'
const HomePage = React.lazy(()=> import('./pages/home')); 
const ProductPage = React.lazy(()=> import('./pages/products'));
const CreateProductPage = React.lazy(()=> import('./pages/createProduct')); 
const EditProductPage = React.lazy(()=> import('./pages/editProduct')); 
const UsersPage = React.lazy(()=>import('./pages/users'));
const LoginPage = React.lazy(()=> import('./pages/login'))

const App = () => {
  return (
    <React.Suspense>
      <Routes>
        <Route element={<ProtectedRoute/>}>
          <Route path='/' element={<HomePage/>}></Route>
          <Route path='/products' element={<ProductPage/>}></Route>
          <Route path='/create-product-page' element={<CreateProductPage/>}></Route>
          <Route path='/edit-product-page' element={<EditProductPage/>}></Route>
          <Route path='/users' element={<UsersPage/>}></Route>
          {/* <Route path='/referral' element={<ReferralPage/>}></Route> */}
        </Route>
        <Route path='/login' element={<LoginPage/>}></Route>

      </Routes>
    </React.Suspense>
  );
}

export default App;
