const ButtonLoader = ({className}: {className?: string}) => {
    return (
      <div className={`flex items-center justify-center`}>
        <div className={`animate-spin rounded-full border-solid border-t-transparent  ${className}`}></div>
      </div>
    );
  };
  
  export default ButtonLoader;
  