import { FaTasks } from 'react-icons/fa';

const Header = () => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-lg">
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0">
          <FaTasks className="text-3xl" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">TaskBot</h1>
          <p className="text-sm opacity-90">Asistente para elaboración de tareas, ideas y estrategias</p>
        </div>
      </div>
    </div>
  );
};

export default Header;
