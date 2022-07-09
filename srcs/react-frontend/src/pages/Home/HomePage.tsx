import react, { useEffect } from 'react';
import "./HomePage.css";

function HomePage() {
	useEffect(() => {
		document.title = "Home";  
	}, []);
  return (
    <>
		HomePage
    </>
  );
}

export default HomePage;
