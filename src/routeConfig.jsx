import App from "./App"
// import MessagePage from "./modules/MessagePage/MessagePage"
import HomePage from "./modules/Homepage/Homepage"
import SignupPage from "./modules/Signup/Signup"
import LoginPage from "./modules/Login/Login"
// import NewMessagePage from "./modules/NewMessagePage/NewMessagePage"

const routesConfig = ([
    {
      path: "/",
      element: <App />,
      children: [
        {index: true, element:<HomePage />},
        // {path: ":id", element: <MessagePage />},
        {path: "login", element: <LoginPage />},
        {path: "signup", element: <SignupPage />},
        // {path: "new_message", element: <NewMessagePage/>}
      ]
    }
  ])

  export default routesConfig