// import React from 'react'

// export default function Loader() {
//   return (
//      <div className="flex items-center justify-center min-h-screen">
//         <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16"></div>
//       </div>
//   )
// }


import { Spin } from 'antd';

export default function Spinner() {
  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center' 
    }}>
      <Spin size="large" />
    </div>
  );
}
