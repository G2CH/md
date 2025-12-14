import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { v4 as uuid } from 'uuid'
import DEFAULT_CONTENT from '@/assets/example/markdown.md?raw'

export interface Post {
  id: string
  title: string
  content: string
  history: {
    datetime: string
    content: string
  }[]
  createDatetime: string
  updateDatetime: string
  parentId?: string | null
  collapsed?: boolean
}

interface PostState {
  posts: Post[]
  currentPostId: string

  // Actions
  addPost: (title: string, parentId?: string | null) => void
  renamePost: (id: string, title: string) => void
  delPost: (id: string) => void
  updatePostParentId: (postId: string, parentId: string | null) => void
  updatePostContent: (id: string, content: string) => void
  setCurrentPostId: (id: string) => void
  collapseAllPosts: () => void
  expandAllPosts: () => void
  
  // Helpers (can be used in components)
  getPostById: (id: string) => Post | undefined
}

export const usePostStore = create<PostState>()(
  persist(
    (set, get) => ({
      posts: [
        {
          id: uuid(),
          title: '内容1',
          content: DEFAULT_CONTENT,
          history: [
            { datetime: new Date().toLocaleString('zh-cn'), content: DEFAULT_CONTENT },
          ],
          createDatetime: new Date().toISOString(),
          updateDatetime: new Date().toISOString(),
        }
      ],
      currentPostId: '',

      getPostById: (id) => get().posts.find(p => p.id === id),

      addPost: (title, parentId = null) => set((state) => {
        const newPost: Post = {
          id: uuid(),
          title,
          content: `# ${title}`,
          history: [{ datetime: new Date().toLocaleString('zh-cn'), content: `# ${title}` }],
          createDatetime: new Date().toISOString(),
          updateDatetime: new Date().toISOString(),
          parentId,
        }
        return { posts: [...state.posts, newPost], currentPostId: newPost.id }
      }),

      renamePost: (id, title) => set((state) => ({
        posts: state.posts.map(p => p.id === id ? { ...p, title, updateDatetime: new Date().toISOString() } : p)
      })),

      delPost: (id) => set((state) => {
        const idx = state.posts.findIndex(p => p.id === id)
        if (idx === -1) return {}
        
        const newPosts = [...state.posts]
        newPosts.splice(idx, 1)
        
        // Update current ID if deleted
        let newCurrentId = state.currentPostId
        if (state.currentPostId === id) {
           newCurrentId = newPosts[Math.min(idx, newPosts.length - 1)]?.id ?? ''
        }

        return { posts: newPosts, currentPostId: newCurrentId }
      }),

      updatePostParentId: (postId, parentId) => set((state) => ({
        posts: state.posts.map(p => p.id === postId ? { ...p, parentId, updateDatetime: new Date().toISOString() } : p)
      })),

      updatePostContent: (id, content) => set((state) => ({
        posts: state.posts.map(p => p.id === id ? { ...p, content, updateDatetime: new Date().toISOString() } : p)
      })),

      setCurrentPostId: (id) => set({ currentPostId: id }),

      collapseAllPosts: () => set((state) => ({
        posts: state.posts.map(p => ({ ...p, collapsed: true }))
      })),

      expandAllPosts: () => set((state) => ({
        posts: state.posts.map(p => ({ ...p, collapsed: false }))
      })),
    }),
    {
      name: 'md-post-storage',
      onRehydrateStorage: () => (state) => {
         if(state && (!state.currentPostId || !state.posts.some(p => p.id === state.currentPostId))) {
             state.currentPostId = state.posts[0]?.id || ''
         }
      }
    }
  )
)
