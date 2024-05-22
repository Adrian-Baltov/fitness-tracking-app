import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useUser } from "../context/UserContext.jsx";

export default function Register() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
  });
  
  const [error, setError] = useState(null);
  const { user, register } = useAuth();
  const navigate = useNavigate();
  const { getUserByName, createUser, getUsers} = useUser();

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
      await createUser(form.username, credential.user.uid, credential.user.email, form.firstName, form.lastName, form.phone);
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
      <div className="login-label">Sign up to track your fitness progress!</div>
      <div className="login-border"></div>

      <div className="login-input-container">
        <div className="login-inputs">
          <label htmlFor="username">Username </label>
          <input className="login-input" value={form.username} onChange={updateForm('username')} type="text" name="username" id="username" />
        </div>
        <div className="login-inputs">
          <label htmlFor="firstName">First Name </label>
          <input className="login-input" value={form.firstName} onChange={updateForm('firstName')} type="text" name="firstName" id="firstName" />
        </div>
        <div className="login-inputs">
          <label htmlFor="lastName">Last Name </label>
          <input className="login-input" value={form.lastName} onChange={updateForm('lastName')} type="text" name="lastName" id="lastName" />
        </div>
        <div className="login-inputs">
          <label htmlFor="email">Email </label>
          <input className="login-input" value={form.email} onChange={updateForm('email')} type="text" name="email" id="email" />
        </div>
        <div className="login-inputs">
          <label htmlFor="password">Password </label>
          <input className="login-input" value={form.password} onChange={updateForm('password')} type="password" name="password" id="password" />
        </div>
        <div className="login-inputs">
          <label htmlFor="phone">Phone </label>
          <input className="login-input" value={form.phone} onChange={updateForm('phone')} type="text" name="phone" id="phone" />
        </div>

        <p
          onClick={registerUser}

        >
          Sign up
        </p>
      </div>
      {error && <p className="error">{error}</p>}
    </div>)
}