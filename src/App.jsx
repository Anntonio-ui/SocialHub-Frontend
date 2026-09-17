import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom'

import MainLayout from './layouts/MainLayout'
import Dashboard from './pages/Dashboard'
import Posts from './pages/Posts'
import PostDetail from './pages/PostDetail'

function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/posts" element={<Posts />} />
          <Route path="/posts/:id" element={<PostDetail />} />

          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  )
}

export default App