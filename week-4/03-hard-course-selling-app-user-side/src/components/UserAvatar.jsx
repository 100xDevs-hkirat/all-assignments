import { Avatar, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
const UserAvatar = ({ user, setisLoggedIn }) => {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem('token');
    setisLoggedIn(false);
    navigate('/', { replace: true });
  };
  return (
    <Menu>
      <MenuButton variant='ghost' aria-label='Courses' fontWeight='normal'>
        <Avatar size={'sm'} name={user} />
      </MenuButton>
      <MenuList>
        <MenuItem icon={<Avatar size={'xs'} />}>{user}</MenuItem>
        <MenuItem onClick={logout}>Logout</MenuItem>
      </MenuList>
    </Menu>
  );
};

export default UserAvatar;
