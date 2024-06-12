import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useUser } from "../context/UserContext.jsx";

export default function Register() {
  const { getUserByName, createUser, getUsers } = useUser();
  const [error, setError] = useState(null);
  const { user, register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    weight: '',
    height: '',
  });

  useEffect(() => {
    if (user) {
      navigate(location.state?.from.pathname || '/');
    }
  }, [user]);

  const updateForm = prop => e => {
    setForm({
      ...form,
      [prop]: e.target.value,
    });
  };

  const isValidEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const isValidName = (name) => {
    return name.length >= 4 && name.length <= 34;
  };

  const isValidPhone = (phone) => {
    return phone.length === 10;
  }

  const isValidUsername = (username) => {
    return username.length >= 2 && username.length <= 20;
  }
  const isPhoneNumberUnique = async (phone) => {
    let result = false;
    const users = await getUsers();
    users.forEach((user) => {
      if (user[1].phone === phone) {
        result = true;
      }
    });
    return result;
  }
  const registerUser = async () => {
    setError(null);

    if (!form.username || !form.email || !form.password || !form.phone) {
      setError("All fields are required.");
      return;
    }

    if (!isValidEmail(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (!isValidName(form.firstName)) {
      setError('First name must be between 4 and 34 symbols.');
      return;
    }

    if (!isValidName(form.lastName)) {
      setError('Last name must be between 4 and 34 symbols.');
      return;
    }

    if (!isValidPhone(form.phone)) {
      setError('Phone number must be 10 digits.');
      return;
    }

    if (!isValidUsername(form.username)) {
      setError('Username must be between 2 and 20 symbols.');
      return;
    }

    if (await isPhoneNumberUnique(form.phone)) {
      setError('Phone number is already in use.');
      return;
    }

    try {
      const user = await getUserByName(form.username);
      if (user.exists()) {
        setError("User with this username already exists.");
        return;
      }

      const credential = await register(form.email, form.password);
      await createUser(form.username, credential.user.uid, credential.user.email, form.firstName, form.lastName, form.phone, form.weight, form.height);
      navigate('/');
    } catch (error) {
      if (error.message.includes('auth/email-already-in-use')) {
        setError("User with this email has already been registered.");
      } else {
        setError("An error occurred during registration. Please try again.");
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-label mt-3 text-3x1 block text-center font-semibold">Sign up to track your fitness progress!</div>
      <div className="login-border"></div>

      <div className="login-input-container">
        <div className="login-inputs mt-3">
          <label className="input input-bordered flex items-center gap-2">
            Username
            <input className="login-input" value={form.username} onChange={updateForm('username')} type="text" name="username" id="username" placeholder="Type here..." />
          </label>
        </div>
        <div className="login-inputs mt-3">
          <label className="input input-bordered flex items-center gap-2">
            First Name
            <input className="login-input" value={form.firstName} onChange={updateForm('firstName')} type="text" name="firstName" id="firstName" placeholder="Type here..." />
          </label>
        </div>
        <div className="login-inputs mt-3">
          <label className="input input-bordered flex items-center gap-2">
            Last Name
            <input className="login-input" value={form.lastName} onChange={updateForm('lastName')} type="text" name="lastName" id="lastName" placeholder="Type here..." />
          </label>
        </div>
        <div className="login-inputs mt-3">
          <label className="input input-bordered flex items-center gap-2">
            Email
            <input className="login-input" value={form.email} onChange={updateForm('email')} type="text" name="email" id="email" placeholder="Type here..." />
          </label>
        </div>
        <div className="login-inputs mt-3">
          <label className="input input-bordered flex items-center gap-2">
            Password
            <input className="login-input" value={form.password} onChange={updateForm('password')} type="password" name="password" id="password" placeholder="Type here..." />
          </label>
        </div>
        <div className="login-inputs mt-3">
          <label className="input input-bordered flex items-center gap-3">Phone
            <input className="login-input" value={form.phone} onChange={updateForm('phone')} type="text" name="phone" id="phone" placeholder="Type here..." />
          </label>
        </div>
        <div className="login-inputs mt-3">
          <label className="input input-bordered flex items-center gap-3">
            Weight <i>(in kg)</i>
            <input className="login-input" value={form.weight} onChange={updateForm('weight')} type="text" name="weight" id="weight" placeholder="Type here..." />
          </label>
        </div>
        <div className="login-inputs mt-3">
          <label className="input input-bordered flex items-center gap-3">Height <i>(in cm)</i>
            <input className="login-input" value={form.height} onChange={updateForm('height')} type="text" name="height" id="height" placeholder="Type here..." />
          </label>
        </div>
        <button
          onClick={registerUser}
          className="inline-block mt-3 cursor-pointer rounded-md bg-gray-800 px-4 py-3 text-center text-sm font-semibold uppercase text-white transition duration-200 ease-in-out hover:bg-gray-900"
        >
          Sign up
        </button>
      </div>
      {error && <div role="alert" className="alert alert-warning mt-3 mb-3">
        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
        <span>{error}</span>
      </div>}
    </div>)
}
