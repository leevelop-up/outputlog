import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Layout from '@/components/layout/Layout'
import HomePage from '@/pages/HomePage'
import LoginPage from '@/pages/LoginPage'
import SignUpPage from '@/pages/SignUpPage'
import PostListPage from '@/pages/PostListPage'
import PostDetailPage from '@/pages/PostDetailPage'
import PostFormPage from '@/pages/PostFormPage'
import OAuthCallbackPage from '@/pages/OAuthCallbackPage'
import MyPage from '@/pages/MyPage'
import SetupProfilePage from '@/pages/SetupProfilePage'
import AdminPage from '@/pages/AdminPage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 1000 * 60 },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/posts" element={<PostListPage />} />
            <Route path="/posts/new" element={<PostFormPage />} />
            <Route path="/posts/:id" element={<PostDetailPage />} />
            <Route path="/posts/:id/edit" element={<PostFormPage />} />
            <Route path="/oauth-callback" element={<OAuthCallbackPage />} />
            <Route path="/mypage" element={<MyPage />} />
            <Route path="/setup-profile" element={<SetupProfilePage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
