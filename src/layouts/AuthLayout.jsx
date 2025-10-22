import { Outlet } from 'react-router-dom'

export default function AuthLayout(){
  return (
    <div className="min-h-screen grid place-items-center bg-lightgray">
      <div className="w-full max-w-md p-6 card">
        <Outlet />
      </div>
    </div>
  )
}
