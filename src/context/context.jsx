import React, { createContext, useState } from "react";
export const AuthUserContext = createContext();

const AuthState = (props) => {
 const [walletAddress,setWalletAddress] = useState('')
  return (
    <AuthUserContext.Provider
      value={{
        setWalletAddress,
        walletAddress,
      }}
    >
      {props.children}
    </AuthUserContext.Provider>
  );
};
export default AuthState;