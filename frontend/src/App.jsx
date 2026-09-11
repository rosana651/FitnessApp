import { useState } from 'react'
import { BrowserRouter,Routes, Route, Navigate } from 'react-router-dom'

import WorkoutPage from './pages/WorkoutPage'
import HistoryPage from './pages/HistoryPage'
import WorkoutResultPage from './pages/WorkoutResultPage'
import HomePage from './pages/HomePage'

import AuthPage from './pages/AuthPage'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<AuthPage />} />
          <Route path="/workouts" element={<WorkoutPage />} />
          <Route path="/workouts/:id" element={<WorkoutResultPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/" element={<HomePage />} />      
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
