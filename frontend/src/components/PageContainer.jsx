import BackButton from "./BackButton";

const PageContainer = ({ 
  children, 
  title, 
  subtitle,
  backTo = "/",
  backLabel = "Back to Chat",
  showBackButton = true,
  className = "",
  contentClassName = "" 
}) => {
  return (
    <div className={`min-h-screen bg-gradient-to-br from-primary to-secondary pt-20 ${className}`}>
      <div className={`max-w-4xl mx-auto p-4 py-8 ${contentClassName}`}>
        {showBackButton && (
          <div className="mb-6">
            <BackButton 
              to={backTo} 
              label={backLabel}
              className="text-base-100 hover:bg-white/10 border-white/20"
            />
          </div>
        )}
        
        {(title || subtitle) && (
          <div className="mb-8 text-center">
            {title && (
              <h1 className="text-2xl lg:text-3xl font-bold text-base-100 mb-2">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="text-base-100/80 text-lg">
                {subtitle}
              </p>
            )}
          </div>
        )}
        
        <div className="bg-base-100 rounded-2xl shadow-2xl border border-base-300 overflow-hidden">
          <div className="p-6 lg:p-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageContainer;