import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/reset.css'
import './styles/theme.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Library from './components/Library/Library.jsx'
import About from './components/About/About.jsx'
import Credits from './components/About/Credits.jsx'
import Article from './components/Main/Article.jsx'
import SignUp from './components/Login-Subscribe/Signup.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    //errorelement: <ErrorPge />
    children: [
      {
        index: true,
        element: <App />
      },
      {
        path: "library",
        element: <Library />
      },
      {
        path: "post/:articleId", // Add this route for specific articles
        element: <Article />
      },
      {
        path: "about",
        element: <About />
      },
      {
        path: "credits",
        element: <Credits />
      },
      {
        path: "signup",
        element: <SignUp />
      }
    ]
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>
)
