import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Card, { CardHeader, CardBody, CardFooter } from '../ui/Card';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const success = await login(email, password);
      if (!success) {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('An error occurred during login');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <h2 className="text-2xl font-bold text-center text-gray-800">
            Vilcom SOC Shift Management
          </h2>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit}>
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              fullWidth
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              fullWidth
            />
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            <div className="mt-6">
              <Button type="submit" fullWidth disabled={isLoading}>
                {isLoading ? 'Logging in...' : 'Log In'}
              </Button>
            </div>
          </form>
        </CardBody>
        <CardFooter className="text-center">
          <p className="text-sm text-gray-600">
            Demo Credentials:<br />
            Admin: admin@vilcom.com<br />
            Staff: alice@vilcom.com<br />
            Password: password
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginForm;