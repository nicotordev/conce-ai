import { FiBookOpen, FiGlobe, FiMessageCircle, FiZap } from "react-icons/fi";

const appConstants = {
  suggestions: [
    {
      icon: <FiZap className="text-yellow-500" />,
      label: "Explica un concepto técnico",
      bg: "bg-yellow-100 hover:bg-yellow-200",
    },
    {
      icon: <FiMessageCircle className="text-blue-500" />,
      label: "Dame ideas para redes sociales",
      bg: "bg-blue-100 hover:bg-blue-200",
    },
    {
      icon: <FiBookOpen className="text-green-600" />,
      label: "Resume esta noticia",
      bg: "bg-green-100 hover:bg-green-200",
    },
    {
      icon: <FiGlobe className="text-purple-600" />,
      label: "Traduce este texto",
      bg: "bg-purple-100 hover:bg-purple-200",
    },
  ],
};

export default appConstants;
