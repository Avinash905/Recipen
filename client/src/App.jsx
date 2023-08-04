import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import {
  AddBlog,
  AddRecipe,
  Blogs,
  Contact,
  Dashboard,
  Error,
  Home,
  Profile,
  Recipe,
  SavedRecipes,
  SingleBlog,
  SingleRecipe,
} from "./pages";
import { SignIn, SignUp } from "./pages/auth";
import { RootLayout, DashboardLayout } from "./layouts";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/dashboard"
          element={<DashboardLayout />}
        >
          <Route
            index
            element={<Dashboard />}
          />
        </Route>
        <Route path="/auth">
          <Route
            path="signin"
            element={<SignIn />}
          />
          <Route
            path="signup"
            element={<SignUp />}
          />
        </Route>
        <Route
          path="/"
          element={<RootLayout />}
        >
          <Route
            index
            element={<Home />}
          />
          <Route path="recipe">
            <Route
              index
              element={<Recipe />}
            />
            <Route
              path=":id"
              element={<SingleRecipe />}
            />
            <Route
              path="saved"
              element={<SavedRecipes />}
            />
            <Route
              path="add"
              element={<AddRecipe />}
            />
          </Route>
          <Route
            path="contact"
            element={<Contact />}
          />
          <Route path="blog">
            <Route
              index
              element={<Blogs />}
            />
            <Route
              path=":id"
              element={<SingleBlog />}
            />
            <Route
              path="add"
              element={<AddBlog />}
            />
          </Route>
          <Route
            path="profile"
            element={<Profile />}
          />
          <Route
            path="/*"
            element={<Error />}
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
