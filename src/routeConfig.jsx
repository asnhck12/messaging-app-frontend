import App from "./App"
import HomePage from "./modules/Homepage/Homepage"
import SignupPage from "./modules/Signup/Signup"
import LoginPage from "./modules/Login/Login"

const routesConfig = ([
    {
      path: "/",
      element: <App />,
      children: [
        {index: true, element:<HomePage />},
        {path: "login", element: <LoginPage />},
        {path: "signup", element: <SignupPage />},
      ]
    }
  ])

  export default routesConfig