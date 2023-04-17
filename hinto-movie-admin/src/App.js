import './App.css';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Login from './Login';
import Listmovie from './components/ListMovie';
import AddMovieTicket from './components/AddMovieTicket';
import { ToastContainer } from 'react-toastify';


function App() {
  return (
    <div className="App">

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/listmovie" element={<Listmovie />}>
            <Route index element={<Listmovie />} />
          </Route>
          <Route path='/addmovie' element={<AddMovieTicket />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default App;
