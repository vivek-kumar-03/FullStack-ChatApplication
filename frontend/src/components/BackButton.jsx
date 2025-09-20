import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BackButton = ({ 
  to = null, 
  label = "Back", 
  className = "", 
  showOnDesktop = true,
  onClick = null 
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onClick) {
      onClick();
    } else if (to) {
      navigate(to);
    } else {
      navigate(-1); // Go back to previous page
    }
  };

  return (
    <button
      onClick={handleBack}
      className={`
        flex items-center gap-2 p-3 hover:bg-white/10 rounded-lg transition-all duration-200
        bg-white/5 backdrop-blur-sm border border-white/20 shadow-lg
        ${showOnDesktop ? '' : 'lg:hidden'}
        ${className}
      `}
      title={label}
    >
      <ArrowLeft size={18} className="text-current" />
      <span className="text-sm font-medium text-current hidden sm:block">
        {label}
      </span>
    </button>
  );
};

export default BackButton;