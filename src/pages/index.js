const { useRouter } = require("next/router");
const { useEffect } = require("react");
import "bootstrap/dist/css/bootstrap.min.css";


const HomePage = () =>{
  const router = useRouter();

  useEffect(()=>{
    router.push('/login')
  })

  return null;
}
export default HomePage;