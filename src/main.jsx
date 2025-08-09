import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/reset.css';
import './styles/theme.css';
import App from './App.jsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Library from './components/Library/Library.jsx';
import About from './components/About/About.jsx';
import Credits from './components/About/Credits.jsx';
import MainContent from './components/Main/MainContent.jsx';
import SignUp from './components/Login-Subscribe/Signup.jsx';
import { AuthProvider } from './context/AuthContext.jsx'; // ✅ import

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <App /> },
      { path: "library", element: <Library /> },
      { path: "post/:articleId", element: <MainContent /> },
      { path: "about", element: <About /> },
      { path: "credits", element: <Credits /> },
      { path: "signup", element: <SignUp /> }
    ]
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
