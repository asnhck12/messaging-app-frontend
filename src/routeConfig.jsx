import App from "./App"
import HomePage from "./modules/Homepage/Homepage"
import SignupPage from "./modules/Signup/Signup"
import LoginPage from "./modules/Login/Login"
import ProfilePage from "./modules/Profile/Profile"
import UpdateProfile from "./modules/Profile/UpdateProfile"

const routesConfig = ([
    {
      path: "/",
      element: <App />,
      children: [
        {index: true, element:<HomePage />},
        {path: "login", element: <LoginPage />},
        {path: "signup", element: <SignupPage />},
        {path: "profile/:userId", element: <ProfilePage />},
        {path: "update", element: <UpdateProfile />},
      ]
    }
  ])

  export default routesConfig