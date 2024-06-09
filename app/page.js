'use client';
import React, { useState } from 'react';
import "./login.css";
import {collection, getDocs, where} from 'firebase/firestore';

import { db } from './firebaseConfig';
import {query} from "express";


const LoginPage = (props) => {
// Destructure props to get the message

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const q = await getDocs(query(collection(db, 'Users'), where('username', '==', username)));
      if (!q.empty) {
        // Assuming you want to get the first document found
        const userData = q.docs[0].data();
        // Check if the password matches
        // @ts-ignore
        if (userData.password === password) {
          // Set user session data or perform authentication logic here
          // @ts-ignore
          sessionStorage.setItem('userId', userData.id);
          // Redirect to the dashboard page
          window.location.href = "/dashboard";
        } else {
          setError('Invalid credentials. Please try again.');
        }
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } catch (error) {
      console.error('Login failed:', error);
      setError('Failed to login. Please try again.');
    }
  };


  return (
      <div className="login-page">
        <div className="login-container">
          <div className="orange-bar"></div>
          <div className="school-image">
            <img
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAS0AAACnCAMAAABzYfrWAAAAw1BMVEX////bPTVgY2JVWFdcX15ZXFvaMCbaMintr61aXVzqmJbZKyH0yshTVlXaNCvwvbvjb2rnjYv19fXkfXnZKR7v7+9kZ2bh4eGqq6u1traPkZBOUlF+gH/z8/NJTUzOz8/FxsaHiYjJysrn5+dsb250d3ajpaTW1taUlpWnqKjYIhWxsrJ7fX28vb3roJ2cnZ3gX1nwubf55eT21NLeTkfkd3LfV1DtpqNBRUT87u3429rdRDzpk5DhZ2L66OffWVPYFgB8U878AAAR4ElEQVR4nO2cC3ebuBLHCUJpaSKnpcHYxsZgwODYlPS57Xbv3fv9P9XV6AGSIEnddGuvzf/0nNg8hPRjNBqN5FrW8enPP96+fvPyw6Gr8a/Qh/vby9HF6PL29bdDV+X4dU1RcY1GHw9dmWPXx7uLVrdDb3xcowtVnw5dnePWyyuN1u3NoSt01PqPblujz4eu0DHL02ENXfFRfbs1aF14h67SEeubaVvfD12jo9Yng9b9oSt01HqjG9flu0NX6Kj14U6jdTdMfh7Vm0sF1tVgWk/ovsV19frQlTl+vb3jvmt099ehq/Jv0MfXF7e3txef/zx0Rf4l+vbh44chLP1xDaz20M3VkAj8YV3fXVwNXusHdQMh6mBdP6YbnhF8MeD6AV3Lyc/QGYW+vfz86fv9uz4cN+1Msbczfvzr/vunt+//6Roekf64ZMtgL3qWDG/UfOBlB9eH+9sXEOdfjc6G1+uGyOi7sQZ2o+cgTOtqFxsvbt/+vgofUp+VNMNITyUbsExcf6qGd3sW08hrjciLN8qpm05aXu+M91qu8O4c1maNRbC7/zZnOpZlWNdH/fzoDPqiuaxz+VKeed8Hi+K6lhe8eWGcOkwLfqeu9dXo1kLed7uhgeveOHEGXfHGpCUSpL3dUOASnfFv4/jt6Uf7D9jWg5alWJfh8c7Btvr91qOwJK435trsYVvyW2T0J2YgT8CinQ5wXetXncWWEj2oYm7rSVgCl76SfXf6bovqXg0ErqhpvXwaFselGdflGYRbVN6XduoD29l+wLIkrj/agfPybLZIiCXD0e33jz9oWRLXzeiK3fri7s3TjzkV/fnmy8Xo02fYJ2nAGn1RvvytB+9sX+XL199H3/9+dfrBg6ZvPLVlwLp9/64ldPn+D+Msj7u+nev6mQnrpfVKofXSemecP+tdux3LsgxalmldZ4yrB5ZJa7AuKdNuWKrdpDXg4uqF1aVlXnd3lrj6uqHVR2uwrofddw+tDq6zWR2T6o+krH5anc54ZrgeDgx6aZ13ZzRgXSmN76d1zp3RgKVSeYiWevy8OqMBS1kDsx6mZa5+nIt1vTNTND9FC+aUZ6AOrJ+kdXF3BrjMbvjztM7AurqW9fO0Th5XH6yfp3XinbEX1jNonbR1vepfsHgGrRPG9QCsZ9E62c7Y3w2fS+tEreshy3ourZPEZcAaKXsa9qb1xZgznhwuA9bV9eeR8kW98Glao1fGZoBTs65XnfzU62fQemPuUT0tXCYsiud5tExcp9QZ3xm/sAA6z6Rl7sw5oXzXt0/qHkieg38uLd26Xtyf0N4IT8EldiI/m5a6C/rFaW3maq3rUqB5Pq12T+aL//yudvwmSVzNUtgvoCWt6+RgUTFc7Q8CfgUt/guryxOEZXlfRk03tH4RLTh6eZr/2433Rd2z/WtoWTf/O01YFJe6wf0X0bLUe09Xv4rWeWigtY8GWvtooLWPBlr7aKC1jwZa+2igtY8GWvtooLWPBlr7aKC1jwZa+2igtY8GWvtooLWPBlr7aKC1jwZa+2igtY8GWvtooLWPXl+OpO40WrfNcW0P281dc/zq/Gi9etvos7rO+P5ze1yleK0cP6GtbYMGDRo0aNCgQYMGDRo0aNCgQf+E2I+3vIXvL3pO+sVqtUy1I8bN6m+/PPhCSzJ/D+YFtJTAOJouV0VgXJcGQaA9zVqwW59qw++T7dgOImFIkJ1UGougtsMopP/ssmnCMpqol+Roq3yrkG1jWpKTTduD3jZDURRGEU6W7dEiDyM3jOy6eaI/zVEYfY1Cdz4VL85fj/mtzuxYgI1tO1sVxbKqbYKwwqKmX7fpYhFMbYRqcXCJSKXcPCex8m2JbDwtiqnjoFweq2xEysJf+HFOyFxSnxIy8T2/wqHEMEEEzeIiDeKEEH73BNPn0lvTKiNk1mf6v19j25mLjxtko0R89nLs5rLzzDHO+OcC2WHc3lyGir3ASQI8AmKjDT+0Dm1ciNNb4hD+OSCY22QxFudy5O6kmQXcYBPk2JJuiVxH9wEHUmY7khB0JVzyj3NsZ55ykcuRUiA2WjXH12FhtQoELShzxwuk3Nor1tjGrM2li0TbA/k0J2vLWcHRGtlO68PmjnrB4URbNmu+zBybtz+mZqaYDe1jvAcCLZs0Zyah6lCoTXFaiWOzti1oi8v2vOeIN5PZROtYUwrV8Ey0LKz4xJSCXv9M836xcpVWSkS/pN5srF4F3g3+UlqO3drLVqel2BajQo2JqGNc7dooZeex6v08u/UGUhQ4VkfROSV9BL+91mgBFbxgb9bVXqVsZxHFCbYbu+unRZnz45KxFBsGLNZ0rAybK6TTo/JCrVrU/LBm7IeSTqt0bBLwuq3Uqyp6ILYYLWuGms447aMVZMhmp33KvFZLoQfYw6g7s1E2lX577bKHqqI2rHZEDnpiHVw6rQlm3QxMSav/StQeaNERiuKK4XCHlp3t7DCP+fel2WTPtW0WHczB/WEiIjBqasQIECrTlAKT/GGUOz20qInptOBdQ1DAaMF4xb1+h5ZTT+o5HifMsa06tJquOUG0P9sOmfEqsO6vamvSkmZ5YOm0RKfo2JbsGUtGq8HV7YnQu5bECaHXdHoPuHMRt6ZrG+wLCTeGDFodV5Aeo21BxT1uYtqrjUXtBS2Oa9rvt1g/ghOd3gMG0kYUqwyGV4vFLUSfHjKznKoHOo7sMNJpIR5XdjwONTYWWEpawroeoOW7PDrCjSlx0WJR3H71MlpGwQ0ptjSloRap8WsK6+DSaEFz2Ct1jQhoLKLzVSiH+g0d13CGeqNT6p9YwEWDJqIGSZK51IrHwODvEkuXGXxQox9bh5c2JlJ/67APEz2upBRFjB82/WNCwO/02hb4Jyi0IFogRWN5PSCnPZOFDjuHR3OK6CSMKLZEY3lihGQHkTpPhNhbuKuxo77uTM4fq5aWtUYGLTmrhg+ItW1GR77Wf9euw+1jLWeJiPktMEoxsWTywKx3rmpcc8dVLjic2hyEV6L2Baa2g5rxbIaxqOs0VNwZ9V0araWktXMEFhpYtRgq4rjcghJhzaUj8mM0XMWNmwoyeE9ehnFj9GvkZkcw7xH5rWVRxDVCaNwa/2JHyJyxKHISyqFtQjbKvSXSaLGBLAhi2s4mfbAO0ZiFAuksJLmwqZDUvDAi7TcmLs7gOi+ow4g/DW5g9QnmJEyOApaFiIui6OvXiIyTWDsT70iExmMS4TZ1WYdaiFh+VWlVEXKjr1FEsnXbtqC2o3Cc4SicNwHUJKOHchTZrSvySxvytyiMyFzGLsUM01qNUUSSIxgOmXx/sfBBi+7bWxTVdlsVyonFQg8jCy0vL4oyIk0voKVMl3oWe7peT5faE72iquvNVC+R3VocRSJw0KBBgwYNGnTGKmhg5+xqHieuyskshg9xokUpZV1YXjIry3rCtKlnanicJms4Mt/Nk4kSBtWTkl/OSp9qAbU34wv+5brmEfmm3CQiWF0mOLTnE32mXG7WSXMkrmftdoFy5lnFeiJqttbKoK1YJWVZitPrMpnAOXpkRms724pWxhtx+5rPpSbqnIM9nVGhEwRUV9UuZOlKKw4xX0yuwkyNErOI0kIhocJUdJZD1BWoNHSxs0uSfEyvcWp5xsX0sOti8hWC6TXRslUk5MthGNu8Psjl6a5FHtqbapuF2kq2VRO3zSMkyhaBMqS4ixBjlz4LheOmjJiXEX+FeiNebQTzomXo4HxWz+kxkRmbwu0u3M5nvXmov6pVxF7CDPH17zhiNYUMFZsmVNryr7WjDfGWQZqmbJnK8/1UnU34RCaF/S12sFxSF3kqz0+B38bFatIL81zVzuErE5Cl5kvQGRYHIq3CQaikO4iSQHMhyVWI9d6Fn6plbIhnpQWtt186tpPSyUIa8Iuh+ou5IxbjKmxjuJFOJdh9DtaSibQ8+B4QmUHiU9FC5gUqPXGZNKxT0slUUh7K0nBKGWF+daal6Ta0RsrXscOMd+6INAOkp+FI1cy1jUR6brM0NmgJ2R5h+wEBawq01fGeMmjxtrT5QO4YWLgiPRcLWrI9oY1UTxQj9nKmWE/ABnKRPKb1UXJCs1D2y35aah4ccpm5aJ9KC+rbZlGsjC8eJzITBus08HfumOtdQsoKaglLuKIWEzKxTFqJg83JYS8tsOxMNFelZS4JjPnSHO0dWk5RoeXQtjW4ZqF8EtDSllNAHlaznLVrE3ZJ7ui0YNmhsfDMEQ0T10wFrayzqUHIx02y3Zm3ZpuzhSKdVu50yqC0xmobOK25oLXSaa1g2aDlDTvLwLnSF2obuXFBi9RgCtI5lA0tv5eWq9JKZaJ8Z9CqiYIr5859JhP7kha9Ke/PGiSOaPAyirfSVNIwEc9UaAEEw0D7aY1F8tqgRZ2vmkEf09cMKwRLWExod9gxWtLrs3MCV032oAWrpDavtEaLLGBNXnbG3QO01tSEnG1f9m4lhyBq6Y2JT/kYrtPadMvopUU7oMsav9Rpla66gLwNpzZfAchc6p/ITjZVoVWw/UOiM+5Fi61meIyWvSuo4pjT8vkWhtmjtHzosBgl3U0esLoBlunBYCHtNg8tQQtvC9ikCK1aEEdZ+n+QVoywQEJpuTG9fcV3g+4y32ly/R6aW2Kny2IHfdJBONZpVZSWFbgSV932RPQ0Ldj/A0+lXceJQMzpb8ATLBtcD9GygjFbtlfz1kL0hWNoZLTkS7QedETujVN6TwiP+hrzMnizxo2bMWjZdkad21xmacEw+O18d0+irCCvaTwwlu2rMnDoYgGi8VuMFtvIwXDtR2snbIt68DlsNC6WDS3mQFlnFLQ6Xh5aZvMqmZ5aBFVz8FiLkC0MTaNC0sIVPEvuoTbLMGjhKneVBVlasrtMaUWZbfmQ+Kew2QDgQzybt1usioSt7XldWgyXm/fSSrM5KF91aWVis5vut9Z8lFmF3LoeoUXNZ07Epoc0bx9jYdstrUVU8lcCMVBmCwCos0GrLaOHFgpoQ9ojut8KYOt1JdbpZhDQJGpLaETJ45eGlnxngcNw9dDyQwfEllV1WjDUJ320eH0KcPUJtZBHaPEAFOJs8RgektDYxJUvEhZY/UAs8PTRomXg1rgorWZywuMt6kNdWT2dVsyW1Ok7p0YcRFP+YGVqsxRbhgJk0GIOwcnnpEMrwGMQg6zTiuV+BT2CWMv5wJLFJvnjtJjjWOmP4V1xzhcbYbfEdBMJGEEfLRbxrh6iZc3cZgFUjyA2zATg2NrKXVG5sTLEunyi18x8ts2UNnWZv1StWK0WW+vRadEh0RYfVFp1M3sC63Icfs38IVqpcLNe+xhwJnYul/chqMokgX5aflvZtWIdYp7owVvjddJj+YQbJAztE766DuR8K5ChFub7BhpamzYBkDp2O0Nj76VTLW3ms202xevzxLKd1wMuQZS7H4WWLByMuBOl0h7R+GaYnDWzU51WUwZp9pnUXVrQo0TuQKclPjOXMZZ3UILVrHkYO7yUtOqwHfjA1be0esdEZVYN3lE4E51Wouw/WiG7tT8e10haM4E9xm53Nx/DLB8KXkk2UaellCErUDotrSbTQvsiTzZU6qzaw2L/M2xH4yXBjvKYQqlEnUO5e5GXU6o/KoGqKKNHl9aiydgECXJCmUqDTRJ+mophfafuelmGkpbYS9rMqjPeDVKnOzO22A8Vmuluomwzgu1sFTyrgGxkzhuR0v7uKxfLNjTb+RcwpVlxWm7hi2CHNrdpt/gEO4YndHiMZtVyg4gIBasQc6NKInVvXYGbMTEOUdjZ3JNGGJOIvusoClGb4cRwlMV8cMc4UimvQj6rHstsIHXD4FC9PAzralW32x401WHUMK9EChO0DDFi4WVEayrLiEjWlJEj1LzxirZhJduLoMAt/GUaQ/SLxYUzScELEWy6SLc72xnPKpk4Wk/XfHyuNOe0nMsnFdO46gTZfj2ptpP1er2ZLpXZ7HpSxUxbuGOq31exPuJttlvutUvp7oN1Tt1J2b+9PaimzdjkT6vmxQRb8ahq4jVl1EoZ0yqeKm3YysCiiitKZNneTr9U0lLSJuFMzx/DBrBGmfKTlkFPaItQ8vRVg0CTPDyGHdr/EtVldRy/t3xM/wdIg7VkqbtD6wAAAABJRU5ErkJggg=="
                alt="School Image"/>
          </div>
          <form onSubmit={handleLogin}>
            <div className="group">
              <label>Username:</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}/>
            </div>
            <div className="group">
              <label>Password:</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
            </div>
            <input type="submit" value="Login"/>
            {error && <p className="error-message">{error}</p>}

            <div className="forgot-password">
              <a href="/">Forgot password?</a>
              <a href="/dashboard">skip</a>
            </div>
          </form>
        </div>
      </div>
  );
};

export default LoginPage;
