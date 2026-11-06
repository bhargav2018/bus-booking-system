import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Wrapper from "./travels/Wrapper.jsx";
import Bus from "./travels/Bus.jsx";
import Busdetail from "./travels/Busdetail.jsx";
import Loginform from "./travels/Loginform.jsx";
import Register from "./travels/Register.jsx";
import Userbooking from "./travels/Userbooking.jsx";

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [userid, setUserid] = useState(localStorage.getItem("userid"));
  const [username, setUsername] = useState(
    localStorage.getItem("username") || ""
  );

  const onLogin = (t, id, name) => {
    localStorage.setItem("token", t);
    localStorage.setItem("userid", id);
    localStorage.setItem("username", name);

    setToken(t);
    setUserid(id);
    setUsername(name);
  };

  const handlelogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userid");
    localStorage.removeItem("username");

    setToken(null);
    setUserid(null);
    setUsername("");
  };

  return (
    <Wrapper token={token} handlelogout={handlelogout}>
      <Routes>
        <Route path="/" element={<Navigate to="/buses" replace />} />
        <Route path="/buses" element={<Bus username={username} />}/>
        <Route path="/busdetail/:busid" element={<Busdetail token={token} />} />
        <Route path="/login" element={<Loginform onLogin={onLogin} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/booking" element={token ? (<Userbooking token={token} userid={userid} />
            ) : (<Navigate to="/login" replace />)}/>
      </Routes>
    </Wrapper>
  );
};

export default App;
