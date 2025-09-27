import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import google from '@/assets/google.svg';
import { useAuth } from '@/lib/auth-context';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';

export default () => {
  const { user, loginWithGoogle, logout } = useAuth();

  return user ? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <img src={user.photoURL!} alt="avatar" className="w-4 h-4 rounded-full" />
          {user.displayName}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <Link to="/vocab">
          <DropdownMenuItem>生词本</DropdownMenuItem>
        </Link>
        <DropdownMenuItem onClick={logout}>退出</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    <Button variant="outline" size="sm" onClick={loginWithGoogle} className="cursor-pointer">
      <img src={google} alt="Google" className="w-4 h-4" />
      登录
    </Button>
  );
};
